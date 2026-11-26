# Website quality / UI decision audit — 26 November 2026

## Owner-locked presentation — unchanged by this PR
The client-approved UI choices must not be reverted by performance, SEO or accessibility work without explicit approval:
1. **Careers:** old desktop/mobile department dropdown; `/careers` redirects to the Software department. Retain department pages.
2. **Leadership:** earlier gallery/hero/how-we-work template is accessible in navigation; placeholders remain explicitly labeled and the route is `noindex`.
3. **Technology:** Aerospace and Defense only, with the restored desktop split/sticky copy layout. Do not add Automotive or Railways here.
4. **Home:** retain Automotive and Railways cards/carousel alongside Aerospace and Defense; additional-sector links point to Contact.

PRs #52, #53 and #54 merged these requests into main on November 26. PR #55 (About-film preview correction) is separate and should be reviewed independently. This task does not touch any of those UI source files.

## Source audit
- Cross-page work links use identifiers from the shared `data/products.ts`; Work profile sections use the same IDs.
- The Home extra-sector destinations were changed to Contact rather than deleted Technology anchors.
- Form subject query values are bounded before use in Contact; business-flow regressions are covered by earlier suites.
- Header/Footer link targets, primary HTML metadata, and the Leadership sitemap exclusion were inspected. Some manually authored footer copy and company technical claims still require owner confirmation; do not invent replacements.

## Implementation in this PR
- Private Admin route metadata to avoid unintended public indexing without changing its UI.
- Preview robots sitemap separation.
- `verify-protected-ui-decisions.mjs` as a CI guard against unapproved reintroduction/removal of restored UI features.
- SEO indexing regression assertions.

## Validation and constraints
Source review and new test implementation only. This task has not run a local production build, mobile Lighthouse, Chrome/axe scans, or any production deployment. The branch will be checked by GitHub Actions after the PR is opened. No chatbot, backend, database, protected UI component or company claim was modified.
