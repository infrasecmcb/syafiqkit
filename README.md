# Skill library for DeepSeek Harness

130 ready-made agent skills in one DeepSeek Harness plugin: plan, build, debug, review, secure, document, design and ship.

Skills are short instruction packs. Ask your agent for one by name, or just describe the job and it picks a matching skill. The agent then follows a proven procedure instead of improvising.

> Skills come from 12 open-source authors and are written for Claude Code and similar agents. This bundle serves them to Harness agents and translates the tool names on the fly. Credit and licences: [NOTICE.md](NOTICE.md).

## Features

- **130 skills, 126 on by default**, grouped in 8 areas: planning and building, review and shipping, security, UI/UX and accessibility, animation, documentation, video, and client workflow. Full list: [docs/SKILLS.md](docs/SKILLS.md).
- **Short catalog.** Each skill shows the agent a one-line description (about 14,500 characters for all 126, versus about 26,000 with the original text), so conversations stay lean. The full instructions load only when a skill is used.
- **Made to run in Harness.** Every skill loads with a note mapping Claude Code's tools to Harness equivalents (`subagent`, `ask_user_question`, `todo_write`, shell, file tools). The agent-heavy skills (`done`, `refresh-instructions`, `score-loop` and others) carry extra Harness-specific instructions.
- **A planning-to-shipping pipeline with human gates.** `plan-to-ship` chains idea, architecture, tickets, plan, build, validate, review and retro, and stops for you only where a human decision matters. It is built on [Cole Medin's](https://github.com/coleam00/skills) plan-implement-validate loop. `harness-check` scores how well a project is set up for AI agents.
- **Delegation built in.** `delegate-and-verify` splits bulk work across subagents, backs up files first, and checks what comes back.
- **Security-reviewed sources.** Every added skill was scanned for downloads, hidden characters, secret access and destructive commands before inclusion. See [Trust](#trust-and-safety).
- **Self-checking.** `node tools/test.mjs` validates every skill, checks 449 file references, and confirms each Harness override loads.
- **Optional answer style.** One switch adds syafiqkit's concise, action-first answer rules to every session.
- **Easy to update.** One command rebuilds everything from the upstream repositories.

## What's inside

| Area | Examples |
|---|---|
| Plan to ship (Cole Medin's loop) | `plan-to-ship`, `harness-check`, `plan-create-prd`, `plan-architecture`, `piv-slice-epic`, `piv-plan-implementation`, `piv-implement`, `piv-validate`, `system-evolution-review` |
| Plan and build | `brainstorming`, `writing-plans`, `test-driven-development`, `systematic-debugging`, `subagent-driven-development` |
| Review, git and shipping | `code-review-and-quality`, `commit`, `done`, `ship`, `verification-before-completion` |
| Security and privacy | `security-and-hardening`, `secpriv-code-review`, `owasp-llm-top10`, `owasp-ai-testing` |
| UI, UX and accessibility | `uiux`, `impeccable`, `taste`, `nielsen-heuristics-audit`, `wcag-accessibility-audit`, `cognitive-walkthrough` |
| Animation | `emil-animate`, `emil-review-animations`, `emil-gestures`, `emil-mobile-native` |
| Tools for the agent | `delegate-and-verify`, `schedule-checks`, `write-a-skill` |
| Documentation | `documentation-and-adrs`, `codebase-documenter`, `setup-project-docs`, `user-manual` |
| Video | `remotion-motion-graphics`, `explainer-video`, `caption-animation`, `vlog-auto-edit` |
| Client workflow (some off) | `casual-message`, `gchat-format`, `setup-tracker`, `uat-script` |

## Install

You need DeepSeek Harness (desktop or web).

1. Clone this repository somewhere you will keep it:

   ```powershell
   git clone https://github.com/infrasecmcb/syafiqkit.git
   ```

2. In Harness open **Plugins**, choose **Add plugin**, and pick the cloned folder. (Or ask your agent: "install the bundle at `<folder>`".)
3. Start a **new session**. The skills now appear in the agent's skill list.

Harness runs the plugin straight from the folder, so do not move or delete it. To update: `git pull`, then restart Harness.

**Check it worked:** ask "list your skills" or "use the verification-before-completion skill". You should see the names from [docs/SKILLS.md](docs/SKILLS.md).

## How to use it

Short version: say what you want. Full walkthrough with examples: **[docs/USAGE.md](docs/USAGE.md)**.

```text
Use the systematic-debugging skill: the login test fails only in CI.
Write a plan for adding dark mode, using the writing-plans skill.
Run a security review of server.js with security-and-hardening.
Audit this page against WCAG with the wcag-accessibility-audit skill.
We're done: run the done skill.
```

You can also skip the skill name ("the animation feels slow") and the agent will usually pick a fitting skill, such as `emil-review-animations`.

## Configure

Edit the plugin's row in Harness (it is defined in [cordis.patch.yml](cordis.patch.yml)):

| Setting | Default | What it does |
|---|---|---|
| `outputStyle` | `false` | Adds syafiqkit's answer-style rules: lead with the action, numbered steps, no filler openers or closers. Applies to every session while on. |
| `exclude` | `commit-invoice-generator`, `casual-message`, `gchat-format`, `pull-db` | Skills to hide. Setting it **replaces** the default list. `exclude: []` turns all 130 on; add names to hide more. |

## Requirements for some skills

Most skills need nothing beyond the agent. A few need software this plugin does not install; the skill tells the agent to check first and ask before installing anything.

| Skills | Need |
|---|---|
| Video (`remotion-motion-graphics`, `explainer-video`, `caption-animation`, `short-form-video`, `audiogram`, `youtube-intro-outro`, `talking-head-b-roll`) | Node.js, Remotion, usually Chrome or Edge, `ffmpeg` |
| `vlog-auto-edit` | `ffmpeg`, Python, a speech-to-text model and a vision-model API key |
| `uiux` measuring scripts, `taste` | Node 22+ and Edge or Chrome (`CHROME_PATH` to choose) |
| `impeccable` | Downloads a 23 MB helper program from GitHub on first use (checked against a shipped fingerprint; the agent asks first) |
| `subagent-driven-development` | Bash (Git Bash on Windows) for its helper scripts |
| `piv-create-pr`, `piv-review-pr`, `piv-investigate-issue`, `piv-implement-issue`, `plan-create-stories` | GitHub CLI (`gh`) installed and signed in |
| `setup-tools`, `setup-tracker`, `watch-sheets` | Google Cloud project and sign-in |

## Limits (read this)

- **Built for another agent.** The skills were written for Claude Code. They are translated by a note and a few rewrites, not rewritten one by one, so an occasional step may refer to something Harness does not have. The agent is told to do that step itself or skip it and say so.
- **Not included:** `update-plugin`, `agent-setup`, `self-organize-agent-memory`, `claude-server-token`, `reclaim-disk` (depend on Claude Code or macOS) and syafiqkit's Claude Code mod (menu bar, `/sk`, pane viewers). Replaced rather than dropped: `haiku` by `delegate-and-verify`, `skill-creator` by `write-a-skill`, `headless-watch` by `schedule-checks`, and syafiqkit's copies of `taste` and `impeccable` by the original authors' versions (`impeccable` from its Harness build).
- **`taste` ships without its photograph library** (about 20 MB of images, mixed licences). Its scripts still run; for photographs the agent downloads credited stand-ins (asking first) or uses yours. Its finish gate is a manual step here (the Claude Code hook that ran it automatically is removed).
- **Lightly tested.** The bundle's checks are automated and pass, and a few skills were loaded in a live session. Most skills have not been run on a real task yet. Treat results as drafts and review what the agent changes.
- **Skills are instructions your agent will follow.** Read a skill before trusting a new one, especially after an update.

## Trust and safety

Every skill from outside syafiqkit was scanned before inclusion for downloads and piped installs, encoded or hidden text, secret and credential access, exfiltration, hidden instructions and destructive commands. The only hits were install commands in documentation and audit skills that describe prompt injection. Licences were checked for each source; AGPL projects and repositories without a licence file were left out. Re-run the checks any time:

```powershell
node tools\test.mjs
```

## Update or rebuild

`sources.json` lists every source, which skills are taken, and which are skipped and why. `descriptions.json` holds the short catalog descriptions.

```powershell
mkdir .upstream; cd .upstream
git clone --depth 1 https://github.com/syafiq555/syafiqkit.git
git clone --depth 1 https://github.com/obra/superpowers.git
git clone --depth 1 https://github.com/addyosmani/agent-skills.git
git clone --depth 1 https://github.com/mastepanoski/claude-skills.git
git clone --depth 1 https://github.com/facebookresearch/secpriv-skill.git
git clone --depth 1 https://github.com/mhattingpete/claude-skills-marketplace.git
git clone --depth 1 https://github.com/haidrrrry/claude-remotion-skill.git
git clone --depth 1 https://github.com/iart-ai/explainer-video-skills.git
git clone --depth 1 https://github.com/iart-ai/tiktok-video-skills.git
git clone --depth 1 https://github.com/iart-ai/youtube-video-skills.git
git clone --depth 1 https://github.com/iart-ai/b-roll-skills.git
git clone --depth 1 https://github.com/znyupup/ai-video-editing-skill.git
git clone --depth 1 https://github.com/pbakaus/impeccable.git
git clone --depth 1 https://github.com/Leonxlnx/taste-skill.git
git clone --depth 1 https://github.com/coleam00/skills.git cole-skills
cd ..
node tools\build.mjs     # skills/, agents/, references/, licenses/, NOTICE.md, skills.json
node tools\test.mjs      # validate everything
node tools\docs.mjs      # regenerate docs/SKILLS.md
```

Restart Harness afterwards and read `git diff` before trusting new skill text. Harness-specific rewrites live in `addenda/` (prepended per skill) and `local-skills/` (skills written for this bundle). Folder layout: [docs/USAGE.md#for-maintainers](docs/USAGE.md#for-maintainers).

## Credits

| Source | Author | Licence |
|---|---|---|
| [syafiqkit](https://github.com/syafiq555/syafiqkit) (workflow skills, Emil Kowalski's animation skills inside) | Syafiq | used with the author's permission |
| [coleam00/skills](https://github.com/coleam00/skills) (PRD, architecture, plan, implement, validate, review, worktrees, rules) | Cole Medin | MIT |
| [impeccable](https://github.com/pbakaus/impeccable) | Paul Bakaus | Apache-2.0 |
| [taste-skill](https://github.com/Leonxlnx/taste-skill) | Leonxlnx | MIT |
| [superpowers](https://github.com/obra/superpowers) | Jesse Vincent | MIT |
| [agent-skills](https://github.com/addyosmani/agent-skills) | Addy Osmani | MIT |
| [claude-skills](https://github.com/mastepanoski/claude-skills) | mastepanoski | MIT |
| [secpriv-skill](https://github.com/facebookresearch/secpriv-skill) | Meta Platforms | MIT |
| [claude-skills-marketplace](https://github.com/mhattingpete/claude-skills-marketplace) | mhattingpete | Apache-2.0 |
| [claude-remotion-skill](https://github.com/haidrrrry/claude-remotion-skill) | haidrrrry | MIT |
| [iart-ai skill packs](https://github.com/iart-ai/motion-skills) (explainer, TikTok, YouTube, b-roll) | iart.ai | MIT |
| [ai-video-editing-skill](https://github.com/znyupup/ai-video-editing-skill) | nyx研究所 (znyupup) | MIT |

The MIT licence in this repository covers the Harness port (`index.js`, `tools/`, `addenda/`, `local-skills/`, `sources.json`, `descriptions.json`), not the skill text, which keeps each author's licence (see [NOTICE.md](NOTICE.md) and `licenses/`).
