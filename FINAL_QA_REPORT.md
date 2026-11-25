# Final QA report — 25 November 2026

## Mobile performance finalization on combined main `994d7c2`

This section records the later Task 2 pass; the sections below describe the earlier PR #49 readiness audit and its separate baseline. No live backend, production database, deployment or environment setting was changed. Chatbot/RAG/Ollama functionality and chatbot analytics were excluded.

| Check | Result |
| --- | --- |
| `npm ci`, `npm run lint`, `npx tsc --noEmit`, `SITE_AUDIT_EXCLUDE_CHATBOT=1 npm test`, `npm run build` | Passed on the branch; lint/type/site/build repeated after the Careers accessible-name correction |
| Mobile Lighthouse, six major routes, combined main vs candidate | Six first-visit runs per revision; scores and LCP in `MOBILE_PERFORMANCE_REPORT.md`; after scores Home 93, About 95, Expertise 94, Contact 92, Apply 92, Work 100; CLS zero; five LCP values remain above 2.5s |
| `node scripts/verify-mobile-polish.mjs` | Passed 320, 375, 390, 414, 768, 960, 1440px: initial consent banner positioning and choices, Home actions, Careers cards, form gutters and scroll clearance; saved consent checked on subsequent pages |
| `node scripts/verify-performance.mjs` | Passed four widths (375, 768, 960, 1440), responsive tree, typography, browser errors/overflow, flags, one active sequence video after scroll and no automatic video in reduced motion |
| `node scripts/verify-public-pages.mjs` | 15 routes × five widths = 75 statuses/H1/anchors/overflow/browser-error checks passed; mobile navigation, desktop search and reduced-motion company film passed. The 30 axe scans found one pre-existing serious label-content-name mismatch on the three Careers Explore links at 390 and 1440; corrected afterward. The script therefore exited nonzero on that first run. |
| Focused post-fix browser check | Passed Careers axe at 390 and 1440 with no serious/critical issues; confirmed saved consent hides banner, 320px Expertise/About/Contact/Apply lack document overflow, and Expertise requests 0 posters before approach then the same 5 posters near view with 0 automatic video requests under reduced motion. The full 75-case suite was not repeated after the one-line link-label correction. |

No physical Safari or software-keyboard run, field INP, production cellular/CDN performance, or manual WCAG certification was obtained. The two Lighthouse samples per route are lab observations, not proof of a persistent speed gain; the unchanged routes' score movement is sampling noise. Original visual assets, font choices, hero geometry, animation and consent options were retained.

## Test environment and boundaries

Local Next production build on Node 24.22.3 and Chromium 158.0.8127.88. Java 21.0.13.1 with packaged Spring Boot API; isolated PostgreSQL 17.12 initialized from V3 synthetic fixtures. Backend integration CI additionally targets PostgreSQL 18. Tests never submit to a live business API: failure-state tests stub business endpoints, and integrated tests forward only business endpoints to an explicitly guarded loopback API. Chatbot functionality was excluded.

## Automated checks

| Check | Actual result |
| --- | --- |
| Clean frontend install, ESLint, TypeScript, site contracts, production build | Passed |
| Maven verify | 86 tests passed; no failures/errors/skips; JAR packaged |
| PostgreSQL integration | Six tests passed; V3→V5, Hibernate validation, preserved fixture, transaction rollback, lock concurrency, CORS, API validation, full listing and authenticated bytes |
| Business failure/recovery browser suite | Passed at 375×900 and 1440×900 |
| Browser → packaged API → PostgreSQL | Contact, Career, Newsletter, Admin listings and authenticated CV download passed |
| Public responsive QA | 15 pages × five widths = 75 passing combinations |
| axe landmark scans | 30 page/viewport scans at 390 and 1440; no serious/critical violations after fixes |
| Existing smoke/performance verification | Passed route metadata, flags, responsive trees, typography comparison, one active video and reduced-motion checks |
| No-JavaScript media | Home, About and Expertise hero images loaded and visible without hydration |
| Indexing functions | Production and preview canonical/robots/sitemap behavior passed |
| npm dependency audit | Zero vulnerabilities |
| Backend OSV scan | Two conditional Spring WebMVC advisory matches remain; applicability in production-readiness report |

## Public pages

All following pages passed at widths **375, 390, 768, 960, 1440**, height 900: `/`, `/about`, `/expertise`, `/work`, `/contact`, `/apply`, `/careers`, `/careers/software`, `/careers/mechanical`, `/careers/electronics`, `/services/software`, `/services/mechanical`, `/services/electronics`, `/privacy`, `/terms`.

Each case checked HTTP 200, one H1, no horizontal document overflow, existing same-page hash targets and zero browser page errors. All received distinct title/description/canonical/OG URL checks through the smoke audit. Invalid route/leadership/flag cases returned 404. Mobile menu navigation to Products and desktop search Enter navigation to Privacy passed. The source contract checks legacy redirects; not every possible legacy incoming URL was individually exercised.

Production metadata functions generate 15 unique canonical sitemap URLs and exclude Admin/removed Leadership. Preview functions return an empty sitemap and disallow crawling; local HTTP also returned noindex. This verifies code/build behavior, not indexing of a newly deployed production release.

## Business workflow cases

| Workflow | Passed cases and evidence |
| --- | --- |
| Contact | Native required/email validation; invalid optional phone prevents posting; enquiry prefix shares the 5000-character limit; name/email/company limits; 429/409/500/network feedback; retry; double-click produces one request; correct success state. Real API persisted a contact and rejected its duplicate. Server tests reject honeypots, malformed/oversize data and invalid phone formats. |
| Career | Valid electrical Product Engineer query; invalid department/role query falls back safely; role keyboard open/Escape; required file; disguised extension, >5MB choice and invalid drop recovery; 413 recovery; multipart department/role/body; real API persistence and application success. Server suite checks signatures, DOCX structure and field/role allow-lists. |
| Newsletter | Required consent blocks posting; consent payload and duplicate feedback; real API creates then detects the subscription. Existing controller/service tests also cover invalid email, absent consent, valid/invalid unsubscribe tokens and reactivation. No real email subscriber was changed. |
| Privacy | Analytics off initially; keyboard toggle/save; reopening; withdrawal back to essential consent; cookie persists after reload; Escape dismisses. Analytics requests were stubbed while testing preferences. This does not claim production telemetry receipt. |
| Admin | Failed login, authorized listing load, memory-only key, logout; detail-dialog focus/restore/Escape; delete-dialog cancellation. Real API returns complete career/contact listings and the downloaded CV bytes match the uploaded fixture. Unauthenticated CV access fails. No production delete was attempted. |

## Defects fixed

- Expired email lease completion could overwrite a recovered worker attempt; completion now checks attempt ownership atomically.
- PostgreSQL returns native TIMESTAMPTZ as Instant in the listing projection. Assuming OffsetDateTime caused a real Admin 500; the DTO now handles both observed driver representations and the regression calls the full endpoint.
- Contact/Apply limits and native phone validity did not consistently match the backend. They now align; server phone format validation prevents direct API bypass.
- A rejected résumé drop retained an older selected file, and a valid MIME could bypass an invalid extension on the client. Both paths now reject/clear correctly; zero-byte files are also rejected.
- The Admin fallback API differed from public forms. It now uses the confirmed backend when no explicit production URL is supplied.
- Admin modals lacked dialog semantics/focus containment/restoration. Cookie preference focus now transfers synchronously so immediate keyboard events do not miss the dialog.
- The About swipe region lacked keyboard access; Expertise sequence had a label without an allowed role; Work navigation used listitem roles on links; several controls overrode their visible names; career navigation landmarks lacked a unique name.
- Muted project numbers failed contrast. They now use the existing readable muted palette. An Apply card label no longer skips heading levels.
- About downloaded a 543KB raw poster. Its responsive image is in initial HTML, and reduced-motion film fetching waits for explicit play. Expertise's image opacity no longer hides it until hydration.

## Visual review and limits

Home, About and Apply were visually reviewed at 390×844 with essential consent and reduced motion. Existing navy/blue branding, typefaces, field layout and source media remain. About intentionally shows a Play company film button for reduced-motion visitors; ordinary playback remains viewport/visibility controlled. The existing typography comparison passed at 375/768/960/1440. This is targeted visual review, not an exhaustive pixel comparison of every state.

Axe scanned the business/public landmarks with reduced motion to avoid measuring text during entrance-animation opacity transitions. Keyboard navigation and the moving-media checks were exercised separately. Automated scans do not establish full WCAG conformance.

Remaining manual/production checks: physical-device Safari and virtual keyboard, final combined PR #48 short-screen/banner behavior, approved provider delivery, actual deployed CORS/commit/migrations, real production load/cold starts, field INP and owner content/privacy approval. Live public-domain CORS currently fails; local passing workflows do not establish live production success.

## Reproduction

Run the required frontend commands from `frontend`, and `./mvnw verify` from `backend` under Java 21. This audit used `SITE_AUDIT_EXCLUDE_CHATBOT=1 npm test` to leave chatbot source checks out of scope.

Browser scripts accept `PLAYWRIGHT_MODULE` and `CHROMIUM_EXECUTABLE` pointing to external test-tool installations. `verify-public-pages.mjs` additionally accepts `AXE_MODULE` and `QA_OUTPUT_DIR`. No runtime dependency was added for these tools.

- `node scripts/verify-business-workflows.mjs`
- `node scripts/verify-public-pages.mjs`
- `node scripts/verify-initial-media.mjs`
- `node scripts/verify-indexing.mjs`
- `node scripts/verify-performance.mjs` (also runs the existing smoke audit)
- `backend/scripts/verify-postgres.sh` with PostgreSQL binaries available through `PG_BINDIR` or pg_config.
- Set `READINESS_FRONTEND_E2E=1` on the PostgreSQL harness after building both applications to exercise the browser against the isolated packaged API. Its provider worker and retention job are disabled explicitly; the harness stops and removes only its own disposable database.

Proxy/trust and explicit Java-agent settings used in this executor are environmental. CI uses the repository's Java 21 workflow and a disposable PostgreSQL 18 service. Review the actual GitHub check outcome separately.
