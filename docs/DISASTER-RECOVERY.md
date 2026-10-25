# Disaster recovery

Git restores desired configuration; it does not restore database rows, secret
values, registry images, DNS, certificates, persistent volumes or the
OpenChoreo installation.

## Project or namespace deletion

1. Stop further manual mutation and preserve events/logs.
2. Verify Flux and its source are Ready.
3. Reconcile namespace, platform, then project Kustomizations.
4. Wait for `hello-world-demo-development` to recreate the data-plane
   namespace before resource/component bindings.
5. Confirm resource bindings, then component bindings, become Ready.

## Control-plane reinstall

1. Reinstall the pinned OpenChoreo Helm release and CRDs.
2. Restore plane registrations, CA material, secret-store integration and
   authorization from their platform-owned backups.
3. Install/restore Flux and point it at this repository.
4. Reconcile in dependency order and run `scripts/restore-check.sh`.

## Data-plane rebuild

Restore the cluster agent, Gateway, External Secrets Operator, secret store,
StorageClasses, DNS and certificates. Reconcile project infrastructure first.
Restore database storage/backups before starting dependent components when
data continuity matters.

## Full-cluster rebuild

Rebuild Kubernetes, install external prerequisites, install OpenChoreo, restore
platform credentials/certificates and registry access, install Flux, reconcile
Git, restore persistent data, then perform the end-to-end API test.

## Database data

The committed PostgreSQL type supports PVCs, but the bindings currently omit
`persistenceEnabled` until the live StorageClass is inspected. Its default is
therefore ephemeral `emptyDir`. The ResourceReleaseBinding uses `Retain`, which
protects rendered resources from binding deletion but cannot preserve an
`emptyDir` or survive cluster loss. Database-data recovery is **BLOCKED** until
a StorageClass and backup design are approved. Recommended options are
scheduled `pg_dump` to external object storage plus tested restores, CSI volume
snapshots, Velero, or an externally managed PostgreSQL service.

## Proof checklist

- Git files and local validation: can be proven offline.
- Server-side schema validation: requires kubeconfig.
- Flux reconciliation: requires Flux and a remote repository.
- Clean test-namespace restore: requires a disposable namespace/cluster.
- Database row restoration: requires a backup artifact and restore test.

Never delete the current project merely to test this procedure.
