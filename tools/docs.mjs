// Generate docs/SKILLS.md from skills.json. Run after tools/build.mjs: node tools/docs.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'skills.json'), 'utf8'));

export const AREAS = [
  ['Plan and build', 'Decide what to build, plan it, build it in small checked steps.', [
    'plan-to-ship', 'harness-check', 'prime-codebase', 'prime-backend', 'prime-frontend', 'plan-create-prd', 'plan-architecture', 'plan-with-priorities', 'plan-create-stories', 'piv-slice-epic', 'piv-plan-implementation', 'piv-implement', 'piv-validate', 'rules-create-global', 'rules-check-drift', 'system-execution-report', 'system-evolution-review', 'brainstorming', 'spec-driven-development', 'writing-plans', 'executing-plans', 'subagent-driven-development',
    'dispatching-parallel-agents', 'delegate-and-verify', 'schedule-checks', 'write-a-skill', 'plan-worklist', 'tackle', 'test-driven-development',
    'systematic-debugging', 'verification-before-completion', 'api-and-interface-design', 'code-simplification',
    'performance-optimization', 'function-parameter-limits', 'extract-shared-package', 'setup-playwright',
  ]],
  ['Review, git and shipping', 'Review changes, commit, wrap up and release.', [
    'requesting-code-review', 'receiving-code-review', 'piv-review-changes', 'piv-fix-review-findings', 'piv-commit', 'piv-create-pr', 'piv-review-pr', 'piv-investigate-issue', 'piv-implement-issue', 'worktree-create', 'worktree-merge', 'code-review-and-quality', 'using-git-worktrees',
    'finishing-a-development-branch', 'git-workflow-and-versioning', 'commit', 'done', 'quick-done', 'ship',
    'shipping-and-launch', 'score-loop', 'judgement', 'ci-ssh-deploy-timeout',
  ]],
  ['Security and privacy', 'Find and fix vulnerabilities, including in AI features.', [
    'security-and-hardening', 'secpriv-code-review', 'owasp-llm-top10', 'owasp-ai-testing', 'patch-advisory',
  ]],
  ['UI, UX and accessibility', 'Design judgement, audits and building accessible interfaces.', [
    'uiux', 'impeccable', 'taste', 'design-handoff', 'frontend-ui-engineering', 'ui-design-review', 'nielsen-heuristics-audit',
    'cognitive-walkthrough', 'ux-audit-rethink', 'wcag-accessibility-audit', 'accessibility-engineering', 'product-still',
  ]],
  ['Animation and interaction', "Emil Kowalski's motion and interaction skills.", [
    'emil-animate', 'emil-choreograph', 'emil-design-eng', 'emil-gestures', 'emil-mobile-native',
    'emil-remove-animations', 'emil-review-animations', 'emil-pick-ui-library',
  ]],
  ['Documentation and writing', 'Docs for code, projects and readers; document conversion.', [
    'documentation-and-adrs', 'codebase-documenter', 'technical-doc-creator', 'setup-project-docs', 'task-summary',
    'write-summary', 'update-summary', 'read-summary', 'continue-session', 'notes-summary', 'user-manual',
    'understanding-guide', 'explainer-deck', 'excalidraw-board', 'doc-to-md', 'md-to-pdf', 'docx-red-edits',
    'condense-task-doc', 'condense-claude-md', 'merge-task-docs', 'sweep-doc-overlaps', 'update-claude-docs',
    'refresh-instructions', 'unhobble-instructions',
  ]],
  ['Video', 'Motion graphics, captions, explainers and editing. Need extra software (see README).', [
    'remotion-motion-graphics', 'explainer-video', 'caption-animation', 'short-form-video', 'audiogram',
    'youtube-intro-outro', 'talking-head-b-roll', 'vlog-auto-edit', 'motion-clip',
  ]],
  ['Client and personal workflow', "Skills from syafiqkit's own working life; several are off by default.", [
    'casual-message', 'gchat-format', 'commit-invoice-generator', 'pull-db', 'setup-tools', 'setup-tracker',
    'watch-sheets', 'uat-script', 'reverse-engineer', 'sign-pdf', 'hobby-review', 'posthog-replay-frames',
  ]],
];

const byName = new Map(manifest.skills.map((s) => [s.name, s]));
const placed = new Set();
const off = new Set(manifest.defaultExclude || []);
const srcName = (id) => ({
  syafiqkit: 'syafiqkit', superpowers: 'superpowers', 'agent-skills': 'Osmani', 'claude-skills': 'mastepanoski',
  'secpriv-skill': 'Meta', 'claude-skills-marketplace': 'mhattingpete', 'claude-remotion-skill': 'haidrrrry',
  'explainer-video-skills': 'iart.ai', 'tiktok-video-skills': 'iart.ai', 'youtube-video-skills': 'iart.ai',
  'b-roll-skills': 'iart.ai', 'cole-skills': 'Cole Medin', 'ai-video-editing-skill': 'znyupup', impeccable: 'Paul Bakaus', 'taste-skill': 'Leonxlnx', local: 'this repo',
}[id] || id);

let out = `# Skill catalog

${manifest.skills.length} skills, ${manifest.skills.length - off.size} on by default. Generated from \`skills.json\` by \`node tools/docs.mjs\`; do not edit by hand.
Skills marked **off** are hidden until you set \`exclude: []\` in the plugin config.

`;
for (const [title, blurb, names] of AREAS) {
  out += `## ${title}\n\n${blurb}\n\n| Skill | What it does | From |\n|---|---|---|\n`;
  for (const n of names) {
    const s = byName.get(n);
    if (!s) { console.error(`areas list names a skill that is not built: ${n}`); process.exitCode = 1; continue; }
    placed.add(n);
    out += `| \`${n}\`${off.has(n) ? ' **off**' : ''} | ${s.description.replace(/\|/g, '\\|')} | ${srcName(s.source)} |\n`;
  }
  out += '\n';
}
const unplaced = manifest.skills.filter((s) => !placed.has(s.name)).map((s) => s.name);
if (unplaced.length) { console.error(`skills with no area: ${unplaced.join(', ')} (add them to AREAS in tools/docs.mjs)`); process.exitCode = 1; }

fs.mkdirSync(path.join(ROOT, 'docs'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'docs', 'SKILLS.md'), out);
console.log(`docs/SKILLS.md: ${placed.size} skills in ${AREAS.length} areas`);
