# Namespace platform prerequisites

This repository manages only the `development` Environment. The `default`
DeploymentPipeline previously carried Helm ownership annotations, so it is
referenced but deliberately not duplicated here. Confirm it exists before
reconciliation:

```bash
kubectl get deploymentpipeline default -n default
kubectl get clusterprojecttype default
kubectl get clusterdataplane default
```

If `default` is no longer Helm-managed, export and review its desired spec
before transferring ownership to this repository.
