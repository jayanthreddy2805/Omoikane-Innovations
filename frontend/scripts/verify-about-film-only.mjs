import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const hero = await readFile(new URL("../src/components/features/about/AboutHero.jsx", import.meta.url), "utf8");
const css = await readFile(new URL("../src/components/features/about/AboutHero.module.css", import.meta.url), "utf8");

assert.match(hero, /<video[\s\S]*?aria-label="Omoikane Innovations company film"/, "The company video remains accessible");
assert.match(hero, /onPlaying=\{\(\) => setHasFrame\(true\)\}/, "Video playback state remains intact");
assert.match(hero, /Play company film/, "Reduced-motion visitors keep an explicit play action");
assert.match(hero, /toggleSound/, "Sound control remains intact");
assert.doesNotMatch(hero, /COMPANY_VIDEO_POSTER|filmPoster|<Image\b|<picture\b/i, "About must not show a still image over the film");
assert.doesNotMatch(css, /\.filmPoster\s*\{/, "Remove unused poster styling");
console.log("PASS About video only; existing player controls and layout remain unchanged");
