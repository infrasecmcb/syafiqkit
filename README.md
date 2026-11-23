# Skill library for DeepSeek Harness

A DeepSeek Harness bundle with 99 agent skills from 12 open-source authors, in one plugin.
Each skill loads with a short note that maps Claude Code tool names (Agent, AskUserQuestion,
TodoWrite, `${CLAUDE_SKILL_DIR}` …) onto Harness tools. Authors and licences are in
[NOTICE.md](NOTICE.md) and `licenses/`.

## What is in it

| Area | Skills | From |
|---|---|---|
| Workflow, docs, shipping | commit, done, ship, task-summary, setup-project-docs, read-summary, user-manual, … (55 on by default) | [syafiqkit](https://github.com/syafiq555/syafiqkit) |
| UI/UX and animation | uiux, emil-animate, emil-review-animations, emil-gestures, … | syafiqkit (Emil Kowalski's skills inside) |
| Engineering | test-driven-development, systematic-debugging, writing-plans, executing-plans, subagent-driven-development, verification-before-completion, requesting/receiving-code-review, git worktrees | [obra/superpowers](https://github.com/obra/superpowers) |
| Engineering | api-and-interface-design, code-simplification, performance-optimization, git-workflow, shipping-and-launch, spec-driven-development, frontend-ui-engineering | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) |
| Security review | security-and-hardening, code-review-and-quality, secpriv-code-review (security + privacy), owasp-llm-top10, owasp-ai-testing | Osmani, [Meta secpriv-skill](https://github.com/facebookresearch/secpriv-skill), [mastepanoski](https://github.com/mastepanoski/claude-skills) |
| UX and accessibility audits | nielsen-heuristics-audit, wcag-accessibility-audit, accessibility-engineering, cognitive-walkthrough, ux-audit-rethink, ui-design-review | mastepanoski, Osmani |
| Documentation | documentation-and-adrs, codebase-documenter, technical-doc-creator | Osmani, [mhattingpete](https://github.com/mhattingpete/claude-skills-marketplace) |
| Video | remotion-motion-graphics, explainer-video, caption-animation, short-form-video, audiogram, youtube-intro-outro, talking-head-b-roll, vlog-auto-edit | [haidrrrry](https://github.com/haidrrrry/claude-remotion-skill), [iart.ai](https://github.com/iart-ai/motion-skills), [znyupup](https://github.com/znyupup/ai-video-editing-skill) |

Video skills need software this bundle does not install: Node.js and Remotion, `ffmpeg`, and for some
speech-to-text (Whisper) or a vision-model API key. The loading note tells the agent to check first.

## Install

1. `git clone https://github.com/infrasecmcb/syafiqkit.git`
2. In DeepSeek Harness open **Plugins** > **Add plugin** and choose the cloned folder
   (or ask the agent to install it as a bundle).
3. Start a new session. Ask for a skill by name ("use test-driven-development") or describe the task.

Harness runs the plugin straight from the cloned folder, so keep it where it is.

## Configure

In the plugin row's config (`cordis.patch.yml`):

| Field | Default | Meaning |
|---|---|---|
| `outputStyle` | `false` | Add syafiqkit's ADHD-oriented answer-style rules to every session |
| `exclude` | invoicing, Google Chat, casual messages, pull-db | Skill names to hide. Setting it replaces the default list; `[]` turns everything on |

## Rebuild from upstream

`sources.json` lists every source, the skills taken from it and why others were left out.
`descriptions.json` holds the short catalog descriptions (the originals ran to 1,000 characters).

```powershell
mkdir .upstream; cd .upstream
git clone --depth 1 https://github.com/syafiq555/syafiqkit.git
git clone --depth 1 https://github.com/obra/superpowers.git
git clone --depth 1 https://github.com/addyosmani/agent-skills.git
# ... one folder per source in sources.json (folder name = "dir")
cd ..
node tools\build.mjs     # replaces skills/, agents/, references/, licenses/, NOTICE.md, skills.json
node tools\test.mjs      # validation, reference check, catalog size
```

Restart DeepSeek Harness afterwards. Review `git diff` of the upstream commits before trusting new
skill text: the skills are instructions your agent will follow.

## Not included

syafiqkit skills built on Claude Code features (`taste`, `impeccable`, `haiku`, `headless-watch`,
`skill-creator`, `update-plugin`, `agent-setup`, `self-organize-agent-memory`, `claude-server-token`,
`reclaim-disk`) and its Claude Code mod; superpowers' `brainstorming`, `writing-skills`,
`using-superpowers` and `diagnosing-superpowers`. A few kept skills still mention those; the loading
note tells the agent to do the step itself or skip it.
