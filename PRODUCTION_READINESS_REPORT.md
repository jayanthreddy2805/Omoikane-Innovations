# Production readiness review — 25 November 2026

## Decision

Candidate changes are ready for code review. **Production release is still gated** by the live CORS configuration, approved V4/V5 rollout/backup, remaining mobile performance gaps and owner policy/content decisions. No production deployment, environment mutation, migration, retention purge or production form submission was performed.

Based on latest main `135227d93c12a3cad040b169798139b1d4e9c09d` (PR #47). PR #48 remains a separate, open mobile-polish change; it has not been merged into this branch or duplicated. Test the combined result when that work is approved. Chatbot components, APIs, RAG, inference and chatbot analytics were excluded from implementation and functional tests.

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
| OPTIONS from www and non-www public domains | 403, no allowed-origin header | Public-domain forms remain blocked until the approved environment/release update. |
| OPTIONS from the two Blueprint Vercel origins | 200 with matching allowed origin | These existing preview origins pass. |
| OPTIONS from untrusted.example | 403 | Unapproved origin remains blocked. |

The source `render.yaml` already has the correct four origins; it was not rewritten. The exact runtime change and release steps are in `backend/PRODUCTION_RELEASE.md`.

## Security and privacy

`npm audit --json` reported zero vulnerabilities. OSV runtime dependency scanning initially found 92 package/advisory matches across 18 artifacts. After compatible upgrades it finds **two matches in Spring WebMVC 6.2.19**, across 85 runtime artifacts scanned. Counts are advisory matches, not 92 independently exploitable application flaws.

The remaining advisories are [CVE-2026-47890](https://spring.io/security/cve-2026-47890/) (SSE view fragments) and [CVE-2026-47884](https://spring.io/security/cve-2026-47884/) (XsltView with implicit wildcard view rendering). This business API uses REST controllers and neither feature/configuration. That applicability assessment must be revisited if rendering capabilities are added. The vendor lists fixed Spring 6.2.20 as enterprise-only; decide a maintained platform/enterprise upgrade path rather than claiming a clean dependency scan or introducing a broad unreviewed major migration here.

Upload extension/signature checks, bounded DOCX expansion, server validation, honeypots, per-IP limiting, authenticated CV access, safe error responses and security/CSP headers were reviewed. Rate limiting remains local to the single instance; review shared storage before scaling. No personal submissions were read from Neon, and no provider email was sent during validation.

Retention is opt-in and disabled by default, with positive explicit cutoffs required before activation. Tests and the isolated running API kept it disabled. Live host values were not read, so the approved rollout must explicitly confirm disabled retention. Backup expiry, newsletter/outbox metadata and already-delivered email attachments still require owner policy decisions. Malware scanning remains an outstanding service/policy decision.

## Outstanding release work

1. Approve and execute the reviewed production environment/release/backup procedure; then verify the actual commit, migrations, public-domain CORS and provider delivery.
2. Review PR #48 and repeat combined mobile/short-screen checks when approved. It addresses the tall first-visit banner/CTA overlap separately.
3. Mobile Expertise performance and several mobile LCP results remain above requested targets. No field INP or real-device result is claimed. See `MOBILE_PERFORMANCE_REPORT.md`.
4. Complete physical-device Safari/virtual-keyboard and production load/cold-start tests. The current Render free-instance profile has not been load-certified here.
5. Resolve the company/legal/production-authority items in `OWNER_TODO.md` and the maintained Spring upgrade path described above.
