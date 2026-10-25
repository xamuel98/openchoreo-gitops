#!/usr/bin/env bash
set -euo pipefail

kubectl version
kubectl get nodes -o wide
kubectl get namespaces
kubectl get pods -A -o wide
kubectl get projects,components,workloads,resources -A
kubectl get environments,deploymentpipelines -A
kubectl get projectreleasebindings,releasebindings,resourcereleasebindings -A
kubectl get clusterprojecttypes,clustercomponenttypes,clusterresourcetypes
kubectl get clusterworkflows,clusterdataplanes,clusterworkflowplanes,clusterobservabilityplanes
kubectl get gitrepositories,kustomizations -A 2>/dev/null || true
kubectl get clustersecretstores -A 2>/dev/null || true
kubectl get storageclasses,persistentvolumes
kubectl get persistentvolumeclaims -A

command -v helm >/dev/null && helm list -A || echo "helm: NOT INSTALLED"
command -v flux >/dev/null && flux version || echo "flux CLI: NOT INSTALLED"
command -v occ >/dev/null && occ version || echo "occ CLI: NOT INSTALLED"
