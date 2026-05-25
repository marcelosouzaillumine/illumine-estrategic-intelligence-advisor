# MASTER INSTITUTIONAL OPERATING SYSTEM (IOS)

Este documento define a arquitetura e os limites fiduciários do **Institutional Operating System (IOS)**, a camada máxima de unificação implementada na Fase 21.

## Princípio Fundamental: Observador Central, Não-Executor

Diferente de um ERP ou um BPM transacional que tomam ações destrutivas (pagam contas, fecham faturas), o **IOS da Illumine é um "Cérebro de Governança Passiva"**. Ele não substitui o ERP; ele assenta-se *sobre* o ERP, o CRM, e o Early Warning System.
Seu objetivo é **sincronizar o estado da empresa em tempo real sem jamais alterar os números fiduciários auditados (BP/DRE) por si mesmo.**

## Motores Centrais

### 1. `InstitutionalStateManager`
Agregador mestre. Junta as peças do quebra-cabeça: o que está falhando no Early Warning? O que os Playbooks da Orchestration recomendam? O que dizem as Simulações? E funde tudo num único *Institutional State*.

### 2. `InstitutionalPulseEngine`
Calcula as pressões invisíveis de uma instituição:
- **Systemic Pressure** (via alertas da Fase 18).
- **Operational Saturation** (via rupturas identificadas em workflows).
- **Governance Stability** (via ativações de Playbooks da Fase 20).
Tudo isso é quantificado para gerar uma *Resilience Trend*.

### 3. `UnifiedGovernanceTimeline`
Cria o fio condutor cronológico determinístico. Permite que o conselho veja uma queda de caixa ontem resultar numa ativação de contenção hoje. Tudo carimbado com *Lineage Hashes*.

### 4. Motores Auxiliares Cross-Domain
- `CrossDomainStateResolver`: Aponta como uma falha logística causa risco em workflow financeiro.
- `OperationalDependencyResolver`: Aponta as "veias" entupidas da organização (Bottlenecks).
- `InstitutionalStateProjection`: Estima o estado T+X sob supervisão estrita.

## Active Governance (`IOSGovernanceEngine`)

O IOS não é uma Skynet. Para garantir isso, a auditoria `runIOSGovernanceAudit.ts` assegura que:
- O módulo *não envia ações de workflow automáticas* (`executeWorkflow` está banido da automação IOS).
- O módulo *não altera o Runtime de confiança (BP/DRE)*.
- O Snapshot Operacional deve morrer (ser limpo in-memory) sempre que houver troca de tenant (`clearSandbox`), protegendo dados cruzados.
