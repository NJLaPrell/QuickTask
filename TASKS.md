# QuickTask Tasks

Working rules for all tasks:
- Create one branch per task and open one PR per task.
- Keep changes scoped to the task only.
- Add or update tests where practical for every implementation task.
- Preserve the current monorepo structure unless the task explicitly changes it.
- Prefer exact native `/qt` behavior in each host integration.
- For `/qt improve`, accepted changes must overwrite the existing task template.
- If a task reveals a blocker, document it in the PR and stop at the smallest safe boundary.

## T001 - Decide persistent task storage layout
- Goal: Choose and document the repository path and naming rules for persisted `[task].md` files.
- Files: `ARCHITECTURE.md`, optionally new doc under repo root if needed.
- Steps:
  1. Review the current spec and runtime scaffold.
  2. Decide where task template files should live in the repo.
  3. Define task-name-to-filename normalization rules.
  4. Define how host adapters locate the task store.
  5. Document the decision clearly.
- Acceptance criteria:
  - Persistent storage path is explicitly documented.
  - Filename normalization rules are documented.
  - Host lookup rules are documented.
  - No runtime code changes beyond what is needed to support the documentation.
- Dependencies: none.

## T002 - Replace in-memory store with file-backed task store
- Goal: Persist task templates as markdown files instead of using the in-memory store.
- Files: `packages/core/src/store.ts`, supporting core files, tests.
- Steps:
  1. Implement file-backed read/write operations for task templates.
  2. Use the documented storage layout from T001.
  3. Preserve task lookup by logical task name.
  4. Ensure saved templates are written as `[task].md` content.
  5. Keep interfaces small and host-agnostic.
- Acceptance criteria:
  - Templates can be saved, loaded, and overwritten from disk.
  - Missing tasks are handled cleanly.
  - File contents round-trip correctly.
  - Automated tests cover save/load/overwrite/not-found behavior.
- Dependencies: T001.

## T003 - Tighten command parsing against the current spec
- Goal: Make the parser behavior match the agreed command forms exactly.
- Files: `packages/core/src/parser.ts`, related types/tests.
- Steps:
  1. Review supported command forms in the spec.
  2. Handle `/qt`, `/qt [task] [instructions]`, `/qt/[task] [input]`, and `/qt improve [task] [input]` precisely.
  3. Return structured parse results for unclear or incomplete input where needed.
  4. Avoid inventing unsupported command forms.
- Acceptance criteria:
  - Parser behavior matches the current spec.
  - Ambiguous/incomplete input is test-covered.
  - Tests cover all valid command forms and obvious invalid ones.
- Dependencies: none.

## T004 - Implement template creation flow from user instructions
- Goal: Generate new task templates from user-provided instructions using the current spec.
- Files: `packages/core/src/templates.ts`, `packages/core/src/runtime.ts`, tests.
- Steps:
  1. Implement creation behavior for a non-existent task.
  2. Keep generated directions very short.
  3. Prompt for clarification when the request is unclear.
  4. Save the created template through the file-backed store.
- Acceptance criteria:
  - New tasks are created only when no existing template exists.
  - Generated templates are concise markdown instructions.
  - Unclear requests surface a clarification response instead of a bad template.
  - Tests cover create/success/unclear paths.
- Dependencies: T002, T003.

## T005 - Implement existing task execution flow
- Goal: Execute an existing task using stored template instructions plus user input.
- Files: `packages/core/src/runtime.ts`, supporting core files, tests.
- Steps:
  1. Load the existing template for `/qt/[task] [input]`.
  2. Pass through the provided user input without discarding it.
  3. Return a structured execution result that host adapters can render.
  4. Handle not-found tasks cleanly.
- Acceptance criteria:
  - Existing tasks resolve from disk.
  - User input is preserved in execution behavior.
  - Not-found tasks return a clear result.
  - Tests cover run/success/not-found/minimal-input cases.
- Dependencies: T002, T003.

## T006 - Implement improvement proposal flow
- Goal: Generate old-versus-new template proposals for `/qt improve`.
- Files: `packages/core/src/templates.ts`, `packages/core/src/runtime.ts`, tests.
- Steps:
  1. Load the current template.
  2. Produce a proposed new template using either provided user input or the best available improvement.
  3. Return both old and proposed templates in one result.
  4. Keep the proposal structured for host confirmation UX.
- Acceptance criteria:
  - Improvement flow works with and without user input.
  - Old and proposed templates are both returned.
  - Not-found tasks are handled cleanly.
  - Tests cover both explicit and inferred improvement paths.
- Dependencies: T002, T003.

## T007 - Implement improvement acceptance and overwrite behavior
- Goal: When an improvement is accepted, overwrite the existing task template on disk.
- Files: core runtime/store files, tests, docs if needed.
- Steps:
  1. Add a runtime path for accepting a proposed improvement.
  2. Overwrite the existing template file with the accepted content.
  3. Keep overwrite behavior explicit and testable.
  4. Ensure the updated template is used by subsequent runs.
- Acceptance criteria:
  - Accepted improvements overwrite the existing template file.
  - Rejected or abandoned proposals do not alter the file.
  - Tests cover accept/reject/abandon paths.
- Dependencies: T002, T006.

## T008 - Define runtime result contract for host adapters
- Goal: Standardize the response shapes that VS Code, Cursor, and OpenClaw adapters consume.
- Files: `packages/core/src/types.ts`, `packages/core/src/runtime.ts`, tests/docs.
- Steps:
  1. Define result shapes for help, clarification, create, run, improve, accept, reject, and error states.
  2. Keep the contract host-agnostic.
  3. Document how adapters should render each result.
- Acceptance criteria:
  - Result contract is explicit in code.
  - Runtime returns only documented result shapes.
  - Tests validate key result types.
- Dependencies: T004, T005, T006, T007.

## T009 - Add core unit test harness
- Goal: Establish a clean test setup for the core package.
- Files: core package config/tests, root config if needed.
- Steps:
  1. Choose and configure a test runner for the monorepo.
  2. Add package scripts for running core tests.
  3. Add representative tests for parser, store, and runtime.
  4. Ensure CI can run the tests later.
- Acceptance criteria:
  - Tests run from the repo with a documented command.
  - Core package tests pass locally in CI-ready form.
  - Existing implemented behavior is covered at a useful level.
- Dependencies: none.

## T010 - Wire the VS Code extension to the core runtime
- Goal: Replace the VS Code scaffold with a real integration point to QuickTask core.
- Files: `packages/vscode-extension/*`, core files as needed, tests.
- Steps:
  1. Add dependency wiring from the extension to `@quicktask/core`.
  2. Invoke the runtime from the extension entrypoint.
  3. Keep the extension structure aligned with exact native `/qt` behavior as the target.
  4. Add extension-level tests where practical.
- Acceptance criteria:
  - The extension uses the shared core runtime.
  - No task logic is duplicated in the extension.
  - Tests cover the adapter boundary where practical.
- Dependencies: T008, T009.

## T011 - Implement native VS Code `/qt` chat command
- Goal: Support QuickTask through a native VS Code chat command flow.
- Files: `packages/vscode-extension/*`, docs/tests.
- Steps:
  1. Register the native VS Code chat participant or slash-command mechanism.
  2. Map `/qt` requests into the core runtime.
  3. Render help/create/run/improve/confirmation results naturally in chat.
  4. Ensure improvement acceptance overwrites the template.
- Acceptance criteria:
  - `/qt` works natively in VS Code chat.
  - Help/create/run/improve flows are reachable.
  - Accepting an improvement overwrites the stored template.
  - Tests or validation steps are documented.
- Dependencies: T010.

## T012 - Refine Cursor command integration around the core runtime
- Goal: Turn the current Cursor stub into a practical exact-UX integration around the shared runtime.
- Files: `.cursor/commands/qt.md`, supporting docs or scripts, tests if practical.
- Steps:
  1. Review what exact native behavior is feasible in Cursor.
  2. Update the command wrapper to align with the core runtime contract.
  3. Document any unavoidable Cursor-specific limits without changing the core behavior.
  4. Keep the command experience as close to native `/qt` as possible.
- Acceptance criteria:
  - Cursor integration points to the shared runtime behavior.
  - Known Cursor limitations are documented.
  - No duplicate task logic exists outside the core.
- Dependencies: T008.

## T013 - Wire the OpenClaw adapter to the core runtime
- Goal: Replace the OpenClaw scaffold with a real integration point to QuickTask core.
- Files: `packages/openclaw-plugin/*`, core files as needed, tests/docs.
- Steps:
  1. Add dependency wiring from the OpenClaw package to `@quicktask/core`.
  2. Invoke the runtime from the OpenClaw entrypoint.
  3. Keep the package aligned with exact native `/qt` behavior as the target.
  4. Add adapter-level tests where practical.
- Acceptance criteria:
  - The OpenClaw package uses the shared core runtime.
  - No task logic is duplicated in the adapter.
  - Tests cover the adapter boundary where practical.
- Dependencies: T008, T009.

## T014 - Implement native OpenClaw `/qt` command flow
- Goal: Support QuickTask through a native OpenClaw slash-command flow.
- Files: `packages/openclaw-plugin/*`, docs/tests.
- Steps:
  1. Register or wire the native OpenClaw slash-command path.
  2. Map `/qt` requests into the core runtime.
  3. Render help/create/run/improve/confirmation flows appropriately.
  4. Ensure accepted improvements overwrite stored templates.
- Acceptance criteria:
  - `/qt` works natively in OpenClaw.
  - Help/create/run/improve flows are reachable.
  - Accepting an improvement overwrites the stored template.
  - Validation steps are documented.
- Dependencies: T013.

## T015 - Add repo-wide build and test workflow
- Goal: Add GitHub Actions CI for install, test, and build.
- Files: `.github/workflows/*`, package scripts/config as needed.
- Steps:
  1. Add a CI workflow for install, test, and build.
  2. Ensure the monorepo scripts work in CI.
  3. Fail the workflow on typecheck, test, or build failures.
- Acceptance criteria:
  - CI runs on push and PR.
  - Repo installs successfully in CI.
  - Check/test/build steps run in CI.
- Dependencies: T009.

## T016 - Add VSIX packaging for the VS Code extension
- Goal: Produce a VSIX artifact from the repo build.
- Files: extension package/config, build scripts, workflow files.
- Steps:
  1. Add the packaging toolchain needed to build a VSIX.
  2. Ensure the VS Code extension packages successfully.
  3. Output a versioned VSIX artifact in CI/release workflows.
- Acceptance criteria:
  - A VSIX can be built from the repo.
  - The artifact is suitable for VS Code and Cursor manual install.
  - Packaging is automated in scripts or workflows.
- Dependencies: T011, T015.

## T017 - Add OpenClaw package build artifact
- Goal: Produce an installable package artifact for OpenClaw.
- Files: OpenClaw package/config, build scripts, workflow files.
- Steps:
  1. Determine the correct OpenClaw packaging shape for installation.
  2. Add the build/package steps.
  3. Output a versioned OpenClaw install artifact in CI/release workflows.
- Acceptance criteria:
  - A repeatable install artifact is produced for OpenClaw.
  - Packaging is automated in scripts or workflows.
  - The installation method is documented.
- Dependencies: T014, T015.

## T018 - Add release workflow for GitHub Releases
- Goal: Publish release artifacts from tags or release events.
- Files: `.github/workflows/*`, docs/scripts as needed.
- Steps:
  1. Add a release workflow.
  2. Build the VSIX and OpenClaw artifacts during release.
  3. Attach artifacts to a GitHub Release.
  4. Optionally include a bundled zip if useful.
- Acceptance criteria:
  - Tagged releases publish installable artifacts.
  - Release assets include at least the VSIX and OpenClaw artifact.
  - Release flow is documented.
- Dependencies: T016, T017.

## T019 - Add VS Code Marketplace publishing workflow
- Goal: Prepare and automate publishing to the VS Code Marketplace.
- Files: extension metadata, workflow files, docs.
- Steps:
  1. Add the metadata and packaging requirements needed for marketplace publishing.
  2. Add a workflow or documented release step for publishing.
  3. Document required secrets and release procedure.
- Acceptance criteria:
  - The repo contains a clear marketplace publishing path.
  - Required secrets and steps are documented.
  - Publish automation is wired or clearly staged.
- Dependencies: T016, T018.

## T020 - Write installation and release documentation
- Goal: Document install and release flows for VS Code, Cursor, and OpenClaw.
- Files: `README.md`, optionally supporting docs.
- Steps:
  1. Update the repo README with install targets.
  2. Document VS Code install, Cursor VSIX install, and OpenClaw install.
  3. Document release and marketplace publishing flow.
  4. Keep the instructions concise and actionable.
- Acceptance criteria:
  - README explains what QuickTask is and how to install it per host.
  - Release flow is documented.
  - Marketplace publishing notes are documented.
- Dependencies: T018, T019.
