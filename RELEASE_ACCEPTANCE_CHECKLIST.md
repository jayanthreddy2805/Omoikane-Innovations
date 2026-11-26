# Final release acceptance checklist — owner-controlled

Use this document to record an authorized release; blank fields are intentionally **not** claims of success.

## A. Before merge or deploy
- [ ] Read this handoff and `backend/PRODUCTION_RELEASE.md`.
- [ ] Review PR #56 (SEO + approval-protected UI guard); record decision and merge SHA.
- [ ] Review PR #57 (security + About film placeholder removal); record decision and merge SHA.
- [ ] CI green on the **final combined commit** (frontend build and checks; backend Maven and isolated PostgreSQL/Docker).
- [ ] Client confirms Careers, Leadership, Technology and Home structures and About video-only behavior.
- [ ] Operations approves selected backend commit and Render auto-deploy controls.
- [ ] Database owner approves durable backup/recovery point and performs test restore.
- [ ] Check V4 duplicate groups with **the exact index expression**: `lower(trim(email)), coalesce(trim(phone), '')`.
- [ ] Confirm Neon Flyway current versions, JDBC TLS/hostname verification, company domains in runtime CORS and retention disabled.
- [ ] Confirm that provider credentials, recipients, admin auth configuration and request limits are appropriate without recording secret values.

## B. Release — only in an approved change window
- [ ] Record date/time/window, release owner and approving authority: __________
- [ ] Record GitHub candidate commit and frontend deployment ID: __________
- [ ] Record Render old deploy, new deploy ID and live commit: __________
- [ ] Confirm Flyway V4 and V5 success; no `clean` or unreviewed `repair`.
- [ ] Health 200/UP; review privacy-safe logs.
- [ ] Verify CORS for approved www/non-www and Vercel origins; untrusted origin denied.
- [ ] Run only approved **synthetic** Contact, Career/CV, Newsletter, Admin and email-outbox/provider journeys.
- [ ] Confirm private résumé download and no-store/no-sniff protections.
- [ ] Confirm analytics opt-in/withdrawal, canonical/robots behavior and no exposed personal data.
- [ ] Record success/failure handling and rollback authority before sign-off.

## C. Browser and owner acceptance
- [ ] Home four sectors remain; Technology two categories only and split desktop layout unchanged.
- [ ] Careers dropdown (desktop/mobile), category pages and Leadership template remain.
- [ ] About company film has **no temporary picture** during loading; video controls work with reduced motion.
- [ ] 320/375/390/414/768/960/1440 layout smoke and no horizontal overflow.
- [ ] Real Safari/keyboard check and usable screen-reader focus; critical access remains usable.
- [ ] Owner approves final legal/company information and any claims visible to users.
- [ ] Capture sign-off date, commit SHA, decision and follow-up issues: __________

## Exclusions and control
Never modify chatbot scope; do not invent company facts or retention terms. No production write, migration, merge or deploy is authorized by checking this file into GitHub.

**Current status on 26 November 2026:** Not signed off. Render backend is old, Neon V4/V5 pending, PR #56/#57 unmerged and production recovery not verified. Detailed observed evidence: `RELEASE_HANDOFF_2026-11-26.md`.
