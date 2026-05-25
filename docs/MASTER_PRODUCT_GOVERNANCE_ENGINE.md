# MASTER PRODUCT GOVERNANCE ENGINE

Este documento estipula a arquitetura da camada de **Commercial Operating Model & Product Governance**, responsável por transformar a Illumine de uma rede fiduciária para uma plataforma SaaS comercializável. A premissa central é o princípio do **Scope Guard Fiduciário**: a governança de acesso não deve poluir a matemática original nem comprometer o lineage histórico.

## A Arquitetura de Permissão (Scope Guard)

Nenhuma nova requisição de acesso premium ou consumo de serviço passa livre. Ela deve obrigatoriamente cruzar o gateway: `ProductGovernanceEngine`.

1. **`FeatureEntitlementResolver`**: Analisa o plano ativo do Tenant (ex: *STARTER*, *PROFESSIONAL*, *ENTERPRISE*) mapeado no `ProductPlanRegistry`. Responde se uma *FeatureId* (ex: `AI_COPILOT_ENTERPRISE`) pode ser acionada.
2. **`UsageQuotaEngine`**: Para recursos consumíveis (cenários, reports, ciclos de monitoramento), gerencia limites estritos (`QuotaId`). É um modelo *Append-Only* — não remove histórico em caso de *downgrade*.
3. **`SubscriptionScopeGuard`**: Centraliza a validação holística. Retorna `false` e gera evento de bloqueio caso um tenant tente invocar o *Benchmark Institucional* possuindo uma subscrição desqualificada.
4. **`TrialModeController` & `DemoModeGovernance`**: Trata inquilinos temporários. Expirou o Trial? Suspensão passiva. É modo Demo? O Tenant é jogado em um *Sandbox* e a persistência cruzada é desativada.
5. **`ProductAccessAuditLogger`**: A testemunha ocular fiduciária. O auditor `runProductGovernanceAudit` confere se nenhum evento (`FEATURE_BLOCKED`, `QUOTA_EXCEEDED`) sofre mutação na UI e se as ações locais refletem a decisão do motor.

## Governança da UI

A View Layer (`ProductGovernancePage`, `FeatureEntitlementTable`) atua em estrito modo **Read-Only**:
- A interface não invoca métodos como `unlockFeature()` nem pode injetar a propriedade de permissão no contexto local (bypass).
- A UI não manipula valores como `quotasState[MAX_SCENARIOS] = 10`. Todo consumo e bloqueio é resolvido silenciosamente na Engine.
- É expressamente proibido integrar Stripe ou Asaas diretamente na View Layer, assegurando que o componente fiduciário continue isolado de mutações de banco externo e cartões.
