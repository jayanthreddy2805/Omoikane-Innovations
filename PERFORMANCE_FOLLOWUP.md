# Performance follow-up — chatbot work excluded

This extends the original audit on `fix/site-audit-2026-11`. Chatbot, RAG and inference code are unchanged at the owner's request. No production deployment or database migration was executed.

| Finding | Result |
|---|---|
| PERF-01 hidden images | Already resolved by the original audit branch; visible SSR images retained. |
| PERF-02 heavy videos | About MP4 reduced 54.7%, with an 8.1 MB WebM alternative; aerospace MP4 fallbacks reduced 77.9–85.3%. Only the current sequence clip receives a source. Inactive clips release their media buffers. Offscreen/background playback pauses; reduced motion keeps posters. Duration, audio for the company film and sequence timing retained. |
| PERF-03 raw heroes/favicon | Same hero artwork now uses responsive Next image selection, eager hero loading and preserved gradient overlays. App icon reduced from 2,002,852 to 20,648 bytes. Exact asset counts are in PERFORMANCE_ASSETS.json. |
| PERF-04 motion imports | Non-chatbot components use `m` under LazyMotion. About's shared-layout domain indicator keeps local domMax support. Chatbot imports intentionally unchanged. |
| PERF-05 flags | Full client SVG namespace removed. Build-generated cached `/flags/[code]` SVG responses load only displayed flags; country search, dial codes and phone validation retained. |
| PERF-06 blueprints | Unpublished leadership hero prepared with one picture/image and responsive art direction; two unconditional priority loads removed. Leadership route remains removed until real data is supplied. |
| PERF-07 resume binaries | Admin listing uses a native SQL projection and `octet_length`, rather than hydrating resume bytes. Authenticated download endpoint still fetches the requested resume. |
| PERF-08 blocking emails | Submission and delivery jobs saved atomically. Background worker handles delivery after commit with durable state, bounded retries, leases and provider idempotency keys. See backend/EMAIL_DELIVERY.md. V5 migration is prepared, not applied to production. |
| PERF-09 duplicate layouts | Home mounts only its matching bento/carousel layout after hydration. Existing Expertise breakpoint selection retained. Tests account for hydration before inspecting the matching tree. |
| PERF-10 WebGL | Two CTA shader canvases replaced by palette-matched CSS gradients. Their animation pauses offscreen/in background tabs. The single footer scene remains, with viewport gating and a 30 fps cap on coarse-pointer devices. |
| PERF-11 paint effects | Large ambient blur filters replaced with soft radial gradients; About turbulence replaced with a small static grain texture. Smaller glass effects retained. |
| PERF-12 scroll/text animation | Public Expertise page no longer runs a Lenis ticker or changes global GSAP lag smoothing. Expertise hover/copy animations use transform/opacity. SplitType/Lenis remain only in the unpublished leadership gallery, which is not part of a public route or active bundle. |
| PERF-13 global style/observers | Header uses top/bottom IntersectionObserver thresholds instead of a body ResizeObserver and per-scroll state updates. Typography uses explicit role tokens and text-element selectors instead of class substrings/universal font selection; browser comparison preserves the previous rendered text styles. |

## Verification

- Frontend ESLint, TypeScript, production build and existing site-contract tests pass.
- The 15-route smoke check verifies metadata, SSR forms, FAQ HTML, malformed application queries, removed leadership and preview noindex.
- `frontend/scripts/verify-performance.mjs` checks seven page journeys at 375, 768, 960 and 1440 px: no horizontal overflow or browser runtime errors; one Home responsive tree; one active video source before/after sequence transitions; selected country flag route; reduced-motion media suppression.
- Typography comparison checks rendered text against the original typography stylesheet, with a 0.05 px allowance for browser rounding. The initial comparison found an unintended activation of previously ineffective module-prefix selectors; those selectors remain inactive so the existing appearance is preserved.
- Backend: 83 tests, zero failures/errors/skips. Tests cover summary projection, atomic rollback of submissions/jobs, delayed delivery, completed-job deduplication, retry scheduling, interrupted-job attempt limits and stable provider idempotency keys. Existing validation/security tests remain.
- No external email was sent during tests. Provider calls use mocks.

Browser test reproduction, after `npm run build` in frontend and with Playwright available:

```
CHROMIUM_EXECUTABLE=/path/to/chromium node scripts/verify-performance.mjs
```

`SMOKE_ORIGIN` can target an already-running preview. `PERF_BASE_REF` selects the baseline typography commit; it defaults to the original main commit. Browser tooling is optional and was not added as an application dependency.

## Performance evidence and limits

A local Chromium sample before optimization recorded roughly 2.1 MB of completed resource transfers on mobile Expertise. An intermediate optimized sample recorded roughly 0.48 MB; mobile Home changed from roughly 0.53 MB to 0.42 MB, and Contact JavaScript from roughly 307 KB to 238 KB. These were unthrottled, three-second diagnostic windows, before the final typography adjustment and grain minification; incomplete streaming transfers may not appear in resource timing. Some routes increased their completed-resource totals. These observations are not production performance scores or full-page transfer budgets.

The exact, reproducible source-asset reductions are recorded separately. No Lighthouse score, production INP, field LCP or performance guarantee is claimed. Production/mobile-network measurements remain a release verification step after an approved deployment.

## Release considerations

Review V5 before deploying; do not deploy backend code without its outbox table. The worker runs inside the API service and needs no additional hosted service. Delivery is at least once across ambiguous provider failures; idempotency has a finite provider window. Include job metadata in the owner-approved retention policy. No periods or legal text were invented.

Existing OWNER_TODO.md and CLAIMS_TO_VERIFY.md remain applicable. Public company facts, product claims, role copy and the removal of fictional leadership content were not replaced with invented data. Main remains unchanged; review through the PR.
