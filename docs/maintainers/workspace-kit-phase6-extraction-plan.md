# Workspace Kit Phase 6 extraction plan

This document is the maintainer source of truth for Phase 6 extraction execution.

## Scope

- Extract the single publishable workspace-kit package into a dedicated repository.
- Keep QuickTask as a consumer and regression fixture.
- Preserve release independence between kit and QuickTask extension artifacts.

## Chosen approach

- Project/repo identity: Workflow Cannon (`workflow-cannon`).
- Package identity: `@workflow-cannon/workspace-kit`.
- Repository shape: single-package extracted repository first.
- History strategy: `git subtree split` from `packages/workspace-kit` to preserve kit history without carrying unrelated monorepo history.
- Cutover policy: use a pre-split freeze commit in QuickTask, then treat the extracted repository as the package home.

## Execution sequence

1. Confirm pre-cut gates:
   - package-primary flow remains healthy (`upgrade`, `init`, `check`, `doctor`),
   - improvement-engine release-cycle evidence is complete,
   - tarball/published consumer regression checks pass.
2. Create the extraction branch in QuickTask and capture the pre-split freeze commit SHA.
3. Run `git subtree split --prefix packages/workspace-kit -b workspace-kit-split`.
4. Create the new repository and push `workspace-kit-split` as its initial default branch.
5. Configure package release automation in the new repository.
6. Update QuickTask to consume the published kit package/version, not monorepo-local unpublished paths.
7. Keep QuickTask CI validating consumer parity against tarball/published artifacts.

## Human-only gates

- New repository creation and org-level permissions.
- Registry/org credentials, publish secrets, and package ownership.

## Completion evidence

Phase 6 is complete when:

- extraction approach and sequence are documented (this file),
- QuickTask consumer checks validate against packaged kit artifacts,
- CI/readiness gates include the consumer regression command,
- tracker/status files record Phase 6 completion and no open Phase 6 implementation tasks remain.

## Execution evidence snapshot (Workflow Cannon follow-through)

- Pre-split freeze commit in QuickTask: `65797d888629d017f3538bd793c5e7cd781edf7d`
- Subtree split branch: `workflow-cannon-split`
- Split commit SHA: `5a1f7038255a2c83e0e51ace07ea0d95a327574c`
- Portable split bundle artifact: `artifacts/workspace-kit-extraction/workflow-cannon-split.bundle`
