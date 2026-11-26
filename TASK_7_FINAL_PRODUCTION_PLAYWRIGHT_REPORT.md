# Task 7 — final production browser verification (26 November 2026)

## Verdict and deployment identity

**Production sign-off is blocked.** GitHub `main` was `f28df64bd2636bd0bfe8ebf9b3f7d21409874665` when this QA branch was created. During the run, `main` advanced to `ed51b87cd62b06c19fa26d5709b23ef9f9e7912d` by merging PR #62; its only changed file relative to the tested main was `TASK_7_MERGED_MAIN_VERIFICATION.md`, so the tested frontend source is unchanged. This PR is based on that latest main. Vercel deployment `dpl_9cfVna691HBE4z6gcK37P5hJoiHJ` reports `READY`, production, and the tested `f28df64` commit. Its working alias is `https://omoikane-innovations-3h7t.vercel.app`. The connected Vercel project's domain list contains that alias, but not `omoikaneinnovations.com`.

In a real browser, `https://omoikaneinnovations.com/` redirected to `https://www.omoikaneinnovations.com/` and rendered a different **WordPress 7.0.9** website (WordPress assets, WordPress canonical URL, old `/about-us/` and `/services/` navigation, and no Next scripts). Visiting `https://www.omoikaneinnovations.com/expertise` displayed **“Page not found – Omoikane Innovations”** and “It looks like nothing was found at this location.” The custom-domain route's numeric HTTP status was not captured. Direct shell access to the custom domain timed out in this workspace; the [browser/deployment observation](frontend/TASK_7_FINAL_QA/production-observation.json) and Vercel domain/deployment records are independent evidence of the mismatch. The WordPress and Vercel tabs were preserved for owner review.

The blocker requires an owner-approved hosting/domain cutover outside this QA PR. No DNS, alias, deployment, backend, database, or email setting was changed. The fixes in this PR have **not** been deployed. All results below explicitly distinguish the custom domain, the Vercel alias, and the isolated local build.

## Route and viewport results

The Vercel connector returned HTTP 200 for every route in the following table. A real cloud browser rendered the alias Home, Technology, and About pages; it showed the four Home sectors, Technology's Aerospace/Defense category buttons, and an About video element. This is supplementary alias evidence, not a seven-width production browser pass.

The local `next start` QA-branch build was tested in headless Chromium at **320, 375, 390, 414, 768, 960, and 1440px**, with saved essential-only consent and reduced motion. At all 84 route/width combinations: HTTP 200, exactly one main H1, no horizontal overflow, no page errors, no broken loaded images, and no missing in-page anchors. The local-link crawl outcome is in [the route matrix](frontend/TASK_7_FINAL_QA/route-matrix.json). These checks do **not** establish that the custom domain serves those routes.

| Route | Custom domain | Vercel alias HTTP | Local seven-width browser |
| --- | --- | ---: | --- |
| Home `/` | WordPress site; wrong release | 200 | Pass |
| About `/about` | Not verified on target domain | 200 | Pass |
| Technology `/expertise` | WordPress “Page not found” | 200 | Pass |
| Products `/work` | Not verified on target domain | 200 | Pass |
| Leadership `/leadership` | Not verified on target domain | 200 | Pass |
| Careers `/careers/software` | Not verified on target domain | 200 | Pass |
| Careers `/careers/mechanical` | Not verified on target domain | 200 | Pass |
| Careers `/careers/electronics` | Not verified on target domain | 200 | Pass |
| Contact `/contact` | Not verified on target domain | 200 | Pass |
| Apply `/apply` | Not verified on target domain | 200 | Pass |
| Privacy `/privacy` | Not verified on target domain | 200 | Pass |
| Terms `/terms` | Not verified on target domain | 200 | Pass |

The browser did not capture numeric status codes for individual custom-domain routes beyond observing the Home site and Technology not-found page. Do not read “not verified” as a passing or failing HTTP status.

Screenshots of the **local QA build** after the nonstructural fixes: [Home 375](frontend/TASK_7_FINAL_QA/home-375.jpeg), [Home 1440](frontend/TASK_7_FINAL_QA/home-1440.jpeg), [Leadership 375](frontend/TASK_7_FINAL_QA/leadership-375.jpeg), [Leadership 1440](frontend/TASK_7_FINAL_QA/leadership-1440.jpeg). These are visual evidence for the affected shared header and Leadership typography, not screenshots of the custom domain. The custom-domain mismatch is preserved in the live browser tab rather than a committed image.

## Protected UI and business flows (local build)

- At 375 and 1440px, Home's four approved sectors were present; the mobile carousel advanced through Aerospace, Defense, Automotive, and Railways and its links targeted valid local routes. Technology had exactly Aerospace and Defense controls. The source contract still verifies its desktop sticky-left split layout. Its cinematic media/layout were not changed.
- Leadership hero, gallery and How We Work remained present. A profile dialog opened, focused a control after its existing animation, kept Tab inside, closed on Escape, and returned focus to the opener at both widths.
- Software, Mechanical, and Electronics Careers pages loaded; selecting a role produced an Apply URL with the correct department and role, and Apply presented a role selection. Desktop/mobile department menus and first-visit cookie choices passed the existing seven-width mobile-polish harness.
- About kept a single company video, no video poster, no initial video source under reduced motion, and loaded the source after explicit Play. The existing film-only and no-JavaScript first-paint tests passed.
- Contact validation, invalid optional phone, 429/409/500/network error recovery, and duplicate-click prevention passed at 375 and 1440px. Apply query fallback/preselection, invalid empty/disguised/oversize résumé files, invalid drop, 413 retry, and valid synthetic submission passed. Newsletter consent and duplicate feedback passed. Admin failed login, fixture listing, dialog focus, cancellation and logout passed. Cookie defaults, reopening, withdrawal, persistence and Escape passed. **All business API calls were intercepted with synthetic responses on the local build; no production forms, emails, records or admin requests were used.**

## Accessibility and performance

Axe was run against main/header/footer on every local route at 375 and 1440px **after entrance animations settled**: 24 checks, zero reported violations. Before the fixes, a shared logo link produced a serious accessible-name mismatch on all 24 checks, and Leadership description text had a 4.47:1 contrast ratio on its pale background (two nodes at both widths). The redundant gallery photo alt text was a minor issue. The header name/word spacing, Leadership description color, and decorative gallery alt text were corrected with no layout or approved-content change. A preliminary 300ms animation-state scan also reported transient contrast ratios on Home and Contact; a settled-state recheck did not reproduce them. This is not WCAG certification; manual screen-reader and production-domain checks remain open.

The following are **one cold Lighthouse mobile run per route on the local QA build**, not field data or production-domain results. Lighthouse 13.6.0, 412×823, 4× CPU, simulated 150ms RTT and 1638kbps, first-visit cookie choices visible. [Machine-readable measurements](frontend/TASK_7_FINAL_QA/lighthouse-local-summary.json).

| Local route | Performance | LCP | CLS | Accessibility |
| --- | ---: | ---: | ---: | ---: |
| Home | 92 | 3.414s | 0 | 100 |
| Technology | 94 | 3.024s | 0 | 100 |
| Software Careers | 93 | 3.243s | 0 | 100 |
| Contact | 92 | 3.314s | 0 | 100 |
| Apply | 92 | 3.391s | 0 | 100 |

Task 8's three-run **local** post-fix medians were Home 3.412s, Technology 3.162s, Careers 3.323s, Contact 3.314s and Apply 3.391s. These single current runs are broadly consistent but are **not a controlled before/after comparison** and do not measure the custom domain. All five local LCP values exceed 2.5s. Field INP is unavailable. No cookie or animation timing was changed to manipulate Lighthouse.

## Changes, verification and remaining blockers

| Severity | Finding | Action | Verification | Status |
| --- | --- | --- | --- | --- |
| Critical | Requested production domain serves WordPress instead of merged Next release; `/expertise` displays not-found | Documented; hosting/domain correction requires separate approval and deployment ownership | Browser DOM, route view, Vercel deployment SHA and domain list | **Blocked for production sign-off** |
| Serious | Header brand link accessible label omitted exact visible wording/space | Aligned name and visible word spacing; removed redundant inner label | Axe 375/1440 on 12 routes, local build and screenshots | **Fixed on QA branch; not deployed** |
| Serious | Leadership body copy contrast 4.47:1 on pale background | Slightly darkened only description color | Axe 375/1440 Leadership, screenshots | **Fixed on QA branch; not deployed** |
| Minor | Leadership gallery photo repeated its button/profile text | Empty decorative image alt | Axe 375/1440 Leadership | **Fixed on QA branch; not deployed** |

`npm ci`, `npm run lint`, `npx tsc --noEmit`, `SITE_AUDIT_EXCLUDE_CHATBOT=1 npm test`, `npm run build`, `verify-protected-ui-decisions.mjs`, `verify-final-production-qa.mjs`, `verify-final-protected-interactions.mjs`, `verify-business-workflows.mjs`, `verify-mobile-polish.mjs` (all seven requested widths), and `verify-task8-first-paint.mjs` passed after the fixes. The first exploratory axe run failed on the real accessible-name/contrast findings and the final run passed. The first interaction test revision incorrectly expected “HOW WE WORK” to be an H2 and tried to match a SplitType-transformed dialog by exact accessible name; the corrected checks verify the actual section and dialog state. No product/backend source was changed.

**Release blocker:** An authorized owner must align the intended production hostname with the approved Vercel release and then rerun the entire real-browser matrix, forms with mocked API, axe, and Lighthouse against `https://omoikaneinnovations.com`. The Vercel alias/local results cannot substitute for that verification. Do not merge this PR or deploy it as part of this task.
