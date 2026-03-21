import { createFileTaskStore, createQtRuntime, type QtRuntimeResult } from '@quicktask/core'

export type QtRuntimeLike = {
  handle(input: string): QtRuntimeResult
}

export type OpenClawQtResponse = {
  commandText: string
  result: QtRuntimeResult
  text: string
}

export function createOpenClawQtRuntime(tasksDir?: string): QtRuntimeLike {
  return createQtRuntime(createFileTaskStore({ tasksDir }))
}

export function normalizeOpenClawQtInput(input: string): string {
  const trimmed = input.trim()
  if (!trimmed) {
    return '/qt'
  }

  return trimmed.startsWith('/qt') ? trimmed : `/qt ${trimmed}`
}

export function renderOpenClawQtResult(result: QtRuntimeResult): string {
  switch (result.code) {
    case 'qt:help':
      return ['QuickTask command help:', ...result.usage.map((entry) => `- ${entry}`)].join('\n')
    case 'qt:create:clarify':
    case 'qt:create:already-exists':
    case 'qt:incomplete':
    case 'qt:run:not-found':
    case 'qt:improve:not-found':
    case 'qt:improve:proposal-not-found':
      return result.message
    case 'qt:create:created':
      return `Created ${result.taskName} (${result.filename}).`
    case 'qt:run:executed':
      return `Run ${result.taskName} with input: ${result.userInput || '(empty input)'}`
    case 'qt:improve:proposed':
      return `Proposed update for ${result.taskName}. Proposal ID: ${result.proposalId}`
    case 'qt:improve:accept:applied':
    case 'qt:improve:reject:recorded':
    case 'qt:improve:abandon:recorded':
    case 'qt:improve:proposal-expired':
    case 'qt:improve:already-finalized':
      return result.message
    case 'qt:parse:error':
    case 'qt:storage:error':
      return `${result.message} (request: ${result.requestId})`
    default: {
      const unknownCode = (result as { code?: string }).code ?? 'unknown'
      const maybeRequestId = (result as { requestId?: string }).requestId
      return maybeRequestId
        ? `QuickTask returned an unsupported result code: ${unknownCode} (request: ${maybeRequestId})`
        : `QuickTask returned an unsupported result code: ${unknownCode}`
    }
  }
}

export function handleOpenClawQtInput(
  input: string,
  runtime: QtRuntimeLike = createOpenClawQtRuntime()
): OpenClawQtResponse {
  const commandText = normalizeOpenClawQtInput(input)
  const result = runtime.handle(commandText)
  return {
    commandText,
    result,
    text: renderOpenClawQtResult(result)
  }
}
