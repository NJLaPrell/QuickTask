import { type InMemoryTaskStore } from './store.js';
export type QtRuntimeResult = {
    title: string;
    message: string;
};
export declare function createQtRuntime(store?: InMemoryTaskStore): {
    store: InMemoryTaskStore;
    handle(input: string): QtRuntimeResult;
};
