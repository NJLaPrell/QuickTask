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

export type QtIncompleteCommand = {
  kind: 'incomplete'
  reason: 'missing-improve-task'
  usage: '/qt improve [task] [input]'
}

export type QtCommand =
  | QtMenuCommand
  | QtCreateCommand
  | QtRunCommand
  | QtImproveCommand
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
