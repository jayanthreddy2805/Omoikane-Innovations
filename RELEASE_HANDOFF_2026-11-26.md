# Omoikane — Task 6 final release readiness handoff
**Assessment: 26 November 2026 | Source baseline: `main` at `c3024c0be61a6942f4e28d092ff71d6a3861429d`**

## Decision: NO-GO for an unapproved production backend release

This document records authenticated **read-only** checks, existing CI evidence, and outstanding release controls. It is not authorization to deploy or a claim that the updated backend is live. No chatbot implementation, approved page structure, database write, provider email or production configuration is changed.

### Observed environment
| System | Authenticated observation | Assessment |
| --- | --- | --- |
| GitHub main | `c3024c0be61a6942f4e28d092ff71d6a3861429d` (merged PR #55) | Baseline; newer changes are still proposed in PRs |
| Vercel production | READY, GitHub ref `main`, commit `c3024c0be61a6942f4e28d092ff71d6a3861429d` | Deploy ready, **not** evidence that PR #57's About-film fix is live |
| Render `omoikane-api` | Live deploy `dep-dbq8ks0m7kps738npu7g`, commit `a87d448aae052a7b40502e8d9a5529a5177bdcd3` | **Old backend**; newer outbox/admin fixes not live |
| Render Git integration | `main`, `autoDeploy=yes`, `autoDeployTrigger=checksPass` | Unexpected old live commit; confirm controls before any merge, do not assume deploy triggers are harmless |
| Neon `omoikane` | Successful Flyway V1, V2, V3 only (read-only `flyway_schema_history`) | V4 and V5 **not applied**; any backend release may trigger these at startup |
| V4 duplicate preflight | **0 duplicate groups** for `lower(trim(email)), coalesce(trim(phone), '')` (aggregate-only read) | A snapshot in time, not a waiver of rechecking immediately before migration |

Neon project version: PostgreSQL 18. The Neon metadata reports a six-hour history window (`history_retention_seconds=21600`), **not** verified backup/restore readiness. Do not expose records or credentials to prepare the release.

### Open review PRs and verified CI
- **PR #56** — Task 4 SEO/accessibility and protected-UI regression checks: **open**, frontend GitHub Actions **success** ([workflow](https://github.com/jayanthreddy2805/Omoikane-Innovations/actions/runs/45767452502)).
- **PR #57** — Task 5 security controls and **About film without a still-image overlay**: **open**, frontend **success** ([workflow](https://github.com/jayanthreddy2805/Omoikane-Innovations/actions/runs/45768937304)), backend **success** ([workflow](https://github.com/jayanthreddy2805/Omoikane-Innovations/actions/runs/45768937296)).
- Both PR heads passed their own checks; **their merged combination has not been validated together on main.** Neither PR is included in the current live Vercel main deploy.
- GitHub CI success proves project tests/builds pass on the tested SHA, not live email deliverability, real mobile Safari, legal compliance, WCAG certification or production database rollback.

### Approved UI invariants — do not refactor without owner permission
1. Careers: retain earlier desktop/mobile department dropdown and existing Software/Mechanical/Electrical pages; `/careers` currently redirects to Software.
2. Leadership: retain prior hero/gallery/how-we-work template; placeholders must remain clearly labelled and `noindex` pending real approved identities.
3. Technology: only Aerospace and Defense; preserve previous desktop split/sticky presentation. Do not re-add Automotive or Railways there.
4. Home: keep Automotive and Railways cards/carousel along with Aerospace and Defense; no removed Technology anchors.
5. About: PR #57 removes only the video loading image; preserve video, 16:9 frame, mute, manual playback with reduced motion and surrounding structure.
6. Chatbot/RAG/Ollama/analytics are another developer's scope and excluded.

## Release gates (every gate requires explicit evidence)
| Gate | Status now | Required evidence / authority |
| --- | --- | --- |
| G1 — PR review and stable candidate SHA | **Pending** | Owner reviews PR #56/#57, resolves any conflicts, selects exact commit; separate merge approval |
| G2 — Approved backend release SHA | **Pending** | Confirm exact GitHub backend SHA including V4/V5 and Admin changes, and how Render will deploy it |
| G3 — Durable backup and successful isolated restoration | **Blocked** | DBA/owner supplies recovery point, checks encrypted backup and demonstrates restore before database migration |
| G4 — Database preflight | **Partial** | V1–V3 observed; normalized V4 duplicate-group count 0 now; repeat read-only check at release time |
| G5 — Production environment and network | **Pending** | Validate actual JDBC TLS/hostname, Render CORS for both verified public domains/Vercel hosts, provider configuration and retention disabled without exposing secret values |
| G6 — Controlled Render rollout | **Not authorized** | Approved maintenance window, auto-deploy control, single intentional deploy, migration success and exact live commit |
| G7 — Real business workflows after rollout | **Not performed** | Approved synthetic Contact, Career/CV, opt-in Newsletter, Admin, outbox/Resend delivery and error-path checks |
| G8 — Final browser/device QA | **Pending** | Live desktop/mobile pages, real Safari keyboard, 375/390/768/1440 widths, reduced motion, first-visit consent, About film and owner-approved UI check |
| G9 — Owner legal/content sign-off | **Pending** | Registered controller contact, retention periods, genuine leadership/company claims/certifications and official social profiles where required |

**Release decision:** GO only after G1–G9 have documented approval/evidence. If any gate fails, stop and investigate; do not work around it by deleting records, bypassing CI or applying Flyway `repair`/`clean`.

## Controlled approved release sequence (instructions only; not executed)
1. Select and approve a single final SHA. Review `backend/PRODUCTION_RELEASE.md` and read current Render/Vercel settings and domain ownership.
2. Confirm exact host auto-deploy behavior and pause/manage it in the agreed way **before merging** branches that may trigger a release.
3. Capture and test a durable backup/recovery point, preflight V4 normalized duplicates with aggregate-only SQL, review V5's additive email-outbox migration and confirm that `app.retention.enabled` is not enabled.
4. During the **approved** window, deploy exactly the selected backend artifact once. Observe Flyway V4 and V5, health and startup. Never assume rollback undoes migrations or sent email.
5. Verify domain CORS, authorized Admin, binary CV download, contact/career/newsletter API response paths, queued/outbox retries and actual email-provider acknowledgements with approved synthetic identities only.
6. Validate frontend production matches the approved commit, both canonical/noncanonical behavior and critical mobile workflows; collect screenshots/metrics for sign-off.
7. Record release/deploy IDs, migration versions, test results, any unresolved issues and recovery authority. Release is incomplete until documented acceptance.

### Stop conditions
- No verified backup plus restore; unexpected duplicate groups; Flyway checksum conflict; incorrect TLS/CORS; wrong Render source commit; wrong email recipients; unapproved data deletion; unauthorized or failing Admin/CV; missing email delivery; regression of locked UI; or any chatbot scope collision.
- A rollback of a Render container **does not revert** DB schema or email deliveries. Coordinate recovery and queued email state with the backend owner.

## Evidence provenance / limitations
- GitHub PR/CI state and Vercel/Render/Neon metadata were read through connected accounts on 26 November.
- Neon SQL queries were read-only, returning migration versions and one aggregate count; no personal row content was fetched.
- Legacy detailed local tests and previous CORS verification are recorded in `PRODUCTION_READINESS_REPORT.md` and `backend/PRODUCTION_RELEASE.md`; **not** rerun here.
- This handoff performs no live business-form POST, no production migration or backup action, no changes to host settings, and no deployment.
