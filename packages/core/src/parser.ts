import type { QtCommand } from "./types.js";

function normalize(input: string): string {
  return input.trim().replace(/\s+/g, " ");
}

function parseQuotedToken(value: string): { token: string; remainder: string } | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  if (!trimmed.startsWith('"')) {
    const firstSpace = trimmed.indexOf(" ");
    if (firstSpace === -1) {
      return { token: trimmed, remainder: "" };
    }
    return {
      token: trimmed.slice(0, firstSpace),
      remainder: trimmed.slice(firstSpace + 1).trim()
    };
  }

  let token = "";
  let escaped = false;
  for (let index = 1; index < trimmed.length; index += 1) {
    const char = trimmed[index];
    if (escaped) {
      token += char;
      escaped = false;
      continue;
    }
    if (char === "\\") {
      escaped = true;
      continue;
    }
    if (char === '"') {
      return {
        token,
        remainder: trimmed.slice(index + 1).trim()
      };
    }
    token += char;
  }

  return undefined;
}

function parseTaskAndInput(value: string): { taskName: string; rest: string } | undefined {
  const parsed = parseQuotedToken(value);
  if (!parsed || !parsed.token.trim()) {
    return undefined;
  }
  return {
    taskName: parsed.token.trim(),
    rest: parsed.remainder
  };
}

export function parseQtCommand(input: string): QtCommand {
  const value = normalize(input);

  if (value === "/qt") {
    return { kind: "menu" };
  }

  if (value === "/qt/") {
    return { kind: "menu" };
  }

  if (value === "/qt improve") {
    return {
      kind: "incomplete",
      reason: "missing-improve-task",
      usage: "/qt improve [task] [input]"
    };
  }

  if (value === "/qt list") {
    return { kind: "list" };
  }

  if (value === "/qt export" || value === "/qt export --all") {
    return { kind: "export", all: true };
  }

  if (value.startsWith("/qt export ")) {
    const parsed = parseTaskAndInput(value.slice("/qt export ".length));
    if (!parsed || parsed.taskName === "--all") {
      return { kind: "export", all: true };
    }
    return {
      kind: "export",
      all: false,
      taskName: parsed.taskName
    };
  }

  if (value.startsWith("/qt import-pack ")) {
    const parsed = parseTaskAndInput(value.slice("/qt import-pack ".length));
    if (!parsed) {
      return {
        kind: "incomplete",
        reason: "missing-import-payload",
        usage: "/qt import [--force] [payload-json]"
      };
    }
    const force = parsed.taskName === "--force";
    const manifestPath = force
      ? parsed.rest
      : [parsed.taskName, parsed.rest].filter(Boolean).join(" ");
    return {
      kind: "import_pack",
      force,
      manifestPath: manifestPath.trim()
    };
  }

  if (value === "/qt import" || value === "/qt import --force") {
    return {
      kind: "incomplete",
      reason: "missing-import-payload",
      usage: "/qt import [--force] [payload-json]"
    };
  }

  if (value.startsWith("/qt import ")) {
    const remainder = value.slice("/qt import ".length).trim();
    const force = remainder.startsWith("--force ");
    const payload = force ? remainder.slice("--force ".length).trim() : remainder;
    if (!payload) {
      return {
        kind: "incomplete",
        reason: "missing-import-payload",
        usage: "/qt import [--force] [payload-json]"
      };
    }
    return {
      kind: "import",
      force,
      payload
    };
  }

  if (value === "/qt doctor") {
    return { kind: "doctor" };
  }

  if (value === "/qt help") {
    return { kind: "help" };
  }

  if (value === "/qt init") {
    return { kind: "init" };
  }

  if (value === "/qt create") {
    return {
      kind: "incomplete",
      reason: "missing-create-task",
      usage: "/qt create [task] [instructions]"
    };
  }

  if (value.startsWith("/qt create ")) {
    const remainder = value.slice("/qt create ".length).trim();
    if (!remainder) {
      return {
        kind: "incomplete",
        reason: "missing-create-task",
        usage: "/qt create [task] [instructions]"
      };
    }
    const parsed = parseTaskAndInput(remainder);
    if (!parsed) {
      return {
        kind: "create",
        taskName: remainder.trim(),
        instructions: "",
        createMode: "explicit"
      };
    }
    return {
      kind: "create",
      taskName: parsed.taskName,
      instructions: parsed.rest,
      createMode: "explicit"
    };
  }

  if (value.startsWith("/qt help ")) {
    const topic = value.slice("/qt help ".length).trim().toLowerCase();
    return {
      kind: "help",
      topic: topic || undefined
    };
  }

  if (value === "/qt show") {
    return {
      kind: "incomplete",
      reason: "missing-show-task",
      usage: "/qt show [task]"
    };
  }

  if (value.startsWith("/qt show ")) {
    const parsed = parseTaskAndInput(value.slice("/qt show ".length));
    if (!parsed) {
      return {
        kind: "incomplete",
        reason: "missing-show-task",
        usage: "/qt show [task]"
      };
    }
    return {
      kind: "show",
      taskName: parsed.taskName
    };
  }

  if (value.startsWith("/qt improve ")) {
    const remainder = value.slice("/qt improve ".length).trim();
    const improveActionMatch = remainder.match(/^(accept|reject|abandon)\s+/);
    if (improveActionMatch) {
      const [, actionMatch] = improveActionMatch;
      const action = actionMatch as "accept" | "reject" | "abandon";
      const actionRemainder = remainder.slice(action.length).trim();
      const parsed = parseTaskAndInput(actionRemainder);
      if (!parsed) {
        return {
          kind: "incomplete",
          reason: "missing-improve-action-details",
          usage: "/qt improve <accept|reject|abandon> [task] [proposal-id]"
        };
      }
      const proposalId = parsed.rest.split(" ").filter(Boolean)[0];
      if (!proposalId) {
        return {
          kind: "incomplete",
          reason: "missing-improve-action-details",
          usage: "/qt improve <accept|reject|abandon> [task] [proposal-id]"
        };
      }

      return {
        kind: "improve_action",
        action,
        taskName: parsed.taskName,
        proposalId
      };
    }

    const parsed = parseTaskAndInput(remainder);
    if (!parsed) {
      return {
        kind: "improve",
        taskName: remainder
      };
    }

    return {
      kind: "improve",
      taskName: parsed.taskName,
      userInput: parsed.rest
    };
  }

  if (value.startsWith("/qt/")) {
    const remainder = value.slice("/qt/".length).trim();
    if (!remainder) {
      return { kind: "menu" };
    }

    const parsed = parseTaskAndInput(remainder);
    if (!parsed) {
      return {
        kind: "run",
        taskName: remainder,
        userInput: ""
      };
    }

    return {
      kind: "run",
      taskName: parsed.taskName,
      userInput: parsed.rest
    };
  }

  if (value.startsWith("/qt ")) {
    const remainder = value.slice("/qt ".length).trim();
    const parsed = parseTaskAndInput(remainder);
    if (!parsed) {
      return {
        kind: "create",
        taskName: remainder,
        instructions: ""
      };
    }

    return {
      kind: "create",
      taskName: parsed.taskName,
      instructions: parsed.rest
    };
  }

  throw new Error("Input is not a QuickTask command.");
}
