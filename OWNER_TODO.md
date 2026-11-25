# Owner decisions required

No company facts or legal terms have been invented. Review this branch before merging.

- **OI-01 / OI-18:** Supply approved leadership names, titles, biographies, credentials and licensed headshots if /leadership should return. It currently returns 404 and is absent from navigation and sitemap.
- **OI-04:** Supply official X and Instagram profile URLs if these channels exist. Generic homepages have been removed.
- **OI-11:** Supply approved photographs of OFC-X, OESC, OGN-X and OCOM-X with usage rights. Shared product data preserves existing illustrative imagery; these images are not verified product photography.
- **OI-12:** Complete CLAIMS_TO_VERIFY.md with evidence and approval dates. No marketing claim has been rewritten as a new company fact.
- **OI-14:** Confirm controller's exact registered legal name/address and the designated grievance contact. Approve separate contact and application retention periods, newsletter retention, backup expiry and email attachment retention. Set app.retention.enabled=true only after approving the periods and publishing them in /privacy. Required settings: app.retention.contact-days and app.retention.application-days, positive integers. Daily purge is 02:00 UTC by default; no production records were deleted during this work.
- **OI-15:** Confirm whether applicant resumes should continue to be attached to confirmation/admin emails. Existing private database storage and authenticated downloads remain; no public download URLs exist. Consider malware scanning and shared rate-limit storage before scaling beyond the current single instance.
- **OI-21:** Confirm which skill bullets belong to currently open roles, especially agri analytics, light show control, Flutter/React Native and cloud platforms on the software careers page. Confirm role availability and the published Monday–Friday 09:00–18:00 IST office hours. Existing copy was preserved.
- Confirm https://www.omoikaneinnovations.com is the public canonical domain. Non-www redirects to www; other hosts receive noindex. Confirm both domain variants in Render CORS before production use.
- Render currently deploys main and its latest recorded live commit is a87d448 (11 November). This review branch has not been deployed. Render's log service returned 503 during inspection. Railway has no connected projects. Neon schema was read without reading applicant/contact records or changing data.

### Email delivery follow-up

Review the new V5 outbox migration before backend deployment and include delivery-job metadata in the retention policy. See backend/EMAIL_DELIVERY.md for retry behavior, provider idempotency limits and operational checks. No migration was executed against production.
