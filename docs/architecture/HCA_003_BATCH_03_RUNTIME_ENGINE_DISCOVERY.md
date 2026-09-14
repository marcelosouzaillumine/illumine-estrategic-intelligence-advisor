# HCA-003 Batch 3A: Runtime Engine Discovery

Este documento mapeia o ecossistema de **Runtime Engines** localizado em `src/core/runtime/` para identificar fragmentação, redundância matemática e sobreposições fiduciárias antes de qualquer tentativa de fusão.

## 1. Topologia do Runtime
Foram escaneados **1334 arquivos** na camada `src/core/runtime/`. 
A estrutura encontra-se radicalmente fragmentada em múltiplos subdomínios, operando frequentemente em silos de consolidação que recalculam métricas.

**Principais Agrupamentos de Domínio Identificados:**
- `governance/` (contendo dlpa, dre, bp, dfc)
- `executive-consolidation/` (Múltiplas engines de síntese executiva)
- `cash-governance/` e `cashflow/`
- `causal-governance/` e `institutional-causality/`
- `audit-assurance/` e `compliance/`
- `consolidated/` e `cross-statement/`

---

## 2. Redundâncias e Sobreposições Estruturais (Overlapping)

O diagnóstico heurístico encontrou anomalias críticas onde o mesmo cálculo/domínio é processado por motores independentes:

### Motores de Consolidação Executiva Concorrentes
Existem várias engines que prometem a "síntese final" ou consolidação de diretrizes executivas, causando divergência (Drift) se a interface visual não souber qual apontar:
- `ExecutiveConsistencyEngine.ts`
- `ExecutivePriorityConsolidationEngine.ts`
- `ExecutiveDecisionSynthesisEngine.ts`
- `ExecutiveStrategicSnapshotEngine.ts`

### Motores de Causalidade (Causal Governance)
Há uma explosão de motores de causalidade segmentados, todos tentado estabelecer causa raiz:
- `CashFlowCausalGovernanceEngine.ts`
- `DecisionToCashCausalityEngine.ts`
- `OperationalCausalityEngine.ts`
- `CapitalStructureCausalityEngine.ts`

### Mapeamento de DTOs e Payloads Repetidos
Foram identificados dezenas de arquivos de Tipagem (`types.ts`) locais para cada engine.
- Interfaces como `ExecutiveDecisionObject`, `AuditLogPayload`, e variados `RuntimePayload` estão clonados ao longo das subpastas ao invés de residirem em um repositório canônico de DTOs.

---

## 3. Classificação de Risco para Consolidação

### 🔴 HIGH RISK (Não tocar agora)
*Motores de consolidação fiduciária e causalidade profunda. A junção manual causaria a quebra da integridade temporal (TFIF).*
- Toda a pasta `causal-governance/` e `executive-consolidation/`.
- Motores que lidam com `TemporalEvidence` e `LineageHash` (DLPA/DFC temporal).

### 🟡 MEDIUM RISK (Fundir sob forte validação)
*Motores de formatação de output e apresentação executiva que apenas moldam dados existentes.*
- `BoardCommunicationEngine.ts`, `ExecutiveNarrativeEngine.ts`, `ScenarioExplanationEngine.ts`.

### 🟢 SAFE RISK (Foco do Batch 3B)
*Duplicações óbvias de nomenclaturas obsoletas e consolidação de exportação de interfaces puras (DTOs/Types).*
- Motores sem dependências de estado que operam como "formatadores de string" ou Validadores sem estado puro (ex: Adapters de formatação vazios).
- Arquivos legados de `Types/Interfaces` espalhados.

---

## 4. Proposta: Batch 3B (Max 1–2 Intervenções Seguras)

Para avançar com absoluta segurança e respeitar os *gates* do projeto, a proposta para o **Batch 3B** atuará puramente na superfície sem alterar regras de negócio:

1. **Intervenção 1: Canonicalização de Tipos de Causalidade (SAFE)**
   - O ecossistema de Causalidade possui tipos espalhados (`DecisionToCashCausalityTypes.ts`, `EarlyWarningTypes.ts`, `causal-types.ts`, `types.ts`).
   - **Ação:** Criar um arquivo canônico em `src/core/runtime/causal-governance/CausalInterfaces.ts` que funde as interfaces puras de input/output, sem mover a lógica matemática das engines.
   - **Risco:** Zero (Apenas refatoração de tipagem estática do TypeScript).

2. **Intervenção 2: Descontinuação Formal de Engine Obsoleta de Demonstração (SAFE)**
   - Analisar o `GuidedBoardJourneyEngine.ts` e `ExecutiveDemoSession.ts` na pasta `executive/` (que claramente são de ambientes de teste/demo).
   - **Ação:** Marcá-las formalmente como `@deprecated` (ou move-las para uma pasta de `/demo`), mapeando quem consome para garantir que o *Core* está purificado de código de demonstração.

Nenhuma lógica matemática, algoritmo de causalidade ou hash de segurança (Lineage) será alterado nesta fase.
