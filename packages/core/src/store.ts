import type { TaskTemplate } from './types.js'

export type InMemoryTaskStore = {
  tasks: Map<string, TaskTemplate>
}

export function createInMemoryTaskStore(): InMemoryTaskStore {
  return {
    tasks: new Map<string, TaskTemplate>()
  }
}

export function getTaskTemplate(
  store: InMemoryTaskStore,
  taskName: string
): TaskTemplate | undefined {
  return store.tasks.get(taskName.trim().toLowerCase())
}

export function saveTaskTemplate(
  store: InMemoryTaskStore,
  template: TaskTemplate
): TaskTemplate {
  store.tasks.set(template.taskName.trim().toLowerCase(), template)
  return template
}
