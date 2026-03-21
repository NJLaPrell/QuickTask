export function createInMemoryTaskStore() {
    return {
        tasks: new Map()
    };
}
export function getTaskTemplate(store, taskName) {
    return store.tasks.get(taskName.trim().toLowerCase());
}
export function saveTaskTemplate(store, template) {
    store.tasks.set(template.taskName.trim().toLowerCase(), template);
    return template;
}
