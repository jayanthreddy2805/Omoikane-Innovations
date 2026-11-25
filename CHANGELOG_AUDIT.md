# Audit change log — 25 November 2026

Branch: `fix/site-audit-2026-11`. Review before merging; no production deploy or data deletion performed.
Paths below are relative to frontend/src unless marked backend or frontend.

| ID | Result | Files changed / action | How to verify |
|---|---|---|---|
| OI-01 | Fixed by removal | app/leadership/page.js; Header.jsx; FooterContent/index.tsx; sitemap.ts | /leadership returns 404; no navigation or sitemap entry. Real profiles require owner data. |
| OI-02 | Fixed | app/careers/page.js; Header.jsx; FooterContent/index.tsx; sitemap.ts | Careers is a link on desktop/mobile; landing page lists all 3 departments and Apply. |
| OI-03 | Fixed | app/contact/page.js; ContactClient.jsx; ContactForm.jsx; apply equivalents | Server HTML includes named form fields. Contact hash has a static target. Forms no longer suspend to loading text; no skeleton needed. No-script email/phone fallback exists. |
| OI-04 | Fixed | FooterContent/index.tsx; lib/socialLinks.ts; app/layout.js | No generic Twitter/Instagram links; existing official links share configuration and have labels/rel. |
| OI-05 | Fixed | lib/siteMetadata.ts; public page/layout metadata; app/opengraph-image.png | Each public page has unique title/description/canonical/og:url; 1200×630 sharing image, large Twitter card. |
| OI-06 | Partially fixed | ContactClient.jsx; WorkClient.jsx; ExpertiseHero.tsx; Header.jsx; about/page.js | Explicit span spacing and single accessible about-card title; remaining editorial copy should receive owner visual review. |
| OI-07 | Fixed | expertiseData.ts; HomeClient.jsx; globals.css | Home cards and mobile carousel derive from expertise data; all 4 anchors exist. Original bento layout retained. |
| OI-08 | Existing dialog retained; extra defect fixed | Header.jsx | Keyboard Search opens accessible dialog; Enter uses router navigation; Careers and leadership destinations updated. |
| OI-09 | Fixed | LoadAwareImage.jsx; next.config.mjs; header/chat image callers; opengraph-image.png | Browser at 375px requests no w=3840; AVIF/WebP retained, max device width 1920. Decorative logos no longer preloaded. OG source reduced from about 2MB to 38KB. |
| OI-10 | Fixed for existing videos | ExpertiseSection.tsx; AerospaceVideoSequence.tsx; AboutHero.jsx; public video posters/WebM | One responsive sequence tree; near-viewport source loading, posters, preload none, reduced-motion playback stops. Automotive/rail sections use existing CSS visuals because video files are absent. Company film retains existing MP4 and poster. |
| OI-11 | Partially fixed | data/products.ts; SelectedWork.jsx; WorkClient.jsx | Shared order OFC, OESC, OGN, OCOM and matching anchors; real photography still requires owner. |
| OI-12 | Needs owner | CLAIMS_TO_VERIFY.md; OWNER_TODO.md; source TODO comments | Confirm dated stats, specs, tests and certificates. Existing marketing copy retained. |
| OI-13 | Fixed | FooterContent/index.tsx; ConsentAwareAnalytics.jsx; cookieConsent.js | Cookie settings reopens dialog; only consent mounts analytics; beforeSend rejects events after withdrawal. Same-origin script/endpoint complies with CSP. Malformed cookie value is ignored safely. |
| OI-14 | Partially fixed; policy pending | backend/RetentionJob.java; backend/RETENTION.md; OWNER_TODO.md | Opt-in scheduled deletion requires explicit positive periods. Disabled by default. Owner must approve periods, controller/address/grievance details and publish matching policy. Form privacy notices already exist. |
| OI-15 | Hardened; operational follow-up | backend career/contact/subscription request/services; ResendEmailService; exception/rate-limit handlers; form honeypots; tests; package-lock.json | 80 backend tests pass. Field limits, canonical roles, DOCX container and expansion checks, 5MB/signature checks, subject CRLF removal, safe logs, generic failures. Private DB resume storage and authenticated downloads retained; signed public URLs unnecessary. Existing limiter retained. npm audit: zero vulnerabilities. Review email attachment/backups and malware scanning with owner. Java validation retained rather than adding JS zod to a Java API. |
| OI-16 | Fixed | app/robots.ts; app/sitemap.ts; lib/siteMetadata.ts; proxy.ts | Non-production builds/hosts noindex; production sitemap excludes leadership/admin/API. Non-www canonical redirect; Organization JSON-LD retained. |
| OI-17 | Fixed | about/page.js | FAQ answers present while collapsed via hidden attribute; matching FAQPage JSON-LD derives from same array. |
| OI-18 | Resolved by route removal | app/leadership/page.js | No public leadership overlays or template profiles are rendered. |
| OI-19 | Fixed for confirmed defects | ChatbotMount.jsx; TechMarquee.tsx already protected | Marquee repeat already aria-hidden; chat remains intent-loaded and is hidden on form routes. Cookie layer has higher z-index. |
| OI-20 | Partially fixed | public/images/leadership/uav-architecture-blueprint-mobile.png; LeadershipHero.jsx; LoadAwareImage.jsx | Space-containing filename renamed with references updated. Removed leadership route eliminates its duplicate public images. Broader asset-name cleanup deferred to avoid unrelated asset churn. |
| OI-21 | Technical fixes complete; content needs owner | ApplyForm.jsx; app/apply/page.js; ApplyClient.jsx; backend role allow-list; OWNER_TODO.md | Invalid dept/role ignored; valid query preselects role; Other retains department; role query changes reset form. Form precedes office details; hours include IST. Existing skill copy retained for owner review. |
| OI-X1 | Fixed | ConsentAwareAnalytics.jsx | Explicit /_vercel/insights script and endpoint keep analytics same-origin; no external CSP relaxation needed. |
| OI-X2 | Fixed in source | Header.jsx; FooterContent/index.tsx; render.yaml | Enter does not reload; label updated; both canonical domain variants added to Blueprint CORS. Live environment unchanged pending review. |
| OI-X3 | Fixed | LoadAwareImage.jsx | Image is visible in server HTML, including cached/no-script images. |
| OI-X4 | Fixed | frontend/package-lock.json | Lock entries repaired and compatible vulnerable transitive packages updated. |
| OI-X5 | Fixed | backend/CareerApplicationService.java | prod-eng-elec now belongs to electronics allow-list. |
| OI-X6 | Fixed in tests | backend/src/test/resources/application-test.properties | H2 tests explicitly use H2 dialect instead of inherited PostgreSQL dialect. |

## Validation

- Frontend lint, `npx tsc --noEmit`, build and existing `npm test`: pass.
- `scripts/smoke-audit.mjs`: 15 public routes, unique titles, descriptions, canonicals/OG URLs, server form fields, FAQ HTML, leadership 404, invalid application query and preview noindex pass.
- Chromium browser at 375×812: Home, Contact, malformed Apply query, Expertise and Careers pass; no horizontal overflow, 3840 image requests, duplicate video tree or runtime errors.
- Backend: 80 tests, 0 failures, 0 errors, 0 skipped. Runtime needed a Java 21 JDK, system certificate trust store, and an explicitly loaded Byte Buddy agent due sandbox self-attach restrictions. No tests were disabled.
- npm audit: 0 vulnerabilities after compatible transitive updates.
- Render deployment metadata checked; runtime logs unavailable (503). Neon schema checked read-only. Railway lists no projects. Current live behavior is not claimed to contain this review branch.
