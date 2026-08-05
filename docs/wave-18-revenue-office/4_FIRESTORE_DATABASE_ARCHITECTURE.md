# Firestore Database Architecture for Revenue Domain

## Overview
The database architecture enforces strict multi-tenant isolation. Platform-level revenue data must exist in a globally distinct collection root from tenant-level operational data.

## Collections

### 1. Platform Root: `/revenue_platform`
Used strictly for Illumine's global revenue operations.
- `/revenue_platform/{illumine_id}/leads/{lead_id}`
- `/revenue_platform/{illumine_id}/accounts/{account_id}`
- `/revenue_platform/{illumine_id}/opportunities/{opportunity_id}`
- `/revenue_platform/{illumine_id}/pricing_plans/{plan_id}`
- `/revenue_platform/{illumine_id}/contracts/{contract_id}`
- `/revenue_platform/{illumine_id}/subscriptions/{subscription_id}`
- `/revenue_platform/{illumine_id}/invoices/{invoice_id}`
- `/revenue_platform/{illumine_id}/payments/{payment_id}`
- `/revenue_platform/{illumine_id}/commissions/{commission_id}`

#### Proposal Aggregates
To maintain strict domain consistency, proposals use subcollections:
- `/revenue_platform/{illumine_id}/proposals/{proposalId}`
  - `/versions/{versionId}`
  - `/access_sessions/{sessionId}`
  - `/approvals/{approvalId}`
  - `/acceptances/{acceptanceId}`
  - `/audit_logs/{logId}`

### 2. Tenant Provisioning: `/tenants`
The bridge between Revenue and Operations.
- `/tenants/{tenant_id}/entitlements/{entitlement_id}` (Granted by platform, read-only for tenant)
- `/tenants/{tenant_id}/licenses/{license_id}` (Generated from entitlements)
- `/tenants/{tenant_id}/audit_log/{log_id}` (Revenue Audit Trail entries affecting this tenant)

## Security Rules (High-Level)
```javascript
match /revenue_platform/{docId=**} {
  // Only users with 'illumine_admin' or 'revenue_manager' custom claims can read/write.
  allow read, write: if request.auth.token.role in ['illumine_admin', 'revenue_manager'];
}

match /tenants/{tenantId}/entitlements/{docId} {
  // Tenants can read their entitlements, but ONLY platform roles can write them.
  allow read: if request.auth.token.tenantId == tenantId;
  allow write: if request.auth.token.role in ['illumine_admin', 'revenue_manager'];
}
```
