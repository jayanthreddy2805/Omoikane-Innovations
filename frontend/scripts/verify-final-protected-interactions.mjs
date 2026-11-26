import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const origin = 'http://127.0.0.1:3038';
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-H', '127.0.0.1', '-p', '3038'], { stdio: 'ignore' });
let browser;
try {
  let ready = false;
  for (let i = 0; i < 100; i++) {
    try { ready = (await fetch(origin)).ok; } catch { /* startup */ }
    if (ready) break;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.ok(ready);
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_EXECUTABLE || undefined, headless: true, args: ['--no-sandbox'] });
  for (const width of [375, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    await context.addCookies([{ name: 'omoikane_cookie_consent', value: 'v1-essential', url: origin }]);
    const page = await context.newPage();
    page.on('pageerror', error => console.error(`PAGE ERROR ${width}:`, error.message));
    await page.goto(origin + '/');
    await page.getByRole('heading', { name: 'CORE EXPERTISE' }).scrollIntoViewIfNeeded();
    if (width === 375) {
      const title = page.locator('[class*="carouselTitle"]');
      const seen = [];
      for (let i = 0; i < 4; i++) {
        seen.push((await title.innerText()).toLowerCase());
        const href = await page.getByRole('link', { name: /Explore possibilities/ }).getAttribute('href');
        assert.ok(href === '/contact' || href.startsWith('/expertise#'), href);
        await page.getByRole('button', { name: 'Next slide' }).click();
      }
      assert.deepEqual(seen, ['aerospace', 'defense', 'automotive', 'railways']);
    } else {
      for (const name of ['Aerospace', 'Defense', 'Automotive', 'Railways']) {
        assert.ok(await page.getByRole('link', { name: new RegExp(name, 'i') }).count() > 0, `${name} card`);
      }
    }
    await page.goto(origin + '/expertise');
    assert.equal(await page.getByRole('navigation', { name: 'Expertise categories' }).getByRole('button').count(), 2);
    await page.goto(origin + '/leadership');
    await page.getByRole('heading', { name: 'Leadership profiles' }).scrollIntoViewIfNeeded();
    assert.equal(await page.locator('section[aria-labelledby="how-we-work-heading"]').count(), 1);
    const opener = page.getByRole('button', { name: /Open profile for PROFILE 01/ });
    await opener.click();
    const dialog = page.locator('[role="dialog"][aria-labelledby="leadership-profile-alex"]');
    await dialog.waitFor();
    assert.equal(await dialog.getAttribute('aria-hidden'), 'false');
    await page.waitForFunction(() => document.querySelector('[aria-labelledby="leadership-profile-alex"]')?.contains(document.activeElement));
    await page.keyboard.press('Tab');
    assert.equal(await dialog.evaluate(el => el.contains(document.activeElement)), true);
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'hidden' });
    assert.equal(await opener.evaluate(el => el === document.activeElement), true);
    for (const dept of ['software', 'mechanical', 'electronics']) {
      await page.goto(origin + `/careers/${dept}`);
      const roleNav = page.getByRole('navigation', { name: 'Career roles' });
      const buttons = roleNav.getByRole('button');
      assert.ok(await buttons.count() > 0);
      if (await buttons.count() > 1) await buttons.nth(1).click();
      const href = await page.getByRole('link', { name: /SEND YOUR CV/ }).getAttribute('href');
      assert.ok(href.startsWith(`/apply?dept=${dept}&role=`), href);
      await page.goto(origin + href);
      assert.ok((await page.locator('#af-role').innerText()).trim().length > 0);
    }
    await page.goto(origin + '/about');
    assert.equal(await page.locator('main video').count(), 1);
    assert.equal(await page.locator('main video[poster]').count(), 0);
    assert.equal(await page.locator('main video[src]').count(), 0);
    await page.getByRole('button', { name: 'Play company film' }).click();
    await page.locator('main video[src]').waitFor();
    console.log(`PASS protected interactions ${width}px: four sectors, Technology, Leadership, Careers, About`);
    await context.close();
  }
} finally {
  await browser?.close();
  server.kill();
}
