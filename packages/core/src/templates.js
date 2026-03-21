import { createHash } from "node:crypto";
import { taskNameToFilename } from "./store.js";
export function createTaskTemplate(taskName, instructions) {
  const cleanTaskName = taskName.trim();
  const cleanInstructions = instructions.trim();
  const body = [
    `# ${cleanTaskName}`,
    "",
    `- Goal: ${cleanInstructions}`,
    "- Use the provided user input.",
    "- Return a concise result."
  ].join("\n");
  return {
    taskName: cleanTaskName,
    filename: taskNameToFilename(cleanTaskName),
    body
  };
}
export function proposeTemplateImprovement(taskName, oldTemplate, userInput) {
  const hint = userInput?.trim();
  const source = hint ? "explicit" : "inferred";
  const proposedTemplate = [
    oldTemplate.trim(),
    "",
    hint
      ? `Improvement note for ${taskName}: ${hint}`
      : `Improvement note for ${taskName}: refine this template to better handle explicit user input.`
  ].join("\n");
  const proposalId = createHash("sha256")
    .update(`${taskName}\n${oldTemplate.trim()}\n${proposedTemplate}`)
    .digest("hex")
    .slice(0, 12);
  return {
    proposalId,
    source,
    oldTemplate,
    proposedTemplate
  };
}
