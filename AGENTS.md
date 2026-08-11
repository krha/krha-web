# krha.kr release rules

The public GitHub repository `krha/krha-web` on branch `main` is the canonical
source for this site.

For every request that publishes or updates the public site:

1. Work from `/Users/krha/code/krha-website` and preserve unrelated changes.
2. Validate the complete candidate with `npm test`, `npm run lint`, and
   `npm audit --omit=dev`.
3. Commit the exact source that will be deployed.
4. Push that commit to `origin/main` and verify that local `HEAD` exactly
   matches `refs/heads/main` on GitHub.
5. Rebuild the committed source so `public/site-version.json` contains that
   exact commit SHA.
6. Obtain a fresh, short-lived Sites source credential and push the same
   commit SHA to the Sites source branch. Never store the credential.
7. Package and save the Sites version with `commit_sha` equal to the same
   GitHub commit SHA, then deploy it and poll until it succeeds or fails.
8. After a successful deployment, run `npm run verify:release`. Treat any
   local/GitHub/live-site mismatch as an incomplete release.
9. Report the GitHub commit URL, the live URL, and the live version URL.

Never deploy uncommitted work. Never deploy when the GitHub push or SHA check
fails. Changes made only in the Sites editor are not canonical; mirror them
back into this repository before the next release.
