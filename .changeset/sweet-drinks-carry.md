---
"@quicktask/core": major
"quicktask-vscode": major
"quicktask-openclaw": major
---

## Breaking Changes

- Graduate QuickTask to the `1.0.0` line with finalized command/runtime contracts, including template variable interpolation and portability command surfaces (`export`, `import`, `import-pack`).

## Features

- Add deterministic template-variable support with missing-variable guidance.
- Add template export/import flows and local template-pack manifest resolution.
- Add privacy-safe aggregate UX friction diagnostics and baseline template eval harness scaffolding.

## Internal

- Modernize release-critical workflow actions for current GitHub runtime policy and replace deprecated release publish action path with CLI publish.
