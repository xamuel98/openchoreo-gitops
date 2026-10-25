#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root"
npm test

if [[ "${1:-}" == "--server" ]]; then
  if ! kubectl config current-context >/dev/null 2>&1; then
    echo "BLOCKED: kubectl has no current context" >&2
    exit 2
  fi
  kubectl apply --server-side --dry-run=server -f bootstrap/namespaces -R
  kubectl apply --server-side --dry-run=server -f platform-shared -R
  kubectl apply --server-side --dry-run=server -f namespaces/default/platform -R
  kubectl apply --server-side --dry-run=server -f namespaces/default/projects -R
  if ! grep -Rqs '__GITOPS_REPOSITORY_URL__' flux; then
    kubectl apply --server-side --dry-run=server -f flux -R
  fi
fi
