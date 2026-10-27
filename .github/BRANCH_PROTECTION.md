# Branch Protection — Required CI Gate

The `CI` workflow publishes two jobs: **Quality Gate** and **Android APK**.
Configure `main` so a pull request cannot be merged until both checks are green.

## GitHub UI

1. Open **Settings → Rules → Rulesets → New branch ruleset**.
2. Target branch: `main`.
3. Enable **Require a pull request before merging**.
4. Enable **Require status checks to pass before merging**.
5. Add the required checks: **Quality Gate** and **Android APK**.
6. Enable **Require branches to be up to date before merging**.
7. Enable **Block force pushes**.
8. Save the ruleset.

The checks only appear in the picker after the workflow has run at least once.

## GitHub CLI

Requires repository admin permissions. Replace `OWNER/REPO`:

```bash
gh api repos/OWNER/REPO/branches/main/protection \
  --method PUT \
  --input - <<'JSON'
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["Quality Gate", "Android APK"]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1
  },
  "restrictions": null
}
JSON
```

## What the gate runs

`make init-ci`, `make lint`, `make test`, `make build-web` and `make build-apk`,
all inside Docker. The APK is also uploaded as a build artifact.
