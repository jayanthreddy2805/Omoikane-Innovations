# Mobile performance finalization — 25 November 2026

## Method and limits

The **before** build is combined `main` at `994d7c2` (PRs #48 and #49 already merged). The **after** build changes only when the five Expertise video posters become eligible to load. Both runs used a local Next.js production build, Lighthouse 13.6.0, Chromium 158.0.8127.88, Node 24.22.3, a 412×823 viewport at DPR 1.75, simulated 150 ms RTT / 1638.4 Kbps throughput / 4× CPU slowdown, and default first-visit storage. One sample per route per revision was taken. Raw Lighthouse reports and the baseline Expertise/Apply Chromium traces were retained in the local validation workspace. This is not production field data; the shared executor, image cache and simulation can move scores between runs. Differences on pages whose code did not change are **not attributed** to this fix.

| Route | Combined main before: score / LCP | Candidate after: score / LCP | CLS after | LCP candidate in baseline |
| --- | --- | --- | --- | --- |
| `/` | 91 / 3.44s | 93 / 3.23s | 0.000 | Home hero image |
| `/about` | 89 / 3.66s | 95 / 2.87s | 0.000 | Film preview image |
| `/expertise` | 90 / 3.70s | **94 / 3.09s** | 0.000 | Expertise hero image |
| `/contact` | 92 / 3.32s | 92 / 3.33s | 0.000 | Enquiry text |
| `/apply` | 92 / 3.39s | 92 / 3.39s | 0.000 | First-visit cookie-banner text |
| `/work` | 100 / 1.06s | 100 / 1.06s | 0.000 | Introductory copy |

All six sampled mobile scores now meet 90, but **five of six LCP values exceed 2.5 seconds**. The Expertise difference is one sample on each revision, not a statistically established gain. Mobile TBT after was 7.5–66 ms in these six runs; it is not a substitute for field INP. No field INP was available.

## Diagnosis

The unthrottled baseline Expertise trace found the hero request at approximately 56 ms and the hero image paint at 206 ms after navigation. Its mobile variant was already discovered in initial HTML, eager, `fetchpriority=high`, responsive at 750w for this device, and transferred 33,931 bytes through Next image optimization. The 1.6 MB original PNG is not sent at full size in this sample. Font requests and route CSS start at about 54–56 ms; Lighthouse lists approximately 30 KB of route/render-blocking CSS and its simulated mobile cost. The trace's longest individual script evaluation was about 26 ms. The image-layer zoom does not hide the image before hydration. These facts do not support lowering image quality, replacing the typography or removing the hero animation as a targeted fix.

The same first viewport initially fetched **five below-fold video posters totaling 117,173 transferred bytes**, even though the videos had `preload="none"` and no video source was active. Video poster attributes cause image requests independently of video preload. The changed component supplies the same posters only after its existing intersection observer reports that the sequence is within 250px of view, retaining them after first approach. In the after Expertise Lighthouse request list, **zero** video posters were transferred before the first viewport measurement, while the same 33,931-byte hero image was transferred. No source media was replaced or compressed, and no initial video request was added.

The first-visit consent banner remains a late LCP candidate on Apply because its visibility depends on consent read after hydration. Contact's LCP is text; the Home and About candidates are their already optimized images. Reworking global consent rendering or critical CSS/font delivery would affect caching, privacy presentation or typography across routes. With no corresponding bottleneck established by these traces, this pass leaves them intact rather than gaming the metric or compromising the design.

## Verification and open limits

See `FINAL_QA_REPORT.md` for the seven-width polish check, public route and accessibility scans, responsive animation and consent tests. The existing performance browser test confirms Expertise keeps one active video source on approach and none in reduced motion. The original hero and poster assets, rendering quality and cinematic transitions remain. This pass made no backend or production configuration changes.

Remaining: mobile LCP ≤2.5s on Home, About, Expertise, Contact and Apply; field p75 INP; physical Safari/virtual-keyboard testing; and production-network/CDN measurements after a separately approved deployment. A local Lighthouse SEO score of 69 reflects intentionally blocked preview indexing, not a change to production metadata.

## Reproduce

From `frontend`, run `npm ci && npm run build`, then `node scripts/audit-performance.mjs` with `LIGHTHOUSE_MODULE`, `CHROMIUM_EXECUTABLE`, `AUDIT_OUTPUT_DIR`, `AUDIT_MODES='["mobile"]'` and `AUDIT_PATHS='["/","/about","/expertise","/contact","/apply","/work"]'`. The audit writes one full LHR JSON per route and a summary. Compare builds under the same settings and use more samples and a real-device/field check before treating small differences as causal.
