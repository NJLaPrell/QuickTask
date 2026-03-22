export const QUICKTASK_CORE_API_VERSION = "1.0.0";

export { parseQtCommand } from "./parser.js";
export { createQtRuntime } from "./runtime.js";
export { formatQtRuntimeResult, type QtRenderStyle } from "./rendering.js";
export { createTaskTemplate, proposeTemplateImprovement } from "./templates.js";
export {
  extractTemplateVariables,
  interpolateTemplateVariables,
  parseRuntimeVariableInput,
  type TemplateVariableDeclaration
} from "./templateVariables.js";
export {
  resolveLocalTemplatePack,
  validateTemplatePackManifest,
  type ResolvedTemplatePack,
  type TemplatePackManifest
} from "./templatePacks.js";
export {
  checkTaskStoreHealth,
  createFileTaskStore,
  getTaskTemplate,
  listTaskNames,
  saveTaskTemplate,
  taskNameToFilename,
  type CreateFileTaskStoreOptions,
  type FileTaskStore,
  type TaskStoreHealth
} from "./store.js";
export type {
  ImprovementProposal,
  ImprovementProposalStatus,
  QtCommand,
  QtDoctorStatus,
  QtExportCommand,
  QtHelpCommand,
  QtImportCommand,
  QtImportPackCommand,
  QtImproveAction,
  QtImproveActionCommand,
  QtIncompleteCommand,
  QtInitCommand,
  QtRunCommand,
  QtRuntimeResult,
  QtCreateCommand,
  TaskTemplate
} from "./types.js";

export function describeQt(): string {
  return [
    "QuickTask (qt) is a task templating system accessed through /qt.",
    "Use /qt help for a short quickstart, /qt init to bootstrap starter templates, /qt [task] … to create (new name) or run (existing), /qt create [task] … for explicit create, /qt/[task] to run, and /qt improve [task] [input] to improve a template.",
    `Core API surface version: ${QUICKTASK_CORE_API_VERSION}.`
  ].join(" ");
}
