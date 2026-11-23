<harness-addendum skill="done">
Harness overrides for this skill. Where they conflict with the text below, follow these.

- **Agents.** There is no agent registry and no `.claude/agents` lookup. Skip "Check for project agents" and `project-agent-dispatch.md`. For each reviewer start a `subagent` whose prompt begins with the role brief read from `{{ROOT}}\agents\`: simplifier = `code-simplifier.md`, reviewer = `code-reviewer.md`, product reviewer = `product-reviewer.md`. If the project has its own `.claude\agents\<name>.md` or `.agents\`, prefer that file. Send all agents in ONE message so they run concurrently.
- **Waiting.** A finished agent's result arrives as a notice in the next turn. End your turn after dispatching rather than polling; use `wait_agent` only when nothing else is left to do. Do not ask agents to use SendMessage.
- **Prompts.** Keep the banned git verbs (`stash`, `checkout -- .`, `reset`, `clean`, `restore`, `commit`, `push`) and the one-writer-per-file partition. Add: "Do the work yourself; do not start further agents."
- **Missing skills.** The Plugin row (`update-plugin`) does not exist here: write `n/a (not available in Harness)` in that cell. The Design row runs `uiux`, and `impeccable` critique and `taste` review where the text asks for them (both are installed; each may need Node and Edge or Chrome, and impeccable asks before downloading its helper program). Load `delegate-and-verify` for any bulk step the text hands to haiku.
- **Scripts.** `check-render.mjs` and the other design scripts live in `{{ROOT}}\skills\uiux\scripts`; they need Node 22+ and Edge or Chrome (set `CHROME_PATH`).
- **Instruction files.** "CLAUDE.md capture" means: update the project's `AGENTS.md` (or its existing `CLAUDE.md`). Run `update-claude-docs` for the edit.
- **Verification.** Still run the project's real checks (tests, lint, `git diff --stat`) and report what you ran. Do not claim an agent reviewed something it was not handed.
</harness-addendum>

