# Architecture

## Application

```text
External client -> hello-api
hello-api -> user-service -> users-db (PostgreSQL)
hello-api -> order-service -> user-service
                         -> orders-db (PostgreSQL)
                         -> event-broker (NATS)
hello-api -> notification-service <- event-broker
```

Only `hello-api:http` is external. The other HTTP endpoints have project
visibility. The source descriptors bind service addresses and managed-resource
outputs to environment variables; no Kubernetes Service address or database
credential is embedded in application code.

## Repository responsibilities

The application repository owns Node.js code, Dockerfiles, tests, and source
workload descriptors. This GitOps repository owns OpenChoreo desired state and
reviewed release pins. A GitOps-capable build creates a branch and pull request
containing the generated Workload, ComponentRelease, and ReleaseBinding. Flux
only deploys it after review and merge.

```text
source Git -> OpenChoreo build -> image registry
                         \-> GitOps PR -> review/merge -> Flux
                                                    -> OpenChoreo CRDs
                                                    -> rendered data-plane state
```

ProjectRelease, ResourceRelease, ComponentRelease, RenderedRelease, Deployment,
Service, HTTPRoute, Pod, ReplicaSet, status, UID, resourceVersion, managedFields,
and timestamps are controller outputs unless a GitOps workflow explicitly
generates the immutable release into a reviewed PR.

## Ownership

| Owner | Resources |
|---|---|
| GitOps | Environment, ProjectType, ComponentType, Project, Components, Resources, bindings, custom GitOps Workflow and templates |
| OpenChoreo controllers | releases not generated into Git, RenderedReleases and status |
| Helm | OpenChoreo installation and any Helm-labelled plane resources |
| External platform | DNS, certificates, Gateway implementation, StorageClasses, registry and secret store |
| Kubernetes/OpenChoreo renderers | Deployments, Services, HTTPRoutes, Pods and PVCs |

The in-repository `postgres` and `nats` ClusterResourceTypes are derived from
the official OpenChoreo getting-started examples at upstream commit
`2b270397b5fdb0f412d3d066bcaedf0977741905`. They are for this learning demo,
not production. The PostgreSQL example is intentionally hardened here: its
optional Adminer deployment and static demo superuser were removed, and its
script mode is stored as decimal `493` to avoid YAML/octal conversion producing
invalid permissions.
