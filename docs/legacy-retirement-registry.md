# Legacy Retirement Registry

This document tracks the retirement lifecycle of legacy pages being migrated into Executive Capabilities. A component should only be removed from `src/components/pages/` when its status changes to `Retired`.

| Component | Status | Target Capability |
| :--- | :--- | :--- |
| `DREPage` | Retired (Archived) | cfo.financial-performance |
| `DreGerencialPage` | Retired (Archived) | cfo.financial-performance |
| `DFCPage` | Retired (Archived) | cfo.cash-governance |
| `OrcamentoPage` | Retired (Archived) | cfo.planning-forecast |
| `FinancialModelingPage` | Retired (Archived) | cfo.planning-forecast |
| `ReceivablesPage` | Retired (Archived) | cfo.working-capital |
| `PayablesPage` | Retired (Archived) | cfo.working-capital |
| `DashboardPage` | Retired (Archived) | ceo.executive-overview |
| `MarketingComercialPage` | Retired (Archived) | commercial.customer-governance |
| `AnaliseMercadoPage` | Retired (Archived) | commercial.customer-governance |
| `PrecificacaoPage` | Retired (Archived) | commercial.pipeline-governance |

## Status Definitions
- **Migrating**: The capability is actively being built. The legacy component is still running in production.
- **Bridge**: The capability acts as a wrapper loading the legacy component.
- **Migrated**: The capability is live and taking over the route. The legacy component is unused but pending final audit.
- **Retired**: The legacy component has been safely deleted from the codebase.
