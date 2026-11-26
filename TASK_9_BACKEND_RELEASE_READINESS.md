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
