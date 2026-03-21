---
"@quicktask/core": patch
"quicktask-vscode": patch
"quicktask-openclaw": patch
---

## New Features

- Add release artifact packaging for VSIX and OpenClaw outputs, including automated release attachment to GitHub Releases.
- Add release candidate and post-release verification workflows with asset integrity checks.

## Bug Fixes

- Prevent release dispatch without successful RC validation and required readiness/doc-sync inputs.

## Internal Improvements

- Add curated release-note generation, changeset section validation, and a single-command release handoff wrapper.
- Add baseline version policy enforcement and release integrity metadata generation (checksums and SBOM).

## Breaking Changes

- None.
