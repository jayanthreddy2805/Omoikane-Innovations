# Production readiness review — 25 November 2026

## Decision

The backend on combined main has passed isolated revalidation. **Production release is still gated** by an approved recovery point and tested restore, verified JDBC TLS and runtime CORS/provider configuration, the unexplained Render auto-deploy gap, and approval for the exact commit and V4/V5 rollout. No production deployment, environment mutation, migration, retention purge or production form submission was performed.

**Task 3 recheck (25 November 2026):** latest main is `994d7c27d2b33249c7a0b3fc0ad8650ccec48bdc`, including merged PRs #48 and #49. This is the exact backend release **candidate, not an approved production commit**. Open mobile PR #50 remains separate. The detailed engineering inventory and first-run evidence below originated with PR #49; the current findings are in this recheck and the updated release procedure. Chatbot components, APIs, RAG, inference and chatbot analytics were excluded from implementation and functional tests.

### Current isolated verification

- Java 21 `./mvnw verify`: **86 tests, no failures/errors/skips**, packaged JAR. The existing disposal harness on PostgreSQL 17.12 passed **six** V3→V5 integration tests: preserved old contact fixture, V4/V5 indexes and Hibernate validation, rollback of Contact/Career plus four outbox jobs, concurrent claim locking, allowed/untrusted CORS, full Admin listing and authenticated résumé bytes. The earlier PR #49 CI also passed its PostgreSQL 18 integration and Docker build; this recheck did not rerun Docker or PostgreSQL 18.
- Browser → packaged Spring Boot → isolated PostgreSQL: Contact **201** and duplicate **409**; Career **201**; consented Newsletter **201** then duplicate **200**; Admin auth/listings/CV download **200**, with exact synthetic PDF bytes. Provider credentials, worker and retention job were disabled in the harness; no external email was sent.
- The frontend business-failure browser suite passed at **375px and 1440px**: form validation/limits, duplicate-click control, upload rejection/retry, newsletter consent and duplicate feedback, Admin failed login/dialog/logout, and cookie choice persistence. Its business requests were stubbed; the separate integrated run above exercised the real isolated API.
- A separate disposable PostgreSQL 17 duplicate fixture deliberately made V4's normalized unique-index migration fail. The transaction left both synthetic rows intact and no partial index. The production read-only duplicate-group aggregate is **zero**; repeat it immediately before release.
- Render's latest live deploy is still `a87d448aae052a7b40502e8d9a5529a5177bdcd3` (`dep-dbq8ks0m7kps738npu7g`, 11 November). The live `/actuator/health` returned `UP` after a free-instance cold start during this recheck. That checks the old workload only. Render reports branch `main`, `autoDeploy=yes`, `checksPass`, but deploy/event lists show no new deploy after 11 November even though main advanced. Verify the Git linkage and rollout control before release; do not assume a merge will or will not deploy.
- Neon production still records successful **V1, V2, V3 only**. The V4 index and V5 outbox table are absent. Neon reports a six-hour project history window, **no snapshots and no automatic snapshot schedule**. A durable backup and isolated restore rehearsal are required before migration; neither has been taken here.
- Source `render.yaml` has the four intended origins. The earlier live public-domain OPTIONS checks were 403, while two Vercel origins passed; preflights were not repeated in this recheck. Runtime CORS, email sender/recipients/API key, admin key, retention flag and `DATABASE_URL` values were not read. Production profile does not enforce a JDBC `sslmode` by itself. The Neon connector's inspection connection is not evidence of Render's TLS mode. Verify the actual Render JDBC connection with hostname validation in the approved release window.
- Safe API error responses and sanitized log messages were reviewed in source. The Render logs connector returned `INVALID_ARGUMENT`, so current application errors cannot be certified from logs in this review. Inspect recent protected logs during the release without copying request bodies or personal records.

## Completed engineering work

| Area | Exact files | Result |
| --- | --- | --- |
| Outbox leases | `backend/src/main/java/com/omoikane/api/email/{EmailOutbox,EmailDeliveryJobRepository,EmailDeliveryWorker}.java` | Skip-locked claims; atomic completion requires matching job, attempt and PROCESSING state. A stale worker cannot finish/retry a recovered attempt. |
| PostgreSQL admin listing | `backend/src/main/java/com/omoikane/api/careers/{CareerApplicationListItem,CareerApplicationSummary}.java` | Normalize native PostgreSQL Instant and H2 OffsetDateTime results. Full PostgreSQL admin listing previously returned 500; it now passes. The query still returns résumé byte counts without selecting binary payloads. |
| Server phone validation | `backend/src/main/java/com/omoikane/api/common/dto/PhoneNumbers.java`, `contact/ContactService.java`, `careers/CareerApplicationService.java` | Optional phone values are format-checked before persistence/outbox writes. Formatting characters remain accepted; this is not verification of number ownership. |
| Compatible dependency updates | `backend/pom.xml` | Boot 3.5.16, Tomcat 10.1.62, PostgreSQL JDBC 42.7.15, Log4j 2.26.1, Jackson BOM 2.21.9. No major framework migration or new application dependency. |
| Backend regression coverage | `backend/src/test/java/com/omoikane/api/email/{EmailOutboxIntegrationTest,PostgresReadinessIT}.java`, `contact/ContactServiceTest.java`, `careers/CareerApplicationServiceTest.java` | Stale leases, invalid phone rejection, V3→V5 upgrade, row locking, atomic rollback, API validation, production-origin CORS, complete listings and authenticated downloads. |
| Isolated validation | `backend/scripts/verify-postgres.sh`, `.github/workflows/backend-tests.yml` | Disposable loopback-only PostgreSQL harness and optional browser-to-API tests. CI also provisions PostgreSQL 18 for the explicit integration test. |
| Form limits and upload recovery | `frontend/src/components/features/{contact/ContactForm,apply/ApplyForm}.jsx`, `frontend/src/components/shared/{InternationalPhoneInput,FileUpload}.jsx` | Field limits match the API, including the contact enquiry prefix. Invalid phones block native submission. Invalid/empty/oversize résumé choices are rejected; invalid drops clear stale files. Upload controls have accessible names and announced errors. |
| Privacy focus | `frontend/src/components/features/privacy/CookiePreferences.jsx` | Focus transfers synchronously when opening preferences so immediate keyboard input stays within the dialog. |
| Admin usability | `frontend/src/app/admin/page.jsx`, `frontend/src/components/shared/AccessibleDialog.jsx` | API fallback matches public forms; detail/delete dialogs receive and contain focus, support Escape and restore the opener. Admin keys remain in memory. |
| Initial media and reduced motion | `frontend/src/components/features/about/AboutHero.{jsx,module.css}`, `frontend/src/components/features/expertise/ExpertiseHero.tsx` | Responsive server-visible About preview; no automatic company-film fetch with reduced motion; explicit playback works. Expertise background remains visible before hydration while retaining its zoom animation. Original image/video assets are unchanged. |
| Public accessibility | `frontend/src/app/about/page.js`, `frontend/src/app/apply/{ApplyClient.jsx,page.module.css}`, `frontend/src/components/features/careers/CareerTemplate.jsx`, `frontend/src/components/features/expertise/AerospaceVideoSequence.tsx`, `frontend/src/components/features/home/{SelectedWork.module.css,TechnologyEngineering.jsx}`, `frontend/src/components/features/work/WorkClient.jsx` | Keyboard-accessible carousel, valid roles/navigation labels, visible-text-compatible names, corrected heading semantics and readable project-number contrast using the existing palette. |
| Frontend checks | `frontend/scripts/{audit-performance,verify-business-workflows,verify-integrated-api,verify-public-pages,verify-initial-media,verify-indexing}.mjs`, `validate-site-contracts.mjs`, `.github/workflows/frontend-checks.yml`, `frontend/.gitignore` | Reproducible performance, responsive, no-JS media, indexing and workflow checks. Business test interception prevents production writes. Optional contract-test flag excludes chatbot source checks during this audit. |

## Verification results

- `npm ci`, `npm run lint`, `npx tsc --noEmit`, `SITE_AUDIT_EXCLUDE_CHATBOT=1 npm test`, `npm run build`: passed.
- `./mvnw --batch-mode --no-transfer-progress verify` under Java 21: **86 tests, zero failures/errors/skips**, deployable JAR built. This executor additionally needed its network proxy/trust settings and an explicit Byte Buddy agent; those are test-environment settings.
- `backend/scripts/verify-postgres.sh`: **six PostgreSQL integration tests passed** against disposable PostgreSQL 17.12, including real Flyway migration from seeded V3 to V5, schema validation, locked-row concurrency and the complete admin projection. CI PostgreSQL 18 is an added check, not a claim of a completed local PostgreSQL 18 run.
- The optional browser integration mode passed Contact creation/duplicate rejection, multipart Career submission, consented Newsletter creation/duplicates, authorized Admin listings and exact résumé byte download against the real packaged API and isolated database. Provider sending and retention were explicitly disabled.
- All **75 public page/viewport combinations** passed status, overflow, single-H1, anchor and runtime checks; axe scans at 390/1440 found zero serious/critical violations. See `FINAL_QA_REPORT.md` for scope and limits.
- Existing `verify-performance.mjs` and its smoke audit passed metadata/routes, typography, responsive component trees, sequence transitions, flags and reduced motion. New no-JavaScript tests passed initial hero visibility on Home/About/Expertise.
- Production/preview metadata, sitemap and robots functions passed `verify-indexing.mjs` independently. Local preview intentionally remains noindex.

## Migration and delivery review

V5 is additive: one outbox table and a partial due-job index, unique `(kind, submission_id)`, no copies of messages, addresses or CV bytes. Contact/Career records and jobs use one transaction; rollback removes both. Claims and completion use short independent transactions, outside external HTTP requests. Existing bounded retries, five-minute leases, four-attempt limit, timeout handling and deterministic provider idempotency keys remain. Exactly-once email delivery is not promised.

V4 is also pending on production. Its unique normalized contact index can fail when old duplicates exist. The read-only aggregate preflight returned **zero duplicate groups**; recheck at rollout and do not delete submissions automatically. Flyway checksums/migrations were not edited. The isolated seeded V3 upgrade preserved the existing enquiry and validated all five migrations.

The projection fix was found by running the packaged application on PostgreSQL, not by assuming H2 behavior. The new regression invokes the whole Admin listing as well as measuring résumé size and downloading its bytes.

## Live state observed

| Check | Actual result | Consequence |
| --- | --- | --- |
| Render latest live deploy | `a87d448aae052a7b40502e8d9a5529a5177bdcd3` | Candidate backend behavior is not live. |
| Neon production history | Successful V1, V2, V3 only | Release will execute V4 and V5. |
| Live `/actuator/health` | 200, UP on the old workload | Does not verify this candidate. |
| OPTIONS from www and non-www public domains (earlier audit) | 403, no allowed-origin header | Recheck live CORS after the approved runtime update; this task did not repeat preflights. |
| OPTIONS from the two Blueprint Vercel origins (earlier audit) | 200 with matching allowed origin | Recheck after release. |
| OPTIONS from untrusted.example (earlier audit) | 403 | Recheck the rejection after release. |

The source `render.yaml` already has the correct four origins; it was not rewritten. The exact runtime change and release steps are in `backend/PRODUCTION_RELEASE.md`.

## Security and privacy

`npm audit --json` reported zero vulnerabilities. OSV runtime dependency scanning initially found 92 package/advisory matches across 18 artifacts. After compatible upgrades it finds **two matches in Spring WebMVC 6.2.19**, across 85 runtime artifacts scanned. Counts are advisory matches, not 92 independently exploitable application flaws.

The remaining advisories are [CVE-2026-47890](https://spring.io/security/cve-2026-47890/) (SSE view fragments) and [CVE-2026-47884](https://spring.io/security/cve-2026-47884/) (XsltView with implicit wildcard view rendering). This business API uses REST controllers and neither feature/configuration. That applicability assessment must be revisited if rendering capabilities are added. The vendor lists fixed Spring 6.2.20 as enterprise-only; decide a maintained platform/enterprise upgrade path rather than claiming a clean dependency scan or introducing a broad unreviewed major migration here.

Upload extension/signature checks, bounded DOCX expansion, server validation, honeypots, per-IP limiting, authenticated CV access, safe error responses and security/CSP headers were reviewed. Rate limiting remains local to the single instance; review shared storage before scaling. No personal submissions were read from Neon, and no provider email was sent during validation.

Retention is opt-in and disabled by default, with positive explicit cutoffs required before activation. Tests and the isolated running API kept it disabled. Live host values were not read, so the approved rollout must explicitly confirm disabled retention. Backup expiry, newsletter/outbox metadata and already-delivered email attachments still require owner policy decisions. Malware scanning remains an outstanding service/policy decision.

## Outstanding release work

1. Approve and execute the reviewed production environment/release/backup procedure; then verify the actual commit, migrations, public-domain CORS and provider delivery.
2. Keep open mobile PR #50 separate. Combined PR #48/#49 mobile checks are in `FINAL_QA_REPORT.md`; a later mobile release is a separate decision.
3. Several mobile LCP results remain above requested targets. No field INP or real-device result is claimed. See `MOBILE_PERFORMANCE_REPORT.md`.
4. Complete physical-device Safari/virtual-keyboard and production load/cold-start tests. The current Render free-instance profile has not been load-certified here.
5. Resolve the company/legal/production-authority items in `OWNER_TODO.md` and the maintained Spring upgrade path described above.
