# Deploy the Omoikane API before connecting the organization domain

The website runs on Vercel. Neon stores the data. This Spring Boot service must run on a separate online host with a public HTTPS address for the browser forms to work. The `Dockerfile` is designed for a host that accepts Docker services, including Railway or Render; it does not create a service or incur hosting charges on its own.

## 1. Create a backend service

Connect this repository to Render using the root `render.yaml` Blueprint. It defines one free Docker web service with `backend/` as its build context and `/actuator/health` as its HTTP health check. Render's free web services can sleep after inactivity and have resource limits, so use this configuration to test the API and its Vercel integration. Choose a suitable paid plan and repeat deployment and load tests before treating the API as production-ready. The database remains on Neon; the Blueprint does not create another database or set any credentials. Use the resulting `onrender.com` HTTPS URL while the organization domain remains disconnected.

The image runs with `SPRING_PROFILES_ACTIVE=prod`; the application refuses to start without its required database, CORS, and admin configuration. Its health check includes database availability and returns a non-success status if the database cannot be reached. Flyway applies pending migrations at startup.

## 2. Set runtime variables on the backend host

| Name | Value to supply | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Neon **JDBC** URL, such as `jdbc:postgresql://<neon-host>/neondb?sslmode=require` | Database connection, kept server-side |
| `DATABASE_USERNAME` | Neon database role | Database login |
| `DATABASE_PASSWORD` | Password for that role | Database login |
| `CORS_ALLOWED_ORIGINS` | Comma-separated, exact Vercel preview origins in use, without paths or trailing slashes | Allows browser requests from the site |
| `ADMIN_SECRET_KEY` | New long random secret | Enables admin access; rotate the old key before launch |
| `ADMIN_NOTIFICATION_EMAIL` | Approved internal recipient | Enquiry/application notifications |
| `RESEND_API_KEY` | Resend API key | Outbound email delivery |
| `RESEND_FROM_EMAIL` | Verified sender address | Outbound email delivery |
| `RESEND_FROM_NAME` | `Omoikane Innovations` | Sender display name |
| `ADMIN_DASHBOARD_URL` | Current protected Vercel preview `/admin` URL | Admin links in emails; change at domain launch |

Do not paste these secrets into Git, frontend variables, or an issue/PR. Use the host's secret manager. Email values are not required for boot, but without a configured provider the API saves records while skipping email. Confirm the sender and recipient with the client before treating notification delivery as ready.

The Neon project currently has a `production` branch and a `neondb` database. Prefer an isolated Neon branch for disposable end-to-end form tests, then configure the production backend to use the intended production branch. Do not assume a successful local test means the online service uses the same branch.

## 3. Connect the protected Vercel preview

Set `NEXT_PUBLIC_API_BASE_URL` in the Vercel project to the deployed backend's **HTTPS origin only**, for example `https://your-api-host.example`, and redeploy the frontend. The value is embedded at build time. Add each exact preview origin to backend `CORS_ALLOWED_ORIGINS`, then redeploy the backend if that setting changes. The frontend's Content Security Policy also takes the API origin from `NEXT_PUBLIC_API_BASE_URL` at build time.

This does not require connecting the organization domain. Keep the preview protected while testing.

## 4. Verify the actual deployed flow

1. GET `https://<backend-host>/actuator/health` and confirm `{"status":"UP"}`. A healthy database is required for that result; the response does not expose credentials or connection details.
2. From the authorized Vercel preview, submit a contact enquiry, a job application with an allowed résumé, and a consented subscription using test identities. Verify responses and rows in the **intended** Neon branch. Repeat submissions to check duplicate handling. Check the admin console and résumé download after the admin hardening PR is merged.
3. Verify actual confirmation and notification email delivery to approved test recipients, then unsubscribe and confirm the subscriber's status changes. Check browser Network for CORS and CSP errors.
4. Review database recovery settings and perform a restore drill on an isolated branch. Approve the privacy notice and terms with the client. Check desktop/mobile preview and rollback procedure before connecting the domain.

The admin access hardening from PR #22 is merged. The API host must use HTTPS. Once the site is approved, add the organization domain as a frontend origin, update the admin URL, and retest. Do not switch DNS early.
