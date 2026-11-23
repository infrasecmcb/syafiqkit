<harness-addendum skill="score-loop">
Harness overrides. The independent re-scorer and the builders are `subagent` runs (a reviewer brief from `{{ROOT}}\agents\product-reviewer.md` suits the scorer); give each a fresh context with only the rubric and the work, not your earlier scores. Omit `model`. `haiku` and `task-builder` as agent types do not exist: use a plain `subagent`, or `{{ROOT}}\agents\task-builder.md` as the builder brief. Use `delegate-and-verify` for any bulk step.
</harness-addendum>

