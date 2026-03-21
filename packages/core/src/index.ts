export const QUICKTASK_CORE_API_VERSION = '1.0.0'

export { parseQtCommand } from './parser.js'
export { createQtRuntime } from './runtime.js'
export { createTaskTemplate, proposeTemplateImprovement } from './templates.js'
export {
  createFileTaskStore,
  getTaskTemplate,
  saveTaskTemplate,
  taskNameToFilename,
  type CreateFileTaskStoreOptions,
  type FileTaskStore
} from './store.js'
export type {
  ImprovementProposal,
  ImprovementProposalStatus,
  QtCommand,
  QtImproveAction,
  QtImproveActionCommand,
  QtIncompleteCommand,
  QtRuntimeResult,
  TaskTemplate
} from './types.js'

export function describeQt(): string {
  return [
    'QuickTask (qt) is a task templating system accessed through /qt.',
    'Use /qt to view help, /qt [task] [instructions] to define a task, /qt/[task] to run a task, and /qt improve [task] [input] to improve a task template.',
    `Core API surface version: ${QUICKTASK_CORE_API_VERSION}.`
  ].join(' ');
}
