import * as vscode from 'vscode'

import { handleQtChatPrompt, type QtRuntimeLike, createVsCodeQtRuntime } from './qtAdapter.js'

type ChatRequestLike = {
  command?: string | { name?: string }
  prompt?: string
}

type ChatStreamLike = {
  markdown?: (value: string) => void
}

function getQtPromptFromRequest(request: ChatRequestLike): string {
  const commandName =
    typeof request.command === 'string' ? request.command : request.command?.name
  const prompt = typeof request.prompt === 'string' ? request.prompt : ''

  if (commandName === 'qt') {
    return prompt
  }

  return prompt
}

function registerCommand(context: vscode.ExtensionContext, runtime: QtRuntimeLike): void {
  const disposable = vscode.commands.registerCommand('quicktask.runQt', async () => {
    const prompt = await vscode.window.showInputBox({
      prompt: 'Enter a /qt command or command arguments',
      placeHolder: '/qt summarize summarize notes into bullets'
    })

    if (prompt === undefined) {
      return
    }

    const response = handleQtChatPrompt(prompt, runtime)
    void vscode.window.showInformationMessage(response.markdown)
  })

  context.subscriptions.push(disposable)
}

function registerChatParticipant(context: vscode.ExtensionContext, runtime: QtRuntimeLike): void {
  const chatApi = (vscode as unknown as { chat?: unknown }).chat as
    | {
        createChatParticipant?: (
          id: string,
          handler: (request: ChatRequestLike, chatContext: unknown, stream: ChatStreamLike) => unknown
        ) => vscode.Disposable
      }
    | undefined

  if (!chatApi?.createChatParticipant) {
    return
  }

  const participant = chatApi.createChatParticipant('quicktask.chat', async (request, _, stream) => {
    const response = handleQtChatPrompt(getQtPromptFromRequest(request), runtime)
    stream.markdown?.(response.markdown)
  })

  context.subscriptions.push(participant)
}

export function activate(context: vscode.ExtensionContext): void {
  const runtime = createVsCodeQtRuntime()
  registerCommand(context, runtime)
  registerChatParticipant(context, runtime)
}
