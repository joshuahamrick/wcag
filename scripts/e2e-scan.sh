#!/usr/bin/env bash
set -euo pipefail

API_BASE_URL="${API_BASE_URL:-http://localhost:4000}"
MAX_PAGES="${MAX_PAGES:-10}"
SITE_URL=""

usage() {
  cat <<EOF
Usage:
  scripts/e2e-scan.sh --url https://example.com [--max-pages 10] [--api http://localhost:4000]

Environment variables:
  API_BASE_URL   (default: http://localhost:4000)
  MAX_PAGES      (default: 10)

This script:
  - Verifies the API is reachable at \$API_BASE_URL/health
  - Starts a scan
  - Polls until completed/failed
  - Downloads JSON + PDF into the current directory
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --url)
      SITE_URL="$2"
      shift 2
      ;;
    --max-pages)
      MAX_PAGES="$2"
      shift 2
      ;;
    --api)
      API_BASE_URL="$2"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown arg: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

if [[ -z "${SITE_URL}" ]]; then
  echo "Missing --url" >&2
  usage >&2
  exit 1
fi

echo "Checking API health: ${API_BASE_URL}/health"
if ! curl -sf "${API_BASE_URL}/health" >/dev/null; then
  echo "API is not reachable at ${API_BASE_URL}." >&2
  echo "Start it (from repo root) with:" >&2
  echo "  ENV_PATH=/Users/jooshy/workspace/personal/wcag/.env.e2e npm run dev --workspace apps/api" >&2
  exit 1
fi

echo "Starting scan: url=${SITE_URL} maxPages=${MAX_PAGES}"
SCAN_ID="$(
  curl -sf -X POST "${API_BASE_URL}/api/scans" \
    -H 'content-type: application/json' \
    -d "{\"siteUrl\":\"${SITE_URL}\",\"maxPages\":${MAX_PAGES}}" \
  | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const j=JSON.parse(s); if(!j.id) process.exit(2); console.log(j.id);})"
)"

echo "Scan started: ${SCAN_ID}"

STATUS="pending"
while :; do
  RES="$(curl -sf "${API_BASE_URL}/api/scans/${SCAN_ID}")"
  STATUS="$(echo "${RES}" | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const j=JSON.parse(s); console.log(j.status||'unknown');})")"
  echo "Status: ${STATUS}"
  if [[ "${STATUS}" == "completed" ]]; then
    break
  fi
  if [[ "${STATUS}" == "failed" ]]; then
    echo "Scan failed. Full response:" >&2
    echo "${RES}" >&2
    exit 2
  fi
  sleep 2
done

JSON_OUT="scan-${SCAN_ID}.json"
PDF_OUT="scan-${SCAN_ID}.pdf"

echo "Downloading JSON -> ${JSON_OUT}"
curl -sf "${API_BASE_URL}/api/scans/${SCAN_ID}/export" > "${JSON_OUT}"

echo "Downloading PDF -> ${PDF_OUT}"
curl -sf "${API_BASE_URL}/api/scans/${SCAN_ID}/report.pdf" > "${PDF_OUT}"

echo "Done."
echo "  - ${JSON_OUT}"
echo "  - ${PDF_OUT}"


