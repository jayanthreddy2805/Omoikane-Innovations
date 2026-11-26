# Security, privacy and data-protection audit — 26 November 2026

## Scope and restrictions
Reviewed business API, public form, subscription, résumé, cookie consent, admin and retention source on GitHub. **No chatbot code, production database, deployment settings, approved site layout or destructive retention behavior was changed.** This is a source-level security review, not an external penetration test or an assertion that production Render has the latest backend.

## Fixed in this candidate
- **SEC-01 (high, brute-force surface):** per-IP limits covered POST `/api/admin/auth/verify` but not other Admin routes protected by the same shared key. Previously an attacker could repeatedly guess `X-Admin-Key` on GET lists or résumé downloads without this filter. Now all `/api/admin/**` endpoints are rate-limited: verification keeps the existing 5/minute bucket and other Admin operations get a separate 30/minute bucket. Added mock-MVC regression for unauthorized GET attempts. Both remain per-instance; a shared distributed limiter needs design approval before scaling.
- **SEC-02 (low, defence in depth):** Admin key comparison now uses `MessageDigest.isEqual` on UTF-8 bytes rather than `String.equals`. Existing trimming and disabled-empty-key checks remain; no credential change required. Added wrong-prefix/wrong-suffix regression coverage.
- **SEC-03 (medium, sensitive download):** Authenticated résumé attachment responses explicitly emit `Cache-Control: private, no-store, max-age=0` and `X-Content-Type-Options: nosniff`. Existing attachment filename sanitization, key checks and data bytes are unchanged; tests assert the headers.
- **UI-01 (requested):** About company-film image overlay removed (not replaced by a different poster). Keep the video, 16:9 framing, mute button, lazy loading and reduced-motion manual-play control. Static and no-JavaScript media regression coverage updated.

## Reviewed; no change without approval
- Career uploads: 5 MiB limit, extension/magic validation, bounded DOCX expansion and authenticated database-backed résumé download. This is **not** antivirus/malware scanning.
- Contact/Career: server-side validation, honeypots and email-outbox transactional behavior already implemented. Actual production email-provider success and migrated schema are not verified by this audit.
- Newsletter: affirmative consent and random unsubscribe tokens are present. Domain/email ownership is not verified by double opt-in; decide whether it is required before enabling broader campaigns.
- Privacy: analytics is off by default and requires consent; query strings and fragments are removed from analytics page events; consent withdrawal and persistent choices already implemented.
- Retention: automated purge is opt-in/disabled by default and requires positive owner-approved periods. Do not enable or delete production records. Backups, outbox metadata and email attachments have separate retention obligations requiring policy decisions.
- Security headers: frontend CSP, nosniff, referrer and frame policies already exist. CORS is exact-origin configured; the **live** CORS mismatch and pending V4/V5 deployment remain separately gated.
- Admin: a shared static secret is stored only in memory by the frontend, not durable browser storage. Consider individual identities, rotation and stronger audit logging before multi-user operations.
- Public claims/leadership details remain owner-supplied; do not invent legal identifiers or certifications.

## Remaining blockers and verification
1. Approve and publish data-controller/grievance information and contact, résumé, newsletter, outbox, backup and delivered-email retention requirements.
2. Decide whether malware scanning, double opt-in and shared rate limiting are required for the operating model.
3. Approve backend deployment separately after database recovery checks; no production migration was attempted.
4. CI verification: frontend lint/typecheck/contract tests/build and backend Maven/JUnit must complete successfully; local tests, external pentest and live end-to-end checks are **not** claimed here.
5. Visual acceptance: the requested About film should display a blank/transparent frame until video playback starts, rather than a still image, on desktop and mobile. Preserve layout.

Changes to critical approved UI layouts, production records and policies require explicit user approval.
