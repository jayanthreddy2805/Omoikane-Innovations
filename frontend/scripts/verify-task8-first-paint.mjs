import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const origin = 'http://127.0.0.1:3028';
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-H', '127.0.0.1', '-p', '3028'], { stdio: 'ignore' });
let browser;

try {
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    try { ready = (await fetch(origin)).ok; } catch { /* Server is starting. */ }
    if (ready) break;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.ok(ready, 'Production server started');

  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_EXECUTABLE || undefined, headless: true, args: ['--no-sandbox'] });
  for (const width of [375, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, javaScriptEnabled: false });
    for (const [path, selector] of [
      ['/careers/software', 'main img[alt="SOFTWARE Engineering"]'],
      ['/contact', 'main p[class*="enquiryText"]'],
    ]) {
      await page.goto(origin + path, { waitUntil: 'load' });
      const target = page.locator(selector);
      await target.waitFor();
      await page.waitForTimeout(1450);
      const state = await target.evaluate(element => {
        let opacity = 1;
        for (let node = element; node; node = node.parentElement) opacity *= Number(getComputedStyle(node).opacity);
        return {
          opacity,
          imageLoaded: element.tagName !== 'IMG' || (element.complete && element.naturalWidth > 0),
          bounds: element.getBoundingClientRect().toJSON(),
        };
      });
      assert.ok(state.imageLoaded, `Hero image loaded without hydration: ${path}`);
      assert.ok(state.opacity > 0.99, `Content visible without hydration: ${path}, opacity ${state.opacity}`);
      assert.ok(state.bounds.width > 0 && state.bounds.height > 0, `Content has bounds: ${path}`);
      console.log(`PASS ${width}px ${path}: rendered without JavaScript`);
    }
    await page.close();

    const reducedPage = await browser.newPage({ viewport: { width, height: 900 }, javaScriptEnabled: false, reducedMotion: 'reduce' });
    for (const [path, selector] of [
      ['/careers/software', 'main img[alt="SOFTWARE Engineering"]'],
      ['/contact', 'main p[class*="enquiryText"]'],
    ]) {
      await reducedPage.goto(origin + path, { waitUntil: 'load' });
      const state = await reducedPage.locator(selector).evaluate(element => {
        const animated = element.closest('[class*="heroVisual"], [class*="introReveal"]');
        return { animation: getComputedStyle(animated).animationName, opacity: getComputedStyle(animated).opacity };
      });
      assert.equal(state.animation, 'none', `Reduced-motion reveal is disabled: ${path}`);
      assert.equal(state.opacity, '1', `Reduced-motion content is immediately visible: ${path}`);
      console.log(`PASS ${width}px ${path}: reduced motion visible without animation`);
    }
    await reducedPage.close();
  }
} finally {
  await browser?.close();
  server.kill();
}
