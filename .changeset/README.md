# Changesets in QuickTask

This repo uses Changesets for lockstep release versioning and changelog generation.

## Add a release note entry

Run:

```bash
pnpm changeset
```

Pick the package impact and semver level, then write a clear summary grouped by change type.

Use this template in the changeset body:

```md
## New Features

- <user-facing capability added>

## Bug Fixes

- <user-facing bug fix>

## Internal Improvements

- <refactor/tooling/docs/internal change>

## Breaking Changes

- None.
```

Guidelines:

- Write for end users first (what changed and why it matters).
- Keep each bullet concise and actionable.
- If a section has no changes, use `- None.`.
- Always call out breaking changes explicitly, including migration guidance when needed.
- Follow GitHub release-note category guidance in `.github/release.yml` (based on GitHub Docs for automatically generated release notes).

## Release versioning

The release workflow runs:

```bash
pnpm release:version
```

That updates package versions and changelog files from all pending changesets.
