import { parseQtCommand } from './parser.js'
import { createFileTaskStore, getTaskTemplate, saveTaskTemplate, type FileTaskStore } from './store.js'
import { createTaskTemplate, proposeTemplateImprovement } from './templates.js'

export type QtRuntimeResult = {
  title: string
  message: string
}

export function createQtRuntime(store: FileTaskStore = createFileTaskStore()) {
  return {
    store,
    handle(input: string): QtRuntimeResult {
      const command = parseQtCommand(input)

      if (command.kind === 'menu') {
        return {
          title: 'QuickTask Help',
          message:
            'Use /qt to view help, /qt [task] [instructions] to define a task, /qt/[task] [input] to run a task, and /qt improve [task] [input] to propose a template improvement.'
        }
      }

      if (command.kind === 'create') {
        const template = createTaskTemplate(command.taskName, command.instructions)
        saveTaskTemplate(store, template)
        return {
          title: `Created ${template.filename}`,
          message: template.body
        }
      }

      if (command.kind === 'incomplete') {
        return {
          title: 'Incomplete Command',
          message: `Missing required input. Usage: ${command.usage}`
        }
      }

      if (command.kind === 'run') {
        const template = getTaskTemplate(store, command.taskName)
        if (!template) {
          return {
            title: 'Task Not Found',
            message: `No template exists yet for ${command.taskName}.`
          }
        }

        return {
          title: `Run ${template.taskName}`,
          message: `Template:\n\n${template.body}\n\nUser input:\n${command.userInput}`
        }
      }

      const template = getTaskTemplate(store, command.taskName)
      if (!template) {
        return {
          title: 'Task Not Found',
          message: `No template exists yet for ${command.taskName}.`
        }
      }

      const proposal = proposeTemplateImprovement(
        command.taskName,
        template.body,
        command.userInput
      )

      return {
        title: `Improve ${command.taskName}`,
        message: `Old template:\n\n${proposal.oldTemplate}\n\nProposed template:\n\n${proposal.proposedTemplate}`
      }
    }
  }
}
