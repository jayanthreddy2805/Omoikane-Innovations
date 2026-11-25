# Omoikane code audit — 25 November 2026

Baseline: main. Live-only findings are verified against source; no company credentials are assumed.

| ID | Files | Confirmed | Root cause / existing protection |
|---|---|---|---|
| OI-01 | leadership/page.js; LeadershipGallery.js; Header.jsx; FooterContent/index.tsx | Yes | Template names and credentials are published. Remove route and links until verified data exists. |
| OI-02 | careers/page.js; Header.jsx | Yes | Landing page explicitly calls notFound; Careers toggles a dropdown. |
| OI-03 | ContactForm.jsx; ApplyForm.jsx; contact/page.js; apply/page.js | Yes | useSearchParams inside Suspense forces static rendering bailout; contact anchor is inside boundary. |
| OI-04 | FooterContent/index.tsx | Yes | Generic Twitter/Instagram destinations; accessible labels and rel already exist. |
| OI-05 | app/layout.js; route layouts | Yes | Root OG URL host differs and child routes inherit incomplete metadata. |
| OI-06 | contact/page.js; Header.jsx; WorkClient.jsx; about/page.js | Partial | Adjacent span text joins; about has responsive duplicate titles. |
| OI-07 | HomeClient.jsx; expertiseData.ts | Yes | Independent home categories include suppressed expertise entries. |
| OI-08 | Header.jsx | No (extra defect) | Search dialog exists with focus handling; Enter uses full navigation. |
| OI-09 | LoadAwareImage.jsx; next.config.mjs | Partial | Most callers specify sizes; defaults include 3840. AVIF/WebP already enabled. |
| OI-10 | ExpertiseSection.tsx; AerospaceVideoSequence.tsx; AboutHero.jsx | Yes | Both desktop/mobile trees mount videos. Some viewport and motion handling exists. |
| OI-11 | SelectedWork.jsx; WorkClient.jsx | Yes | Independent arrays differ in order and use illustrative unrelated assets. Actual product photography unavailable. |
| OI-12 | AboutMetrics.jsx; WorkClient.jsx; metadata | Owner | Evidence cannot be established from source. Preserve claims for owner review. |
| OI-13 | FooterContent/index.tsx; ConsentAwareAnalytics.jsx | Partial | Button and consent gating exist; label says Cookies. beforeSend checks withdrawal. |
| OI-14 | privacy/page.tsx; backend | Yes | No defined retention job or approved legal/controller details. Never invent legal policy. |
| OI-15 | CareerApplicationService.java; ResendEmailService.java; RateLimitFilter.java; AdminController.java | Partial | Server validation, bounded limiter, 5MB and file signatures, authenticated DB downloads exist. Career field lengths, DOCX container validation and subject CR/LF need hardening. Email attachments expand retention scope. Java backend uses Bean Validation rather than zod. |
| OI-16 | app; next.config.mjs | Yes | No sitemap/robots or preview indexing gate. Organization JSON-LD already exists. |
| OI-17 | about/page.js | Yes | Answers only mount when expanded; no FAQ JSON-LD. |
| OI-18 | LeadershipGallery.js | Partial | Dialog attributes exist; route removal resolves public exposure with OI-01. |
| OI-19 | TechMarquee.tsx; ChatbotMount.jsx | Partial | Chat is already intent-loaded; repeated marquee needs hiding and cookie overlap review. |
| OI-20 | public/images/leadership; AboutHero.jsx | Yes | Space-containing mobile asset and paired responsive images. |
| OI-21 | CareerTemplate.jsx; ApplyForm.jsx; apply/page.js | Partial | Role query passed and allow-listed, but dept is not validated; missing IST; office precedes form on mobile. Copy owner review only. |
| OI-X1 | next.config.mjs | Yes | CSP may block externally hosted Vercel Analytics script/telemetry. Verify installed analytics endpoint defaults. |
| OI-X2 | Header.jsx; FooterContent/index.tsx; render.yaml | Yes | Search Enter reload; stale Electronics label; production CORS host missing. |
| OI-X3 | LoadAwareImage.jsx | Yes | Images remain invisible until JavaScript load handler executes, including SSR LCP image. |
| OI-X4 | package-lock.json | Yes | npm ci fails: missing emnapi runtime/core lock entries. |
| OI-X5 | CareerApplicationService.java | Yes | Frontend prod-eng-elec absent in backend allow-list. |

## Infrastructure (read-only)
Railway: no connected projects. Neon project omoikane: expected public form tables and Flyway history exist; no personal records read. Render: owner confirmed My Workspace; omoikane-api points at this repository main, Singapore, one free Docker instance, /actuator/health readiness.

Security findings recorded before behavior changes. No production data deletion, migration execution, deployment or main push is part of this review branch.
