import { parseQtCommand } from "./parser.js";
import {
  checkTaskStoreHealth,
  createFileTaskStore,
  getTaskTemplate,
  listTaskNames,
  saveTaskTemplate,
  type FileTaskStore
} from "./store.js";
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

const QT_RUNTIME_VERSION = "1.1.0";

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
          return finalizeResult(requestId, command.kind, {
            kind: "help",
            code: "qt:help",
            usage: [
              "/qt",
              "/qt [task] [instructions]",
              "/qt/[task] [input]",
              "/qt improve [task] [input]",
              "/qt list",
              "/qt show [task]",
              "/qt doctor"
            ]
          });
        }

        if (command.kind === "list") {
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

        if (command.kind === "show") {
          const template = getTaskTemplate(store, command.taskName);
          if (!template) {
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
              runtimeVersion: QT_RUNTIME_VERSION
            }
          });
        }

        if (command.kind === "create") {
          if (!command.instructions.trim()) {
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
              message: `No active proposal exists for ${command.taskName} with ID ${command.proposalId}. Proposals are session-scoped and may expire or be cleared after restart.`
            });
          }

          if (isProposalExpired(proposal)) {
            proposal.status = "expired";
            proposals.delete(command.proposalId);
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
          const template = getTaskTemplate(store, command.taskName);
          if (!template) {
            return finalizeResult(requestId, command.kind, {
              kind: "not_found",
              code: "qt:run:not-found",
              taskName: command.taskName,
              message: `No template exists yet for ${command.taskName}.`
            });
          }

          return finalizeResult(requestId, command.kind, {
            kind: "run_executed",
            code: "qt:run:executed",
            taskName: template.taskName,
            templateBody: template.body,
            userInput: command.userInput
          });
        }

        const template = getTaskTemplate(store, command.taskName);
        if (!template) {
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
