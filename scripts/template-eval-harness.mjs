#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

function argValue(argv, flag) {
  const index = argv.indexOf(flag);
  if (index === -1 || index + 1 >= argv.length) {
    return undefined;
  }
  return argv[index + 1];
}

function normalizeScore(value) {
  return Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
}

function evaluateTemplate(body, checks) {
  let score = 100;
  const failures = [];
  for (const check of checks) {
    if (check.type === "includes") {
      if (!body.includes(check.value)) {
        score -= check.penalty ?? 10;
        failures.push(`missing token: ${check.value}`);
      }
    }
    if (check.type === "regex") {
      const re = new RegExp(check.value, check.flags ?? "");
      if (!re.test(body)) {
        score -= check.penalty ?? 10;
        failures.push(`regex mismatch: /${check.value}/${check.flags ?? ""}`);
      }
    }
  }
  return {
    score: normalizeScore(score),
    failures
  };
}

function main() {
  const datasetPath = path.resolve(argValue(process.argv.slice(2), "--dataset") ?? "");
  if (!datasetPath) {
    console.error("template-eval: --dataset is required");
    process.exit(1);
  }
  if (!existsSync(datasetPath)) {
    console.error(`template-eval: dataset not found: ${datasetPath}`);
    process.exit(1);
  }

  const raw = JSON.parse(readFileSync(datasetPath, "utf8"));
  const threshold = Number(raw.threshold ?? 80);
  const cases = Array.isArray(raw.cases) ? raw.cases : [];
  if (cases.length === 0) {
    console.error("template-eval: dataset has no cases");
    process.exit(1);
  }

  const results = [];
  for (const testCase of cases) {
    const taskName = String(testCase.taskName ?? "").trim();
    const templatePath = path.resolve(path.dirname(datasetPath), String(testCase.templatePath ?? ""));
    const checks = Array.isArray(testCase.checks) ? testCase.checks : [];
    if (!taskName || !existsSync(templatePath)) {
      results.push({
        taskName: taskName || "(missing taskName)",
        score: 0,
        failures: ["missing or invalid template path"]
      });
      continue;
    }
    const body = readFileSync(templatePath, "utf8");
    const evaluation = evaluateTemplate(body, checks);
    results.push({
      taskName,
      score: evaluation.score,
      failures: evaluation.failures
    });
  }

  const total = results.reduce((sum, result) => sum + result.score, 0);
  const average = Math.round((total / results.length) * 100) / 100;
  const failing = results.filter((result) => result.score < threshold);

  console.log(`template-eval: evaluated ${results.length} template case(s)`);
  console.log(`template-eval: average score ${average} (threshold ${threshold})`);
  for (const result of results) {
    const status = result.score >= threshold ? "PASS" : "FAIL";
    console.log(`- ${status} ${result.taskName}: ${result.score}`);
    if (result.failures.length > 0) {
      console.log(`  checks: ${result.failures.join("; ")}`);
    }
  }

  if (failing.length > 0) {
    console.error(`template-eval: ${failing.length} case(s) below threshold`);
    process.exit(1);
  }
}

main();
