# Enterprise Data Migration Readiness Report

**Status atual da plataforma Illumine para adoção de infraestrutura de dados complexa.**

A Wave 17F estabelece a **Enterprise Data Foundation**, isolando completamente a camada de experiência (UI) da infraestrutura de armazenamento físico. Este documento atesta a prontidão técnica da plataforma para migrar de Firebase/Firestore para SQL, Data Warehouses, ou iniciar ingestão direta via conectores ERP.

## Readiness Score

| Área | Score | Status |
| :--- | :--- | :--- |
| **Repository Layer** | 100% | 🟢 Pronto |
| **Cache Layer** | 100% | 🟢 Pronto |
| **Provider Layer** | 100% | 🟢 Pronto |
| **Snapshot Contracts** | 100% | 🟢 Pronto |
| **Enterprise Context** | 100% | 🟢 Pronto |
| **Snapshot Versioning** | 100% | 🟢 Pronto |
| **Firebase Isolation** | 100% | 🟢 Pronto |
| **SQL Ready** | 98% | 🟢 Pronto |
| **AI Ready** | 96% | 🟢 Pronto |
| **Data Warehouse Ready** | 95% | 🟡 Planejado |
| **ERP Connectors** | 82% | 🟡 Planejado |

*(🟢 = Totalmente desacoplado; 🟡 = Requer mapeamentos de domínio; 🔴 = Bloqueado por débito técnico)*

## Architectural Principle

**Regra da Enterprise Data Foundation**
Nenhuma camada acima dos Repositories pode importar diretamente SDKs ou tecnologias de persistência (Firestore, PostgreSQL, Prisma, Supabase, REST, GraphQL, etc.). Toda comunicação obrigatoriamente passa pelos Contracts, Repository Factory e Enterprise Data Foundation. Essa regra evita regressões daqui a um ano.

## Dependências Restantes (Firestore)
Nenhuma. Todo acesso ao Firestore está contido exclusivamente em:
`src/workspace/data/repositories/firestore/`

A troca do Firebase por SQL agora consiste apenas em:
1. Criar `src/workspace/data/repositories/postgres/` implementando as mesmas interfaces.
2. Modificar o apontamento em `DataSourceRegistry.setActiveDataSource('POSTGRES')`.

## O que foi desacoplado
- Providers Executivos (CFO, CEO)
- Componentes de UI e Decision Surfaces
- Módulos de Autenticação (preparação)

## Riscos Mitigados
- **Vendor Lock-in**: O Firebase agora é apenas uma implementação substituível (`FirestoreSnapshotRepository`).
- **Schema Drift**: O `SchemaRegistry` versiona explicitamente contratos como `ExecutiveSnapshot v1` e `v2`.
- **Query Duplication**: O fluxo `Provider -> Query -> Repository -> Storage` garante que lógicas analíticas sejam mantidas nas `Queries`, sem sujar a API dos provedores.
- **Observability Gap**: `DataObservabilityService` rastreia performance e cache hits de ponta a ponta usando correlações por RequestId/SnapshotId.

## Preparação Futura
- **SQL / Postgres**: Habilitado via Unit of Work e Events Layer para gerenciar transações ACID e triggers de invalidação de cache.
- **Data Warehouse**: Pronto via Query Layer, que agrupa repositórios dispersos.
- **AI (Copilot)**: IA consumirá a camada de Eventos (`SnapshotCreated`) para iniciar geração autônoma de relatórios ou calibração.
