import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

// These are owner-approved UI decisions. Do NOT modify these page layouts or
// navigation flows as a side effect of unrelated audits/optimizations.
const read = (path) => readFile(new URL(`../src/${path}`, import.meta.url), "utf8");
const [home, technology, technologyCss, header, careers, leadership, leadershipMeta, footer] = await Promise.all([
  "components/features/home/HomeClient.jsx",
  "components/features/expertise/expertiseData.ts",
  "components/features/expertise/ExpertiseSection.module.css",
  "components/layout/header/Header.jsx",
  "app/careers/page.js",
  "app/leadership/page.js",
  "app/leadership/layout.js",
  "components/layout/footer/FooterContent/index.tsx",
].map(read));

for (const sector of ["aerospace", "defense"]) {
  assert.match(technology, new RegExp(`id:\\s*["']${sector}["']`), `Technology retains ${sector}`);
}
for (const removed of ["automotive", "railways"]) {
  assert.doesNotMatch(technology, new RegExp(`id:\\s*["']${removed}["']`),
    `${removed} must remain off Technology`);
  assert.match(home, new RegExp(`id:\\s*["']${removed}["']`),
    `${removed} must remain visible on Home`);
  assert.doesNotMatch(header, new RegExp(`/expertise#${removed}`),
    `${removed} must not link to a removed Technology anchor`);
}
assert.match(home, /href:\s*item\.id\s*===\s*['"]automotive['"]\s*\|\|\s*item\.id\s*===\s*['"]railways['"]\s*\?\s*['"]\/contact['"]/,
  "Home's additional sectors must link to Contact, not deleted anchors");

assert.match(header, /label:\s*["']Careers["'][\s\S]*?dropdown:\s*\[/,
  "Careers desktop/mobile department dropdown remains enabled");
for (const department of ["software", "mechanical", "electronics"]) {
  assert.match(header, new RegExp(`/careers/${department}`), `Careers includes ${department}`);
}
assert.match(careers, /permanentRedirect\(['"]\/careers\/software['"]\)/,
  "Standalone Careers landing remains replaced with department redirect");

for (const component of ["LeadershipHero", "HowWeWork", "LeadershipGallery"]) {
  assert.ok(leadership.includes(component), `Leadership retains ${component}`);
}
assert.match(leadershipMeta, /index:\s*false/, "Leadership template remains noindex");
assert.match(footer, /href="\/leadership"/, "Leadership remains navigable");
assert.match(technologyCss, /\.leftInner\s*\{[^}]*position:\s*sticky/,
  "Technology desktop left copy remains sticky in the split layout");

console.log("PASS protected Careers, Leadership, Technology and Home UI decisions");
