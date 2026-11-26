# Task 7 — merged-main verification handoff

**Read-only review:** 26 November 2026. **Verified GitHub main:** `f28df64bd2636bd0bfe8ebf9b3f7d21409874665`. This report updates the previous Task 7 isolated-candidate and release-handoff evidence to the **actual merged main**. No source edits, production changes, synthetic submissions or migrations were performed.

## Verified current state

| Check | Evidence | Conclusion |
| --- | --- | --- |
| Merge state | GitHub PRs #56, #57, #58, #59, #60 and #61 are merged; no open PRs in the checked listing | Integrated changes now reside on main |
| Final commit CI | Frontend checks and Backend tests both **success** for `f28df64bd2636bd0bfe8ebf9b3f7d21409874665` | Passing automated project checks on final combined SHA; not proof of live browser or API correctness |
| Vercel production | Latest deployment `dpl_9cfVna691HBE4z6gcK37P5hJoiHJ` is READY, production, from `f28df64bd2636bd0bfe8ebf9b3f7d21409874665` | Production frontend matches GitHub main |
| Render live API | Service `srv-dbpjehei0phs73ac8s0g`; live deploy `dep-dbq8ks0m7kps738npu7g` from `a87d448aae052a7b40502e8d9a5529a5177bdcd3`, dated Nov 11 | **Not updated**; business workflows on the new backend are NOT established live |
| Earlier isolated browser/DB tests | `TASK_7_INTEGRATION_REPORT.md` (PR #59) | Chromium responsive/axe and synthetic Spring Boot + PostgreSQL V1–V5 checks passed on a combined candidate before final main merge; **not freshly rerun on current production** |
| Task 8 mobile investigation | `TASK_8_MOBILE_PERFORMANCE_REPORT.md` (PR #61) | Repeat Lighthouse modeled mobile LCP remained >2.5 seconds for five tested pages; not a release-blocking functional regression by itself, but unresolved performance work |
| Approved UI source contracts | `frontend/scripts/verify-protected-ui-decisions.mjs` now exists in main and final frontend CI passed | Covers requested Careers dropdown/redirect, Leadership template, Home four sectors and Technology two-sector/split styling; source assertions are not a full visual/browser certification |

## Current status of Task 7

**Code integration: verified green**. **Production frontend deployment: verified READY, matching main.** **Full fresh post-merge Playwright + real-device smoke: not performed by this read-only review.** The prior isolated tests should not be mislabeled as a fresh production pass.

The existing release checklist predates merging PRs #56–#61 and should be interpreted using this addendum instead of its historical open-PR descriptions. No client-approved design/content or chatbot work is reopened.

## Remaining Task 7 browser acceptance (to perform on the deployed frontend)

- Check at 320, 375, 390, 414, 768, 960 and 1440px: no overflow/errors; real internal links, mobile navigation, cookie choices and form client validation.
- Verify Home four sectors, Technology Aerospace/Defense with desktop sticky split, Careers dropdown and selected-role → Apply, Leadership gallery dialog keyboard/focus handling, About video **without** loading still, and reduced-motion behavior.
- Confirm SEO canonical/robots/OG on production and nonproduction hosts.
- Complete a physical Safari/mobile keyboard smoke where available; no WCAG certification is claimed.
- Do not send actual customer data or mutate production backend during UI QA.

## Task 9 release boundary

Render is still on an old commit; Flyway V4/V5 production migration status and durable backup/restore readiness must be freshly verified before any approved release. Preserve explicit owner approval and rollback plan; production Flyway migrations, service deploys, email sends and data deletion are **not authorized by this document**.

**Current decision:** frontend merged-code/CI handoff is ready for owner review; full production end-to-end signoff is **not** established. Proceed to Task 9 planning only after remaining live frontend acceptance evidence is collected or explicitly deferred.

## Live infrastructure read-only recheck — 26 November 2026

This section is direct connected-service evidence, **not** an execution of the release procedure.

| System | Fresh observation | Gate |
| --- | --- | --- |
| GitHub | `main=f28df64bd2636bd0bfe8ebf9b3f7d21409874665`; final frontend and backend workflows succeeded; only this PR #62 open | Candidate source and CI are green |
| Vercel | Latest production deployment `dpl_9cfVna691HBE4z6gcK37P5hJoiHJ` READY with same commit | Frontend deploy metadata matches source; live browser still requires Codex QA |
| Render | `omoikane-api` still live at deploy `dep-dbq8ks0m7kps738npu7g`, commit `a87d448aae052a7b40502e8d9a5529a5177bdcd3` | **Blocked**; autoDeploy=yes, autoDeployTrigger=checksPass, main branch, yet unchanged since Nov 11 — investigate Git integration before release |
| Neon production | PostgreSQL 18, default branch `br-plain-brook-aolmdy63`; applied Flyway V1–V3 success only | V4/V5 not applied |
| V4 preflight | Read-only exact normalized-email/phone duplicate aggregate returned **0 groups** | Positive preflight observation; repeat immediately before approved migration |
| Recovery | Neon snapshots list **empty**; project history retention **21600 seconds (6 hours)** | **Blocked** pending durable backup and successful isolated restore rehearsal; history is not a verified backup |

### Migration source check

- `backend/src/main/resources/db/migration/V4__unique_contact_details.sql` defines a unique index on `lower(trim(email)), coalesce(trim(phone), '')`. The preflight above uses the same expression.
- `backend/src/main/resources/db/migration/V5__email_delivery_outbox.sql` creates `email_delivery_jobs` with a unique `(kind, submission_id)` and partial due-job index; migration not run on production.
- Runtime JDBC TLS, allowed CORS origins, external email provider and complete deployment controls **not verified**; do not print secrets to check them.

**Next owner-controlled steps:** Codex live frontend Playwright acceptance; approve exact backend SHA, verify recovery point and tested restore, verify actual Render deploy settings and runtime environment, repeat duplicate preflight, then separately authorize a controlled release window. No deployment, backup creation, SQL writes or migration performed here.
