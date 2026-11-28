# Task 9 — prelaunch backend live and verified (28 November 2026 IST)

**The approved prelaunch deployment is complete. The full production acceptance list is not complete.** After the earlier Maven Central 429 failures, a fresh same-commit attempt succeeded without changing dependencies, repository endpoints, network paths, application source or the Free plan.

## Current verified state

| Item | Result |
|---|---|
| Render service | `omoikane-api` / `srv-dbpjehei0phs73ac8s0g`, existing Free/Singapore service |
| **Live deployment** | **`dep-dc5dlih5efls73f4p020`**, exact approved **`93aa7cc3148cfb6781b4e738774ee298af2884ff`** |
| Deployment time | Started **28 Nov 19:14:43 IST**; **live at 19:18:13 IST** |
| Deploy controls | Service auto-deploy remains off; Blueprint auto-sync remains paused. No Blueprint apply/PR merge issued. |
| Selected database | Existing prelaunch `br-falling-poetry-aoabyynd` / `neondb`; no target switch |
| **Migration** | Startup Flyway successfully applied **V5 only**, checksum **`-1392285325`**. Prelaunch now V1–V5, all successful. Existing V1–V4 checksums matched before deployment. |
| Outbox structure | `email_delivery_jobs` exists, due-job partial index and unique event constraint exist; **0 jobs** at verification |
| Health after new deploy | **HTTP 200 / UP**, checked **19:19:41 IST** |
| Approved website connection | POST/content-type preflight from current Vercel alias: **HTTP 200**, exact allow-origin |
| Untrusted website origin | Same preflight from `https://untrusted.example`: **HTTP 403**, no allow-origin |
| Existing business data | Contact/application/subscriber counts, résumé byte total and aggregate checksum unchanged from before deployment |
| Separate production database | `br-plain-brook-aolmdy63` still V1–V3 with original successful checksums; untouched |
| Recovery point | Accepted pre-V5 branch checkpoint `br-polished-band-aorkbxle` retained. It matched source business data before deployment; it is not a snapshot restore. Production snapshot/restore remains separate. |

[Safe live-deployment receipt](release-evidence/TASK9_20261128/prelaunch-live-verification.json) · [Live Render deploy](https://dashboard.render.com/web/srv-dbpjehei0phs73ac8s0g/deploys/dep-dc5dlih5efls73f4p020)

## Configuration and verification limits

The approved `verify-full` / `DefaultJavaSSLFactory` JDBC URL and email-worker/retention suppression were saved using **Save only** and read back before the earlier build attempts. The required eleven variable keys remained present before this successful deployment. Render then built and started the exact approved commit with the saved configuration. New runtime Hikari connection startup and V5 migration succeeded, followed by live database-backed health checks.

Automatic review rejected reopening masked configuration values on this later attempt because they may contain credentials. They stayed masked; no alternative secret extraction was attempted. Verification used the earlier configuration receipt, current key presence, exact deployment/startup logs, schema and HTTP outcomes. No new credential values were read, copied, exported or published.

The credential-free preflight previously passed inside the same runtime-image build: trusted certificate chain, actual-host verification and wrong-host rejection, TLSv1.3 / pgJDBC 42.7.15. A diagnostic query of PostgreSQL's server-side `pg_stat_ssl` showed three matching JDBC backend sessions with `ssl=false`. **This backend view is not used as proof of the external client's TLS state**: PostgreSQL documents backend connection statistics, and Neon documents a proxy between clients and compute. Proxy termination is an inference here, not a separately measured internal topology. See [PostgreSQL SSL statistics](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-SSL-VIEW), [Neon proxy glossary](https://neon.com/docs/reference/glossary#neon-proxy) and [Neon TLS requirements](https://neon.com/docs/security/security-overview). No security setting was weakened.

Email/retention suppression was part of the saved approved configuration. **No deployed-service test submission, queued test job, provider send or retention operation was executed.** Zero current outbox jobs is not claimed as an independent test of the delivery worker's disabled condition. That behavior remains part of the next approved test stage.

## Test evidence retained

Both CI workflows passed on `6e2cfec2bf1e4e463ee6567f3db2660b83a6c61b`: 88 Maven + 7 PostgreSQL tests; PostgreSQL 18 dump/restore; real isolated browser → Spring Boot → database journeys; container build; credential-free runtime TLS and protected frontend checks. Its backend application source/POM/Dockerfile match deployed main `93aa7cc3148cfb6781b4e738774ee298af2884ff`. No application source changed for this successful retry.

## What remains from the owner's list

| Workstream | Status |
|---|---|
| Render backend deployment | **Completed for the approved prelaunch target** |
| Prelaunch V5 | **Applied and verified** |
| Production backup/restore | Earlier root-branch snapshot/isolated restore passed; expiry **5 Dec 05:30 IST** |
| Prelaunch recovery | Verified retained branch checkpoint accepted by owner; child-branch snapshot unsupported, no snapshot restore claimed |
| Deployed Contact / Apply / Newsletter / Admin / résumé journeys | Pending explicitly approved labelled test identities/records and access scope; isolated equivalents already passed CI |
| Provider email | Pending owner test address, recipient/message approval and actual acceptance/delivery verification; current sender is the Resend sandbox |
| Production database V4/V5/cutover and final sign-off | Pending separate owner decisions; production remains untouched |

The next information needed is the Resend account's test email address. This is for preparing the next test, not authorization to create records or send messages. No DNS/WordPress/custom-domain, frontend UI, chatbot, content/legal-policy or data-deletion change is included.

## Earlier attempts and recovery evidence

The two earlier pinned builds failed before startup with Maven Central HTTP 429. The later successful attempt used the same code, retained caches and unchanged dependencies; no workaround or repository/transport change was required.

[Failed-attempt receipt](release-evidence/TASK9_20261128/prelaunch-rollout-attempt.json) · [Production recovery receipt](release-evidence/TASK9_20261128/neon-recovery.json) · [Prelaunch checkpoint/TLS receipt](release-evidence/TASK9_20261128/prelaunch-checkpoint-and-tls.json) · [Backend/TLS CI](https://github.com/jayanthreddy2805/Omoikane-Innovations/actions/runs/46131480284) · [Frontend CI](https://github.com/jayanthreddy2805/Omoikane-Innovations/actions/runs/46131480246).

Earlier read-only assessments and the exact approved operational proposal remain available in Git history. Their blocked/pending-deployment statements are superseded by this live verification; they do not authorize broader testing or a production database switch.
