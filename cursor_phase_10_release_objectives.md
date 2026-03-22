# QuickTask first-use transcript (excerpt)

Trimmed to the conversation starting when the user tried QuickTask for the first time in Cursor. Earlier Phase 10/11 release-planning and engineering delivery content was removed as out of scope for this document.

---

**User**

Great. Let's call it good for now. I'm going to try it for the first time. Yes, you heard that. I have given minimal guidence and made you do most the work. Now I want to see what you came up with. Tell me how to set it up here in cursor so I can try it out.

---

**Cursor**

Pulling the repo’s actual quickstart and Cursor-specific notes so the steps match what we shipped.

Here’s the straight shot for **trying QuickTask in Cursor** with **this repo open** (no guilt trip—you’re about to poke the beast).

## 1. Open the repo in Cursor

Open **`/Users/nicklaprell/Workspace/QuickTask`** as the workspace folder (not a random subfolder).

## 2. One-time local setup (terminal in Cursor)

```bash
pnpm install
pnpm build
```

That builds `@quicktask/core` so the sandbox can load it.

## 3. Easiest way to feel it: the sandbox (real runtime, no bullshit)

This runs the same parser/runtime the adapters use and prints JSON:

```bash
pnpm qt:sandbox -- /qt init
pnpm qt:sandbox -- /qt list
pnpm qt:sandbox -- /qt show standup
pnpm qt:sandbox -- '/qt/standup yesterday: shipped stuff, today: try QuickTask, blockers: none'
```

- Templates land under **`tasks/`** in the repo root (unless you pass `--tasks-dir`).
- **`pnpm qt:sandbox -- /qt doctor`** if something’s weird (paths, writes, etc.).

## 4. Using Cursor’s “/qt” wrapper (chat / agent)

You already have **`.cursor/commands/qt.md`**. In Cursor, that’s a **workspace command**—use whatever UI your build uses for **custom slash commands** (often typing **`/`** in chat/composer and picking **`qt`**, or the command palette entry for workspace commands).

Flow:

1. Run **`/qt`** (or open the `qt` command) so the model follows the contract in that file.
2. Then paste real commands like:

```text
/qt init
/qt list
/qt show standup
/qt/standup your standup text here
```

**Reality check:** that file is a **prompt wrapper**. The **actual behavior** still comes from **`@quicktask/core`** + **`tasks/`** on disk—the sandbox proves that; chat is “drive the same thing with guardrails.”

## 5. Optional: “product” feel via extension

If you want Cursor to behave more like a shipped host: grab **`quicktask-vscode-v1.0.0.vsix`** from the **v1.0.0** GitHub release and install **Install from VSIX** in Cursor, then reload. README spells that path under **Cursor (VSIX)**.

---

**TL;DR:** `pnpm install && pnpm build`, then hammer `pnpm qt:sandbox -- /qt …` until it clicks; use the **`qt`** Cursor command when you want the AI to stay on-rails. Have fun—if `doctor` yells at you, it’s usually just “can’t write `tasks/`” or you forgot `build`.

---

**User**

No. Easier. I just want to try the plugin out, not pull the repo down.

---

**Cursor**

Fair — skip the repo entirely. You’re just doing **VSIX + Cursor**.

## Try QuickTask in Cursor (no clone)

1. **Download the VSIX**  
   Go to the **QuickTask** GitHub repo → **Releases** → open **`v1.0.0`** (or latest).  
   Download **`quicktask-vscode-v1.0.0.vsix`** (name may match that pattern).

2. **Install in Cursor**
   - Open Cursor → **Command Palette** (`Cmd+Shift+P` on Mac).
   - Run something like **Extensions: Install from VSIX…** (wording may be “Install from VSIX”).
   - Pick the `.vsix` file.
   - **Reload** the window if Cursor asks.

3. **Use it**
   - Open **any folder** you want templates to live in (your project).
   - Use the extension’s QuickTask entry (chat / command — whatever the extension exposes; often a **QuickTask** or **`/qt`-style** flow in the VS Code-compatible chat if enabled).
   - First run: **`/qt init`** (or equivalent from the extension UI) so it creates **`tasks/`** and starter templates.
   - Then: **`/qt list`**, **`/qt show standup`**, **`/qt/standup …`**.

4. **If it’s dead on arrival**  
   Run **`/qt doctor`** (or the extension’s diagnostics) — usually it’s “wrong folder” or “can’t write `tasks/`”.

That's it: **download VSIX → install from VSIX → reload → init → play**. No `git`, no `pnpm`, no monorepo therapy.

---

**User**

I don't see my plugin on the VSCode market...

---

**Cursor**

Checking how the extension is named and published in the repo.

You're not blind — it's easy to miss because it's basically invisible on Marketplace.

**It _is_ listed**, but with **0 installs** and no overview text, so search often buries it under unrelated "Quick Task" junk.

### Find it reliably

1. **Open the listing directly** (works in browser):  
   **https://marketplace.visualstudio.com/items?itemName=nicklaprell.quicktask-vscode**

2. **Exact names to search**
   - **Display name:** `QuickTask Workflows`
   - **Publisher:** **Nick LaPrell** (Marketplace capitalizes it; your `package.json` has `"publisher": "nicklaprell"`).

3. **Install by ID** (VS Code / some Cursor builds)  
   In Extensions view, try installing:  
   **`nicklaprell.quicktask-vscode`**

### If Cursor still doesn't show Marketplace stuff

Cursor doesn't always mirror the VS Code Marketplace 1:1. Fallback stays the same:

- **GitHub Releases** → download **`quicktask-vscode-v1.0.0.vsix`** → **Install from VSIX** in Cursor.

So: **direct link first**, **VSIX if Cursor's marketplace is being weird**. That's the whole story.

---

**User**

/qt init

---

**Cursor**

Running QuickTask init in your workspace.

**`/qt init` — done.** QuickTask bootstrapped in this workspace.

### What happened

- **Status:** `initialized` (`qt:init:initialized`)
- **Created:** `tasks/` plus starter templates: **standup**, **incident-triage**, **release-notes**, **pr-review**

### Try next (in chat or the extension)

```text
/qt list
/qt show standup
/qt/standup yesterday: … today: … blockers: …
/qt improve standup include risks and blockers
```

**Heads-up:** In _this_ repo, `pnpm qt:sandbox -- /qt init` blew up because `@quicktask/core` isn't linked at the monorepo root — the runtime still works via `packages/core/dist` (what I used). If you want sandbox fixed later, we can wire root deps or change the script import path.

You're initialized; go poke **`/qt list`** and see your shiny new markdown zoo.

---

**User**

/qt list

---

**Cursor**

**`/qt list`**

- **Code:** `qt:list:listed`
- **Message:** Found 4 task templates.

**Tasks:**

- `incident-triage`
- `pr-review`
- `release-notes`
- `standup`

Next fun move: `/qt show standup` or `/qt/standup your standup text here`.

---

**User**

/qt help

---

**Cursor**

**`/qt help`** (`qt:help`)

Use `/qt help [topic]` for focused help. General surface:

| Command                                              |
| ---------------------------------------------------- | ------- |
| `/qt`                                                |
| `/qt init`                                           |
| `/qt [task] [instructions]`                          |
| `/qt/[task] [input]`                                 |
| `/qt improve [task] [input]`                         |
| `/qt export [task                                    | --all]` |
| `/qt import [--force] [payload-json]`                |
| `/qt import-pack [--force] [manifest-path]`          |
| `/qt list`                                           |
| `/qt show [task]`                                    |
| `/qt doctor`                                         |
| `/qt help [create\|run\|improve\|actions\|discover]` |

**Tip:** `/qt help improve` or `/qt help discover` for the cheat-sheet version.

---

**User**

/qt list

---

**Cursor**

**`/qt list`** → `qt:list:listed`

**Found 4 task templates:**

- `incident-triage`
- `pr-review`
- `release-notes`
- `standup`

---

**User**

/qt show standup

---

**Cursor**

**`/qt show standup`** → `qt:show:template`

**Template:**

```md
# standup

- Goal: Summarize yesterday/today/blockers in concise bullets.
- Use the provided user input.
- Return a concise result.
```

Run it with something like: `/qt/standup yesterday: … today: … blockers: …`

---

**User**

/qt standup yesterday

---

**Cursor**

Running what you typed — QuickTask treats `/qt standup …` as **create**, not **run**.

**What you ran:** `/qt standup yesterday`  
That's parsed as **create** (`/qt [task] [instructions]`), not **run**.

**Result:** `qt:create:already-exists` — `standup` is already there from `/qt init`, so it won't overwrite.

**To actually run standup with input "yesterday"**, use the slash form:

```text
/qt/standup yesterday
```

(or more words: `/qt/standup yesterday: shipped X, today: Y, blockers: Z`)

Tiny mnemonic: **`/qt/` = run**, **`/qt `** (space) = create.

---

**User**

/qt test build me a simple template to test out the qt plugin

---

**Cursor**

**Created** `qt:create:created`

You ran **`/qt test …`** as **create**: task name **`test`**, instructions = everything after the first word.

- **File:** `tasks/test.md`
- **Template:**

```md
# test

- Goal: build me a simple template to test out the qt plugin
- Use the provided user input.
- Return a concise result.
```

**Plugin smoke test:**

1. **`/qt show test`**
2. **`/qt/test hello from the plugin`** ← run (note the **`/`** after `qt`)
3. **`/qt improve test add one bullet: expected output format`**
4. Use the proposal id from the response: **`/qt improve accept test <proposal-id>`**

If **`test` already exists** next time you'll get `already-exists` — pick another name or **`/qt improve test …`** instead.

---

**User**

/qt improve test

---

**Cursor**

**`/qt improve test`** → `qt:improve:proposed`

- **Source:** `inferred` (you didn't add extra text, so it guessed a generic refinement)
- **Proposal ID:** `e08249e562b6`

**Proposed change** (appended to your template):

```md
Improvement note for test: refine this template to better handle explicit user input.
```

**Next (pick one):**

- **Apply:** `/qt improve accept test e08249e562b6`
- **Drop:** `/qt improve reject test e08249e562b6`
- **Bail:** `/qt improve abandon test e08249e562b6`

**Better improve next time:** `/qt improve test add a checklist section and example output` so `source` is `explicit` and the diff matches what you want.

---

**User**

/qt research 1. Search the topic given 2. find three high quality results. 3. review and summarize the articles in a way that focuses on direction of the user input.
Provide a brief and concise report that best responds to the user and provide it.

---

**Cursor**

**QuickTask interpreted that as _create_, not "go research the internet".** You got a new template.

**Created:** `research` → `tasks/research.md` (`qt:create:created`)

**Saved template:**

```md
# research

- Goal: 1. Search the topic given 2. find three high quality results. 3. review and summarize the articles in a way that focuses on direction of the user input. Provide a brief and concise report that best responds to the user and provide it.
- Use the provided user input.
- Return a concise result.
```

**To use it with the plugin:**

- **Run it** (this is where you pass the _topic_):  
  `/qt/research <your topic or question here>`

- **Inspect:** `/qt show research`

---

If you meant **"actually do the research right now"** (not define a template), say the **topic** in plain English _without_ the `/qt research …_ create form, e.g. _"Research X and give 3 sources + summary"\* — and I'll search and write the report.

---

**User**

/qt research Best indoor mosquito solution.

---

**Cursor**

Parsing: `/qt research …` is create, not run. Checking the runtime, then running `/qt/research` and fetching current info.

### QuickTask side (what just happened)

You typed **`/qt research Best indoor mosquito solution.`** — that's the **create** form (`/qt [task] [instructions]`), so QuickTask tries to **overwrite-create** `research` and correctly says **already exists**.

**To run the template with that input**, use:

```text
/qt/research Best indoor mosquito solution.
```

I ran that shape locally: **`qt:run:executed`** with your string as `userInput` and your `research` template body.

---

### Brief report (for **Best indoor mosquito solution** — indoor-focused)

**1. CDC — _Preventing mosquito bites_**  
https://www.cdc.gov/mosquitoes/prevention/index.html  
**Takeaway:** First-line defense is **keeping them out** (screens, closed windows/doors, AC when you can) and **eliminating indoor standing water** where some species can breed. When bites still happen, **EPA-registered repellents** (DEET, picaridin, IR3535, OLE/PMD, etc.) are the evidence-backed personal protection layer—**follow the label**.

**2. EPA — _Insect repellents / bite prevention tips_**  
https://www.epa.gov/insect-repellents  
https://www.epa.gov/insect-repellents/tips-prevent-mosquito-bites  
**Takeaway:** Use the **EPA repellent search** to pick a registered product for your scenario; **effectiveness and safety come from registered formulations used as directed**, not from random "natural" brands.

**3. CDC — _Mosquito control at home_**  
https://www.cdc.gov/mosquitoes/mosquito-control/mosquito-control-at-home.html  
**Takeaway:** Treat indoors as **exclude + remove habitat + kill stragglers** (screens, dump/dry water sources, targeted indoor products **as labeled** if needed).

**Practical "best indoor stack" (direction: actually solve indoor bites)**

1. **Fix entry** (screens, gaps, door habits).
2. **Remove indoor breeding sites** (saucers, vases, pet bowls, etc.).
3. **Personal protection**: **EPA-registered repellent** when you're getting bitten.
4. Optional: **UV/suction sticky indoor traps** can reduce some flying biters; treat them as **supplemental**, not a replacement for exclusion + source control.

_(If you're seeing "mosquitoes" indoors but no bites, also consider **fungus gnats**—different fix: dry out soil / address houseplants.)_

**Mnemonic so you don't trip again:** **`/qt/research …` = run**, **`/qt research …` = create/edit template name `research`.**
