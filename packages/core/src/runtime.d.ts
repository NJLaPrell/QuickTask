import { type FileTaskStore } from "./store.js";
import type { QtRuntimeResult, RuntimeDiagnosticEvent } from "./types.js";
export type CreateQtRuntimeOptions = {
  proposalTtlMs?: number;
  now?: () => number;
};
export declare function createQtRuntime(
  store?: FileTaskStore,
  options?: CreateQtRuntimeOptions
): {
  store: FileTaskStore;
  getDiagnostics(): RuntimeDiagnosticEvent[];
  handle(input: string): QtRuntimeResult;
};
