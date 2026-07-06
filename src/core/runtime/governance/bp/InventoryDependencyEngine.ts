export interface InventoryDependencyOutput {
  dependencyRatio: number;
  classification: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' | 'EXTREME';
  isApplicable: boolean;
}

export class InventoryDependencyEngine {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  public static evaluate(
    estoque: number,
    passivoCirculante: number,
    isInventoryIntensive: boolean
  ): InventoryDependencyOutput | null {
    if (!isInventoryIntensive) {
      return null;
    }

    if (!passivoCirculante || passivoCirculante <= 0) {
      return { dependencyRatio: 0, classification: 'LOW', isApplicable: true };
    }

    const ratio = estoque / passivoCirculante;

    let classification: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' | 'EXTREME' = 'LOW';
    if (ratio > 0.90) {
      classification = 'EXTREME';
    } else if (ratio >= 0.75) {
      classification = 'CRITICAL';
    } else if (ratio >= 0.50) {
      classification = 'HIGH';
    } else if (ratio >= 0.30) {
      classification = 'MODERATE';
    }

    return {
      dependencyRatio: ratio,
      classification,
      isApplicable: true
    };
  }
}
