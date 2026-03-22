export type ChatRequestLike = {
  command?: string | { name?: string };
  prompt?: string;
};

export type ChatStreamLike = {
  markdown?: (value: string) => void;
};

export type ChatParticipantFactoryLike = (
  id: string,
  handler: (request: ChatRequestLike, chatContext: unknown, stream: ChatStreamLike) => unknown
) => { dispose(): void };

export function resolveChatParticipantFactory(
  vscodeApi: unknown
): ChatParticipantFactoryLike | undefined {
  if (typeof vscodeApi !== "object" || vscodeApi === null) {
    return undefined;
  }

  const maybeChat = Reflect.get(vscodeApi, "chat");
  if (typeof maybeChat !== "object" || maybeChat === null) {
    return undefined;
  }

  const maybeFactory = Reflect.get(maybeChat, "createChatParticipant");
  return typeof maybeFactory === "function" ? (maybeFactory as ChatParticipantFactoryLike) : undefined;
}

export function getQtPromptFromRequest(request: ChatRequestLike): string {
  const commandName = typeof request.command === "string" ? request.command : request.command?.name;
  const prompt = typeof request.prompt === "string" ? request.prompt.trim() : "";

  if (commandName === "qt") {
    return prompt;
  }

  if (!prompt) {
    return "/qt";
  }

  return prompt.startsWith("/qt") ? prompt : `/qt ${prompt}`;
}
