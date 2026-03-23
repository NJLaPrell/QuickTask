# Workspace Kit Friction Log

Maintainer-facing view of the workspace-kit improvement loop.

## Source of truth

- Canonical log data: `.workspace-kit/improvement-log.json`
- Validation command: `pnpm workspace-kit:improvement-log:validate`
- Summary generator: `pnpm workspace-kit:improvement-log:generate`
- Generated summary: `.workspace-kit/generated/improvement-summary.json`

Do not treat this markdown file as the canonical datastore. Update the JSON log first, then regenerate summary artifacts.

## Record fields

Each JSON record follows this contract:

- `id` (`F###`)
- `title`
- `status` (`open`, `in_progress`, `resolved`, `accepted_risk`, `archived`)
- `severity` (`low`, `medium`, `high`)
- `category`
- `source.kind` (`manual`, `ci`, `release_prepare`, `session_retro`)
- `source.reference`
- `detectedAt`, `lastUpdated` (`YYYY-MM-DD`)
- `promptIntent`
- `frictionObserved`
- `proposedChange`
- `affectedAreas` (non-empty string array)
- `followUpTaskId` (`T###`, optional)
- `releaseImpact` (`none`, `note_only`, `requires_change`)
- `disposition` (required for high-severity by policy)

## Policy knobs

Policy configuration is kept in `.workspace-kit/improvement-log.json` under `policy`:

- `reviewCadence`
- `severityLevels`
- `categoryTaxonomy`
- `requiredFieldsBySeverity`
- `archivePolicy`

These policy values are intentionally configurable and are enforced by `workspace-kit:improvement-log:validate`.
