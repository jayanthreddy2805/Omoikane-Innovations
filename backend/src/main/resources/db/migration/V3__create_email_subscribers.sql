CREATE TABLE email_subscribers (
    id                  BIGSERIAL                   PRIMARY KEY,
    email               VARCHAR(255)                NOT NULL UNIQUE,
    status              VARCHAR(20)                 NOT NULL DEFAULT 'ACTIVE',
    consent_given_at    TIMESTAMP WITH TIME ZONE    NOT NULL,
    unsubscribed_at     TIMESTAMP WITH TIME ZONE,
    unsubscribe_token   VARCHAR(64)                 NOT NULL UNIQUE,
    client_ip           VARCHAR(45),
    source              VARCHAR(40)                 NOT NULL DEFAULT 'WEBSITE_FOOTER',
    created_at          TIMESTAMP WITH TIME ZONE    NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE    NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_email_subscribers_status
        CHECK (status IN ('ACTIVE', 'UNSUBSCRIBED'))
);

CREATE INDEX idx_email_subscribers_status ON email_subscribers (status);
CREATE INDEX idx_email_subscribers_created_at ON email_subscribers (created_at DESC);
