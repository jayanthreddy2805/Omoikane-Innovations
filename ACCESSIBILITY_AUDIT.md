# Accessibility audit — 26 November 2026

## Scope and evidence
Reviewed the current source for page landmarks, forms, focus handling, navigation, dialogs, interactive sections, alt text and reduced motion. Existing `FINAL_QA_REPORT.md` records 30 prior axe scans with no **serious/critical** findings on the then-tested commit. Those scans were not re-run in this task, and they are **not** a claim of WCAG 2.2 AA certification.

## Already implemented
- Root skip link targets `#main-content`; primary pages use headings.
- Contact and Apply fields have explicit labels and alert feedback; résumé upload and phone validation were hardened in PR #49.
- FAQ toggles have `aria-expanded`, `aria-controls`, hidden answers and matching source-derived FAQ metadata.
- Cookie preference and Admin dialogs include keyboard/focus management.
- Video/motion components have reduced-motion controls and prior automated media checks.

## Review-required finding — protected UI
- **A11Y-01 / Header home logo, potential high severity:** `Header.jsx` uses an empty image alt and `aria-hidden` for both text spans. The visible brand container has `aria-label`, but it is a generic `div`, not the parent link. Consequently the linked logo may lack an accessible name in some screen readers. Suggested **nonvisual** fix (only after owner approval for the locked header): label the parent Home link directly, and verify its computed accessible name. **No header code changed.**

## Further verification required
- Perform manual keyboard and VoiceOver/TalkBack tests on real devices, including restored Careers dropdown, Leadership gallery and virtual keyboard behavior.
- Re-run axe on the exact merged candidate after approval, not on a different main/PR combination.
- Accessibility is part of the owner's locked UI decision; propose necessary nonvisual changes for approval before editing the protected components.
