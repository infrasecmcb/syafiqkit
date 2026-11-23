# syafiqkit for DeepSeek Harness

A DeepSeek Harness bundle that serves the workflow skills of
[syafiqkit](https://github.com/syafiq555/syafiqkit) (a Claude Code plugin by Syafiq)
to Harness agents. Each skill is loaded with a short note that maps Claude Code tool
names (Agent, AskUserQuestion, TodoWrite, `${CLAUDE_SKILL_DIR}` …) onto Harness tools.

## Install

```powershell
git clone https://github.com/syafiq555/syafiqkit.git ..\syafiqkit-upstream
node tools\build.mjs ..\syafiqkit-upstream   # copies the skills into this folder
node tools\test.mjs                          # offline check of every skill
```

Then in DeepSeek Harness: **Plugins** > **Add plugin** and pick this folder
(or ask the agent to install the bundle).

## Configure

In the plugin row's config (`cordis.patch.yml`):

| Field | Default | Meaning |
|---|---|---|
| `outputStyle` | `false` | Add syafiqkit's ADHD-oriented answer-style rules to every session |
| `exclude` | `[]` | Skill names to hide |

## What is not ported

Skills built on Claude Code-only features (`taste`, `impeccable`, `haiku`,
`headless-watch`, `skill-creator`, `update-plugin`, `agent-setup`,
`self-organize-agent-memory`, `claude-server-token`, `reclaim-disk`), and the
Claude Code mod (band, `/sk`, docs and changes panes, answer pictures).
`tools/build.mjs` lists the reasons.
