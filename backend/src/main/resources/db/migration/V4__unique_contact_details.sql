-- The application normalizes email and phone before saving. Match the lookup
-- rule for older records as well, including NULL and blank phone values.
CREATE UNIQUE INDEX uq_contact_submissions_contact_details
    ON contact_submissions (lower(trim(email)), coalesce(trim(phone), ''));
