# Release Assets And Verification

QuickTask release pages publish installable artifacts for supported hosts.

## Published assets

For each release tag `vX.Y.Z`, the release includes:

- `quicktask-vscode-vX.Y.Z.vsix` - VS Code/Cursor installable extension package
- `quicktask-openclaw-vX.Y.Z.tgz` - OpenClaw plugin npm package artifact
- `checksums.txt` - SHA256 digest list for installable assets
- `release-integrity-metadata.json` - artifact file metadata and digests
- `sbom.json` - CycloneDX component inventory for packaged components

## Install methods

- VS Code/Cursor:
  1. Download `quicktask-vscode-vX.Y.Z.vsix`.
  2. Install with VS Code command palette: `Extensions: Install from VSIX...`.
- OpenClaw:
  1. Download `quicktask-openclaw-vX.Y.Z.tgz`.
  2. Extract the archive (it contains a `package/` directory with bundled runtime deps).
  3. Load `package/dist/index.js` in your host integration and import `registerQuickTask()`.

## Verification flows

- RC validation (`Release Candidate Validation` workflow):
  - builds artifacts and integrity metadata,
  - runs local artifact verification (`pnpm release:verify-local-artifacts`),
  - uploads candidate assets for review.
- Final release (`Release` workflow):
  - requires successful RC run ID (`rc_run_id`),
  - rebuilds and verifies release assets,
  - publishes assets to GitHub release.
- Post-release verification (`Post-Release Install Verification` workflow):
  - downloads published assets from the release page,
  - verifies naming, checksums, archive integrity, and OpenClaw install smoke.

## Local verification commands

```bash
pnpm package:release
pnpm release:verify-local-artifacts
```
