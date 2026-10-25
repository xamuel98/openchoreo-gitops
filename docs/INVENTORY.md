# Inventory and ownership classification

Inventory date: 2026-10-25.

Live Kubernetes inventory is **BLOCKED**: this workstation has no configured
`kubectl` context. Portal inventory is also **BLOCKED** because
`openchoreo.internal` does not currently resolve from this workstation. The
classifications below distinguish evidence from the surviving source repository
and earlier observed portal state from facts that still require a live check.

| Item | Classification | Observed state | Git owner |
|---|---|---|---|
| `hello-api` source repository | APPLICATION RESOURCE | SURVIVED; `main` at `3a80405` | application repository |
| `hello-world-demo` Project | APPLICATION RESOURCE | BLOCKED/unknown live state | this repository |
| four Components | APPLICATION RESOURCE | BLOCKED/unknown live state | this repository |
| source Workloads | APPLICATION RESOURCE | SURVIVED in application repository | application repository |
| generated Workloads | GENERATED RESOURCE | BLOCKED/unknown | build workflow PR/controller |
| ComponentReleases and ReleaseBindings | GENERATED RESOURCE | BLOCKED/unknown | build workflow PR/controller |
| `users-db`, `orders-db`, `event-broker` | APPLICATION RESOURCE | BLOCKED/unknown live state | this repository |
| ResourceReleases | GENERATED RESOURCE | BLOCKED/unknown | OpenChoreo controller |
| ResourceReleaseBindings | APPLICATION RESOURCE | BLOCKED/unknown live state | this repository after release pinning |
| `development` Environment | CUSTOM PLATFORM RESOURCE | BLOCKED/unknown live state | this repository, subject to ownership check |
| default DeploymentPipeline | BUILT-IN PLATFORM RESOURCE | previously observed as Helm-managed | Helm, not this repository |
| `deployment/service` ClusterComponentType | BUILT-IN PLATFORM RESOURCE | BLOCKED/unknown live state | installation/platform owner |
| `service` ComponentType | CUSTOM PLATFORM RESOURCE | BLOCKED/unknown live state | this repository |
| `default` ProjectType | CUSTOM PLATFORM RESOURCE | BLOCKED/unknown live state | this repository |
| `postgres`, `nats` ClusterResourceTypes | CUSTOM PLATFORM RESOURCE | BLOCKED/unknown live state | this repository, subject to ownership check |
| `docker-gitops-release` workflow/templates | CUSTOM PLATFORM RESOURCE | BLOCKED/unknown live state | this repository, subject to ownership check |
| ClusterDataPlane/workflow/observability planes | BUILT-IN PLATFORM RESOURCE | BLOCKED/unknown live state | installation/platform owner |
| Deployments, Services, HTTPRoutes, Pods, PVCs | GENERATED RESOURCE | BLOCKED/unknown | OpenChoreo/Kubernetes controllers |
| Flux controllers and sources | BUILT-IN PLATFORM RESOURCE | BLOCKED/unknown live state | cluster platform team |

Before reconciliation, run `scripts/inventory.sh`, update this table with live
evidence, and stop if a Helm release or another reconciler owns any object this
repository proposes to manage.
