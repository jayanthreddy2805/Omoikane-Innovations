-- Review before production deployment. No application/user content is duplicated here.
CREATE TABLE email_delivery_jobs (
    id BIGSERIAL PRIMARY KEY,
    kind VARCHAR(32) NOT NULL,
    submission_id BIGINT NOT NULL,
    status VARCHAR(16) NOT NULL DEFAULT 'PENDING',
    attempts INTEGER NOT NULL DEFAULT 0,
    next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_email_delivery_event UNIQUE (kind, submission_id)
);
CREATE INDEX idx_email_delivery_due ON email_delivery_jobs (next_attempt_at, id)
    WHERE status IN ('PENDING', 'PROCESSING');
