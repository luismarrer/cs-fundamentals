# Carry journey

## Objective
Make chapter 03's four-bit ripple-carry addition visible one stage at a time, with carry prediction and explanatory feedback. Apply ChipTycoon's process-first teaching, not its visual style.

## Scope and authorization
The user approved this feature, preservation of pending changes, and build/browser checks without TDD. Replace the existing adder demo with a scoped component; keep the chapter's surrounding explanations and existing heading change. No new chapter, dependency, global styling, remote operation, push, or PR.

## Workflow
- Route: delegated direct. Mapping required 4+ files; component plus chapter integration triggers the bounded writer route.
- TDD: off for this feature, explicitly approved by the user. Runner: `pnpm build` plus manual browser checks.
- RDD: disabled/unmanaged; `gentle-ai review mode status` reports off, global source. No native review requested.
- Branch: `codex/carry-journey`; branch point `bf3819522999f2013a6b0fae7c8dd7e4975f88f8`.
- Delivery: `ask-on-risk`; forecast approximately 380 authored additions + deletions, including tracking. No PR authorized. Reassess actual size before committing.

## Task
- [ ] **T1 — Deliver the guided carry journey.** Create `src/components/CarryJourney.astro`, integrate it into chapter 03, and verify the behavior and presentation before a Conventional Commit. Route: delegated (two non-trivial files; reading/preparation delegated).

## Acceptance and checks
- Operands remain four-bit toggles (0–15); progress begins at the least-significant bit.
- Each stage shows A, B, incoming carry, XOR/AND/OR reasoning, sum and outgoing carry only as revealed; no future result leaks.
- Predict carry 0/1 before reveal; feedback explains correct and incorrect predictions. Progress and final five-bit result are explicit.
- Operand changes and restart clear all revealed stages, predictions, feedback, and final output.
- Verify 7+1, 15+1 (final carry), 15+15=30, and 0+0; check both prediction outcomes and stage boundaries.
- Verify keyboard activation, focus visibility, mobile layout, and no animation-dependent interaction.
- Run `pnpm build` and `git diff --check`; record exact results. No automated test suite or linter is configured.
- Confirm pre-existing dirty files and the chapter heading remain untouched; stage only this feature's delta.

## Evidence and progress
- Exploration: chapter 03's `update()` originally calculated all four stages immediately; an existing uncommitted CPU explorer already covers step-through CPU operation.
- `pnpm build`: PASS in the current working tree, six static pages built (parent run: 442 ms). `git diff --check`: PASS.
- Production-expression arithmetic harness: PASS, 8/8 full-adder inputs, 256/256 operand pairs, 1,024 chained stages, 120 final-carry pairs. Component SHA256 `213e3e6b8b1beed4471176ebbdc81dcb49a7a96656232b14f88294bfad4d4d46`.
- Live browser: PASS, 7+1=01000/8, 15+1=10000/16, 15+15=11110/30, 0+0=00000/0; correct/wrong predictions, unknown future outputs, four-stage boundaries, previous-stage inspection, restart, clear, and operand/pending-prediction resets.
- Keyboard: PASS, Space/Enter completed 0+0; focus moves to the next control/stage heading, with a visible 2px outline. Component has no active animations.
- Mobile: component PASS at 390x844 and 320x800, including interaction and no internal overflow. Existing page-level H1 overflow at 320px remains out of scope (client width 298, scroll width 324); no global/layout changes made.
- Preservation: PASS, all unrelated modified files and the untracked CPU explorer match the baseline hashes; the chapter's existing heading text remains unchanged and will remain unstaged.
- Screenshot: verified local preview saved outside the repository as `carry-journey.jpg` in the chat's visualization directory.
- Commit: pending.
- Mirror: full document saved and read back under Engram topic `odd/carry-journey/tasks`; refresh after commit evidence.
- Rollback: remove the new component and restore only the chapter demo integration, leaving unrelated pending work intact.

## Next step
Stage only the verified feature delta, commit T1, then record its commit identity and running authored line count. No push or PR is authorized.
