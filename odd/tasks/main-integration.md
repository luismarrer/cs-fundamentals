# Integrate the completed learning experience

Combine both completed feature branches without losing the CPU underside controls or the instrument/mobile/reduced-motion fixes, then deliver the verified result to main.

## Authorized scope
- User explicitly selected both `codex/cpu-underside` and `codex/silicon-instrument` for local integration and requested a push.
- Source endpoints: `ddcfa34c9acbb900578b4bcbaa36b0d78c34b157` and `85a303499512f729ee9bb35485e9176b8c3d6bb7`; local main starts at `bf3819522999f2013a6b0fae7c8dd7e4975f88f8`.
- Remote delivery remains pending exact destination and configured authentication/session confirmation. Do not inspect ambient credentials or contact a remote before that confirmation.
- Preserve feature branches, isolated worktrees and untracked `.atl/` / `.codegraph/`. No force push, reset, rebase, deletion or unrelated implementation.

## Route and checks
- Use `codex/integrate-main` from the underside endpoint. Native merge predicted one conflict in `src/components/CpuOpening.astro`; a single bounded writer resolves only that file, preserving both intents.
- Route: delegated direct for conflict resolution; trigger: reading that prepares a non-mechanical CSS/control write. Parent owns Git transitions and the task document.
- Test-first exception: this combines already-tested behavior and resolves a markup/CSS merge; no new deterministic failing behavior test is established. Reuse the actual camera regression and verify the combined rendered toolbar instead of inventing RED.
- Checks: `node --test tests/cpu-underside.test.mjs`, `pnpm build`, `git diff --check`, no conflict markers, independent verification if native assessment is high/unassessable, and browser underside/open/reset plus 320/390px unobscured controls.
- RDD: explicitly off/global; no native review lifecycle or preference changes. Native assessment is only for the delegated verification tier.
- Delivery: `ask-on-risk`, approximately 250 authored integration lines forecast, excluding previously committed branch history. Record the actual merge-unit count before committing; no PR requested.

## Tasks
- [x] **T1 — Combine and verify the feature branches.** Closed in merge work-unit `a4ac7e6`; one-file resolution and bounded sizing correction retained both intents and passed functional, independent and browser checks.
- [x] **T2 — Advance local main.** Main fast-forwarded to verified integration and tracking closure `9862daf`; both source-tip ancestry checks passed and the tracked worktree remained clean. Route: inline mechanical Git transition; this documentation work unit records its observed evidence on the integration branch before a final main fast-forward.
- [ ] **T3 — Push the confirmed destination.** Ask one focused remote destination/session question, then perform only the authorized non-force main push and verify its result. Route: inline Git delivery, no source mutation; record the outcome after it is observed.

## Acceptance
- Both source tips are ancestors of local main, with no unresolved conflict or dropped underside action.
- The underside contact model and camera logic remain intact; opening/closing, phase/selection and mobile controls stay usable.
- The MOSFET static electron geometry and instrument global fixes are retained unchanged by the manual resolution.
- Push success is claimed only from confirmed Git output; rejection, permission failure or unknown outcome is reported without force or blind retry.

## Progress and evidence
- Preflight: tracked primary checkout clean, main is an ancestor of the underside branch; isolated instrument checkout has no tracked edits.
- Native `git merge-tree --write-tree` predicted only `src/components/CpuOpening.astro` as a conflict.
- Resolution retained both intents in the shared component; the camera source/test still match the underside endpoint, and the MOSFET page/global CSS/instrument task still match the instrument endpoint exactly.
- Writer and independent verifier both passed `node --test tests/cpu-underside.test.mjs` (2/2), `pnpm build` (6 pages), both worktree/index diff checks and conflict-marker scan. Parent repeated both diff checks. The existing Vite >500 kB chunk warning remains.
- Native assessment was high/unassessable because of untracked inventory; conservatively applied independent verification without starting RDD under the explicit off preference.
- Current-production browser passed underside/open/close/reset, preserving ALU selection and DECODE/lid state across camera reset. At 320/390px all nine toolbar centers are unobscured with no overflow; all buttons are 44px high and camera buttons 44px wide. One bounded correction strengthened the action selector after real computed sizing revealed 33px actions despite the declared minimum.
- Protected unchanged lifecycle/fallback fixtures were not rerun; endpoint conservation and independent inspection were used. No new deterministic RED was claimed for this CSS integration.
- Screenshot: `/Users/luis/.codex/visualizations/2026/10/10/01a12817-6f91-75e1-95d5-9435fd0b27d8/main-integration-verified.jpg`; existing production preview on `127.0.0.1:4327` retained and viewport override reset.
- Integration commit: `a4ac7e689b07819143ff319157b3f0580cdf9117`, with source endpoints as its two parents. Authored integration count: 177 additions/deletions including this task document, below the delivery threshold. Remote destination/session confirmation remains pending.
- Local main fast-forwarded from `bf38195` to `9862daf`; both source endpoints are ancestors. Feature branches, isolated worktrees and existing untracked inventory were preserved. Tracking-only closure adds no source changes; structural readback and ancestry/diff checks cover this unit, with no additional runtime boundary.
- Rollback boundary: retain source branches and the original main commit above; do not perform destructive rollback without user approval.

## Next step
Confirm `origin/main` and the configured repository Git authentication/session with the user before any push or other remote operation. T3 remains pending; no remote contact has occurred.
