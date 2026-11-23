<harness-addendum skill="piv-commit">
Safety override. Do NOT run `git add -A` or add everything. After `git status`, list what would be committed. Never stage `.env`, `.env.*`, key or certificate files, `*.pem`, `id_*`, credentials, large binaries, `node_modules`, build output, or anything the diff shows containing a key, token or password; say what you left out. If a secret-looking file is already tracked or staged, stop and tell the user. Stage named files or folders, show the final list and the message, and commit. Do not push.
</harness-addendum>
