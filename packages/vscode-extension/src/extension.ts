import * as vscode from "vscode";

import { createVsCodeQtRuntime, handleQtChatPrompt, type QtRuntimeLike } from "./qtAdapter.js";
import { getQtPromptFromRequest, resolveChatParticipantFactory } from "./chatCompat.js";

const WORKSPACE_HINT_KEY = "quicktask.workspaceActivationBundle.v1";

function renderCommandResult(
  response: ReturnType<typeof handleQtChatPrompt>,
  outputChannel: vscode.OutputChannel
): void {
  outputChannel.clear();
  outputChannel.appendLine("QuickTask /qt result");
  outputChannel.appendLine("");
  outputChannel.appendLine(response.markdown);
  outputChannel.show(true);

  if (response.result.kind === "error") {
    void vscode.window.showErrorMessage(
      `QuickTask failed (${response.result.code}). Request ID: ${response.result.requestId}`
    );
    return;
  }

  void vscode.window.showInformationMessage(
    "QuickTask result written to the QuickTask output channel."
  );
}

function registerCommand(context: vscode.ExtensionContext, runtime: QtRuntimeLike): void {
  const outputChannel = vscode.window.createOutputChannel("QuickTask");
  context.subscriptions.push(outputChannel);

  const disposable = vscode.commands.registerCommand("quicktask.runQt", async () => {
    const prompt = await vscode.window.showInputBox({
      prompt: "Enter a /qt command or command arguments",
      placeHolder: "/qt summarize summarize notes into bullets"
    });

    if (prompt === undefined) {
      return;
    }

    const response = handleQtChatPrompt(prompt, runtime);
    renderCommandResult(response, outputChannel);
  });

  context.subscriptions.push(disposable);
}

function registerChatParticipant(context: vscode.ExtensionContext, runtime: QtRuntimeLike): void {
  const createChatParticipant = resolveChatParticipantFactory(vscode);
  if (!createChatParticipant) {
    return;
  }

  const participant = createChatParticipant("quicktask.chat", async (request, _, stream) => {
    const response = handleQtChatPrompt(getQtPromptFromRequest(request), runtime);
    stream.markdown?.(response.markdown);
  });

  context.subscriptions.push(participant);
}

function resolveTasksDir(context: vscode.ExtensionContext): string {
  const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri;
  if (workspaceRoot) {
    return vscode.Uri.joinPath(workspaceRoot, "tasks").fsPath;
  }

  const storageRoot = context.storageUri ?? context.globalStorageUri;
  return vscode.Uri.joinPath(storageRoot, "tasks").fsPath;
}

function runActivationBundle(context: vscode.ExtensionContext, runtime: QtRuntimeLike): void {
  const folder = vscode.workspace.workspaceFolders?.[0];
  if (!folder) {
    return;
  }

  const seen = context.workspaceState.get<boolean>(WORKSPACE_HINT_KEY);
  if (seen) {
    return;
  }

  void context.workspaceState.update(WORKSPACE_HINT_KEY, true);

  const doctor = runtime.handle("/qt doctor");
  if (doctor.kind !== "doctor") {
    void vscode.window.showInformationMessage(
      "QuickTask: open chat, pick the QuickTask participant, and type /qt or /qt init."
    );
    return;
  }

  const { writable, taskCount, tasksDir: resolvedDir } = doctor.diagnostics;
  const lines = [
    "QuickTask is active.",
    "Open chat → QuickTask participant → type /qt (or /qt init if you need starter templates).",
    `Tasks path: ${resolvedDir}`,
    writable
      ? "Tasks directory: writable."
      : "Tasks directory: not writable — check folder permissions.",
    taskCount === 0
      ? "No templates yet — /qt init creates tasks/ and seeds examples."
      : `Templates loaded: ${taskCount}.`
  ];

  if (!writable) {
    void vscode.window.showWarningMessage(lines.join(" "));
    return;
  }

  void vscode.window.showInformationMessage(lines.join(" "));
}

export function activate(context: vscode.ExtensionContext): void {
  const tasksDir = resolveTasksDir(context);
  const runtime = createVsCodeQtRuntime({ tasksDir });
  registerCommand(context, runtime);
  registerChatParticipant(context, runtime);
  runActivationBundle(context, runtime);
}
