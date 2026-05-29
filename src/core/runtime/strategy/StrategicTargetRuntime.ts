export interface StrategicTarget {
  kpiId: string;
  strategicTarget: number; // meta do conselho / planejamento
  covenantLimit?: number; // limite institucional (se houver)
}

export class StrategicTargetRuntime {
  /**
   * Obtém as metas estabelecidas no planejamento estratégico ou definidas pelo conselho.
   */
  public static getTarget(kpiId: string): StrategicTarget {
    // Stub
    if (kpiId === 'EBITDA_MARGIN') {
      return {
        kpiId,
        strategicTarget: 12
      };
    }

    return {
      kpiId,
      strategicTarget: 0
    };
  }
}
