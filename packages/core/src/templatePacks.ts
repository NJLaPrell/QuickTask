import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

export type TemplatePackManifestEntry = {
  taskName: string;
  file: string;
};

export type TemplatePackManifest = {
  version: number;
  name: string;
  templates: TemplatePackManifestEntry[];
};

export type ResolvedTemplatePack = {
  manifestPath: string;
  name: string;
  templates: Array<{ taskName: string; body: string }>;
};

export function validateTemplatePackManifest(payload: unknown): {
  ok: boolean;
  errors: string[];
  manifest?: TemplatePackManifest;
} {
  const errors: string[] = [];
  if (!payload || typeof payload !== "object") {
    return { ok: false, errors: ["manifest must be an object"] };
  }
  const candidate = payload as Record<string, unknown>;
  if (candidate.version !== 1) {
    errors.push("manifest version must be 1");
  }
  if (typeof candidate.name !== "string" || !candidate.name.trim()) {
    errors.push("manifest name must be a non-empty string");
  }
  if (!Array.isArray(candidate.templates) || candidate.templates.length === 0) {
    errors.push("manifest templates must be a non-empty array");
  }

  const normalizedTemplates: TemplatePackManifestEntry[] = [];
  if (Array.isArray(candidate.templates)) {
    for (const entry of candidate.templates) {
      if (!entry || typeof entry !== "object") {
        errors.push("template entries must be objects");
        continue;
      }
      const record = entry as Record<string, unknown>;
      if (typeof record.taskName !== "string" || !record.taskName.trim()) {
        errors.push("template taskName must be a non-empty string");
        continue;
      }
      if (typeof record.file !== "string" || !record.file.trim()) {
        errors.push("template file must be a non-empty string");
        continue;
      }
      normalizedTemplates.push({
        taskName: record.taskName.trim(),
        file: record.file.trim()
      });
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    errors: [],
    manifest: {
      version: 1,
      name: (candidate.name as string).trim(),
      templates: normalizedTemplates
    }
  };
}

export function resolveLocalTemplatePack(manifestPath: string): {
  ok: boolean;
  errors: string[];
  resolved?: ResolvedTemplatePack;
} {
  const absoluteManifestPath = path.resolve(manifestPath);
  if (!existsSync(absoluteManifestPath)) {
    return { ok: false, errors: [`manifest not found: ${absoluteManifestPath}`] };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(absoluteManifestPath, "utf8"));
  } catch (error) {
    return {
      ok: false,
      errors: [error instanceof Error ? error.message : "failed to parse manifest json"]
    };
  }

  const validation = validateTemplatePackManifest(parsed);
  if (!validation.ok || !validation.manifest) {
    return { ok: false, errors: validation.errors };
  }

  const baseDir = path.dirname(absoluteManifestPath);
  const templates: Array<{ taskName: string; body: string }> = [];
  const errors: string[] = [];
  for (const entry of validation.manifest.templates) {
    const templatePath = path.resolve(baseDir, entry.file);
    if (!existsSync(templatePath)) {
      errors.push(`template file not found: ${entry.file}`);
      continue;
    }
    try {
      templates.push({
        taskName: entry.taskName,
        body: readFileSync(templatePath, "utf8")
      });
    } catch (error) {
      errors.push(
        `failed to read template file ${entry.file}: ${
          error instanceof Error ? error.message : "unknown error"
        }`
      );
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    errors: [],
    resolved: {
      manifestPath: absoluteManifestPath,
      name: validation.manifest.name,
      templates
    }
  };
}
