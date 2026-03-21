# QuickTask Adapter Rendering Matrix

This document defines how host adapters should render `QtRuntimeResult` responses from `@quicktask/core`.

Use this file together with `docs/qt-command-result-contract.md`:

- `qt-command-result-contract.md` is the source of truth for command and code definitions.
- this matrix is the source of truth for host UX behavior.

## Required host behavior (all adapters)

- Match behavior by `result.code` first.
- Treat unknown codes as non-fatal and show a safe fallback.
- Never drop `requestId` for `kind: 'error'`; surface it for support/debug.
- Avoid logging sensitive user input; prefer code, task name, and request ID.

## Result payload reference

| Code                            | Kind               | Required fields beyond `kind`/`code`                                  |
| ------------------------------- | ------------------ | --------------------------------------------------------------------- |
| `qt:help`                       | `help`             | `usage[]`                                                             |
| `qt:create:clarify`             | `clarification`    | `taskName`, `usage`, `message`                                        |
| `qt:create:already-exists`      | `already_exists`   | `taskName`, `message`                                                 |
| `qt:create:created`             | `created`          | `taskName`, `filename`, `templateBody`                                |
| `qt:incomplete`                 | `incomplete`       | `usage`, `message`                                                    |
| `qt:run:not-found`              | `not_found`        | `taskName`, `message`                                                 |
| `qt:run:executed`               | `run_executed`     | `taskName`, `templateBody`, `userInput`                               |
| `qt:improve:not-found`          | `not_found`        | `taskName`, `message`                                                 |
| `qt:improve:proposal-not-found` | `not_found`        | `taskName`, `message`                                                 |
| `qt:improve:proposed`           | `improve_proposed` | `taskName`, `proposalId`, `source`, `oldTemplate`, `proposedTemplate` |
| `qt:improve:accept:applied`     | `improve_action`   | `taskName`, `action`, `proposalId`, `status`, `message`               |
| `qt:improve:reject:recorded`    | `improve_action`   | `taskName`, `action`, `proposalId`, `status`, `message`               |
| `qt:improve:abandon:recorded`   | `improve_action`   | `taskName`, `action`, `proposalId`, `status`, `message`               |
| `qt:improve:proposal-expired`   | `improve_action`   | `taskName`, `action`, `proposalId`, `status`, `message`               |
| `qt:improve:already-finalized`  | `improve_action`   | `taskName`, `action`, `proposalId`, `status`, `message`               |
| `qt:parse:error`                | `error`            | `diagnosticCode`, `requestId`, `message`                              |
| `qt:storage:error`              | `error`            | `diagnosticCode`, `requestId`, `message`                              |

## Rendering matrix by host

| Result code                     | VS Code extension                                           | Cursor command adapter                                                  | OpenClaw plugin                                              |
| ------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------ |
| `qt:help`                       | Show command usage list in info panel or chat response.     | Return usage list to command output.                                    | Show usage list in plugin response area.                     |
| `qt:create:clarify`             | Show warning with exact usage hint.                         | Show warning and keep user in input loop.                               | Show guidance in response panel with suggested command form. |
| `qt:create:already-exists`      | Show non-fatal warning; do not overwrite.                   | Show warning and suggest `/qt improve`.                                 | Show warning and suggested next action.                      |
| `qt:create:created`             | Show success with created filename and preview snippet.     | Show success with task and filename.                                    | Show success toast/panel message and include filename.       |
| `qt:incomplete`                 | Show warning with `usage`.                                  | Show warning and let user retry with full command.                      | Show warning with required command shape.                    |
| `qt:run:not-found`              | Show warning and suggest create command.                    | Show warning and suggest `/qt [task] [instructions]`.                   | Show warning and suggest create flow.                        |
| `qt:run:executed`               | Render template plus user input in execution panel.         | Return rendered output payload to command client.                       | Render template and input in plugin output surface.          |
| `qt:improve:not-found`          | Show warning that task template is missing.                 | Show warning and suggest creating the task first.                       | Show warning and suggested create command.                   |
| `qt:improve:proposal-not-found` | Show warning that proposal is unavailable/session-scoped.   | Show warning and suggest generating a new proposal.                     | Show warning with lifecycle guidance.                        |
| `qt:improve:proposed`           | Show side-by-side old vs proposed template and proposal ID. | Return proposal object and emphasize proposal ID for follow-up actions. | Render comparison and copyable proposal ID.                  |
| `qt:improve:accept:applied`     | Show success and confirm template was updated on disk.      | Show success with applied status and proposal ID.                       | Show success with applied state.                             |
| `qt:improve:reject:recorded`    | Show info-level state update (no template mutation).        | Show info-level update with status and proposal ID.                     | Show info-level update only.                                 |
| `qt:improve:abandon:recorded`   | Show info-level state update (proposal closed).             | Show info-level update with status and proposal ID.                     | Show info-level update only.                                 |
| `qt:improve:proposal-expired`   | Show warning to generate a new proposal.                    | Show warning with retry guidance.                                       | Show warning with retry guidance.                            |
| `qt:improve:already-finalized`  | Show info-level idempotent status result.                   | Show idempotent status message.                                         | Show idempotent status message.                              |
| `qt:parse:error`                | Show error with safe message and request ID.                | Return error payload with request ID surfaced.                          | Show error message with request ID.                          |
| `qt:storage:error`              | Show error with safe message and request ID; suggest retry. | Return error payload with request ID and retry suggestion.              | Show error message with request ID and retry guidance.       |

## Unknown/new code fallback

When adapters receive a code not listed above:

1. Render a generic non-crashing message: "QuickTask returned an unsupported result code."
2. Include `result.code` and any `requestId` when present.
3. Log safe diagnostics (`code`, `kind`, `taskName`, `requestId`) without raw template/user input.
4. Continue execution without throwing host-level exceptions.

## Adapter integration checklist

- Consume `@quicktask/core` from public exports only.
- Add a result-code switch/table that covers every code in this matrix.
- Keep unknown-code fallback path active and tested.
- Ensure parse/storage errors display `requestId`.
- Ensure improve proposal renderers expose `proposalId` for action commands.
- Keep host docs linking to this matrix and `docs/qt-command-result-contract.md`.
