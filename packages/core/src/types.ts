export type QtMenuCommand = {
  kind: "menu";
};

export type QtCreateCommand = {
  kind: "create";
  taskName: string;
  instructions: string;
};

export type QtRunCommand = {
  kind: "run";
  taskName: string;
  userInput: string;
};

export type QtExportCommand = {
  kind: "export";
  all: boolean;
  taskName?: string;
};

export type QtImportCommand = {
  kind: "import";
  payload: string;
  force: boolean;
};

export type QtImportPackCommand = {
  kind: "import_pack";
  manifestPath: string;
  force: boolean;
};

export type QtListCommand = {
  kind: "list";
};

export type QtShowCommand = {
  kind: "show";
  taskName: string;
};

export type QtDoctorCommand = {
  kind: "doctor";
};

export type QtHelpCommand = {
  kind: "help";
  topic?: string;
};

export type QtInitCommand = {
  kind: "init";
};

export type QtImproveCommand = {
  kind: "improve";
  taskName: string;
  userInput?: string;
};

export type QtImproveAction = "accept" | "reject" | "abandon";

export type QtImproveActionCommand = {
  kind: "improve_action";
  action: QtImproveAction;
  taskName: string;
  proposalId: string;
};

export type QtIncompleteCommand = {
  kind: "incomplete";
  reason:
    | "missing-improve-task"
    | "missing-improve-action-details"
    | "missing-show-task"
    | "missing-import-payload";
  usage:
    | "/qt improve [task] [input]"
    | "/qt improve <accept|reject|abandon> [task] [proposal-id]"
    | "/qt show [task]"
    | "/qt import [--force] [payload-json]";
};

export type QtCommand =
  | QtMenuCommand
  | QtCreateCommand
  | QtRunCommand
  | QtExportCommand
  | QtImportCommand
  | QtImportPackCommand
  | QtListCommand
  | QtShowCommand
  | QtDoctorCommand
  | QtHelpCommand
  | QtInitCommand
  | QtImproveCommand
  | QtImproveActionCommand
  | QtIncompleteCommand;

export type TaskTemplate = {
  taskName: string;
  filename: string;
  body: string;
};

export type ImprovementProposal = {
  proposalId: string;
  source: "explicit" | "inferred";
  oldTemplate: string;
  proposedTemplate: string;
};

export type ImprovementProposalStatus =
  | "proposed"
  | "accepted"
  | "rejected"
  | "abandoned"
  | "expired";

export type QtInitStatus = "initialized" | "already_initialized" | "partial";

export type RuntimeDiagnosticEvent = {
  requestId: string;
  timestamp: string;
  phase: "command.received" | "command.completed" | "command.failed";
  commandKind: QtCommand["kind"] | "invalid_input";
  code?: string;
};

export type QtDoctorStatus = {
  tasksDir: string;
  writable: boolean;
  taskCount: number;
  recentRuntimeCodes: string[];
  runtimeVersion: string;
  feedbackSignals: {
    clarificationCount: number;
    incompleteCount: number;
    parseErrorCount: number;
    storageErrorCount: number;
    missingTaskCount: number;
  };
  storageError?: string;
};

export type QtRuntimeResult =
  | {
      kind: "help";
      code: "qt:help";
      usage: string[];
      message?: string;
    }
  | {
      kind: "init_status";
      code: "qt:init:initialized" | "qt:init:already-initialized" | "qt:init:partial";
      status: QtInitStatus;
      createdAssets: string[];
      skippedAssets: string[];
      warnings?: string[];
      nextCommands: string[];
      message: string;
    }
  | {
      kind: "clarification";
      code: "qt:create:clarify";
      taskName: string;
      usage: string;
      message: string;
    }
  | {
      kind: "already_exists";
      code: "qt:create:already-exists";
      taskName: string;
      message: string;
    }
  | {
      kind: "created";
      code: "qt:create:created";
      taskName: string;
      filename: string;
      templateBody: string;
    }
  | {
      kind: "incomplete";
      code: "qt:incomplete";
      usage: string;
      message: string;
    }
  | {
      kind: "not_found";
      code:
        | "qt:run:not-found"
        | "qt:improve:not-found"
        | "qt:improve:proposal-not-found"
        | "qt:pack:not-found";
      taskName: string;
      message: string;
    }
  | {
      kind: "run_missing_variables";
      code: "qt:run:missing-variables";
      taskName: string;
      missingVariables: string[];
      usage: string;
      message: string;
    }
  | {
      kind: "run_executed";
      code: "qt:run:executed";
      taskName: string;
      templateBody: string;
      userInput: string;
    }
  | {
      kind: "exported";
      code: "qt:export:task" | "qt:export:all";
      taskName?: string;
      taskCount: number;
      payload: string;
      message: string;
    }
  | {
      kind: "imported";
      code: "qt:import:created" | "qt:import:updated" | "qt:import:conflict" | "qt:import:invalid";
      createdCount: number;
      updatedCount: number;
      skippedCount: number;
      message: string;
    }
  | {
      kind: "pack_resolved";
      code: "qt:pack:resolved" | "qt:pack:invalid";
      manifestPath: string;
      importedCount: number;
      skippedCount: number;
      message: string;
    }
  | {
      kind: "list";
      code: "qt:list:listed";
      tasks: string[];
      message: string;
    }
  | {
      kind: "show";
      code: "qt:show:template";
      taskName: string;
      templateBody: string;
    }
  | {
      kind: "improve_proposed";
      code: "qt:improve:proposed";
      taskName: string;
      proposalId: string;
      source: "explicit" | "inferred";
      oldTemplate: string;
      proposedTemplate: string;
    }
  | {
      kind: "improve_action";
      code:
        | "qt:improve:accept:applied"
        | "qt:improve:reject:recorded"
        | "qt:improve:abandon:recorded"
        | "qt:improve:proposal-expired"
        | "qt:improve:already-finalized";
      taskName: string;
      action: QtImproveAction;
      proposalId: string;
      status: ImprovementProposalStatus;
      message: string;
    }
  | {
      kind: "error";
      code: "qt:storage:error" | "qt:parse:error" | "qt:init:failed";
      diagnosticCode: "storage-io-failure" | "parse-invalid-input" | "init-bootstrap-failure";
      requestId: string;
      message: string;
    }
  | {
      kind: "doctor";
      code: "qt:doctor:status";
      diagnostics: QtDoctorStatus;
    };
