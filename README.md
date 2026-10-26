# OpenChoreo GitOps state

This repository is the declarative source of truth for the `hello-world-demo`
OpenChoreo application. Application code, Dockerfiles, tests, and source
`workload.yaml` descriptors remain in
`https://github.com/xamuel98/hello-openchoreo-demo.git`.

## Ownership boundary

GitOps owns:

- the `development` Environment;
- the `hello-world-demo` Project and its Development ProjectReleaseBinding;
- the four Component declarations and build-from-source configuration;
- the `users-db`, `orders-db`, and `event-broker` Resource declarations;
- Development ResourceReleaseBindings;
- generated Workloads, ComponentReleases, and ReleaseBindings after the
  `docker-gitops-release` workflow opens a pull request.

GitOps also owns the repository-scoped `service` ComponentType, `default`
ProjectType, and the hardened `postgres` and `nats` ClusterResourceTypes.

GitOps does **not** own the OpenChoreo Helm installation, ClusterDataPlane,
ClusterWorkflowPlane, ClusterObservabilityPlane, the existing
`deployment/service` ClusterComponentType, Gateway, DNS, certificates,
StorageClasses, or secret-store installation. Those are platform prerequisites
and must not be adopted until cluster inventory confirms their existing owner.

## Before first reconciliation

1. Restore Kubernetes access and run `scripts/inventory.sh`.
2. Confirm the installed CRDs accept these manifests with
   `scripts/validate.sh --server`.
3. Confirm Flux, `deployment/service`, the External Secrets CRDs, and the
   `default` ClusterDataPlane exist. Check ownership conflicts before allowing
   Flux to reconcile the repository-provided workflow and type definitions.
4. Confirm the configured remote repository is
   `https://github.com/xamuel98/openchoreo-gitops.git` in both the Flux source
   and the `docker-gitops-release` workflow.
5. Store the GitOps write token in the configured external secret store as
   `gitops-token`; never commit the token.
6. Apply the files under `flux/` only after Flux installation is approved.

Run local validation with:

```bash
npm ci
npm test
./scripts/validate.sh
```

See `docs/DISASTER-RECOVERY.md` for recovery and proof requirements.
The evidence-based ownership inventory is in `docs/INVENTORY.md`.
