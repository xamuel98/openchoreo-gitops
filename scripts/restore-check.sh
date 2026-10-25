#!/usr/bin/env bash
set -euo pipefail

ns="${OPENCHOREO_NAMESPACE:-default}"
project="hello-world-demo"

kubectl wait --for=condition=Ready "projectreleasebinding/${project}-development" -n "$ns" --timeout=10m
for resource in users-db orders-db event-broker; do
  kubectl wait --for=condition=Ready "resourcereleasebinding/${resource}-development" -n "$ns" --timeout=15m
done
for component in hello-api user-service order-service notification-service; do
  kubectl wait --for=condition=Ready "releasebinding/${component}-development" -n "$ns" --timeout=15m
done

kubectl get project,component,resource -n "$ns"
kubectl get projectreleasebinding,resourcereleasebinding,releasebinding -n "$ns"
