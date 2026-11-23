# Notice

Skills in `skills/`, role briefs in `agents/` and `RULESET.md` are copied from
syafiqkit by Syafiq (https://github.com/syafiq555/syafiqkit), version 1.467.4, commit ec7bc8e.
The upstream repository declares no top-level license. These skills are redistributed here with the author's permission;
the MIT LICENSE in this repository covers the Harness port (index.js, tools/), not the upstream skill text.

Vendored third-party skills keep their own licenses:
- skills\emil-animate\LICENSE
- skills\emil-choreograph\LICENSE
- skills\emil-design-eng\LICENSE
- skills\emil-gestures\LICENSE
- skills\emil-mobile-native\LICENSE
- skills\emil-pick-ui-library\LICENSE
- skills\emil-remove-animations\LICENSE
- skills\emil-review-animations\LICENSE
- skills\uiux\app-kit\LICENSE

`index.js` and `tools/build.mjs` are the Harness port. Rebuild skills from a newer checkout with:
`node tools/build.mjs <path-to-syafiqkit>`
