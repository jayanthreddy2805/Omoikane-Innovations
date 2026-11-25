# Submission email delivery

Contact and career submissions now save two delivery jobs in the **same database transaction** as the submission. A scheduled worker sees committed jobs only. HTTP submission responses do not wait for Resend calls. A rollback removes both the submission and jobs.

`V5__email_delivery_outbox.sql` is included for review; it has not been applied to production. It adds one table and a due-job index, without changing existing submission data. Review it before deploying this branch. No extra queue service or Java dependency is needed.

Jobs contain submission IDs, event kind, state, attempts and scheduling timestamps. They do not duplicate message bodies, addresses or CV bytes. The worker loads one submission for each delivery and releases the database transaction before making the HTTP call. Completed jobs are not polled again. Deleted submissions are skipped. If Resend is unconfigured, pending jobs are retained.

The worker claims at most four jobs per poll, using row locks and a five-minute processing lease. Network errors, HTTP 429 and 5xx responses receive bounded retry scheduling. A job gets at most four attempts, including recovery after an interrupted process. Each provider request includes a deterministic event/entity idempotency key. Provider idempotency has a finite window: delivery is at least once across an ambiguous send/crash, and a restart beyond the provider's idempotency window can still produce a duplicate. No exactly-once delivery guarantee is made.

Defaults: `app.email.worker-enabled=true`, `app.email.poll-ms=5000`, `app.email.initial-delay-ms=10000`. Tests disable automatic polling and drive the worker explicitly. Unconfigured admin recipients and permanent provider rejections are skipped; provider status/job IDs are logged without message bodies or recipient addresses.

Operational checks after an approved deployment:

```sql
SELECT status, count(*) FROM email_delivery_jobs GROUP BY status;
SELECT kind, status, attempts, next_attempt_at
FROM email_delivery_jobs WHERE status IN ('FAILED', 'PROCESSING')
ORDER BY next_attempt_at;
```

The owner must include delivery-job metadata in the retention policy. The existing opt-in form-retention job does not choose a new retention period for this table. Database record deletion also cannot delete attachments already delivered through email or copies in backups.
