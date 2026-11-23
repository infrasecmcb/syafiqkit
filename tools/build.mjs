// Rebuild the bundle's skills/ from a syafiqkit checkout.
// Usage: node tools/build.mjs <path-to-syafiqkit-checkout>
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const bundle = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.resolve(process.argv[2] || path.join(bundle, '..', '.port', 'syafiqkit'));
if (!fs.existsSync(path.join(src, 'skills'))) throw new Error(`no skills/ in ${src}`);

// Skills that cannot work outside Claude Code, are macOS-only, or download large binaries.
const SKIP = {
  taste: 'needs Claude Code skill hooks and a 35 MB toolchain',
  impeccable: 'downloads a native binary on first use',
  'claude-server-token': 'manages Claude Code server tokens',
  'update-plugin': 'patches the Claude Code plugin itself',
  'skill-creator': 'registers skills in Claude Code',
  'headless-watch': 'runs `claude -p` on a schedule',
  haiku: 'drives Claude haiku agents',
  'self-organize-agent-memory': 'Claude Code agent-memory files',
  'agent-setup': 'writes Claude Code .claude/agents definitions',
  'reclaim-disk': 'macOS only',
};

function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return null;
  const lines = m[1].split(/\r?\n/);
  const out = {};
  for (let i = 0; i < lines.length; i++) {
    const kv = lines[i].match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (!kv) continue;
    let [, key, val] = kv;
    if (/^[>|][-+]?\s*$/.test(val)) {
      const folded = val.startsWith('>');
      const block = [];
      while (i + 1 < lines.length && (/^\s+\S/.test(lines[i + 1]) || lines[i + 1].trim() === '')) block.push(lines[++i].trim());
      val = folded ? block.join(' ').replace(/\s+/g, ' ').trim() : block.join('\n').trim();
    } else if (/^(["']).*\1$/.test(val)) {
      val = val.slice(1, -1).replace(/\\"/g, '"');
    }
    out[key] = val;
  }
  return { data: out, body: text.slice(m[0].length) };
}

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === '.DS_Store') continue;
    const a = path.join(from, e.name), b = path.join(to, e.name);
    if (e.isDirectory()) copyDir(a, b);
    else if (e.isFile()) fs.copyFileSync(a, b);
  }
}

const outSkills = path.join(bundle, 'skills');
fs.rmSync(outSkills, { recursive: true, force: true });
fs.mkdirSync(outSkills, { recursive: true });

const manifest = [];
const skipped = [];
for (const e of fs.readdirSync(path.join(src, 'skills'), { withFileTypes: true })) {
  if (!e.isDirectory()) continue;
  const dir = path.join(src, 'skills', e.name);
  if (e.name.startsWith('_')) { copyDir(dir, path.join(outSkills, e.name)); continue; } // shared references
  if (SKIP[e.name]) { skipped.push({ name: e.name, reason: SKIP[e.name] }); continue; }
  const file = path.join(dir, 'SKILL.md');
  if (!fs.existsSync(file)) continue;
  const fm = parseFrontmatter(fs.readFileSync(file, 'utf8'));
  if (!fm || !fm.data.name || !fm.data.description) { skipped.push({ name: e.name, reason: 'bad frontmatter' }); continue; }
  const name = fm.data.name.trim();
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) { skipped.push({ name, reason: 'invalid name' }); continue; }
  copyDir(dir, path.join(outSkills, e.name));
  manifest.push({
    name,
    dir: e.name,
    description: fm.data.description,
    modelInvocable: !/^(true|yes|on|1)$/i.test(fm.data['disable-model-invocation'] || ''),
  });
}

// Agent role definitions used by skills that dispatch named agents.
const agentsSrc = path.join(src, '.claude', 'agents');
const agentsOut = path.join(bundle, 'agents');
fs.rmSync(agentsOut, { recursive: true, force: true });
if (fs.existsSync(agentsSrc)) copyDir(agentsSrc, agentsOut);

fs.copyFileSync(path.join(src, 'hooks', 'RULESET.md'), path.join(bundle, 'RULESET.md'));

let commit = 'unknown';
try {
  const head = fs.readFileSync(path.join(src, '.git', 'HEAD'), 'utf8').trim();
  commit = head.startsWith('ref:') ? fs.readFileSync(path.join(src, '.git', head.slice(5).trim()), 'utf8').trim() : head;
} catch { /* not a git checkout */ }
const version = JSON.parse(fs.readFileSync(path.join(src, '.claude-plugin', 'plugin.json'), 'utf8')).version;

manifest.sort((a, b) => a.name.localeCompare(b.name));
fs.writeFileSync(path.join(bundle, 'skills.json'), JSON.stringify({ upstream: { version, commit }, skills: manifest, skipped }, null, 2) + '\n');
console.log(`syafiqkit ${version} (${commit.slice(0, 7)}): ${manifest.length} skills, ${skipped.length} skipped`);
for (const s of skipped) console.log(`  skipped ${s.name}: ${s.reason}`);
