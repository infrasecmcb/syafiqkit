<harness-addendum skill="taste">
Harness overrides.

- **Folder and commands.** `<skill>` is `{{ROOT}}\skills\taste`. Run its scripts with Node 22+ (`node {{ROOT}}\skills\taste\scripts\<name>.mjs ...`) from the user's site folder. Chrome or Edge is found automatically; set `CHROME_PATH` if it is elsewhere. This skill was published as `design-taste-frontend`; it is installed here as `taste`.
- **The finish gate is a manual step.** In Claude Code a Stop hook runs `gate.mjs` automatically. That hook is removed here. Instead, before you say a page is finished, run `node {{ROOT}}\skills\taste\scripts\gate.mjs index.html` yourself (from the project, as the skill's gate section shows), read the output, fix every FAIL, and run it again. Do not report a page as done without a passing gate run; say so if you could not run it.
- **Photographs are not bundled.** The 66 library photographs (about 11 MB) and a few demo images were left out to keep this bundle small. `photos.mjs pick` still lists and describes them, but `photos.mjs fetch <ids>` will report "its files are missing" for library frames. For those, either let the skill search and download stand-in photographs from Wikimedia Commons / Picsum (it does this when asked, with credits), or pass the client's own pictures. Ask the user before downloading anything. Never ship an unlicensed picture; keep the credits line the script writes.
- **Starting point.** If the layout hero images under `assets/layout/img` are missing in a dealt hero, use a plain colour block or the client's own image instead of a broken link.
- **Cost.** This skill is large and strict. Use it for landing pages and company or product sites. For screens inside an app, use `uiux`.
</harness-addendum>
