import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { enqueueScan } from '../queue.js';
import { createScan, getScan } from '../store.js';
import { buildJsonExport, generatePdfReport } from '../reporting.js';
import { env } from '../config.js';
import { logger } from '../logger.js';
import { getAllStates, getStateProfile, getHighRiskStates, STATE_DATA_LAST_VERIFIED, STATE_DATA_DISCLAIMER } from '../stateRequirements.js';
import { BusinessType } from '../types.js';

const businessTypes: BusinessType[] = ['government', 'publicAccommodation', 'education', 'healthcare', 'financial', 'other'];

const requestSchema = z.object({
  siteUrl: z.string().url(),
  maxPages: z.number().int().positive().max(env.SCAN_MAX_PAGES).optional(),
  stateCode: z.string().length(2).toUpperCase().optional(),
  businessType: z.enum(['government', 'publicAccommodation', 'education', 'healthcare', 'financial', 'other']).optional()
});

const routes: FastifyPluginAsync = async (app: FastifyInstance) => {
  // Get available states for jurisdiction-specific scanning
  app.get('/states', async (_req, reply) => {
    const states = getAllStates().map(s => ({
      code: s.code,
      name: s.name,
      riskMultiplier: s.riskMultiplier,
      litigationTrend: s.litigationTrend,
      requirementCount: s.requirements.length
    }));
    return reply.send({
      states,
      businessTypes: businessTypes.map(t => ({
        value: t,
        label: t === 'publicAccommodation' ? 'Public Accommodation / Retail' :
               t.charAt(0).toUpperCase() + t.slice(1)
      })),
      highRiskStates: getHighRiskStates().map(s => s.code),
      lastVerified: STATE_DATA_LAST_VERIFIED,
      disclaimer: STATE_DATA_DISCLAIMER
    });
  });

  // Get details for a specific state
  app.get('/states/:code', async (req, reply) => {
    const stateCode = (req.params as { code: string }).code.toUpperCase();
    const state = getStateProfile(stateCode);
    if (!state) {
      return reply.status(404).send({ error: 'State not found' });
    }
    return reply.send(state);
  });

  app.post('/scans', async (req, reply) => {
    const parsed = requestSchema.safeParse(req.body);
    if (!parsed.success) {
      logger.warn({ error: parsed.error.flatten() }, 'scan request validation failed');
      return reply.status(400).send({ error: parsed.error.flatten() });
    }

    const { siteUrl, maxPages, stateCode, businessType } = parsed.data;
    const pages = Math.min(maxPages ?? env.SCAN_MAX_PAGES, env.SCAN_MAX_PAGES);
    const scan = createScan(siteUrl);
    logger.info({ scanId: scan.id, siteUrl, maxPages: pages, stateCode, businessType }, 'scan request accepted');
    await enqueueScan(scan.id, siteUrl, pages, stateCode, businessType);
    return reply.status(202).send({ id: scan.id, status: scan.status, stateCode, businessType });
  });

  app.get('/scans/:id', async (req, reply) => {
    const scan = getScan((req.params as { id: string }).id);
    if (!scan) return reply.status(404).send({ error: 'Scan not found' });
    return reply.send(scan);
  });

  app.get('/scans/:id/export', async (req, reply) => {
    const scan = getScan((req.params as { id: string }).id);
    if (!scan) return reply.status(404).send({ error: 'Scan not found' });
    return reply.send(buildJsonExport(scan));
  });

  app.get('/scans/:id/report.pdf', async (req, reply) => {
    const scan = getScan((req.params as { id: string }).id);
    if (!scan) return reply.status(404).send({ error: 'Scan not found' });
    const pdf = await generatePdfReport(scan);
    reply.header('Content-Type', 'application/pdf');
    reply.header('Content-Disposition', `attachment; filename=scan-${scan.id}.pdf`);
    return reply.send(pdf);
  });
};

export default routes;

