# WAVE PDF accessibility review — 2 November 2026

Source: all nine pages of `Omoikane Innovations _ Mission-Critical Products & Autonomous Systems.pdf`, printed at 18:34 on 2 November 2026 from the public Vercel homepage with WAVE annotations enabled. Compared with current main, including merged PR #10, then checked against the production build of this branch.

## Page-by-page checklist

| PDF page | Observation | Resolution / verification |
| --- | --- | --- |
| 1 | Sidebar lists 42 structural elements and 70 ARIA annotations; language is `en`. | These are element counts, not error counts. Retained the page language, landmarks, headings and useful ARIA. Checked one H1/main and that homepage ARIA references resolve. |
| 1 | Orange redundant-link alert near hero Contact Us. | The hero now opens `/contact#contact-form`; the header opens the general contact page. Added the actual form anchor and scroll clearance. The logo image has empty alt because the same link already contains the visible company name. |
| 2 | Aerospace, Defense, Automotive and Railways cards have different labels but the same destination. | Each now links to its matching existing expertise topic. Added stable article IDs and header clearance. Verified all four anchors resolve and land in view. Kept informative expertise image descriptions. |
| 3 | View All Products & Solutions also opens the expertise page. | Opens the actual `/work` product index. |
| 3–5 | Selected Work accordion headings, expanded state, regions and image annotations; large blank areas in the annotated print. | Retained semantic controls and informative product image alt text. Tested all four rows opening and closing: closed regions have zero height and are inert. Each Explore link now has a product-specific accessible name and points to the matching existing Work anchor. Fixed narrow-screen grid sizing; no invented case studies or outcomes. |
| 6 | Three redundant-alt alerts on Why Us illustrations repeat the adjacent heading. | All three illustrations now have `alt=""`; visible headings and descriptions supply the information. Decorative artwork remains visible. Careers headings and links remain meaningful content. |
| 7 | Red contrast marker on “From Sky to Soil, We Power Possibilities.” | Removed parent/child opacity fades that diluted text during entrance; retained the movement animation, approved navy background, effects and title gradients. Tagline is fully opaque `#F7FBFF`. Verified opacity before/during entrance and with JavaScript disabled; inspected the rendered CTA. |
| 8 | Footer brand contrast and skipped footer heading level. | Already fixed in merged PR #10: readable on-dark tokens and H3 column headings below the footer H2. Retested the resulting homepage; did not undo those fixes or change the footer background. |
| 8 | Repeated adjacent contact destinations around Start a Conversation. | Footer hero opens the specific contact form; the preceding general CTA opens the contact page. Both destinations exist and represent their respective intent. |
| 9 | Three footer service labels all link to `/expertise`. | Each opens its existing corresponding Software, Electronics or Mechanical service page; verified all three return HTTP 200. |
| 9 | Newsletter field is flagged without a label; the form's submit handler only prevents submission. | Replaced the non-functional subscription form with an explicit Company Updates email enquiry. It opens an email draft to the existing company address; it does not claim to subscribe users. No email was sent during verification. |
| 9 | Instagram, X and YouTube point to generic platform homepages. | Removed those placeholder links. Retained the existing company LinkedIn destination, with a descriptive accessible name and new-tab notice. Decorative contact/social SVGs are hidden from assistive technology. |
| 9 | Privacy, Terms and Cookies use dead `#` links. | Replaced them with an actual privacy/terms email enquiry. No policies were invented. Published policy pages still require approved client policy text. Added bottom clearance so the chat launcher does not cover the enquiry link. |
| 1–9 | Blue/purple heading, list, landmark and ARIA icons; green features; WAVE sidebar controls and repeated “Loading…” instrumentation. | These annotations are not all failures. Retained valid site semantics. Verified real accordion dimensions and live layout rather than reproducing the annotation overlay or printed overlaps. No matching homepage/footer/header “Loading…” content exists in the source. |

## Additional issues exposed by verification

- Search now has a visible associated label and a named modal dialog, focus containment, focus restoration, and a keyboard-operable close button. Fixed its animated horizontal centering and ESC text contrast. The generic Careers result now opens the real homepage careers section instead of the `/careers` route that calls `notFound()`.
- Fixed the compact mobile header and moved the full desktop navigation breakpoint to the width where it fits. Fixed the selected-product grid's intrinsic minimum sizing on small screens.
- Footer columns now use flexible gaps and wrapping instead of fixed 80px column padding. The approved `#000812` footer/CTA backgrounds remain unchanged.
- Contact form's entrance now preserves full opacity, preventing the blue submit button and white label from briefly losing contrast against the page. No contact API or submission behavior was changed.

## Verification

All 12 browser check groups passed. `npm run lint`, `npm run build` (18 routes, production Turbopack) and `git diff --check` passed. Responsive checks cover 320, 360, 412, 768, 1024, 1199, 1200 and 1440px. Axe reported zero violations on the revealed homepage, open search dialog and contact form; manual-review items are documented below.

A fresh local Lighthouse 13.6.0 mobile run scored 100 Performance, 100 Accessibility, 100 Best Practices and 100 SEO. FCP/LCP were 1.07s, TBT 33.5ms and CLS 0. This is a local production benchmark, not a new public-site WAVE/PageSpeed report.

The companion `wave-accessibility-checks-2026-11-02.json` records the final production-build results, environment and limitations. Coverage includes homepage WCAG checks, search keyboard behavior, all product accordion states, real link/anchor targets, CTA animation opacity, responsive layout, footer link hit testing, the contact form, JavaScript-disabled content, reduced motion and runtime/CSP errors. Mailto links were inspected only; no messages or contact submissions were sent.

The source is a WAVE-annotated printout, not a machine-readable WAVE results export. A new WAVE extension/API assessment was not run. The fixes are verified with Axe, browser interaction, source inspection and visual review; this is not a claim of WAVE certification or complete site-wide WCAG conformance. Axe cannot resolve every gradient/pseudo-element background; those contrast items require visual/manual review. The contact country popup is mounted on expansion, which produces an Axe manual-review item for its collapsed `aria-controls` reference.

WAVE's own documentation distinguishes errors, alerts, features, structural elements and ARIA annotations. References: [WAVE Help](https://wave.webaim.org/help), [API documentation](https://wave.webaim.org/api/docs), and the public reference details for `link_redundant`, `alt_redundant`, `label_missing` and `contrast`. No paid WAVE API scan was invoked.
