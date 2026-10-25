# Platform-shared ownership

No cluster-scoped object is adopted here yet. The prior installation showed
platform resources managed by Helm, and the current workstation has no
Kubernetes context. Adding those objects to Flux now could create two owners
for the same resource.

After access is restored, classify every ClusterDataPlane,
ClusterWorkflowPlane, ClusterObservabilityPlane, ClusterComponentType,
ClusterResourceType, ClusterWorkflow, and ClusterTrait. Add only custom,
unowned resources here. Keep Helm-owned objects in the Helm values repository.

The `postgres` ClusterResourceType must preserve the previously corrected
projected-volume permission `defaultMode: 493` (decimal representation of
octal `0755`) if it is custom. Export its spec without status or server fields,
review it, and only then place it under `platform-shared/resource-types/`.
