function toFilename(taskName) {
    return `${taskName.trim().replace(/\s+/g, '-')}.md`;
}
export function createTaskTemplate(taskName, instructions) {
    const cleanTaskName = taskName.trim();
    const cleanInstructions = instructions.trim();
    const body = [
        `# ${cleanTaskName}`,
        '',
        '1. Review the user input for this task.',
        cleanInstructions
            ? `2. Apply these instructions: ${cleanInstructions}`
            : '2. Use the available user context to complete the task.',
        '3. Return the completed result to the user.'
    ].join('\n');
    return {
        taskName: cleanTaskName,
        filename: toFilename(cleanTaskName),
        body
    };
}
export function proposeTemplateImprovement(taskName, oldTemplate, userInput) {
    const hint = userInput?.trim();
    const proposedTemplate = [
        oldTemplate.trim(),
        '',
        hint
            ? `Improvement note for ${taskName}: ${hint}`
            : `Improvement note for ${taskName}: refine this template to better handle explicit user input.`
    ].join('\n');
    return {
        oldTemplate,
        proposedTemplate
    };
}
