<h1>
  <img src="./logo.png" alt="QuickTask" />
</h1>

Reusable slash-command task templates for AI chat workflows.

QuickTask gives you a single `/qt` command family to create, run, and iteratively improve task templates. The project uses a shared core runtime so behavior stays consistent across host adapters.

## First run (VS Code / Cursor extension)

**Default path:** use **chat**, not the repo clone flow.

1. Install the extension ([Marketplace](#vs-code-marketplace) or [VSIX](#vs-code-manual-vsix)).
2. Open a **folder workspace** (QuickTask writes under `tasks/`).
3. Open **chat**, pick the **QuickTask** participant (`quicktask`), and type **`/qt`** or **`/qt init`**.
4. After install, confirm you have the right build: **Extensions** view → **QuickTask Workflows** → check **identifier** `nicklaprell.quicktask-vscode` and version.
5. Optional: **`/qt doctor`** for tasks-dir path, writability, and template count. On first open of a workspace, the extension shows a one-time summary (path, writable, template count) aligned with doctor.

**Secondary:** Command Palette → **QuickTask: Run /qt Command** (same commands, useful when chat is unavailable).

## Post-install checklist (trust)

- [ ] Marketplace listing or VSIX matches **QuickTask Workflows** / `nicklaprell.quicktask-vscode`.
- [ ] Extension loads in the Extensions view with the expected publisher (**nicklaprell**).
- [ ] Chat shows the **QuickTask** participant; `/qt help` returns the short quickstart, `/qt help all` lists every form.
- [ ] `/qt doctor` reports a writable `tasks/` path (or run `/qt init` once).

Screenshots and rich listing copy live on the [Visual Studio Marketplace listing](https://marketplace.visualstudio.com/items?itemName=nicklaprell.quicktask-vscode); this README stays in sync on **identity strings** and install paths.

## Why QuickTask

- **Reusable workflows**: define a task once and run it repeatedly with new input.
- **Improvement loop built in**: propose, accept, reject, or abandon template updates.
- **Host-agnostic core**: command parsing and runtime behavior live in one shared package.
- **Deterministic contracts**: command and result shapes are documented for adapter implementations.

## Contributing: quickstart from source

**If you only want to use QuickTask in the editor**, follow **[First run](#first-run-vs-code--cursor-extension)** above — **do not** start from `pnpm install` in this repo.

The steps below are for **contributors** cloning the repository (see `CONTRIBUTORS.md` for the full guide).

1. Install dependencies:

```bash
pnpm install
```

2. Initialize QuickTask starter templates:

```bash
pnpm build
node -e "import { createQtRuntime } from './packages/core/dist/runtime.js'; const rt=createQtRuntime(); console.log(rt.handle('/qt init'));"
```

3. Run a first workflow:

```text
/qt list
/qt show standup
/qt/standup yesterday: fixed flaky test, today: release prep, blockers: none
```

4. Improve it:

```text
/qt improve standup include explicit risk callouts
```

For full validation before contributing, run `pnpm check && pnpm test`.

## Install QuickTask

QuickTask ships installable artifacts through GitHub Releases.

### Canonical extension identity

Use these strings everywhere (search, support, docs) so people install the right thing:

| What                     | Value                                                                                                                            |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| **Display name**         | QuickTask Workflows                                                                                                              |
| **Extension id**         | `nicklaprell.quicktask-vscode`                                                                                                   |
| **Marketplace**          | [Open listing](https://marketplace.visualstudio.com/items?itemName=nicklaprell.quicktask-vscode)                                 |
| **Run /qt from palette** | Command **QuickTask: Run /qt Command**                                                                                           |
| **Chat participant**     | **QuickTask** (invokable as `quicktask`); in chat, type **`/qt`** for QuickTask commands—the same surface as the palette command |

### VS Code (Marketplace)

1. Open [Visual Studio Marketplace](https://marketplace.visualstudio.com/vscode) or the [direct listing](https://marketplace.visualstudio.com/items?itemName=nicklaprell.quicktask-vscode).
2. Search for **`QuickTask Workflows`** (publisher **`nicklaprell`**).
3. Install the extension.

### VS Code (manual VSIX)

1. Download `quicktask-vscode-vX.Y.Z.vsix` from the matching GitHub release.
2. Open the Command Palette (**View → Command Palette…** or the usual shortcut).
3. Run exactly **`Extensions: Install from VSIX...`** and choose the downloaded file.
   - If it doesn’t appear, type `vsix` in the palette filter—some builds hide rarely used commands until you search.

### Cursor (VSIX)

1. Download `quicktask-vscode-vX.Y.Z.vsix` from GitHub release assets.
2. Open the Command Palette and run **`Extensions: Install from VSIX...`** (same wording as VS Code), then pick the file.
3. Reload the window if prompted.

### OpenClaw

1. Download `quicktask-openclaw-vX.Y.Z.tgz` from the release assets.
2. Extract the archive (it includes a `package/` directory).
3. Load `package/dist/index.js` in your OpenClaw host integration and import `registerQuickTask()`.

For asset names and verification details, see `docs/release-assets-and-verification.md`.

## Usage

### Command forms

- `/qt` - compact index (points at help).
- `/qt help` - short quickstart; **`/qt help all`** - full command list.
- `/qt help [create|run|improve|actions|discover|all]` - topic help.
- `/qt init` - create starter templates and first-run guidance.
- `/qt [task] [text]` - **new name:** remainder is the **template body** (long pastes OK). **Existing name:** remainder is **run input** (same idea as `/qt/[task]`).
- `/qt create [task] [instructions]` - explicit create; **fails with already-exists** if the name is taken.
- `/qt/[task] [input]` - run an existing task with input.
- `/qt improve [task] [input]` - propose an improvement (needs a substantive note; short blurbs return guidance instead of a mystery proposal).
- `/qt improve accept [task] [proposal-id]` - accept and apply a proposal.
- `/qt improve reject [task] [proposal-id]` - reject a proposal.
- `/qt improve abandon [task] [proposal-id]` - abandon a proposal.
- `/qt export [task|--all]` - export task templates as JSON.
- `/qt import [--force] [payload-json]` - import exported task templates.
- `/qt import-pack [--force] [manifest-path]` - import templates from a local pack manifest.
- `/qt list` - list available task templates.
- `/qt show [task]` - show one task template body.
- `/qt doctor` - show storage/runtime diagnostics.

Quoted task names are supported for create/run/show/improve flows when names include spaces:

- `/qt "incident triage" capture timeline and owner`
- `/qt/"incident triage" production outage timeline`
- `/qt show "incident triage"`
- `/qt improve "incident triage" include customer impact`

### Common workflow example

```text
/qt summarize summarize meeting notes into concise bullet points
/qt/summarize Notes from today's planning session...
/qt summarize follow-up: focus on decisions only
/qt improve summarize prioritize action items and owners
/qt improve accept summarize p_abc123
```

Expected behavior:

- **`/qt summarize …` when `summarize` already exists** runs the template with your text as input (it does not overwrite the template). Use **`/qt create summarize …`** only for an explicit create attempt on a **new** name; duplicates get `already-exists`.
- Running a missing task returns a clear not-found result.
- Improvement proposals are previewed before they can be accepted.
- Templates can include `{{variable}}` and `{{variable|default}}` tokens for key/value runtime interpolation.

Approved command-surface policy:

- QuickTask intentionally keeps a minimal command surface centered on create/run/improve lifecycle and `list/show/doctor`.
- Portability commands (`export`, `import`, `import-pack`) are included for deterministic template sharing.
- Additional command expansions are deferred by default unless explicitly approved.

## Current Status

- Core runtime behavior for create/run/improve lifecycle is implemented.
- Host integrations for VS Code, Cursor, and OpenClaw are wired to the shared runtime.
- Release workflows now build and publish installable VSIX/OpenClaw artifacts with integrity metadata.
- Marketplace publishing workflow is available for post-release rollout (`Publish VS Code Marketplace`).

## Support Matrix

| Surface                                 | Minimum supported                                    | Validation coverage                                              |
| --------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------- |
| Node.js runtime                         | 22.x LTS                                             | CI (`check`, `test`, `build`)                                    |
| pnpm                                    | 10.x                                                 | CI package-manager consistency check                             |
| VS Code adapter (`quicktask-vscode`)    | VS Code `^1.100.0`                                   | Adapter tests + host smoke tests                                 |
| Cursor command wrapper                  | Current Cursor command-file support                  | Command contract smoke check                                     |
| OpenClaw adapter (`quicktask-openclaw`) | Current OpenClaw plugin runtime                      | Adapter tests + host smoke tests                                 |
| Operating systems                       | Ubuntu Linux (baseline), macOS/Windows (best-effort) | Core CI runs on Ubuntu; runtime is host-agnostic TypeScript/Node |

Compatibility policy:

- Breaking compatibility changes must be documented in `TASKS.md` and release notes before merge.
- Update this matrix in the same PR as any support-floor changes.

## Release And Publishing Flow

Production release is driven by GitHub Actions and Changesets:

1. Merge release-ready PRs into `main`.
2. Run `Release Candidate Validation` workflow from `main` and capture the run ID.
3. Dispatch `Release` with docs-sync inputs and the `rc_run_id`.
4. The release workflow versions packages, creates tag `vX.Y.Z`, and publishes release assets.

Post-release VS Code Marketplace rollout:

1. Configure repository secret `VSCE_PAT` with publish permission for `nicklaprell`.
2. Dispatch workflow `Publish VS Code Marketplace` with `release_tag=vX.Y.Z`.
3. Workflow validates release-tag/version parity, packages VSIX, and publishes to Marketplace.

Release policy details live in `RELEASE_STRATEGY.md`. Contributor operational steps are in `CONTRIBUTORS.md`.

## Project Structure

- `packages/core` - parser, runtime, storage, and shared types/contracts.
- `packages/vscode-extension` - VS Code host adapter.
- `packages/openclaw-plugin` - OpenClaw host adapter.
- `.cursor/commands` - Cursor slash-command entrypoints.
- `docs/` - contract docs and readiness artifacts.
- `docs/governance-map.md` - source-of-truth policy map.

## Documentation

- User-facing command/result contract: `docs/qt-command-result-contract.md`
- Adapter rendering matrix: `docs/qt-adapter-rendering-matrix.md`
- Contributor guide and local workflow: `CONTRIBUTORS.md`
- Pre-release readiness workflow: `PRE_RELEASE_READINESS_WORKFLOW.md`
- Production release strategy: `RELEASE_STRATEGY.md`
- Release assets and verification reference: `docs/release-assets-and-verification.md`
- Governance document map: `docs/governance-map.md`
- Task tracking source of truth: active board `TASKS.md` + history `TASKS_ARCHIVED.md`
- Task discovery workflow: `TASK_DISCOVERY_WORKFLOW.md`
- Cursor command entrypoints:
  - `.cursor/commands/qt.md`
  - `.cursor/commands/prepare-release.md`
  - `.cursor/commands/discover-tasks.md`
