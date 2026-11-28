# Task 9 — prelaunch testing execution plan

## Selected target and authorization

Owner confirmed retaining the existing Render-connected **prelaunch** database for testing. The owner separately approved the named prelaunch recovery drill. Its snapshot call was rejected by Neon; the approved same-project isolated-copy scope was used to create and verify the branch checkpoint below. Schema changes, deployment, configuration edits and email sends remain unapproved.

- Render: `omoikane-api`, `srv-dbpjehei0phs73ac8s0g`.
- Neon project: `curly-darkness-86465014`.
- Selected branch: `prelaunch-api-test-20261110`, `br-falling-poetry-aoabyynd`.
- Direct endpoint: `ep-lingering-dew-aoqs32ya.c-2.ap-southeast-1.aws.neon.tech`, database `neondb`.
- Default production `br-plain-brook-aolmdy63` remains separate and unchanged.
- Current prelaunch history: V1–V4 successful; **V5 only** is pending. Do not rerun V4, edit history, use Flyway repair/clean or merge branch data.
- Existing approved production snapshot `snap-plain-credit-ao61q7xz` covers a different branch. **Neon rejects snapshots of this non-root prelaunch branch**. No prelaunch snapshot was created; do not describe the isolated copy as a snapshot restore.

## Approved recovery attempt and verified branch checkpoint

| Operation | Exact proposal |
|---|---|
| Source | `br-falling-poetry-aoabyynd` / `neondb` |
| Snapshot | `omoikane-prelaunch-pre-v5-20261128` |
| Snapshot expiry | **5 December 2026, 05:30 IST** / `2026-12-05T00:00:00Z` |
| Isolated restored branch | `prelaunch-restore-20261128`, same existing private project |
| Switchover | **None**; restore with `finalize=false`, selected/live/default branches unchanged |
| Verification | SELECT-only Flyway versions/checksums/success, aggregate record counts, résumé byte totals and aggregate SHA-256; compare source before/after and restored copy |
| Data handling | Existing submission data copied inside the same private project; no record bodies, résumé bytes, credentials or recipient addresses exported to CI/workspace/repository |
| Cost/lifetime | Snapshot/branch storage may incur provider charges. Snapshot expires at the time above; restored copy remains retained until separately authorized cleanup. No upgrade or deletion is proposed. |
| Explicit exclusions | No migration, deploy, production configuration change, production branch change, form submission or email |

**Executed outcome:** snapshot creation returned HTTP 400 / `INVALID_ARGUMENT`, “not allowed to snapshot non-root branch”. Neon documentation confirms the root-branch restriction. No snapshot or snapshot restore was performed.

Within the approved same-private-project isolated-copy scope, created `prelaunch-restore-20261128` / `br-polished-band-aorkbxle` directly from prelaunch (`parent-data`). It is ready, non-default and non-primary; created **28 Nov 15:15:08 IST**. The compute is capped at 0.25 CU. Source fingerprints stayed stable before/after; all requested counts, résumé byte totals/checksums and V1–V4 history/checksums matched the copy. No data bodies/bytes were exported.

This is a **verified branch checkpoint, not a completed durable snapshot/restore drill**. The requested snapshot expiry does not apply because no snapshot exists; the copy stays retained until separately authorized cleanup. Owner must accept this recovery alternative for prelaunch testing before any rollout. The existing production snapshot/restore remains separate and unchanged.

[Safe checkpoint/TLS receipt](release-evidence/TASK9_20261128/prelaunch-checkpoint-and-tls.json). [Neon root-only snapshot sample](https://github.com/neondatabase/neon-for-agent-platforms/blob/main/skills/neon-postgres-agent-platforms/scripts/versioning-flow.ts) · [Copy-on-write branch behavior](https://neon.com/docs/manage/branches).

## Prepared TLS verification and proposed settings (NOT applied)

The current JDBC URL uses `sslmode=require`. [pgJDBC documentation](https://jdbc.postgresql.org/documentation/ssl/) distinguishes encryption from certificate/hostname verification.

Proposed URL keeps the **same host and database**, and uses Java's default trusted CA store plus strict hostname verification:

```text
jdbc:postgresql://ep-lingering-dew-aoqs32ya.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=verify-full&sslfactory=org.postgresql.ssl.DefaultJavaSSLFactory
```

Keep existing separate username/password and all admin/CORS/sender credentials. Do not copy them into this document or a connection URL.

`backend/scripts/VerifyPostgresTls.java` sends only a PostgreSQL SSLRequest, negotiates TLS with Java's default trust manager and SNI, verifies the actual host using pgJDBC, and requires rejection of `hostname-check.invalid` against the same certificate. It never authenticates or sends SQL. The CI step runs compiled probe/driver files mounted read-only in the **built runtime image**. It is restricted to the existing Task 9 review branch and skips after merge/unrelated branches.

The workspace's direct connection failed DNS resolution; that is **not** a certificate failure or a positive TLS check. **Runtime-image verification passed** in backend CI [46131480284](https://github.com/jayanthreddy2805/Omoikane-Innovations/actions/runs/46131480284) on `6e2cfec2bf1e4e463ee6567f3db2660b83a6c61b`: trusted certificate chain, actual-host verification and wrong-host rejection all true, TLSv1.3, pgJDBC 42.7.15. No authentication/SQL occurred. The synthetic local fixture also rejected an untrusted certificate. The proposed JDBC setting remains **unapplied**.

For a future separately approved testing rollout, suppress all provider delivery and retention using this additional Render environment value:

```text
SPRING_APPLICATION_JSON={"app":{"email":{"worker-enabled":false},"retention":{"enabled":false}}}
```

This is a **proposal only**. Recheck existing variables at execution and preserve any existing application JSON keys rather than overwriting them. Business submissions may enqueue outbox jobs while the worker is disabled; do not enable it later until queued recipients/kinds have been reviewed and test-email delivery is approved.

## Later operational approval, after recovery and TLS gates pass

1. Obtain owner acceptance of the verified branch checkpoint as the prelaunch testing recovery alternative. Confirm selected branch, fresh Flyway history/duplicates and stable recovery evidence. Candidate is main `93aa7cc3148cfb6781b4e738774ee298af2884ff`; GitHub compare proves its `backend/src/main`, `backend/pom.xml` and `backend/Dockerfile` are unchanged in tested `6e2cfec2bf1e4e463ee6567f3db2660b83a6c61b`. Recheck main and stop on drift; no PR merge is proposed.
2. Review Render integration: historical Blueprint create-service sync is in error and later auto-deploy gap remains unexplained. Do not assume it is a failed application build or missing permission.
3. Propose and obtain approval for controlled deployment settings before touching them: pause service auto-deploy and Blueprint auto-sync as needed, retain existing source/main/Docker paths, and use one explicitly selected commit deploy. A Blueprint sync may reapply the repository's custom-domain CORS origins; do not issue it or allow those domains during this testing work.
4. Apply approved TLS URL and delivery/retention suppression as **save-only** configuration, avoiding an unplanned redeploy of old code. Credentials, approved Vercel CORS and admin URL remain in place.
5. Execute one approved pinned-commit deployment. Startup Flyway applies **V5 only** on selected prelaunch, adding `email_delivery_jobs`, its unique event constraint and due-job partial index. It does not import old submissions into jobs. Do not run migrations a second time manually.
6. Verify live SHA, startup migration success, TLS/health, exact allowed-origin preflight and untrusted-origin rejection. Confirm delivery/retention workers are disabled before any approved write test.
7. Obtain approval for explicit synthetic Contact/Apply/Newsletter identities and a small generated résumé. Test duplicates, consent/opt-out, authenticated Admin listings and exact résumé bytes. No real applicant submission, bulk cleanup or recipient export.
8. Actual provider acceptance/delivery is a separate gate. Current `resend.dev` sandbox can send only to its own Resend account address. A verified sender domain/DNS change is outside current authorization. Do not activate provider delivery or release queued jobs without approved recipients and scope.

## Stop and rollback rules

- Stop on target mismatch, changed Flyway checksum/history, failed recovery, unverified TLS, unexpected deploy trigger or failed migration. Never use a trust-all SSL factory or disable hostname validation to make a check pass.
- Rolling back code does not undo V5 or emails. Restoring a copy for inspection is different from replacing live data. Live restore/deletion needs separate approval and a plan for submissions arriving after the backup.
- Keep the production branch, existing production recovery copy, WordPress/DNS/custom domains, frontend UI and chatbot work untouched.

## Verification status

Both frontend and backend CI passed on `6e2cfec2bf1e4e463ee6567f3db2660b83a6c61b`: 88 Maven + 7 PostgreSQL tests, PostgreSQL 18 restore, real isolated browser/API/database journeys, container build and credential-free runtime TLS check. No application/backend business behavior is changed by the probe. Later evidence-only commits do not change this tested application/probe/workflow.
