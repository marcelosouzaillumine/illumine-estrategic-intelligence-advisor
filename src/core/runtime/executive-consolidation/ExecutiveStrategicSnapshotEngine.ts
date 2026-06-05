export interface ExecutiveStrategicSnapshotResult {
  survivalStatus: string;
  valueCreationStatus: string;
  capitalProtectionStatus: string;
  dominantRisk: string;
  priorityDecision: string;
}

export interface SnapshotEngineInput {
  isSurviving: boolean;
  survivalContext: string;
  isValueCreated: boolean;
  valueCreationContext: string;
  isCapitalProtected: boolean;
  capitalContext: string;
  dominantRisk: string;
  priorityDecision: string;
}

export class ExecutiveStrategicSnapshotEngine {
  /**
   * Gerar a Página Zero com 5 respostas baseadas no contexto de sobrevivência,
   * criação de valor e proteção de capital.
   */
  public static generateSnapshot(input: SnapshotEngineInput): ExecutiveStrategicSnapshotResult {
    const survivalStatus = input.isSurviving 
      ? `Sim. ${input.survivalContext}`
      : `Não. ${input.survivalContext}`;

    const valueCreationStatus = input.isValueCreated
      ? `Sim. ${input.valueCreationContext}`
      : `Não. ${input.valueCreationContext}`;

    const capitalProtectionStatus = input.isCapitalProtected
      ? `Sim. ${input.capitalContext}`
      : `Não/Parcialmente preservado. ${input.capitalContext}`;

    return {
      survivalStatus: survivalStatus.trim(),
      valueCreationStatus: valueCreationStatus.trim(),
      capitalProtectionStatus: capitalProtectionStatus.trim(),
      dominantRisk: input.dominantRisk.trim(),
      priorityDecision: input.priorityDecision.trim()
    };
  }
}
