import assert from 'node:assert/strict';
const origin = process.env.SMOKE_ORIGIN || 'http://localhost:3000';
const paths = ['/', '/work', '/about', '/contact', '/apply', '/careers', '/expertise', '/privacy', '/terms', '/leadership', '/careers/software', '/careers/mechanical', '/careers/electronics', '/services/software', '/services/electronics', '/services/mechanical'];
const titles = new Set();
for (const path of paths) {
  const response = await fetch(`${origin}${path}`);
  assert.equal(response.status, 200, `${path}: status`);
  const html = await response.text();
  const canonicalPath = path === "/" ? "" : path;
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  assert.ok(title && !titles.has(title), `${path}: unique title`); titles.add(title);
  assert.ok(html.includes(`rel="canonical" href="https://www.omoikaneinnovations.com${canonicalPath}"`), `${path}: canonical`);
  assert.ok(html.includes(`property="og:url" content="https://www.omoikaneinnovations.com${canonicalPath}"`), `${path}: OG URL`);
  assert.match(html, /name="description" content="[^"]+"/, `${path}: description`);
  assert.ok(!html.includes('href="https://twitter.com"') && !html.includes('href="https://instagram.com"'), `${path}: social destinations`);
  if (path === '/contact' || path === '/apply') assert.match(html, path === '/contact' ? /id="cf-name"/ : /id="af-name"/, `${path}: server form`);
  if (path === '/about') assert.match(html, /Integration depends on the host platform/, 'FAQ answer in server HTML');
  if (path === '/contact') assert.match(html, /id="contact-form"/, 'Static contact hash target');
  if (path === '/leadership') {
    assert.match(html, /Template profiles\. Names, roles and biographies are pending approval\./);
    assert.match(html, /name="robots" content="noindex, nofollow"/);
    assert.ok(!html.includes('ALEX KIM') && !html.includes('Ex-Google PM'));
  }
  console.log(`PASS ${path}`);
}
const invalid = await (await fetch(`${origin}/apply?dept=invalid&role=invalid`)).text();
assert.match(invalid, /<form/);
assert.ok(!invalid.includes('Loading form'));
assert.match((await fetch(`${origin}/`)).headers.get('x-robots-tag'), /noindex/);
console.log('PASS leadership placeholder, malformed application queries and preview indexing');
