export const RELEASE_INTEGRITY_SCHEMA_VERSION = "1.0.0";
const ISO_8601_UTC_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;
const SHA256_PATTERN = /^[a-f0-9]{64}$/;

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function validateReleaseIntegrityMetadata(metadata) {
  const findings = [];

  if (!isObject(metadata)) {
    return ["metadata must be a JSON object"];
  }

  if (metadata.schemaVersion !== RELEASE_INTEGRITY_SCHEMA_VERSION) {
    findings.push(
      `schemaVersion must equal ${RELEASE_INTEGRITY_SCHEMA_VERSION}, got ${JSON.stringify(
        metadata.schemaVersion
      )}`
    );
  }

  if (
    typeof metadata.generatedAt !== "string" ||
    !ISO_8601_UTC_PATTERN.test(metadata.generatedAt)
  ) {
    findings.push("generatedAt must be an ISO-8601 UTC timestamp");
  }

  if (typeof metadata.generatedBy !== "string" || metadata.generatedBy.trim().length === 0) {
    findings.push("generatedBy must be a non-empty string");
  }

  if (!Array.isArray(metadata.artifacts) || metadata.artifacts.length === 0) {
    findings.push("artifacts must be a non-empty array");
  } else {
    for (const [index, artifact] of metadata.artifacts.entries()) {
      const prefix = `artifacts[${index}]`;
      if (!isObject(artifact)) {
        findings.push(`${prefix} must be an object`);
        continue;
      }
      if (typeof artifact.file !== "string" || artifact.file.trim().length === 0) {
        findings.push(`${prefix}.file must be a non-empty string`);
      }
      if (!Number.isInteger(artifact.sizeBytes) || artifact.sizeBytes <= 0) {
        findings.push(`${prefix}.sizeBytes must be a positive integer`);
      }
      if (typeof artifact.sha256 !== "string" || !SHA256_PATTERN.test(artifact.sha256)) {
        findings.push(`${prefix}.sha256 must be a lowercase 64-char hex digest`);
      }
    }
  }

  return findings;
}
