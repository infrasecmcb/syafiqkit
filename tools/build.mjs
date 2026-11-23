// Rebuild the bundle's skills/ from the upstream checkouts listed in sources.json.
// Usage: node tools/build.mjs [upstream-dir]     (default: ./.upstream, one folder per source)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const bundle = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const upstream = path.resolve(process.argv[2] || path.join(bundle, '.upstream'));
const config = JSON.parse(fs.readFileSync(path.join(bundle, 'sources.json'), 'utf8'));
const overrides = JSON.parse(fs.readFileSync(path.join(bundle, 'descriptions.json'), 'utf8'));
const NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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
      const block = [];
      while (i + 1 < lines.length && (/^\s+\S/.test(lines[i + 1]) || lines[i + 1].trim() === '')) block.push(lines[++i].trim());
      val = val.startsWith('>') ? block.join(' ').replace(/\s+/g, ' ').trim() : block.join('\n').trim();
    } else if (/^(["']).*\1$/.test(val)) {
      val = val.slice(1, -1).replace(/\\"/g, '"');
    }
    out[key] = val;
  }
  return { data: out, body: text.slice(m[0].length) };
}

// `filter` applies to the top level only; everything inside an included folder is copied.
function copyDir(from, to, filter = () => true) {
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    if (['node_modules', '.git', '.DS_Store'].includes(e.name) || !filter(e)) continue;
    const a = path.join(from, e.name), b = path.join(to, e.name);
    if (e.isDirectory()) copyDir(a, b);
    else if (e.isFile()) fs.copyFileSync(a, b);
  }
}

function headOf(dir) {
  try {
    const head = fs.readFileSync(path.join(dir, '.git', 'HEAD'), 'utf8').trim();
    return head.startsWith('ref:') ? fs.readFileSync(path.join(dir, '.git', head.slice(5).trim()), 'utf8').trim() : head;
  } catch { return 'unknown'; }
}

for (const d of ['skills', 'agents', 'references', 'licenses']) fs.rmSync(path.join(bundle, d), { recursive: true, force: true });
fs.mkdirSync(path.join(bundle, 'skills'), { recursive: true });
fs.mkdirSync(path.join(bundle, 'licenses'), { recursive: true });

const manifest = [], skipped = [], used = new Map(), problems = [], sourceInfo = [];
for (const s of config.sources) for (const [n, reason] of Object.entries(s.notIncluded || {})) skipped.push({ name: n, source: s.id, reason });

function addSkill(source, name, srcDir, extra = {}) {
  if (!NAME.test(name)) { skipped.push({ name, source: source.id, reason: 'invalid name' }); return; }
  if (used.has(name)) { problems.push(`duplicate skill name "${name}" (${used.get(name)} and ${source.id})`); return; }
  const target = path.join(bundle, 'skills', name);
  const include = extra.include;
  copyDir(srcDir, target, include && srcDir === extra.root ? (e) => include.includes(e.name) : () => true);
  const file = path.join(target, 'SKILL.md');
  const raw = fs.readFileSync(file, 'utf8');
  const fm = parseFrontmatter(raw);
  const description = overrides[name] || fm?.data.description;
  if (!description) { problems.push(`${source.id}/${name}: no description (add one to descriptions.json)`); return; }
  if (!overrides[name]) problems.push(`${source.id}/${name}: no entry in descriptions.json (using upstream text)`);
  if (!fm) fs.writeFileSync(file, `---\nname: ${name}\ndescription: ${JSON.stringify(description)}\n---\n\n${raw}`);
  used.set(name, source.id);
  manifest.push({
    name, dir: name, source: source.id, description,
    modelInvocable: !/^(true|yes|on|1)$/i.test(fm?.data['disable-model-invocation'] || ''),
  });
}

for (const source of config.sources) {
  const root = path.join(upstream, source.dir);
  if (!fs.existsSync(root)) { problems.push(`missing upstream checkout: ${root}`); continue; }
  const skillsRoot = source.skillsDir ? path.join(root, source.skillsDir) : null;
  const before = manifest.length;

  if (source.all) {
    for (const e of fs.readdirSync(skillsRoot, { withFileTypes: true })) {
      if (!e.isDirectory()) continue;
      const dir = path.join(skillsRoot, e.name);
      if (e.name.startsWith('_')) { copyDir(dir, path.join(bundle, 'skills', e.name)); continue; } // shared references
      if (source.skip?.[e.name]) { skipped.push({ name: e.name, source: source.id, reason: source.skip[e.name] }); continue; }
      if (!fs.existsSync(path.join(dir, 'SKILL.md'))) continue;
      const fm = parseFrontmatter(fs.readFileSync(path.join(dir, 'SKILL.md'), 'utf8'));
      addSkill(source, (fm?.data.name || e.name).trim(), dir);
    }
  } else {
    for (const s of source.skills) {
      const spec = typeof s === 'string' ? { name: s, path: path.posix.join(source.skillsDir, s) } : s;
      const dir = spec.root ? root : path.join(root, spec.path);
      if (!fs.existsSync(path.join(dir, 'SKILL.md'))) { problems.push(`${source.id}: ${spec.name} not found at ${dir}`); continue; }
      addSkill(source, spec.name, dir, spec.root ? { include: spec.include, root: dir } : {});
    }
  }
  for (const c of source.copy || []) {
    const from = path.join(root, c.from), to = path.join(bundle, c.to);
    if (!fs.existsSync(from)) { problems.push(`${source.id}: copy source missing ${c.from}`); continue; }
    if (fs.statSync(from).isDirectory()) copyDir(from, to); else { fs.mkdirSync(path.dirname(to), { recursive: true }); fs.copyFileSync(from, to); }
  }
  if (source.licenseFile && fs.existsSync(path.join(root, source.licenseFile))) {
    fs.copyFileSync(path.join(root, source.licenseFile), path.join(bundle, 'licenses', `${source.id}-${path.basename(source.licenseFile)}`));
  }
  sourceInfo.push({ ...source, commit: headOf(root), count: manifest.length - before });
}

manifest.sort((a, b) => a.name.localeCompare(b.name));
const stale = Object.keys(overrides).filter((k) => !used.has(k));
if (stale.length) problems.push(`descriptions.json has entries for skills that are not built: ${stale.join(', ')}`);

fs.writeFileSync(path.join(bundle, 'skills.json'), JSON.stringify({
  sources: sourceInfo.map((s) => ({ id: s.id, repo: s.repo, commit: s.commit, license: s.license, skills: s.count })),
  defaultExclude: config.defaultExclude || [],
  skills: manifest,
  skipped,
}, null, 2) + '\n');

const rows = sourceInfo.map((s) => `| ${s.id} | ${s.repo} | ${s.commit.slice(0, 7)} | ${s.license} | ${s.copyright} | ${s.count} |`).join('\n');
fs.writeFileSync(path.join(bundle, 'NOTICE.md'), `# Notice

This bundle redistributes skills written by other people. Each skill keeps its author's licence
(text in \`licenses/\`). The MIT licence of this repository covers only the Harness port
(\`index.js\`, \`tools/\`, \`sources.json\`, \`descriptions.json\`), not the skill text.

| Source | Repository | Commit | Licence | Copyright | Skills |
|---|---|---|---|---|---|
${rows}

syafiqkit declares no licence upstream; its skills are included with the author's permission.
Vendored skills inside syafiqkit (\`emil-*\`) keep their own MIT licences, shipped in each skill folder.

Rebuild from fresh checkouts with \`node tools/build.mjs\`, then \`node tools/test.mjs\`.
`);

console.log(`${manifest.length} skills from ${sourceInfo.length} sources, ${skipped.length} skipped`);
for (const s of sourceInfo) console.log(`  ${s.id.padEnd(28)} ${String(s.count).padStart(3)}  ${s.commit.slice(0, 7)}  ${s.license}`);
for (const s of skipped) console.log(`  skipped ${s.name} (${s.source}): ${s.reason}`);
const hard = problems.filter((p) => !p.includes('no entry in descriptions.json'));
for (const p of problems) console.log(`  ${hard.includes(p) ? 'PROBLEM' : 'note'}: ${p}`);
if (hard.length) process.exit(1);
