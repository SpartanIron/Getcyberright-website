#!/bin/bash
set -e
npm install
# drizzle-kit push is non-interactive only when stdin is closed AND no
# interactive prompts are required. Pipe newline to accept default answers
# (e.g. "add the constraint without truncating") if any prompt does appear.
echo "" | npx drizzle-kit push --force || true
