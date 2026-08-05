# Permission Matrix (RBAC & Tenant Isolation)

## Roles & Access Levels

| Role | Domain | Scope | Permissions |
| :--- | :--- | :--- | :--- |
| **Illumine Admin** | Platform | Global | Full read/write to all platform revenue data, pricing plans, and partner commissions. |
| **Revenue Manager** | Platform | Global | Create/edit proposals, manage leads/opportunities, view all contracts and subscriptions. Cannot alter pricing rules or global packaging. |
| **Advisor (Partner)** | Platform/Tenant | Bounded | View/create proposals ONLY for their own portfolio (leads mapped to their advisor_id). View own commissions. |
| **Customer Admin** | Tenant | Bounded | View own active subscriptions, contracts, and invoices. Allocate licenses to users based on entitlements. Read-only on pricing. |

## Execution Principles
- No tenant role can write to `revenue_platform`.
- Licenses are generated automatically via events; users do not manually create licenses out of thin air.
