import { parseQtCommand } from "./parser.js";
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  checkTaskStoreHealth,
  createFileTaskStore,
  getTaskTemplate,
  listTaskNames,
  saveTaskTemplate,
  type FileTaskStore
} from "./store.js";
import { resolveLocalTemplatePack } from "./templatePacks.js";
import {
  extractTemplateVariables,
  interpolateTemplateVariables,
  parseRuntimeVariableInput
} from "./templateVariables.js";
import { createTaskTemplate, proposeTemplateImprovement } from "./templates.js";
import type {
  ImprovementProposalStatus,
  QtRuntimeResult,
  RuntimeDiagnosticEvent
} from "./types.js";

type PendingProposal = {
  taskName: string;
  oldTemplate: string;
  proposedTemplate: string;
  status: ImprovementProposalStatus;
  createdAtMs: number;
};

type PersistedProposalRecord = {
  proposalId: string;
  taskName: string;
  oldTemplate: string;
  proposedTemplate: string;
  status: ImprovementProposalStatus;
  createdAtMs: number;
};

const QT_RUNTIME_VERSION = "1.1.0";
const MAX_PROPOSAL_CACHE_SIZE = 200;
const STARTER_TEMPLATES: Array<{ taskName: string; instructions: string }> = [
  { taskName: "standup", instructions: "Summarize yesterday/today/blockers in concise bullets." },
  {
    taskName: "incident-triage",
    instructions: "Collect incident facts, impact, owner, and next action."
  },
  {
    taskName: "release-notes",
    instructions: "Draft user-facing release notes from merged changes."
  },
  {
    taskName: "pr-review",
    instructions: "Review pull requests for risks, regressions, and missing tests."
  }
];
const HELP_TOPICS: Record<string, { usage: string[]; message: string }> = {
  create: {
    usage: ["/qt [task] [instructions]"],
    message: "Create a new task template with instructions."
  },
  run: {
    usage: ["/qt/[task] [input]"],
    message: "Run an existing task template with optional input."
  },
  improve: {
    usage: [
      "/qt improve [task] [input]",
      "/qt improve <accept|reject|abandon> [task] [proposal-id]"
    ],
    message: "Propose and manage template improvements with restart-safe proposal state."
  },
  actions: {
    usage: ["/qt improve <accept|reject|abandon> [task] [proposal-id]"],
    message: "Apply, reject, or abandon a persisted active proposal."
  },
  discover: {
    usage: [
      "/qt list",
      "/qt show [task]",
      "/qt doctor",
      "/qt export [task|--all]",
      "/qt import [--force] [payload-json]",
      "/qt import-pack [--force] [manifest-path]"
    ],
    message: "Discover templates and inspect local runtime health."
  }
};

function getRuntimeStatePaths(tasksDir: string): { stateDir: string; proposalsPath: string } {
  const stateDir = path.resolve(tasksDir, "..", ".quicktask");
  return {
    stateDir,
    proposalsPath: path.join(stateDir, "proposals.json")
  };
}

export type CreateQtRuntimeOptions = {
  proposalTtlMs?: number;
  now?: () => number;
};

export function createQtRuntime(
  store: FileTaskStore = createFileTaskStore(),
  options: CreateQtRuntimeOptions = {}
) {
  const proposals = new Map<string, PendingProposal>();
  const diagnostics: RuntimeDiagnosticEvent[] = [];
  let requestCounter = 0;
  const proposalTtlMs = options.proposalTtlMs ?? 30 * 60 * 1000;
  const now = options.now ?? (() => Date.now());
  const statePaths = getRuntimeStatePaths(store.tasksDir);
  const feedbackSignals = {
    clarificationCount: 0,
    incompleteCount: 0,
    parseErrorCount: 0,
    storageErrorCount: 0,
    missingTaskCount: 0
  };

  function nextRequestId(): string {
    requestCounter += 1;
    return `qt-${Date.now().toString(36)}-${requestCounter.toString(36)}`;
  }

  function recordDiagnostic(event: RuntimeDiagnosticEvent): void {
    diagnostics.push(event);
    if (diagnostics.length > 100) {
      diagnostics.shift();
    }
  }

  function finalizeResult(
    requestId: string,
    commandKind: RuntimeDiagnosticEvent["commandKind"],
    result: QtRuntimeResult
  ): QtRuntimeResult {
    recordDiagnostic({
      requestId,
      timestamp: new Date().toISOString(),
      phase: "command.completed",
      commandKind,
      code: result.code
    });
    return result;
  }

  function isProposalExpired(proposal: PendingProposal): boolean {
    return now() - proposal.createdAtMs > proposalTtlMs;
  }

  function loadPersistedProposals(): void {
    if (!existsSync(statePaths.proposalsPath)) {
      return;
    }
    try {
      const records = JSON.parse(readFileSync(statePaths.proposalsPath, "utf8")) as
        | PersistedProposalRecord[]
        | undefined;
      if (!Array.isArray(records)) {
        return;
      }
      for (const record of records) {
        if (
          !record ||
          typeof record.proposalId !== "string" ||
          typeof record.taskName !== "string" ||
          typeof record.oldTemplate !== "string" ||
          typeof record.proposedTemplate !== "string" ||
          typeof record.createdAtMs !== "number"
        ) {
          continue;
        }
        proposals.set(record.proposalId, {
          taskName: record.taskName,
          oldTemplate: record.oldTemplate,
          proposedTemplate: record.proposedTemplate,
          status: record.status,
          createdAtMs: record.createdAtMs
        });
      }
    } catch {
      // Ignore malformed state and continue startup safely.
    }
  }

  function persistProposals(): void {
    mkdirSync(statePaths.stateDir, { recursive: true });
    const payload: PersistedProposalRecord[] = [...proposals.entries()].map(
      ([proposalId, proposal]) => ({
        proposalId,
        taskName: proposal.taskName,
        oldTemplate: proposal.oldTemplate,
        proposedTemplate: proposal.proposedTemplate,
        status: proposal.status,
        createdAtMs: proposal.createdAtMs
      })
    );
    const tempPath = `${statePaths.proposalsPath}.${process.pid}.${Date.now()}.tmp`;
    writeFileSync(tempPath, JSON.stringify(payload, null, 2), "utf8");
    renameSync(tempPath, statePaths.proposalsPath);
  }

  function collectProposalGarbage(): boolean {
    let mutated = false;
    for (const [proposalId, proposal] of proposals) {
      if (isProposalExpired(proposal)) {
        proposals.delete(proposalId);
        mutated = true;
      }
    }

    if (proposals.size <= MAX_PROPOSAL_CACHE_SIZE) {
      return mutated;
    }

    const finalizedByAge = [...proposals.entries()]
      .filter(([, proposal]) => proposal.status !== "proposed")
      .sort((a, b) => a[1].createdAtMs - b[1].createdAtMs);

    for (const [proposalId] of finalizedByAge) {
      if (proposals.size <= MAX_PROPOSAL_CACHE_SIZE) {
        break;
      }
      proposals.delete(proposalId);
      mutated = true;
    }
    return mutated;
  }

  function buildExportPayload(taskNames: string[]): string {
    const tasks = taskNames
      .map((taskName) => getTaskTemplate(store, taskName))
      .filter((template): template is NonNullable<typeof template> => Boolean(template))
      .map((template) => ({
        taskName: template.taskName,
        body: template.body
      }));
    return JSON.stringify(
      {
        type: "quicktask-export",
        version: 1,
        generatedAt: new Date().toISOString(),
        tasks
      },
      null,
      2
    );
  }

  function importTasksFromPayload(
    payload: string,
    force: boolean
  ): {
    code: "qt:import:created" | "qt:import:updated" | "qt:import:conflict" | "qt:import:invalid";
    createdCount: number;
    updatedCount: number;
    skippedCount: number;
    message: string;
  } {
    let parsed: unknown;
    try {
      parsed = JSON.parse(payload);
    } catch (error) {
      return {
        code: "qt:import:invalid",
        createdCount: 0,
        updatedCount: 0,
        skippedCount: 0,
        message: `Import payload is not valid JSON: ${
          error instanceof Error ? error.message : "unknown parse error"
        }`
      };
    }

    const records: Array<{ taskName: string; body: string }> = [];
    if (
      parsed &&
      typeof parsed === "object" &&
      "type" in parsed &&
      (parsed as { type?: unknown }).type === "quicktask-export"
    ) {
      const tasks = (parsed as { tasks?: unknown }).tasks;
      if (!Array.isArray(tasks)) {
        return {
          code: "qt:import:invalid",
          createdCount: 0,
          updatedCount: 0,
          skippedCount: 0,
          message: "Import payload must include a tasks array."
        };
      }
      for (const task of tasks) {
        if (!task || typeof task !== "object") {
          continue;
        }
        const candidate = task as Record<string, unknown>;
        if (typeof candidate.taskName === "string" && typeof candidate.body === "string") {
          records.push({
            taskName: candidate.taskName,
            body: candidate.body
          });
        }
      }
    } else if (parsed && typeof parsed === "object") {
      const single = parsed as Record<string, unknown>;
      if (typeof single.taskName === "string" && typeof single.body === "string") {
        records.push({
          taskName: single.taskName,
          body: single.body
        });
      }
    }

    if (records.length === 0) {
      return {
        code: "qt:import:invalid",
        createdCount: 0,
        updatedCount: 0,
        skippedCount: 0,
        message: "Import payload did not include any valid task records."
      };
    }

    let createdCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    for (const record of records) {
      const existing = getTaskTemplate(store, record.taskName);
      if (existing && !force) {
        skippedCount += 1;
        continue;
      }
      saveTaskTemplate(store, {
        taskName: record.taskName,
        filename: "",
        body: record.body
      });
      if (existing) {
        updatedCount += 1;
      } else {
        createdCount += 1;
      }
    }

    if (createdCount === 0 && updatedCount === 0) {
      return {
        code: "qt:import:conflict",
        createdCount,
        updatedCount,
        skippedCount,
        message:
          "No tasks imported because all records conflict with existing templates. Re-run with --force."
      };
    }

    return {
      code: updatedCount > 0 ? "qt:import:updated" : "qt:import:created",
      createdCount,
      updatedCount,
      skippedCount,
      message: `Imported ${createdCount + updatedCount} task template${
        createdCount + updatedCount === 1 ? "" : "s"
      } (${createdCount} created, ${updatedCount} updated, ${skippedCount} skipped).`
    };
  }

  loadPersistedProposals();
  if (collectProposalGarbage()) {
    persistProposals();
  }

  return {
    store,
    getDiagnostics(): RuntimeDiagnosticEvent[] {
      return diagnostics.slice();
    },
    handle(input: string): QtRuntimeResult {
      const requestId = nextRequestId();
      let commandKind: RuntimeDiagnosticEvent["commandKind"] = "invalid_input";
      try {
        const command = parseQtCommand(input);
        commandKind = command.kind;
        recordDiagnostic({
          requestId,
          timestamp: new Date().toISOString(),
          phase: "command.received",
          commandKind
        });

        if (command.kind === "menu") {
          collectProposalGarbage();
          return finalizeResult(requestId, command.kind, {
            kind: "help",
            code: "qt:help",
            usage: [
              "/qt",
              "/qt init",
              "/qt [task] [instructions]",
              "/qt/[task] [input]",
              "/qt improve [task] [input]",
              "/qt export [task|--all]",
              "/qt import [--force] [payload-json]",
              "/qt import-pack [--force] [manifest-path]",
              "/qt list",
              "/qt show [task]",
              "/qt doctor"
            ]
          });
        }

        if (command.kind === "help") {
          collectProposalGarbage();
          if (!command.topic) {
            return finalizeResult(requestId, command.kind, {
              kind: "help",
              code: "qt:help",
              usage: [
                "/qt",
                "/qt init",
                "/qt [task] [instructions]",
                "/qt/[task] [input]",
                "/qt improve [task] [input]",
                "/qt export [task|--all]",
                "/qt import [--force] [payload-json]",
                "/qt import-pack [--force] [manifest-path]",
                "/qt list",
                "/qt show [task]",
                "/qt doctor",
                "/qt help [create|run|improve|actions|discover]"
              ],
              message: "Use /qt help [topic] for contextual command guidance."
            });
          }

          const topic = HELP_TOPICS[command.topic];
          if (!topic) {
            return finalizeResult(requestId, command.kind, {
              kind: "help",
              code: "qt:help",
              usage: [
                "/qt help [create|run|improve|actions|discover]",
                "/qt",
                "/qt init",
                "/qt list",
                "/qt doctor"
              ],
              message: `Unknown help topic "${command.topic}". Valid topics: create, run, improve, actions, discover.`
            });
          }

          return finalizeResult(requestId, command.kind, {
            kind: "help",
            code: "qt:help",
            usage: topic.usage,
            message: topic.message
          });
        }

        if (command.kind === "init") {
          collectProposalGarbage();
          const createdAssets: string[] = [];
          const skippedAssets: string[] = [];
          const warnings: string[] = [];
          try {
            const tasksDirExisted = existsSync(store.tasksDir);
            mkdirSync(store.tasksDir, { recursive: true });
            if (tasksDirExisted) {
              skippedAssets.push("tasks/");
            } else {
              createdAssets.push("tasks/");
            }

            for (const starter of STARTER_TEMPLATES) {
              const existing = getTaskTemplate(store, starter.taskName);
              if (existing) {
                skippedAssets.push(`tasks/${existing.filename}`);
                continue;
              }
              try {
                const created = saveTaskTemplate(
                  store,
                  createTaskTemplate(starter.taskName, starter.instructions)
                );
                createdAssets.push(`tasks/${created.filename}`);
              } catch (error) {
                warnings.push(
                  `Failed to seed starter template "${starter.taskName}": ${
                    error instanceof Error ? error.message : "unknown error"
                  }`
                );
              }
            }

            const nextCommands = [
              "/qt list",
              "/qt show standup",
              "/qt/standup today's updates",
              "/qt improve standup include risks and blockers"
            ];
            const onlySkipped = createdAssets.length === 0 && warnings.length === 0;
            if (warnings.length > 0) {
              return finalizeResult(requestId, command.kind, {
                kind: "init_status",
                code: "qt:init:partial",
                status: "partial",
                createdAssets,
                skippedAssets,
                warnings,
                nextCommands,
                message: "QuickTask initialization completed with warnings."
              });
            }

            return finalizeResult(requestId, command.kind, {
              kind: "init_status",
              code: onlySkipped ? "qt:init:already-initialized" : "qt:init:initialized",
              status: onlySkipped ? "already_initialized" : "initialized",
              createdAssets,
              skippedAssets,
              nextCommands,
              message: onlySkipped
                ? "QuickTask is already initialized."
                : "QuickTask initialization completed."
            });
          } catch (error) {
            return finalizeResult(requestId, command.kind, {
              kind: "error",
              code: "qt:init:failed",
              diagnosticCode: "init-bootstrap-failure",
              requestId,
              message:
                error instanceof Error
                  ? `QuickTask initialization failed: ${error.message}`
                  : "QuickTask initialization failed."
            });
          }
        }

        if (command.kind === "list") {
          collectProposalGarbage();
          const tasks = listTaskNames(store);
          const message =
            tasks.length === 0
              ? "No task templates found yet."
              : `Found ${tasks.length} task template${tasks.length === 1 ? "" : "s"}.`;
          return finalizeResult(requestId, command.kind, {
            kind: "list",
            code: "qt:list:listed",
            tasks,
            message
          });
        }

        if (command.kind === "export") {
          collectProposalGarbage();
          if (command.all) {
            const taskNames = listTaskNames(store);
            const payload = buildExportPayload(taskNames);
            return finalizeResult(requestId, command.kind, {
              kind: "exported",
              code: "qt:export:all",
              taskCount: taskNames.length,
              payload,
              message: `Exported ${taskNames.length} task template${
                taskNames.length === 1 ? "" : "s"
              }.`
            });
          }

          const taskName = command.taskName ?? "";
          const template = getTaskTemplate(store, taskName);
          if (!template) {
            feedbackSignals.missingTaskCount += 1;
            return finalizeResult(requestId, command.kind, {
              kind: "not_found",
              code: "qt:run:not-found",
              taskName,
              message: `No template exists yet for ${taskName}.`
            });
          }

          const payload = buildExportPayload([taskName]);
          return finalizeResult(requestId, command.kind, {
            kind: "exported",
            code: "qt:export:task",
            taskName,
            taskCount: 1,
            payload,
            message: `Exported task template ${taskName}.`
          });
        }

        if (command.kind === "import") {
          collectProposalGarbage();
          const imported = importTasksFromPayload(command.payload, command.force);
          return finalizeResult(requestId, command.kind, {
            kind: "imported",
            code: imported.code,
            createdCount: imported.createdCount,
            updatedCount: imported.updatedCount,
            skippedCount: imported.skippedCount,
            message: imported.message
          });
        }

        if (command.kind === "import_pack") {
          collectProposalGarbage();
          const resolved = resolveLocalTemplatePack(command.manifestPath);
          if (!resolved.ok || !resolved.resolved) {
            const notFoundError = resolved.errors.find((error) => error.includes("not found"));
            if (notFoundError) {
              return finalizeResult(requestId, command.kind, {
                kind: "not_found",
                code: "qt:pack:not-found",
                taskName: command.manifestPath,
                message: `Template pack manifest not found: ${command.manifestPath}.`
              });
            }

            return finalizeResult(requestId, command.kind, {
              kind: "pack_resolved",
              code: "qt:pack:invalid",
              manifestPath: command.manifestPath,
              importedCount: 0,
              skippedCount: 0,
              message: `Template pack manifest is invalid: ${resolved.errors.join("; ")}`
            });
          }

          let importedCount = 0;
          let skippedCount = 0;
          for (const template of resolved.resolved.templates) {
            const existing = getTaskTemplate(store, template.taskName);
            if (existing && !command.force) {
              skippedCount += 1;
              continue;
            }
            saveTaskTemplate(store, {
              taskName: template.taskName,
              filename: "",
              body: template.body
            });
            importedCount += 1;
          }

          return finalizeResult(requestId, command.kind, {
            kind: "pack_resolved",
            code: "qt:pack:resolved",
            manifestPath: resolved.resolved.manifestPath,
            importedCount,
            skippedCount,
            message: `Resolved template pack "${resolved.resolved.name}" (${importedCount} imported, ${skippedCount} skipped).`
          });
        }

        if (command.kind === "show") {
          collectProposalGarbage();
          const template = getTaskTemplate(store, command.taskName);
          if (!template) {
            feedbackSignals.missingTaskCount += 1;
            return finalizeResult(requestId, command.kind, {
              kind: "not_found",
              code: "qt:run:not-found",
              taskName: command.taskName,
              message: `No template exists yet for ${command.taskName}.`
            });
          }

          return finalizeResult(requestId, command.kind, {
            kind: "show",
            code: "qt:show:template",
            taskName: template.taskName,
            templateBody: template.body
          });
        }

        if (command.kind === "doctor") {
          collectProposalGarbage();
          const storeHealth = checkTaskStoreHealth(store);
          const recentRuntimeCodes = diagnostics
            .map((event) => event.code)
            .filter((code): code is string => typeof code === "string")
            .slice(-5);

          return finalizeResult(requestId, command.kind, {
            kind: "doctor",
            code: "qt:doctor:status",
            diagnostics: {
              tasksDir: storeHealth.tasksDir,
              writable: storeHealth.writable,
              taskCount: storeHealth.taskCount,
              storageError: storeHealth.storageError,
              recentRuntimeCodes,
              runtimeVersion: QT_RUNTIME_VERSION,
              feedbackSignals: { ...feedbackSignals }
            }
          });
        }

        if (command.kind === "create") {
          collectProposalGarbage();
          if (!command.instructions.trim()) {
            feedbackSignals.clarificationCount += 1;
            return finalizeResult(requestId, command.kind, {
              kind: "clarification",
              code: "qt:create:clarify",
              taskName: command.taskName,
              usage: `/qt ${command.taskName} [instructions]`,
              message: `Please provide instructions for ${command.taskName}.`
            });
          }

          const existingTemplate = getTaskTemplate(store, command.taskName);
          if (existingTemplate) {
            return finalizeResult(requestId, command.kind, {
              kind: "already_exists",
              code: "qt:create:already-exists",
              taskName: command.taskName,
              message: `A template already exists for ${command.taskName}. Use /qt/${command.taskName} [input] to run it or /qt improve ${command.taskName} [input] to propose changes.`
            });
          }

          const template = createTaskTemplate(command.taskName, command.instructions);
          saveTaskTemplate(store, template);
          return finalizeResult(requestId, command.kind, {
            kind: "created",
            code: "qt:create:created",
            taskName: template.taskName,
            filename: template.filename,
            templateBody: template.body
          });
        }

        if (command.kind === "incomplete") {
          collectProposalGarbage();
          feedbackSignals.incompleteCount += 1;
          return finalizeResult(requestId, command.kind, {
            kind: "incomplete",
            code: "qt:incomplete",
            usage: command.usage,
            message: `Missing required input. Usage: ${command.usage}`
          });
        }

        if (command.kind === "improve_action") {
          const proposal = proposals.get(command.proposalId);
          if (!proposal || proposal.taskName !== command.taskName) {
            return finalizeResult(requestId, command.kind, {
              kind: "not_found",
              code: "qt:improve:proposal-not-found",
              taskName: command.taskName,
              message: `No active proposal exists for ${command.taskName} with ID ${command.proposalId}. It may be expired, finalized, or missing from persisted proposal state.`
            });
          }

          if (isProposalExpired(proposal)) {
            proposal.status = "expired";
            proposals.delete(command.proposalId);
            persistProposals();
            return finalizeResult(requestId, command.kind, {
              kind: "improve_action",
              code: "qt:improve:proposal-expired",
              taskName: proposal.taskName,
              action: command.action,
              proposalId: command.proposalId,
              status: proposal.status,
              message: `Proposal ${command.proposalId} expired before action. Create a new proposal with /qt improve ${proposal.taskName} [input].`
            });
          }

          if (proposal.status !== "proposed") {
            return finalizeResult(requestId, command.kind, {
              kind: "improve_action",
              code: "qt:improve:already-finalized",
              taskName: proposal.taskName,
              action: command.action,
              proposalId: command.proposalId,
              status: proposal.status,
              message: `Proposal ${command.proposalId} is already ${proposal.status}.`
            });
          }

          if (command.action === "accept") {
            saveTaskTemplate(store, {
              taskName: proposal.taskName,
              filename: "",
              body: proposal.proposedTemplate
            });
            proposal.status = "accepted";
            if (collectProposalGarbage()) {
              persistProposals();
            } else {
              persistProposals();
            }
            return finalizeResult(requestId, command.kind, {
              kind: "improve_action",
              code: "qt:improve:accept:applied",
              taskName: proposal.taskName,
              action: command.action,
              proposalId: command.proposalId,
              status: proposal.status,
              message: `Proposal ${command.proposalId} accepted and applied to ${proposal.taskName}.`
            });
          }

          proposal.status = command.action === "reject" ? "rejected" : "abandoned";
          if (collectProposalGarbage()) {
            persistProposals();
          } else {
            persistProposals();
          }
          return finalizeResult(requestId, command.kind, {
            kind: "improve_action",
            code:
              command.action === "reject"
                ? "qt:improve:reject:recorded"
                : "qt:improve:abandon:recorded",
            taskName: proposal.taskName,
            action: command.action,
            proposalId: command.proposalId,
            status: proposal.status,
            message: `Proposal ${command.proposalId} ${proposal.status}.`
          });
        }

        if (command.kind === "run") {
          collectProposalGarbage();
          const template = getTaskTemplate(store, command.taskName);
          if (!template) {
            feedbackSignals.missingTaskCount += 1;
            return finalizeResult(requestId, command.kind, {
              kind: "not_found",
              code: "qt:run:not-found",
              taskName: command.taskName,
              message: `No template exists yet for ${command.taskName}.`
            });
          }

          const declarations = extractTemplateVariables(template.body);
          let renderedTemplate = template.body;
          if (declarations.length > 0) {
            const values = parseRuntimeVariableInput(command.userInput);
            const interpolation = interpolateTemplateVariables(template.body, values);
            if (interpolation.missingVariables.length > 0) {
              feedbackSignals.incompleteCount += 1;
              return finalizeResult(requestId, command.kind, {
                kind: "run_missing_variables",
                code: "qt:run:missing-variables",
                taskName: template.taskName,
                missingVariables: interpolation.missingVariables,
                usage: `/qt/${template.taskName} ${interpolation.missingVariables
                  .map((name) => `${name}=<value>`)
                  .join(" ")}`,
                message: `Missing required template variables: ${interpolation.missingVariables.join(", ")}.`
              });
            }
            renderedTemplate = interpolation.output;
          }

          return finalizeResult(requestId, command.kind, {
            kind: "run_executed",
            code: "qt:run:executed",
            taskName: template.taskName,
            templateBody: renderedTemplate,
            userInput: command.userInput
          });
        }

        if (collectProposalGarbage()) {
          persistProposals();
        }
        const template = getTaskTemplate(store, command.taskName);
        if (!template) {
          feedbackSignals.missingTaskCount += 1;
          return finalizeResult(requestId, command.kind, {
            kind: "not_found",
            code: "qt:improve:not-found",
            taskName: command.taskName,
            message: `No template exists yet for ${command.taskName}.`
          });
        }

        const proposal = proposeTemplateImprovement(
          command.taskName,
          template.body,
          command.userInput
        );
        proposals.set(proposal.proposalId, {
          taskName: command.taskName,
          oldTemplate: proposal.oldTemplate,
          proposedTemplate: proposal.proposedTemplate,
          status: "proposed",
          createdAtMs: now()
        });
        if (collectProposalGarbage()) {
          persistProposals();
        } else {
          persistProposals();
        }

        return finalizeResult(requestId, command.kind, {
          kind: "improve_proposed",
          code: "qt:improve:proposed",
          taskName: command.taskName,
          proposalId: proposal.proposalId,
          source: proposal.source,
          oldTemplate: proposal.oldTemplate,
          proposedTemplate: proposal.proposedTemplate
        });
      } catch (error) {
        const isParseError =
          error instanceof Error && error.message === "Input is not a QuickTask command.";
        const errorCode: "qt:parse:error" | "qt:storage:error" = isParseError
          ? "qt:parse:error"
          : "qt:storage:error";
        const diagnosticCode: "parse-invalid-input" | "storage-io-failure" = isParseError
          ? "parse-invalid-input"
          : "storage-io-failure";
        if (isParseError) {
          feedbackSignals.parseErrorCount += 1;
        } else {
          feedbackSignals.storageErrorCount += 1;
        }

        recordDiagnostic({
          requestId,
          timestamp: new Date().toISOString(),
          phase: "command.failed",
          commandKind,
          code: errorCode
        });
        return {
          kind: "error",
          code: errorCode,
          diagnosticCode,
          requestId,
          message:
            error instanceof Error
              ? error.message
              : "An unknown runtime error occurred while handling QuickTask command."
        };
      }
    }
  };
}
