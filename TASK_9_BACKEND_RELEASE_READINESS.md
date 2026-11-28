# Task 9 — verified release status (28 November 2026 IST)

**Production release is not complete.** The signed-in Render dashboard is now inspected. No production configuration, deployment, migration, real submission or provider email was executed. The owner separately approved only the named Neon recovery drill.

## Current deployment and database mapping

| Resource | Verified state |
|---|---|
| GitHub main | `93aa7cc3148cfb6781b4e738774ee298af2884ff`, merged frontend PR #76 |
| Tested application / CI | PR #65 application/test commit `961e0a665716bd60e0dabba59ef7c91a4044e628`; frontend and backend CI both successful |
| Render service | `srv-dbpjehei0phs73ac8s0g`, `omoikane-api`, Docker Free/Singapore |
| Render live deployment | `dep-dbq8ks0m7kps738npu7g`, commit `a87d448aae052a7b40502e8d9a5529a5177bdcd3` |
| **Render-connected database** | Endpoint `ep-lingering-dew-aoqs32ya` maps to **`prelaunch-api-test-20261110`**, branch `br-falling-poetry-aoabyynd`; **not the default production branch** |
| Default production database | `production`, branch `br-plain-brook-aolmdy63` |
| Restored recovery copy | `release-restore-20261128`, branch `br-square-recipe-aolpoi1z`, restored from **production**, not the Render-connected branch |

**Owner target decision:** keep Render connected to `prelaunch-api-test-20261110` and prepare the remaining testing work (confirmed in chat after the target recommendation). No production cutover is selected. The successful production recovery drill does **not** prove recovery of this prelaunch database. This decision does not authorize snapshot/branch creation, migrations, deployment or email tests. See [the concrete prelaunch plan](TASK_9_PRELAUNCH_EXECUTION_PLAN.md).

SELECT-only verification of the Render-connected branch found V1–V4 successful (checksums `1837152950`, `-2140903011`, `813506622`, `119225282`), no V5/outbox table, and zero duplicate normalized-contact groups. Default production and its restored copy remain at V1–V3. No migration was applied during this work.

## Signed-in Render configuration findings

| Check | Observed result | Consequence / proposed next action |
|---|---|---|
| Source/build | Expected GitHub repository, branch main, blank root directory, Dockerfile `./backend/Dockerfile`, context `./backend`; Git credentials assigned; no included/ignored path filters | Settings verified. Assignment of credentials does not establish GitHub App/check-event delivery. |
| Deploy controls | **After CI Checks Pass**, health path `/actuator/health`; no newer build/deploy attempt observed after Nov 11 | Do not trigger deployment to diagnose the integration. Exact cause remains unproven. |
| Blueprint | `exs-dbpive8u01pc738ufdm0`, autoSync true, main / render.yaml, API status **error**, lastSync `2026-11-10T15:24:56.906624Z` | Dashboard shows failed sync `exe-dbpj95nf3r2c738ahmr0` at commit `05c4d2b8967533bf42b5f16d5e116054f27d9dd6`, failed “Create web service omoikane-api”. No detailed cause is displayed. This historical failure is not proof of the later auto-deploy gap's cause. No sync/apply was issued. |
| Database TLS | JDBC/direct Neon endpoint, `neondb`, credentials supplied separately; `sslmode=require` | Encryption required, but pgJDBC certificate/hostname validation gate is **not met**. Propose `sslmode=verify-full` with validated CA trust in the deployed Java image; verify before any configuration approval. Do not blindly change the URL. |
| CORS | Current Vercel alias present; additional existing Vercel preview origins present | Runtime preflight passed for approved alias; untrusted origin rejected. No origin changed. |
| Admin URL | HTTPS approved Vercel alias, path `/admin`, no query | Destination verified; production authenticated Admin journey still pending approved testing. |
| Email | Sender configured on **resend.dev** sandbox; one notification recipient configured; API-key variable present | Sandbox is limited to the Resend account's own email. General client-recipient delivery cannot be signed off. No secret credential value was read and no message was sent. |
| Additional env sources | No linked environment groups; Secret Files section showed no files | Ten service variable keys observed. No Edit/Export/Copy control used. |

Environment values were revealed only as needed for derived configuration facts and then remasked. No passwords, admin secret, API key, raw recipient address or record bodies are included in this report/evidence. The dashboard was reloaded to clear revealed values.

[Failed Blueprint sync](https://dashboard.render.com/blueprint/exs-dbpive8u01pc738ufdm0/sync/exe-dbpj95nf3r2c738ahmr0) · [Safe runtime evidence](release-evidence/TASK9_20261128/render-runtime-audit.json)

## Live API verification

Read-only checks completed **28 November 2026, 14:42–14:43 IST** against `https://omoikane-api.onrender.com`:

- `GET /actuator/health`: HTTP **200**, status **UP**, liveness/readiness groups returned.
- `OPTIONS /api/contact`, origin `https://omoikane-innovations-3h7t.vercel.app`, requested POST/content-type: HTTP **200**, exact `Access-Control-Allow-Origin` matched.
- Identical OPTIONS using `https://untrusted.example`: HTTP **403**, “Invalid CORS request”, no allow-origin.
- These checks create no submission or email. They do not validate production Contact/Apply/Newsletter persistence, authentication or recipient delivery.

## Completed recovery and isolated verification

- **Owner-approved Neon drill completed:** snapshot `snap-plain-credit-ao61q7xz` / `omoikane-pre-v4v5-20261128`, source default production `br-plain-brook-aolmdy63`. Created **28 Nov 04:40:43 IST**, expires **5 Dec 05:30 IST**.
- Restored using `finalize=false` into non-default/non-primary `release-restore-20261128`; production stayed unchanged. Read-only Flyway versions/checksums/success, counts, résumé byte total and aggregate SHA-256 matched. The restored branch remains retained; cleanup needs its own decision.
- No record bodies or résumé bytes were exported to the workspace/repository/logs. [Recovery receipt](release-evidence/TASK9_20261128/neon-recovery.json).
- **95 backend/SQL tests passed:** 88 Maven tests plus seven real PostgreSQL integration tests, including Newsletter consent, duplicates, unsubscribe, token rotation and reactivation.
- **PostgreSQL 18 custom-format dump/restore rehearsal passed** on synthetic data, checking migrations/checksums, counts, résumé bytes/SHA-256, indexes and partial-index behavior.
- **Browser → real isolated Spring Boot → PostgreSQL passed:** Contact/duplicates, Apply multipart résumé, Newsletter consent/duplicates, authenticated Admin listings and exact résumé download bytes.
- **Container build passed.** Frontend npm ci, lint, TypeScript, indexing/site/About-film/protected UI checks and production build passed.
- [Backend CI](https://github.com/jayanthreddy2805/Omoikane-Innovations/actions/runs/46084144646) and [Frontend CI](https://github.com/jayanthreddy2805/Omoikane-Innovations/actions/runs/46084144619) both confirmed successful on `961e0a665716bd60e0dabba59ef7c91a4044e628`. Later documentation-only commits do not change the tested application.
- CI is loopback-only with synthetic records/credentials; provider/worker and retention disabled. Playwright 1.65.1 is pinned outside app dependencies. Vercel automatic deployment is disabled on this review branch.

## Remaining decisions and controlled sequence

1. **Target chosen: retain current prelaunch branch for testing.** Do not switch to production, overwrite either branch or merge its submission data.
2. Ensure a verified recovery point for that exact target. The existing drill covers production only. Snapshot/branch creation, restoration or migrations require their own explicit authorization.
3. Validate certificate/hostname verification with appropriate CA trust; prepare exact minimal TLS and deployment-control changes. Review the Blueprint/Git check-event integration without issuing a deployment or manual sync.
4. Confirm an approved sender/recipient plan. General delivery needs a verified sender domain; no DNS/domain changes are authorized. Sandbox-only tests require the matching account's own address and explicit test-message approval.
5. Once gates pass, obtain separate exact-commit, configuration and release-window approval. Startup Flyway applies only the target's missing migrations (prelaunch: V5; production: V4/V5); do not run a second migration sequence.
6. Verify live SHA, Flyway success, health/CORS, approved synthetic Contact/Apply/résumé/Newsletter/Admin flows, outbox/provider acceptance and delivery, then owner sign-off. Code rollback does not undo schema changes or sent email.

**NO-GO for production rollout.** The testing target is chosen; target-specific recovery, TLS, integration and email gates remain. Read-only preparation is complete to the extent currently verifiable; no deployment authorization is inferred from dashboard login.

No merge, production configuration change, migration, deployment, production form submission/email, DNS/WordPress/custom-domain, chatbot/RAG/Ollama, photographs/claims/leadership/legal-policy changes.

---

## Historical read-only assessments

Older “no snapshot” statements below predate the expressly approved successful drill above.

# Task 9 — backend release readiness / no-production-change review

**Checked:** 26 November 2026. **GitHub main:** `e726be8be0801aaa17bef6cc5dc871f949fbba97`.
**Scope:** Read-only GitHub Actions, Render service/deploy/event history, Neon project/branch/snapshot metadata and SELECT-only migration/duplicate preflight. **Status: NO-GO for production deployment.**

## Verified facts

| Gate | Evidence | Status |
| --- | --- | --- |
| G1: source and CI | GitHub main `e726be8be0801aaa17bef6cc5dc871f949fbba97`, no open PRs at inspection. Latest frontend CI on that SHA succeeded. Last backend CI succeeded on `f28df64bd2636bd0bfe8ebf9b3f7d21409874665`. GitHub compare `f28df64...e726be8` includes **zero backend file changes**; the passing backend run covers current backend source. | Ready for review; no operational sign-off |
| G2: Render service | `omoikane-api` / `srv-dbpjehei0phs73ac8s0g`, connected to repository `main`, `autoDeploy=yes`, `autoDeployTrigger=checksPass`, health path `/actuator/health`. | **Unexplained auto-deploy gap** |
| G3: live deployment | Render live `dep-dbq8ks0m7kps738npu7g` on `a87d448aae052a7b40502e8d9a5529a5177bdcd3` from Nov 11. Events since Nov 10 show deployment/build activity only through Nov 11; last deployment triggered by env update. **No subsequent deploy attempt or failure event** in the checked history. | **BLOCKED**. Investigate Render Git integration/checks and deployment controls *without triggering a deploy* |
| G4: database status | Neon project `curly-darkness-86465014`, PostgreSQL 18, production branch `br-plain-brook-aolmdy63`; Flyway V1,V2,V3 successful. | V4/V5 pending |
| G5: V4 preflight | SELECT-only grouped normalized email/phone expression `lower(trim(email)), coalesce(trim(phone), '')` returns **0 duplicate groups**. | Positive snapshot; must repeat at release |
| G6: recovery | Neon snapshots returned **none**; PITR project history `21600` seconds (6h); no successful durable backup or isolated restore test is recorded. | **BLOCKED**. Do not deploy/migrate |
| G7: V4 source | `V4__unique_contact_details.sql` creates unique normalized-contact index matching preflight expression. | Source reviewed; unapplied |
| G8: V5 source | `V5__email_delivery_outbox.sql` adds `email_delivery_jobs` and due-job index. No record/CV content copied into jobs. | Source reviewed; unapplied |
| G9: frontend | Vercel currently on GitHub main, Vercel alias used pending client permission for custom domain. | Do not change WordPress, DNS, or custom-domain configuration |
| G10: runtime config | Production `application-prod.properties` requires DATABASE_URL/USERNAME/PASSWORD, ADMIN_SECRET_KEY and CORS_ALLOWED_ORIGINS. Source cannot prove *actual Render env* TLS mode, sender, recipients, CORS or other secret-backed settings. | **Unverified**, inspect safely inside authorized operator UI without disclosing values |

## Why no automatic deployment? Current evidence and next investigation

**Verified:** Render service settings request auto-deploy on passing checks, but no successful/failed new deploy appears since Nov 11. The two recent GitHub workflows are path-filtered: `backend-tests.yml` runs only on `backend/**` or workflow-file changes; `frontend-checks.yml` similarly runs on frontend paths. The current backend is covered by a passing workflow on the last backend-containing main commit; later main commits are frontend/docs only.

**Not proven:** the specific reason Render did not deploy. Do **not** label it a failed build, webhook malfunction, or missing GitHub permission without Render/Git-host evidence. Verify (via Render dashboard and GitHub App integration, not by issuing a deploy):
1. Whether Render still has the correct repository installation and webhook/event permission.
2. What `checksPass` considers required checks for this service, including path-filtered workflow behavior and any missing/pending checks.
3. Whether an ignore-build rule, paused deployment state, service-specific settings or account limits override apparent auto-deploy configuration.
4. Explicit operator-controlled deployment/auto-deploy suspension plan **before** any future GitHub merge, environment edit or manual deploy.

## Mandatory NO-GO gates before owner approval

- Select exact reviewed backend SHA and verify release operator, maintenance window and deploy trigger behavior.
- Establish encrypted durable recovery point (or approved equivalent), access controls, checksum and a **successful isolated restore rehearsal**. Neon PITR history is insufficient evidence. Never copy applicant PII into GitHub or public logs.
- Verify direct PostgreSQL connection/TLS with hostname validation and intended production Neon branch, without revealing credentials.
- Repeat read-only V4 normalized duplicates and Flyway history immediately before any migration.
- Verify runtime exact origin allow-list for **current Vercel alias**; custom domains remain client-blocked. Validate admin key handling, notification recipients/sender and email worker behavior without printing secrets.
- Approve V4/V5 migration impact, provider idempotency limitations, old-backend compatibility, rollback authority and restoration policy.
- Require **separate explicit owner authorization** for actual Render deploy, any prod configuration change, backup creation, branch/snapshot creation, test submissions or schema migration.

## Approved-release sequence (NOT executed)

1. Authorize and verify recovery; perform encrypted backup and successful isolated restore in a controlled environment.
2. Confirm selected commit, runtime settings, release controls and live service health; repeat SELECT-only preflight.
3. During separately approved change window, perform exactly one controlled Render backend deployment. App startup runs Flyway V4 and V5; **do not run migrations separately**.
4. Confirm Render live SHA, Flyway success, `/actuator/health`, privacy-safe logs, Vercel-origin OPTIONS, blocked untrusted origin, approved synthetic Contact/Career/Newsletter/Admin/resume and outbox/provider delivery flows.
5. Record rollback decision and outbox state; rolling back Render code **does not undo migrations or sent email**. Do not use Flyway clean/repair to bypass errors.

## Exclusions and actions

No DNS/WordPress/custom domain action, chatbot/RAG/Ollama/analytics change, client content/legal policy change, production write, migration, backup/snapshot creation, service config change, deploy, or synthetic email sent during this assessment.

This document updates the stale baseline in `backend/PRODUCTION_RELEASE.md` and `RELEASE_ACCEPTANCE_CHECKLIST.md` **without overriding their owner-approval requirements**. Review this document before using the historical candidate SHAs or old PR statuses in those files.

**Final decision: NO-GO** until verified backup/restore, controlled Render deployment mechanism and runtime configuration are proven, then obtain the owner's separate execution approval.

## Fresh read-only update — 28 November 2026 (IST)

This is a **new verification**, superseding this document's dated baseline only where the live values differ. No release operation or environment setting has been changed.

- **GitHub:** latest `main=047478fa1b61e7ab3cad22ce4a522b7dce6dea86`. Latest frontend workflow succeeded on that SHA. The latest observed **backend tests succeeded** on `7984402b33442283f5f88d743a7d3697882af843`; GitHub compare from that SHA to current main lists **no changed files**. PR #65 is open and documentation-only. Do not use the older `e726be8` baseline as the release candidate without reviewing the actual new main.
- **Vercel:** the production deploy for `047478fa...` is READY; the active frontend remains the Vercel project, not the unapproved custom domain.
- **Render:** same live deploy `dep-dbq8ks0m7kps738npu7g` at `a87d448aae052a7b40502e8d9a5529a5177bdcd3`. `main`, `autoDeploy=yes`, `autoDeployTrigger=checksPass`, health path `/actuator/health` remain configured. A fresh event-history query from 10 Nov onward finds no deploy/build attempt later than **11 Nov**. The underlying Git/check-event integration cause is **not yet established**: do not toggle controls or manually deploy just to test it.
- **Neon:** production branch `br-plain-brook-aolmdy63`, PostgreSQL 18; Flyway V1–V3 success, V4/V5 not yet applied. SELECT-only preflight found **0 duplicate normalized-contact groups**. Neon API lists **0 snapshots**; history retention is **21600 seconds (6 hours)**. No encrypted durable backup and successful isolated restore has been demonstrated.
- **Live API CORS:** NOT freshly verified in this update. An external preflight request could not establish a connection from the available execution environment; do not interpret that as an API error or a positive CORS check. Confirm allowed origin for `https://omoikane-innovations-3h7t.vercel.app` at release time; custom domains stay out of scope.

**Decision stays NO-GO.** Additional gates required before a separately approved production deployment: verified backup plus restore rehearsal; confirmed operator-controlled Render Git/deploy mechanism; actual runtime TLS/CORS/email/admin configuration review without revealing secrets; agreed exact release SHA and window. Flyway V4/V5 may run at application startup, so do not deploy to bypass these gates. No DNS/custom-domain/WordPress, chatbot, or client content changes are authorized.
