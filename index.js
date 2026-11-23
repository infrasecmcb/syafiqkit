// syafiqkit for DeepSeek Harness: serves a curated set of agent skills (syafiqkit plus
// vetted skills from other open-source authors) through ctx.skills, and optionally adds
// syafiqkit's output-style ruleset to the system prompt.
import { readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const name = 'syafiqkit';
export const inject = { skills: { required: true }, systemPrompt: { required: false } };

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PROVIDER = 'syafiqkit';
const RANK = 650; // after local and bundled skills, so a user's own same-name skill wins
const DESCRIPTION_MAX = 480; // the catalog shows at most 500 characters per skill

// Prepended to every loaded skill so Claude Code wording maps onto this Harness.
const PREAMBLE = `<harness-note>
This skill was written for Claude Code and other agents and ported to DeepSeek Harness. Translate as you follow it:
- "Agent"/"Task" tool, subagent_type, Explore, general-purpose or reviewer agents: use \`subagent\` (or \`subagent_fork\` when the child needs this conversation). Put the role brief in the prompt; role briefs are in {{AGENTS}}
- model "haiku" or "sonnet" for agents: omit it and use the child default.
- AskUserQuestion: \`ask_user_question\`. TodoWrite: \`todo_write\`. ExitPlanMode: \`exit_plan_mode\` when available.
- Bash: the shell tool you have (pwsh on Windows); WebFetch/WebSearch: \`web_fetch\`/\`web_search\` when available.
- Read/Write/Edit/Glob/Grep: \`read\`, \`write\`, \`edit\`, \`glob\`, \`grep\`.
- Another skill named like "superpowers:test-driven-development" or "agent-skills:x": load that skill with the \`skill\` tool using the part after the colon.
- \${CLAUDE_SKILL_DIR} = this skill's directory: {{SKILL_DIR}}; \${CLAUDE_PLUGIN_ROOT} = {{ROOT}}; a relative path such as "../../references/x.md" or "../other-skill/SKILL.md" resolves from {{SKILL_DIR}} (shared references live in {{ROOT}}\\references and {{ROOT}}\\skills\\_shared).
- Slash commands like /build, /review, /ship or /syafiqkit:*: not available here; do the step yourself.
- CLAUDE.md files: treat AGENTS.md as the project's instruction file; read or update CLAUDE.md only where the project already has one.
- \`claude -p\`, \`claude plugin ...\`, the syafiqkit band or /sk menu: not available here. Do the step yourself or skip it and say so.
- A step that says to dispatch to haiku, load Skill(haiku) or run "syafiqkit:haiku": load the \`delegate-and-verify\` skill instead and follow it; there is no haiku tier here.
- Skills named update-plugin, agent-setup, self-organize-agent-memory or claude-server-token are not in this bundle (skill-creator is write-a-skill; headless-watch is schedule-checks). When a step says to run one that is missing, do that step yourself in the simplest way that works, or skip it and say so.
- Tools or software a skill needs (ffmpeg, Remotion, whisper, Node, pip packages): check they exist first and tell the user what is missing before installing anything.
</harness-note>

`;

function loadManifest() {
  return JSON.parse(readFileSync(path.join(ROOT, 'skills.json'), 'utf8'));
}

export function shorten(text) {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= DESCRIPTION_MAX) return t;
  const cut = t.slice(0, DESCRIPTION_MAX);
  const end = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('; '));
  return end > DESCRIPTION_MAX * 0.5 ? cut.slice(0, end + 1) : cut.replace(/\s+\S*$/, '') + '…';
}

export function createProvider(options = {}) {
  const manifest = options.manifest ?? loadManifest();
  const exclude = new Set(options.exclude ?? manifest.defaultExclude ?? []);
  const entries = manifest.skills.filter((s) => !exclude.has(s.name));
  const sourceOf = new Map(entries.map((s) => [s.name, s.source]));
  const candidates = entries.map((s) => {
    const dir = path.join(ROOT, 'skills', s.dir);
    return {
      name: s.name,
      description: shorten(s.description),
      invocation: { modelInvocable: s.modelInvocable !== false, userInvocable: true },
      provider: PROVIDER,
      source: 'bundled',
      rank: RANK,
      resourceBase: { kind: 'directory', path: dir },
      locator: path.join(dir, 'SKILL.md'),
      path: path.join(dir, 'SKILL.md'),
    };
  });
  return {
    name: PROVIDER,
    list: () => Promise.resolve(candidates),
    async get(candidate) {
      const c = candidates.find((x) => x.name === candidate.name);
      if (!c) return undefined;
      const raw = (await readFile(c.locator, 'utf8')).replace(/^\uFEFF/, '');
      const body = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
      const note = PREAMBLE
        .replaceAll('{{SKILL_DIR}}', c.resourceBase.path)
        .replaceAll('{{ROOT}}', ROOT)
        .replaceAll('{{AGENTS}}', path.join(ROOT, 'agents'));
      let addendum = '';
      try { addendum += readFileSync(path.join(ROOT, 'addenda', `_${sourceOf.get(c.name)}.md`), 'utf8').replace(/^\uFEFF/, '').replaceAll('{{ROOT}}', ROOT); } catch { /* no source-level note */ }
      try { addendum += readFileSync(path.join(ROOT, 'addenda', `${c.name}.md`), 'utf8').replace(/^\uFEFF/, '').replaceAll('{{ROOT}}', ROOT); } catch { /* most skills have none */ }
      return {
        name: c.name,
        description: c.description,
        invocation: c.invocation,
        provider: c.provider,
        source: c.source,
        resourceBase: c.resourceBase,
        content: note + addendum + body,
      };
    },
  };
}

export function apply(ctx, config = {}) {
  // `exclude` replaces the default list; set `exclude: []` to turn every skill on.
  const provider = createProvider({ exclude: config.exclude });
  ctx.effect(() => ctx.skills.registerProvider(() => provider), 'syafiqkit.skills');

  if (config.outputStyle && ctx.systemPrompt) {
    const ruleset = readFileSync(path.join(ROOT, 'RULESET.md'), 'utf8');
    ctx.effect(() => ctx.systemPrompt.section({
      name: 'syafiqkit:output-style',
      order: ctx.systemPrompt.getSectionOrder('DEPLOYMENT_PERSONA_SUFFIX') - 1,
      text: ruleset,
    }), 'syafiqkit.outputStyle');
  }
}
