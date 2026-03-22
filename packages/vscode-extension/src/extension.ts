import * as vscode from "vscode";

import { handleQtChatPrompt, type QtRuntimeLike, createVsCodeQtRuntime } from "./qtAdapter.js";
import {
  getQtPromptFromRequest,
  resolveChatParticipantFactory,
  type ChatRequestLike,
  type ChatStreamLike
} from "./chatCompat.js";

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

  void vscode.window.showInformationMessage("QuickTask result written to the QuickTask output channel.");
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

  const participant = createChatParticipant(
    "quicktask.chat",
    async (request, _, stream) => {
      const response = handleQtChatPrompt(getQtPromptFromRequest(request), runtime);
      stream.markdown?.(response.markdown);
    }
  );

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

export function activate(context: vscode.ExtensionContext): void {
  const runtime = createVsCodeQtRuntime({ tasksDir: resolveTasksDir(context) });
  registerCommand(context, runtime);
  registerChatParticipant(context, runtime);
}
