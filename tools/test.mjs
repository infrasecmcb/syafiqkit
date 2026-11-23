// Offline check: run apply() against a fake ctx and validate every skill the way dsh-skill does.
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import * as plugin from '../index.js';

const SKILL_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const effects = [], providers = [], sections = [];
const ctx = {
  effect(fn) { effects.push(fn()); },
  skills: { registerProvider(f) { providers.push(f()); return () => {}; } },
  systemPrompt: { getSectionOrder: () => 10200, section(s) { sections.push(s); return () => {}; } },
};

plugin.apply(ctx, { outputStyle: true, exclude: ['casual-message'] });
assert.equal(providers.length, 1);
assert.equal(sections.length, 1);
assert.ok(sections[0].text.includes('ADHD'));

const p = providers[0];
const list = await p.list();
assert.ok(list.length > 50, `only ${list.length} skills`);
assert.ok(!list.some((c) => c.name === 'casual-message'), 'exclude ignored');
const names = new Set();
for (const c of list) {
  assert.match(c.name, SKILL_NAME);
  assert.ok(!names.has(c.name), `duplicate ${c.name}`); names.add(c.name);
  assert.ok(c.description.length > 0 && c.description.length <= 500, `${c.name} description ${c.description.length}`);
  assert.equal(c.provider, p.name);
  assert.ok(Number.isFinite(c.rank));
  assert.ok(existsSync(c.locator), `missing ${c.locator}`);
}
let chars = 0;
for (const c of list) {
  const d = await p.get(c);
  assert.equal(d.name, c.name);
  assert.ok(d.content.startsWith('<harness-note>'));
  assert.ok(!d.content.split('</harness-note>')[0].includes('{{'), `${c.name} unreplaced placeholder`);
  assert.ok(!/^---\r?\n/.test(d.content.split('</harness-note>')[1].trimStart()), `${c.name} kept frontmatter`);
  chars += d.content.length;
}
plugin.apply({ ...ctx, systemPrompt: undefined }, {}); // works without the optional service
console.log(`ok: ${list.length} skills, catalog ${list.reduce((a, c) => a + c.description.length, 0)} chars, bodies ${chars} chars`);
console.log((await p.get(list.find((c) => c.name === 'commit'))).content.slice(0, 400));
