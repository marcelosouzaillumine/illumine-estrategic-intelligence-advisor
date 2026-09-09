export const LEGACY_ROUTE_REGISTRY: Record<string, { capability: string }> = {
  '/dre': { capability: 'cfo.financial-performance' },
  '/dre_gerencial': { capability: 'cfo.financial-performance' },
  '/dfc': { capability: 'cfo.cash-governance' },
  '/orcamento': { capability: 'cfo.planning-forecast' },
  '/modelagem': { capability: 'cfo.planning-forecast' }, // Adjust if necessary
  '/contas_receber': { capability: 'cfo.working-capital' },
  '/contas_pagar': { capability: 'cfo.working-capital' },
  '/dashboard': { capability: 'ceo.executive-overview' },
  '/consolidated_executive': { capability: 'ceo.executive-overview' },
  // Commercial
  '/dashboard_comercial': { capability: 'commercial.executive-overview' },
  '/comercial_estrategico': { capability: 'commercial.commercial-performance' },
  '/analise_mercado': { capability: 'commercial.customer-governance' },
  '/precificacao': { capability: 'commercial.pipeline-governance' },
  '/dashboard_marketing': { capability: 'commercial.customer-governance' },
  '/marketing_estrategico': { capability: 'commercial.customer-governance' },
  // COO (Operational)
  '/dashboard_operacional': { capability: 'coo.executive-overview' },
  '/operating_pressure': { capability: 'coo.executive-overview' },
  '/producao': { capability: 'coo.process-execution' },
  '/logistica': { capability: 'coo.logistics-supply-chain' },
  '/compras': { capability: 'coo.procurement-governance' },
  '/administrativa_indicadores': { capability: 'coo.operational-excellence' },
  // People
  '/pessoal': { capability: 'people.executive-overview' },
  '/dashboard_cultura': { capability: 'people.culture-engagement' },
  '/perfil_lideranca': { capability: 'people.leadership-governance' },
  '/quadro_pessoal': { capability: 'people.workforce-governance' },
  '/avaliacao_organograma': { capability: 'people.organizational-governance' },
  '/custos_pessoal': { capability: 'people.people-costs' },
  '/academy_home': { capability: 'people.learning-development' },
  // Governance
  '/plano_estrategico': { capability: 'governance.strategic-alignment' },
  '/diretrizes': { capability: 'governance.strategic-alignment' },
  '/decision_center': { capability: 'governance.decision-governance' },
  '/reunioes': { capability: 'governance.board-governance' },
  '/planos_acao': { capability: 'governance.decision-governance' },
  // Risk & Compliance
  '/governance_risk_heatmap': { capability: 'risk.enterprise-risk' },
  '/compliance_integrity_center': { capability: 'risk.compliance-governance' },
  '/risk_exposure_center': { capability: 'risk.risk-governance' },
  // Innovation
  '/dashboard_inovacao': { capability: 'innovation.executive-overview' }
};
