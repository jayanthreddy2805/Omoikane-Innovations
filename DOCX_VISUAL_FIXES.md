# DOCX requested visual corrections

Implemented the instructions attached to the twelve screenshots in the owner's DOCX. This follow-up supersedes the affected tablet choices in PR #68. The source document was read in paragraph/image order and every embedded screenshot was inspected.

Live baseline: `a3c84a208c8cb9880d20487b76a98bd85b1e479b`, deployment `dpl_DRmUKtUe3hxutYNCL8KvqDUp7Fpv`, READY at https://omoikane-innovations-3h7t.vercel.app/.

Implementation commit: `9a2d5ff778da6e7d4970d159813e28af47aeb530`. The tested source tree and published source tree are identical: `d5647ed499fe410d66790e29a6b55fd6cb0521e7`. Branch: `fix/docx-tablet-polish-20261127`. No merge or deployment performed; branch automatic deployment is disabled.

[Review all 14 before/after comparisons](frontend/RESPONSIVE_QA/DOCX_REFINEMENT_20261127/index.html). Footer pairs show the entire component at the same CSS width; the grey remainder below a shorter footer is outside the component.

| DOCX screenshot | Request | Implemented result |
|---|---|---|
| 1 | Bring tablet footer groups closer, using desktop as a reference without copying it exactly | Mini/Air use three groups across the first row, with Social and Company Updates below. Pro retains the desktop group row. Footer and decorative-panel minimum heights, group gaps and outer padding reduced. All links and newsletter behavior retained |
| 2, 7, 9 | Reduce tablet Technology space and keep categories usable after clicking and scrolling | Use the approved compact sequence behavior through 1100px. Both category controls sit above the copy and remain sticky within the section. No viewport-tall empty tablet scenes. Selection persists when scrolling up and back; Aerospace video resumes after switching back |
| 3 | Mini Home uses Air media while preserving the current text composition | Landscape drone media beside the existing three headline groups, with the outer viewport minimum removed |
| 4 | Mini Technology hero uses Air setup | Full-width landscape engineering artwork at its original 1760:893 ratio; phone artwork remains on phones |
| 5, 10 | Mini Vision uses Air/Pro method | Copy grows from a 330px maximum to the available 704px content width, centered without wide justified word spacing. Watermark follows the wider composition |
| 6 | Remove extra color and put Embedded Systems on line three on all three tablets | Removed the extra diagonal blue overlay. Explicit line breaks produce Advanced Defense / Aerospace & / Embedded Systems at 768, 820 and 1024px. The existing white fade needed for text legibility remains |
| 8 | Products alternate like desktop | Restored image-right/copy-left ordering on every second row at Air/Pro widths. Mini retains the stacked reference |
| 10 | Fix Air About hero with a coherent Mini or desktop setup | Air uses the existing Mini video-first stack with centered 520px 16:9 company film and readable copy beneath. Pro retains the desktop split. No still-image placeholder added |
| 11, 12 | Air/Pro capabilities use the exact desktop method | Restored the three-column editorial grid and its vertical dividers rather than a two-column grid with the third item below |

## Measurements

Rendered dimensions are CSS pixels, rounded to the nearest pixel. The complete section/image geometry is in [geometry.json](frontend/RESPONSIVE_QA/DOCX_REFINEMENT_20261127/geometry.json).

| Component | Mini 768×1024 | Air 820×1180 | Pro 1024×1366 |
|---|---|---|---|
| Footer height before → after | 1409 → 910 | 1392 → 875 | 915 → 663 |
| Technology section height before → after | 912 → 806 | 2360 → 814 | 2732 → 814 |
| Home hero height before → after | 944 → 480 | 440 → 480 | 532 → 563 |
| Vision section height before → after | 401 → 324 | 344 retained | 365 retained |

Home Air/Pro hero height increases slightly to accommodate the requested three-line heading without compressing its media. Air About becomes a video-first stack: its section grows from 581 to 771px, with 32px between video and copy and 48px section edges. These are content regions, not empty viewport reservations.

## Exact implementation areas

Paths below are relative to `frontend/`.

- `src/components/shared/HeroBanner.jsx` and `.module.css`: tablet picture source, `.homeFrame`, `.homeHero`, `.homeBackdrop`, `.homeBackdropImage`, `.container`, `.heroContent`, `.mobileBreak`, `.lineBreakGroup`, tablet text/action transforms and extra overlay.
- `src/components/features/expertise/ExpertiseHero.tsx` and `.module.css`: phone picture source boundary, Mini landscape image sizing and tablet content/media margins.
- `src/components/features/expertise/ExpertiseSection.tsx` and `.module.css`: compact JS/CSS boundary at 1100px, tablet `.leftInner`, `.copy`, `.nav`, `.mobileVisual`, bounded Defense canvas. Desktop above 1100px retains the sticky cinematic split and scroll observers.
- `src/components/layout/footer/Footer.module.css`: tablet `.footerContainer`, `.heroSection`, `.heroVisualCol`, `.heroContentCol`, `.heroActionRow`, group headings, `.grid`, `.footerBottom`, `.socialCol`, `.colSubscribe`.
- `src/app/about/page.module.css`: Mini Vision component variables/watermark; Air/Pro `.editorialGrid` and editorial dividers.
- `src/app/clientTypography.css`: existing Vision overrides now accept component variables with their original values as fallbacks. Font families, font sizes, weights and phone defaults are unchanged.
- `src/components/features/about/AboutHero.module.css`: video-first layout through 900px; 48px tablet edges; centered Mini/Air film.
- `src/components/features/work/WorkClient.module.css`: tablet `.rowReversed .collageCol` and `.rowReversed .editorialCol` order.
- `vercel.json`: disable automatic deployment for this review branch only.

No client images, video assets, product claims, profile content, legal content, backend configuration or databases were changed. Existing required `!important` declarations only gained fallback variables for the Vision component; no new blanket overrides were introduced.

## Verification

- Production build, lint, TypeScript, site contracts, About film-only check and protected UI checks passed.
- 20 final visual capture cases: four pages at phone 390×844, Mini, Air, Pro and desktop 1440×900. Fonts loaded; full-page captures supplemented by scrolled section views and direct interactive playback captures.
- 96 layout cases passed: the existing 24 viewport/DPR/touch configurations across Home, Technology, About and Products, including narrow phones, breakpoint boundaries, desktop and three tablet landscape sizes. Checks include visible footer-input bounds, so hidden overflow cannot conceal form clipping.
- Twelve tablet page acceptance/axe cases passed with zero violations. About checks were repeated after its existing delayed reveal fully settled; the reproducible test waits 1600ms before axe scanning.
- Direct interaction checks verified Defense selection survives a scroll to the hero and back; Aerospace can be selected again and its video decodes and advances. Video stage stays at or below 480px.
- Geometry assertions verify three distinct Home heading lines, no leftover Home frame height, wider centered Mini Vision, desktop three-column Air/Pro capabilities and alternating product image order.
- Footer links and subscription controls are retained. Production requests that could submit data were blocked; no production forms were submitted.

[Acceptance results](frontend/RESPONSIVE_QA/DOCX_REFINEMENT_20261127/checks.json) · [96-case matrix](frontend/RESPONSIVE_QA/DOCX_REFINEMENT_20261127/matrix/checks.json).

Run the focused acceptance test from `frontend/` after building:

```sh
PLAYWRIGHT_MODULE=/path/to/playwright CHROME_PATH=/path/to/chromium \
  AXE_MODULE=/path/to/@axe-core/playwright node scripts/verify-docx-tablet.cjs
```

Testing used Chromium emulation, not physical iPads. Safari/WebKit and fresh mobile LCP measurements were not performed. Review screenshots before approving the visual choices. Nothing in this PR authorizes a merge or production deployment.
