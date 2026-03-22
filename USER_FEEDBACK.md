# User feedback reports (first-time QuickTask trial in Cursor)

**Source:** Trimmed transcript in `cursor_phase_10_release_objectives.md` (first install / first commands).

**Purpose:** These are written **as a user would report them**—goals, expectations, and confusion first—so they can be turned into **`TASKS.md` work items** or GitHub issues without re-interpreting the transcript.

**How to use for tasking**

- Each report has a stable id **`UF-XXX`**.
- **`Notes for tasking`** is internal (scope hints, components)—optional when filing.
- Prior **Issue 1–36** numbering is mapped in **Index (legacy)** at the bottom for audit trail.

### Tasking consolidation (maintainer triage)

Use this so backlog work isn’t duplicated across near-duplicate UFs.

| Bucket                                              | UF ids                                            | Notes                                                                                                                                                                                       |
| --------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **P1 candidates**                                   | UF-007, UF-008, UF-009, UF-011, UF-012, UF-013    | Highest wrong-expectation / confusion cost in transcript.                                                                                                                                   |
| **Merged for implementation**                       | UF-006 → **UF-007**; UF-010 → **UF-008 / UF-009** | Keep UF-006/UF-010 text for user voice; file one task per merge target.                                                                                                                     |
| **Deferred (evidence-gated)**                       | UF-016, UF-018                                    | Nice polish; ship UF-007 onboarding + UF-014 help first, then revisit if still confusing.                                                                                                   |
| **Extension preflight (shipped `v1.1.0`)**           | UF-021                                            | **`T142`:** full preflight + activation hint — see `docs/product-direction.md` and `TASKS_ARCHIVED.md`.                                                                                     |
| **Deferred (lower ROI / settings)**                 | UF-017                                            | Treat as human-first copy + optional “show codes” setting—not a default must-fix.                                                                                                           |
| **Deferred (landing / release investment)**         | UF-019                                            | **Closed (not planned):** no dedicated landing / one-click VSIX beyond README + Releases — see `docs/product-direction.md`, GitHub [#59](https://github.com/NJLaPrell/QuickTask/issues/59). |
| **Docs + agent playbook (not necessarily runtime)** | UF-001                                            | Fix with README order, setup chooser copy, and default assistant answers—don’t assume a product bug until docs are fixed.                                                                   |
| **Cheap doc fix with UF-007**                       | UF-022                                            | One sentence linking participant **QuickTask** / **quicktask** to **`/qt`** everywhere.                                                                                                     |

**Strategic decisions (2026-03-22):** Maintainer answers that set default direction for resolving feedback live in **`docs/product-direction.md`** (audience, run-vs-create, help+init, chat-first entry, release priorities).

**Execution tracking:** Phase 12 (**`T133`–`T142`**) is **complete** — tasks archived as **`[h]`** in `TASKS_ARCHIVED.md`, shipped **`v1.1.0`** (2026-03-22). Wave / milestone labels (`12a` / `12b` / `12c`) remain in `TASKS.md` as historical plan context. Index below maps UF → GitHub issue → task id (issues **#41–#44, #47–#49, #51–#58, #60–#62** closed with **`v1.1.0`**; **#46** / **#50** were completed earlier as consolidations into **#47** / **#48**). UF-012 **T139** decision **(C)** and UF-021 **T142** preflight are in `docs/product-direction.md`.

---

## UF-001 — Setup instructions assumed I was developing QuickTask, not just trying the plugin

**What I was trying to do**  
Get QuickTask running in Cursor so I could try it for the first time.

**What I expected**  
A short path that matches “I want to use the product” (install something, run a first command).

**What confused me**  
The first instructions centered on opening the QuickTask **repo**, `pnpm install`, and `pnpm build`. I don’t think of that as “trying the plugin”—that sounds like contributing or cloning the whole project.

**What happened instead**  
I had to push back: _“No. Easier. I just want to try the plugin out, not pull the repo down.”_

**Notes for tasking**  
`area:docs`, `audience:first-run` — Lead docs and agent answers with **extension/Marketplace/VSIX first**; repo + pnpm as **“Contributing / advanced”**. Add a one-question **setup chooser** (“Plugin only?” vs “Developing QuickTask?”). **Prioritize doc and onboarding copy first**; only escalate to runtime/product changes if confusion persists after that.

_Legacy: Issue 1, Issue 27_

---

## UF-002 — The “sandbox” path failed when I tried it from the repo

**What I was trying to do**  
Follow the recommended `pnpm qt:sandbox -- /qt …` flow to exercise the real runtime.

**What I expected**  
Copy-paste commands from docs would work after a normal install.

**What confused me**  
The script errored because `@quicktask/core` couldn’t be resolved from the repo root—it felt like the docs and the tooling didn’t match.

**Notes for tasking**  
`area:tooling`, `severity:high`, `audience:contributor` — Fix workspace resolution for `qt:sandbox` from monorepo root **or** stop recommending it until CI proves `pnpm qt:sandbox -- /qt help` works from clean clone.

_Legacy: Issue 2_

---

## UF-003 — Too many ways to “use QuickTask” with no map of which one is mine

**What I was trying to do**  
Understand the one path I should follow.

**What I expected**  
A single happy path: “If you’re a normal user, do A only.”

**What confused me**  
I was pointed at **terminal sandbox**, **`.cursor/commands`**, and **VSIX extension** in one breath. I couldn’t tell which surface actually owned my templates and commands.

**Notes for tasking**  
`area:docs`, `area:ux` — Decision table: _Plugin user_ | _Repo + Cursor rules_ | _Core contributor_ with one primary flow each.

_Legacy: Issue 3_

---

## UF-004 — I still don’t know exactly where in Cursor I’m supposed to run `/qt`

**What I was trying to do**  
Use the Cursor “qt” command / slash flow after reading setup.

**What I expected**  
Exact UI steps: “Click here → type this.”

**What confused me**  
Phrases like _“whatever UI your build uses”_ and _“often typing `/` …”_ don’t tell me **which** chat, **which** composer, or **whether** I need a workspace command first.

**Notes for tasking**  
`area:cursor`, `area:docs` — Version-pinned steps + screenshots; name the **Command Palette** command if it exists.

_Legacy: Issue 4_

---

## UF-005 — I’m not sure whether typing `/qt` in chat actually changes files on disk

**What I was trying to do**  
Trust that init/list/show are “real.”

**What I expected**  
A clear “this wrote to `tasks/` in your folder” moment.

**What confused me**  
I had to hold two ideas: **prompt wrapper** vs **real runtime**. If nothing obvious opens in the explorer, it feels like the assistant is **role-playing** QuickTask.

**Notes for tasking**  
`area:vscode-extension`, `area:docs` — After init/show: **reveal folder**, show **absolute path**, optional “open tasks folder” action.

_Legacy: Issue 5, Issue 30_

---

## UF-006 — VSIX install steps didn’t give me the exact Command Palette name

**Maintainer note:** For tasking, treat as part of **UF-007** (install / first-run docs). Do not open a separate epic. **GitHub [#46](https://github.com/NJLaPrell/QuickTask/issues/46) closed as completed** — tracking continues on **[#47](https://github.com/NJLaPrell/QuickTask/issues/47)** / **`T135`**.

**What I was trying to do**  
Install from VSIX in Cursor.

**What I expected**  
The precise command name as it appears in my editor.

**What confused me**  
_“Run something like Install from VSIX”_ made me doubt I was in the right place.

**Notes for tasking**  
`area:docs` — Verify **VS Code + Cursor** strings; document both; add “if you don’t see it” troubleshooting.

_Legacy: Issue 6_

---

## UF-007 — After I installed the extension, I didn’t know what to open or click to start

**What I was trying to do**  
Run my first `/qt init` as a plugin user.

**What I expected**  
“Open X, then do Y”—one obvious entry point.

**What confused me**  
_“Use the extension’s QuickTask entry … whatever the extension exposes”_ doesn’t tell me **chat participant vs command palette vs sidebar**.

**Notes for tasking**  
`area:vscode-extension`, `severity:high` — Walkthrough; document **QuickTask: Run /qt Command** (command id `quicktask.runQt`) + chat participant (**QuickTask** / `quicktask`) + slash **`/qt`**. **VSIX:** document the exact Command Palette string **`Extensions: Install from VSIX...`** (VS Code and Cursor use the same wording today; add “if you don’t see it” troubleshooting). Remove vague copy.

_Legacy: Issue 7, Issue 29_

---

## UF-008 — I couldn’t find QuickTask on the VS Code Marketplace

**What I was trying to do**  
Install from Marketplace like a normal extension.

**What I expected**  
Search “QuickTask” or my project name and find **our** extension near the top.

**What confused me**  
I got lots of unrelated “quick task” style extensions. I wasn’t sure if ours was missing, renamed, or if I was doing something wrong. (_“I don't see my plugin on the VSCode market…”_)

**Notes for tasking**  
`area:marketplace`, `severity:high` — Keywords, overview, screenshots; canonical **search string + direct URL** in README; explain **Cursor** may not show full Marketplace. **Canonical identity (use everywhere):** display name **QuickTask Workflows**, extension id **`nicklaprell.quicktask-vscode`**, Marketplace item URL `https://marketplace.visualstudio.com/items?itemName=nicklaprell.quicktask-vscode`. (See **UF-010**—merged here for implementation.)

_Legacy: Issue 8, Issue 11, Issue 28_

---

## UF-009 — The Marketplace page looked empty / not trustworthy

**What I was trying to do**  
Confirm I had the right listing.

**What I expected**  
A real description, maybe screenshots, signs that people use it.

**What confused me**  
**Zero installs** and **no overview** made it feel like the wrong page or an abandoned upload.

**Notes for tasking**  
`area:marketplace` — Fill overview, screenshots, Q&A; link to repo and support.

_Legacy: Issue 9_

---

## UF-010 — Too many names for the same extension (search vs URL vs publisher)

**Maintainer note:** For tasking, merge into **UF-008** (discoverability) and **UF-009** (trustworthy listing). One doc + Marketplace pass, not a third workstream. **GitHub [#50](https://github.com/NJLaPrell/QuickTask/issues/50) closed as completed** — tracking continues on **[#48](https://github.com/NJLaPrell/QuickTask/issues/48)** / **`T134`**.

**What I was trying to do**  
Install the right thing without guessing.

**What I expected**  
One string I can search or paste everywhere.

**What confused me**  
Juggling **display name**, **publisher display**, and **`nicklaprell.quicktask-vscode`**—I’m never sure which one the search box wants.

**Notes for tasking**  
`area:marketplace`, `area:docs` — Single canonical line everywhere: **QuickTask Workflows** + `nicklaprell.quicktask-vscode` + link.

_Legacy: Issue 10_

---

## UF-011 — `/qt standup yesterday` should have run my standup, not tried to create it again

**What I was trying to do**  
Run the **standup** template with short input “yesterday.”

**What I expected**  
Natural pattern: command + task + words = **run with that input**.

**What confused me**  
I didn’t know **space after `qt`** means **create** and **slash** `/qt/standup` means **run**. That rule was never obvious until I hit an error.

**What happened instead**  
`already-exists` / create path—felt like the tool was broken until someone explained the slash.

**Notes for tasking**  
`area:core`, `area:ux`, `severity:high` — Proactive teaching on **init** and **show**; **did-you-mean** on `already-exists`; one graphic in docs **space = create, slash = run**.

_Legacy: Issue 12, Issue 13, Issue 32_

---

## UF-012 — I pasted a full research brief after `/qt research` thinking the AI would do the research

**What I was trying to do**  
Give step-by-step instructions so the assistant would **search the web** and summarize.

**What I expected**  
Slash command + long instructions = **execute that workflow now**.

**What confused me**  
QuickTask treated it as **defining a template** stored under `tasks/`. I didn’t realize I was authoring a file, not issuing a research job.

**Notes for tasking**  
`area:docs`, `area:core`, `severity:high` — Clear glossary: **`/qt name …` creates template text**; **does not** trigger web search. Host guardrail for long paste → confirm or suggest `/qt/research …` / plain chat.

_Legacy: Issue 14, Issue 16, Issue 33_

---

## UF-013 — I used `/qt research <topic>` again and still didn’t get a research run

**What I was trying to do**  
Run my **research** template with a topic (e.g. indoor mosquitoes).

**What I expected**  
Same line shape as before should “run research on this topic.”

**What confused me**  
Once `research` exists, **`/qt research …` still parses as create**, not run. I needed **`/qt/research …`** and that felt like a trick, not a product rule.

**Notes for tasking**  
`area:core`, `area:ux`, `severity:high` — **`already-exists`** copy with **copy-paste run line** first; consider `didYouMean` in results for adapters.

_Legacy: Issue 15, Issue 34_

---

## UF-014 — `/qt help` felt like a dump of every command, not “what do I type next?”

**What I was trying to do**  
Get unstuck after poking `list` a few times.

**What I expected**  
A tiny tutorial: “Do these three commands in order.”

**What confused me**  
A big table including **export/import/pack** and weird escaping (`create\|run|…`)—reads like **API reference**, not onboarding. I still wasn’t sure **what to type next**.

**Notes for tasking**  
`area:docs`, `area:rendering`, `area:ux` — Tiered help: **`/qt help`** = short quickstart; **`/qt help all`** = full list; fix table rendering for pipes.

_Legacy: Issue 17, Issue 18, Issue 36_

---

## UF-015 — `/qt improve test` with nothing after felt pointless

**What I was trying to do**  
Try the improve flow.

**What I expected**  
Either a prompt asking what I want changed, or a meaningful default.

**What confused me**  
I got an **“inferred”** tweak that didn’t reflect what I wanted—I didn’t know I was supposed to add instructions on the same line.

**Notes for tasking**  
`area:core`, `area:ux` — Treat empty improve input as **incomplete** + example; don’t silently infer for first-time UX.

_Legacy: Issue 19, Issue 35_

---

## UF-016 — Starter templates don’t show how to run them inside the template I just read

**What I was trying to do**  
Learn by reading `show standup`.

**What I expected**  
One line like “Run this with: `/qt/standup …`”.

**What confused me**  
Only goals and generic bullets—run syntax lived **outside** the template, so I learned the hard way.

**Notes for tasking**  
`area:templates` — Optional comment/footer in seeded templates with **copy-pastable run** example.

**Tasking status:** **Deferred (P4)** — Revisit after UF-007/UF-014 land if `show` still feels opaque.

_Legacy: Issue 20_

---

## UF-017 — I don’t know what codes like `qt:list:listed` mean; I thought something might be wrong

**What I was trying to do**  
Read the assistant’s reply after `/qt list`.

**What I expected**  
Plain English: “Success—here are your templates.”

**What confused me**  
Leading with an internal-looking **code** made me unsure if that was an error, a log, or a success state.

**Notes for tasking**  
`area:host-adapter` — Human-first summary line; hide or demote codes behind a setting.

**Tasking status:** **Deferred** — Prefer clearer summary copy first; full “hide codes” is **settings / polish**, not P1 unless users keep misreading success as errors.

_Legacy: Issue 21_

---

## UF-018 — I ran `/qt list` twice because I didn’t know what to do next

**What I was trying to do**  
Figure out the next step after init.

**What I expected**  
Guided “try this next” after a successful command.

**What confused me**  
Seeing the same list again didn’t teach me the **happy path** (show → run → improve).

**Notes for tasking**  
`area:ux` — After first **list**: suggested next commands or checklist (Show / Run / Improve).

**Tasking status:** **Deferred (P3)** — Much of this is covered if UF-007 walkthrough + UF-014 tiered help ship; reopen if repeat-`list` remains common.

_Legacy: Issue 22, Issue 31_

---

## UF-019 — Getting the VSIX from GitHub Releases feels like a developer chore

**What I was trying to do**  
Install without the Marketplace (or as fallback).

**What I expected**  
One obvious “Download for Cursor” link.

**What confused me**  
Navigate repo → Releases → pick version → pick filename pattern—fine for engineers, heavy for “I just want to try it.”

**Notes for tasking**  
`area:release`, `area:docs` — Short install URL or landing section with **one primary VSIX** per platform/editor.

**Tasking status:** **Closed — not planned (2026-03-22).** Maintainer decision: README + GitHub Releases are the supported VSIX surfaces; no separate consumer landing or one-click “Download for Cursor” initiative. Expectation: use README install steps and release assets. Tracked discussion: [#59](https://github.com/NJLaPrell/QuickTask/issues/59).

_Legacy: Issue 23_

---

## UF-020 — Nobody told me how to verify the extension actually loaded

**What I was trying to do**  
Confirm install worked before wasting time on commands.

**What I expected**  
“Open Extensions → you should see X enabled at version Y” or run one verification command.

**What confused me**  
Docs jumped straight to “use it.”

**Notes for tasking**  
`area:vscode-extension` — Post-install checklist + **doctor** as verification step.

_Legacy: Issue 24_

---

## UF-021 — I only hear about `doctor` when something’s “dead on arrival”

**What I was trying to do**  
Avoid silent failures (can’t write `tasks/`, wrong folder).

**What I expected**  
A quick preflight: “We can write here: …”

**What confused me**  
**Doctor** was framed as a rescue tool, not something that runs **before** I assume init worked.

**Notes for tasking**  
`area:vscode-extension`, `area:core` — Optional activation check: writable workspace + show **tasks** path.

**Tasking status:** **Shipped — `T142` in `v1.1.0`.** Product decision: **full preflight** in the extension + **visible post-install/activation hint** (not docs-only). See `docs/product-direction.md`, `TASKS_ARCHIVED.md`, and closed GitHub [#61](https://github.com/NJLaPrell/QuickTask/issues/61).

_Legacy: Issue 25_

---

## UF-022 — I don’t see how “QuickTask” in chat relates to typing `/qt`

**What I was trying to do**  
Use chat features the way VS Code/Cursor expect.

**What I expected**  
Obvious link between **participant name** and **slash syntax**.

**What confused me**  
If the UI says **quicktask** but docs say **`/qt`**, I’m not sure they’re the same product surface.

**Notes for tasking**  
`area:vscode-extension`, `area:docs` — One sentence everywhere: “Use participant **QuickTask** (or command …) and type **`/qt …`**.”

_Legacy: Issue 26_

---

## Index (legacy Issue → UF mapping)

| Legacy issue | UF id  | GitHub issue                                                                                                                                   | `TASKS.md` (Phase 12)                                                       |
| ------------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 1, 27        | UF-001 | [#41](https://github.com/NJLaPrell/QuickTask/issues/41)                                                                                        | **T135**                                                                    |
| 2            | UF-002 | [#42](https://github.com/NJLaPrell/QuickTask/issues/42)                                                                                        | **T138**                                                                    |
| 3            | UF-003 | [#43](https://github.com/NJLaPrell/QuickTask/issues/43)                                                                                        | **T135**                                                                    |
| 4            | UF-004 | [#44](https://github.com/NJLaPrell/QuickTask/issues/44)                                                                                        | **T135**                                                                    |
| 5, 30        | UF-005 | [#45](https://github.com/NJLaPrell/QuickTask/issues/45)                                                                                        | **T137** (+ future implementation after spec)                               |
| 6            | UF-006 | [#46](https://github.com/NJLaPrell/QuickTask/issues/46) **completed** (consolidated → [#47](https://github.com/NJLaPrell/QuickTask/issues/47)) | **T135**                                                                    |
| 7, 29        | UF-007 | [#47](https://github.com/NJLaPrell/QuickTask/issues/47) (primary; includes UF-006 scope)                                                       | **T135**                                                                    |
| 8, 11, 28    | UF-008 | [#48](https://github.com/NJLaPrell/QuickTask/issues/48)                                                                                        | **T134**                                                                    |
| 9            | UF-009 | [#49](https://github.com/NJLaPrell/QuickTask/issues/49)                                                                                        | **T134**                                                                    |
| 10           | UF-010 | [#50](https://github.com/NJLaPrell/QuickTask/issues/50) **completed** (consolidated → [#48](https://github.com/NJLaPrell/QuickTask/issues/48)) | **T134**                                                                    |
| 12, 13, 32   | UF-011 | [#51](https://github.com/NJLaPrell/QuickTask/issues/51)                                                                                        | **T133**                                                                    |
| 14, 16, 33   | UF-012 | [#52](https://github.com/NJLaPrell/QuickTask/issues/52)                                                                                        | **T139** (decision **C**: long paste = new template body when name missing) |
| 15, 34       | UF-013 | [#53](https://github.com/NJLaPrell/QuickTask/issues/53)                                                                                        | **T133**                                                                    |
| 17, 18, 36   | UF-014 | [#54](https://github.com/NJLaPrell/QuickTask/issues/54)                                                                                        | **T136**                                                                    |
| 19, 35       | UF-015 | [#55](https://github.com/NJLaPrell/QuickTask/issues/55)                                                                                        | **T140**                                                                    |
| 20           | UF-016 | [#56](https://github.com/NJLaPrell/QuickTask/issues/56)                                                                                        | **T141**                                                                    |
| 21           | UF-017 | [#57](https://github.com/NJLaPrell/QuickTask/issues/57)                                                                                        | **T137**                                                                    |
| 22, 31       | UF-018 | [#58](https://github.com/NJLaPrell/QuickTask/issues/58)                                                                                        | **T136**                                                                    |
| 23           | UF-019 | [#59](https://github.com/NJLaPrell/QuickTask/issues/59)                                                                                        | **Closed not planned** (no task)                                            |
| 24           | UF-020 | [#60](https://github.com/NJLaPrell/QuickTask/issues/60)                                                                                        | **T134**                                                                    |
| 25           | UF-021 | [#61](https://github.com/NJLaPrell/QuickTask/issues/61)                                                                                        | **T142**                                                                    |
| 26           | UF-022 | [#62](https://github.com/NJLaPrell/QuickTask/issues/62)                                                                                        | **T135**                                                                    |

**Total user feedback reports:** **22** (consolidated from 36 legacy items; same coverage, less duplication).

---

## Summary for tasking

| Theme                                                 | UF ids                                                                                                                           | Typical owner                         |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| Install & discover (Marketplace, VSIX)                | **UF-007** (includes UF-006), **UF-008** + **UF-009** (includes UF-010), UF-020; UF-019 **not planned** (README + Releases only) | docs, release, marketplace, extension |
| “Where do I click / type?” (Cursor + extension entry) | UF-004, UF-007, UF-022                                                                                                           | extension, docs                       |
| Trust & filesystem clarity (init, codes, doctor)      | UF-005; UF-017; **UF-021 → T142** (preflight + hint)                                                                             | extension, adapters                   |
| Create vs run & research mental model                 | UF-011–UF-013                                                                                                                    | core messages, adapters, docs         |
| Help & onboarding flow                                | UF-014; UF-016, UF-018 deferred                                                                                                  | docs, adapters, templates             |
| Improve empty input                                   | UF-015                                                                                                                           | core, adapters                        |
| Contributor tooling                                   | UF-002, UF-003                                                                                                                   | monorepo scripts, docs                |

**Suggested next step for maintainers:** Phase 12 is done — run a **Phase 13 kickoff** from product backlog / new feedback, or promote the next `[p]` tasks in `TASKS.md`. Keep this file for **user-voice audit**; open new GitHub issues for net-new reports. **#59** (UF-019) remains the explicit “no separate landing” decision thread.
