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

export type QtCommand =
  | QtMenuCommand
  | QtCreateCommand
  | QtRunCommand
  | QtImproveCommand

export type TaskTemplate = {
  taskName: string
  filename: string
  body: string
}

export type ImprovementProposal = {
  oldTemplate: string
  proposedTemplate: string
}
