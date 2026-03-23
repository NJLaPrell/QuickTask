# Workspace Kit Roadmap

Long-term plan to evolve this repository’s **process layer** (rules, workflows, task/release discipline, validation scripts) into a **reusable workspace bootstrap**: usable from a **Git template** first, then primarily from a **publishable package**, so new projects can run development and releases from simple prompts (for example “complete Phase 1” or “release on GitHub”) without re-copying bespoke QuickTask-only files.

This roadmap sits **alongside** product work on QuickTask (extensions, `/qt` runtime). The kit may share versioning discipline with the monorepo early on, then **version independently** once extracted.

---

## Documentation boundary (no overlap with product docs)

**Intent:** QuickTask’s **project documentation** stays about **QuickTask** (install, use, contribute to the extension and monorepo). This file is **only** the long-range plan for the **workspace kit** (template + package). The two must not be blended in user-facing or primary contributor entrypoints.

| Audience                               | Where the story lives                                        | Must not                                                                             |
| -------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| Extension users / “what is QuickTask?” | `README.md`, Marketplace copy, product-oriented docs         | Kit phases, template strategy, or “future bootstrap” narrative                       |
| Workspace kit adopters (future)        | Package README, template repo README, kit changelog          | QuickTask-specific install paths unless the kit is explicitly scoped to this product |
| Maintainers planning the kit           | **`ROADMAP.md`** (this file), optional maintainer-only notes | —                                                                                    |

**Defaults**

- **Do not** link `README.md` (or equivalent front-door docs) to `ROADMAP.md` unless you consciously choose to; the default is **separation**.
- **`TASKS.md`** may cite **kit phase labels** for traceability (e.g. “Kit Phase 0”) **without** copying vision or phase bodies from this file into task descriptions.
- Kit **release notes**, **upgrade guides**, and **profile schema** docs ship **with the kit** when it exists; they are not substitutes for QuickTask release docs and vice versa.

---

## Tracking work until Phase 6 (yes — mostly in this repo)

Until the kit lives in its **own repository**, treat **QuickTask as the system of record** for kit work. That keeps history, CI, and decisions in one place and matches dogfooding.

| What                             | Where                                                                                            | Notes                                                                                                                                                              |
| -------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Direction and phases**         | `ROADMAP.md`                                                                                     | Update phase status or dates here when milestones move; keep it strategy-level, not a task dump.                                                                   |
| **Actionable work**              | `TASKS.md`                                                                                       | Same board as product tasks. Use **`[workspace-kit]`** in the **title** (required convention — see [Recorded decisions](#recorded-decisions)).                     |
| **Session handoff**              | `docs/maintainers/workspace-kit-status.yaml`                                                     | Machine-readable **current kit phase**, next actions, blockers — **read at session start**, **update at session end**.                                             |
| **Proof / inventory / ADRs**     | Maintainer-only paths (e.g. appendix here, `docs/` with an obvious **maintainer/internal** name) | Do not surface in product `README.md` (see boundary above).                                                                                                        |
| **Code and scripts**             | This monorepo (`packages/`, `scripts/`, `templates/`, etc.)                                      | Normal branches and PRs; Conventional Commits as you already do.                                                                                                   |
| **Friction / retros (Phase 5+)** | Repo-local file or section agreed at kickoff                                                     | Optional `KIT_FRICTION.md` or a subsection under maintainer docs — still **in** QuickTask until split, then **move or replicate** into the kit repo on extraction. |

**What not to do**

- **Second tracker** (random Notion/Jira only) without mirroring outcomes into `TASKS.md` or git — you’ll lose the audit trail next to the code.
- **Mixing** kit narrative into extension-facing docs; tracking stays internal, not marketing.

On **Phase 6 cutover**, migrate **`ROADMAP.md` kit sections** (or the whole file if it’s kit-only), **`docs/maintainers/workspace-kit-status.yaml`**, **open tasks** that are kit-only, and **kit package source** to the new repo; leave a **short pointer** in QuickTask maintainer notes if needed (“kit development moved to …”) without expanding product README.

---

## Vision

**End state:** A consumer does one of:

1. **Template (phase 1):** “Use this GitHub template” → clone → run a documented init (and optionally a small CLI) → workspace has Cursor/VS Code rules, Copilot-friendly directives, TASKS/release workflows, and check scripts aligned to _their_ stack.
2. **Package (phase 2+, primary):** `pnpm dlx <kit-cli> init` (or `npx`) → same outcome, with **upgrade** and **drift detection** against a pinned kit version.

**Non-goals for v1 of the kit:** Replacing QuickTask’s extension UX; owning application runtime or framework choices beyond what the **project profile** describes.

---

## Principles

| Principle                           | Implication                                                                                                                                                                                                                                                                                                                |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Package is the system of record** | Templates become thin: they pin a kit version and call into the package for init, upgrade, and checks.                                                                                                                                                                                                                     |
| **Strangler, not big bang**         | Extract one concern per milestone; keep QuickTask dogfooding until cold-start repos pass the same gates.                                                                                                                                                                                                                   |
| **Boring state**                    | Project specifics live in validated config (YAML/JSON + schema), not duplicated prose in many rule files.                                                                                                                                                                                                                  |
| **Workflows are contracts**         | In **this lab monorepo**, phases/gates align with existing repo docs (`RELEASE_STRATEGY.md`, task rules) and scripts (`check-workflow-contracts.mjs`, `tasks:check`, etc.). The **shipped kit** will carry its own consumer-facing contract docs; it does not have to mirror QuickTask’s release doc titles word-for-word. |
| **Human-first learning loop**       | Structured friction logs and checklist failures drive kit changes before optional “monitor” automation on transcripts/diffs.                                                                                                                                                                                               |

---

## Artifacts and naming (working model)

| Artifact                   | Role                                                                                                      | Evolution                                                                       |
| -------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| **Template repository**    | Fastest on-ramp; includes `.cursor/rules`, `.github` snippets, profile stub, README “next steps”.         | Shrinks over time: mostly profile + lockfile to kit version + one init command. |
| **Publishable package(s)** | `init`, `upgrade`, `doctor`, `check` (profile validation), template sync from packaged assets.            | Becomes the **primary** distribution; template only invokes the package.        |
| **Project profile**        | Repo-local: name, stack, package manager, test/lint/typecheck commands, paths, GitHub remote conventions. | Single source for templating rules and scripts.                                 |
| **Kit manifest**           | Records pinned kit version, asset checksums or paths, last upgrade.                                       | Enables `doctor` and CI drift checks.                                           |

Exact npm scope (`@quicktask/workspace-kit` vs neutral name) is an **open decision** (see [Open decisions](#open-decisions)).

**Package layout (recorded):** **One publishable package** (CLI + embedded assets) until **reuse or install-size pain** justifies splitting (for example `@scope/kit-core` + `@scope/kit-cli`). See [Recorded decisions](#recorded-decisions).

---

## Glossary (avoid mixing terms)

| Term                         | Meaning here                                                                                                                                                                                                                                |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Kit phase**                | A milestone in **this roadmap** (Phase 0–6).                                                                                                                                                                                                |
| **Project phase**            | Work tracked in **`TASKS.md`** / your product delivery phases (e.g. “Phase 1” on the task board). Not the same as a kit phase.                                                                                                              |
| **Template consumer README** | README in a **kit template repo** (or starter folder) for people adopting the workspace kit — **not** the QuickTask product `README.md`.                                                                                                    |
| **Lab monorepo**             | This QuickTask repository while it hosts in-tree kit development.                                                                                                                                                                           |
| **Kit artifact**             | Installable, versioned **registry package** (npm or GitHub Packages), or a **published GitHub Release** asset if you choose that channel for the CLI tarball — see [First publish of the kit](#first-publish-of-the-kit-registry-artifact). |
| **Status YAML**              | `docs/maintainers/workspace-kit-status.yaml` — **agent session handoff**; see [Multi-session agent operating model](#multi-session-agent-operating-model-minimal-human-interaction).                                                        |

When this file says a consumer completes **“project Phase 1”** (or similar), it means **their** project’s phase from **TASKS** / your workflow — not **Kit Phase 1**.

---

## Phases (full plan)

### Phase 0 — Foundations (current repo as laboratory)

**Objective:** Treat QuickTask as the **golden fixture**: every generalization must keep `pnpm check`, `pnpm test`, and existing workflow scripts green unless a task explicitly changes contract.

**Workstreams**

- Inventory: list everything that is **QuickTask-product-specific** vs **process-universal** (TASKS conventions, branch naming, release gates, PR rules).
- Document the **target profile schema** (minimal fields first: `project.name`, `packageManager`, `commands.test`, `commands.lint`, `commands.typecheck`, `github.defaultBranch`).
- Add **ROADMAP.md** traceability: when tasks in `TASKS.md` advance the kit, reference this file by phase.

**Exit criteria**

- Written inventory kept **maintainer-side** only (appendix in this file, ADR, or `docs/` path clearly marked maintainer/internal — **not** linked from product `README.md`).
- Agreed minimal profile schema v0 (draft OK).

---

### Phase 1 — Dual track: template + local package skeleton

**Objective:** Ship something **cloneable** and something **installable**, even if the package only wraps copy/sync from `templates/` inside the monorepo.

**Deliverables**

1. **Template repo** (or `templates/workspace-starter/` in-repo until split):
   - Stub profile file.
   - Cursor rules that **point at** packaged or vendored workflow docs (avoid duplicating five copies of the same paragraph).
   - **Template consumer README** (kit on-ramp only): “init flow” in 5 minutes — **not** the QuickTask product README.
2. **Package skeleton** in monorepo (e.g. `packages/workspace-kit/`):
   - CLI entry: `init`, `doctor`.
   - Embeds **versioned** static assets (rules snippets, workflow markdown templates).
   - `pnpm pack` / publish pipeline stub (Changesets entry when ready).

**Exit criteria**

- Fresh directory: template + **local CLI** (workspace command, `pnpm exec`, or `node` on a **built** artifact from `packages/workspace-kit/`) produces a workspace that passes **kit-owned** `doctor` checks (profile valid, required files present). **`pnpm dlx` / `npx` against the registry** is **Phase 3** (or an [early publish exception](#first-publish-of-the-kit-registry-artifact) documented in `TASKS.md`).
- QuickTask repo still passes full monorepo checks.

---

### Phase 2 — State and migration (strangler)

**Objective:** **Project-specific** details read from the profile; rules and scripts **parameterize** from it. QuickTask-specific paths/strings move behind defaults or `profiles/quicktask.yaml` (or equivalent).

**Deliverables**

- Profile validation in CI (`kit check` or `node scripts/...` calling shared validator).
- Gradual replacement of hard-coded project name strings in rules with “see profile” or generated snippets.
- **Migration guide:** “from hand-maintained rules to profile-driven” for one pilot repo.

**Exit criteria**

- Changing `project.name` (or equivalent) in profile updates generated rule fragments or documented inject points without manual find-replace across the repo.
- At least **one** non-QuickTask pilot repo successfully adopts Phase 2 kit.

---

### Phase 3 — Package-primary distribution and upgrades

**Objective:** **Favor the package entirely**: template is a thin wrapper; consumers pin **kit version** in manifest; upgrades are a supported path.

**Deliverables**

- `upgrade` command: merge or overwrite **kit-owned** paths with backup, respect `.kitignore` or merge strategy policy.
- **Drift check** in CI: warn if installed assets differ from pinned package version.
- Published package on npm (or GitHub Packages), with semver and changelog.
- Template repo reduced to: profile stub + `package.json` script calling kit + README.

**Exit criteria**

- Documented upgrade from kit `v0.x` → `v0.y` on a sample repo without losing custom overrides.
- Cold-start: new repo reaches **project** “Phase 1 complete” (per **TASKS** / your workflow — see [Glossary](#glossary-avoid-mixing-terms)) using **only** package + profile (template optional).

---

### Phase 4 — Workflow contract in data (optional but high leverage)

**Relationship to Phase 6:** Recommended **before** opening a separate kit repo **if** most of what you extract is generators and schema (so you move once). If the kit is already useful without Phase 4, Phase 6 can follow Phase 3; run Phase 4 in the new repo instead.

**Objective:** Reduce prose duplication further: phases, gates, and allowed transitions described in **structured data**; IDE rules stay thin adapters.

**Deliverables**

- Schema for workflow phases and checks (extends or complements `scripts/check-workflow-contracts.mjs`).
- Generators: rules / Copilot instructions snippets from contract + profile.
- Docs: “single source of truth” diagram.

**Exit criteria**

- Changing a gate in **one** YAML/JSON file updates generated outputs and passes contract checks.

---

### Phase 5 — Improvement loop (metrics before “AI monitor”)

**Objective:** Systematic improvement without betting the roadmap on unbounded transcript mining.

**Tier 1 (required)**

- **Machine-readable friction log** in repo (JSON) with schema-backed required fields, severity policy, and stable IDs.
- **Deterministic generated summary** artifact derived from friction log data (no manual summary-only edits).
- **Kit retros** tied to releases of the package (same rhythm as Changesets) with release-impact disposition (`requires_change`, `note_only`, `none`).

**Tier 2 (optional)**

- Script: aggregate failing `tasks:check` / `release:prepare` / kit `doctor` into a summary for review.
- Optional assistant workflow: ingest **one** PR or session notes → proposed edit to friction log or kit issue list (human approves).

**Tier 3 (later)**

- Deeper analysis of transcripts + diffs **only after** Tier 1 categories stabilize (privacy, cost, signal-to-noise addressed).

**Exit criteria**

- Every kit semver minor includes either friction-driven changes or explicit “no material friction” note.
- `workspace-kit:improvement-log:validate` and `workspace-kit:improvement-log:generate` are integrated into release/readiness automation and pass in CI.
- At least one full release-readiness cycle uses the machine-readable improvement log and generated summary flow.

---

### Phase 6 — Extraction and product boundary (if the kit outgrows QuickTask)

**Objective:** If scope and release cadence diverge, split **workspace kit** into its own repository while keeping QuickTask as a **consumer** and regression fixture.

**Deliverables**

- Extraction plan: git history strategy (subtree vs new repo).
- Consumer doc: QuickTask pins kit version; CI runs kit `doctor` + `check`.

**Exit criteria**

- Kit releases do not require shipping QuickTask extension bits, and vice versa, except where explicitly integrated.

#### When to cut over to a new repo (not a “last commit ever”)

**There is no single “final commit” that ends work on this repository.** QuickTask keeps shipping after the split. What you commit to is:

1. **Pre-split “freeze” commit in this monorepo** — The last change where the kit still **lives in-tree** (e.g. under `packages/workspace-kit/`). After that, the kit’s **home** is the new repo; this repo only **depends** on the published package (and maybe a pinned template tag).

2. **Start Phase 6 / open the new repo only after Phase 3’s exit criteria are met** — In practice: the package is **published**, **cold-start** works without copying monorepo internals, **upgrade** is documented and tested on at least one pilot, and you are tired of coupling kit releases to QuickTask extension releases. Optionally wait until Phase 4 is done if “workflow as data” is the bulk of what you’re extracting.

**Recommended gate (all should be true before the cut)**

- [x] Kit is **package-primary** in daily use (Phase 3 done).
- [x] At least **one** non–QuickTask consumer or a **dedicated template repo** has successfully adopted upgrades.
- [x] QuickTask CI can run **only** against the **published** kit (or a tagged tarball), not monorepo-relative paths to unpublished kit sources.
- [x] Phase 5 improvement engine has completed at least one release-readiness cycle with machine-readable log + deterministic summary checks enforced.
- [x] You have chosen **history strategy** (new repo with fresh start vs subtree/filter-repo to preserve kit file history).

**“Fork” vs new repository**

- A **GitHub fork** of QuickTask is usually the wrong shape: it implies the same default branch, PR target, and identity as upstream. Prefer a **new repository** (or org) for the workspace kit, then add QuickTask as a **dependent** that installs the package.
- If you want shared history for kit files only, use **git subtree split** / **filter-repo** into that new repo instead of forking the whole monorepo.

---

## Versioning and release strategy

| Period                                 | Approach                                                                                                                                                                                                                                                                              |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Before first registry publish**      | The kit package may live as `workspace:*` in this monorepo, `pnpm pack`, or private installs. Its version may **follow monorepo lockstep** (same Changesets bump as other packages) for convenience — there is **no separate public kit release story** yet.                          |
| **From first registry publish onward** | The kit is its **own artifact**: **semver on the registry is authoritative** for the kit. Breaking profile schema changes = **major**; additive profile fields = **minor**; fixes = **patch**. Changelog entries for the kit package apply to adopters who install from the registry. |
| **Template**                           | Tags or commit pins that reference **minimum kit version** in the **template consumer README**.                                                                                                                                                                                       |

**Flip trigger (explicit):** The switch from “pre-publish / lockstep OK” to **independent kit semver + consumer changelog** happens at **`npm publish` / GitHub Packages publish** of the first **public** kit version (planned under Phase 3 — see below). Earlier tarballs or `pnpm pack` for pilots do not count as that flip unless you intentionally publish them to the registry.

**Upgrade policy:** document in the **kit package README** (or kit docs site), not in QuickTask product documentation.

---

## First publish of the kit (registry artifact)

**Definition:** A **public** (or team-visible, if private registry) installable package — typically **`npm publish`** or **GitHub Packages** — so consumers can run `pnpm dlx <package> init` / `npx <package>` without cloning the QuickTask monorepo.

**Planned milestone:** **Phase 3** — the deliverable _“Published package on npm (or GitHub Packages), with semver and changelog”_ is the committed slot for the **first registry publish**. Do not treat Phase 1–2 as requiring a registry; local workspace, `pnpm pack`, and template copy are enough until then.

**Optional early publish:** If a **pilot** is blocked without a registry (CI, policy, or geography), you may publish a **`0.0.x`** or **`0.1.0`** **after Phase 1 exit** and basic smoke checks — then **apply the versioning flip** from that publish forward (semver + changelog for the kit package). Document the exception in `TASKS.md` when you do it.

**Prerequisites before first publish (checklist):**

- [ ] **Phase 1 exit criteria** met (`doctor`, cold-start with template + CLI).
- [ ] **Package name and registry** chosen; scope/org available (see [Open decisions](#open-decisions)).
- [ ] **Changesets** (or agreed alternative) includes the kit package; first published version is intentional (commonly `0.1.0`).
- [ ] **CI or release workflow** builds and tests the kit package; no secret QuickTask-only paths required for a minimal `init`/`doctor`.
- [ ] **Upgrade path** documented at least at “overwrite kit-owned + backup” level before calling Phase 3 complete (can match Phase 3 deliverables).

**After first publish:** Template repos should **pin minimum kit version**; QuickTask CI should prefer **resolved published version** (or tarball) when validating consumer parity, per Phase 3 / Phase 6 gates.

---

## Dogfooding and gates

| Gate                                          | Purpose                                                                      |
| --------------------------------------------- | ---------------------------------------------------------------------------- |
| QuickTask monorepo `pnpm check` + `pnpm test` | Regressions in shared scripts or core assumptions.                           |
| Cold-start repo (template + package)          | Proves init path for outsiders.                                              |
| Pilot consumer repo                           | Proves profile + upgrade path.                                               |
| Kit release checklist                         | Changelog, schema migration notes, template pin updated.                     |
| First registry publish (Phase 3)              | See [First publish of the kit](#first-publish-of-the-kit-registry-artifact). |

---

## Open decisions

- No open blocking decisions for Phase 0-6 roadmap execution.

**Defaults are binding:** Until overridden by a human-recorded decision, the [Decision defaults](#decision-defaults-to-keep-execution-moving) are authoritative for implementation. Agents must not stall on an open decision that has a listed default.

---

## Recorded decisions

| Decision                                | Choice                                                                                                                                                  |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Package layout**                      | **Single publishable package** until **reuse or install-size pain** warrants splitting into multiple packages.                                          |
| **TASKS.md tagging**                    | **`[workspace-kit]`** in the **task title** for all kit work. Do not use alternate tag sets for the same program.                                       |
| **Phase 6 extraction history strategy** | Use **`git subtree split`** from `packages/workspace-kit` into a new repository to preserve kit-only history without moving unrelated monorepo history. |
| **Project and repository name**         | Use project name **Workflow Cannon** and repository slug **`workflow-cannon`** for extraction follow-through.                                           |
| **Package name and scope**              | Use **`@workflow-cannon/workspace-kit`** as the package identity for extraction follow-through.                                                         |
| **Copilot vs Cursor directives model**  | Keep one profile and generate/maintain both instruction surfaces (`.cursor/rules` and `.github/copilot-instructions.md`) from shared contract intent.   |
| **Upgrade merge strategy**              | Default to safe overwrite for kit-owned paths with backup + diff evidence; do not perform implicit three-way merges.                                    |

---

## Multi-session agent operating model (minimal human interaction)

**Goal:** You can steer with **short prompts** across many sessions (“continue workspace kit”, “advance kit to Phase 1”, “unblock: npm scope is `@org/workspace-kit`”) while the agent **re-grounds** on repo state instead of chat memory.

### Canonical files (read order)

1. **`docs/maintainers/workspace-kit-status.yaml`** — current kit phase, next actions, blockers, pending decisions.
2. **`ROADMAP.md`** — this file: phases, exit criteria, glossary, human gates below.
3. **`TASKS.md`** — search **`[workspace-kit]`**; execution work lives here.
4. **Repo rules** — `.cursor/rules/*.mdc` (including **`workspace-kit-agent.mdc`** for kit work) and existing workflow docs when changing process or validation scripts.

### Session entry (agent)

- Read **`workspace-kit-status.yaml`** and note `current_kit_phase`, `blockers`, `next_agent_actions`.
- List open **`[workspace-kit]`** tasks in `TASKS.md` (respect status `[~]` / `[ ]` / `[!]`).
- If `current_kit_phase` and active tasks **disagree**, **stop once** and ask the human which source wins (then fix the other).

### Session exit (agent — do not skip)

- Update **`workspace-kit-status.yaml`**: `last_updated`, `last_session_summary` (2–5 bullets), `next_agent_actions` (clear completed items), `pending_decisions` (sync with [Open decisions](#open-decisions)).
- Evaluate metrics update triggers and, when any trigger is met, update `metrics.updated_at` plus changed metric values in **`docs/maintainers/workspace-kit-status.yaml`**.
- Update **`TASKS.md`** for any completed or newly discovered work.
- If a roadmap **open decision** was resolved, add a row under [Recorded decisions](#recorded-decisions) and remove it from **`pending_decisions`** in the YAML (and optionally from Open decisions list in this file).

### Advancing kit phase (agent + human)

- **Human:** “Set kit phase to _N_” or “Phase _N_ exit criteria are done” — human is authoritative.
- **Agent:** Verify **exit criteria** for phase _N−1_ (or _N_ if validating) against repo reality before bumping `current_kit_phase`.
- Never advance **only** in chat: the **YAML** must reflect the new phase.

### Human-only gates (agent must not fake these)

- Creating/reserving **npm scope** or org packages, **2FA**, billing.
- **GitHub** org secrets, **OIDC** for publish, repository creation for template/kit (unless human already granted bot access — assume not).
- **Legal/branding** choice for neutral package name vs QuickTask-adjacent name.
- **First registry publish** execution (agent may prepare Changeset + PR + checklist; human runs org-approved publish path unless explicitly delegated).

### Stop and ask (single concise message)

- An **[Open decision](#open-decisions)** blocks the next file change and no **Recorded decision** default exists.
- **Destructive** or high-blast-radius edits (delete/rename workflow dirs, change release automation) without a linked **`[workspace-kit]`** task.
- **CI/check failures** after **two** focused fix attempts — summarize diff + failing command + hypothesis.
- **Security/sensitive** data requested (tokens, `.env`) — never commit; ask human to apply locally.

### Short prompts the human can reuse

| Prompt                                                       | Agent behavior                                                                           |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| **Continue `[workspace-kit]`**                               | Follow `next_agent_actions`, then highest-priority open `[workspace-kit]` task.          |
| **Kit status**                                               | Summarize YAML + open tasks + phase exit criteria gap list.                              |
| **Advance kit to Phase _N_**                                 | Verify prior exit criteria, update YAML phase, align `TASKS.md`.                         |
| **Resolve kit decision: _&lt;topic&gt;_ = _&lt;choice&gt;_** | Record under Recorded decisions; clear YAML `pending_decisions`; implement if unblocked. |

### Minimal CLI contract (implementations must follow)

| Command   | Purpose                                      | Exit codes                                                                               |
| --------- | -------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `init`    | Idempotent scaffold from profile / defaults  | `0` success, `1` validation failure, `2` usage/user error, `3` unexpected internal error |
| `doctor`  | Report profile + manifest + writable paths   | same                                                                                     |
| `check`   | Validate profile (CI)                        | same                                                                                     |
| `upgrade` | Phase 3+ apply kit-owned updates with backup | same                                                                                     |

**Flags/IO** can evolve; **exit code semantics** stay stable once published.

### Testing expectation (agent)

- Any change under **`packages/workspace-kit/`** (when it exists) must run **that package’s** tests (or add them) plus **monorepo** `pnpm check` / `pnpm test` when shared scripts or workspace config change — proportional to blast radius.

---

## Execution contracts (agent-first defaults)

These contracts make execution less ambiguous across long-running sessions and multiple agents.

### Canonical file contract (create and keep stable)

Use these exact paths once implemented; do not rename casually.

| Contract artifact               | Canonical path                                      | Purpose                                                                          |
| ------------------------------- | --------------------------------------------------- | -------------------------------------------------------------------------------- |
| Profile file                    | `workspace-kit.profile.json`                        | Project-specific values used by scaffolding and generators.                      |
| Profile schema                  | `schemas/workspace-kit-profile.schema.json`         | Validation source for `check`/`doctor`.                                          |
| Kit manifest                    | `.workspace-kit/manifest.json`                      | Installed kit version, ownership metadata, and last upgrade details.             |
| Kit-owned paths policy          | `.workspace-kit/owned-paths.json`                   | Explicit list of paths the kit may overwrite during `upgrade`.                   |
| Improvement log (Phase 5+)      | `.workspace-kit/improvement-log.json`               | Machine-readable friction and release-retro source of truth.                     |
| Improvement summary (generated) | `.workspace-kit/generated/improvement-summary.json` | Deterministic aggregate summary for CI/release checks and maintainers.           |
| Friction maintainer view        | `docs/maintainers/workspace-kit-friction.md`        | Human-readable contract reference and operating guide for improvement data flow. |

### Phase gate command baseline

Run these commands when phase work touches shared behavior; record output summaries in task evidence.

| Scope                                   | Required commands                                           |
| --------------------------------------- | ----------------------------------------------------------- |
| Any kit workflow/script contract change | `pnpm tasks:check && pnpm release:check-workflow-contracts` |
| Any monorepo-impacting change           | `pnpm check && pnpm test`                                   |
| Template behavior changed               | `pnpm templates:eval`                                       |
| Pre-publish readiness                   | `pnpm release:prepare`                                      |

If a command is temporarily unavailable in a branch, create/attach a `[workspace-kit]` task that tracks restoring that gate before phase advancement.

### Phase promotion matrix

All listed checks must **pass** and evidence must be **recorded in the closing task** before `current_kit_phase` is bumped in the status YAML. "Evidence" means command output summary, link to passing CI, or explicit human sign-off.

| Transition | Required checks                                                                                                         | Required evidence                                                                                                                                 |
| ---------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **0 → 1**  | `pnpm check && pnpm test`                                                                                               | Inventory doc exists at maintainer path; profile schema v0 draft committed.                                                                       |
| **1 → 2**  | `pnpm check && pnpm test`; kit `doctor` exits `0` on cold-start fixture                                                 | Template + local CLI cold-start passes `doctor`; QuickTask monorepo checks still green.                                                           |
| **2 → 3**  | `pnpm check && pnpm test`; kit `check` exits `0` on pilot repo                                                          | Profile-driven rule generation verified; at least one non-QuickTask pilot adopts kit.                                                             |
| **3 → 4**  | `pnpm check && pnpm test`; kit `upgrade --dry-run` exits `0` on sample repo                                             | Published package on registry; documented upgrade `v0.x` → `v0.y` without losing overrides; cold-start via package only.                          |
| **4 → 5**  | `pnpm check && pnpm test`; contract checks pass after gate edit                                                         | Single-file gate change propagates to generated outputs.                                                                                          |
| **5 → 6**  | `pnpm check && pnpm test`; `pnpm workspace-kit:improvement-log:validate`; `pnpm release:prepare`; friction log reviewed | At least one kit release-readiness cycle includes friction-driven changes or explicit "no friction" note, backed by deterministic summary output. |

Phase 4 is optional; skip directly from 3 → 5 if Phase 4 is deferred (see [Phase 4 relationship note](#phase-4--workflow-contract-in-data-optional-but-high-leverage)).

### Upgrade safety contract (`upgrade`)

- Default mode: **kit-owned paths only** (from `.workspace-kit/owned-paths.json`).
- Always create backup under `.workspace-kit/backups/<timestamp>/` before writing.
- Provide `--dry-run` that emits a path-level plan with action type (`create`, `update`, `skip`, `conflict`).
- On failure, stop immediately and leave user files unchanged outside staged write set; print recovery instructions pointing to backup path.
- Never delete non-kit-owned files automatically.

### Compatibility support policy (v0 line)

- Node: **active LTS only** for CI and support messaging.
- Package manager: **pnpm** is canonical for workspace development; runtime CLI should still be invokable via `pnpm dlx`/`npx` once published.
- Host directives: Cursor and GitHub Copilot docs are both supported outputs; unresolved host-specific divergence stays in [Open decisions](#open-decisions) until recorded.

### Decision defaults (to keep execution moving)

Use these defaults unless the human overrides:

1. **Copilot vs Cursor**: generate both outputs from one profile when practical; if blocked, ship Cursor first and mark Copilot parity as follow-up `[workspace-kit]` task.
2. **Merge strategy on upgrade**: start with overwrite kit-owned + backup + dry-run; defer three-way merge until conflict pain is proven.
3. **Package name unresolved**: continue implementation with placeholder package IDs in docs/scripts but **block first registry publish** until a recorded decision exists.

### Metrics baseline (Phase 5 minimum)

Track these per kit release cycle (manual or scripted). Record values in **`docs/maintainers/workspace-kit-status.yaml`** under a `metrics` key, or in a dedicated `docs/maintainers/workspace-kit-metrics.md` if the YAML gets unwieldy. Update **at least once per kit semver minor** (or per phase promotion, whichever comes first).

- Time from empty repo to successful `doctor` (minutes).
- Cold-start success rate (% runs passing without manual file edits).
- Upgrade success rate (% upgrades with no manual rollback).
- Number of recurring friction themes across sessions.

**Expected values format**

- `metrics.updated_at`: ISO date string (`YYYY-MM-DD`).
- `metrics.source`: short string (`manual` or named script/source).
- `metrics.time_to_doctor_minutes`: number or `null` when not yet measured.
- `metrics.cold_start_success_rate_pct`: number in `0-100` or `null`.
- `metrics.upgrade_success_rate_pct`: number in `0-100` or `null`.
- `metrics.recurring_friction_themes_count`: integer or `null`.

**Session-exit trigger conditions for metrics updates**

- A kit phase promotion is completed or rejected after evidence review.
- A cold-start fixture run produces a new measured outcome.
- An upgrade rehearsal (`upgrade` or `upgrade --dry-run`) produces a new measured outcome.
- A friction-review pass changes the recurring friction theme count.

---

## Suggested next actions (immediate)

1. Add **`[workspace-kit]`** tasks in `TASKS.md` for **Phase 0** exit criteria (no pasted roadmap bodies).
2. Keep **`docs/maintainers/workspace-kit-status.yaml`** in sync after substantive kit sessions.
3. Reserve npm scope / package name **before** [first registry publish](#first-publish-of-the-kit-registry-artifact); treat **kit release process** as separate from QuickTask extension release messaging unless you explicitly lockstep until the [versioning flip](#versioning-and-release-strategy).
4. When Phase 1 starts, create template/starter assets; record their location in **maintainer notes** or this roadmap — avoid folding that narrative into QuickTask’s product README.

---

## Execution bootstrap checklist (one-time setup for smoother walkthroughs)

Complete these once to reduce agent ambiguity and handoff friction:

1. Seed and maintain **`[workspace-kit]`** tasks in `TASKS.md` for the active kit phase.
2. Keep **`docs/maintainers/workspace-kit-status.yaml`** current after each substantive session (phase, next actions, blockers, metrics).
3. Keep canonical contract stubs present and valid JSON:
   - `workspace-kit.profile.json`
   - `schemas/workspace-kit-profile.schema.json`
   - `.workspace-kit/manifest.json`
   - `.workspace-kit/owned-paths.json`
4. Define at least one repeatable **cold-start fixture** path and one **pilot consumer** path before Phase 2 promotion.
5. For every phase promotion, record required check outputs and evidence in the closing `[workspace-kit]` task.

---

## Phase 0 inventory baseline (maintainer-internal)

This inventory captures the split required by Phase 0 exit criteria. It is intentionally maintainer-facing and should not be promoted into product front-door docs.

### QuickTask-product-specific artifacts (not for generic kit defaults)

| Area                                 | Artifact(s)                                                                                        | Why product-specific                                                                      |
| ------------------------------------ | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Product command/runtime contracts    | `docs/qt-command-result-contract.md`, `docs/qt-adapter-rendering-matrix.md`, `packages/core/src/*` | Defines `/qt` behavior and adapter rendering semantics tied to QuickTask runtime.         |
| Product host adapters and UX         | `packages/vscode-extension/*`, `packages/openclaw-plugin/*`, `.cursor/commands/qt.md`              | Host integration implementation and command UX are QuickTask product surface.             |
| Product feedback and release history | `USER_FEEDBACK.md`, GitHub release issue mappings, extension release artifacts                     | User-facing product adoption and release outcomes are outside reusable process-kit scope. |
| Product-facing docs                  | `README.md` (product sections), Marketplace-facing content                                         | Entrypoint docs for extension users are intentionally separate from kit strategy.         |

### Process-universal artifacts (candidate workspace-kit scope)

| Area                                     | Artifact(s)                                                                                                                                  | Why reusable                                                                  |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Task governance and execution discipline | `TASKS.md`, `TASKS_ARCHIVED.md`, task status/priority conventions, branch naming conventions                                                 | General workflow for scoped delivery and auditability in any repository.      |
| Release/process policies                 | `RELEASE_STRATEGY.md`, `PRE_RELEASE_READINESS_WORKFLOW.md`, workflow rule files under `.cursor/rules/`                                       | Reusable release/check policies independent of QuickTask runtime features.    |
| Contract and guardrail scripts           | `scripts/check-workflow-contracts.mjs`, `pnpm tasks:check`, `pnpm release:check-workflow-contracts`                                          | Generic process-contract verification suitable for kit-owned automation.      |
| Workspace-kit canonical contracts        | `workspace-kit.profile.json`, `schemas/workspace-kit-profile.schema.json`, `.workspace-kit/manifest.json`, `.workspace-kit/owned-paths.json` | Stable data contracts that enable profile-driven init/check/upgrade behavior. |
| Maintainer handoff state                 | `docs/maintainers/workspace-kit-status.yaml`                                                                                                 | Agent-session continuity and phase-state tracking reusable across adopters.   |

### Phase 0 task-to-criteria mapping

| Phase 0 criterion                                                            | Task(s) |
| ---------------------------------------------------------------------------- | ------- |
| Maintainer-side inventory exists                                             | `T143`  |
| Minimal profile schema v0 draft exists                                       | `T144`  |
| Metrics cadence + update protocol documented and actionable                  | `T145`  |
| Promotion evidence (`pnpm check && pnpm test`) and phase transition recorded | `T146`  |

---

## Document maintenance

- Update this file when phases complete or gates change.
- Major direction changes: short note at top with date.
- **Do not** merge this roadmap into QuickTask product documentation; keep the boundary in [Documentation boundary](#documentation-boundary-no-overlap-with-product-docs).

---

_Last updated: 2026-03-23 — Phase 0 inventory baseline and metrics protocol updates_
