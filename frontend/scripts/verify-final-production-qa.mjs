// Reproducible local-build checks for the merged frontend. This does not test
// the public custom domain or submit forms to a production backend.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { default: AxeBuilder } = require(process.env.AXE_MODULE || '@axe-core/playwright');
const origin = 'http://127.0.0.1:3037';
const paths = process.env.QA_PATHS ? JSON.parse(process.env.QA_PATHS) : ['/', '/about', '/expertise', '/work', '/leadership',
  '/careers/software', '/careers/mechanical', '/careers/electronics',
  '/contact', '/apply', '/privacy', '/terms'];
const widths = process.env.QA_WIDTHS ? JSON.parse(process.env.QA_WIDTHS) : [320, 375, 390, 414, 768, 960, 1440];
const output = process.env.QA_OUTPUT_DIR || 'qa-final-production';
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-H', '127.0.0.1', '-p', '3037'], { stdio: 'ignore' });
let browser;

try {
  await mkdir(output, { recursive: true });
  let ready = false;
  for (let i = 0; i < 100; i++) {
    try { ready = (await fetch(origin)).ok; } catch { /* startup */ }
    if (ready) break;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.ok(ready, 'Local production build starts');
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_EXECUTABLE || undefined, headless: true, args: ['--no-sandbox'] });
  const results = [];
  const localLinks = new Set();
  for (const width of widths) {
    const context = await browser.newContext({ viewport: { width, height: width < 768 ? 844 : 900 }, reducedMotion: 'reduce' });
    await context.addCookies([{ name: 'omoikane_cookie_consent', value: 'v1-essential', url: origin }]);
    const page = await context.newPage();
    let errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const path of paths) {
      errors = [];
      const response = await page.goto(origin + path, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(300);
      const dom = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        h1: document.querySelectorAll('main h1').length,
        brokenImages: [...document.querySelectorAll('main img')].filter(img => img.complete && img.naturalWidth === 0).map(img => img.currentSrc),
        brokenAnchors: [...document.querySelectorAll('a[href^="#"]')].map(a => a.hash.slice(1)).filter(id => id && !document.getElementById(id)),
        localLinks: [...document.querySelectorAll('a[href^="/"]')].map(a => a.pathname),
      }));
      for (const link of dom.localLinks) localLinks.add(link);
      delete dom.localLinks;
      let axe = [];
      if ([375, 1440].includes(width)) {
        // Check the settled state after the approved entrance animations finish.
        await page.waitForTimeout(1200);
        const checked = await new AxeBuilder({ page }).include('main').include('header').include('footer').analyze();
        axe = checked.violations.map(v => ({ id: v.id, impact: v.impact, count: v.nodes.length, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) }));
        if (process.env.QA_SCREENSHOTS === '1' && ['/', '/leadership'].includes(path)) {
          await page.screenshot({ path: `${output}/${path === '/' ? 'home' : 'leadership'}-${width}.jpeg`, type: 'jpeg', quality: 65 });
        }
      }
      const row = { width, path, status: response.status(), ...dom, errors: [...errors], axe };
      results.push(row);
      if (row.status !== 200 || row.overflow || row.brokenImages.length || row.errors.length || row.h1 !== 1 || row.brokenAnchors.length) {
        await page.screenshot({ path: `${output}/defect-${width}-${path.replaceAll('/', '_') || 'home'}.png`, fullPage: true });
      }
      console.log(JSON.stringify({ width, path, status: row.status, overflow: row.overflow, errors: row.errors.length, seriousAxe: axe.filter(v => ['serious', 'critical'].includes(v.impact)) }));
    }
    await context.close();
  }
  const failures = results.filter(r => r.status !== 200 || r.overflow || r.brokenImages.length || r.errors.length || r.h1 !== 1 || r.brokenAnchors.length);
  const serious = results.filter(r => r.axe.some(v => ['serious', 'critical'].includes(v.impact)));
  const linkResults = [];
  for (const path of [...localLinks].sort()) {
    const response = await fetch(origin + path, { redirect: 'follow' });
    linkResults.push({ path, status: response.status });
  }
  const linkFailures = linkResults.filter(r => r.status >= 400);
  await writeFile(`${output}/route-matrix.json`, JSON.stringify({ source: 'local QA-branch production build; NOT the public custom domain', baseMainSha: process.env.QA_SHA || 'set QA_SHA', results, failures, serious, linkResults, linkFailures }, null, 2));
  console.log(`LOCAL ROUTE MATRIX: ${results.length} checks; ${failures.length} route failures; ${serious.length} pages with serious/critical axe findings; ${linkResults.length} local destinations, ${linkFailures.length} failures`);
  assert.deepEqual(failures, []);
  assert.deepEqual(serious, []);
  assert.deepEqual(linkFailures, []);
} finally {
  await browser?.close();
  server.kill();
}
