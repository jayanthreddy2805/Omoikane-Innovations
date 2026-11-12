CREATE TABLE contact_submissions (
    id              BIGSERIAL       PRIMARY KEY,
    name            VARCHAR(255)    NOT NULL,
    email           VARCHAR(255)    NOT NULL,
    company         VARCHAR(255),
    phone           VARCHAR(50),
    message         TEXT            NOT NULL,
    client_ip       VARCHAR(45),
    email_sent      BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contact_submissions_created_at ON contact_submissions (created_at DESC);
CREATE INDEX idx_contact_submissions_email ON contact_submissions (email);
