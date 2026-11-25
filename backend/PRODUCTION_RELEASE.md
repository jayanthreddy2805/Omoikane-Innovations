# Approved backend release procedure

Prepared 25 November 2026. This is a procedure, not authorization to execute it.

## Current state and release gate

- Render service `srv-dbpjehei0phs73ac8s0g` in the confirmed My Workspace still reports live commit `a87d448aae052a7b40502e8d9a5529a5177bdcd3`.
- Neon production migration history contains V1–V3. This release will apply **both V4 and V5** at startup.
- The source Blueprint contains the public domains, but live CORS preflights reject both public domain variants with 403. The two configured Vercel origins pass. Health returns 200 for the old workload; this does not verify the candidate release.
- Obtain explicit approval for the exact reviewed commit, production environment update and migration window. Render tracks main with `checksPass`; a merge can initiate a release. Arrange the approved rollout controls before merging. This work does not change service settings or trigger a deploy.

## Before approval

1. Review the PR, test evidence, remaining dependency advisories and mobile/QA reports. Resolve PR #48 separately and test the combined result before releasing both.
2. Confirm an encrypted backup or recovery branch immediately before the migration and test recovery in isolation. The observed Neon project history window is six hours; do not assume that is a durable backup policy. Never copy applicant data into a public preview or issue.
3. Use a direct, unpooled PostgreSQL connection for backup/migration administration, with credentials supplied through the secret manager or protected PostgreSQL service/password files outside Git. For example, an operator may run `PGSERVICE=omoikane-backup pg_dump --format=custom --file=<encrypted-backup-location>` after configuring that service securely. Do not print credential-bearing URLs.
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
