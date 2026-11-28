# Task 9 — approved prelaunch rollout blocked (28 November 2026 IST)

**The full release list is not complete.** The owner approved the controlled prelaunch rollout and accepted the verified branch checkpoint alternative. Automatic deployment was paused and the exact approved TLS/worker configuration was saved. Two pinned-commit builds then failed **before application startup** because Maven Central returned HTTP **429 Too Many Requests**. No new application became live and no V5 migration ran.

## Executed rollout and current blocker

| Item | Verified outcome |
|---|---|
| Authorization | Owner's “ok proceed” followed the concrete exact-commit/configuration/V5 proposal. It accepts prelaunch checkpoint `br-polished-band-aorkbxle`; it does not authorize a production DB switch, form submissions or emails. |
| Blueprint controls | `exs-dbpive8u01pc738ufdm0`: `autoSync=false`, status paused; no sync/plan/apply issued. |
| Service controls | `srv-dbpjehei0phs73ac8s0g`: autoDeploy no / trigger off; existing Free plan retained. |
| TLS setting saved | Same prelaunch host/`neondb`, `sslmode=verify-full&sslfactory=org.postgresql.ssl.DefaultJavaSSLFactory`; no inline credentials. Read back successfully. |
| Worker settings saved | Added `SPRING_APPLICATION_JSON={"app":{"email":{"worker-enabled":false},"retention":{"enabled":false}}}`. Existing ten keys preserved. |
| Save semantics | Used **Save only**, then manually selected the exact approved commit. Saved values await a successful deploy; **they are not active in the old live release**. |
| Build 1 | `dep-dc5adsmi0phs73d1b4pg`, exact `93aa7cc3148cfb6781b4e738774ee298af2884ff`; 15:33:30–15:34:38 IST; build_failed. |
| Cooldown retry | `dep-dc5agqh7lnhs73b96vs0`, same exact SHA, cache preserved; 15:39:46–15:40:50 IST; build_failed. One retry after approximately 308 seconds from the first failure. No further deploy triggered. |
| Failure | Both failed resolving `org.springframework.boot:spring-boot-starter-parent:pom:3.5.16` from `https://repo.maven.apache.org/maven2`: HTTP 429. Neither reached startup/Flyway. |
| Previous live service | Remains `dep-dbq8ks0m7kps738npu7g` / `a87d448aae052a7b40502e8d9a5529a5177bdcd3`; health HTTP **200 / UP** at **15:40:21 IST**. This health check validates the previous release, not the failed candidate. |
| Data / schemas | Prelaunch remains V1–V4; outbox absent. Default production remains V1–V3. Business counts, résumé byte total and aggregate checksum matched the pre-rollout fingerprint. No migration, submission, test email, data deletion or production DB connection change. |

[Safe rollout receipt](release-evidence/TASK9_20261128/prelaunch-rollout-attempt.json) · [Failed pinned retry](https://dashboard.render.com/web/srv-dbpjehei0phs73ac8s0g/deploys/dep-dc5agqh7lnhs73b96vs0)

Maven Central's [rate-limit guidance](https://central.sonatype.org/faq/429-error/) recommends reducing repeated dependency traffic/caching instead of aggressive retries. This attempt did not change dependency versions, repository endpoints, network paths or approved source, and did not clear build cache.

## Current deployment and database mapping

| Resource | Verified state |
|---|---|
| GitHub main | `93aa7cc3148cfb6781b4e738774ee298af2884ff`, merged frontend PR #76 |
| Tested application / CI | CI passed on `6e2cfec2bf1e4e463ee6567f3db2660b83a6c61b`; its backend application/POM/Dockerfile match approved main candidate `93aa7cc3148cfb6781b4e738774ee298af2884ff`. Later evidence commits do not change the tested application. |
| Render service | `srv-dbpjehei0phs73ac8s0g`, `omoikane-api`, Docker Free/Singapore |
| Render live deployment | `dep-dbq8ks0m7kps738npu7g`, commit `a87d448aae052a7b40502e8d9a5529a5177bdcd3` |
| **Render-connected database** | Endpoint `ep-lingering-dew-aoqs32ya` maps to **`prelaunch-api-test-20261110`**, branch `br-falling-poetry-aoabyynd`; **not the default production branch** |
| Default production database | `production`, branch `br-plain-brook-aolmdy63` |
| Restored recovery copy | `release-restore-20261128`, branch `br-square-recipe-aolpoi1z`, restored from **production**, not the Render-connected branch |

**Owner target decision:** keep Render connected to `prelaunch-api-test-20261110` and prepare the remaining testing work (confirmed in chat after the target recommendation). No production cutover is selected. The successful production recovery drill does **not** prove recovery of this prelaunch database. The later prelaunch recovery authorization allowed a named snapshot/isolated copy. Neon rejected the snapshot for this child branch; the approved private-copy scope produced a verified branch checkpoint, **not a snapshot restore**. The owner accepted this recovery alternative and separately approved the exact prelaunch settings/deploy/V5 proposal. Email/form tests and a production database switch remain unapproved. The approved deploy attempts are blocked before startup as recorded above. See [the concrete prelaunch plan](TASK_9_PRELAUNCH_EXECUTION_PLAN.md).

SELECT-only verification of the Render-connected branch found V1–V4 successful (checksums `1837152950`, `-2140903011`, `813506622`, `119225282`), no V5/outbox table, and zero duplicate normalized-contact groups. Default production and its restored copy remain at V1–V3. No migration was applied during this work.

## Signed-in Render configuration findings

| Check | Observed result | Consequence / proposed next action |
|---|---|---|
| Source/build | Expected GitHub repository, branch main, blank root directory, Dockerfile `./backend/Dockerfile`, context `./backend`; Git credentials assigned; no included/ignored path filters | Settings verified. Assignment of credentials does not establish GitHub App/check-event delivery. |
| Deploy controls | **Off** after approved pause; health `/actuator/health` retained. Two manual pinned builds failed on upstream Maven 429. | Previous deploy remains live. No repeated retry loop or cache clearing. |
| Blueprint | `exs-dbpive8u01pc738ufdm0`, main / render.yaml, **autoSync false / paused**. Historical Nov 10 create-service sync error remains documented. | No Blueprint apply issued. The historical auto-deploy gap's cause remains unproven; current release uses approved manual controls. |
| Database TLS | Strict URL verified in runtime-image CI and saved/read back on Render with `verify-full` / `DefaultJavaSSLFactory`. | Saved-only setting is **not active** on the previous running release; both new builds failed before startup. |
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

## Verified prelaunch checkpoint and TLS update

Snapshot creation for selected prelaunch was rejected (HTTP 400 / `INVALID_ARGUMENT`: “not allowed to snapshot non-root branch”). **No prelaunch snapshot exists and the snapshot/restore drill is not completed.** The approved same-project isolated-copy scope was used to create branch checkpoint `prelaunch-restore-20261128` / `br-polished-band-aorkbxle`, parent prelaunch, ready/non-default/non-primary, capped at 0.25 CU. Source stayed stable; Flyway V1–V4/checksums/success, record counts, résumé byte totals and aggregate checksums all matched the copy. It remains retained; no snapshot-expiry claim applies to it.

Both CI workflows passed on `6e2cfec2bf1e4e463ee6567f3db2660b83a6c61b`. Backend runtime-image TLS preflight verified trusted chain, correct hostname and rejection of wrong hostname (TLSv1.3 / pgJDBC 42.7.15), without authenticating or sending SQL. The 95 backend/SQL tests, PG18 restore, isolated browser/API/database journeys and container build also passed. Compare to main `93aa7cc3148cfb6781b4e738774ee298af2884ff` confirms identical backend application source, POM and Dockerfile.

[Safe checkpoint/TLS evidence](release-evidence/TASK9_20261128/prelaunch-checkpoint-and-tls.json) · [Controlled prelaunch proposal](TASK_9_PRELAUNCH_EXECUTION_PLAN.md). The owner accepted the checkpoint alternative and approved the exact prelaunch settings/deploy/V5 proposal. Those builds failed before startup; the saved settings await a successful deploy. Render remains on the old live deploy and no new worker/email/data flow was activated.

## Remaining controlled steps

1. Resolve the dependency-download block before another build. Do not repeatedly redeploy into the same 429, bypass limits or clear usable caches. The original exact-commit/configuration approval remains recorded; no additional automatic retry is scheduled.
2. Before resuming the same approved candidate, recheck main, target, recovery coverage and Flyway history. Stop if main/history drifted. A different commit, build-source method, repository setting or broader configuration change needs a concrete reviewed proposal and updated execution approval.
3. A successful deployment must apply V5 **once at startup**, then verify live SHA, migration checksum `-1392285325`, health/CORS and disabled delivery/retention workers. Do not run a manual duplicate migration.
4. Deployed-service Contact/Apply/Newsletter/Admin/résumé journeys need approved synthetic identities and write scope; real provider delivery needs approved recipients/sender plan. Current sender remains `resend.dev` sandbox.
5. Production database migration/cutover and final production sign-off remain separate. No full-list completion is claimed.

No merge, DNS/WordPress/custom-domain, chatbot/RAG/Ollama, photographs/claims/leadership/legal-policy changes. The original production recovery and isolated prelaunch checkpoint remain retained.

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
