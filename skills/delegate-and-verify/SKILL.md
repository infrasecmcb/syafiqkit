---
name: delegate-and-verify
description: Hand bulk, parallel or mechanical work to subagents (many files, rows, reports, or a multi-pass rewrite) and verify what comes back before reporting. Replaces the Claude-only haiku dispatch skill.
---

# Delegate and verify

Use this when a step in another skill says "dispatch to haiku", "fan out agents", "run a pass on a cheaper tier", or when you face 30+ similar items (files to read, rows to extract, reports to summarise). One session working through that many holds each item thinly and still sounds confident; separate agents with a narrow brief do better. Do not use it for work that needs judgement across the whole picture: that stays with you.

Harness tools: `subagent` (fresh agent, brief in the prompt), `subagent_fork` (child that already knows this conversation), `send_message`, `wait_agent`. Omit the model arguments unless the user asks; `list_subagent_models` shows cheaper routes if speed or cost matters.

## 1. Decide the split

- One agent per **disjoint** unit: a file, a report, a section, a batch of rows. Two agents must never write the same file.
- Work that waits on another agent's output runs after it; independent agents start together in one message.
- A rewrite that depends on reading everything (merging docs, reconciling cross-references) is one agent's job, or yours.

## 2. Snapshot before anything writes files

1. Read the target's uncommitted diff (`git status`, `git diff`). Changes you did not make are someone else's work: name them in the brief as context, never overwrite them.
2. Copy each target to a folder unique to this dispatch (for example `.dispatch/<date>-<n>/before/`), and record its byte size. A new folder per pass; never write into an earlier pass's snapshot.
3. Read-only tasks need no snapshot.

## 3. Write the brief

Keep it short. The agent cannot see this conversation (unless you used `subagent_fork`), so include only what it cannot derive:

- the skill or procedure to follow (path to read first) and the **exact files** it may touch;
- the expected state (byte size or line count) so it can detect a mismatch;
- what is off limits: `git commit`, `push`, `stash`, `reset`, `checkout -- .`, `clean`, and any file outside the target set;
- "Do the work yourself; do not start further agents.";
- a **self-check** to run before reporting: confirm each claimed destination exists (`Test-Path`, `Select-String -Count`) and list anything it was unsure about;
- the report format: one line per file or item: done, skipped (why), or failed.

State constraints, not designs. Do not forbid a mechanism ("do not move text") when you mean to forbid a failure ("text must not be lost"); demand verification instead.

## 4. Verify what comes back (never forward a report unchecked)

- **Counts:** items in = items out. A missing item is a finding, not rounding.
- **Spot-check 10-20%** of the work against the source, always the largest and the oddest items, not only the easy ones. For extracted facts, open the cited line.
- **Diff:** `git diff --stat` (or compare with the snapshot). Any file changed outside the target set is surplus: restore it from the snapshot.
- **Facts that must survive** a rewrite: search for each one in the result.
- **Mechanical checks:** run the project's tests, linters or link checks if the work touched code or docs.
- A pass that fails verification is re-run once with a corrected brief (or done by you). Say so in the report.

## 5. Report

Say what was split, how many agents, what you verified and how, and what you could not verify. Do not describe a delegated result as your own work, and do not claim coverage you did not check.
