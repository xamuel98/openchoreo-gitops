# Operations

## Durable changes

Do not make a durable configuration change only through Backstage, `kubectl
edit`, or the OpenChoreo API. Create a branch, edit Git, validate, open a pull
request, obtain review, merge, and let Flux reconcile. The portal remains the
preferred view for builds, logs, metrics, events and troubleshooting.

Flux is configured with pruning for platform-shared, platform and project
paths. A manual change to a field owned by Flux is reverted on reconciliation.
A manually created object not present in Git is not automatically deleted
unless it falls within a Flux inventory previously applied by that
Kustomization.

## Bootstrap order

1. Install OpenChoreo and its external prerequisites through the platform's
   Helm process.
2. Install Flux only after cluster-owner approval.
3. Configure `flux/gitrepository.yaml` with the real remote.
4. Apply `GitRepository`, then the namespace, platform-shared, platform and
   projects Kustomizations.
5. Wait for ProjectReleaseBinding readiness.
6. Use the installed-version-compatible `occ` release mechanism to resolve the
   controller-created ResourceReleases, then commit the exact binding fields it
   generates. Do not calculate hashes or invent release names. This step is
   currently BLOCKED because `occ` and Kubernetes access are unavailable.
7. Wait for ResourceReleaseBindings to become Ready.
8. Run each component's `docker-gitops-release` build, review its PR, merge it,
   and wait for the ReleaseBinding.

The checked-in workflow follows the current upstream OpenChoreo GitOps sample,
which references `ghcr.io/openchoreo/openchoreo-cli:latest-dev`. Before enabling
it, replace that floating development tag with the CLI image/tag (preferably a
digest) supported by the installed OpenChoreo version and validate the workflow
in a disposable environment.

## Governance

Protect `main`, disallow direct pushes, require at least one approval and
successful validation, require CODEOWNERS for `platform-shared/` and bindings,
and retain GitHub audit history. Production bindings, when added, require a
platform-team approval.
