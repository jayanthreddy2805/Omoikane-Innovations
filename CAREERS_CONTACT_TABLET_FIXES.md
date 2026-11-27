# Careers, Mini hero and Contact document fixes

Implemented all five annotations in `For air and pro left nav bar keep stick like even user scrolls it has to visible you goit.docx`.

- Live/main baseline: `09e51b0efdbb55c49eb9fb526bfc4f4ef783f74e`; READY Vercel deployment `dpl_ChjxeKQCA9Y1VdKKSJNEbnK3PXJi`, https://omoikane-innovations-3h7t.vercel.app/.
- Implementation commit: `0e35076c248e2e7c52a1dc4479a4c596e2bf8edf`; tested implementation tree: `7c1ce6f34bacbb2e1371299af2b2aa6880798b0b`.
- Review branch: `fix/tablet-careers-contact-20261127`. Automatic deployment is disabled for this branch. No merge or deployment performed.

[Open 10 before/after pairs](frontend/RESPONSIVE_QA/CAREERS_CONTACT_20261127/index.html). [Full-page evidence by route/device](frontend/RESPONSIVE_QA/CAREERS_CONTACT_20261127/full-pages). All measurements below are CSS pixels.

## Annotated issues and measured corrections

| ID / DOCX image | Route / device | Before / root cause | Implemented dimensions and behavior | Structural approval |
|---|---|---|---|---|
| CC-01 / 1 | All three Careers departments; Air 820×1180 and Pro 1024×1366 | At the same 350px scroll step, the Software nav moved from y≈208 to y≈−142. Both the Careers wrapper and body created non-scrolling overflow ancestors. Air also inherited horizontal mobile tabs through 1023px | Rail sticks at y=128, remains y=128 after another 120px scroll, and stops within its role section. Air uses a 211.8px rail, 32px gap and 494.2px content column; Pro retains its 320px rail and 64px gap. Mini retains horizontal tabs | Requested by owner |
| CC-02 / 2 | Home; Mini 768×1024 | Copy width 366.1px inside a 480px hero competed with the drone and photographic background | Approved three heading groups retained; copy width 540px, headline 36px / 40.32px unchanged. Existing mobile source now applies through 768px. A 768×320 media frame follows the actions by 30px; hero grows naturally to 695.7px. Full rotors, landing gear and camera remain visible | Owner requested mobile reference for Mini |
| CC-03 / 3 | Contact; Mini 768×1024 | A 480×360 blueprint, 24px visual padding, border and surrounding margins delayed the form | Entire large blueprint container hidden. Intro-to-form distance 24px. Form width 664px; first form row y≈282.7 instead of below the illustration. Section height 1445.9→996.9px | Explicit removal requested |
| CC-04 / 4 | Contact; Pro 1024×1366 | `min-height:100vh` left unused space after the form, compounded by 90px section padding. Submit-to-footer distance ≈302.8px | Content determines page height; Submit-to-footer distance 64px. Top clearance 176→128px. Intro-to-blueprint margin 40→24px. Existing two-column form/context composition, image asset, 417.6×313.2 image frame and 510.4px form width retained. Footer begins y=1079.2 instead of y=1366 | Spacing correction requested |
| CC-05 / 5 | Contact; Air 820×1180 | Desktop split left a 325.8px blueprint beside a 398.2px form column | Same stacked, image-free enquiry flow as Mini. Form width 640px, intro-to-form gap 24px. Fields remain single-column with 54px text inputs, 46px phone input, 140px textarea and 16px text | Explicit mobile method requested |

The removed illustration is the large engine/strategic blueprint shown in images 3 and 5. The existing small aeronautical sketch beside the Contact heading remains. No photographs, copy, claims, leadership content, typography tokens or approved phone layouts were replaced.

## Exact source changes

- `frontend/src/components/features/careers/CareerTemplate.module.css`: `.roleNav`, `.explorerLayout`, `.pageContainer`, and `body:has(.pageContainer)` scoped to Careers at ≥769px. Mobile role-tab rules now stop at 768px. `overflow-x:clip` preserves horizontal clipping without creating the ancestor scroll container that breaks native sticky positioning.
- `frontend/src/components/shared/HeroBanner.jsx`: existing mobile `<source>` threshold changes from 680px to 768px.
- `frontend/src/components/shared/HeroBanner.module.css`: only the 681–768px Mini composition changes: `.homeHero`, `.container`, `.heroContent`, `.homeBackdrop`, `.homeBackdropImage` and `.homeBackdrop::after`.
- `frontend/src/app/contact/page.module.css`: tablet `.pageWrapper`, `.container`, `.enquirySection`, `.enquiryText`, `.enquiryGrid`, `.enquiryVisualContainer`. Mini/Air use the stacked layout through 900px; Pro retains the split from 901px.
- `frontend/scripts/verify-careers-contact-tablets.cjs`: real-scroll geometry, all role selections and Apply destinations, form dimensions/editing, header department menu, reduced motion and axe checks. API/non-read requests are blocked; no form submitted.
- `frontend/scripts/verify-tablet-matrix.cjs`: repeatable 240-case coverage, footer input bounds, and a maximum 120px About banner height check to catch accidental shared-hero spacing.
- `frontend/vercel.json`: branch-specific deployment restriction. `frontend/.gitignore`: exclude working captures; selected review evidence is committed.

No new `!important` declarations or global spacing/typography rewrite.

## Verification and limits

- Production build, ESLint, TypeScript, site contracts, About film-only and protected UI checks passed. Dependencies/lockfile are unchanged; the installed tree from the preceding `npm ci` was reused.
- Fifteen live-before visual captures across Home, Contact and Software Careers at Mini, Air, Pro, 390×844 and 1440×900. Twenty-five after cases additionally include Mechanical/Electronics; final Careers captures supersede interim captures. Full-page and settled section/viewport screenshots were collected and visually reviewed for the changed tablet layouts.
- [240 route/viewport cases](frontend/RESPONSIVE_QA/CAREERS_CONTACT_20261127/matrix.json) passed on the final production build: all 24 specified viewport/DPR/touch configurations × Home, Technology, Leadership, Products, About, Contact, all three Careers departments and Apply. Includes landscape iPads, 320px stress, desktop sizes and breakpoint edges. No overflow, clipped visible inputs, missing H1, non-200 pages or browser exceptions.
- [15 tablet acceptance/axe cases](frontend/RESPONSIVE_QA/CAREERS_CONTACT_20261127/checks.json) passed; zero axe violations. All 13 roles were selected on each tablet and each generated the correct department/role Apply link. On Air/Pro all three rails remained at y=128 at both tested scroll positions. Mini kept its existing scrollable tabs.
- [Nine reduced-motion Careers cases plus three header menu checks](frontend/RESPONSIVE_QA/CAREERS_CONTACT_20261127/reduced-motion.json) passed; zero axe violations. Department menu opens/closes and exposes all three destinations on Mini/Air/Pro.
- Phone 390px and desktop 1440px Home/Contact before/after pairs document retained compositions. A separate [Mini About screenshot](frontend/RESPONSIVE_QA/CAREERS_CONTACT_20261127/about-mini-scope-check.jpg) verifies that the shared banner keeps its compact height. No fresh Lighthouse LCP benchmark was run; no claim of a measured LCP improvement is made. Home phone media/CSS remain unchanged; Mini uses the existing smaller mobile source.
- Chromium DPR/touch emulation, not physical iPad testing. WebKit executable is absent in this environment, so Safari verification remains outstanding.

No unresolved structural design choices beyond reviewing these requested changes. This PR leaves production unchanged until the owner accepts and merges it.
