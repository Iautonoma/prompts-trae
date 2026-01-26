#!/usr/bin/env bash
set -euo pipefail

# Sync local .env values to Vercel Project envs (Production/Preview)
# Requirements:
# - vercel CLI installed: npm i -g vercel
# - VERCEL_TOKEN exported
# - Optional: VERCEL_SCOPE for team/organization
# Usage:
#   export VERCEL_TOKEN=your_token
#   export VERCEL_SCOPE=your_team   # optional
#   ./scripts/env-sync-vercel.sh
#
# Notes:
# - This script reads .env from repo root
# - It updates Vercel envs non-interativamente via stdin
# - Variables synced: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ROOT_DIR}/.env"

if ! command -v vercel >/dev/null 2>&1; then
  echo "ERROR: vercel CLI não encontrado. Instale com: npm i -g vercel"
  exit 1
fi

if [[ -z "${VERCEL_TOKEN:-}" ]]; then
  echo "ERROR: VERCEL_TOKEN não definido. Exporte: export VERCEL_TOKEN=..."
  exit 1
fi

SCOPE_FLAG=()
if [[ -n "${VERCEL_SCOPE:-}" ]]; then
  SCOPE_FLAG=(--scope "${VERCEL_SCOPE}")
fi

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "ERROR: arquivo .env não encontrado em ${ROOT_DIR}. Crie com base em .env.example"
  exit 1
fi

# Carrega valores do .env
VITE_SUPABASE_URL="$(grep -E '^VITE_SUPABASE_URL=' "${ENV_FILE}" | sed 's/^VITE_SUPABASE_URL=//')"
VITE_SUPABASE_ANON_KEY="$(grep -E '^VITE_SUPABASE_ANON_KEY=' "${ENV_FILE}" | sed 's/^VITE_SUPABASE_ANON_KEY=//')"

if [[ -z "${VITE_SUPABASE_URL}" || -z "${VITE_SUPABASE_ANON_KEY}" ]]; then
  echo "ERROR: VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY ausentes no .env"
  exit 1
fi

echo "Sincronizando envs com a Vercel..."

# Atualiza Production
printf "%s" "${VITE_SUPABASE_URL}"      | vercel env add VITE_SUPABASE_URL production --token "${VERCEL_TOKEN}" "${SCOPE_FLAG[@]}" >/dev/null || true
printf "%s" "${VITE_SUPABASE_ANON_KEY}" | vercel env add VITE_SUPABASE_ANON_KEY production --token "${VERCEL_TOKEN}" "${SCOPE_FLAG[@]}" >/dev/null || true

# Atualiza Preview (opcional)
printf "%s" "${VITE_SUPABASE_URL}"      | vercel env add VITE_SUPABASE_URL preview    --token "${VERCEL_TOKEN}" "${SCOPE_FLAG[@]}" >/dev/null || true
printf "%s" "${VITE_SUPABASE_ANON_KEY}" | vercel env add VITE_SUPABASE_ANON_KEY preview    --token "${VERCEL_TOKEN}" "${SCOPE_FLAG[@]}" >/dev/null || true

echo "Concluído. Faça um redeploy para aplicar."
