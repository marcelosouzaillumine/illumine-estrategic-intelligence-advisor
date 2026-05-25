# Systemic Heatmap UI Plan

Este documento estabelece as diretrizes arquiteturais para a implementação da **Systemic Heatmap UI**, camada visual responsável por exibir o mapa de contágio sistêmico gerado exclusivamente pela `Consolidated Stress Propagation Engine`.

## 1. Princípio Central (Dummy Renderer)

A Systemic Heatmap UI é estritamente uma **View Layer**. Ela é 100% passiva e obedece aos seguintes limites fundamentais:
- **NÃO** calcula risco;
- **NÃO** infere propagação de contágio;
- **NÃO** gera recomendações (advisory local);
- **NÃO** toma decisão sobre severidade de impacto;
- **NÃO** importa nenhuma Engine do core.

Toda inteligência exibida deve originar-se unicamente do *RuntimeOutput consolidado*, especificamente os campos mapeados pelo `SystemicRiskProfile`.

## 2. Modelagem Passiva (ViewModel)

A UI consome os seguintes dados puros, extraídos do *RuntimeOutput* (`SystemicRiskProfile`):
- `systemicStressMap`
- `propagatedRisks`
- `contagionLineage`
- `systemicConfidence`
- `stressPropagationWarnings`
- `affectedEntities`
- `criticalDependencyChains`

Nenhum dado externo pode ser usado para derivar impacto, e nenhum valor pode sofrer mutação dentro dos componentes React.

## 3. Estados Visuais Obrigatórios

### A. Estado Normal
Exibição integral do mapa de estresse sistêmico, entidades afetadas e as ramificações de contágio (lineage e cadeias críticas).

### B. Estado Vazio (Empty State)
Acionado pela ausência de um runtime consolidado válido.  
**Mensagem exibida:** “Mapa sistêmico indisponível: runtime consolidado não executado.”

### C. Alerta de Baixa Confiança
Acionado quando `systemicConfidence = 'LOW_CONFIDENCE_PROPAGATION'`.  
**Mensagem explícita exigida:** “Baixa confiança sistêmica: os dados disponíveis não sustentam inferência consolidada confiável.”

### D. Dependência Não Verificada
Acionado quando `systemicConfidence = 'UNVERIFIED_DEPENDENCY'`.  
**Mensagem explícita exigida:** “Dependência não verificada: há relações sistêmicas sem validação suficiente pelo runtime consolidado.”

### E. Warnings
Quando a matriz `stressPropagationWarnings` for detectada, a UI deve apenas renderizar o array de forma declarativa, sem derivar cor, estado ou nova semântica da string do texto.

## 4. Governança e Compliance Guard

A checagem passiva (pre-flight render) deve ser encapsulada em um wrapper puramente estrutural (`SystemicHeatmapComplianceGuard`).
**Validações Mínimas Obrigatórias:**
- O array de warnings existe?
- O `systemicConfidence` existe e é reconhecido?
- Existem campos matriz (`systemicStressMap` e `propagatedRisks`) em formato de Array?

**Proibições Formais:**
- `SystemicHeatmapComplianceGuard` NÃO PODE validar a qualidade semântica da severidade para bloquear a tela.
- Métodos array como `.sort()` são expressamente proibidos caso venham a ser usados para ordenar riscos com base em cálculos internos da UI.

## 5. Auditoria de Código (RegressionDetectionEngine)
Quaisquer instâncias das strings abaixo serão bloqueadas pelo linting arquitetural em ambiente React da Heatmap:
- `calculateSystemicRisk`
- `inferContagion`
- `generateRecommendation`
- `calculatePropagation`
- `localRiskScore`
- `systemicScore`
- `riskMatrix`
- `aiAnalysis`
- `advisory`
- `severity =`
- `confidence =`
- `ConsolidatedStressPropagationEngine` (Qualquer import direto no Front-End)
