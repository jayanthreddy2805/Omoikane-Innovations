# Task 8 — mobile LCP investigation and targeted render fixes

**Date:** 26 November 2026. **Base:** `c3024c0be61a6942f4e28d092ff71d6a3861429d` (`main`). **Branch:** `fix/task8-mobile-lcp-20261126`. PRs #56–#60 were reviewed as open and were **not** merged into this branch. Earlier single-run results in PR #59 are the starting historical reference, not the before measurement for this branch.

## Method and actual measurements

Built current `main` with `npm ci && npm run build`, served the production build locally, then repeated Lighthouse **three times on each affected page** before changing source. Rebuilt after the fix and repeated the same 15 audits. Lighthouse 13.6.0, headless Chromium, 412×823 mobile, 4× CPU, simulated 150ms RTT and 1638kbps down; cold first visits with cookie choices visible, no saved consent. Results below are **median simulated LCP** in seconds; ranges and individual scores are in [lighthouse.json](frontend/TASK_8_QA/lighthouse.json). The prior PR #59 run used a comparable mobile profile but was a different combined candidate, so its values (Home 3.438s, Technology 3.093s, Software Careers 3.264s, Contact 3.241s, Apply 3.391s) are not a controlled before/after pair.

| Page | Before, 3 runs | After, 3 runs | Difference | Lighthouse scores before → after | LCP element after |
| --- | ---: | ---: | ---: | --- | --- |
| Home | 3.417s | 3.412s | −0.005s | 92/92/92 → 92/92/92 | Mobile hero image |
| Technology | 3.510s | 3.162s | −0.348s* | 91/91/90 → 93/94/91 | Mobile hero image |
| Software Careers | 3.331s | 3.323s | −0.008s | 92/92/92 → 92/92/92 | Hero introduction text; previously hero image |
| Contact | 3.319s | 3.314s | −0.005s | 92/92/93 → 93/92/92 | First-visit cookie text; previously intro text |
| Apply | 3.389s | 3.391s | +0.002s | 92/92/92 → 92/92/92 | First-visit cookie text |

*Technology's source was unchanged. One after-run measured 3.515s; the apparent median improvement is **run-to-run variation**, not a claimed fix. All three CLS measurements on each page in both phases were **0**. All five Lighthouse medians remain above the 2.5s target. There is no field INP measurement.

For direct timing attribution, a **separate single cold Chromium browser pass per page per phase** used 412×823, DPR 1, CDP network 150ms RTT/1638kbps and 4× CPU. The observed browser LCP and resource waterfall are in [waterfall.json](frontend/TASK_8_QA/waterfall.json). These observed times are **not interchangeable** with Lighthouse's simulated values:

| Page | Browser LCP before → after | Relevant first-visit observation |
| --- | ---: | --- |
| Home | 0.880 → 0.932s | Mobile image started at 261ms before / 223ms after; 8.1KB transferred, high fetch priority. |
| Technology | 1.044 → 1.032s | Mobile image started at 242ms / 224ms; 19.0KB transferred, high fetch priority. |
| Software Careers | **3.464 → 1.400s** | Hero image started at 193ms / 269ms, downloaded in ~490ms both times. Before, its parent waited for hydration to start its 1.1s reveal. After, the same reveal starts from CSS when the server-rendered page loads. |
| Contact | **3.188 → 1.212s** | Intro text was hidden until an IntersectionObserver and client animation started. Its 0.75s reveal now starts from CSS without waiting for hydration. |
| Apply | 2.328 → 2.364s | First-visit cookie banner paragraph remained the LCP candidate; the consent choices were shown and functional. |

These single-pass browser improvements support the cause and direction of the two render fixes; they are **not** statistical proof of an equivalent Lighthouse or field-data gain. The two self-hosted font requests took roughly 0.55–1.11s in the browser trace. Home and Technology images were already discovered in the initial HTML and marked high priority, with small optimized mobile transfers; making an unsupported image or font delivery change would risk quality or create duplicate downloads. Their unchanged code provides a control for run variability. Contact and Apply Lighthouse values also reflect a later first-visit cookie banner candidate; moving or hiding consent choices to change LCP was rejected.

## Changes and regression coverage

| File | Change and reason |
| --- | --- |
| `frontend/src/components/features/careers/CareerTemplate.jsx`, `.module.css` | Start the existing hero visual's opacity, 24px movement and 0.98→1 scale animation in CSS, with the same 1.1s duration, 0.15s delay and easing. Add responsive `sizes` to the unchanged hero image, matching the full-width mobile and half-width desktop columns. The image and design remain the same; reduced motion disables the animation. |
| `frontend/src/app/contact/ContactClient.jsx`, `page.module.css` | Start only the above-the-fold intro's existing opacity and 32px movement reveal in CSS with its 0.75s duration, 0.1s delay and easing. Below-fold form and success animations remain unchanged; reduced motion disables the intro animation. |
| `frontend/scripts/verify-task8-first-paint.mjs` | Browser regression checks the Careers hero image and Contact intro at 375 and 1440px **with JavaScript disabled**, after the existing reveal duration and with reduced motion enabled. Content must become visible, and reduced motion must disable the animation. This test would catch a return to hydration-dependent reveal. Requires Playwright and Chromium when run manually; no new runtime dependency was added. |

**Validation:** `npm ci`, `npm run lint`, `npx tsc --noEmit`, `SITE_AUDIT_EXCLUDE_CHATBOT=1 npm test`, and `npm run build` passed. The new no-JavaScript test passed eight cases, including reduced motion. `verify-initial-media.mjs` passed Home, About and Technology initial images on this `main`. `verify-mobile-polish.mjs` passed at **320, 375, 390, 414, 768, 960, 1440px**: cookie preferences, CTA clearance, Careers dropdown, Contact and Apply form gutters/scroll clearance. A Playwright sweep of seven pages at all seven widths passed **49 cases**, with zero horizontal overflow, unexpected page errors or H1 failures. Axe on five affected pages at 375 and 1440px found **zero serious or critical violations** in main/header/footer; this is not WCAG certification. [Responsive summary](frontend/TASK_8_QA/responsive.json). Leadership dialog open, Tab confinement, Escape and focus restoration passed separately at 375 and 1440px. Home still shows all four sectors through the mobile carousel; Technology still shows Aerospace and Defense only. About still contains its video. Representative after screenshots: [Careers 375](frontend/TASK_8_QA/screenshots/careers-375.webp), [Careers 1440](frontend/TASK_8_QA/screenshots/careers-1440.webp), [Contact 375](frontend/TASK_8_QA/screenshots/contact-375.webp), [Contact 1440](frontend/TASK_8_QA/screenshots/contact-1440.webp).

## Remaining limits and release boundaries

- Modeled Lighthouse LCP is still over 2.5s on every affected page. The browser timing gain on Careers and Contact is real in the recorded pass, but the repeated simulated Lighthouse medians are nearly unchanged; further work needs field data or corroborated traces, not a visual downgrade.
- Apply's first-visit cookie banner is the observed LCP at ~2.3s; it remains present with all essential and analytics choices. Returning visits with saved consent were checked in the responsive sweep. No artificial delay of visible content or consent was introduced.
- On current `main`, About still shows the loading image next to its film until playback; PR #57 proposes the approved video-only behavior and remains unmerged. This Task 8 branch does not touch About or import PR #57.
- No image quality reduction, chatbot/RAG/Ollama/analytics change, product claim/image change, production database operation, merge or production deployment. Screenshots are local production-build evidence, not production monitoring.
