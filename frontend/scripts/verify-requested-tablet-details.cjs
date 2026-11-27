/* Rendered acceptance for the owner's Home / Leadership / CTA / FAQ screenshots. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { spawn } = require('node:child_process');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const AxeBuilder = require(process.env.AXE_MODULE || '@axe-core/playwright').default;
const base = 'http://127.0.0.1:3167';
const out = process.env.OUT || 'RESPONSIVE_QA/TABLET_REQUESTED_DETAILS_20261127';
const wait = ms => new Promise(r => setTimeout(r, ms));
fs.mkdirSync(out, { recursive: true });
(async () => {
  const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', '3167'], { stdio: 'ignore' });
  let browser;
  const rows = [], failures = [];
  try {
    for (let i = 0; i < 60; i++) { try { if ((await fetch(base)).ok) break; } catch {} await wait(300); }
    browser = await chromium.launch({ executablePath: process.env.CHROME_PATH, args: ['--no-sandbox'] });
    for (const [width, height] of [[768, 1024], [820, 1180], [1024, 1366], [390, 844], [1440, 900]]) {
      const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: width === 1440 ? 1 : 2, isMobile: width < 1100, hasTouch: width < 1100, reducedMotion: process.env.REDUCED_MOTION === '1' ? 'reduce' : 'no-preference' });
      await context.addCookies([{ name: 'omoikane_cookie_consent', value: 'v1-essential', url: base }]);
      await context.route('**/*', r => /\/api\//.test(r.request().url()) || !['GET', 'HEAD'].includes(r.request().method()) ? r.abort() : r.continue());
      const page = await context.newPage();
      for (const route of width >= 768 && width <= 1024 ? ['/about', '/leadership'] : ['/about']) {
        const row = { width, height, route };
        try {
          await page.goto(base + route, { waitUntil: 'load' }); await page.evaluate(() => document.fonts.ready); await wait(1500);
          if (route === '/about') {
            const faq = page.locator('#faq');
            assert.equal(await faq.locator('[class*="faqNumber"]').count(), 0, 'FAQ numbering is removed from the DOM');
            row.icons = await faq.locator('[class*="faqIcon"]').evaluateAll(es => es.map(e => { const s = getComputedStyle(e); return { border: s.borderTopWidth, radius: s.borderRadius, background: s.backgroundColor }; }));
            assert.equal(row.icons.length, 5);
            assert.ok(row.icons.every(i => i.border === '0px' && i.radius === '0px' && i.background === 'rgba(0, 0, 0, 0)'), 'Plain plus icons in open and closed states');
            const buttons = faq.getByRole('button');
            for (let i = 0; i < 5; i++) {
              const button = buttons.nth(i); await button.focus(); await page.keyboard.press('Enter');
              assert.equal(await button.getAttribute('aria-expanded'), 'true');
              assert.ok(await page.locator('#' + await button.getAttribute('aria-controls')).isVisible());
              const icon = button.locator('[class*="faqIcon"]');
              assert.equal(await icon.evaluate(e => getComputedStyle(e).borderTopWidth), '0px');
              await page.keyboard.press('Space'); assert.equal(await button.getAttribute('aria-expanded'), 'false');
            }
            if (width >= 768 && width <= 1024) {
              const cta = page.getByRole('region', { name: 'From Sky to Soil, We Power Possibilities' });
              await cta.scrollIntoViewIfNeeded(); await wait(1400);
              row.cta = await cta.evaluate(e => ({ height: e.getBoundingClientRect().height, items: [...e.querySelectorAll('[class*="ctaPartnerItem"]')].map(n => { const b = n.getBoundingClientRect(), card = e.querySelector('[class*="ctaCard"]').getBoundingClientRect(); const range = document.createRange(); range.selectNodeContents(n.querySelector('[class*="ctaPartnerLabel"]')); const rects = [...range.getClientRects()]; return { y: b.y, width: b.width, labelLeft: Math.min(...rects.map(r => r.left)), labelRight: Math.max(...rects.map(r => r.right)), outside: rects.some(r => r.left < card.left - 1 || r.right > card.right + 1) }; }) }));
              assert.equal(row.cta.items.length, 6); assert.ok(row.cta.items.every(i => i.width > 0 && !i.outside));
              assert.ok(row.cta.items.every((item, i, items) => i === 0 || item.labelLeft >= items[i - 1].labelRight), 'Adjacent CTA captions do not overlap');
              assert.ok(Math.max(...row.cta.items.map(i => i.y)) - Math.min(...row.cta.items.map(i => i.y)) < 1, 'Mini/Air share Pro single-row strip');
              assert.equal(await cta.getByRole('link', { name: 'Contact OMOIKANE' }).getAttribute('href'), '/contact');
            }
          } else {
            row.leadership = await page.getByAltText('UAV Architecture', { exact: true }).evaluate(e => ({ source: e.currentSrc, fit: getComputedStyle(e).objectFit, complete: e.complete && e.naturalWidth > 0, canvas: e.closest('section').getBoundingClientRect().height, columns: getComputedStyle(e.closest('section').parentElement.querySelector('[class*="infoBand"]')).gridTemplateColumns.split(' ').length }));
            assert.ok(row.leadership.complete && !row.leadership.source.includes('-mobile'));
            assert.equal(row.leadership.fit, 'contain'); assert.equal(row.leadership.columns, 2);
            assert.ok(Math.abs(row.leadership.canvas - ((width - 64) * 773 / 2034 + 32)) < 1, 'Mini follows Air/Pro landscape canvas');
          }
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
          for (let y = 0, total = await page.evaluate(() => document.documentElement.scrollHeight); y < total; y += 900) { await page.evaluate(y => scrollTo(0, y), y); await wait(60); }
          await wait(1600);
          row.axe = (await new AxeBuilder({ page }).include('main').include('header').include('footer').analyze()).violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) }));
          assert.deepEqual(row.axe, []); rows.push(row); console.log('PASS', width, route);
        } catch (e) { failures.push({ ...row, error: e.message }); console.log('FAIL', width, route, e.message); }
      }
      await context.close();
    }
  } finally { await browser?.close(); server.kill(); fs.writeFileSync(out + '/checks.json', JSON.stringify({ rows, failures }, null, 2)); }
  console.log('RESULT', rows.length, 'cases;', failures.length, 'failures'); if (failures.length) process.exitCode = 1;
})();
