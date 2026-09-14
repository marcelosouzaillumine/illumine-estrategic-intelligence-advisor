import { InstitutionalTerminologyRegistry } from '../../capabilities/financial/i18n/InstitutionalTerminologyRegistry';

export class ExecutiveLocaleEnforcer {
  /**
   * Normaliza textos duros da UI, headings e labels consumindo o InstitutionalTerminologyRegistry.
   * Não afeta variáveis transicionais (estas ficam no InstitutionalLocaleGuard).
   */
  public static normalize(label: string | null | undefined): string {
    if (!label) return '';
    
    // Fallback dictionary in case terminology isn't explicitly loaded
    const fallback: Record<string, string> = {
      'Executive Financial Analytics': 'Inteligência Financeira Executiva',
      'Waterfall de Liquidez Corrente': 'Estrutura de Liquidez Corrente',
      'default': 'Inadimplência Operacional',
      'Board': 'Conselho',
      'KPI': 'Indicador-Chave'
    };

    // Tentar resolver pelo registry usando a key exata se a label formatada existir
    const key = `ui.${label.toLowerCase().replace(/\s+/g, '_')}`;
    const registryValue = InstitutionalTerminologyRegistry[key] || InstitutionalTerminologyRegistry[`ui.${label.toLowerCase()}`];

    let result = registryValue || fallback[label] || label;

    // Normalizações extras
    if (result.toLowerCase().includes('leve em ativos') || result.toLowerCase() === 'asset_light') {
      result = 'Operação com baixa dependência de ativos imobilizados';
    }

    // Remoção de duplicações híbridas (ex: Ponto de Equilíbrio (Ponto de Equilíbrio))
    result = result.replace(/Ponto de Equilíbrio \(Ponto de Equilíbrio\)/gi, 'Ponto de Equilíbrio');
    result = result.replace(/Definição do Ponto de Equilíbrio \(Ponto de Equilíbrio\)/gi, 'Definição do Ponto de Equilíbrio');

    return result;
  }
  /**
   * Remove jargões executivos e substitui pelos equivalentes institucionais (Humanização de texto livre).
   */
  public static humanizeStrategicTerms(text: string | null | undefined): string {
    if (!text) return '';
    let translated = text;
    
    const terms = [
      { en: 'Break-even', pt: InstitutionalTerminologyRegistry['term.breakeven'] || 'Ponto de Equilíbrio' },
      { en: 'Unit Economics', pt: InstitutionalTerminologyRegistry['term.unit_economics'] || 'Economia Unitária' },
      { en: 'Inventory-heavy', pt: InstitutionalTerminologyRegistry['trait.inventory_heavy'] || 'Intensivo em Estoques' },
      { en: 'Asset-light', pt: InstitutionalTerminologyRegistry['trait.asset_light'] || 'Leve em Ativos Imobilizados' },
      { en: 'Supplier dependency', pt: InstitutionalTerminologyRegistry['trait.supplier_dependency'] || 'Dependência de Fornecedores' },
      { en: 'Operational leverage', pt: InstitutionalTerminologyRegistry['trait.operational_leverage'] || 'Alavancagem Operacional' },
      { en: 'Working capital pressure', pt: InstitutionalTerminologyRegistry['trait.working_capital_pressure'] || 'Pressão de Capital de Giro' },
      { en: 'Operational cash cycle', pt: InstitutionalTerminologyRegistry['trait.operational_cash_cycle'] || 'Ciclo de Caixa Operacional' },
      { en: 'Fixed-cost burden', pt: InstitutionalTerminologyRegistry['trait.fixed_cost_burden'] || 'Peso de Custo Fixo' },
      { en: 'Contribution margin pressure', pt: InstitutionalTerminologyRegistry['trait.contribution_margin_pressure'] || 'Pressão de Margem de Contribuição' }
    ];

    terms.forEach(({ en, pt }) => {
      // Regex case insensitive para pegar variações
      const regex = new RegExp(`\\b${en}\\b`, 'gi');
      translated = translated.replace(regex, pt);
    });
    
    return translated;
  }

  /**
   * Elimina completamente N/A, NaN, null, undefined da camada executiva.
   * Substitui por contexto institucional legível.
   */
  public static sanitizeTechnicalLeak(value: any, contextFallback: string = 'Não aplicável'): string {
    if (value === null || value === undefined) return contextFallback;
    const strVal = String(value).trim().toUpperCase();
    if (strVal === 'NAN' || strVal === 'N/A' || strVal === 'NULL' || strVal === 'UNDEFINED' || strVal === 'INSUFFICIENT_DATA') {
      return contextFallback;
    }
    return String(value);
  }
}
