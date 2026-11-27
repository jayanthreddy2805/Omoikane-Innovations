# Phone and landscape corrections from the latest DOCX

Addresses the fifteen screenshot annotations in `This is for iphone se follow mobile version ok the text structure here alright.docx`.

- Live/main baseline: `8e473350c61f4753a733f7b915b491ce80938310`, READY deployment `dpl_Geii8nAuDqQLZHCjf1dCHUQJ3R2Y`.
- Tested implementation: `517fbbde95e677aa46d0143053661c0c58a91a09`; source tree `532548b4cc70fa69f59028f31cb22658f7256077`.
- Requested destination: PR #47's branch, `fix/site-audit-2026-11`. PR #47 is already merged/closed; updating its branch does not reopen it. The update preserves current main and the separately requested footer removal from #74 (patch parent `3443cee7f3bb85b2dc6ecb615ae6caf17b37739a`).
- Fast-forward branch update only, with the expected old head checked. No force push, new PR, main merge or deployment. Automatic Vercel deployment is disabled for the destination branch.

[All fifteen before/after comparisons](frontend/RESPONSIVE_QA/PHONE_LANDSCAPE_20261128/index.html) · [measurements](frontend/RESPONSIVE_QA/PHONE_LANDSCAPE_20261128/geometry.json).

## Screenshot-by-screenshot findings

| Issue / DOCX images | Route / CSS viewport | Root cause and correction | Measured result |
|---|---|---|---|
| PL-01 / 1, 5 | Home; SE 375×667, Fold 344×882 | A height-specific flex order put CTAs before the description on SE. Separate copy/eyebrow/paragraph/CTA transforms produced different gaps on taller phones. Remove that alternate order and use natural document flow: eyebrow, headline, description, actions. Preserve the mobile photograph, three heading groups and cinematic height | Copy padding 32px top / 24px bottom; description-to-CTA gap 20px. Phone CTA text scales only within this component (about 13.9px SE, 12.7px Fold, 14px at 390px+). Buttons remain ≥44px high |
| PL-02 / 2 | About Mission Domains; SE 375×667 and other compact widths | Fixed-width, non-shrinking pills overflowed their photographic stage. Use three equal columns with bounded padding and responsive labels within the existing mobile selector method | At SE, nav scroll width 392→338px for a 338px stage. All three choices fit and remain selectable; control height ≥44px |
| PL-03 / 3, 7 | About; XR 414×896, Hub 1280×800 | System bottom padding, a static-section viewport minimum, metrics padding and certification padding compounded into empty transitions. Adjust only these two section joins | Footer-content-to-metrics-rail and rail-to-certification-heading gaps: XR 107.7/107.7→48/48px; Hub 166.9/172.8→64/64px. Tablet joins are 64px |
| PL-04 / 4 | Contact/Apply notices on narrow phones | The two-word Privacy Notice link split across lines, orphaning “Notice”. Keep that link label together | Contact at 344px: link text uses one line. The complete legal sentence still wraps normally and stays readable; no legal copy changed |
| PL-05 / 6, 10 | Technology hero; Hub 1280×800, Air landscape 1180×820 | The artwork was already `contain` at the CSS level but touched the hero's bottom/right boundary, matching the perceived out-of-box defect. Keep the same asset and fit, with a visible inset on these medium landscape layouts | Right and bottom artwork-frame clearances 0→32px at 1101–1366px. Approved 1440px+ treatment is retained; no source-image replacement or distortion |
| PL-06 / 8, 14, 15 | Apply; Hub 1280×800, Pro landscape 1366×1024, Air landscape 1180×820 | Inline ordering reversed desktop columns. Intrinsic form minimums distorted the grid and could push its content out of proportion. Put context left / form right above 1024px, use `minmax(0,…)`, bounded card dimensions and readable contact columns | Desktop gap 48px; form fields and contact card stay inside their columns. At 1180px, context is 466.2px wide and form 569.8px. The original form-first phone flow and selected department/role are retained |
| PL-07 / 9 | Search; Hub 1280×800 plus phone/tablet | Replace the visible ESC label with an accessible X button. Outside-click dismissal already passed in the live baseline; retain it and verify X, Escape, outside click and focus return | Close control ≥44×44px, 18px X icon. All dismissal methods pass at 375, 820 and 1280px in normal/reduced motion; clicking inside the input leaves the dialog open |
| PL-08 / 11–13 | Home; iPad landscapes 1366×1024, 1180×820, 1024×768 | The portrait-tablet composition stopped at 1100px, so wider touch tablets inherited desktop headline wrapping and a different image scale. Extend the established tablet composition to these larger touch viewports | Air/Pro landscape heroes: 356.8/414.0→580px, with the approved three heading groups. Mini landscape already used the required method: its 563.2px hero is retained and verified. Mouse-driven desktop layouts stay unchanged |

The latest message authorizes these component-level responsive changes. No further structural design decision is pending. Assets, engineering claims, leadership content, legal policies, mobile carousels and the Technology cinematic rail remain intact.

## Affected selectors and files

- `frontend/src/components/shared/HeroBanner.module.css`: `.heroContent`, phone `.eyebrow`/paragraph/`.actions` transforms, `--home-copy-padding`, `--home-cta-size`; extend the existing tablet query to 1101–1366px touch/coarse-pointer screens.
- `frontend/src/app/clientTypography.css`: existing Home CTA rule accepts `--home-cta-size`, retaining its 14px fallback everywhere else. Existing font families, weights, colors and headline sizing are unchanged.
- `frontend/src/app/about/page.module.css`: `.system`, `.credSection`, mobile `.domainTabs`, `.domainTab`, `.domainTabLabel`.
- `frontend/src/components/features/about/AboutMetrics.module.css`: `.section` vertical padding 24px phones / 32px larger viewports.
- `frontend/src/components/features/contact/ContactForm.module.css` and `frontend/src/components/features/apply/ApplyForm.module.css`: `.formNotice a` wrapping; Apply grid tracks and minimum widths.
- `frontend/src/app/apply/ApplyClient.jsx` and `.module.css`: remove inline order, preserve phone order in CSS, set desktop column order and widths, bound `.contactDetailsBlock`, prevent its ambient-background seam after moving it left, and keep contact details readable. Narrow desktop cards use one inner contact column where required.
- `frontend/src/components/features/expertise/ExpertiseHero.module.css`: medium-layout `.imageLayer` insets.
- `frontend/src/components/layout/header/Header.jsx` and `.module.css`: `.searchClose` replaces `.searchEsc`; existing backdrop and Escape handling are retained.
- `frontend/scripts/verify-phone-landscape-docx.cjs`: repeatable rendered acceptance, keyboard/focus and axe checks. `frontend/vercel.json`: destination branch deployment restriction.

No new `!important` declarations or blanket spacing/typography reset.

## Verification

- Production build, frontend lint, TypeScript, site contracts, About film-only and protected UI checks passed. Dependency and lockfiles are unchanged; the existing installed dependency tree was reused.
- [260 final route/viewport checks](frontend/RESPONSIVE_QA/PHONE_LANDSCAPE_20261128/matrix.json): ten primary routes across the original 24 configurations plus Fold 344×882 and touch Hub 1280×800. Final Apply cases were repeated after its card refinement. No page overflow, clipped visible inputs, non-200 routes, browser errors or oversized About banner.
- [31 targeted acceptance cases](frontend/RESPONSIVE_QA/PHONE_LANDSCAPE_20261128/checks.json) passed: phone content order/gaps, tablet heading groups, three Mission tabs, measured About joins, privacy link wrapping, Apply ordering/input editing, Technology insets and search dismissal/focus.
- [Five final Apply checks](frontend/RESPONSIVE_QA/PHONE_LANDSCAPE_20261128/final-apply-checks.json) also passed after the final card paint fix. Across these suites: ten axe scans, zero violations. Search is tested in normal and reduced motion.
- Fifteen live-before and fifteen corresponding final-after viewport screenshots were inspected after fonts loaded and animations settled, with scrolling for the marked sections.
- No production form submissions or uploads. Browser checks block API/non-read requests.

These are Chromium CSS-viewport/touch/DPR emulations, not physical-device or Safari results. Captures use matching 2× contexts; the matrix records the individual device DPRs. No fresh LCP benchmark was performed and no measured performance improvement is claimed.
