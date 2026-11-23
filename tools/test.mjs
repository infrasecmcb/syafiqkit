// Offline checks for the bundle. Run after every build: node tools/test.mjs
//  1. the plugin registers against a fake ctx and every skill passes dsh-skill's validation
//  2. descriptions are short and say when to use the skill
//  3. every relative file reference inside a skill points at a file that exists
//  4. names used for other skills (foo:bar) and Claude-only tools are all covered
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as plugin from '../index.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'skills.json'), 'utf8'));
const SKILL_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const failures = [];
// Not failures, but listed so they stay visible:
//  - links into skills left out on purpose (the loading note tells the agent to skip those steps)
//  - paths that are examples of the user's own project, not files of the skill
//  - files the upstream author never shipped
const LEFT_OUT = /(^|\/)(\.\.\/)+(haiku|taste|impeccable|update-plugin|skill-creator|agent-setup)\b|^\.\.\/(haiku|taste|impeccable|update-plugin)\b/;
const PROJECT_EXAMPLES = /^(\.\/)?(\.claude\/)?(app\/|react\/)?(Domain\/X\/)?CLAUDE(\.local)?\.md$|^\.\.\/CHANGELOG\.md$/;
const UPSTREAM_MISSING = new Set(['scripts/README.md', 'assets/voice/words.json', 'assets/charts.js', 'assets/app.css', 'references/ship-deploy-verification.md', 'scripts/doc_outline.py', 'scripts/copy-lint.mjs', 'scripts/check-render.mjs', 'scripts/consistency.mjs', '../choreograph/SKILL.md', '../../agents/accessibility-auditor.md']);
const known = [];
const fail = (m) => failures.push(m);

// ---- 1. plugin against a fake ctx ------------------------------------------------------
const providers = [], sections = [];
const ctx = {
  effect(fn) { fn(); },
  skills: { registerProvider(f) { providers.push(f()); return () => {}; } },
  systemPrompt: { getSectionOrder: () => 10200, section(s) { sections.push(s); return () => {}; } },
};
plugin.apply(ctx, { outputStyle: true });
assert.equal(providers.length, 1);
assert.equal(sections.length, 1);
assert.ok(sections[0].text.includes('ADHD'));
const defaultList = await providers[0].list();
for (const n of manifest.defaultExclude) assert.ok(!defaultList.some((c) => c.name === n), `default exclude ignored: ${n}`);
plugin.apply({ ...ctx, systemPrompt: undefined }, { exclude: [] });
const all = await providers[1].list();
assert.equal(all.length, manifest.skills.length, 'exclude: [] must enable every skill');
assert.equal(defaultList.length, manifest.skills.length - manifest.defaultExclude.length);

// ---- 2. per-skill validation -------------------------------------------------------------
const names = new Set();
let totalDesc = 0;
for (const c of all) {
  if (!SKILL_NAME.test(c.name)) fail(`${c.name}: invalid name`);
  if (names.has(c.name)) fail(`${c.name}: duplicate`);
  names.add(c.name);
  if (c.description.length < 40) fail(`${c.name}: description too short (${c.description.length})`);
  if (c.description.length > 240) fail(`${c.name}: description ${c.description.length} chars; keep catalog entries under 240`);
  if (!fs.existsSync(c.locator)) fail(`${c.name}: missing ${c.locator}`);
  totalDesc += c.description.length;
}
for (const s of manifest.skills) {
  const raw = fs.readFileSync(path.join(ROOT, 'skills', s.dir, 'SKILL.md'), 'utf8');
  if (!/^---\r?\n/.test(raw)) fail(`${s.name}: SKILL.md lost its frontmatter`);
}

// ---- 3. reference checker ----------------------------------------------------------------
const LINK = /\]\(\s*<?([^)\s>]+)>?[^)]*\)|`((?:\.\.?\/|references\/|scripts\/|assets\/|templates\/|examples\/)[\w./@-]+\.[a-z0-9]{1,5})`|(?:📖|See|see|read|Read)\s+`?((?:\.\.?\/)[\w./@-]+)`?/g;
const skip = (t) => /^(https?:|mailto:|#|\$|\{|<|data:|tel:|~|\/|[A-Za-z]:\\)/.test(t) || /[*{}<>|$]/.test(t);
let checked = 0, broken = 0;
function walkMd(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkMd(p, out); else if (/\.md$/i.test(e.name)) out.push(p);
  }
  return out;
}
for (const s of manifest.skills) {
  const skillDir = path.join(ROOT, 'skills', s.dir);
  for (const file of walkMd(skillDir)) {
    const text = fs.readFileSync(file, 'utf8').replace(/```[\s\S]*?```/g, ''); // links inside code blocks are examples
    for (const m of text.matchAll(LINK)) {
      let target = (m[1] || m[2] || m[3] || '').replace(/[#?].*$/, '').replace(/[.,;:]+$/, '');
      if (!target || skip(target)) continue;
      const bases = [path.dirname(file), skillDir, ROOT];                 // sibling, skill root, bundle root
      checked++;
      if (!bases.some((b) => fs.existsSync(path.resolve(b, target)))) {
        if (LEFT_OUT.test(target) || PROJECT_EXAMPLES.test(target)) { known.push(`${s.name}: ${target} (left out or example)`); continue; }
        if (UPSTREAM_MISSING.has(target)) { known.push(`${s.name}: ${target} (missing upstream)`); continue; }
        broken++;
        fail(`${s.name}: ${path.relative(ROOT, file)} -> ${target} (not found)`);
      }
    }
  }
}

// ---- 4. names that need mapping ----------------------------------------------------------
const colon = new Map();
for (const s of manifest.skills) {
  for (const file of walkMd(path.join(ROOT, 'skills', s.dir))) {
    const text = fs.readFileSync(file, 'utf8');
    for (const m of text.matchAll(/\b(superpowers|agent-skills|syafiqkit):([a-z][a-z0-9-]+)/g)) {
      if (!names.has(m[2]) && !manifest.skipped.some((k) => k.name === m[2])) colon.set(`${m[1]}:${m[2]}`, s.name);
    }
  }
}
for (const [ref, from] of colon) fail(`${from}: refers to ${ref}, which is not in this bundle`);

// ---- 5. bodies load with the note and no unreplaced placeholders --------------------------
let bytes = 0;
for (const c of all) {
  const d = await providers[1].get(c);
  const [note, rest] = d.content.split('</harness-note>');
  if (!note || rest === undefined) fail(`${c.name}: missing harness note`);
  else if (note.includes('{{')) fail(`${c.name}: unreplaced placeholder in note`);
  if (/^---\r?\n/.test((rest || '').trimStart())) fail(`${c.name}: frontmatter leaked into body`);
  bytes += d.content.length;
}

// every addendum must belong to a skill and have no unreplaced placeholder
for (const f of fs.existsSync(path.join(ROOT, 'addenda')) ? fs.readdirSync(path.join(ROOT, 'addenda')) : []) {
  if (fs.readFileSync(path.join(ROOT, 'addenda', f), 'utf8').charCodeAt(0) === 0xFEFF) fail(`addenda/${f}: starts with a byte-order mark`);
  const n = f.replace(/\.md$/, '');
  if (!names.has(n)) fail(`addenda/${f}: no skill named ${n}`);
  const d = await providers[1].get(all.find((c) => c.name === n) || { name: n });
  if (d && !d.content.includes('<harness-addendum')) fail(`addenda/${f}: not loaded`);
  if (d && /\{\{ROOT\}\}/.test(d.content.split('</harness-addendum>')[0])) fail(`addenda/${f}: unreplaced {{ROOT}}`);
}
// docs/SKILLS.md is generated; fail if it no longer matches skills.json
try {
  const doc = fs.readFileSync(path.join(ROOT, 'docs', 'SKILLS.md'), 'utf8');
  const m = doc.match(/^(\d+) skills, (\d+) on by default/m);
  if (!m || Number(m[1]) !== manifest.skills.length || Number(m[2]) !== defaultList.length) fail('docs/SKILLS.md is out of date: run node tools/docs.mjs');
  for (const s of manifest.skills) if (!doc.includes('`' + s.name + '`')) fail(`docs/SKILLS.md is missing ${s.name}: run node tools/docs.mjs`);
} catch { fail('docs/SKILLS.md not found: run node tools/docs.mjs'); }
console.log(`skills: ${all.length} (${defaultList.length} on by default)`);
console.log(`catalog: ${totalDesc} description chars (average ${Math.round(totalDesc / all.length)})`);
console.log(`known and accepted reference gaps: ${known.length}`);
console.log(`bodies: ${Math.round(bytes / 1024)} KB; references checked: ${checked}, broken: ${broken}`);
if (failures.length) {
  console.log(`\n${failures.length} problem(s):`);
  for (const f of failures.slice(0, 80)) console.log('  - ' + f);
  if (failures.length > 80) console.log(`  ... and ${failures.length - 80} more`);
  process.exit(1);
}
console.log('ok');
