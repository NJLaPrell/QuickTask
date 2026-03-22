import type { QtRuntimeResult } from "./types.js";

export type QtRenderStyle = "markdown" | "plain";

function inlineCode(style: QtRenderStyle, value: string): string {
  return style === "markdown" ? `\`${value}\`` : value;
}

function joinLines(lines: string[]): string {
  return lines.filter(Boolean).join("\n");
}

export function formatQtRuntimeResult(result: QtRuntimeResult, style: QtRenderStyle): string {
  switch (result.code) {
    case "qt:help":
      return joinLines([
        "QuickTask command help:",
        ...result.usage.map((entry) =>
          style === "markdown" ? `- ${inlineCode(style, entry)}` : `- ${entry}`
        )
      ]);
    case "qt:create:clarify":
    case "qt:create:already-exists":
    case "qt:incomplete":
    case "qt:run:not-found":
    case "qt:improve:not-found":
    case "qt:improve:proposal-not-found":
      return result.message;
    case "qt:create:created":
      if (style === "markdown") {
        return joinLines([
          `Created template ${inlineCode(style, result.taskName)} (${inlineCode(style, result.filename)}).`,
          "",
          "```md",
          result.templateBody,
          "```"
        ]);
      }
      return `Created ${result.taskName} (${result.filename}).`;
    case "qt:run:executed":
      if (style === "markdown") {
        return joinLines([
          `Running ${inlineCode(style, result.taskName)} with user input:`,
          "",
          "```text",
          result.userInput || "(empty input)",
          "```",
          "",
          "Template:",
          "",
          "```md",
          result.templateBody,
          "```"
        ]);
      }
      return `Run ${result.taskName} with input: ${result.userInput || "(empty input)"}`;
    case "qt:list:listed":
      return joinLines([
        result.message,
        result.tasks.length > 0 ? "" : "",
        ...result.tasks.map((task) => (style === "markdown" ? `- ${inlineCode(style, task)}` : `- ${task}`))
      ]);
    case "qt:show:template":
      if (style === "markdown") {
        return joinLines([
          `Template for ${inlineCode(style, result.taskName)}:`,
          "",
          "```md",
          result.templateBody,
          "```"
        ]);
      }
      return joinLines([`Template for ${result.taskName}:`, result.templateBody]);
    case "qt:doctor:status":
      return joinLines([
        "QuickTask diagnostics:",
        style === "markdown"
          ? `- Tasks dir: ${inlineCode(style, result.diagnostics.tasksDir)}`
          : `- Tasks dir: ${result.diagnostics.tasksDir}`,
        `- Writable: ${result.diagnostics.writable ? "yes" : "no"}`,
        `- Task count: ${result.diagnostics.taskCount}`,
        `- Runtime version: ${result.diagnostics.runtimeVersion}`,
        result.diagnostics.recentRuntimeCodes.length
          ? `- Recent runtime codes: ${result.diagnostics.recentRuntimeCodes.join(", ")}`
          : "- Recent runtime codes: (none)",
        result.diagnostics.storageError ? `- Storage error: ${result.diagnostics.storageError}` : ""
      ]);
    case "qt:improve:proposed":
      if (style === "markdown") {
        return joinLines([
          `Proposed improvement for ${inlineCode(style, result.taskName)} (${result.source}).`,
          `Proposal ID: ${inlineCode(style, result.proposalId)}`,
          "",
          "Old template:",
          "```md",
          result.oldTemplate,
          "```",
          "",
          "Proposed template:",
          "```md",
          result.proposedTemplate,
          "```"
        ]);
      }
      return `Proposed update for ${result.taskName}. Proposal ID: ${result.proposalId}`;
    case "qt:improve:accept:applied":
    case "qt:improve:reject:recorded":
    case "qt:improve:abandon:recorded":
    case "qt:improve:proposal-expired":
    case "qt:improve:already-finalized":
      return result.message;
    case "qt:parse:error":
    case "qt:storage:error":
      return style === "markdown"
        ? `${result.message}\n\nRequest ID: ${inlineCode(style, result.requestId)}`
        : `${result.message} (request: ${result.requestId})`;
    default: {
      const unknownCode = (result as { code?: string }).code ?? "unknown";
      const maybeRequestId = (result as { requestId?: string }).requestId;
      if (style === "markdown") {
        return joinLines([
          "QuickTask returned an unsupported result code.",
          `Code: ${inlineCode(style, unknownCode)}`,
          maybeRequestId ? `Request ID: ${inlineCode(style, maybeRequestId)}` : ""
        ]);
      }
      return maybeRequestId
        ? `QuickTask returned an unsupported result code: ${unknownCode} (request: ${maybeRequestId})`
        : `QuickTask returned an unsupported result code: ${unknownCode}`;
    }
  }
}
