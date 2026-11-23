---
name: harness-check
description: Audit how well a project is set up for AI agents: instruction file, one-command validation, tests that can fail, guardrails, skills and feedback loop. Gives a scored report and fixes with approval.
---

# Harness check

The "harness" is everything around the model that decides whether its work can be trusted: the instructions it reads, the checks it can run, the guardrails that stop damage, and the loop that improves all three. A good model in a weak harness produces confident, unverified work. This skill measures the harness and fixes the weakest parts.

Audit first, change nothing until the user approves the fix list. Judge by running things, not by reading about them.

## 1. Gather facts (read-only)

Run and record the real output for each:

- **Instruction file:** is there an `AGENTS.md` (or `CLAUDE.md`)? How many lines? Does it name the commands to run, test and lint, the layout, the conventions and what never to touch?
- **Validation:** find the project's test, lint and type-check commands (`package.json` scripts, `pyproject.toml`, `Makefile`, CI workflow). Run them from the right folder. Note pass or fail, time taken, and whether any asked for input.
- **Tests that can fail (the break matrix):** a green suite proves nothing until you have seen it go red. List 6-8 behaviours the product promises (what a user would notice: the reply appears, the conversation is remembered, the chosen language is used, a state changes colour, long text wraps, an error shows). For each, make one small reversible edit that breaks only it, run the suite, record red or green, then restore the file (read it first and write it back byte for byte; confirm with `git diff` that nothing is left changed). In a first audit expect about a third to stay green: each green is a missing test. Add a test for each, re-run the same breaks, and require every one to turn the suite red before you call the harness fixed. Run the whole suite 3 times with no change to catch flaky tests.
- **Bugs found while writing tests:** a test written for a promise that turns out false has found a real bug (in one audit, a message typed while the assistant was speaking was silently dropped). Keep the failing test, fix the code, and say so in the report.
- **Secrets and safety:** is `.env` ignored, is there an `.env.example`, does a search of tracked files find key-like strings? Is there any way for the agent to run destructive commands unattended?
- **Plans and decisions:** is there a place for specs, plans or decision records (`docs/`)? Are they current?
- **Skills:** project skills under `.dsh/skills` or `.agents/skills`; do their descriptions say when to use them?
- **Feedback loop:** is there any record of past agent mistakes turned into rules? When was the instruction file last changed compared with the code?
- **Visibility:** can the agent see the running result (a log, a screenshot script, a test report) or does it work blind?

## 2. Score (0 = missing, 1 = partial, 2 = solid), with the evidence

| Area | What a 2 looks like |
|---|---|
| Instructions | Short (under about 150 lines), true when checked against the code, has commands, conventions and a never-touch list |
| One-command check | One non-interactive command runs tests and lint, passes on a clean checkout, finishes in a few minutes |
| Checks bite | A deliberate break turns the suite red |
| Guardrails | No secrets in the repo, `.env` ignored, destructive actions need approval, branch or worktree per task |
| Plans and decisions | A known home for specs and plans; open questions are written down |
| Skills | Repeated procedures are skills with descriptions that trigger |
| Feedback loop | Mistakes become one-line rules; stale rules get removed |
| Visibility | The agent can see what it built (logs, screenshots, test output) |

Check the instruction file for **drift** by running `rules-check-drift` when it exists, and for **bloat** by asking of each rule whether a recent mistake or a hard-to-guess fact justifies it. Delete what neither justifies; long rule lists hide the rules that matter.

## 3. Report

One table: area, score, one line of evidence (the command and its result). Then the **three changes that would raise the score most**, each with the exact file or command and the effort (minutes, an hour, a day). State what you could not check and why. Do not pad: a project that scores well gets a short report.

## 4. Fix, with approval

Offer the fixes in order of value and ask before each one that edits files. Typical fixes: write or trim `AGENTS.md` (use `rules-create-global`), add a `validate` command or project skill (`piv-validate`), add a failing-test check, ignore `.env`, add `docs/plans`, convert a repeated procedure into a skill (`write-a-skill`). After each fix, re-run the check that justified it and report the new result.

## 5. Keep it healthy

Suggest re-running this check after a big change or when the agent repeats a mistake. A mistake that happens twice is a missing rule, check or skill: find which and add it.
