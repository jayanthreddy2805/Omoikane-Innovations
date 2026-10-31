CREATE TABLE career_applications (
    id                  BIGSERIAL                   PRIMARY KEY,
    name                VARCHAR(255)                NOT NULL,
    email               VARCHAR(255)                NOT NULL,
    phone               VARCHAR(50),
    department          VARCHAR(50)                 NOT NULL,
    role_id             VARCHAR(50)                 NOT NULL,
    role_title          VARCHAR(255),
    message             TEXT                        NOT NULL,
    resume_filename     VARCHAR(255)                NOT NULL,
    resume_content_type VARCHAR(100)                NOT NULL,
    resume_data         BYTEA                       NOT NULL,
    status              VARCHAR(50)                 NOT NULL DEFAULT 'PENDING',
    created_at          TIMESTAMP WITH TIME ZONE    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_career_applications_created_at ON career_applications (created_at DESC);
CREATE INDEX idx_career_applications_email ON career_applications (email);
CREATE INDEX idx_career_applications_role_id ON career_applications (role_id);
