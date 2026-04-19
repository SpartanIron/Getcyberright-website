#!/usr/bin/env tsx
import { spawn } from "node:child_process";
import { readdirSync } from "node:fs";
import { join } from "node:path";

const TESTS_DIR = join(process.cwd(), "tests");
const SERVER_URL = process.env.TEST_SERVER_URL ?? "http://localhost:5000";
const REQUIRES_SERVER = new Set(["shield-security.test.ts"]);

interface TestEntry {
  file: string;
  requiresServer: boolean;
}

function discoverTests(): TestEntry[] {
  const files = readdirSync(TESTS_DIR)
    .filter((f) => f.endsWith(".test.ts"))
    .sort();
  return files.map((file) => ({
    file,
    requiresServer: REQUIRES_SERVER.has(file),
  }));
}

async function isServerReachable(): Promise<boolean> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 1500);
    const res = await fetch(`${SERVER_URL}/api/shield/access`, {
      signal: ctrl.signal,
    });
    clearTimeout(t);
    return res.ok || res.status < 500;
  } catch {
    return false;
  }
}

function runOne(file: string): Promise<number> {
  return new Promise((resolve) => {
    const child = spawn("npx", ["tsx", join("tests", file)], {
      stdio: "inherit",
      env: process.env,
    });
    child.on("exit", (code) => resolve(code ?? 1));
    child.on("error", () => resolve(1));
  });
}

async function main() {
  const tests = discoverTests();
  if (tests.length === 0) {
    console.log("No tests found in tests/");
    return;
  }

  const serverUp = await isServerReachable();

  console.log("======================================================");
  console.log("Pre-release safety-net tests");
  console.log(`Discovered ${tests.length} test file(s) in tests/`);
  console.log(`Server at ${SERVER_URL}: ${serverUp ? "REACHABLE" : "NOT REACHABLE"}`);
  console.log("======================================================\n");

  const skipped: string[] = [];
  const failed: string[] = [];
  const passed: string[] = [];

  for (const t of tests) {
    if (t.requiresServer && !serverUp) {
      console.log(`SKIP  ${t.file}  (requires running server at ${SERVER_URL})`);
      skipped.push(t.file);
      continue;
    }
    console.log(`\n>>> Running ${t.file}`);
    const code = await runOne(t.file);
    if (code === 0) {
      passed.push(t.file);
    } else {
      failed.push(t.file);
    }
  }

  console.log("\n======================================================");
  console.log("Test summary");
  console.log("======================================================");
  console.log(`Passed:  ${passed.length}  ${passed.join(", ")}`);
  console.log(`Failed:  ${failed.length}  ${failed.join(", ")}`);
  console.log(`Skipped: ${skipped.length}  ${skipped.join(", ")}`);

  if (skipped.length > 0) {
    console.log(
      "\nNote: integration tests that need a live server were skipped. " +
        "Start the dev server (`npm run dev`) and re-run `npx tsx scripts/run-tests.ts` to execute them.",
    );
  }

  if (failed.length > 0) {
    console.error(`\n${failed.length} test file(s) failed. Blocking release.`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Test runner crashed:", err);
  process.exit(1);
});
