<harness-addendum skill="refresh-instructions">
Harness overrides. Each of the three passes (restructure, condense, unhobble) is a `subagent` run, not a haiku run: load `delegate-and-verify` before each pass and follow its snapshot, brief and verify steps; "Load Skill(haiku)" means "re-read delegate-and-verify". Keep one pass per agent, one snapshot folder per pass, and verify each pass before starting the next. Omit the model arguments. `update-plugin` does not exist here; skip any step that requires it. Treat AGENTS.md as the instruction file where the text says CLAUDE.md.
</harness-addendum>

