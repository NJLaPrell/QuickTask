import { createOpenClawQtRuntime, handleOpenClawQtInput } from "./qtAdapter.js";

export type OpenClawQuickTaskRegistration = {
  runQt: (input: string) => ReturnType<typeof handleOpenClawQtInput>;
};

export function registerQuickTask(tasksDir: string): OpenClawQuickTaskRegistration {
  const runtime = createOpenClawQtRuntime(tasksDir);
  return {
    runQt(input: string) {
      return handleOpenClawQtInput(input, runtime);
    }
  };
}
