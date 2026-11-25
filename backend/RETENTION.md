# Form record retention

RetentionJob is disabled by default. No Flyway changes are needed. It only becomes active when `app.retention.enabled=true`, with explicit positive `app.retention.contact-days` and `app.retention.application-days` values. It deletes records older than their independent UTC cutoffs, including application resume bytes, in one transaction. The default daily cron is `0 0 2 * * *` in UTC; override with `app.retention.cron`.

Before enabling it, the owner must approve the periods and publish matching text in the Privacy Notice, including registered controller/grievance details. Document email attachments and backups separately: deleting database rows cannot delete copies held by email providers or backups. Newsletter records are not purged by this job because consent/withdrawal retention requires a separate approved policy. Test against an isolated database before enabling production deletion.
