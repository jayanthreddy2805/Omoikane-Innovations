/* Browser checks for the owner's Careers / Mini hero / Contact annotations.
 * ORIGIN points to live for measurements only; otherwise use a local build.
 * QA tools stay external to application dependencies. No form is submitted.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const AxeBuilder = require(process.env.AXE_MODULE || '@axe-core/playwright').default;
const origin = process.env.ORIGIN || 'http://127.0.0.1:3157';
const baseline = process.env.BASELINE === '1';
const out = process.env.OUT || 'RESPONSIVE_QA/CAREERS_CONTACT_20261127/checks';
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
fs.mkdirSync(out, { recursive: true });

(async () => {
  const server = origin.startsWith('http://127.0.0.1')
    ? spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-H', '127.0.0.1', '-p', new URL(origin).port], { stdio: 'ignore' }) : null;
  const rows = [], failures = [];
  let browser;
  try {
    if (server) {
      let ready = false;
      for (let i = 0; i < 60; i++) {
        try { if ((await fetch(origin)).ok) { ready = true; break; } } catch {}
        await wait(300);
      }
      assert.ok(ready, 'Production server became ready');
    }
    browser = await chromium.launch({
      executablePath: process.env.CHROME_PATH,
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
      ...(origin.startsWith('https') && process.env.HTTPS_PROXY ? { proxy: { server: process.env.HTTPS_PROXY } } : {}),
    });
    for (const [width, height] of [[768, 1024], [820, 1180], [1024, 1366]]) {
      const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, ignoreHTTPSErrors: true, reducedMotion: process.env.REDUCED_MOTION === '1' ? 'reduce' : 'no-preference' });
      await context.addCookies([{ name: 'omoikane_cookie_consent', value: 'v1-essential', url: origin }]);
      await context.route('**/*', r => /\/api\//.test(r.request().url()) || !['GET', 'HEAD'].includes(r.request().method()) ? r.abort() : r.continue());
      const page = await context.newPage();
      for (const route of (process.env.ROUTES || '/,/contact,/careers/software,/careers/mechanical,/careers/electronics').split(',')) {
        const row = { width, height, route };
        try {
          await page.goto(origin + route, { waitUntil: 'load' });
          await page.evaluate(() => document.fonts.ready);
          await wait(1600);
          if (route === '/') {
            row.hero = await page.locator('#hero').evaluate(e => {
              const box = el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height, bottom: r.bottom }; };
              const image = e.querySelector('img');
              return { section: box(e), copy: box(e.querySelector('[class*="heroContent"]')), media: box(e.querySelector('picture')), actions: box(e.querySelector('[data-type-role="actions"]')), heading: box(e.querySelector('h1')), image: { paddingLeft: parseFloat(getComputedStyle(image).paddingLeft), source: image.currentSrc } };
            });
            if (!baseline && width === 768) {
              assert.ok(Math.abs(row.hero.section.height - 480) < 1, 'Mini uses the compact Air/Pro hero');
              assert.ok(Math.abs(row.hero.media.height - 480) < 1 && Math.abs(row.hero.image.paddingLeft - 184.32) < 1, 'Mini uses Air-style full-height media');
              assert.ok(row.hero.image.source.includes('home-drone-desktop'), 'Mini uses the Air/Pro source');
            }
          } else if (route === '/contact') {
            row.contact = await page.locator('main').evaluate(e => {
              const section = e.querySelector('section'), grid = e.querySelector('[class*="enquiryGrid"]');
              const text = e.querySelector('[class*="enquiryText"]'), visual = e.querySelector('[class*="enquiryVisualContainer"]');
              const form = e.querySelector('form'), button = form.querySelector('button[type="submit"]');
              const box = el => { const r = el.getBoundingClientRect(); return { y: r.y, width: r.width, height: r.height, bottom: r.bottom }; };
              return { section: box(section), form: box(form), text: box(text), columns: getComputedStyle(grid).gridTemplateColumns.split(' ').length, illustration: getComputedStyle(visual).display, footerGap: document.querySelector('footer').getBoundingClientRect().top - button.getBoundingClientRect().bottom, introToForm: form.getBoundingClientRect().top - text.getBoundingClientRect().bottom, fields: [...form.querySelectorAll('input:not([type="hidden"]),textarea')].filter(el => el.getBoundingClientRect().width && !el.closest('[aria-hidden="true"]')).map(el => ({ id: el.id, height: el.getBoundingClientRect().height, font: parseFloat(getComputedStyle(el).fontSize) })) };
            });
            if (!baseline) {
              if (width < 900) {
                assert.equal(row.contact.illustration, 'none');
                assert.equal(row.contact.columns, 1);
                assert.ok(Math.abs(row.contact.introToForm - 24) < 1, '24px between introduction and form');
              } else {
                assert.equal(row.contact.columns, 2);
                assert.ok(row.contact.footerGap >= 63 && row.contact.footerGap <= 65, 'Pro ends 64px after submit');
              }
              assert.ok(row.contact.fields.every(f => f.height >= 44 && f.font >= 16));
              await page.getByLabel('Name', { exact: true }).fill('Responsive QA');
              await page.getByLabel('Name', { exact: true }).fill('');
            }
          } else {
            const nav = page.getByRole('navigation', { name: 'Career roles' });
            const y = await page.locator('#roles').evaluate(e => e.getBoundingClientRect().top + scrollY);
            await page.evaluate(y => scrollTo(0, y - 128), y); await wait(350);
            const first = await nav.boundingBox();
            await page.evaluate(() => scrollBy(0, 350)); await wait(350);
            const second = await nav.boundingBox();
            row.navigation = { first, scrolled: second, layout: await nav.locator('ul').evaluate(e => getComputedStyle(e).flexDirection) };
            await page.screenshot({ path: path.join(out, `${route.slice(1).replaceAll('/', '-')}-${width}-scrolled.jpg`), type: 'jpeg', quality: 65, scale: 'css' });
            if (!baseline) {
              if (width > 900) {
                assert.ok(first.y >= 127 && Math.abs(second.y - 128) < 2, 'Role rail sticks at 128px after scrolling');
                await page.evaluate(() => scrollBy(0, 120)); await wait(250);
                row.navigation.further = await nav.boundingBox();
                assert.ok(Math.abs(row.navigation.further.y - 128) < 2, 'Role rail stays visible on further scroll');
                assert.equal(row.navigation.layout, 'column');
              } else assert.equal(row.navigation.layout, 'row', 'Mini and Air keep role tabs');
              row.roles = [];
              const buttons = nav.getByRole('button');
              for (let i = 0; i < await buttons.count(); i++) {
                const button = buttons.nth(i), title = await button.locator('[class*="navTitle"]').innerText();
                await button.click(); await wait(1100);
                const heading = await page.locator('[class*="roleHeader"] h2').innerText();
                assert.equal(heading, title);
                const href = await page.locator('[class*="premiumApplyBtn"]').getAttribute('href');
                assert.ok(href.startsWith(`/apply?dept=${route.split('/').pop()}&role=`));
                row.roles.push({ title, href });
              }
            }
          }
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'No page overflow');
          if (!baseline) {
            for (let y = 0, total = await page.evaluate(() => document.documentElement.scrollHeight); y < total; y += 900) { await page.evaluate(y => scrollTo(0, y), y); await wait(60); }
            await wait(1600);
            row.axe = (await new AxeBuilder({ page }).include('main').include('header').include('footer').analyze()).violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) }));
            assert.deepEqual(row.axe, []);
          }
          rows.push(row); console.log('PASS', width, route);
        } catch (e) { failures.push({ ...row, error: e.message }); console.log('FAIL', width, route, e.message); }
      }
      if (!baseline) {
        try {
          await page.evaluate(() => scrollTo(0, 0)); await wait(400);
          const menu = page.getByRole('button', { name: 'Menu', exact: true });
          await menu.click();
          const navigation = page.getByRole('navigation', { name: 'Mobile navigation' });
          await navigation.waitFor({ state: 'visible' });
          await navigation.getByRole('button', { name: 'Careers', exact: true }).click();
          for (const department of ['software', 'mechanical', 'electronics']) {
            assert.equal(await navigation.locator(`a[href="/careers/${department}"]:visible`).count(), 1);
          }
          await menu.click(); await navigation.waitFor({ state: 'hidden' });
          assert.equal(await menu.getAttribute('aria-expanded'), 'false');
          rows.push({ width, height, interaction: 'Header menu and Careers departments', result: 'passed' });
        } catch (e) { failures.push({ width, interaction: 'Header menu', error: e.message }); }
      }
      await context.close();
    }
  } finally {
    await browser?.close(); server?.kill();
    fs.writeFileSync(path.join(out, 'checks.json'), JSON.stringify({ baseline, rows, failures }, null, 2));
  }
  console.log('RESULT', rows.length, 'routes;', failures.length, 'failures');
  if (failures.length) process.exitCode = 1;
})();
