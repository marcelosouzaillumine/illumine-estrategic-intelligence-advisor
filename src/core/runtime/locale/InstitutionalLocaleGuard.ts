import { InstitutionalTerminologyRegistry } from '../i18n/InstitutionalTerminologyRegistry';

export class InstitutionalLocaleGuard {
  /**
   * Traduz termos de Business Stage.
   */
  public static translateBusinessStage(stage: string | null | undefined): string {
    if (!stage) return '';
    const key = `stage.${stage.toLowerCase()}`;
    return InstitutionalTerminologyRegistry[key] || stage.replace(/_/g, ' ');
  }

  /**
   * Traduz termos de Operational Model.
   */
  public static translateOperationalModel(model: string | null | undefined): string {
    if (!model) return '';
    const key = `model.${model.toLowerCase()}`;
    return InstitutionalTerminologyRegistry[key] || model.replace(/_/g, ' ');
  }

  /**
   * Traduz termos de Density.
   */
  public static translateDensity(density: string | null | undefined): string {
    if (!density) return '';
    // Use mapped values or replace underscore
    const mapping: Record<string, string> = {
      'SINGLE_YEAR_ONLY': 'Densidade Isolada',
      'INITIAL_HISTORY': 'Histórico Inicial',
      'DEVELOPING_HISTORY': 'Histórico em Desenvolvimento',
      'ESTABLISHED_HISTORY': 'Histórico Estabelecido'
    };
    return mapping[density] || density.replace(/_/g, ' ');
  }

  /**
   * Traduz termos de Contexto (ex: LIMITED_CONTEXT)
   */
  public static translateContext(context: string | null | undefined): string {
    if (!context) return '';
    const key = `context.${context.toLowerCase()}`;
    return InstitutionalTerminologyRegistry[key] || context.replace(/_/g, ' ');
  }

  /**
   * Traduz termos de Perfil Financeiro / Passivo
   */
  public static translateFinancialProfile(profile: string | null | undefined): string {
    if (!profile) return 'Perfil Balanceado';
    const mapping: Record<string, string> = {
      'FINANCIAL_DEBT': 'Dependência de financiamento estruturado',
      'OPERATIONAL_SUPPLIER_FINANCING': 'Dependência elevada de financiamento operacional',
      'SHAREHOLDER_FUNDING': 'Exposição ao capital de sócios/partes relacionadas',
      'TAX_EXPOSURE': 'Elevada exposição ao passivo tributário',
      'JUDICIAL_EXPOSURE': 'Elevada exposição ao contencioso judicial',
      'PAYROLL_PRESSURE': 'Elevada pressão de folha/encargos',
      'STRUCTURED_DEBT': 'Estrutura financeira alavancada por dívida de longo prazo',
      'WORKING_CAPITAL_PRESSURE': 'Dependência relevante de capital operacional de curto prazo',
      'BALANCED_LIABILITY': 'Estrutura financeira conservadora'
    };
    return mapping[profile] || profile.replace(/_/g, ' ');
  }
}
