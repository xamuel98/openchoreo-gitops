#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

for kind in environment projecttype componenttype project projectreleasebinding resource resourcereleasebinding component workflow clusterworkflowtemplate clusterresourcetype; do
  kubectl get "$kind" -A -o yaml 2>/dev/null \
    | sed -E '/^[[:space:]]*(status:|uid:|resourceVersion:|generation:|creationTimestamp:|managedFields:)/,$d' \
    > "$tmp/${kind}.yaml" || true
done

echo "Sanitized live inventory written to $tmp for this process."
echo "Review with: diff -ru '$root/namespaces' '$tmp'"
echo "Secret objects and secret values are deliberately excluded."
