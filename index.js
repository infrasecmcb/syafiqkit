// syafiqkit for DeepSeek Harness: serves the ported syafiqkit skills through
// ctx.skills and optionally adds the ADHD output-style ruleset to the prompt.
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
This skill was written for Claude Code and ported to DeepSeek Harness. Translate as you follow it:
- "Agent"/"Task" tool, subagent_type, Explore, general-purpose agents: use \`subagent\` (or \`subagent_fork\` when the child needs this conversation). Put the role brief in the prompt; a named role's brief is in the bundle's agents folder: {{AGENTS}}
- model "haiku" or "sonnet" for agents: omit it and use the child default.
- AskUserQuestion: \`ask_user_question\`. TodoWrite: \`todo_write\`. ExitPlanMode: \`exit_plan_mode\` when available.
- Bash: the shell tool you have (pwsh on Windows); WebFetch/WebSearch: \`web_fetch\`/\`web_search\` when available.
- Read/Write/Edit/Glob/Grep: \`read\`, \`write\`, \`edit\`, \`glob\`, \`grep\`.
- \${CLAUDE_SKILL_DIR} = this skill's directory: {{SKILL_DIR}}; \${CLAUDE_PLUGIN_ROOT} = {{ROOT}}; "../../_shared/..." resolves from {{SKILL_DIR}}.
- CLAUDE.md files: treat AGENTS.md as the project's instruction file; read or update CLAUDE.md only where the project already has one.
- \`claude -p\`, \`claude plugin ...\`, /syafiqkit:* slash commands, the syafiqkit band or /sk menu: not available here. Do the step yourself or skip it and say so.
</harness-note>

`;

function loadManifest() {
  return JSON.parse(readFileSync(path.join(ROOT, 'skills.json'), 'utf8'));
}

function shorten(text) {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= DESCRIPTION_MAX) return t;
  const cut = t.slice(0, DESCRIPTION_MAX);
  const end = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('; '));
  return (end > DESCRIPTION_MAX * 0.5 ? cut.slice(0, end + 1) : cut.replace(/\s+\S*$/, '') + '…');
}

export function createProvider(options = {}) {
  const manifest = options.manifest ?? loadManifest();
  const exclude = new Set(options.exclude ?? []);
  const entries = manifest.skills.filter((s) => !exclude.has(s.name));
  const toCandidate = (s) => {
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
  };
  const candidates = entries.map(toCandidate);
  return {
    name: PROVIDER,
    list: () => Promise.resolve(candidates),
    async get(candidate) {
      const c = candidates.find((x) => x.name === candidate.name);
      if (!c) return undefined;
      const raw = await readFile(c.locator, 'utf8');
      const body = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
      const note = PREAMBLE
        .replaceAll('{{SKILL_DIR}}', c.resourceBase.path)
        .replaceAll('{{ROOT}}', ROOT)
        .replaceAll('{{AGENTS}}', path.join(ROOT, 'agents'));
      return {
        name: c.name,
        description: c.description,
        invocation: c.invocation,
        provider: c.provider,
        source: c.source,
        resourceBase: c.resourceBase,
        content: note + body,
      };
    },
  };
}

export function apply(ctx, config = {}) {
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
