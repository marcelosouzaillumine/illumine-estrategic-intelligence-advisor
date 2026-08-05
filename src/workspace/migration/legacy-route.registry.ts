export const LEGACY_ROUTE_REGISTRY: Record<string, { capability: string }> = {
  '/dre': { capability: 'cfo.financial-performance' },
  '/dre_gerencial': { capability: 'cfo.financial-performance' },
  '/dfc': { capability: 'cfo.cash-intelligence' },
  '/orcamento': { capability: 'cfo.planning-forecast' },
  '/modelagem': { capability: 'cfo.planning-forecast' }, // Adjust if necessary
  '/contas_receber': { capability: 'cfo.working-capital' },
  '/contas_pagar': { capability: 'cfo.working-capital' },
  '/dashboard': { capability: 'ceo.executive-overview' },
  '/consolidated_executive': { capability: 'ceo.executive-overview' },
  // Commercial
  '/dashboard_comercial': { capability: 'commercial.executive-overview' },
  '/comercial_estrategico': { capability: 'commercial.commercial-performance' },
  '/analise_mercado': { capability: 'commercial.customer-intelligence' },
  '/precificacao': { capability: 'commercial.pipeline-intelligence' },
  '/dashboard_marketing': { capability: 'commercial.customer-intelligence' },
  '/marketing_estrategico': { capability: 'commercial.customer-intelligence' },
  // COO (Operational)
  '/dashboard_operacional': { capability: 'coo.executive-overview' },
  '/operating_pressure': { capability: 'coo.executive-overview' },
  '/producao': { capability: 'coo.process-execution' },
  '/logistica': { capability: 'coo.logistics-supply-chain' },
  '/compras': { capability: 'coo.procurement-intelligence' },
  '/administrativa_indicadores': { capability: 'coo.operational-excellence' },
  // People
  '/pessoal': { capability: 'people.executive-overview' },
  '/dashboard_cultura': { capability: 'people.culture-engagement' },
  '/perfil_lideranca': { capability: 'people.leadership-intelligence' },
  '/quadro_pessoal': { capability: 'people.workforce-intelligence' },
  '/avaliacao_organograma': { capability: 'people.organizational-intelligence' },
  '/custos_pessoal': { capability: 'people.people-costs' },
  '/academy_home': { capability: 'people.learning-development' },
  // Governance
  '/plano_estrategico': { capability: 'governance.strategic-alignment' },
  '/diretrizes': { capability: 'governance.strategic-alignment' },
  '/decision_center': { capability: 'governance.decision-intelligence' },
  '/reunioes': { capability: 'governance.board-intelligence' },
  '/planos_acao': { capability: 'governance.decision-intelligence' },
  // Risk & Compliance
  '/governance_risk_heatmap': { capability: 'risk.enterprise-risk' },
  '/compliance_integrity_center': { capability: 'risk.compliance-intelligence' },
  '/risk_exposure_center': { capability: 'risk.risk-intelligence' },
  // Innovation
  '/dashboard_inovacao': { capability: 'innovation.executive-overview' }
};
