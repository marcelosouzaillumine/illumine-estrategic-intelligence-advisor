# Revenue Domain Model

## Core Entities

### Acquisition
- **Lead**: Potential platform client (origem, segmento, país, idioma, responsável, status, histórico).
- **Account**: The corporate entity being prospected.
- **Opportunity**: Qualified commercial intent tied to an Account.

### Commercial Modeling (Pricing & Packaging)
- **Pricing Plan (Commercial Plan)**: Platform plans (START, EXECUTIVE) defining features, limits, price, currency, regional availability.
- **Executive Proposal**: Premium proposal instance supporting private pages, secure access, languages, versioning, and digital acceptance.

### Contractual & Lifecycle
- **Contract**: The legal agreement parameters.
- **Subscription**: Active recurring cycle (plano, ciclo, status, início, renovação, cancelamento).

### Authorization & Delivery
- **Entitlement**: The specific rights granted by a Subscription (e.g., "Financial Governance", "AI Agents", Limits).
- **License**: The explicit token mapping Entitlements to a specific Tenant instance.

### Financials
- **Invoice**: The billing document.
- **Payment**: Financial settlement confirmation.
- **Commission**: Partner remuneration calculation based on subscription payments.

### Post-Sales
- **Customer Success Record**: Health score, engagement, renewals, expansion mapping.

## The Authorization Chain
`Subscription -> Entitlement -> License -> User Access`
