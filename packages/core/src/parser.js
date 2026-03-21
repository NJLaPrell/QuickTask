function normalize(input) {
  return input.trim().replace(/\s+/g, " ");
}
export function parseQtCommand(input) {
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
  if (value.startsWith("/qt improve ")) {
    const remainder = value.slice("/qt improve ".length).trim();
    const improveActionMatch = remainder.match(/^(accept|reject|abandon)\s+/);
    if (improveActionMatch) {
      const [, actionMatch] = improveActionMatch;
      const action = actionMatch;
      const actionRemainder = remainder.slice(action.length).trim();
      const tokens = actionRemainder.split(" ").filter(Boolean);
      if (tokens.length < 2) {
        return {
          kind: "incomplete",
          reason: "missing-improve-action-details",
          usage: "/qt improve <accept|reject|abandon> [task] [proposal-id]"
        };
      }
      return {
        kind: "improve_action",
        action,
        taskName: tokens[0],
        proposalId: tokens[1]
      };
    }
    const firstSpace = remainder.indexOf(" ");
    if (firstSpace === -1) {
      return {
        kind: "improve",
        taskName: remainder
      };
    }
    return {
      kind: "improve",
      taskName: remainder.slice(0, firstSpace).trim(),
      userInput: remainder.slice(firstSpace + 1).trim()
    };
  }
  if (value.startsWith("/qt/")) {
    const remainder = value.slice("/qt/".length).trim();
    if (!remainder) {
      return { kind: "menu" };
    }
    const firstSpace = remainder.indexOf(" ");
    if (firstSpace === -1) {
      return {
        kind: "run",
        taskName: remainder,
        userInput: ""
      };
    }
    return {
      kind: "run",
      taskName: remainder.slice(0, firstSpace).trim(),
      userInput: remainder.slice(firstSpace + 1).trim()
    };
  }
  if (value.startsWith("/qt ")) {
    const remainder = value.slice("/qt ".length).trim();
    const firstSpace = remainder.indexOf(" ");
    if (firstSpace === -1) {
      return {
        kind: "create",
        taskName: remainder,
        instructions: ""
      };
    }
    return {
      kind: "create",
      taskName: remainder.slice(0, firstSpace).trim(),
      instructions: remainder.slice(firstSpace + 1).trim()
    };
  }
  throw new Error("Input is not a QuickTask command.");
}
