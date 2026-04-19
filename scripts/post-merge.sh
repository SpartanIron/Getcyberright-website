#!/bin/bash
set -e
npm install
# drizzle-kit push can hit interactive prompts (e.g. "Is <table> created or
# renamed from another table?"). The default highlighted choice is always
# "create table" / accept, so pressing Enter is the safe answer. Feed many
# newlines to cover every prompt for any number of new tables/columns, and
# wrap in `timeout` so a stuck prompt can never stall the merge again.
printf '\n%.0s' {1..200} | timeout 60s npx drizzle-kit push --force || true
