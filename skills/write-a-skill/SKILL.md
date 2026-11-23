---
name: write-a-skill
description: Write or improve an agent skill (SKILL.md) for DeepSeek Harness: where it goes, how to write a description that triggers, and how to test it.
---

# Write a skill for DeepSeek Harness

A skill is a folder with a `SKILL.md`. The agent sees only its one-line description until it decides to load it, so most of the craft is in that line and in keeping the body short.

## 1. Decide it deserves to be a skill

Write one when the same procedure keeps being re-explained: a checklist, a workflow with a fixed order, project knowledge the agent cannot derive. Do not write one for something the agent already does well unprompted, or for a rule that belongs in the project's `AGENTS.md` (project facts and house rules go there; a skill is for a procedure).

## 2. Put it where Harness looks

| Scope | Folder |
|---|---|
| This project only | `<project>/.dsh/skills/<name>/SKILL.md` or `<project>/.agents/skills/<name>/SKILL.md` |
| All your projects | `~/.dsh/skills/<name>/SKILL.md` (or `$DSH_HOME/skills`) or `~/.agents/skills/<name>/SKILL.md` |
| Inside this bundle | `local-skills/<name>/SKILL.md`, then add a one-line entry to `descriptions.json`, an area in `tools/docs.mjs`, and run `node tools/build.mjs`, `node tools/test.mjs`, `node tools/docs.mjs` |

Only `<root>/<name>/SKILL.md` or `<root>/<name>.md` is found; nested trees are not. New and renamed skills appear without a restart.

## 3. Frontmatter

```yaml
---
name: kebab-case-name            # lowercase letters, digits, single hyphens; matches the folder
description: One or two sentences: what it does AND when to use it.
---
```

Optional: `disable-model-invocation: true` (only you can invoke it), `user-invocable: false` (only the agent), `metadata`, `whenToUse`. A malformed value drops the whole skill with a warning, so check spelling of the booleans (`true`/`false`).

## 4. Write the description so it triggers

The description is the trigger. State the job and the situations, in the words a user would use. Keep it under about 240 characters; the catalog cuts at 500.

- Weak: "Helps with databases."
- Strong: "Review a SQL migration for locking, data loss and rollback before it runs. Use when the user shares or asks about a migration."

Name the near neighbours it must not steal work from ("for UI polish use uiux instead") if confusion is likely.

## 5. Write the body

- Open with when to use it and what done looks like, in two or three lines.
- Numbered steps in the order they must happen. One action per step.
- Put checks where they are needed ("run the tests and read the output") and say what to do on failure.
- Say what to leave alone: banned commands, files not to touch, questions that need the user.
- Prefer a few firm rules with a reason over many soft ones. Remove anything the agent would do anyway.
- Keep `SKILL.md` under about 300 lines. Move bulk (long tables, templates, examples) to `references/<topic>.md` and link it with the exact path; say when to open it ("read it only when you reach step 4").
- Scripts go in `scripts/`; say how to run them and what they print. Use Harness tool names: `subagent`, `ask_user_question`, `todo_write`, `read`, `write`, `edit`, `glob`, `grep`, and the shell (`pwsh` on Windows).

## 6. Test it

1. Start a new session and ask for the job in plain words, without naming the skill. Did it load? If not, rewrite the description.
2. Ask for something nearby that should NOT trigger it. Did it stay out?
3. Run it on a real task. Read what the agent did against your steps; fix steps it skipped or got wrong.
4. Re-read the body cold: every sentence should change what the agent does. Cut the rest.

## 7. Safety before sharing

A skill is instructions the agent will follow with your permissions. Before installing one you did not write, read it for downloads or piped installs, hidden text, requests for secrets, and destructive commands (`rm -rf`, force pushes, `reset --hard`). Check its licence allows the use you plan.
