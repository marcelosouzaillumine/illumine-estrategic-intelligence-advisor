# Rollback & Failure Recovery Plan

This recovery plan provides step-by-step instructions for reversing deployments, security rules, composite indexes, and environment configurations in the event of staging or production anomalies.

## 1. Failed Deployment Rollback

If the web application deployment fails or has runtime issues:
1. Revert to the last known-good commit on the deployment provider (Vercel, Railway, etc.).
2. Confirm the build compiles and runs successfully.

## 2. Firestore Security Rules Rollback

If newly applied Firestore rules cause unexpected access blocks or syntax errors:
1. Revert to the last known-good ruleset by copying the backup file:
   ```bash
   cp firestore.rules.backup firestore.rules
   ```
2. Deploy the rules to the target environment:
   ```bash
   firebase deploy --only firestore:rules
   ```

*Note: Always maintain a copy of the previous rules file as `firestore.rules.backup`.*

## 3. Firestore Indexes Rollback

If new indexes fail to deploy or cause query degradation:
1. Revert to the last known-good index configuration:
   ```bash
   cp firestore.indexes.json.backup firestore.indexes.json
   ```
2. Deploy the indexes:
   ```bash
   firebase deploy --only firestore:indexes
   ```

*Note: Reversing index deletions does not immediately restore old composite indexes; they may take time to build. Keep backups as `firestore.indexes.json.backup`.*

## 4. Environment Variables Rollback

If an environment configuration change breaks authentication or API connections:
1. Revert the values in the deployment dashboard or the local `.env.staging` / `.env` files to the previous configuration.
2. Restart the application server to clear the env cache.

## 5. Degraded Mode Activation

If Firestore queries are hanging or returning connection errors:
1. The `FirestoreFailureReporter` will automatically activate **Degraded Mode** when 3 or more errors occur within 30 seconds.
2. The UI will render an institutional unavailable notification (`InstitutionalUnavailableState.tsx`) or show cached data where possible.
3. Access to critical write paths (such as `governance_ledger` and `audit_events`) will fail-closed.

## 6. Audit Trail Preservation

During any rollback:
1. All rollback operations must be logged to the secure audit trail.
2. System logs must document the reason for rollback, timestamps, and actors involved.
3. Backup databases must be preserved for post-mortem forensics.

## 7. Tenant Access Lockdown Procedure

In the event of an active tenant scope breach (cross-tenant leakage):
1. Immediately deploy a lockdown rule in `firestore.rules` setting:
   ```rules
   match /{document=**} {
     allow read, write: if false;
   }
   ```
2. Deploy the rules using:
   ```bash
   firebase deploy --only firestore:rules
   ```
3. Terminate all active user sessions using the Firebase Auth console or Admin SDK.
4. Assess audit trail logs under the `CROSS_TENANT_ATTEMPT` event key.
