import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const origin = process.env.SMOKE_ORIGIN || "http://127.0.0.1:3018";
const server = process.env.SMOKE_ORIGIN ? null : spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-H", "127.0.0.1", "-p", "3018"], { stdio: "ignore" });
let browser;
try {
  for (let i = 0; i < 100; i++) {
    try { if ((await fetch(origin)).ok) break; } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_EXECUTABLE || undefined, headless: true, args: ["--no-sandbox"] });
  if (process.env.SCREENSHOT_DIR) await mkdir(process.env.SCREENSHOT_DIR, { recursive: true });
  const viewports = process.env.MOBILE_VIEWPORTS ? JSON.parse(process.env.MOBILE_VIEWPORTS) : [[320, 568], [375, 667], [375, 812], [390, 844], [414, 896], [768, 1024], [1440, 900]];
  for (const [width, height] of viewports) {
    const page = await browser.newPage({ viewport: { width, height } });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.route("**/_vercel/insights/**", route => route.fulfill({ status: 200, contentType: "application/javascript", body: "" }));
    await page.goto(origin, { waitUntil: "domcontentloaded" });
    const banner = page.getByRole("region", { name: "Cookie choices" });
    await banner.waitFor();
    await page.waitForTimeout(500);
    const bounds = await page.evaluate(() => {
      const banner = document.querySelector('[aria-label="Cookie choices"]').getBoundingClientRect();
      return {
        height: banner.height,
        actions: [...document.querySelectorAll("[data-client-home-hero] a")].map(element => {
          const rect = element.getBoundingClientRect();
          const intersects = rect.left < banner.right && rect.right > banner.left && rect.top < banner.bottom && rect.bottom > banner.top;
          return { label: element.textContent, height: rect.height, font: parseFloat(getComputedStyle(element).fontSize), intersects };
        })
      };
    });
    if (width <= 560) assert.ok(bounds.height <= 220, `Compact banner at ${width}x${height}: ${bounds.height}`);
    for (const action of bounds.actions) {
      assert.equal(action.intersects, false, `Banner covers ${action.label} at ${width}x${height}`);
      if (width <= 768) { assert.ok(action.height >= 48, "Home action height"); assert.ok(action.font >= 14, "Home action text"); }
    }
    if (process.env.SCREENSHOT_DIR && width === 375 && height === 812) await page.screenshot({ path: `${process.env.SCREENSHOT_DIR}/home-cookie.png` });
    await page.getByRole("button", { name: "Manage preferences", exact: true }).click();
    const dialog = page.getByRole("dialog", { name: "Cookie preferences" });
    await dialog.waitFor();
    assert.equal(await dialog.getByRole("checkbox").isChecked(), false);
    await dialog.getByRole("button", { name: "Save preferences", exact: true }).click();
    await banner.waitFor({ state: "detached" });
    assert.match(await page.evaluate(() => document.cookie), /v1-essential/);
    for (const path of ["/careers/software", "/contact#contact-form", "/apply?dept=electronics&role=prod-eng-elec"]) {
      await page.goto(origin + path, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(800);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `Overflow: ${width} ${path}`);
      if (path === "/careers/software") {
        assert.equal(await page.locator("main h1").count(), 1);
        const menu = page.getByRole("button", { name: "Menu", exact: true });
        if (await menu.isVisible()) {
          await menu.click();
          const navigation = page.getByRole("navigation", { name: "Mobile navigation" });
          await navigation.getByRole("button", { name: "Careers" }).click();
          for (const department of ["software", "mechanical", "electronics"]) {
            assert.equal(await navigation.locator(`a[href="/careers/${department}"]`).count(), 1);
          }
          await menu.click();
        } else {
          const careers = page.getByRole("button", { name: "Careers" });
          await careers.hover();
          await careers.click();
          assert.equal(await careers.getAttribute("aria-expanded"), "true");
          for (const department of ["software", "mechanical", "electronics"]) {
            assert.equal(await page.locator(`#careers-dropdown a[href="/careers/${department}"]`).count(), 1);
          }
        }
      } else {
        const field = page.locator(path.startsWith("/contact") ? "#cf-name" : "#af-name");
        if (width <= 768) {
          const rect = await field.boundingBox();
          assert.ok(rect.x >= 19, `Left form gutter: ${rect.x}`);
          assert.ok(rect.x + rect.width <= width - 19, `Right form gutter: ${rect.x + rect.width}`);
          await field.evaluate(element => element.scrollIntoView({ block: "start" }));
          await page.waitForTimeout(500);
          const visible = await field.evaluate(element => {
            const header = document.querySelector("header")?.getBoundingClientRect();
            return { top: element.getBoundingClientRect().top, headerBottom: Math.max(0, header?.bottom || 0), margin: getComputedStyle(element).scrollMarginTop, scrollY };
          });
          assert.ok(visible.top >= visible.headerBottom + 8, `Field clearance ${width} ${path}: ${JSON.stringify(visible)}`);
        }
      }
      if (process.env.SCREENSHOT_DIR && width === 375 && height === 812) await page.screenshot({ path: `${process.env.SCREENSHOT_DIR}/${path.startsWith("/contact") ? "contact-form" : path.startsWith("/apply") ? "apply-form" : "careers"}.png` });
    }
    assert.deepEqual(errors, []);
    console.log(`PASS ${width}x${height}: banner ${Math.round(bounds.height)}px; actions, Careers, form gutters and header clearance`);
    await page.close();
  }
} finally {
  await browser?.close();
  server?.kill();
}
