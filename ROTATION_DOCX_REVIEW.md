# DOCX rotation follow-up — 28 November 2026

This review reread all fifteen notes in `This is for iphone se follow mobile version ok the text structure here alright.docx` twice, in document order, including its embedded screenshots. The screenshots marked Air 1180×820, Pro 1366×1024 and Mini 1024×768 are **landscape**, not new portrait devices. Earlier tablet DOCX notes about sticky Careers navigation and Contact media were also revisited.

Live baseline: main `047478fa1b61e7ab3cad22ce4a522b7dce6dea86` (merged PR #75), Vercel READY deployment `dpl_FC8jrfbint26AYtCJ9wDjwMPzT8w`. Tested source commit: `100d5063d30199c65c6def57e00af536898960c6`, source tree `d48d9e64afc2995d4d987d0d42bd7da8e8ced380`. This new PR starts from #75; it does not repeat the old #47 branch update.

[Before/after gallery and route/device screenshots](frontend/RESPONSIVE_QA/ROTATION_REVIEW_20261128/index.html) · [measured dimensions](frontend/RESPONSIVE_QA/ROTATION_REVIEW_20261128/measurements.json).

## Remaining defects corrected

| ID | Route / component | Device and measured before → after | Cause and correction |
|---|---|---|---|
| ROT-01 | Home, `.homeHero` | Mini landscape 1024×768: 563.19→480px high. Air landscape 1180×820: 580→480px. Pro landscape 1366×1024: 580→480px | `55vw` made the hero grow when the screen became wider and shorter. An orientation-specific touch-tablet rule uses Air's established 480px portrait composition as the minimum. Content can still grow naturally. The approved three headline groups, image asset and both CTAs are retained. |
| ROT-02 | Header search, modal focus restoration | Pro 1024×1366→1366×1024: focus returned to BODY → visible Search button. Reverse rotation: BODY → visible Menu button | Closing tried to focus the original opener even after the other header layout hid it. Prefer that opener when still visible; otherwise choose the visible counterpart. X, Escape, outside dismissal, query preservation and focus containment are checked in both directions, with normal and reduced motion. |

Home landscape description-to-CTA distance stays 18px. Space from the final CTA to the hero boundary changes: Mini 128.05→86.45px; Air 127.81→77.81px; Pro 120.98→70.98px. All copy and buttons remain inside the hero. Photographs retain their original sources, cover treatment and alignment; the lower hero reduces their displayed area without changing source resolution or download size. No font family, weight, size, approved headline wording, card structure or content changes.

Portrait return checks retain Mini/Air's 480px and Pro's 563.19px hero heights. Mouse-driven desktops remain outside the new touch/orientation rule. No structural approval is needed for these two corrections.

## DOCX checks carried forward from #75

These were already present in the newly deployed baseline; this PR verifies them rather than claiming to implement them again. The original fifteen before/after comparisons remain in [the preceding report](PHONE_LANDSCAPE_DOCX_FIXES.md).

| DOCX images | Requests checked again | Result |
|---|---|---|
| 1, 5 | SE and Fold Home mobile reading order and CTA spacing | Natural heading/description/actions flow; phone carousel retained, including return from landscape |
| 2 | Mission selector fitting its photo | All three choices fit and work at the tested compact widths; switching works after tablet rotation |
| 3, 7 | About metrics/certification gaps | Targeted join checks remain 48px on small phones and 64px on larger layouts |
| 4 | Privacy Notice wrapping | The complete link label stays together; legal sentence remains naturally wrapped |
| 6, 10 | Technology hero artwork on Hub / Air landscape | Existing 32px right/bottom frame insets and `contain` remain; Air/Pro verified after rotation and return |
| 8, 14, 15 | Desktop Apply order, including Air/Pro landscape | Context left / form right above 1024px; compact form-first flow returns in portrait; typed name survives rotation |
| 9 | Search X and outside dismissal | Retained, with the additional cross-breakpoint focus fix above |
| 11–13 | Home tablet composition in landscape | Three headline groups retained on all three iPads; height corrected by ROT-01 |

The earlier Careers instruction is also verified: Mini/Air compact role tabs at widths ≤900px; sticky role rail at wider widths, including Air/Pro landscape. Selected roles and their department/role-specific Apply links survive rotation. All four Home sectors and Mini's carousel selection survive the breakpoint change. FAQ stays unnumbered with a plain plus; the footer Careers link remains removed.

## Verification and evidence

- **144 orientation states, zero failures:** three iPads × ten routes × three states in normal motion; three iPads × four affected routes × three states in reduced motion; SE, XR and Fold × Home/Contact × three states. Each sequence keeps one loaded document, confirmed with a document marker. Viewport dimensions, touch, DPR and `screen.orientation` are updated without navigation or reload. [Results](frontend/RESPONSIVE_QA/ROTATION_REVIEW_20261128/final/checks.json).
- **240 static cases, zero failures:** all original 24 device/breakpoint configurations × ten primary routes, including the requested phones, 320px stress case, three portrait/landscape iPads, 1280/1440/1920 desktops, and 767/768/769 plus 1023/1024/1025 breakpoint checks. These check status, overflow, visible input bounds and browser errors; they are not presented as 240 visual sign-offs. [Results](frontend/RESPONSIVE_QA/ROTATION_REVIEW_20261128/matrix/checks.json).
- **31 DOCX regression cases**, **10 profile-dialog cases**, and **12 search rotation/dismissal cases** passed. The profile suite covers normal/reduced motion and keyboard focus at phone, tablet and desktop widths. Search tests were run against the final Header build. [DOCX](frontend/RESPONSIVE_QA/ROTATION_REVIEW_20261128/docx-regression.json) · [profiles](frontend/RESPONSIVE_QA/ROTATION_REVIEW_20261128/profile-dialogs.json) · [search](frontend/RESPONSIVE_QA/ROTATION_REVIEW_20261128/search/checks.json).
- Nine axe scans across DOCX/search/full-page checks: zero violations. Two additional axe scans cover returned Air Home/Apply with reduced motion: zero violations.
- `npm ci --prefer-offline --no-audit --no-fund`, lint, TypeScript, site contracts, About film-only checks, protected UI checks and production build passed. Dependencies and lockfile are unchanged.
- Organized full-page landscape captures cover the ten routes on each iPad after scrolling through lazy/animated sections. Home has identical-viewport live-before, after and returned-portrait viewport captures. Full-page captures can place sticky elements differently from viewport captures; the hero comparisons use viewport captures.
- Browser tests block API requests and all non-GET/HEAD requests. No production submission or upload occurred.

These are Chromium CSS-viewport, touch and DPR emulations, not physical-device testing. WebKit is unavailable in this runtime. No fresh LCP benchmark is claimed; the new media query does not affect portrait phone layouts and adds no assets. Automatic Vercel deployment is disabled for this review branch. No merge or deployment is requested. No remaining structural design decision was introduced.

## Exact implementation files

- `frontend/src/components/shared/HeroBanner.module.css`: `.homeHero` within the 681–1366px landscape/coarse-pointer media query.
- `frontend/src/components/layout/header/Header.jsx`: search focus cleanup; capture the candidate controls on open and evaluate their visibility on close.
- `frontend/scripts/verify-in-place-rotation.cjs` and `frontend/scripts/verify-search-rotation.cjs`: repeatable stateful rotation acceptance checks.
- `frontend/vercel.json`: disable deployment for `fix/rotation-docx-review-20261128`.
