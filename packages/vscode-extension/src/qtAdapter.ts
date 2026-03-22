import {
  createFileTaskStore,
  createQtRuntime,
  formatQtRuntimeResult,
  type QtRuntimeResult
} from "@quicktask/core/dist/index.js";

export type QtRuntimeLike = {
  handle(input: string): QtRuntimeResult;
};

export type CreateVsCodeQtAdapterOptions = {
  tasksDir?: string;
  runtime?: QtRuntimeLike;
};

export type VsCodeQtResponse = {
  commandText: string;
  result: QtRuntimeResult;
  markdown: string;
};

export function createVsCodeQtRuntime(options: CreateVsCodeQtAdapterOptions = {}): QtRuntimeLike {
  if (options.runtime) {
    return options.runtime;
  }

  return createQtRuntime(createFileTaskStore({ tasksDir: options.tasksDir }));
}

export function toQtCommandTextFromChatPrompt(prompt: string): string {
  const trimmedPrompt = prompt.trim();
  if (!trimmedPrompt) {
    return "/qt";
  }

  return trimmedPrompt.startsWith("/qt") ? trimmedPrompt : `/qt ${trimmedPrompt}`;
}

export function renderQtRuntimeResult(result: QtRuntimeResult): string {
  return formatQtRuntimeResult(result, "markdown");
}

export function handleQtChatPrompt(
  prompt: string,
  runtime: QtRuntimeLike = createVsCodeQtRuntime()
): VsCodeQtResponse {
  const commandText = toQtCommandTextFromChatPrompt(prompt);
  const result = runtime.handle(commandText);
  return {
    commandText,
    result,
    markdown: renderQtRuntimeResult(result)
  };
}
