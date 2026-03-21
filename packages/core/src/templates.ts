import type { ImprovementProposal, TaskTemplate } from './types.js'
import { taskNameToFilename } from './store.js'

export function createTaskTemplate(taskName: string, instructions: string): TaskTemplate {
  const cleanTaskName = taskName.trim()
  const cleanInstructions = instructions.trim()

  const body = [
    `# ${cleanTaskName}`,
    '',
    `- Goal: ${cleanInstructions}`,
    '- Use the provided user input.',
    '- Return a concise result.'
  ].join('\n')

  return {
    taskName: cleanTaskName,
    filename: taskNameToFilename(cleanTaskName),
    body
  }
}

export function proposeTemplateImprovement(
  taskName: string,
  oldTemplate: string,
  userInput?: string
): ImprovementProposal {
  const hint = userInput?.trim()
  const proposedTemplate = [
    oldTemplate.trim(),
    '',
    hint
      ? `Improvement note for ${taskName}: ${hint}`
      : `Improvement note for ${taskName}: refine this template to better handle explicit user input.`
  ].join('\n')

  return {
    oldTemplate,
    proposedTemplate
  }
}
