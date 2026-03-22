export type TemplateVariableDeclaration = {
  name: string;
  defaultValue?: string;
};

const ESCAPED_OPEN = "__QT_ESCAPED_OPEN__";

function parseDeclarationToken(token: string): TemplateVariableDeclaration | undefined {
  const trimmed = token.trim();
  if (!trimmed) {
    return undefined;
  }
  const [nameRaw, ...defaultParts] = trimmed.split("|");
  const name = nameRaw.trim();
  if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(name)) {
    return undefined;
  }
  const defaultValue = defaultParts.length > 0 ? defaultParts.join("|").trim() : undefined;
  return {
    name,
    defaultValue: defaultValue ? defaultValue : undefined
  };
}

export function extractTemplateVariables(templateBody: string): TemplateVariableDeclaration[] {
  const safe = templateBody.replaceAll("\\{{", ESCAPED_OPEN);
  const declarations = new Map<string, TemplateVariableDeclaration>();
  const matches = safe.matchAll(/\{\{([^{}]+)\}\}/g);
  for (const match of matches) {
    const declaration = parseDeclarationToken(match[1] ?? "");
    if (!declaration) {
      continue;
    }
    if (!declarations.has(declaration.name)) {
      declarations.set(declaration.name, declaration);
      continue;
    }

    // Prefer explicit defaults if repeated declarations disagree.
    const existing = declarations.get(declaration.name);
    if (existing && !existing.defaultValue && declaration.defaultValue) {
      declarations.set(declaration.name, declaration);
    }
  }
  return [...declarations.values()];
}

export function parseRuntimeVariableInput(userInput: string): Record<string, string> {
  const output: Record<string, string> = {};
  for (const token of userInput.split(/[,\s]+/).filter(Boolean)) {
    const separatorIndex = token.indexOf("=");
    if (separatorIndex <= 0) {
      continue;
    }
    const key = token.slice(0, separatorIndex).trim();
    const value = token.slice(separatorIndex + 1).trim();
    if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(key) || !value) {
      continue;
    }
    output[key] = value;
  }
  return output;
}

export function interpolateTemplateVariables(
  templateBody: string,
  values: Record<string, string>
): { output: string; missingVariables: string[] } {
  const missing = new Set<string>();
  const safe = templateBody.replaceAll("\\{{", ESCAPED_OPEN);
  const output = safe.replace(/\{\{([^{}]+)\}\}/g, (_full, token: string) => {
    const declaration = parseDeclarationToken(token);
    if (!declaration) {
      return `{{${token}}}`;
    }
    const provided = values[declaration.name];
    if (provided) {
      return provided;
    }
    if (declaration.defaultValue !== undefined) {
      return declaration.defaultValue;
    }
    missing.add(declaration.name);
    return `{{${token}}}`;
  });

  return {
    output: output.replaceAll(ESCAPED_OPEN, "{{"),
    missingVariables: [...missing].sort((a, b) => a.localeCompare(b))
  };
}
