# CONNECTOR_ARCHITECTURE.md — Connector Framework Architecture

> **Especificação e Governança do Framework de Conectores de Dados**  
> *Autoridade Supreme: Architecture Review Board (ARB)*  
> *Alinhado à [`ARCHITECTURE_CONSTITUTION.md`](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/ARCHITECTURE_CONSTITUTION.md) e ADR-078*

---

## 1. Conectores Suportados

```
Connector Framework
├── ERP Connectors (SAP, TOTVS, Omie, ContaAzul, Senior)
├── CRM Connectors (Salesforce, HubSpot, Pipedrive)
├── Banking Connectors (Open Finance, Extratos OFX/JSON)
├── Spreadsheet Connectors (Excel, Google Sheets, CSV)
├── API Connectors (REST, GraphQL, Webhooks)
└── Manual Import Connectors (Demonstrativos Contábeis / DRE Lançados)
```

---

## 2. Metadados Obrigatórios do Conector (`ConnectorSpecification`)

Todo conector registrado na plataforma deve obrigatoriamente fornecer:
- `connectorId`: Identificador único.
- `sourceType`: `ERP` | `CRM` | `BANKING` | `SPREADSHEET` | `API` | `MANUAL`.
- `frequency`: `REALTIME` | `HOURLY` | `DAILY` | `WEEKLY` | `MANUAL`.
- `schemaVersion`: Versão do schema de validação.
- `status`: `HEALTHY` | `SYNCING` | `DEGRADED` | `ERROR`.
- `lastSyncTimestamp`: Data/hora do último lote sincronizado.
- `lineageReference`: Referência ao trace de linhagem de dados.
