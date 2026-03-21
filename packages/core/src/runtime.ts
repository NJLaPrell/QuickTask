import { parseQtCommand } from './parser.js'
import { createFileTaskStore, getTaskTemplate, saveTaskTemplate, type FileTaskStore } from './store.js'
import { createTaskTemplate, proposeTemplateImprovement } from './templates.js'
import type { QtRuntimeResult } from './types.js'

export function createQtRuntime(store: FileTaskStore = createFileTaskStore()) {
  return {
    store,
    handle(input: string): QtRuntimeResult {
      const command = parseQtCommand(input)

      if (command.kind === 'menu') {
        return {
          kind: 'help',
          code: 'qt:help',
          usage: [
            '/qt',
            '/qt [task] [instructions]',
            '/qt/[task] [input]',
            '/qt improve [task] [input]'
          ]
        }
      }

      if (command.kind === 'create') {
        if (!command.instructions.trim()) {
          return {
            kind: 'clarification',
            code: 'qt:create:clarify',
            taskName: command.taskName,
            usage: `/qt ${command.taskName} [instructions]`,
            message: `Please provide instructions for ${command.taskName}.`
          }
        }

        const existingTemplate = getTaskTemplate(store, command.taskName)
        if (existingTemplate) {
          return {
            kind: 'already_exists',
            code: 'qt:create:already-exists',
            taskName: command.taskName,
            message: `A template already exists for ${command.taskName}. Use /qt/${command.taskName} [input] to run it or /qt improve ${command.taskName} [input] to propose changes.`
          }
        }

        const template = createTaskTemplate(command.taskName, command.instructions)
        saveTaskTemplate(store, template)
        return {
          kind: 'created',
          code: 'qt:create:created',
          taskName: template.taskName,
          filename: template.filename,
          templateBody: template.body
        }
      }

      if (command.kind === 'incomplete') {
        return {
          kind: 'incomplete',
          code: 'qt:incomplete',
          usage: command.usage,
          message: `Missing required input. Usage: ${command.usage}`
        }
      }

      if (command.kind === 'run') {
        const template = getTaskTemplate(store, command.taskName)
        if (!template) {
          return {
            kind: 'not_found',
            code: 'qt:run:not-found',
            taskName: command.taskName,
            message: `No template exists yet for ${command.taskName}.`
          }
        }

        return {
          kind: 'run_executed',
          code: 'qt:run:executed',
          taskName: template.taskName,
          templateBody: template.body,
          userInput: command.userInput
        }
      }

      const template = getTaskTemplate(store, command.taskName)
      if (!template) {
        return {
          kind: 'not_found',
          code: 'qt:improve:not-found',
          taskName: command.taskName,
          message: `No template exists yet for ${command.taskName}.`
        }
      }

      const proposal = proposeTemplateImprovement(
        command.taskName,
        template.body,
        command.userInput
      )

      return {
        kind: 'improve_proposed',
        code: 'qt:improve:proposed',
        taskName: command.taskName,
        proposalId: proposal.proposalId,
        source: proposal.source,
        oldTemplate: proposal.oldTemplate,
        proposedTemplate: proposal.proposedTemplate
      }
    }
  }
}
