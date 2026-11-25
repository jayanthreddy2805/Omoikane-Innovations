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
- **Production authorization:** As rechecked on 25 November, Render still reports live commit a87d448 and Neon production has V1–V3 only. Approve the reviewed backend commit, backup/recovery point, V4/V5 migration window and the exact CORS value in backend/PRODUCTION_RELEASE.md. Live preflight rejects both public domain variants; both approved Vercel origins pass. No production deployment, migration or environment update has been performed. Merging into main may trigger Render auto-deployment, so approve and arrange rollout controls first.

### Email delivery follow-up

Review the new V5 outbox migration before backend deployment and include delivery-job metadata in the retention policy. See backend/EMAIL_DELIVERY.md for retry behavior, provider idempotency limits and operational checks. No migration was executed against production.
