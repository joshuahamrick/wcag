import type { Page } from 'playwright';
import { PageSnapshot } from './types.js';
import { logger } from './logger.js';
import { env } from './config.js';

// Lazy-load playwright to reduce startup memory
let playwrightModule: typeof import('playwright') | null = null;
async function getPlaywright() {
  if (!playwrightModule) {
    playwrightModule = await import('playwright');
  }
  return playwrightModule;
}

interface CrawlOptions {
  maxPages?: number;
  sameOriginOnly?: boolean;
  pageLoadTimeoutMs?: number;
  retryCount?: number;
}

async function loadPageWithRetry(
  page: Page,
  url: string,
  timeoutMs: number,
  maxRetries: number
): Promise<boolean> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Use 'domcontentloaded' with timeout instead of 'networkidle' to avoid hanging on chatty pages
      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: timeoutMs
      });
      // Brief additional wait for JS-rendered content, but with a hard cap
      await page.waitForLoadState('load', { timeout: Math.min(timeoutMs / 2, 5000) }).catch(() => {
        // Ignore load state timeout - domcontentloaded is sufficient
      });
      return true;
    } catch (err) {
      const isLastAttempt = attempt === maxRetries;
      logger.warn(
        { err, url, attempt, maxRetries },
        isLastAttempt ? 'page load failed after all retries' : 'page load failed, retrying'
      );
      if (isLastAttempt) return false;
      // Brief delay before retry
      await new Promise((r) => setTimeout(r, 500 * attempt));
    }
  }
  return false;
}

export async function crawlSite(
  startUrl: string,
  options: CrawlOptions = {}
): Promise<PageSnapshot[]> {
  const maxPages = options.maxPages ?? 5;
  const pageLoadTimeoutMs = options.pageLoadTimeoutMs ?? env.PAGE_LOAD_TIMEOUT_MS;
  const retryCount = options.retryCount ?? env.PAGE_RETRY_COUNT;
  const { chromium } = await getPlaywright();
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
        const loaded = await loadPageWithRetry(page, url, pageLoadTimeoutMs, retryCount);
        if (!loaded) {
          logger.warn({ url }, 'skipping page after failed retries');
          continue;
        }

        const html = await page.content();
        const screenshot = await page.screenshot({ fullPage: true, type: 'png', timeout: 10000 });

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

