import type { TaskTemplate } from './types.js';
export type InMemoryTaskStore = {
    tasks: Map<string, TaskTemplate>;
};
export declare function createInMemoryTaskStore(): InMemoryTaskStore;
export declare function getTaskTemplate(store: InMemoryTaskStore, taskName: string): TaskTemplate | undefined;
export declare function saveTaskTemplate(store: InMemoryTaskStore, template: TaskTemplate): TaskTemplate;
