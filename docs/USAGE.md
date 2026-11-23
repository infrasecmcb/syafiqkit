# How to use the skill library

A skill is a short procedure the agent follows for one kind of job. You do not run skills like programs; you ask for the job, and the agent loads the skill and follows it.

## The three ways to use a skill

**1. Name it.** Most reliable.

```text
Use the test-driven-development skill to add a rate limit to /api/chat.
```

**2. Describe the job.** The agent sees every skill's one-line description and picks a match.

```text
The login test only fails in CI and I don't know why.      -> systematic-debugging
I need a plan for adding dark mode before I code.           -> writing-plans
Is server.js safe? It handles an API key and user input.   -> security-and-hardening
```

**3. Name it in a goal or plan.** For long jobs: "Build X. Use brainstorming first, then writing-plans, then test-driven-development." The agent loads each as it reaches it.

If a skill does not fire when you expected it to, name it. If the wrong one fires, say "don't use that, use `<name>`".

## Common workflows

### Ship a feature end to end (recommended)

`plan-to-ship` is the one to start with for anything non-trivial. It sizes the job, checks the project can prove its own work, then runs the stages below and asks you only at the gates.

```text
Use plan-to-ship: add streaming replies to Nova.
```

| Stage | Skill | Ask you? |
|---|---|---|
| Prime | `prime-codebase` | no |
| Intent (big jobs) | `plan-create-prd` | yes, it interviews you |
| Architecture (big jobs) | `plan-architecture` | yes, options and a recommendation |
| Slice into tickets (big jobs) | `piv-slice-epic` | confirm |
| Plan one ticket | `piv-plan-implementation` | yes, you approve the plan |
| Build, then validate | `piv-implement`, `piv-validate` | no |
| Review by a fresh agent | `piv-review-changes` | no |
| Fix findings | `piv-fix-review-findings` | yes, fix now or defer |
| Commit, then push or PR | `piv-commit`, `piv-create-pr` | push always asks |
| Retro | `system-execution-report`, `system-evolution-review` | you approve edits |

Before you start on a project, run `harness-check`: it scores the project's setup for agents (instructions, one-command checks, tests that can fail, guardrails) and fixes the gaps with your approval. `piv-validate` is a template and needs the project's real test commands.

### Build a feature (the pieces on their own)

1. `brainstorming`: settle what to build (asks you questions, one at a time).
2. `spec-driven-development`: write the spec if there is none.
3. `writing-plans`: turn it into ordered, checkable steps.
4. `test-driven-development`: failing test first, then the code. Use `executing-plans` or `subagent-driven-development` to carry out the plan.
5. `verification-before-completion`: run the real checks before anyone says "done".
6. `done`, then `commit`, then `ship`.

> "Add streaming replies to Nova. Start with brainstorming, then plan it, then build it test-first."

### Fix a bug

`systematic-debugging` finds the root cause before changing code: reproduce, trace, one hypothesis at a time. Then `test-driven-development` writes the regression test.

> "Use systematic-debugging: replies stop after the third message."

### Review code

| Goal | Skill |
|---|---|
| Review a change before merging | `code-review-and-quality` |
| Ask a subagent to review finished work | `requesting-code-review` |
| Deal with review comments you received | `receiving-code-review` |
| Simplify without changing behaviour | `code-simplification` |

### Security review

| Goal | Skill |
|---|---|
| General hardening: input, auth, secrets, dependencies | `security-and-hardening` |
| Security and privacy (CWE and GDPR) in one pass | `secpriv-code-review` |
| Apps that call an LLM | `owasp-llm-top10` |
| Testing AI trustworthiness | `owasp-ai-testing` |
| A published vulnerability hits your servers | `patch-advisory` |

> "Run secpriv-code-review on server.js and report only high-confidence findings."

### UI and UX

| Goal | Skill |
|---|---|
| Polish, redesign or critique a screen (measures real renders at several widths) | `uiux` |
| Design-director commands: shape, critique, audit, polish, bolder, quieter, harden ("impeccable polish") | `impeccable` |
| Build or redesign a landing page or company site so it does not look templated | `taste` |
| Usability audit | `nielsen-heuristics-audit`, `cognitive-walkthrough`, `ux-audit-rethink` |
| Accessibility | `wcag-accessibility-audit`, `accessibility-engineering` |
| Visual design review | `ui-design-review` |
| Brief a designer | `design-handoff` |

### Animation

`emil-animate` to build motion, `emil-review-animations` to review it, `emil-remove-animations` to cut what is not needed, `emil-gestures` for drag and swipe, `emil-mobile-native` to make a web app feel like a phone app.

### Documentation

`setup-project-docs` for a project's core docs, `documentation-and-adrs` for decisions and drift, `codebase-documenter` for how-it-works docs, `user-manual` for end-user guides, `doc-to-md` and `md-to-pdf` to convert.

### Wrap up and ship

`done` is the full wrap-up (simplify, review, update docs, capture lessons) and starts subagents. `quick-done` is the cheap version for a small change. `ship` commits, pushes and checks the deploy; run it after `done`.

### Write your own skills, schedule checks

`write-a-skill` explains where a Harness skill lives, how to write a description that triggers, and how to test it. `schedule-checks` sets up a repeating check with Harness scheduled tasks and tells you only when something needs you.

### Big, repetitive jobs

`delegate-and-verify` hands 30+ similar items (files, rows, reports) to subagents, takes a backup first, and checks the results. Say "use delegate-and-verify" or let a skill that needs it call it.

## Tips

- **Say what to work on.** "Use uiux on `brain-chat/public`" beats "use uiux".
- **Skills ask questions.** `brainstorming` and `done` use the question tool; answer them rather than skipping.
- **Check what the agent changed.** Review the diff after any skill that edits files.
- **Tools a skill needs.** Video and some audit skills need Node, ffmpeg or a browser; the agent should tell you what is missing before installing.
- **Too many skills in the list?** Hide some with `exclude` (see the [README](../README.md#configure)).
- **A skill mentions something Harness lacks** (a slash command, `claude -p`, an agent type): the agent is told to do the step itself or skip it. If it gets stuck, say "skip that step".

## Troubleshooting

| Problem | Fix |
|---|---|
| The skills do not appear | Check **Plugins** shows the bundle as enabled, then open a **new session**. |
| Changes after `git pull` are not visible | Toggle the plugin off and on in **Plugins**, or restart Harness. |
| A skill is "unknown" | It may be in the off-by-default list: set `exclude: []`. |
| A skill fails on a missing file | Run `node tools\test.mjs` and report the output with the skill name. |
| Video skill cannot render | Install Node and `ffmpeg`; see the requirements table in the README. |

## For maintainers

```text
index.js            the plugin: serves skills, adds the loading note, optional answer style
sources.json        which upstream repos and skills are included, and what is skipped
descriptions.json   hand-written one-line catalog descriptions
skills.json         generated: the manifest the plugin reads
skills/             generated: copies of the included skills
agents/ references/ generated: role briefs and shared references the skills point to
addenda/<skill>.md  Harness-specific text prepended to one skill when it loads
local-skills/       skills written for this bundle (delegate-and-verify, write-a-skill, schedule-checks)
licenses/           licence text per source; NOTICE.md lists them
tools/build.mjs     rebuild from .upstream checkouts
tools/test.mjs      validate skills, references and addenda
tools/docs.mjs      regenerate docs/SKILLS.md
addenda/_<source>.md  note prepended to every skill from one source (e.g. _cole-skills.md)
```

To add a skill from another repository: clone it into `.upstream/`, add it to `sources.json` with its licence, add a one-line entry to `descriptions.json`, put it in an area in `tools/docs.mjs`, then run build, test and docs. Scan it first (downloads, hidden text, secret access, destructive commands) and check its licence allows redistribution.
