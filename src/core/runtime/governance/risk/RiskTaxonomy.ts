import { RiskCategory } from './types';

export class RiskTaxonomy {
  private static readonly baseCategories: RiskCategory[] = [
    'Estratégico',
    'Financeiro',
    'Operacional',
    'Jurídico',
    'Reputacional',
    'ESG',
    'Cibernético',
    'Compliance',
    'Liquidez',
    'Continuidade Operacional'
  ];

  // Permite extensão dinâmica da taxonomia por tenant/segmento sem alterar o código base
  private customCategories: Map<string, RiskCategory[]> = new Map();

  /**
   * Retorna as categorias oficiais base da plataforma.
   */
  public getBaseCategories(): RiskCategory[] {
    return [...RiskTaxonomy.baseCategories];
  }

  /**
   * Retorna todas as categorias disponíveis para um tenant específico.
   */
  public getCategoriesForTenant(tenantId: string): RiskCategory[] {
    const tenantCategories = this.customCategories.get(tenantId) || [];
    return [...RiskTaxonomy.baseCategories, ...tenantCategories];
  }

  /**
   * Adiciona novas categorias customizadas (ex: Hospitalar, Varejo) para um tenant específico.
   */
  public registerCustomCategory(tenantId: string, category: string): void {
    const tenantCategories = this.customCategories.get(tenantId) || [];
    if (!tenantCategories.includes(category) && !RiskTaxonomy.baseCategories.includes(category)) {
      tenantCategories.push(category);
      this.customCategories.set(tenantId, tenantCategories);
    }
  }

  /**
   * Valida se uma categoria é reconhecida pela taxonomia atual de um tenant.
   */
  public isValidCategory(tenantId: string, category: string): boolean {
    return this.getCategoriesForTenant(tenantId).includes(category);
  }
}

export const riskTaxonomyEngine = new RiskTaxonomy();
