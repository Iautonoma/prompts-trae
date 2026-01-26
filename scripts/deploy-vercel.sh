#!/usr/bin/env bash
set -euo pipefail

# Usage:
#  export VERCEL_TOKEN=your_token
#  export VERCEL_SCOPE=your_team_or_user_slug   # optional for personal accounts
#  export VERCEL_PROJECT=prompts-trae            # desired project name
#  npm run build
#  ./scripts/deploy-vercel.sh
#
# Notes:
# - Requires 'vercel' CLI: npm i -g vercel
# - Uses --prebuilt to deploy the local 'dist' build
# - Non-interactive via --confirm and optional --scope

if ! command -v vercel >/dev/null 2>&1; then
  echo "ERROR: vercel CLI not found. Install with: npm i -g vercel"
  exit 1
fi

if [[ -z "${VERCEL_TOKEN:-}" ]]; then
  echo "ERROR: VERCEL_TOKEN not set. Export your token: export VERCEL_TOKEN=..."
  exit 1
fi

PROJECT_NAME="${VERCEL_PROJECT:-prompts-trae}"
SCOPE_FLAG=""
if [[ -n "${VERCEL_SCOPE:-}" ]]; then
  SCOPE_FLAG="--scope ${VERCEL_SCOPE}"
fi

echo "Deploying to Vercel..."
echo "Project: ${PROJECT_NAME}"
[[ -n "${VERCEL_SCOPE:-}" ]] && echo "Scope: ${VERCEL_SCOPE}"

# Link/create project non-interactively then deploy
vercel --token="${VERCEL_TOKEN}" ${SCOPE_FLAG} --name "${PROJECT_NAME}" --confirm >/dev/null
vercel --token="${VERCEL_TOKEN}" ${SCOPE_FLAG} --prebuilt --prod --confirm

echo "Done. Check your Vercel dashboard for the production URL."
