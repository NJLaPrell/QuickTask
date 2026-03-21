import { parseQtCommand } from './parser.js'
import { createFileTaskStore, getTaskTemplate, saveTaskTemplate, type FileTaskStore } from './store.js'
import { createTaskTemplate, proposeTemplateImprovement } from './templates.js'
import type { ImprovementProposalStatus, QtRuntimeResult } from './types.js'

type PendingProposal = {
  taskName: string
  oldTemplate: string
  proposedTemplate: string
  status: ImprovementProposalStatus
}

export function createQtRuntime(store: FileTaskStore = createFileTaskStore()) {
  const proposals = new Map<string, PendingProposal>()

  return {
    store,
    handle(input: string): QtRuntimeResult {
      const command = parseQtCommand(input)
      try {
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

        if (command.kind === 'improve_action') {
        const proposal = proposals.get(command.proposalId)
        if (!proposal || proposal.taskName !== command.taskName) {
          return {
            kind: 'not_found',
            code: 'qt:improve:proposal-not-found',
            taskName: command.taskName,
            message: `No proposal exists for ${command.taskName} with ID ${command.proposalId}.`
          }
        }

        if (proposal.status !== 'proposed') {
          return {
            kind: 'improve_action',
            code: 'qt:improve:already-finalized',
            taskName: proposal.taskName,
            action: command.action,
            proposalId: command.proposalId,
            status: proposal.status,
            message: `Proposal ${command.proposalId} is already ${proposal.status}.`
          }
        }

        if (command.action === 'accept') {
          saveTaskTemplate(store, {
            taskName: proposal.taskName,
            filename: '',
            body: proposal.proposedTemplate
          })
          proposal.status = 'accepted'
          return {
            kind: 'improve_action',
            code: 'qt:improve:accept:applied',
            taskName: proposal.taskName,
            action: command.action,
            proposalId: command.proposalId,
            status: proposal.status,
            message: `Proposal ${command.proposalId} accepted and applied to ${proposal.taskName}.`
          }
        }

        proposal.status = command.action === 'reject' ? 'rejected' : 'abandoned'
        return {
          kind: 'improve_action',
          code:
            command.action === 'reject'
              ? 'qt:improve:reject:recorded'
              : 'qt:improve:abandon:recorded',
          taskName: proposal.taskName,
          action: command.action,
          proposalId: command.proposalId,
          status: proposal.status,
          message: `Proposal ${command.proposalId} ${proposal.status}.`
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
        proposals.set(proposal.proposalId, {
          taskName: command.taskName,
          oldTemplate: proposal.oldTemplate,
          proposedTemplate: proposal.proposedTemplate,
          status: 'proposed'
        })

        return {
          kind: 'improve_proposed',
          code: 'qt:improve:proposed',
          taskName: command.taskName,
          proposalId: proposal.proposalId,
          source: proposal.source,
          oldTemplate: proposal.oldTemplate,
          proposedTemplate: proposal.proposedTemplate
        }
      } catch (error) {
        return {
          kind: 'error',
          code: 'qt:storage:error',
          diagnosticCode: 'storage-io-failure',
          message:
            error instanceof Error ? error.message : 'A filesystem error occurred while handling QuickTask command.'
        }
      }
    }
  }
}
