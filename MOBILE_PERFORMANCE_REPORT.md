# Mobile performance report — 25 November 2026

## Measured outcome

About's mobile sample improved from **78 / 6.24s LCP** to **93 / 3.25s LCP**. Its film preview transferred **8,125 bytes** through the existing responsive image pipeline instead of **543,894 bytes** for the raw JPEG in the baseline request (98.5% fewer transferred bytes in these samples). No original image or video file was changed or re-encoded. This changes browser delivery of the preview, not the film's source resolution or bitrate.

Desktop samples meet the requested 95+ performance target. **Mobile Expertise still misses 90+, and several mobile LCP samples exceed 2.5 seconds.** CLS measured zero throughout. Field INP has not been established and is not inferred from Lighthouse's total blocking time.

## Method

- Lighthouse **13.6.0**, Chromium **158.0.8127.88**, Node **24.22.3**, shared Linux executor, local Next.js production build.
- URLs: `http://127.0.0.1:3016` plus each path below. These are local candidate-build results, not production CDN, cellular-device or Render cold-start measurements.
- Mobile: 412×823, device scale factor 1.75, Lighthouse simulated mobile defaults (150ms RTT, 1638.4 Kbps throughput setting, 4× CPU slowdown).
- Desktop: explicit Lighthouse desktop configuration, 1350×940, scale factor 1, 40ms RTT, 10240 Kbps throughput, 1× CPU.
- One sample per page/profile; browser storage/cache resets follow Lighthouse defaults. Server/image-transform caches can be warm, and other validation ran on the shared executor. Treat small differences as noise rather than code-attributable improvements.
- Baseline: candidate before the About/Expertise media adjustments. Before values exist for nine pages only. All 15 public pages received final mobile and desktop samples; no missing baselines were fabricated.
- Initial consent was unset, reflecting a first visit. In several pages the client-mounted cookie banner becomes the final LCP candidate. PR #48's compact-banner change is separately open and was not duplicated here. The combined release needs another measurement after that work is approved.

## Page results

| Page | Mobile before score / LCP | Mobile after score / LCP | Desktop after score / LCP | CLS after |
| --- | --- | --- | --- | --- |
| `/` | 92 / 3.41s | 92 / 3.41s | 100 / 0.69s | 0.000 |
| `/about` | 78 / 6.24s | 93 / 3.25s | 100 / 0.72s | 0.000 |
| `/expertise` | 86 / 4.19s | 87 / 4.07s | 99 / 0.86s | 0.000 |
| `/work` | 100 / 1.06s | 100 / 1.06s | 100 / 0.30s | 0.000 |
| `/contact` | 92 / 3.32s | 92 / 3.31s | 99 / 0.95s | 0.000 |
| `/apply` | 92 / 3.32s | 92 / 3.31s | 99 / 0.90s | 0.000 |
| `/careers` | 99 / 0.91s | 100 / 0.91s | 100 / 0.25s | 0.000 |
| `/careers/software` | Not captured | 92 / 3.33s | 100 / 0.67s | 0.000 |
| `/careers/mechanical` | Not captured | 92 / 3.31s | 100 / 0.67s | 0.000 |
| `/careers/electronics` | Not captured | 92 / 3.32s | 100 / 0.69s | 0.000 |
| `/services/software` | 100 / 0.91s | 100 / 1.53s | 100 / 0.25s | 0.000 |
| `/services/mechanical` | Not captured | 100 / 0.91s | 100 / 0.25s | 0.000 |
| `/services/electronics` | Not captured | 100 / 0.91s | 100 / 0.25s | 0.000 |
| `/privacy` | 100 / 0.91s | 100 / 0.91s | 100 / 0.37s | 0.000 |
| `/terms` | Not captured | 100 / 0.91s | 100 / 0.25s | 0.000 |

Final mobile TBT ranged **14.5–68.5ms**; desktop **0.0–14.0ms**. These are lab blocking-time measurements, not INP.

## Implemented and verified

- About preview is a responsive Next image in server HTML, with explicit sizes and high fetch priority. It is replaced after a video frame plays. Reduced-motion users receive the preview and an explicit Play company film action; no video source is fetched automatically in that mode.
- Expertise's hero background no longer starts with zero opacity. Its zoom remains. A browser with JavaScript disabled verified loaded, visible initial hero images on Home, About and Expertise.
- Existing verification confirmed one responsive Home expertise tree, one active sequence video source, source transitions and no automatic Expertise sequence fetch with reduced motion. Inactive About clips still pause/release their source; original playback assets remain unchanged.
- Five-width public QA found no document overflow or browser page errors. Typography regression comparison passed. No broad redesign, font replacement or new runtime dependency was introduced.

## Remaining bottlenecks and limits

1. Expertise's simulated mobile LCP remains around 4.07s with its full-screen illustration, critical stylesheet/font delivery and animation/render work. Its image is discoverable/eager/high-priority and visible before hydration; no smaller source resolution or lower media-quality setting was introduced to inflate the score. Further performance work must preserve the approved visual design and be remeasured.
2. The first-visit consent banner appears after hydration and is a late LCP candidate on several pages. Review/measure the combined PR #48 result before claiming the 2.5-second target is met. These results do not establish the entire site meets the mobile acceptance target.
3. Real field INP/p75, physical-device Safari/virtual keyboard, slow production networks, CDN cache behavior and Render free-service cold starts/load still need production or real-device verification after an approved release.
4. Lighthouse SEO is 69 on the local preview because indexing is intentionally blocked. This is not an instruction to enable indexing on previews. Separate tests verify production metadata, 15-entry sitemap and robots policy; actual deployed production discovery remains a post-release check.
5. Transient animation timing can affect Lighthouse accessibility samples; the dedicated axe scans used the site's reduced-motion setting after rendering and found zero serious/critical issues. This is not a full manual WCAG certification.

## Reproduction

Build the frontend, install/use Lighthouse as an external audit tool, then run `node scripts/audit-performance.mjs` from frontend. `LIGHTHOUSE_MODULE`, `CHROMIUM_EXECUTABLE`, `AUDIT_OUTPUT_DIR`, `AUDIT_PATHS` and `AUDIT_MODES` configure the tool. The script selects the actual desktop configuration rather than merely labeling a mobile run desktop, saves the configuration and raw LHR data, and fails on Lighthouse runtime errors. No scores are substituted when a page fails to load.
