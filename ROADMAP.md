# Workspace Kit Roadmap

Long-term plan to evolve this repository’s **process layer** (rules, workflows, task/release discipline, validation scripts) into a **reusable workspace bootstrap**: usable from a **Git template** first, then primarily from a **publishable package**, so new projects can run development and releases from simple prompts (for example “complete Phase 1” or “release on GitHub”) without re-copying bespoke QuickTask-only files.

This roadmap sits **alongside** product work on QuickTask (extensions, `/qt` runtime). The kit may share versioning discipline with the monorepo early on, then **version independently** once extracted.

---

## Documentation boundary (no overlap with product docs)

**Intent:** QuickTask’s **project documentation** stays about **QuickTask** (install, use, contribute to the extension and monorepo). This file is **only** the long-range plan for the **workspace kit** (template + package). The two must not be blended in user-facing or primary contributor entrypoints.

| Audience | Where the story lives | Must not |
|----------|------------------------|----------|
| Extension users / “what is QuickTask?” | `README.md`, Marketplace copy, product-oriented docs | Kit phases, template strategy, or “future bootstrap” narrative |
| Workspace kit adopters (future) | Package README, template repo README, kit changelog | QuickTask-specific install paths unless the kit is explicitly scoped to this product |
| Maintainers planning the kit | **`ROADMAP.md`** (this file), optional maintainer-only notes | — |

**Defaults**

- **Do not** link `README.md` (or equivalent front-door docs) to `ROADMAP.md` unless you consciously choose to; the default is **separation**.
- **`TASKS.md`** may cite **kit phase labels** for traceability (e.g. “Kit Phase 0”) **without** copying vision or phase bodies from this file into task descriptions.
- Kit **release notes**, **upgrade guides**, and **profile schema** docs ship **with the kit** when it exists; they are not substitutes for QuickTask release docs and vice versa.

---

## Tracking work until Phase 6 (yes — mostly in this repo)

Until the kit lives in its **own repository**, treat **QuickTask as the system of record** for kit work. That keeps history, CI, and decisions in one place and matches dogfooding.

| What | Where | Notes |
|------|--------|--------|
| **Direction and phases** | `ROADMAP.md` | Update phase status or dates here when milestones move; keep it strategy-level, not a task dump. |
| **Actionable work** | `TASKS.md` | Same board as product tasks. Tag kit work with a stable label in the title or body, e.g. **`Kit Phase 0`**, **`[workspace-kit]`**, or **`K###`** task IDs if you want a dedicated sequence — pick one convention and stick to it. |
| **Proof / inventory / ADRs** | Maintainer-only paths (e.g. appendix here, `docs/` with an obvious **maintainer/internal** name) | Do not surface in product `README.md` (see boundary above). |
| **Code and scripts** | This monorepo (`packages/`, `scripts/`, `templates/`, etc.) | Normal branches and PRs; Conventional Commits as you already do. |
| **Friction / retros (Phase 5+)** | Repo-local file or section agreed at kickoff | Optional `KIT_FRICTION.md` or a subsection under maintainer docs — still **in** QuickTask until split, then **move or replicate** into the kit repo on extraction. |

**What not to do**

- **Second tracker** (random Notion/Jira only) without mirroring outcomes into `TASKS.md` or git — you’ll lose the audit trail next to the code.  
- **Mixing** kit narrative into extension-facing docs; tracking stays internal, not marketing.

On **Phase 6 cutover**, migrate **`ROADMAP.md` kit sections** (or the whole file if it’s kit-only), **open tasks** that are kit-only, and **kit package source** to the new repo; leave a **short pointer** in QuickTask maintainer notes if needed (“kit development moved to …”) without expanding product README.

---

## Vision

**End state:** A consumer does one of:

1. **Template (phase 1):** “Use this GitHub template” → clone → run a documented init (and optionally a small CLI) → workspace has Cursor/VS Code rules, Copilot-friendly directives, TASKS/release workflows, and check scripts aligned to *their* stack.
2. **Package (phase 2+, primary):** `pnpm dlx <kit-cli> init` (or `npx`) → same outcome, with **upgrade** and **drift detection** against a pinned kit version.

**Non-goals for v1 of the kit:** Replacing QuickTask’s extension UX; owning application runtime or framework choices beyond what the **project profile** describes.

---

## Principles

| Principle | Implication |
|-----------|-------------|
| **Package is the system of record** | Templates become thin: they pin a kit version and call into the package for init, upgrade, and checks. |
| **Strangler, not big bang** | Extract one concern per milestone; keep QuickTask dogfooding until cold-start repos pass the same gates. |
| **Boring state** | Project specifics live in validated config (YAML/JSON + schema), not duplicated prose in many rule files. |
| **Workflows are contracts** | Phases, gates, and task semantics stay consistent with existing docs (`RELEASE_STRATEGY.md`, task rules); machine-checkable where possible (build on `scripts/check-workflow-contracts.mjs`, `tasks:check`, etc.). |
| **Human-first learning loop** | Structured friction logs and checklist failures drive kit changes before optional “monitor” automation on transcripts/diffs. |

---

## Artifacts and naming (working model)

| Artifact | Role | Evolution |
|----------|------|-----------|
| **Template repository** | Fastest on-ramp; includes `.cursor/rules`, `.github` snippets, profile stub, README “next steps”. | Shrinks over time: mostly profile + lockfile to kit version + one init command. |
| **Publishable package(s)** | `init`, `upgrade`, `doctor`, `check` (profile validation), template sync from packaged assets. | Becomes the **primary** distribution; template only invokes the package. |
| **Project profile** | Repo-local: name, stack, package manager, test/lint/typecheck commands, paths, GitHub remote conventions. | Single source for templating rules and scripts. |
| **Kit manifest** | Records pinned kit version, asset checksums or paths, last upgrade. | Enables `doctor` and CI drift checks. |

Exact npm scope (`@quicktask/workspace-kit` vs neutral name) is an **open decision** (see [Open decisions](#open-decisions)).

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

- Fresh directory: template + `pnpm dlx` / `node` CLI produces a workspace that passes **kit-owned** `doctor` checks (profile valid, required files present).
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
- Cold-start: new repo reaches “Phase 1 complete” workflow using **only** package + profile (template optional).

---

### Phase 4 — Workflow contract in data (optional but high leverage)

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

- **Friction log** format in repo (markdown or JSON): date, prompt intent, what broke, suggested rule change.  
- **Kit retros** tied to releases of the package (same rhythm as Changesets).

**Tier 2 (optional)**

- Script: aggregate failing `tasks:check` / `release:prepare` / kit `doctor` into a summary for review.  
- Optional assistant workflow: ingest **one** PR or session notes → proposed edit to friction log or kit issue list (human approves).

**Tier 3 (later)**

- Deeper analysis of transcripts + diffs **only after** Tier 1 categories stabilize (privacy, cost, signal-to-noise addressed).

**Exit criteria**

- Every kit semver minor includes either friction-driven changes or explicit “no material friction” note.

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

- [ ] Kit is **package-primary** in daily use (Phase 3 done).  
- [ ] At least **one** non–QuickTask consumer or a **dedicated template repo** has successfully adopted upgrades.  
- [ ] QuickTask CI can run **only** against the **published** kit (or a tagged tarball), not monorepo-relative paths to unpublished kit sources.  
- [ ] You have chosen **history strategy** (new repo with fresh start vs subtree/filter-repo to preserve kit file history).

**“Fork” vs new repository**

- A **GitHub fork** of QuickTask is usually the wrong shape: it implies the same default branch, PR target, and identity as upstream. Prefer a **new repository** (or org) for the workspace kit, then add QuickTask as a **dependent** that installs the package.  
- If you want shared history for kit files only, use **git subtree split** / **filter-repo** into that new repo instead of forking the whole monorepo.

---

## Versioning and release strategy

| Period | Approach |
|--------|----------|
| **Early** | Kit version may track monorepo lockstep (same Changesets bump) to reduce overhead. |
| **Package-primary** | Kit uses **its own semver**; breaking profile schema changes = **major**; additive profile fields = **minor**; fixes = **patch**. |
| **Template** | Tags or commit pins that reference **minimum kit version** in README. |

**Upgrade policy:** document in the **kit package README** (or kit docs site), not in QuickTask product documentation.

---

## Dogfooding and gates

| Gate | Purpose |
|------|---------|
| QuickTask monorepo `pnpm check` + `pnpm test` | Regressions in shared scripts or core assumptions. |
| Cold-start repo (template + package) | Proves init path for outsiders. |
| Pilot consumer repo | Proves profile + upgrade path. |
| Kit release checklist | Changelog, schema migration notes, template pin updated. |

---

## Open decisions

1. **Package name and scope** — Neutral (`@yourorg/dev-workspace-kit`) vs QuickTask-adjacent (`@quicktask/workspace-kit`); affects branding and npm availability.  
2. **Copilot vs Cursor** — Same profile; split or unified “directives” files (`.github/copilot-instructions.md` vs `.cursor/rules`) and how much the CLI generates.  
3. **Merge strategy on upgrade** — Overwrite kit-owned only vs three-way merge; default should be **safe** (backup + diff).  
4. **Single package vs split** — One CLI package vs `@scope/kit-core` + `@scope/kit-cli` if install size or embedding matters.

---

## Suggested next actions (immediate)

1. Optional: add a **Phase 0** row in `TASKS.md` that points at kit phase only (no pasted roadmap text).  
2. Reserve npm scope / package name when publish is in scope; treat **kit release process** as separate from QuickTask extension release messaging unless you explicitly lockstep.  
3. When Phase 1 starts, create template/starter assets; record their location **in this roadmap** or in maintainer notes — avoid folding that narrative into QuickTask’s product README.

---

## Document maintenance

- Update this file when phases complete or gates change.  
- Major direction changes: short note at top with date.  
- **Do not** merge this roadmap into QuickTask product documentation; keep the boundary in [Documentation boundary](#documentation-boundary-no-overlap-with-product-docs).

---

*Last updated: 2026-03-23*
