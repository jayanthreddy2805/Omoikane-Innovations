# Final technical SEO audit — 26 November 2026

Scope: read-only inspection of the current GitHub `main` at `94a4818`, plus narrowly scoped source fixes in this PR. This is **not** a new production crawl or a verified live search-engine indexing report.

## Confirmed and fixed
- **SEO-01 / Admin metadata (medium):** `/admin` had a client page without route metadata, so it inherited the public root title/canonical and indexability defaults. A server `app/admin/layout.js` now supplies a restricted-console title, explicit `noindex,nofollow,nocache` and no homepage canonical. It does not alter the Admin UI, authentication or backend.
- **SEO-02 / Preview sitemap signal (low):** `robots.ts` disallowed crawling in previews but still advertised the production sitemap. Previews now have `Disallow: /` with no sitemap declaration; production retains the canonical sitemap and existing Admin/API exclusions. `verify-indexing.mjs` covers both branches.

## Source checks: no change required
- Canonical/public metadata is generated from `lib/siteMetadata.ts` for public routes and the dynamic service pages.
- Production sitemap excludes Admin, the `/careers` redirect, and the restored Leadership template; the template deliberately has `noindex,nofollow`.
- Canonical host redirection and noncanonical/preview `X-Robots-Tag` remain in `proxy.ts`.
- Open Graph image metadata, FAQ source-derived JSON-LD, and Organization JSON-LD exist; factual claims and certifications need owner evidence, not invented text.
- Existing smoke and indexing checks cover public metadata, legacy redirects, leadership noindex and the `/careers` redirect.

## Unverified / owner-dependent
- Real production-host HTML, Search Console coverage, third-party structured-data validation, and social preview caching were **not** independently verified in this task.
- Confirm the chosen canonical `www` domain and company claims with the owner. Do not publish fictional leadership details.
- The existing `not-found` behavior relies on Next.js automatic `noindex` for 404 responses; no speculative 404 redesign was made.

## Verification
This PR adds assertions to `frontend/scripts/verify-indexing.mjs` and a UI decision guard in CI. GitHub Actions are the runnable validation path; no local Next.js build was available through the GitHub connection. Do not claim Lighthouse or real-browser success from source inspection.
