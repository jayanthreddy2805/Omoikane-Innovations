# Prepared backend release procedure

Reverified 25 November 2026 against combined main `994d7c27d2b33249c7a0b3fc0ad8650ccec48bdc`. This is a procedure, not authorization to execute it. That commit is the exact **candidate**, not an approved production release. Mobile PR #50 is separate and excluded.

## Current state and release gate

- Render service `srv-dbpjehei0phs73ac8s0g` in the confirmed My Workspace still reports live commit `a87d448aae052a7b40502e8d9a5529a5177bdcd3` (deploy `dep-dbq8ks0m7kps738npu7g`, 11 November). The health endpoint returned UP after a free-instance cold start during this recheck; it verifies the old workload only.
- Neon production migration history contains V1–V3. This release will apply **both V4 and V5** at startup.
- The source Blueprint contains the public domains. The previous live preflight check rejected both public domain variants with 403, while the two configured Vercel origins passed; this recheck did not read runtime environment values or repeat the preflights. Treat production CORS as unverified and blocked pending an approved runtime check/update.
- Render reports `autoDeploy=yes`, `autoDeployTrigger=checksPass`, branch `main`, but its deploy and event lists show **no new deploy since 11 November** despite later main merges. Confirm the Git integration and approved rollout control in Render before relying on automatic deployment. Do not trigger a deploy to investigate it.
- Obtain explicit approval for the exact reviewed commit, production environment update and migration window. A future main merge may initiate a release despite the current gap. Arrange the approved rollout controls before merging. This work does not change service settings or trigger a deploy.

## Before approval

1. Review the test evidence, remaining dependency advisories and mobile/QA reports. PRs #48 and #49 are already in main; PR #50 remains open and must not be merged as part of this backend release. Select and explicitly approve the exact candidate SHA above or a later reviewed commit.
2. Confirm an encrypted backup or recovery branch immediately before the migration and test recovery in isolation. Neon currently reports **no snapshots and an empty automatic snapshot schedule**, with a six-hour history window. There is no verified durable backup on record. Never copy applicant data into a public preview or issue.
3. Use a direct, unpooled PostgreSQL connection for backup/migration administration, with credentials supplied through the secret manager or protected PostgreSQL service/password files outside Git. Enforce verified TLS, including hostname validation, for the production JDBC and backup connections. The source production profile accepts `DATABASE_URL` but does not itself require an `sslmode`; the actual Render JDBC URL and its TLS mode were not read. Confirm the selected host, intended Neon branch, certificate trust and mode in a protected operator environment without printing secrets. [PostgreSQL JDBC's SSL documentation](https://jdbc.postgresql.org/documentation/ssl/) explains that `sslmode=require` encrypts without validating the server certificate; prefer `verify-full` with a trusted CA where supported.
4. Re-run these read-only preflight queries:

   ```sql
   SELECT version, description, success FROM flyway_schema_history ORDER BY installed_rank;
   SELECT count(*) AS duplicate_contact_groups FROM (
     SELECT 1 FROM contact_submissions
     GROUP BY lower(trim(email)), coalesce(trim(phone), '') HAVING count(*) > 1
   ) d;
   ```

   Stop if duplicates exist: V4's unique index will reject them. Do not delete, merge or rewrite submissions automatically. The inspection during this audit returned zero groups; that is not a substitute for the release-time check.
5. Confirm the runtime environment without printing secrets. The production profile requires JDBC database URL, username/password, admin key and exact CORS origins. Confirm TLS, intended Neon branch, verified email sender, internal recipients and admin dashboard URL. Leave `app.retention.enabled` disabled until the owner approves and publishes retention periods. Include backup copies, delivered attachments and outbox metadata in that decision.
6. Prepare this exact `CORS_ALLOWED_ORIGINS` value for approval:

   ```text
   https://www.omoikaneinnovations.com,https://omoikaneinnovations.com,https://omoikane-innovations-3h7t.vercel.app,https://omoikane-innovations-3h7t-git-main-j-f4ac.vercel.app
   ```

   These are exact origins, not wildcard preview access. Add any newly approved preview origin explicitly. Confirm `NEXT_PUBLIC_API_BASE_URL` at frontend build time matches the approved API and CSP origin.

## Backup and recovery rehearsal after approval, before migration

1. In an access-controlled operator environment, capture a named Neon recovery point or take a custom-format `pg_dump` using the direct production endpoint (for example `PGSERVICE=omoikane-backup pg_dump --format=custom --no-owner --file=<protected-temporary-path>` after configuring that service securely). Keep credentials outside command output and Git. Encrypt the dump immediately in approved storage, restrict readers and record its creation time, checksum, PostgreSQL version, source branch, and Flyway V1–V3 history. Do not leave plaintext applicant records in shared temporary directories.
2. Restore a copy into a **new, isolated and access-restricted** database or branch, never into production: decrypt securely, inspect the archive with `pg_restore --list`, and restore into an empty target with `pg_restore --exit-on-error --no-owner --dbname=<isolated-target> <protected-dump>`. Do not use `--clean` against production. Apply access and retention controls to this copy because it contains real applicant data.
3. Validate the restored schema, Flyway history/checksums, and aggregate table counts (including résumé byte counts) without opening personal records. Confirm the isolated application starts and health is UP. Document the restore time and recovery point. Delete the isolated copy later only under the approved data-handling procedure.
4. Re-run the duplicate preflight immediately before migration. Stop if any duplicate group is found, the backup/rehearsal fails, the JDBC TLS mode is unverified, or the Render/Git deploy trigger remains unexplained. Do not deploy or run `repair` to bypass a failed check.

The backup, restore rehearsal and recovery-point creation above are **prepared steps only**; none was executed against production during this review.

## Migration and deploy after approval

1. Select the approved commit and capture the current Render deploy ID and backup/recovery point. Use the Render dashboard or supported deploy API only after approval.
2. Apply approved environment changes as part of that release. The free Docker web service does not use a paid pre-deploy step; Flyway runs at application startup before Hibernate schema validation. Do not also apply ad-hoc SQL or run Flyway independently against the same production schema.
3. Watch Flyway V4 (unique normalized contact index) and V5 (outbox table/partial due index) reach success. V5 is additive, copies no submission bodies/CV bytes and has no destructive statements. Its unique `(kind, submission_id)` constraint prevents duplicate enqueue events. The polymorphic submission reference intentionally has no cross-table foreign key.
4. Wait for the selected deploy to become live, and verify the actual commit. A successful API trigger is not deployment success. Do not repeatedly trigger deploys while investigating a failure.

## Post-release checks after approval

- `/actuator/health` returns 200/UP without database details; inspect recent logs for migration, validation or delivery failures without copying personal data.
- Both public origins and the approved Vercel origins pass OPTIONS preflight; an untrusted origin remains blocked.
- Use approved test identities/recipients for one Contact, Career and consented Newsletter journey. Check validation, duplicate feedback, admin access and exact authenticated CV bytes. Verify actual provider delivery separately; local tests never sent external email.
- Check aggregate outbox state and bounded retries:

  ```sql
  SELECT status, count(*) FROM email_delivery_jobs GROUP BY status;
  SELECT kind, status, attempts, next_attempt_at
  FROM email_delivery_jobs WHERE status IN ('FAILED', 'PROCESSING')
  ORDER BY next_attempt_at;
  ```

- Confirm frontend preview noindex and production canonical/indexing behavior on the actual deployed hosts. Repeat physical-device Safari/keyboard checks and production performance measurement.

## Rollback

Render rollback restores an application artifact; it does not undo Flyway migrations, sent email or external writes. Keep V4/V5 in place during an application rollback unless a separately reviewed database recovery plan is approved. Older code does not consume queued V5 jobs; restoring it can leave pending jobs and may send email synchronously again. Record the recovery time and delivery-job state before switching versions.

If a migration fails, stop and inspect Flyway state and the cause. Do not run `clean`, delete migration history, use `repair`, drop the outbox or remove submissions to force startup. Restore production data only under a separately approved recovery procedure; a restore can discard newer submissions. Recheck auto-deploy settings following any rollback.

References checked: [Render deploys](https://render.com/docs/deploys), [health checks](https://render.com/docs/health-checks), [rollbacks](https://render.com/docs/rollbacks). No production action in this document has been executed.
