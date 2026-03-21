# Changesets in QuickTask

This repo uses Changesets for lockstep release versioning and changelog generation.

## Add a release note entry

Run:

```bash
pnpm changeset
```

Pick the package impact and semver level, then write a short summary of user-facing changes.

## Release versioning

The release workflow runs:

```bash
pnpm release:version
```

That updates package versions and changelog files from all pending changesets.
