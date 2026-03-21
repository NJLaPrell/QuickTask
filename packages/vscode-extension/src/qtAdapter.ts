import { createFileTaskStore, createQtRuntime, type QtRuntimeResult } from '@quicktask/core'

export type QtRuntimeLike = {
  handle(input: string): QtRuntimeResult
}

export type CreateVsCodeQtAdapterOptions = {
  tasksDir?: string
  runtime?: QtRuntimeLike
}

export type VsCodeQtResponse = {
  commandText: string
  result: QtRuntimeResult
  markdown: string
}

export function createVsCodeQtRuntime(options: CreateVsCodeQtAdapterOptions = {}): QtRuntimeLike {
  if (options.runtime) {
    return options.runtime
  }

  return createQtRuntime(createFileTaskStore({ tasksDir: options.tasksDir }))
}

export function toQtCommandTextFromChatPrompt(prompt: string): string {
  const trimmedPrompt = prompt.trim()
  if (!trimmedPrompt) {
    return '/qt'
  }

  return trimmedPrompt.startsWith('/qt') ? trimmedPrompt : `/qt ${trimmedPrompt}`
}

export function renderQtRuntimeResult(result: QtRuntimeResult): string {
  switch (result.code) {
    case 'qt:help':
      return ['QuickTask command help:', ...result.usage.map((entry) => `- \`${entry}\``)].join('\n')
    case 'qt:create:clarify':
    case 'qt:create:already-exists':
    case 'qt:incomplete':
    case 'qt:run:not-found':
    case 'qt:improve:not-found':
    case 'qt:improve:proposal-not-found':
      return result.message
    case 'qt:create:created':
      return [
        `Created template \`${result.taskName}\` (\`${result.filename}\`).`,
        '',
        '```md',
        result.templateBody,
        '```'
      ].join('\n')
    case 'qt:run:executed':
      return [
        `Running \`${result.taskName}\` with user input:`,
        '',
        '```text',
        result.userInput || '(empty input)',
        '```',
        '',
        'Template:',
        '',
        '```md',
        result.templateBody,
        '```'
      ].join('\n')
    case 'qt:improve:proposed':
      return [
        `Proposed improvement for \`${result.taskName}\` (${result.source}).`,
        `Proposal ID: \`${result.proposalId}\``,
        '',
        'Old template:',
        '```md',
        result.oldTemplate,
        '```',
        '',
        'Proposed template:',
        '```md',
        result.proposedTemplate,
        '```'
      ].join('\n')
    case 'qt:improve:accept:applied':
    case 'qt:improve:reject:recorded':
    case 'qt:improve:abandon:recorded':
    case 'qt:improve:proposal-expired':
    case 'qt:improve:already-finalized':
      return result.message
    case 'qt:parse:error':
    case 'qt:storage:error':
      return `${result.message}\n\nRequest ID: \`${result.requestId}\``
    default: {
      const unknownCode = (result as { code?: string }).code ?? 'unknown'
      const maybeRequestId = (result as { requestId?: string }).requestId
      return [
        'QuickTask returned an unsupported result code.',
        `Code: \`${unknownCode}\``,
        maybeRequestId ? `Request ID: \`${maybeRequestId}\`` : ''
      ]
        .filter(Boolean)
        .join('\n')
    }
  }
}

export function handleQtChatPrompt(
  prompt: string,
  runtime: QtRuntimeLike = createVsCodeQtRuntime()
): VsCodeQtResponse {
  const commandText = toQtCommandTextFromChatPrompt(prompt)
  const result = runtime.handle(commandText)
  return {
    commandText,
    result,
    markdown: renderQtRuntimeResult(result)
  }
}
