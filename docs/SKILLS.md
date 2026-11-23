# Skill catalog

104 skills, 100 on by default. Generated from `skills.json` by `node tools/docs.mjs`; do not edit by hand.
Skills marked **off** are hidden until you set `exclude: []` in the plugin config.

## Plan and build

Decide what to build, plan it, build it in small checked steps.

| Skill | What it does | From |
|---|---|---|
| `brainstorming` | Explore intent and requirements before building: new features where what to build is still open, or architecture changes. Use for 'how should we build X'. | syafiqkit |
| `spec-driven-development` | Write a spec before coding when starting a project, feature or significant change that has none. | Osmani |
| `writing-plans` | Turn a spec or requirements into a detailed step-by-step implementation plan before touching code. | superpowers |
| `executing-plans` | Carry out a written implementation plan in this session, task by task, with checks and review points. | superpowers |
| `subagent-driven-development` | Execute a written plan by dispatching a fresh subagent per task with review after each. Needs bash (Git Bash on Windows) for its helper scripts. | superpowers |
| `dispatching-parallel-agents` | Split 2+ independent tasks across parallel subagents, one per problem domain, then integrate the results. | superpowers |
| `delegate-and-verify` | Hand bulk, parallel or mechanical work (30+ files, rows or reports, multi-pass rewrites) to subagents, then verify the results before reporting. Use wherever a skill says to dispatch to haiku. | this repo |
| `schedule-checks` | Run a check on a repeating schedule (CI, a page, a file, a sheet) and be told only when something needs you, using Harness scheduled tasks. | this repo |
| `write-a-skill` | Write or improve a Harness skill (SKILL.md): where it goes, a description that triggers, a short body, and how to test it. | this repo |
| `plan-worklist` | Turn an already-scoped list of work items into a sized, sequenced build plan before any code is written. | syafiqkit |
| `tackle` | Continue a doc with several open items: read it, judge what is buildable, then build it. | syafiqkit |
| `test-driven-development` | Write the failing test first, then the minimal code, then refactor. Use before implementing any feature or bugfix. | superpowers |
| `systematic-debugging` | Find the root cause before fixing: reproduce, trace, test one hypothesis at a time. Use for any bug, test failure or odd behaviour. | superpowers |
| `verification-before-completion` | Run the real checks and read their output before claiming work is done, fixed or passing. | superpowers |
| `api-and-interface-design` | Design stable APIs and module boundaries: contracts, error shapes, versioning, backward compatibility. | Osmani |
| `code-simplification` | Simplify code for clarity without changing behaviour. Use when code works but is hard to read. | Osmani |
| `performance-optimization` | Measure first, then fix the real bottleneck across frontend, backend, queries and databases. | Osmani |
| `function-parameter-limits` | Apply the 0/2/3+ parameter-count rule: advise wrapping arguments in an object and set up a lint rule. | syafiqkit |
| `extract-shared-package` | Extract a module shared by several apps into a Composer or npm package: boundary, hosting, versioning, CI, rollout. | syafiqkit |
| `setup-playwright` | Set up or harden a Playwright E2E suite: config, auth, seeded fixtures, parallel-safe data, flaky-test fixes. | syafiqkit |

## Review, git and shipping

Review changes, commit, wrap up and release.

| Skill | What it does | From |
|---|---|---|
| `requesting-code-review` | Ask a reviewer subagent to check finished work against the requirements before merging. | superpowers |
| `receiving-code-review` | Handle review feedback with rigour: verify it, clarify unclear items, push back when it is wrong instead of agreeing. | superpowers |
| `code-review-and-quality` | Five-axis code review (correctness, readability, architecture, security, performance) before merging a change or PR. | Osmani |
| `using-git-worktrees` | Create an isolated git worktree before starting feature work or executing a plan, so the main checkout stays clean. | superpowers |
| `finishing-a-development-branch` | When implementation is done and tests pass, decide how to integrate: merge, pull request, keep or discard the branch. | superpowers |
| `git-workflow-and-versioning` | Git practice for any change: small commits, branching, resolving conflicts, versioning. | Osmani |
| `commit` | Create conventional git commits from staged changes (single or multi-repo). Add 'push' to push too; a plain commit never pushes. | syafiqkit |
| `done` | Post-task wrap-up: simplify code, review changes, design-review changed screens, update docs, capture lessons. Use when finished or the user says 'done'. | syafiqkit |
| `quick-done` | Cheap wrap-up for a small session: capture lessons and update one task doc, no review. | syafiqkit |
| `ship` | Ship to production: commit, changelog, push, verify CI/CD, release note, close tracker cards. Run after done. | syafiqkit |
| `shipping-and-launch` | Pre-launch checklist for production: tests, security, performance, accessibility, rollout and rollback. | Osmani |
| `score-loop` | Score work against a fixed rubric, fix the gaps, re-score with an independent reviewer, repeat until the target is met. | syafiqkit |
| `judgement` | Decide whether a mid-task finding is yours to fix, worth a question, or out of scope; measure who it affects first. | syafiqkit |
| `ci-ssh-deploy-timeout` | Diagnose CI deploys that intermittently fail with SSH timeouts or connection refused, before touching firewall rules; applies a connect-only retry fix. | syafiqkit |

## Security and privacy

Find and fix vulnerabilities, including in AI features.

| Skill | What it does | From |
|---|---|---|
| `security-and-hardening` | Harden code against vulnerabilities: threat model, input handling, auth, secrets, dependencies, OWASP Top Ten. | Osmani |
| `secpriv-code-review` | Single-pass code review for security weaknesses (CWE) and privacy violations (GDPR), precision first. From Meta. | Meta |
| `owasp-llm-top10` | Security audit of LLM apps against the OWASP Top 10 for LLM Applications: prompt injection, data leakage, excessive agency. | mastepanoski |
| `owasp-ai-testing` | AI trustworthiness testing with the OWASP AI Testing Guide: test cases across application, model, infrastructure and data layers. | mastepanoski |
| `patch-advisory` | Respond to a security advisory: find affected hosts and containers, judge exposure, patch or mitigate, verify, report. | syafiqkit |

## UI, UX and accessibility

Design judgement, audits and building accessible interfaces.

| Skill | What it does | From |
|---|---|---|
| `uiux` | Design judgement for UI/UX at any scope: polish, redesign, critique, research, go-live check. Measures real renders at several widths. | syafiqkit |
| `impeccable` | Design director toolkit for any frontend: shape, critique, audit, polish, bolder, quieter, animate, harden. Say "impeccable polish" or "impeccable audit". Original author's Harness build. | Paul Bakaus |
| `taste` | Build or redesign a landing page, company or product site so it looks designed, not templated: layout, type, palette, licensed stand-in photos, copy checks, browser finish gate. Needs Node 22+ and Edge or Chrome. | Leonxlnx |
| `design-handoff` | Write a brief for someone else to design a screen (external designer, contractor): purpose, audience, rules, measured failures, no design decisions. | syafiqkit |
| `frontend-ui-engineering` | Build production-quality, accessible, responsive user interfaces and components. | Osmani |
| `ui-design-review` | Visual design review: typography, colour, spacing, hierarchy and consistency. | mastepanoski |
| `nielsen-heuristics-audit` | Usability audit of a screen or flow against Nielsen's 10 heuristics, with severity-rated findings. | mastepanoski |
| `cognitive-walkthrough` | Step through a task as a first-time user to find where people would get lost or stuck. | mastepanoski |
| `ux-audit-rethink` | Holistic UX audit using usability factors and interaction dimensions, ending in prioritised recommendations. | mastepanoski |
| `wcag-accessibility-audit` | Accessibility audit against WCAG 2.1/2.2 (perceivable, operable, understandable, robust) with fixes. | mastepanoski |
| `accessibility-engineering` | Audit existing interfaces for WCAG 2.2 AA conformance and fix the violations found. | Osmani |
| `product-still` | Make a designed still image from a product's real screens: how-it-works steps, feature or hero images, social cards. | syafiqkit |

## Animation and interaction

Emil Kowalski's motion and interaction skills.

| Skill | What it does | From |
|---|---|---|
| `emil-animate` | Build an animation from scratch in the right order: whether to animate, purpose, properties, easing, duration, interruption, exit. Writes the code. | syafiqkit |
| `emil-choreograph` | Coordinate several elements animating together (stagger, entrances, view swaps) so the group reads as one motion. | syafiqkit |
| `emil-design-eng` | Emil Kowalski's design-engineering philosophy for UI polish: press and hover states, popovers, transitions, invisible details. | syafiqkit |
| `emil-gestures` | Build drag, swipe and sheet interactions that track the finger and stay interruptible (drawers, swipe-to-dismiss, reorder). | syafiqkit |
| `emil-mobile-native` | Make a web app feel native on a phone: tap highlights, 100vh bug, input zoom, notch, pull-to-refresh, status bar. | syafiqkit |
| `emil-remove-animations` | Find and remove animations an interface doesn't need (keyboard actions, high-frequency surfaces, decoration). Subtracts only. | syafiqkit |
| `emil-review-animations` | Review animation code against a high craft bar: weak easing, wrong origin, layout animation, missing reduced-motion. | syafiqkit |
| `emil-pick-ui-library` | Pick a UI component library for a project. Invoke only on request. | syafiqkit |

## Documentation and writing

Docs for code, projects and readers; document conversion.

| Skill | What it does | From |
|---|---|---|
| `documentation-and-adrs` | Record architecture decisions (ADRs), update docs when APIs change, and detect docs that drifted from the code. | Osmani |
| `codebase-documenter` | Write documentation of how a codebase works: architecture, key components, data flow, onboarding. | mhattingpete |
| `technical-doc-creator` | Create HTML technical documentation with code blocks, API workflows, architecture diagrams and syntax highlighting. | mhattingpete |
| `setup-project-docs` | Establish a project's core docs: PRD, ARCHITECTURE, ARCHITECTURE-ESSENTIALS and AGENTS.md/CLAUDE.md. | syafiqkit |
| `task-summary` | Create or update task summary docs (current.md plus decisions files): paths, templates, cross-references, Quick Start. | syafiqkit |
| `write-summary` | Alias of task-summary: create task documentation when starting new feature work. | syafiqkit |
| `update-summary` | Alias of task-summary: update a task summary with session findings, creating the doc if missing. | syafiqkit |
| `read-summary` | Read the task docs and project instructions for a domain before answering or building, so recorded decisions and gotchas are not missed. | syafiqkit |
| `continue-session` | Produce a copy-paste prompt that starts a fresh session where this one stopped (doc path, next goal, uncommitted state). | syafiqkit |
| `notes-summary` | Create, update or read a personal session journal of non-code conversations and decisions. | syafiqkit |
| `user-manual` | Write an end-user manual: scope, tutorials, screenshots, Word or PDF editions, or an in-app help centre. | syafiqkit |
| `understanding-guide` | Turn long reports or specs into an offline question-and-answer page, every claim checked against its source. | syafiqkit |
| `explainer-deck` | Build a slide deck (Google Slides or pptx) explaining how a system or document works, each mechanism drawn with a worked example. | syafiqkit |
| `excalidraw-board` | Turn a task doc, backlog or open questions into a black-and-white Excalidraw discussion board, or read back an edited board. | syafiqkit |
| `doc-to-md` | Convert a Word, PDF or Excel file to Markdown so it can be read, searched and diffed in git. | syafiqkit |
| `md-to-pdf` | Convert Markdown to a PDF with rendered Mermaid diagrams and charts. | syafiqkit |
| `docx-red-edits` | Edit someone else's Word file with every change shown in red (deletions struck through), keeping their formatting intact. | syafiqkit |
| `condense-task-doc` | Shrink a bloated task doc (current.md) in place: collapse narratives into tables, drop duplicates, split oversized docs. | syafiqkit |
| `condense-claude-md` | Shrink a bloated CLAUDE.md or similar instruction file in place by cutting verbose, redundant and discoverable content. | syafiqkit |
| `merge-task-docs` | Find overlapping task docs in a domain, merge them, delete the sources and fix back-references. | syafiqkit |
| `sweep-doc-overlaps` | Scan all task-doc domains for cross-domain overlaps and hand confirmed groups to merge-task-docs. | syafiqkit |
| `update-claude-docs` | Create, rewrite or capture lessons into CLAUDE.md files following a best-practice layout. | syafiqkit |
| `refresh-instructions` | Three-pass refresh of any living doc (restructure, condense, unhobble), each pass verified before the next. | syafiqkit |
| `unhobble-instructions` | Rewrite an instruction file (skill, agent, CLAUDE.md, command) to separate real constraints from over-strict rules. | syafiqkit |

## Video

Motion graphics, captions, explainers and editing. Need extra software (see README).

| Skill | What it does | From |
|---|---|---|
| `remotion-motion-graphics` | Create and edit motion-graphics videos with Remotion (React): intros, promos, captions, animated text. Needs Node. | haidrrrry |
| `explainer-video` | Make a 30-90 second animated explainer: script, storyboard, scenes, narration and captions. Remotion-based. | iart.ai |
| `caption-animation` | Animated word-by-word captions from a transcript or SRT, burned into video. Remotion-based. | iart.ai |
| `short-form-video` | Make Reels, TikTok or Shorts: hook, pacing, retention, loops and 9:16 safe areas. | iart.ai |
| `audiogram` | Turn podcast or voice audio into a waveform video clip for social media. | iart.ai |
| `youtube-intro-outro` | Design a YouTube channel intro, logo sting or end card as a reusable template. | iart.ai |
| `talking-head-b-roll` | Add motion-graphics b-roll to a talking-head video from its transcript. Needs ffmpeg and Node. | iart.ai |
| `vlog-auto-edit` | Automatically edit raw travel or daily footage into a finished vlog using ffmpeg, speech transcription and a vision model. | znyupup |
| `motion-clip` | Make a short designed product or brand video (launch clip, promo, app preview) written as code and rendered to MP4 in several sizes. | syafiqkit |

## Client and personal workflow

Skills from syafiqkit's own working life; several are off by default.

| Skill | What it does | From |
|---|---|---|
| `casual-message` **off** | Write a short casual message in the sender's own voice (WhatsApp reply, DM) in a copyable block. | syafiqkit |
| `gchat-format` **off** | Convert Markdown to Google Chat formatting for messages, release notes or documents. | syafiqkit |
| `commit-invoice-generator` **off** | Turn git commit history into billable invoice line items with estimated hours. | syafiqkit |
| `pull-db` **off** | Pull a remote MySQL/MariaDB database to local dev, or an allowlist copy without personal data. | syafiqkit |
| `setup-tools` | Set up syafiqkit's Google Sheets, Chat, Gmail and remote-SSH tools on this machine. | syafiqkit |
| `setup-tracker` | Set up or restructure a shared Google Sheets tracker for client asks, issues and who owes what. | syafiqkit |
| `watch-sheets` | Watch shared Google Sheets (client tracker, UAT) on a schedule and alert only when something needs your reply. | syafiqkit |
| `uat-script` | Build a client UAT script: test scenarios per role as CSV, rendered to an Excel workbook with status dropdown and summary. | syafiqkit |
| `reverse-engineer` | Study a web app the client already uses and rebuild its mechanism in your own app, with a reviewed write-up before design. | syafiqkit |
| `sign-pdf` | Sign, initial and date a PDF form with your own signature image and return a checked signed copy. | syafiqkit |
| `hobby-review` | Socratic debrief of a finished anime, book or game against the taste rubric in the matching current.md. | syafiqkit |
| `posthog-replay-frames` | Find what one user actually did and saw in a PostHog session, from raw events and replay screenshots. | syafiqkit |

