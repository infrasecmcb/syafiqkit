<harness-addendum source="cole-skills">
These skills are Cole Medin's plan, implement, validate loop (github.com/coleam00/skills), written for Claude Code. In Harness:

- **Arguments.** `$ARGUMENTS`, `$plan` and `$report` mean what the user typed after the skill name or described in the request (a feature, a ticket, a file path). If nothing was given, ask for it.
- **Inline commands.** Lines starting with !`command` are not run for you: run the command yourself with the shell tool (`pwsh` on Windows) and use its output. `tree`, `lsof` and `python3` may be missing on Windows; use `git ls-files`, `Get-ChildItem` or `python`.
- **Where files go** (create the folder if missing): `.claude/plans/` = `docs/plans/`, `.claude/reports/` and `.claude/execution-reports/` = `docs/reports/`, `.claude/code-reviews/` and `.claude/system-reviews/` = `docs/reviews/`, `.claude/references/` = `docs/references/`. PRDs go in `docs/prd/`, architecture notes in `docs/architecture/`, ticket breakdowns in `docs/tickets/`.
- **Other names.** `CLAUDE.md` means the project's `AGENTS.md`. "Run the `<name>` skill" means load it with the `skill` tool. `.claude/skills/<name>` is a skill folder: project skills live in `.dsh/skills/` or `.agents/skills/`.
- **Asking.** Where a skill says GATE, post the numbered questions with their recommended defaults, then end your turn and wait; use `ask_user_question` for a short choice. Never answer your own questions.
- **Subagents.** "Specialized agents" and parallel exploration mean `subagent` calls with a self-contained brief; see `delegate-and-verify`. Do not start subagents the task does not need.
- **Trackers.** Jira and Confluence steps need an Atlassian MCP connection that this bundle does not install; skip them, or use `gh issue view` for GitHub tickets when `gh` is installed and signed in, and say what you skipped.
- **Commands that need a project.** `piv-validate` is a template: its commands must be replaced with the project's real ones before it means anything. If that has not been done, find the real commands (package.json scripts, CI workflow), tell the user, and use them.
- **Git and the network.** Commit only when the user asked for commits, push or open a PR only when asked, and never use force-push or `reset --hard`.
</harness-addendum>
