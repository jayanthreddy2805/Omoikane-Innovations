# Tablet layout corrections from the latest document

Implemented the seven annotated screenshot requests in the latest DOCX. These changes supersede the affected hero, gallery and Technology-control choices from PR #69.

- Live baseline: `14fa3e014a8f64709641ab8e9d8d7103d97a66fb`, READY deployment `dpl_4H5ztgSTPSFc8YMgjRFDUd4HYmiw`, https://omoikane-innovations-3h7t.vercel.app/.
- Implementation commit: `f775406cb6974a20927f6306cdfc38936c21830f`; tested/published source tree: `3c19d7344a9e4c63a08b006190265b1f1ebc07a4`.
- Branch: `fix/tablet-final-layout-20261127`. Review only; no merge or deployment performed. Automatic deployment is disabled for this branch.

[Open 11 before/after comparisons](frontend/RESPONSIVE_QA/TABLET_FINAL_LAYOUT_20261127/index.html). Each pair preserves the CSS width. Full gallery regions have different heights because empty space was removed; the grey remainder is outside the gallery.

## Request mapping

| DOCX screenshot | Correction |
|---|---|
| 1 Mini Home composition and bottom gap | Center the copy/action group vertically within the existing 480px hero. The established three headline lines and both CTAs remain |
| 2 and 4 vertical blue strip on Home | Fix the actual cause: the backdrop started at 18%, exposing a different blue background. The backdrop now spans the hero; media keeps its rightward composition using internal spacing, with an opaque matching white fade across the former edge. This removes the hard rectangular seam instead of changing an unrelated decorative gradient |
| 3 About editorial sentence | Remove its 600px maximum, give it the full available tablet row and keep the complete sentence on one line. The expertise link follows on its own row. Text remains 16px on the three tablets |
| 5 Mini Leadership blueprint zoom without moving content down | Remove the 10px image inset on Mini and apply a restrained 1% frame scale. Actual artwork grows approximately 5.4%, while all labels/hardware remain inside the visible canvas. Canvas height stays 608.41px and the information band still begins at y=704.41px |
| 6 excessive Leadership gallery space | Use a normal two-column Air/Pro gallery without the pinned horizontal-scroll spacer or alternating vertical offsets. All four profiles, original square crops, names and dialogs remain. Desktop above 1100px retains its approved horizontal gallery; Mini keeps its vertical gallery |
| 7 category controls at bottom with no arrows | Put Aerospace/Defense back below the tablet media, remove sticky/top ordering, and hide their arrows only on tablets. Category state and sequence playback remain functional |

## Measured effects

| Measurement | Before | After |
|---|---:|---:|
| Air Leadership page height at 820×1180 | 4135px | 3254px |
| Pro Leadership page height at 1024×1366 | 4301px | 3280px |
| Mini Leadership canvas height | 608.41px | 608.41px |
| Mini Leadership information-band y position | 704.41px | 704.41px |
| Mini Leadership overall page height | 4788px | 4788px |

The Mini blueprint zoom is deliberately limited: the source has meaningful labels near its bottom edge. Increasing it further inside the same-height frame would clip those labels. No image asset was replaced, distorted or enlarged in download size.

## Files and selectors

All application paths below are under `frontend/`.

- `src/components/shared/HeroBanner.module.css`: tablet `.homeHero`, `.homeBackdrop`, `.homeBackdropImage`, `.homeBackdrop::after`; vertical alignment and continuous color transition.
- `src/app/about/page.module.css`: tablet `.editorialFooterStatement` and `.editorialFooterContent`.
- `src/components/features/leadership/LeadershipHero.jsx` and `.module.css`: move the existing contain/padding styling into `.blueprintImage`; remove padding and scale `.visualPlaceholder` only for Mini.
- `src/components/features/leadership/LeadershipGallery.js`: start desktop pinning at 1101px. `.module.css`: tablet `.scrollWrapper`, `.galleryHeader`, `.scrollContent`, `.gallery`, `.galleryImage`, portrait wrappers and captions.
- `src/components/features/expertise/ExpertiseSection.module.css`: tablet `.nav` after media and `.navArrow` hidden.
- `vercel.json`: branch-specific deployment restriction.

No global typography reset, new `!important`, content replacement, backend work, database work or legal changes.

## Verification

- Production build, ESLint, TypeScript, site contracts, About video-only and protected UI checks passed.
- 20 final visual capture cases across Home, About, Technology and Leadership at Mini, Air, Pro, phone 390×844 and desktop 1440×900. Twelve live-before tablet cases were captured before editing.
- 96 route/viewport checks passed, using all 24 established CSS viewport/DPR/touch configurations, including landscape tablets and breakpoint boundaries.
- Twelve tablet acceptance/axe cases passed with zero violations. Assertions cover the single-line sentence, heading layout, no empty Home frame, category controls below media, no visible arrows, retained category state/video playback and compact two-column gallery.
- All four profile dialogs opened/closed with focus return on all three tablets. Ten additional dialog cases passed in normal/reduced motion at 375, 768, 820, 1024 and 1440px.
- No production forms were submitted; non-read/API requests were blocked during the audit.

[Acceptance results](frontend/RESPONSIVE_QA/TABLET_FINAL_LAYOUT_20261127/checks.json) · [96-case matrix](frontend/RESPONSIVE_QA/TABLET_FINAL_LAYOUT_20261127/matrix/checks.json) · [normal/reduced-motion dialog results](frontend/RESPONSIVE_QA/TABLET_FINAL_LAYOUT_20261127/dialog-checks/checks.json) · [geometry](frontend/RESPONSIVE_QA/TABLET_FINAL_LAYOUT_20261127/geometry.json).

Focused acceptance can be repeated from `frontend/` after building:

```sh
PLAYWRIGHT_MODULE=/path/to/playwright CHROME_PATH=/path/to/chromium \
  AXE_MODULE=/path/to/@axe-core/playwright node scripts/verify-tablet-final-layout.cjs
```

These are Chromium emulation results, not physical iPad or Safari verification. Fresh LCP measurements were not performed. Review the screenshots before accepting the visual result; nothing has been merged or deployed by this task.
