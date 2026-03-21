import type { TaskTemplate } from "./types.js";
export type FileTaskStore = {
  tasksDir: string;
};
export type CreateFileTaskStoreOptions = {
  tasksDir?: string;
  repoRoot?: string;
};
export declare function taskNameToFilename(taskName: string): string;
export declare function createFileTaskStore(options?: CreateFileTaskStoreOptions): FileTaskStore;
export declare function getTaskTemplate(
  store: FileTaskStore,
  taskName: string
): TaskTemplate | undefined;
export declare function saveTaskTemplate(
  store: FileTaskStore,
  template: TaskTemplate
): TaskTemplate;
