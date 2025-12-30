import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { enqueueScan } from '../queue.js';
import { createScan, getScan } from '../store.js';
import { buildJsonExport, generatePdfReport } from '../reporting.js';
import { env } from '../config.js';

const requestSchema = z.object({
  siteUrl: z.string().url(),
  maxPages: z.number().int().positive().max(env.SCAN_MAX_PAGES).optional()
});

const routes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.post('/scans', async (req, reply) => {
    const parsed = requestSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.flatten() });
    }

    const { siteUrl, maxPages } = parsed.data;
    const pages = Math.min(maxPages ?? env.SCAN_MAX_PAGES, env.SCAN_MAX_PAGES);
    const scan = createScan(siteUrl);
    await enqueueScan(scan.id, siteUrl, pages);
    return reply.status(202).send({ id: scan.id, status: scan.status });
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

