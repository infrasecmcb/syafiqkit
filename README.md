# syafiqkit for DeepSeek Harness

A DeepSeek Harness bundle that serves the workflow skills of
[syafiqkit](https://github.com/syafiq555/syafiqkit) (a Claude Code plugin by Syafiq)
to Harness agents. 59 skills are included. Each one loads with a short note that maps
Claude Code tool names (Agent, AskUserQuestion, TodoWrite, `${CLAUDE_SKILL_DIR}` …)
onto Harness tools.

Skills are by Syafiq and shared with his permission; see [NOTICE.md](NOTICE.md).

## Install

1. Clone this repository:

   ```powershell
   git clone https://github.com/infrasecmcb/syafiqkit.git
   ```

2. In DeepSeek Harness open **Plugins** > **Add plugin** and choose the cloned folder
   (or ask the agent to install it as a bundle).
3. Start a new session. Ask for a skill by name, for example "use the commit skill",
   or let the agent pick one.

Harness runs the plugin straight from the cloned folder, so keep it where it is.

## Configure

In the plugin row's config (`cordis.patch.yml`):

| Field | Default | Meaning |
|---|---|---|
| `outputStyle` | `false` | Add syafiqkit's ADHD-oriented answer-style rules to every session |
| `exclude` | `[]` | Skill names to hide, e.g. `[casual-message, gchat-format]` |

## Update the skills from upstream

```powershell
git clone https://github.com/syafiq555/syafiqkit.git ..\syafiqkit-upstream   # or git pull in it
node tools\build.mjs ..\syafiqkit-upstream   # replaces skills/, agents/, RULESET.md, skills.json
node tools\test.mjs                          # offline check of every skill
```

Restart DeepSeek Harness afterwards.

## What is not ported

Skills built on Claude Code-only features (`taste`, `impeccable`, `haiku`,
`headless-watch`, `skill-creator`, `update-plugin`, `agent-setup`,
`self-organize-agent-memory`, `claude-server-token`, `reclaim-disk`), and the
Claude Code mod (band, `/sk`, docs and changes panes, answer pictures).
`tools/build.mjs` lists the reasons. A few kept skills still mention `claude -p` or
haiku agents for one step; the loading note tells the agent to do that step itself or skip it.
