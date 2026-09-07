#!/usr/bin/env bash
#
# Idempotent environment bootstrap for poppin-music.
# Safe to run repeatedly, whether or not a Convex dev backend is already up.
set -euo pipefail

cd "$(dirname "$0")/.."

# 1. Install JS dependencies.
npm install

# 2. Provision / refresh the local Convex deployment and generated types.
#
# Cloud/CI agents have no Convex login, so we use anonymous agent mode. It runs
# a local Convex backend on port 3210 and writes VITE_CONVEX_URL to .env.local.
export CONVEX_AGENT_MODE=anonymous

if curl -sf http://127.0.0.1:3210/version >/dev/null 2>&1; then
  # A dev backend is already running (e.g. re-running setup in a live VM).
  # Don't start a second one on the same port — just refresh generated types.
  echo "Convex backend already running on :3210 — regenerating types only."
  npx convex codegen
else
  # Fresh setup: provision the local deployment, push functions, write
  # .env.local, generate types, then exit.
  npx convex dev --once
fi

echo "poppin-music setup complete."
