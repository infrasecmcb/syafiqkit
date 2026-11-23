---
name: plan-to-ship
description: Take a feature or product idea from rough intent to reviewed, committed code with human gates: prime, intent, architecture, slices, plan, build, validate, review, retro. Use for any non-trivial change.
---

# Plan to ship

One pipeline that chains the plan, implement, validate loop. The agent does the work; **you stop and ask at three places only**: what to build, whether the plan is right, and whether to merge or push. Everything between runs on its own, and every step ends in a file the next step can read, so a fresh agent can pick up where the last one stopped.

Skills used (load each with the `skill` tool when you reach its stage): `prime-codebase`, `plan-create-prd`, `plan-architecture`, `piv-slice-epic`, `piv-plan-implementation`, `piv-implement`, `piv-validate`, `piv-review-changes`, `piv-fix-review-findings`, `piv-commit`, `piv-create-pr`, `system-execution-report`, `system-evolution-review`.

## 0. Size the job (say it out loud, one line)

| Size | Looks like | Stages to run |
|---|---|---|
| Tiny | one file, obvious change | build, validate, commit |
| Small | one feature or fix in a known codebase | prime, plan, build, validate, review, commit |
| Large | several tickets, or a new product or area | all stages, starting at intent |

If unsure, treat it as Small. Do not run stages you do not need; each one costs the user attention.

## 1. Harness first: no loop without a check

Before building anything, confirm the project can prove its own work: a single non-interactive command that runs tests (and lint or type checks), and an `AGENTS.md` with the run and test commands. If either is missing, run `harness-check` and fix that first, or write the project's validate skill from `piv-validate`. A pipeline with no check only produces confident guesses.

## 2. The stages

Track them with `todo_write`. Do one at a time; end each with the named file.

| # | Stage | Skill | Gate: stop and ask | Output |
|---|---|---|---|---|
| 1 | Prime | `prime-codebase` | no | a short summary in the reply |
| 2 | Intent (Large only) | `plan-create-prd` | **yes: the interview answers are the user's** | `docs/prd/<name>.md` |
| 3 | Architecture (Large, or any real fork) | `plan-architecture` | **yes: options and a recommendation, the user picks** | `docs/architecture/<name>.md` |
| 4 | Slice (Large only) | `piv-slice-epic` | confirm the ticket list | `docs/tickets/<epic>.md` |
| 5 | Plan, one ticket at a time | `piv-plan-implementation` | **yes: the user approves the plan** | `docs/plans/<name>.md` |
| 6 | Build | `piv-implement` | no | code, `docs/reports/<name>-report.md` |
| 7 | Validate | `piv-validate` | no | PASS or FAIL with output |
| 8 | Review | `piv-review-changes` by a **fresh subagent** | no | `docs/reviews/` file |
| 9 | Fix findings | `piv-fix-review-findings` | **yes: fix now or defer** | fixes and a deferred list |
| 10 | Commit | `piv-commit` | commit only if the user asked for commits | one atomic commit |
| 11 | Push or PR | `piv-create-pr` | **yes: always ask before pushing** | PR link |
| 12 | Retro | `system-execution-report`, then `system-evolution-review` | propose edits; the user approves | updates to `AGENTS.md` or skills |

Stages 1 to 4 turn a vague idea into decisions; 5 to 7 turn a decision into verified code; 8 to 12 make it trustworthy and make the next run better.

## 3. Rules that keep it honest

- **The plan is the whole brief.** After the user approves it, build from the plan file, not from memory of the conversation. For a long plan, give the build to a fresh `subagent` whose prompt is "read `docs/plans/<name>.md` and implement it task by task; run each task's VALIDATE command; write the report"; this avoids a context so full the agent loses the thread. The plan must name every file to read, every command to run and what "done" means.
- **Build on a branch.** One branch per ticket (`git checkout -b feature/<slug>`), or a worktree for parallel tickets (`worktree-create`, then `worktree-merge`). Never build on the main branch with uncommitted changes.
- **Validation is code, not opinion.** "Done" means the validate command passed and you read its output, not that the code looks right. Report the real numbers.
- **Prove the test bites.** For each behaviour the plan adds, write the test first, see it fail for the right reason, then make it pass. Before the review stage, break the new code once on purpose (a reversible one-line edit) and confirm the suite goes red; restore it. A test that never failed has not been shown to test anything.
- **The reviewer has not seen the build.** Review with a fresh `subagent` handed the diff and the plan (use `delegate-and-verify` for the brief). A reviewer that wrote the code approves it.
- **Never guess silently.** Anything you assumed goes in the plan's open questions and is shown to the user. If the user says "just do it", name what you are guessing and proceed.
- **Git safety.** No force-push, no `reset --hard`, no committing or pushing the user did not ask for. Stop and ask on a dirty main branch.
- **Small and finished beats large and abandoned.** If the plan grows past roughly 1,500 changed lines, slice it.

## 4. Retro: make the next run better

After the last stage, spend five minutes: write the execution report, compare the plan to what happened, and for each divergence ask whether a rule, a plan-template line or a skill would have prevented it. Propose the exact edit to `AGENTS.md` (or a skill) and apply it only after the user agrees. Keep `AGENTS.md` short: add a rule only for a mistake that happened, and remove rules that no longer prevent anything.

## 5. When to stop and hand back

Stop and report instead of pushing on when: validation fails twice for the same reason, the plan turns out to be wrong, a needed decision belongs to the user, or a command would delete or overwrite something you did not create. Say what you tried, what you saw, and the one decision needed.
