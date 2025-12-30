import { chromium } from 'playwright';
import { PageSnapshot } from './types.js';
import { logger } from './logger.js';

interface CrawlOptions {
  maxPages?: number;
  sameOriginOnly?: boolean;
}

export async function crawlSite(
  startUrl: string,
  options: CrawlOptions = {}
): Promise<PageSnapshot[]> {
  const maxPages = options.maxPages ?? 5;
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const visited = new Set<string>();
  const queue: string[] = [startUrl];
  const snapshots: PageSnapshot[] = [];
  const origin = new URL(startUrl).origin;

  try {
    while (queue.length && snapshots.length < maxPages) {
      const url = queue.shift()!;
      if (visited.has(url)) continue;
      visited.add(url);

      const page = await context.newPage();
      logger.debug({ url }, 'crawling page');
      try {
        await page.goto(url, { waitUntil: 'networkidle' });
        const html = await page.content();
        const screenshot = await page.screenshot({ fullPage: true, type: 'png' });

        snapshots.push({
          url,
          html,
          screenshotBase64: screenshot.toString('base64')
        });

        if (snapshots.length >= maxPages) {
          await page.close();
          break;
        }

        const links = await page.evaluate(() => {
          // eslint-disable-next-line no-undef
          return Array.from(document.querySelectorAll('a[href]'))
            .map((a) => (a as HTMLAnchorElement).href)
            .filter(Boolean);
        });

        for (const link of links) {
          try {
            const normalized = new URL(link, url).href;
            if (options.sameOriginOnly && new URL(normalized).origin !== origin) continue;
            if (!visited.has(normalized) && queue.length + snapshots.length < maxPages + 5) {
              queue.push(normalized);
            }
          } catch {
            // ignore malformed URLs
          }
        }
      } catch (err) {
        logger.error({ err, url }, 'crawl failed');
      } finally {
        await page.close();
      }
    }
  } finally {
    await context.close();
    await browser.close();
  }

  return snapshots;
}

