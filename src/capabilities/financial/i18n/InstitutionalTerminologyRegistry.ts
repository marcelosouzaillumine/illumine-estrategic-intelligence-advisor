/**
 * @deprecated Utilize o CanonicalInstitutionalTaxonomyRegistry em src/core/runtime/coherence/
 * Este registry foi rebaixado a adapter legado temporário para UI.
 * Novas engines não devem consumir este arquivo.
 */
export const InstitutionalTerminologyRegistry: Record<string, string> = {
  "financial.assets": "Ativos",
  "financial.liabilities": "Passivos",
  "financial.netEquity": "Patrimônio Líquido",
  "common.structural_details": "Detalhamento Estrutural",
  "common.account_billing": "Conta Contábil",
  "common.balance_brl": "Saldo (R$)",
  "common.av": "AV",
  "common.ah": "AH",
  "kpi.ativo_circulante": "Ativo Circulante",
  "kpi.passivo_circulante": "Passivo Circulante",
  
  // Business Stages
  "stage.initial_operation": "Operação Inicial",
  "stage.structuring_operation": "Operação em Estruturação",
  "stage.mature_operation": "Operação Madura",
  "stage.consolidated_operation": "Operação Consolidada",
  "stage.recovery_operation": "Operação em Recuperação",
  "stage.scaling_operation": "Operação em Escala",
  "stage.expanding_operation": "Operação em Expansão",
  
  // Operational Models
  "model.asset_light": "Operação com baixa dependência de ativos imobilizados",
  "model.inventory_heavy": "Operação Intensiva em Estoques",
  "model.project_based": "Operação Baseada em Projetos",
  "model.service_heavy": "Operação Intensiva em Serviços",

  // Analytics Sections & Strategic Terms
  "ui.executive_financial_analytics": "Inteligência Financeira Executiva",
  "ui.waterfall_liquidez_corrente": "Estrutura de Liquidez e Capital de Giro",
  "ui.board": "Conselho",
  "ui.default": "Inadimplência Operacional",
  "ui.kpi": "Indicador-Chave",
  
  // Strategic Terms
  "term.breakeven": "Ponto de Equilíbrio",
  "term.unit_economics": "Economia Unitária",
  
  // Confidências / Contextos
  "context.limited_context": "Contexto Parcial",

  // Operational Segment & Sensitivities
  "trait.inventory_heavy": "Intensivo em Estoques",
  "trait.asset_light": "Leve em Ativos Imobilizados",
  "trait.supplier_dependency": "Dependência de Fornecedores",
  "trait.operational_leverage": "Alavancagem Operacional",
  "trait.working_capital_pressure": "Pressão de Capital de Giro",
  "trait.operational_cash_cycle": "Ciclo de Caixa Operacional",
  "trait.fixed_cost_burden": "Peso de Custo Fixo",
  "trait.contribution_margin_pressure": "Pressão de Margem de Contribuição"
};
