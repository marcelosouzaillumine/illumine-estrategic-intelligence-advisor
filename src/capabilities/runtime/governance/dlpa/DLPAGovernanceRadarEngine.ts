export class DLPAGovernanceRadarEngine {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  public static evaluate(capitalPreservedPercent: number): string {
    if (capitalPreservedPercent >= 100) {
      return 'Capital Expandido';
    } else if (capitalPreservedPercent >= 75) {
      return 'Capital Preservado';
    } else if (capitalPreservedPercent >= 50) {
      return 'Capital em Recomposição';
    } else {
      return 'Capital Fragilizado';
    }
  }

  public static resolveStatus(resolvedCapitalStatus: string, capitalPreservedPercent: number): string {
    if (capitalPreservedPercent < 75) {
      const isExpOrCons = resolvedCapitalStatus.includes('Expansão') ||
                           resolvedCapitalStatus.includes('Consolidação') ||
                           resolvedCapitalStatus.includes('Consolidada') ||
                           resolvedCapitalStatus.includes('Formação') ||
                           resolvedCapitalStatus.includes('Preservado') ||
                           resolvedCapitalStatus.includes('PRESERVED') ||
                           resolvedCapitalStatus.includes('NEUTRO') ||
                           resolvedCapitalStatus.includes('SAUDÁVEL') ||
                           resolvedCapitalStatus.includes('EXPANSION');
      if (isExpOrCons) {
        return this.evaluate(capitalPreservedPercent);
      }
    }
    return resolvedCapitalStatus;
  }
}
