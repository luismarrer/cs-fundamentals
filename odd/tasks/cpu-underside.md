# Inspect the underside of the CPU

Let visitors rotate the CPU through the lower hemisphere and inspect its contact face, like holding a processor rather than looking at a chip fixed to a bench.

## Scope and authorization
The user explicitly requested underside viewing, inspired by holding an AMD Ryzen. Use a recognizable schematic gold-contact grid, not a claimed commercial pinout or branded replica. Preserve the existing opening lid, six educational selectors, phases, keyboard access, fallback and resource lifecycle. No unrelated redesign, dependencies, push, PR, merge or remote operation.

## Workflow
- Baseline: `7953c82`, the completed silicon-instrument redesign; tracked worktree was clean.
- Branch: `codex/cpu-underside`.
- Route: delegated direct; analysis/preparation and multiple non-trivial scene/UI files require one bounded writer. Independent checking follows the native assessment tier; native RDD remains off (global).
- Test-first: apply a meaningful deterministic angular-limit regression with observed RED before implementation, then GREEN. Runner: `node --test tests/cpu-underside.test.mjs`, using the built-in test runner without new packages. A missing export/runner is not meaningful RED; any justified exception must be reported explicitly.
- Functional checks: focused regression, `pnpm build`, `git diff --check`; browser underside view/orbit/reset, closed/open lid, selection/phase preservation and responsive controls.
- Delivery: `ask-on-risk`; forecast approximately 250 authored additions/deletions. One coherent local work unit expected below 400; count actual changes before committing. No PR authorized.

## Task
- [ ] **T1 — Deliver in-hand underside inspection.** Extend pointer and keyboard orbit below the chip, prevent the opaque bench from hiding the base, add a schematic underside contact array, and provide a discoverable underside view/reset. Verify and commit the coherent scene/UI/test change. Route: delegated; trigger: non-trivial geometry and control changes plus executable regression.

## Acceptance
- A visitor can rotate below the CPU using drag and keyboard-equivalent controls, and clearly see the underside contact pattern rather than the lab floor.
- A direct underside-view action is discoverable; reset returns to the original welcome orientation without changing lesson state.
- Gold contacts and substrate make the base recognizable; the lesson does not claim an exact Ryzen model, socket generation or pinout.
- Zoom remains bounded; top-side logical blocks cannot be selected through a closed lid or from below an opaque substrate.
- Opening/closing, all six selectors, phases, motion preferences and SVG fallback remain intact. Added GPU resources participate in disposal; no perpetual rendering.
- Controls remain usable at 320/390px. Build and regression outcomes, unavailable/skipped checks and native assessment result are recorded honestly.

## Evidence
- Read-only exploration found `maxPolarAngle=1.16`, preventing lower-hemisphere viewing. The scene's opaque floor/grid/shadow would occlude the base; existing copper contacts are only along its edges.
- Parent spot check confirmed the angle clamp, floor construction, contact placement and shared keyboard camera clamp.
- RDD status: off, decided by global. Do not start reviews or change the preference; risk assessment is only for proportional independent verification.
- Meaningful RED: the regression executed the existing production `changeCamera` and remained clamped at phi 1.16. GREEN: `node --test tests/cpu-underside.test.mjs` passed 2/2, including the actual camera action. Secondary contact/picking coverage is structural, not a fake WebGL runtime test.
- Writer and independent verifier both observed `pnpm build` passing (6 pages) and `git diff --check` passing. Parent repeated `git diff --check` successfully. The existing Vite >500 kB lazy-chunk warning remains.
- Native assessment returned high/unassessable because of undeclared untracked inventory. Conservatively used high-tier independent verification; no native review was started under the explicit off preference.
- Browser acceptance on the current production build at `http://127.0.0.1:4327/`: direct underside preset, native drag and keyboard lower orbit, reset, open/close, six selectors, three phases and blocked picking through closed/bottom faces passed. Lid, ALU selection and DECODE phase remained unchanged by underside taps and reset.
- The first 320px check found the underside action covering the absolute lid toggle. One bounded correction moved actions into normal flow, enlarged narrow camera controls and added warm no-shadow underside fill; independently reverified before browser acceptance. Final 320/390px checks found no overflow and all nine toolbar button centers unobscured; camera heights are 40/44px respectively.
- Existing fallback, visibility and reduced-motion lifecycle were structurally inspected and preserved; their external browser fixtures were not rerun for this change.
- Screenshot: `/Users/luis/.codex/visualizations/2026/10/10/01a12817-6f91-75e1-95d5-9435fd0b27d8/cpu-underside-verified.jpg`. Preview viewport override was reset and the deliverable tab retained.
- Commit: pending. Authored source/test count: 158 (137 additions, 21 deletions), below the delivery threshold with this document.
- Rollback: revert only this work unit's scene/UI/regression changes, restoring upper-only orbit; keep the completed CPU opening and silicon-instrument redesign.

## Next step
Record the verified local work-unit commit, close T1 and synchronize the full Engram mirror. Push, PR and publication remain unauthorized.
