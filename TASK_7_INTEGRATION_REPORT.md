# Task 7 — Omoikane integration and regression QA

**Run:** 26 November 2026, isolated local build. **Base:** `c3024c0` (`main` at test start). **Candidate:** local branch `qa/task-7-integration-2026-11`, merging PR #56 (`9446a53`), #57 (`ad90224`), and #58 (`b2f474d`) in that order. No production service, database, email provider, or deployment was touched.

## Integration result

| PR | Scope reviewed | Result |
| --- | --- | --- |
| #56 | Admin/preview indexing, protected UI assertions and audit documents | Merged into the isolated branch without file conflict; preview `noindex` and UI contract checks passed. |
| #57 | Admin rate limiting/resume security and About film without poster | Merged without file conflict. Its About change supersedes the earlier image preview, matching the locked video-only decision. Backend and film checks passed. |
| #58 | Release acceptance and handoff documents | Merged without file conflict; no runtime code change. |

No overlapping merge conflict or verified functional regression required a source fix. The integration branch is **not** a deployment or merge proposal. The separate Task 7 PR contains this report and evidence only; the three source PRs remain independently reviewable.

## Frontend results

| Check | Actual result |
| --- | --- |
| `npm ci` | Passed; 395 packages installed. |
| `npm run lint`, `npx tsc --noEmit`, `SITE_AUDIT_EXCLUDE_CHATBOT=1 npm test`, `npm run build` | All passed. Test script includes the About video-only assertion. |
| Public-page Playwright + axe | **70 page/viewport combinations**, at 375, 390, 768, 960 and 1440px: all HTTP 200, one main H1, no horizontal overflow, no page errors or broken local anchors. Axe of main/header/footer at 390 and 1440px found **0 serious or critical violations**. Navigation/search, reduced-motion film control and missing-route 404 passed. This is not WCAG certification. |
| Additional responsive checks | **30 page/viewport combinations** across 15 routes at 320 and 414px: all HTTP 200, one main H1, no horizontal overflow or page errors. See [edge-responsive.json](frontend/TASK_7_QA/edge-responsive.json). |
| Protected UI interactions | At **320, 375, 390, 414, 768, 960 and 1440px**, Leadership gallery open/Escape/focus restoration and Careers department dropdown passed. The protected UI source contract passed. Home has four sectors; Technology has Aerospace and Defense only. Desktop Defense copy remained visible beside its visual. |
| Business UI harness | Passed at 375 and 1440px: contact validation, 409/429/500/network recovery, duplicate-click guard; application query/role selection, file type/size/drop validation and retry; newsletter consent/duplicate; Admin failure/listings/dialog focus/logout; cookie defaults, withdrawal and persistence. Mocked provider responses; no real submissions. |
| Initial media/performance harnesses | Hero images visible with JavaScript disabled; About has a video and no loading image. Responsive media trees, sequence transitions, reduced-motion and typography checks passed. Mobile banner/form/header checks passed at all seven requested widths. |
| Security headers | Local `/contact` returned CSP, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` and preview `X-Robots-Tag: noindex, nofollow`. |

Representative screenshots: [Home Core Expertise, 390px](frontend/TASK_7_QA/screenshots/home-core-expertise-390.jpg), [About video-only state, 390px](frontend/TASK_7_QA/screenshots/about-video-only-390.jpg), [Technology Defense split view, 1440px](frontend/TASK_7_QA/screenshots/technology-defense-1440.jpg). The About screenshot intentionally uses reduced motion before playback; the blank video frame and play control are expected.

## Backend and PostgreSQL results

| Check | Actual result |
| --- | --- |
| `./mvnw verify` with local Java 21 and offline Maven cache | **87 tests passed**, 0 failures/errors/skips; jar built. Includes Admin key-guess and unauthenticated-read rate limiting, service/controller validation, outbox rollback/retry/lease tests, and newsletter unsubscribe/invalid token tests. |
| Isolated PostgreSQL 17 harness | **6 tests passed** with synthetic records. Flyway started from V1–V3 fixture and upgraded through V4/V5; verified existing-data compatibility, rollback of submission and outbox jobs, job locking, PostgreSQL projections, authenticated résumé bytes, CORS approved/unknown origins and duplicate/honeypot responses. Temporary database was destroyed afterward. |
| Browser → isolated Spring Boot → PostgreSQL | Passed contact creation and duplicate 409, multipart application, newsletter consent and duplicate, authenticated Admin contacts/applications and exact downloaded résumé bytes. Email worker and provider credentials were disabled. |
| Security boundary | The PostgreSQL tests reject an unauthenticated résumé download and an unknown CORS origin. No production authentication or provider configuration was exercised. |

The first plain Maven invocation could not reach Maven Central. An offline retry initially lacked `javac` and then Mockito's Java agent; the final run used the local Java 21 toolchain, cached dependencies and agent. The first browser-to-PostgreSQL harness attempt lacked the Chromium path; the configured retry passed. These were **environment setup failures**, not passing results hidden from the record.

## Measured mobile Lighthouse

Single lab run per route on the local production build, preview indexing rules, 412×823 emulation, 4× CPU slowdown, 150ms RTT. See [lighthouse-mobile.json](frontend/TASK_7_QA/lighthouse-mobile.json). Scores are not field data.

| Route | Performance | Accessibility | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: |
| Home `/` | 91 | 100 | 3.438s | 0 | 22ms |
| About | 100 | 100 | 1.062s | 0 | 42ms |
| Technology | 94 | 100 | 3.093s | 0 | 58ms |
| Products | 100 | 100 | 1.070s | 0 | 55ms |
| Software Careers | 92 | 100 | 3.264s | 0 | 115ms |
| Contact | 93 | 100 | 3.241s | 0 | 13ms |
| Apply | 92 | 100 | 3.391s | 0 | 15ms |

All seven SEO audit scores were **69** on the local preview build because preview `noindex` is intentionally enforced; these are not production SEO scores. LCP candidates in this run were hero images on Home/Technology/Software Careers and text on About/Products/Contact/Apply. Home, Technology, Software Careers, Contact and Apply exceeded the 2.5s LCP target. No before/after comparison or field INP was available, so these are measured limitations rather than attributed regressions. No visual redesign or content delay was introduced to chase the score.

## Remaining gates and scope

- **Performance follow-up:** five measured mobile LCP values above 2.5s; investigate separately with repeated runs and field data before proposing an approved visual or loading change.
- **Production release:** this QA does not establish production CORS, TLS, email delivery, backup/recovery or Render deployment readiness. Follow the existing release gates; no production migrations or business submissions were performed.
- **Review:** this integration result does not authorize merging #56, #57 or #58. Their individual changes and final CI checks still need review.
- **Exclusions:** no chatbot/RAG/Ollama/analytics source changes and no production data access. No new source fix was necessary; this PR is documentation and reproducible evidence only.
