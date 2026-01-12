import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { env } from './config.js';
import { PageSnapshot } from './types.js';
import { logger } from './logger.js';

type EvidenceMap = Map<string, { screenshotKey?: string; htmlKey?: string }>;

let s3: S3Client | null = null;

function ensureS3(): S3Client | null {
  if (s3) return s3;
  if (!env.S3_BUCKET || !env.S3_REGION || !env.S3_ENDPOINT || !env.S3_ACCESS_KEY_ID || !env.S3_SECRET_ACCESS_KEY) {
    logger.info('S3 not configured; skipping artifact upload');
    return null;
  }
  s3 = new S3Client({
    region: env.S3_REGION,
    endpoint: env.S3_ENDPOINT,
    forcePathStyle: true,
    credentials: {
      accessKeyId: env.S3_ACCESS_KEY_ID,
      secretAccessKey: env.S3_SECRET_ACCESS_KEY
    }
  });
  return s3;
}

export async function storeSnapshots(
  snapshots: PageSnapshot[],
  scanId: string
): Promise<EvidenceMap> {
  const client = ensureS3();
  const map: EvidenceMap = new Map();
  if (!client) return map;

  for (const snapshot of snapshots) {
    const safeKey = snapshot.url.replace(/[^a-zA-Z0-9-_]/g, '_').slice(0, 120);
    const baseKey = `scans/${scanId}/${safeKey}`;
    let screenshotKey: string | undefined;
    let htmlKey: string | undefined;

    if (snapshot.screenshotBase64) {
      try {
        const buf = Buffer.from(snapshot.screenshotBase64, 'base64');
        screenshotKey = `${baseKey}.png`;
        await client.send(
          new PutObjectCommand({
            Bucket: env.S3_BUCKET,
            Key: screenshotKey,
            Body: buf,
            ContentType: 'image/png'
          })
        );
      } catch (err) {
        logger.warn(
          { err, bucket: env.S3_BUCKET, key: `${baseKey}.png`, endpoint: env.S3_ENDPOINT },
          'failed to upload screenshot; continuing without S3 evidence'
        );
        screenshotKey = undefined;
      }
    }

    if (snapshot.html) {
      try {
        htmlKey = `${baseKey}.html`;
        await client.send(
          new PutObjectCommand({
            Bucket: env.S3_BUCKET,
            Key: htmlKey,
            Body: snapshot.html,
            ContentType: 'text/html; charset=utf-8'
          })
        );
      } catch (err) {
        logger.warn(
          { err, bucket: env.S3_BUCKET, key: `${baseKey}.html`, endpoint: env.S3_ENDPOINT },
          'failed to upload HTML snapshot; continuing without S3 evidence'
        );
        htmlKey = undefined;
      }
    }

    map.set(snapshot.url, { screenshotKey, htmlKey });
  }

  return map;
}

