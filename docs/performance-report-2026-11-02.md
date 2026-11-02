# Performance report: findings, fixes and verification

Reviewed all seven pages of the client's `performance report.pdf` (PageSpeed Insights, 2 November 2026, mobile homepage). The report contains failed audits, diagnostic opportunities, manual checks, passed audits and PageSpeed's own interface text. These are distinguished below rather than treating every printed line as a website defect.

## Measured results

The local comparison uses production `next build` / `next start`, Lighthouse 13.6.0, Chromium 153, Lighthouse's default simulated mobile throttling, and fresh browser storage. It is a lab comparison, not new public PageSpeed or CrUX data. The initial baseline was commit `2db8f8c`. The final change is based on `c2fd6fb`, which also includes the client's intervening logo and admin updates. The first fix build already reached 100 performance before those updates were integrated.

| Measure | Client PDF | Local baseline | Final local run |
| --- | --- | --- | --- |
| Performance | 68 | 68 | 100 |
| Accessibility | 95 | 95 | 100 |
| Best practices | 100 | 100 | 100 |
| SEO | 100 | 100 | 100 |
| First contentful paint | 1.5 s | 1.1 s | 1.1 s |
| Largest contentful paint | 7.5 s | 7.4 s | 1.1 s |
| Total blocking time | 210 ms | 322 ms | 28 ms |
| Cumulative layout shift | 0 | 0 | 0 |
| Speed index | 5.6 s | 3.3 s | 1.2 s |
| Initial measured transfer | Not expanded | 2,234,734 bytes | 371,725 bytes |
| Long tasks | 8 | 8 | 4 |
| DOM elements | Not expanded | 511 | 472 |

Compact machine-readable results and browser checks are in [performance-checks-2026-11-02.json](./performance-checks-2026-11-02.json).

## Report checklist

| PDF page | Finding | Change and verified result |
| --- | --- | --- |
| 1 | No real-user data | Informational. CrUX needs sufficient eligible production traffic; code cannot manufacture field data. The results above are explicitly lab results. |
| 1-2 | Performance score, LCP and speed index | The hero now renders visibly in server HTML. It no longer waits for hydration and an opacity animation. Verified with JavaScript disabled and with the mobile Lighthouse run. |
| 2 | First contentful paint | Removed the duplicate remote Google font stylesheet. Existing self-hosted `next/font` files supply normal and italic Cormorant. FCP remains about 1.1 s locally. |
| 2 | Blocking time | WebGL and shader modules load near their visual sections, the chat implementation loads on interaction, and links prefetch on pointer/focus intent. The initial route uses Motion's smaller animation feature set. TBT is 28 ms. |
| 2 | Layout shift | Reserved image and visual dimensions are retained. Measured CLS remains 0. |
| 2 | Render-blocking requests | Removed the remote font CSS request and the full About stylesheet from the homepage. Necessary route styles remain cacheable external CSS. Lighthouse still estimates potential savings (382 ms in the final run); this diagnostic is not claimed eliminated. Inlining every route's CSS would trade away cross-page stylesheet caching. |
| 2 | Legacy JavaScript, 14 KiB | Source maps identify `next/dist/build/polyfills/polyfill-module.js`. This is framework compatibility code. No custom legacy polyfill is added or eagerly imported. The audit remains; supported-browser compatibility was not removed to suppress it. |
| 3 | Forced reflow | Header scroll handling now reads scroll position in one passive, frame-scheduled callback. Page dimensions are cached through resize observation rather than read on every scroll. The final forced-reflow insight passes. |
| 3 | LCP breakdown | The headline is present and visible before client scripts run; LCP is about 1.1 s. The breakdown insight passes in the final run. |
| 3 | Network dependency tree | Removed the remote font stylesheet chain and eager requests for unrelated route forms, chat internals and WebGL. The remaining critical tree consists of same-origin route styles. The dependency-tree advisory remains visible. |
| 3 | Image delivery, 52 KiB | Removed raw project-image preloads and the below-the-fold priority image. Inactive project media loads only when selected. Added accurate image `sizes`, a 512-pixel responsive candidate, and AVIF with WebP fallback at the existing quality setting. The final image-delivery insight passes with zero estimated savings. Source images are retained. |
| 3 | DOM size | Unvisited accordion details are created on first selection; collapsed details are inert. Initial DOM falls from 511 to 472 elements. The DOM-size insight passes. |
| 3 | Unused JavaScript, 194 KiB | Initial unused-code estimate falls from 194,439 to 54,421 bytes. The remaining entries are shared React/Next runtime code; estimated LCP savings are zero. The residual diagnostic is not claimed eliminated. |
| 3 | Unused CSS, 14 KiB | CTA styles now live in their own component stylesheet. The homepage no longer imports the entire About page stylesheet. Removed unused retro-grid declarations from the extracted module. The final unused-CSS audit passes with zero estimated savings. |
| 3 | Eight long tasks | Immediate decorative initialization and unrelated route prefetching were removed. Four tasks remain in the final run, with 28 ms total blocking time. Zero long tasks is not claimed. |
| 3 | Seventeen passed performance audits | Retested through Lighthouse. Remaining diagnostics and the measured scores are recorded rather than assuming all passed items disappeared. |
| 4 | Insufficient contrast | Footer brand text now uses readable on-dark palette tokens. Open-chat bot timestamps use readable muted text. Homepage and opened-chat automated contrast checks pass after transitions settle. Gradient text was also inspected visually. |
| 4 | Heading order | Footer column headings follow the footer's H2 as H3 headings. Styling is unchanged. The heading-order audit passes. |
| 4 | Ten manual accessibility checks | The PDF does not expand or name these ten items. Manual/browser coverage is listed below; no claim is made that the unnamed checks were individually identified from the PDF. |
| 4-5 | Effective CSP against XSS | Added origin restrictions, disabled inline script attributes, blocked object embedding and base-URL changes, and restricted form and frame ancestors. Static Next hydration still requires `script-src 'unsafe-inline'`; therefore the strict nonce/hash CSP advisory remains open. |
| 4 | Origin isolation with COOP | `Cross-Origin-Opener-Policy: same-origin` is served and verified. The local audit lists no findings for this item. |
| 4 | Clickjacking protection | Both `X-Frame-Options: DENY` and CSP `frame-ancestors 'none'` are served and verified. The local audit lists no findings for this item. |
| 5 | DOM XSS and Trusted Types | Replaced application-owned raw HTML rendering in careers headings with React text and explicit line breaks. Strict Trusted Types enforcement was separately tested and blocked framework HTML/script-URL assignments and chat loading. It is not enabled and is not marked complete; no permissive default Trusted Types policy was installed. |
| 5 | Baseline features/browser compatibility | Informational. Existing Next-supported browser targets are retained. Automated interaction testing here uses Chromium 153; Safari and Firefox certification is not claimed. |
| 5 | Missing first-party source maps | Enabled production browser source maps. Lighthouse's source-map audit passes. Client source maps are intentionally public; server-only code is not included by this setting. |
| 5 | Twelve passed best-practice audits | Best-practice score remains 100. Its informative security advisories are still documented separately; 100 is not treated as proof that a strict CSP or Trusted Types is enabled. |
| 5 | Valid structured data | Added minimal Organization JSON-LD using the existing company name, URL, logo and LinkedIn profile. Parsed and checked the served JSON. No ratings, certifications or customer claims were invented. An external rich-results validation is not claimed. |
| 5-6 | SEO passed/not-applicable items | Local SEO score remains 100. |
| 6 | Agentic browsing 2/2 | The PDF marks this experimental category passed. No agent integration needed remediation; the local comparison covers the four standard Lighthouse categories. |
| 1-7 | PageSpeed dates, controls, help links, Google cookie banner, footer links and not-applicable counts | PageSpeed interface/report information, not Omoikane website bugs. No website change is appropriate for these printed lines. |

## Browser checks

All 12 recorded check groups passed against the production build:

- Security response headers and served Organization JSON-LD.
- No initial decorative canvas, chat dialog, remote font stylesheet or raw project preload; no eagerly loaded country-flag module.
- Accordion expansion, selected image loading and inert collapsed details.
- CTA and footer effects activate near the viewport and unmount away from it.
- Chat opens on demand, focuses its input, handles a mocked response, and closes with Escape while restoring launcher focus. No live message was sent.
- Axe WCAG 2 A/AA and WCAG 2.1 AA checks after revealing the page and after opening chat. No violations; gradient-text contrast remains an Axe manual-review item and was inspected visually.
- No horizontal overflow at 320, 412 and 1440 pixels. The compact mobile chat launcher avoids covering the centered CTA text.
- Header hides at the footer and returns at the top.
- First-screen content remains visible with JavaScript disabled; keyboard skip link focuses main content.
- Reduced-motion content remains usable and decorative WebGL stays disabled.
- No homepage runtime or CSP errors in the exercised flows.
- About, Work, Expertise, Leadership, Contact, Apply and all three career pages return successfully without hydration/runtime errors. Fixed the About film's reduced-motion server/client mismatch using a stable hydration snapshot.

`npm run lint`, `npm run build` (18 routes, production Turbopack) and `git diff --check` pass. The build retains static prerendering for the marketing pages.

## Limits and follow-up verification

The public site must be rechecked after the PR is deployed; these local scores are not a guarantee of identical public PageSpeed scores. Hosting latency, caching, devices and lab variance affect the result.

Strict nonce/hash CSP and Trusted Types remain explicit architecture/security follow-ups. Next documents that per-request nonces require dynamic rendering; this change preserves the current static delivery model. Enforcing Trusted Types against the tested build caused actual runtime failures. Remaining React/Next compatibility code and cacheable CSS diagnostics are recorded above instead of deleting required runtime behavior.

For an independent rerun, build and start the frontend, then run Lighthouse 13.6.0 against the production server with mobile defaults and the `performance,accessibility,best-practices,seo` categories. Do not compare a development-server score to the production baseline.
