# Revenue Event Model

## Core Domain Events

### 1. Acquisition & Sales
- `LeadCreated`: Triggered when a new prospect is added.
- `OpportunityCreated`: Triggered when a lead is qualified.
- `ProposalSent`: Triggered when the secure workspace link is shared.
- `ProposalAccepted`: Triggered upon digital signature/acceptance.

### 2. Contract & Billing
- `ContractSigned`: Binding the terms.
- `InvoiceGenerated`: Periodic billing event.
- `PaymentConfirmed`: The authoritative trigger for provisioning.

### 3. Provisioning & Access
- `SubscriptionActivated`: State changes to active following payment.
- `EntitlementGranted`: The platform maps subscription plans to discrete capabilities.
- `LicenseIssued`: Token generated for the tenant to allocate.
- `TenantProvisioned`: First-time setup of a new customer instance.

### 4. Lifecycle & Expansion
- `RenewalCreated`: Auto-generated for next billing cycle.
- `SubscriptionUpgraded`: Modification of active plan limits.
- `SubscriptionCanceled`: Triggers graceful degradation of licenses.
