export type QtMenuCommand = {
  kind: 'menu'
}

export type QtCreateCommand = {
  kind: 'create'
  taskName: string
  instructions: string
}

export type QtRunCommand = {
  kind: 'run'
  taskName: string
  userInput: string
}

export type QtImproveCommand = {
  kind: 'improve'
  taskName: string
  userInput?: string
}

export type QtImproveAction = 'accept' | 'reject' | 'abandon'

export type QtImproveActionCommand = {
  kind: 'improve_action'
  action: QtImproveAction
  taskName: string
  proposalId: string
}

export type QtIncompleteCommand = {
  kind: 'incomplete'
  reason: 'missing-improve-task' | 'missing-improve-action-details'
  usage: '/qt improve [task] [input]' | '/qt improve <accept|reject|abandon> [task] [proposal-id]'
}

export type QtCommand =
  | QtMenuCommand
  | QtCreateCommand
  | QtRunCommand
  | QtImproveCommand
  | QtImproveActionCommand
  | QtIncompleteCommand

export type TaskTemplate = {
  taskName: string
  filename: string
  body: string
}

export type ImprovementProposal = {
  proposalId: string
  source: 'explicit' | 'inferred'
  oldTemplate: string
  proposedTemplate: string
}

export type ImprovementProposalStatus = 'proposed' | 'accepted' | 'rejected' | 'abandoned'

export type RuntimeDiagnosticEvent = {
  requestId: string
  timestamp: string
  phase: 'command.received' | 'command.completed' | 'command.failed'
  commandKind: QtCommand['kind']
  code?: string
}

export type QtRuntimeResult =
  | {
      kind: 'help'
      code: 'qt:help'
      usage: string[]
    }
  | {
      kind: 'clarification'
      code: 'qt:create:clarify'
      taskName: string
      usage: string
      message: string
    }
  | {
      kind: 'already_exists'
      code: 'qt:create:already-exists'
      taskName: string
      message: string
    }
  | {
      kind: 'created'
      code: 'qt:create:created'
      taskName: string
      filename: string
      templateBody: string
    }
  | {
      kind: 'incomplete'
      code: 'qt:incomplete'
      usage: string
      message: string
    }
  | {
      kind: 'not_found'
      code: 'qt:run:not-found' | 'qt:improve:not-found' | 'qt:improve:proposal-not-found'
      taskName: string
      message: string
    }
  | {
      kind: 'run_executed'
      code: 'qt:run:executed'
      taskName: string
      templateBody: string
      userInput: string
    }
  | {
      kind: 'improve_proposed'
      code: 'qt:improve:proposed'
      taskName: string
      proposalId: string
      source: 'explicit' | 'inferred'
      oldTemplate: string
      proposedTemplate: string
    }
  | {
      kind: 'improve_action'
      code:
        | 'qt:improve:accept:applied'
        | 'qt:improve:reject:recorded'
        | 'qt:improve:abandon:recorded'
        | 'qt:improve:already-finalized'
      taskName: string
      action: QtImproveAction
      proposalId: string
      status: ImprovementProposalStatus
      message: string
    }
  | {
      kind: 'error'
      code: 'qt:storage:error'
      diagnosticCode: 'storage-io-failure'
      requestId: string
      message: string
    }
