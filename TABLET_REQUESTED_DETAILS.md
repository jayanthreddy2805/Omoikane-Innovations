# Requested tablet details — latest screenshot corrections

Implements the owner's five latest requests. These supersede the affected Mini photograph, portrait blueprint, Air role rail and hidden Mini CTA choices in the preceding reports.

- Live/main baseline: `f1bd58f77ccd60a63ae79240c71616b74f88784b`, READY Vercel deployment `dpl_4Z127N99rjynoSzjAqbqMYdrsniL`.
- Implementation: `99f6b1d17d8b0db8753863c9ee2c88e0fa9181ac`; source tree `19d9f555c54eacb33f182e3589b4116b2b85743c`.
- Branch: `fix/tablet-requested-details-20261127`. Review only: no merge or deployment performed; automatic Vercel deployment disabled for this branch.

[Eight before/after comparisons](frontend/RESPONSIVE_QA/TABLET_REQUESTED_DETAILS_20261127/index.html) · [Pro reference captures](frontend/RESPONSIVE_QA/TABLET_REQUESTED_DETAILS_20261127/pro-reference) · [measured geometry](frontend/RESPONSIVE_QA/TABLET_REQUESTED_DETAILS_20261127/geometry.json).

| Issue / screenshot | Correction and measured result |
|---|---|
| TD-01 / 1–2: Mini Home photo looks separate from Air | Remove the inset frame and vertical mask. Use Air's continuous full-height photograph with a wider white reading fade on Mini. Media height 352→480px; hero remains 480px, copy 366px and approved headline 36px / 40.32px. Air/Pro hero dimensions remain unchanged |
| TD-02 / 3: Mini/Air CTA should match Pro | Restore the complete six-item strip on Mini and use one row on Air, matching the actual Pro reference. Mini card height 184.2→349.8px because previously hidden content is now visible; Air 416.9→355.3px by removing the second row. Pro remains 355.3px. Captions remain readable, inside the card and clear of their neighbors; contact destination is unchanged |
| TD-03 / 4: Mini Leadership should use Air/Pro method | Existing landscape blueprint, contained without distortion, with the same two-column editorial band. Canvas 608.4→299.5px; hero 892.0→610.5px. Air/Pro source, layout and dimensions stay unchanged. Phone portrait artwork is retained through 600px |
| TD-04 / 5: Air Careers should use Mini navigation | All Software/Mechanical/Electronics role selectors become scrollable horizontal tabs above the role content through 900px. At Air, a 211.8px side rail becomes a 738px tab row. Pro keeps its sticky rail. All 13 roles and department-specific Apply destinations remain functional |
| TD-05 / 6: FAQ numbers and icon circles | Remove numbers from the DOM at every width. Retain the plus/expand animation without border, background disc or radius in either state. The former 1px circular border becomes 0px with 0px radius; answers align with the question text. Enter/Space and expanded/hidden states remain functional |

All requested visual changes are explicitly authorized by the latest message. No unresolved structural design choice requires separate approval. Existing photographs, profiles, claims and page content remain intact.

## Source scope

- `frontend/src/components/shared/HeroBanner.module.css`: Mini `.homeBackdropImage`, `.homeBackdrop::after` and `.heroContent`; remove the old inset/mask treatment.
- `frontend/src/components/shared/CallToAction.module.css`: 681–960px `.ctaBottomSection`, `.ctaContentCentered`, `.ctaPartnersList`, `.ctaPartnerLabel`. The shared CTA on Home, About and Products receives the same treatment; phone and Pro rules are retained.
- `frontend/src/components/features/leadership/LeadershipHero.jsx` and `.module.css`: phone source/rules end at 600px; 601–1100px uses the established landscape tablet canvas and band.
- `frontend/src/components/features/careers/CareerTemplate.module.css`: tabs through 900px; sticky rail and overflow handling from 901px. Other career hero and role content styles are retained.
- `frontend/src/app/about/page.js` and `.module.css`: remove `.faqNumber` markup/styles, remove icon disc and obsolete answer indentation.
- `frontend/scripts/verify-careers-contact-tablets.cjs`: update superseded Mini media and Air rail assertions. `frontend/scripts/verify-requested-tablet-details.cjs`: keyboard, CTA, blueprint and axe acceptance.
- `frontend/vercel.json`: branch deployment restriction.

No new `!important` declarations, global typography override, backend work or legal changes.

## Verification

- Production build, lint, TypeScript, site contracts, protected UI and About film-only checks passed. Dependency/lockfiles are unchanged; the existing installed tree was reused.
- [240 route/viewport cases](frontend/RESPONSIVE_QA/TABLET_REQUESTED_DETAILS_20261127/matrix.json) passed across all 24 established viewport/DPR/touch configurations and ten primary routes, including all three Careers departments. No horizontal page overflow, clipped visible inputs, browser errors or oversized About banner.
- [15 route acceptance/axe cases plus three menu checks](frontend/RESPONSIVE_QA/TABLET_REQUESTED_DETAILS_20261127/careers.json) passed on Mini/Air/Pro. All 13 roles were selected on each tablet; correct Apply links, Air/Mini tabs and Pro sticky behavior were checked.
- [Eight focused checks](frontend/RESPONSIVE_QA/TABLET_REQUESTED_DETAILS_20261127/details.json) and [eight reduced-motion checks](frontend/RESPONSIVE_QA/TABLET_REQUESTED_DETAILS_20261127/reduced-details.json) passed. Cover Mini/Air/Pro CTA and landscape blueprint, plus FAQ at phone 390px and desktop 1440px. All FAQ questions open and close with Enter/Space. CTA captions are checked against the card and neighboring captions, allowing normal use of the grid gutters.
- Across those three suites: 31 axe scans, zero violations. [Ten dialog keyboard/focus checks](frontend/RESPONSIVE_QA/TABLET_REQUESTED_DETAILS_20261127/dialogs.json) also passed in normal/reduced motion.
- Twelve live-before and twelve local-after focused capture cases were inspected, including individual FAQ, CTA and role sections after scrolling and animation settlement.

Chromium touch/DPR emulation, not physical-device or Safari verification. No fresh LCP benchmark was run; no performance improvement is claimed. No forms were submitted and API/non-read requests were blocked during browser checks.
