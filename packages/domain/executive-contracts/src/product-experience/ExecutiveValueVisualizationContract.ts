export interface ExecutiveValueVisualizationContract {
  readonly visualizationId: string;
  readonly whereAmI: string;            // 1. Onde estou?
  readonly whatHappened: string;        // 2. O que aconteceu?
  readonly whyItHappened: string;       // 3. Por que aconteceu?
  readonly whatIsTheRisk: string;       // 4. Qual o risco?
  readonly whatShouldIDo: string;       // 5. O que devo fazer?
  readonly financialImpactValue: string; // 6. Quanto impacto financeiro gera?
  readonly timeFrameDays: number;       // 7. Quanto tempo tenho?
  readonly assignedOwner: string;       // 8. Quem é o responsável?
}
