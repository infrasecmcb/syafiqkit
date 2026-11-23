<harness-addendum skill="impeccable">
Harness overrides.

- **Skill folder.** This skill's folder is `{{ROOT}}\skills\impeccable`. Wherever the text says `.dsh/skills/impeccable/scripts/impeccable <verb>` or `<skill-base-dir>/scripts/impeccable <verb>`, run `{{ROOT}}\skills\impeccable\scripts\impeccable.cmd <verb>` from the user's project folder (cwd = the project, not the skill). The launcher is a Windows batch file; on macOS or Linux use the `impeccable` script beside it.
- **First run downloads a program (23 MB).** Before the first launcher call in a project, tell the user: "impeccable will download its helper program from github.com/pbakaus/impeccable (checked against a fingerprint the skill ships, and refused if it does not match)". Ask before running it. The fingerprint for `impeccable-windows-x64.exe` 0.1.27 was verified when this bundle was built. If the download fails or the user declines, follow the skill's own "Launcher unavailable" path: read PRODUCT.md and DESIGN.md directly and carry on without the engine.
- **Other tools.** `live` mode and screenshots need Node and Edge or Chrome. The `uiux` skill has `check-render.mjs` for measured checks and works without the helper program; use both when the user asked for all design skills.
- **Slash commands.** `/impeccable polish` and the other sub-commands mean: the user wants that sub-command; they are not slash commands in Harness. Pin and Unpin create shortcuts only in tools that support them; say it is unavailable here and skip.
</harness-addendum>
