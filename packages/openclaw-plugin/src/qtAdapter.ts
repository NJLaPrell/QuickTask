import {
  createFileTaskStore,
  createQtRuntime,
  formatQtRuntimeResult,
  type QtRuntimeResult
} from "@quicktask/core/dist/index.js";

export type QtRuntimeLike = {
  handle(input: string): QtRuntimeResult;
};

export type OpenClawQtResponse = {
  commandText: string;
  result: QtRuntimeResult;
  text: string;
};

export function createOpenClawQtRuntime(tasksDir: string): QtRuntimeLike {
  if (!tasksDir.trim()) {
    throw new Error("OpenClaw runtime requires an explicit tasksDir.");
  }

  return createQtRuntime(createFileTaskStore({ tasksDir }));
}

export function normalizeOpenClawQtInput(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) {
    return "/qt";
  }

  return trimmed.startsWith("/qt") ? trimmed : `/qt ${trimmed}`;
}

export function renderOpenClawQtResult(result: QtRuntimeResult): string {
  return formatQtRuntimeResult(result, "plain");
}

export function handleOpenClawQtInput(input: string, runtime: QtRuntimeLike): OpenClawQtResponse {
  const commandText = normalizeOpenClawQtInput(input);
  const result = runtime.handle(commandText);
  return {
    commandText,
    result,
    text: renderOpenClawQtResult(result)
  };
}
