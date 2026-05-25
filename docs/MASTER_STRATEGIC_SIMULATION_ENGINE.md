# MASTER STRATEGIC SIMULATION ENGINE

Este documento estipula a arquitetura da camada de **Institutional Strategic Simulation & Decision Intelligence Layer**, que eleva a plataforma à categoria de **Strategic Governance Simulation Infrastructure**. O sistema atua como o laboratório de governança fiduciária, projetando consequências de decisões críticas antes de sua execução no mundo real.

## Princípios Simuladores

1. **Evidência Obrigatória (`StrategicDecisionEvidenceBinder`)**: Nenhuma simulação ocorre sem vínculo com fatos. Toda projeção exige IDs de workflows engarrafados, anomalias prévias de grafo ou desvios setoriais, carimbando tudo sob o *Lineage Hash*.
2. **Sandbox Isolado**: A engine nunca afeta a matemática de produção (BP, DRE, Advisory original). Todo cenário é construído, propagado e destruído em tempo de execução.
3. **Preditividade de Cascata (`StrategicStressCascade`)**: A Illumine entende que decisões sistêmicas geram "efeito dominó". A engine não analisa apenas o ganho primário, mas também se este ganho gera uma quebra estrutural nas conexões de negócio.
4. **Resilience Forecasting**: Transforma impactos desconexos em um score numérico de sobrevivência, indicando ao conselho o tempo exato estimado de recuperação do choque.

## Motores de Inteligência da Simulação
- **`InstitutionalImpactEngine`**: Analisa o vetor bruto (ex: Aumento de 40% de Liquidez, Perda de 30% em Produtividade).
- **`DecisionPropagationRuntime`**: Descobre quem sofre com o impacto na arquitetura (ex: Workflow de aprovações será asfixiado).
- **`GovernanceTradeoffAnalyzer`**: Resume a discussão fiduciária: "Ganhamos vida por 18 meses, mas nos tornamos sistemicamente dependentes de terceiros".
- **`DecisionRiskBalancer`**: Avalia a sustentabilidade e a fragilidade embutida no cenário de alta magnitude.

## Auditoria Ativa (`runStrategicSimulationGovernanceAudit.ts`)
Para garantir a sanidade e a separação estrita da arquitetura, o CI impede:
- Componentes React rodando `Math.random()` para desenhar o futuro.
- Mutações mascaradas sob o disfarce de "simulação" (`ConfidenceTimelineEngine.override` é banido aqui).
- Persistência indevida de Sandboxes em cache (localStorage), prevenindo vazamento de conjecturas não formalizadas.
