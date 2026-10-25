# Secrets

No plaintext secret belongs in this repository. This includes database and
NATS credentials, GitHub tokens, registry credentials, OAuth clients, TLS
private keys and kubeconfigs.

The demo ClusterResourceTypes use External Secrets Operator Password generators
on the data plane. OpenChoreo bindings expose only Secret name/key references;
credential bytes do not transit the control plane or Git.

The GitOps workflow requires a `gitops-token` held by the platform's external
secret store and materialized through the configured `ClusterSecretStore`. The
source repository is public, so a source token is optional. If the repository
becomes private, store `git-token` in the same external store.

Before enabling the workflow, verify:

```bash
kubectl get crd externalsecrets.external-secrets.io
kubectl get clustersecretstore default
kubectl get clustersecretstore default -o jsonpath='{.status.conditions}'
```

Back up the external secret store separately. Git can restore references, not
the secret values behind them.
