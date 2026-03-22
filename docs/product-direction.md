# Product direction (user feedback)

**Last updated:** 2026-03-23  
**Source:** Maintainer answers to strategic questions aligned with `USER_FEEDBACK.md` (UF-001–UF-022).

This doc is the **default tie-breaker** when docs, core behavior, or extension UX disagree with older assumptions.

---

## Audience and distribution

| Decision | Detail |
| --- | --- |
| **Who we optimize for** | **Both** extension-first users (Cursor/VS Code) **and** monorepo/contributor workflows—not one at the expense of the other. |
| **Repo + `pnpm` as first-run** | **No.** Clone/build paths belong **only** under **Contributing** (or equivalent). Never present them as the default “try QuickTask” path. |
| **Public front door** | **README + GitHub Releases are sufficient.** No separate landing-page initiative unless requirements change. |

**Resolves / narrows:** UF-001, UF-003, UF-019 (defer one-click landing), contributor-vs-user confusion.

---

## Command behavior and help

| Decision | Detail |
| --- | --- |
| **`/qt <name> …` when `<name>` already exists** | **Prefer run, not create.** Today’s “space = create” rule is a major confusion source (UF-011, UF-013). Implementation must still define an explicit **create-new** escape hatch (e.g. dedicated subcommand or flag) so power users don’t lose authoring flows. |
| **`/qt help` vs onboarding** | **Init owns first-run onboarding.** **`/qt help` may steer into or trigger init** when the workspace has not been initialized yet (exact UX: design in tasking—suggest vs auto-run). |
| **Verbose / debug** | Showing absolute paths, touched files, and internal-style codes is **not** the default happy path; treat as **verbose or debug** and **plan explicitly** (settings or mode). |

**Resolves / narrows:** UF-011, UF-012, UF-013 (with guardrails still TBD), UF-014, UF-015 (related), UF-005, UF-017.

---

## Host UX: where to type

| Decision | Detail |
| --- | --- |
| **Canonical entry** | **Chat (QuickTask participant + `/qt …`) over Command Palette.** Palette remains supported but **secondary** in docs and first-run copy. |

**Resolves / narrows:** UF-004, UF-007, UF-022 (participant ↔ `/qt` must be obvious in chat-first docs).

---

## Release priorities (next slice)

**Order of pain to attack:**

1. **Marketplace trust** (listing quality, proof it’s the right extension).  
2. **Find install** (discoverability, exact identity, VSIX path).  
3. **Know where to type** (chat-first steps for Cursor/VS Code).

**Resolves / narrows:** UF-008, UF-009, UF-010, UF-006, UF-007, UF-004, UF-022.

---

## Resolved product decisions

| Topic | Decision | Implications |
| --- | --- | --- |
| **Long paste after `/qt <name>` (UF-012)** | **(C)** When the **referenced template does not exist**, the remainder of the command (including a **long pasted block**) is **intended as the template body to create** — valid authoring, not a mistaken “run research now” flow. | No interrupt/guardrail on long paste for **create**; docs and help must say this explicitly. When the template **already exists**, **`/qt <name> …` prefers run** (see table above); use **`/qt/<name>`** or the explicit create escape hatch from **T133** to replace/author a new body. Tracked in **`TASKS.md` `T139`**. |
| **Doctor / preflight (UF-021)** | **Full preflight** in the **VS Code extension**, plus a **visible hint** after install/activation (notification, welcome, or equivalent) — not “docs-only rescue framing.” | Surface writable workspace, resolvable `tasks/` path, and link or run-through to **`/qt doctor`** (or equivalent surfaced results). Tracked in **`TASKS.md` `T142`**. |

## Open follow-ups (not decided here)

These were not answered in the same session; revisit when they block work:

- Cursor version-pinned docs vs vague forever (UF-004).  
- `qt:sandbox` fix vs de-emphasize (UF-002).  
- `.cursor/commands` vs extension: single story vs dual product (UF-003).

---

## Related docs

- `USER_FEEDBACK.md` — raw reports + triage.  
- `README.md` — install and quickstart (must reflect Contributing-only monorepo path).  
- `docs/qt-command-result-contract.md` — behavior contracts when core/parser changes.
