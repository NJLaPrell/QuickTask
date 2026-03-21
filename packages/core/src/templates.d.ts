import type { ImprovementProposal, TaskTemplate } from './types.js';
export declare function createTaskTemplate(taskName: string, instructions: string): TaskTemplate;
export declare function proposeTemplateImprovement(taskName: string, oldTemplate: string, userInput?: string): ImprovementProposal;
