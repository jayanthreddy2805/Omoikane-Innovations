# Production readiness before connecting the organization domain

The local PostgreSQL subscription test proves the API and duplicate handling work locally. It does **not** prove that the deployed website can reach the API or that email is delivered.

## Deployment dependencies

1. Deploy the Java 21 Spring Boot service to a supported host over HTTPS. Use a persistent PostgreSQL 16 database, not the laptop database. Run the existing Flyway migrations and keep the database backed up. Confirm that only authorized administrators have database and deployment access.
2. Configure the backend's `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `CORS_ALLOWED_ORIGINS` (the exact Vercel preview and eventual domain origins), `ADMIN_SECRET_KEY` (a new long random secret), and `ADMIN_NOTIFICATION_EMAIL`. Never put these values in `NEXT_PUBLIC_*` variables or commit them to Git. See `backend/.env.example` for optional email settings.
3. Configure `NEXT_PUBLIC_API_BASE_URL` on the Vercel project to the deployed HTTPS API origin. This value is embedded in the browser build: redeploy the frontend after changing it. Verify the CSP `connect-src` and backend CORS both permit the intended origin.
4. Configure Resend with a verified sender and `RESEND_API_KEY` / `RESEND_FROM_EMAIL` if confirmation and admin notification emails are required. Without these settings, the API can save submissions but deliberately skips email delivery. Test actual recipient delivery, including the résumé notification, before launch.
5. Obtain client approval for the Privacy Notice and Website Terms. The current pages are draft website text and describe the current data handling; confirm the legal entity, retention, recipients, jurisdiction, and contact address with the client. Update them before making the site public.

## Acceptance tests on a protected preview

- Confirm desktop and mobile render on the actual Vercel preview using authorized preview access. Check the homepage, work, expertise, leadership, careers, contact, legal pages, footer, and the admin gate. Preserve preview protection until the site is approved.
- Submit one new contact enquiry, one application with an allowed résumé, and one new subscription. Confirm each response, stored record, and expected notification or confirmation email. Repeat each submission to verify duplicate behavior. Test invalid inputs and a network failure so no false success appears.
- Sign in to `/admin` with the new secret; inspect both lists and download a résumé. Verify an invalid key fails, repeated guesses are rate-limited, no secret is placed in the URL, and the résumé request uses `X-Admin-Key`.
- Check analytics only activates after optional cookie consent, and that changing preferences works. Confirm the privacy copy matches the deployed services.
- Verify backup restore and a rollback deployment before handing over. Monitor API errors, database availability, email failures, and request logs after launch.

Do not connect the organization domain until these checks pass and the client approves the public content. The domain can remain disconnected while the API and protected preview are tested.
