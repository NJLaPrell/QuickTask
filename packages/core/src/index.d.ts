export declare const QUICKTASK_CORE_API_VERSION = "1.0.0";
export { parseQtCommand } from './parser.js';
export { createQtRuntime } from './runtime.js';
export { createTaskTemplate, proposeTemplateImprovement } from './templates.js';
export { createFileTaskStore, getTaskTemplate, saveTaskTemplate, taskNameToFilename, type CreateFileTaskStoreOptions, type FileTaskStore } from './store.js';
export type { ImprovementProposal, ImprovementProposalStatus, QtCommand, QtImproveAction, QtImproveActionCommand, QtIncompleteCommand, QtRuntimeResult, TaskTemplate } from './types.js';
export declare function describeQt(): string;
