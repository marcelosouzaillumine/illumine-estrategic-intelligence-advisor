export interface CapitalProtectionResolverInput {
  dlpaExecutiveStatus?: string;
  dlpaCapitalStatus?: string;
  dlpaResolvedCapitalStatus?: string;
  capitalPreservedPercent?: number; // <= 100
}

export class CapitalProtectionCanonicalResolver {
  /**
   * Determina o status de proteção de capital do Snapshot Executivo.
   * Não pode usar equity > 0 como proxy.
   * Regra baseada em capitalPreservedPercent da DLPA.
   */
  public static resolve(input: CapitalProtectionResolverInput): string {
    // Se a DLPA calculou a porcentagem preservada, aplica a taxonomia obrigatória ECIF v1.0
    if (input.capitalPreservedPercent !== undefined) {
      if (input.capitalPreservedPercent < 50) return 'Capital Fragilizado';
      if (input.capitalPreservedPercent < 75) return 'Capital em Recomposição';
      if (input.capitalPreservedPercent < 100) return 'Capital Preservado';
      return 'Capital Expandido';
    }

    // Fallbacks diretos dos motores da DLPA, que também já seguem as lógicas rigorosas.
    if (input.dlpaResolvedCapitalStatus) return input.dlpaResolvedCapitalStatus;
    if (input.dlpaCapitalStatus) return input.dlpaCapitalStatus;
    if (input.dlpaExecutiveStatus) return input.dlpaExecutiveStatus;

    // Se nenhuma fonte DLPA for enviada (exceção extrema), consideramos fragilizado prudencialmente
    return 'Capital Fragilizado';
  }
}
