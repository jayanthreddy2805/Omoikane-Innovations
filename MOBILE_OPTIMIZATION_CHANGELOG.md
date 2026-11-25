# Mobile optimization changelog — 25 November 2026

Base: combined `main` `994d7c2`, containing PRs #48 and #49. Dedicated branch: `fix/mobile-performance-finalization-2026-11`.

| File | Change and reason |
| --- | --- |
| `frontend/src/components/features/expertise/AerospaceVideoSequence.tsx` | Attach the existing five video poster URLs after the sequence's existing intersection observer reports approach within 250px; keep them afterward. `preload="none"` does not prevent poster image fetches, and the five offscreen requests competed with initial Expertise resources. No image/video asset, frame, playback, quality or reduced-motion behavior changed. |
| `frontend/src/app/careers/page.js` | Include visible “Explore roles” text in each department link's accessible name. The combined main build's axe scan caught a serious accessible-name mismatch. Link text, destination, layout and business content are unchanged. |
| `MOBILE_PERFORMANCE_REPORT.md` | Replace the earlier PR #49 pre-combination measurements with paired Lighthouse results and LCP/trace attribution for the combined main and this candidate. Explain one-sample uncertainty and remaining LCP targets. |
| `FINAL_QA_REPORT.md` | Add the latest seven-width usability, performance browser, public-page/axe and targeted post-fix evidence while retaining the earlier audit history. |
| `MOBILE_OPTIMIZATION_CHANGELOG.md` | Record this branch's exact changes and boundaries. |

The first-visit consent banner remains visible and actionable. Home, About, Contact and Apply did not receive code changes because their trace evidence did not justify a safe, focused change in this pass. No chatbot/RAG/Ollama or chatbot analytics files, backend, production environment or database were modified.
