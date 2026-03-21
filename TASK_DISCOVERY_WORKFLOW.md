# QuickTask Task Discovery Workflow

This workflow codifies how the agent discovers and proposes new development tasks.

## Intent

- Triggered when the user asks to discover new tasks for development.
- Reviews project docs and code to identify high-value improvement work.
- Automatically appends discovered tasks to `TASKS.md` with status `[p]` (proposed).
- Keeps discovery scoped to actionable product improvement work.

## Discovery defaults

- Run mode: manual (only when user asks).
- Auto-intake: enabled (append to `TASKS.md` as proposed).
- Maximum new tasks per run: 10.
- Discovery scope: both incremental improvements and larger roadmap features.
- Severity field: optional for discovered tasks.
- Rejected ideas list: not required.

## Required review inputs

Before proposing tasks, review at minimum:

1. `README.md`
2. `CONTRIBUTORS.md`
3. `ARCHITECTURE.md`
4. `RELEASE_STRATEGY.md`
5. `PRE_RELEASE_READINESS_WORKFLOW.md`
6. Active tracker: `TASKS.md`
7. Archive context: `TASKS_ARCHIVED.md` (as needed)
8. Current code hotspots and quality signals:
   - large or high-churn files,
   - TODO/FIXME markers,
   - lint/test/build friction,
   - workspace and CI maintainability pain points.

## Discovery categories

Each run should include a balanced mix across:

- maintainability/refactor
- user experience improvements
- net-new feature work
- workspace/CI cleanup and reliability
- additional product improvement opportunities

## Quality bar for each discovered task

Every newly appended proposed task must include:

- task ID (`T###`) and concise title
- status `[p]` and priority (`P0`/`P1`/`P2`)
- goal and expected user/developer impact
- likely files/systems touched
- dependencies/blockers (or `none`)
- concrete acceptance criteria
- practical validation plan/commands

## Intake behavior

1. Detect the next available task ID from `TASKS.md`.
2. Add each discovered item as a new task record with status `[p]`.
3. Place proposed tasks in the active backlog's proposed section.
4. Avoid duplicates with existing open/proposed tasks.
5. Cap the run at 10 proposed tasks unless the user overrides.

## Output expectations

After intake, report:

- how many tasks were added,
- category coverage,
- top 3 recommended next tasks to promote from `[p]` to `[ ]` or `[~]`.

## Promotion guidance

- `[p]` -> `[ ]` when user approves backlog intake.
- `[ ]` -> `[~]` when active implementation starts.
- `[~]` -> `[x]` when done and validated.
