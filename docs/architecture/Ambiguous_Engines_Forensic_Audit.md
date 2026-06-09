# Ambiguous Engines Forensic Audit Report
## Auditoria Forense em Bloco: Motores Ambíguos (Grupo 2)

**Status Geral:** **Concluído (Consolidação via Desmembramento Nominal Completa)**

Este relatório compila a investigação forense read-only de seis abstrações consideradas "ambíguas" e de alto risco de consolidação pela heurística de auditoria estrutural.

---

### 1. EarningsQualityEngine
**Instâncias detectadas:**
- `src/core/runtime/cash-intelligence/EarningsQualityEngine.ts` (60 linhas)
- `src/core/runtime/governance/dre/EarningsQualityEngine.ts` (67 linhas)

**Diagnóstico:** Colisão Nominal (Abstrações Complementares).
- A instância em `cash-intelligence/` foca na métrica de conversão de caixa (Cash Conversion), avaliando o quão bem o EBITDA e Lucro se convertem em FCO (Fluxo de Caixa Operacional). Retorna um sinal institucional.
- A instância em `governance/dre/` foca na composição contábil da DRE, comparando receitas recorrentes (operações base) versus eventos não operacionais/financeiros. Retorna um *EarningsQualityAssessment*.
**Ação Recomendada:** Renomear. Ex: `EarningsCashConversionEngine` e `EarningsCompositionEngine`.

---

### 2. CapitalPreservationEngine
**Instâncias detectadas:**
- `src/core/runtime/treasury-intelligence/CapitalPreservationEngine.ts` (74 linhas)
- `src/core/runtime/governance/bp/CapitalPreservationEngine.ts` (207 linhas)

**Diagnóstico:** Colisão Nominal.
- A instância em `treasury-intelligence/` atua como um sistema de *scoring* global focado na preservação de tesouraria, calculando uma nota (0 a 100) baseada no declínio diário de caixa.
- A instância em `governance/bp/` atua como um gerador profundo de indicadores patrimoniais para o Balanço Patrimonial (*PatrimonialIndicator[]*), calculando CEV (Capital Erosion Velocity), EQI e Survival Index.
**Ação Recomendada:** Renomear. Ex: `TreasuryPreservationScoringEngine` e `PatrimonialPreservationEngine`.

---

### 3. ExecutiveAttentionEngine
**Instâncias detectadas:**
- `src/core/runtime/executive-orchestration/cognitive/ExecutiveAttentionEngine.ts` (59 linhas)
- `src/core/governance/executive-attention/ExecutiveAttentionEngine.ts` (13 linhas)

**Diagnóstico:** Colisão Nominal.
- A instância `cognitive/` realiza a ordenação determinística de uma fila de sinais de atenção (`CognitiveSignal[]` -> `PrioritizedAttentionItem[]`), gerando pesos lógicos para o executivo.
- A instância `executive-attention/` atua primariamente como uma trava (*gatekeeper*) de visibilidade baseada em cargos (Ex: apenas sinais críticos chegam ao BOARD).
**Ação Recomendada:** Renomear. Ex: `ExecutiveSignalPriorityEngine` e `ExecutiveSignalVisibilityEngine`.

---

### 4. GovernanceRecommendationEngine
**Instâncias detectadas:**
- `src/core/runtime/advisory-narrative/GovernanceRecommendationEngine.ts` (41 linhas)
- `src/core/runtime/governance-orchestration/GovernanceRecommendationEngine.ts` (16 linhas)

**Diagnóstico:** Colisão Nominal.
- A instância `advisory-narrative/` atua exclusivamente no motor de linguagem, concatenando *strings* para formatar os parágrafos de diretrizes estruturais de governança de texto puro.
- A instância `governance-orchestration/` é um construtor de objetos para orquestração, mapeando playbooks estratégicos e empacotando-os em objetos rígidos do tipo `InstitutionalRecommendation` (status pendente de supervisão).
**Ação Recomendada:** Renomear. Ex: `GovernanceNarrativeEngine` e `GovernancePlaybookOrchestrator`.

---

### 5. InstitutionalDisclosureEngine
**Instâncias detectadas:**
- `src/core/runtime/advisory-narrative/InstitutionalDisclosureEngine.ts` (24 linhas)
- `src/core/runtime/institutional-reporting/engines/InstitutionalDisclosureEngine.ts` (56 linhas)

**Diagnóstico:** Colisão Nominal.
- A instância `advisory-narrative/` gera um bloco contínuo de texto bruto (`string`) com avisos legais e selos de linhagem (Fiduciary Disclosure).
- A instância em `institutional-reporting/engines/` gera um *array* estruturado e estrito de objetos (`InstitutionalDisclosure[]` e `FiduciaryRestriction[]`) com metadados para serem ingeridos pela UI corporativa.
**Ação Recomendada:** Renomear. Ex: `InstitutionalDisclosureNarrativeEngine` e `InstitutionalDisclosureReportingEngine`.

---

### 6. ScenarioSimulationEngine
**Instâncias detectadas:**
- `src/core/runtime/scenario-simulation/ScenarioSimulationEngine.ts` (260 linhas)
- `src/core/runtime/scenario/ScenarioSimulationEngine.ts` (242 linhas)

**Diagnóstico:** Colisão Nominal.
- A instância em `scenario-simulation/` projeta a deterioração, a velocidade de colapso, a cadeia de propagação e o escalonamento macro a partir de uma anomalia hipotética pura (risco determinístico em escala).
- A instância em `scenario/` (Laboratório de Cenários Fiduciários) é um micro-simulador matemático real. Ele faz o "snapshot" dos balanços e DREs, aplica estresse aritmético (`InstitutionalShockSimulator`), calcula novas margens financeiras e avalia bloqueios rígidos contra dividendos/CAPEX com caixa estressado.
**Ação Recomendada:** Renomear. Ex: `ScenarioMacroProjectionEngine` e `ScenarioFiduciarySimulator`.

---

### Parecer Arquitetural e Decisão Executiva

**Diagnóstico:**
Ao investigar as 6 instâncias de motores apontadas pela heurística como duplicidades de *risco alto*, o diagnóstico forense contatou tratar-se de **Falsos Positivos de Duplicidade Funcional**. 

O que a base continha era **Colisão de Nomenclatura** ou **Desvio Taxonômico** (Desmembramento Nominal Necessário), em que arquivos com o mesmíssimo nome serviam a domínios inteiramente distintos (ex: calcular conversão de caixa real vs. classificar qualidade recorrente da DRE; projetar vetores macroeconômicos vs. avaliar continuidade fiduciária).

**Ação Executada e Validada:**
Foi autorizado e concluído o **Desmembramento Nominal Cirúrgico** de todas as 6 colisões:

1. `EarningsQualityEngine`:
   - `cash-intelligence/...` -> `EarningsCashConversionEngine.ts`
   - `governance/dre/...` -> `EarningsCompositionEngine.ts`
2. `CapitalPreservationEngine`:
   - `treasury-intelligence/...` -> `TreasuryPreservationScoringEngine.ts`
   - `governance/bp/...` -> `PatrimonialPreservationEngine.ts`
3. `ExecutiveAttentionEngine`:
   - `executive-orchestration/cognitive/...` -> `ExecutiveSignalPriorityEngine.ts`
   - `governance/executive-attention/...` -> `ExecutiveSignalVisibilityEngine.ts`
4. `GovernanceRecommendationEngine`:
   - `advisory-narrative/...` -> `GovernanceNarrativeEngine.ts`
   - `governance-orchestration/...` -> `GovernancePlaybookOrchestrator.ts`
5. `InstitutionalDisclosureEngine`:
   - `advisory-narrative/...` -> `InstitutionalDisclosureNarrativeEngine.ts`
   - `institutional-reporting/...` -> `InstitutionalDisclosureReportingEngine.ts`
6. `ScenarioSimulationEngine`:
   - `scenario-simulation/...` -> `ScenarioMacroProjectionEngine.ts`
   - `scenario/...` -> `ScenarioFiduciarySimulator.ts`

**Resultado:**
Todos os imports foram mapeados e atualizados; nenhum código foi arquivado ou apagado, pois todas as entidades eram componentes autônomos legítimos da arquitetura. A bateria de testes (TFIF, ELSF, etc.) e o *build* atestam integridade total (`0` regressões).
