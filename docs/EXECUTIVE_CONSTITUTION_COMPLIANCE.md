# Inventário de Conformidade da Constituição Visual Executiva

Este documento é o registro oficial de conformidade dos componentes da camada de apresentação da Illumine Governance™ em relação à **Constituição Visual Executiva v5.1**.

## Objetivo
Servir como referência para planejamento técnico e auditorias arquiteturais, separando claramente o que é considerado estável (canônico) e o que ainda demanda evolução (dívida técnica).

---

## ✅ Canônico
Componentes totalmente aderentes à Constituição Visual. Eles utilizam apenas as APIs de tipografia e espaçamento do *Registry*, sendo blindados contra classes de customização (ex: `text-sm`, `font-bold` injetados diretamente).

- `ExecutiveTypographyRegistry` (Fundação)
- `ExecutiveSpacingRegistry` (Fundação)
- `ExecutiveText` / `ExecutiveMetric` (Wrappers)
- `ExecutiveMetricCard` (Fonte Única da Verdade para KPIs)
- `ExecutiveHealthSummaryCard`
- `ExecutiveInsightCard`
- `ExecutiveInfoCard`
- `ExecutiveNarrative`
- `ExecutiveDecisionSummary`
- `ExecutiveExecutionPlan`
- `ExecutiveSectionHeader`

*Regra de Modificação:* Qualquer alteração nestes componentes deve passar obrigatoriamente pela validação do Gatekeeper (`validate-constitution.sh` em modo Strict). Violações quebrarão o build. É expressamente proibida a reintrodução de tipografia arbitrária em suas renderizações ou a aceitação de estilos de overrides que burlem o Design System.

---

## 🟡 Em Migração
Componentes parcialmente adaptados que ainda possuem dívida técnica conhecida. Estão no radar para refatoração e ainda apontam no Gatekeeper em modo `Report-Only`.

*(Atualmente nenhum componente classificado nesta fase intermediária. Os próximos da fila entrarão aqui durante as sprints de refatoração).*

---

## 🔴 Legado
Componentes que permanecem utilizando padrões antigos e aguardam refatoração futura. Eles contêm *hardcodes* tipográficos locais que violam o *Semantic Role Registry*.

- `ExecutiveStat`
- `ExecutiveScore`
- `ExecutiveRiskRow`
- `ExecutiveRestrictionRow`
- `ExecutiveRecommendationBlock`
- `ExecutiveHistoricalLegend`
- `ExecutiveHistoricalInsightCard`
- `ExecutiveHistoricalEvolutionCard`
- `ExecutiveExposureCard`
- `ExecutiveStrategicSemanticCards`
- `ExecutiveTechnicalLayer`
- `ExecutiveTechnicalMetricCard`

*Regra de Modificação:* Componentes nesta categoria deverão ser migrados nas próximas *sprints* de arquitetura visual. Até lá, o *Gatekeeper* aponta suas falhas passivamente (`Report-Only`) para fins de inventário.

---

## Política para Novos Desenvolvimentos
Conforme estabelecido na Sprint de Estabilização v5.1:
1. **Nenhum componente novo** poderá nascer fora da Constituição Visual.
2. Nenhuma página poderá introduzir tipografia arbitrária para contornar limitações do Design System.
3. Nenhum card executivo poderá duplicar funcionalidades já existentes no `ExecutiveMetricCard`.
4. Novas telas deverão reutilizar componentes canônicos antes de considerar qualquer customização.
