import PDFDocument from 'pdfkit';
import { ScanResult } from './types.js';

export function generatePdfReport(scan: ScanResult): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ autoFirstPage: true });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk as Buffer));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(18).text('WCAG Compliance Report', { underline: true });
    doc.moveDown();
    doc.fontSize(12).text(`Site: ${scan.siteUrl}`);
    doc.text(`Scan ID: ${scan.id}`);
    doc.text(`Started: ${scan.startedAt.toISOString()}`);
    doc.text(`Completed: ${scan.completedAt?.toISOString() ?? 'n/a'}`);
    doc.text(`Pages scanned: ${scan.pageCount}`);
    if (scan.riskScore !== undefined) {
      doc.text(`Risk score: ${scan.riskScore}/100`);
    }
    doc.moveDown();
    doc.text('Disclaimer: Automated + AI-assisted, not legal advice.');
    doc.text(
      'Methodology: Automated rules (axe-core/Pa11y) + AI interpretation. Human review required for subjective WCAG checks.'
    );
    doc.moveDown();

    doc.fontSize(14).text('Findings');
    doc.moveDown(0.5);

    scan.issues.forEach((issue, idx) => {
      doc.fontSize(12).text(`${idx + 1}. ${issue.title}`);
      doc.fontSize(10).text(`Page: ${issue.pageUrl}`);
      if (issue.wcagId) doc.text(`WCAG: ${issue.wcagId}`);
      doc.text(`Severity: ${issue.severity}`);
      doc.text(`Confidence: ${(issue.confidence * 100).toFixed(0)}%`);
      doc.text(`Needs review: ${issue.needsReview ? 'Yes' : 'No'}`);
      if (issue.screenshotKey) doc.text(`Screenshot: ${issue.screenshotKey}`);
      if (issue.htmlKey) doc.text(`HTML snapshot: ${issue.htmlKey}`);
      doc.text(`Why: ${issue.description}`);
      doc.text(`Fix: ${issue.recommendation}`);
      doc.moveDown();
    });

    doc.end();
  });
}

export function buildJsonExport(scan: ScanResult) {
  return {
    id: scan.id,
    siteUrl: scan.siteUrl,
    status: scan.status,
    startedAt: scan.startedAt,
    completedAt: scan.completedAt,
    pageCount: scan.pageCount,
    riskScore: scan.riskScore,
    issues: scan.issues
  };
}

