# Task 9 — prelaunch execution result and next test gate

**Approved rollout completed:** existing Render service now runs `93aa7cc3148cfb6781b4e738774ee298af2884ff` via `dep-dc5dlih5efls73f4p020`, live **28 Nov 2026 at 19:18:13 IST**. V5 applied once at startup and matched checksum `-1392285325`. Health and allowed/untrusted-origin checks passed at 19:19:41 IST. Existing business data is unchanged; separate production remains V1–V3.

[Current release report](TASK_9_BACKEND_RELEASE_READINESS.md) · [Safe live verification receipt](release-evidence/TASK9_20261128/prelaunch-live-verification.json).

Auto-deploy remains off, Blueprint auto-sync paused and the Free plan unchanged. The saved strict TLS and email/retention suppression configuration was used for the new deployment. Fresh secret reopening was blocked by automatic review and was not bypassed; startup/schema/health verification proceeded safely.

## Next stage: prepare labelled form and email tests

1. Obtain the owner's Resend account test address; the currently configured sandbox sender is restricted to its own account address.
2. Prepare the exact labelled Contact/Application/Newsletter fixtures and generated dummy résumé, stating where the provided address and test records will be stored.
3. Request approval for those prelaunch write tests. Keep provider delivery suppressed during data/duplicate/consent checks; do not assume the earlier deployment approval included submissions.
4. Verify persistence and exact résumé bytes without exporting existing applicant data. Review queued job kinds/recipients before any provider activation.
5. Prepare a separate small, explicitly addressed test-message scope and obtain delivery/configuration approval before enabling delivery or sending. No DNS/domain change or production cutover is implied.
6. Record real provider acceptance and arrival, deployed-service regressions and owner acceptance before marking the entire list complete.

No additional deployment is required simply to test the already deployed version. Do not rerun migrations. A new source commit or broader operational change needs review under the owner's approval boundary.

## Recovery and execution references

- Accepted checkpoint: `prelaunch-restore-20261128` / `br-polished-band-aorkbxle`, retained pre-V5 copy in the same private Neon project. It is a branch checkpoint, not a snapshot restore.
- Production snapshot/restore remains separate; snapshot expires **5 Dec 2026, 05:30 IST**. Neither recovery copy is scheduled for deletion by this work.
- [Checkpoint/TLS receipt](release-evidence/TASK9_20261128/prelaunch-checkpoint-and-tls.json), [earlier failed attempts](release-evidence/TASK9_20261128/prelaunch-rollout-attempt.json), [successful live verification](release-evidence/TASK9_20261128/prelaunch-live-verification.json).
- [Earlier exact approved proposal](https://github.com/jayanthreddy2805/Omoikane-Innovations/blob/7d23f8c284aa36f36eca3a8fb9574b6f448f4f12/TASK_9_PRELAUNCH_EXECUTION_PLAN.md), retained for audit. Its pending-deployment statements are superseded by the live result above.

A fresh masked-value read was rejected by automatic review as potentially exposing credentials. No permission workaround was attempted, and that read is not a prerequisite for preparing the next test. Use existing receipts and allowed runtime verification; request owner assistance only if a later necessary check cannot be completed safely.
