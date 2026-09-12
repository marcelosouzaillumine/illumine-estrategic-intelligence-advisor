export interface InstitutionalViewContract {
  /**
   * Visão consolidada pronta para renderização na UI.
   * Componentes React devem apenas ler essas propriedades e não realizar lógica (if/else semântico).
   */
  readonly disclosures: {
    readonly isCritical: boolean;
    readonly primaryDisclosure: string | null;
    readonly secondaryDisclosures: string[];
    readonly blockedSections: string[];
  };

  readonly causality: {
    readonly primaryEvent: string;
    readonly rootCause: string;
    readonly systemicPropagation: string;
    readonly executiveInsight: string;
  };

  readonly maturity: {
    readonly stageLabel: string;
    readonly historicalDensityLabel: string;
    readonly canShowEvolution: boolean;
  };

  readonly severity: {
    readonly colorClass: string;
    readonly levelLabel: string;
  };

  readonly narrative: {
    readonly header: string;
    readonly executiveSummary: string;
  };

  readonly telemetry: {
    readonly bpConfidence: number;
    readonly dreConfidence: number;
    readonly dfcConfidence: number;
    readonly isFailClosedActivated: boolean;
  };

  readonly memory?: {
    readonly continuityStatus: string;
    readonly continuityNarrative: string;
    readonly persistentRecommendations: Array<{
      recommendation: string;
      consecutiveCycles: number;
      status: string;
    }>;
    readonly resolutions: Array<{
      issueName: string;
      status: string;
      narrative: string;
    }>;
    readonly patterns: Array<{
      name: string;
      description: string;
      severity: string;
    }>;
    readonly isTrueTurnaround: boolean;
    readonly turnaroundReason: string;
  };
}
