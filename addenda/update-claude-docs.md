<harness-addendum skill="update-claude-docs">
Harness overrides. There is no `claude-md-pruner` agent type: for a pruning pass start a `subagent` whose prompt begins with the brief in `{{ROOT}}\agents\claude-md-pruner.md` and the file paths to scan. Treat AGENTS.md as an instruction file alongside CLAUDE.md; create or update whichever the project uses, and do not create CLAUDE.md in a project that only has AGENTS.md.
</harness-addendum>

