/**
 * Formato e Tradutor de Governança Consolidada (EVC i18n & Domain Sanitizer)
 * Elimina vazamentos de códigos internos, enums em inglês e IDs técnicos em telas executivas.
 */

export function formatConfidenceLabel(confidence: string): string {
  switch (confidence) {
    case 'HIGH': return 'Alta';
    case 'MEDIUM': return 'Média';
    case 'LOW': return 'Baixa';
    default: return confidence;
  }
}

export function formatSeverityLabel(severity: string): string {
  switch (severity) {
    case 'CRITICAL': return 'Crítica';
    case 'SEVERE': return 'Severa';
    case 'ELEVATED': return 'Elevada';
    case 'WARNING': return 'Alerta';
    case 'HIGH': return 'Alta';
    case 'MEDIUM': return 'Média';
    case 'LOW': return 'Baixa';
    default: return severity;
  }
}

export function formatInstitutionalRoleLabel(role: string): string {
  const map: Record<string, string> = {
    HOLDING_PATRIMONIAL: 'Holding Patrimonial',
    HOLDING_OPERACIONAL: 'Holding Operacional',
    SUBSIDIARIA_OPERACIONAL: 'Subsidiária Operacional',
    SPE: 'Sociedade de Propósito Específico (SPE)',
    CENTRO_ADMINISTRATIVO: 'Centro de Serviços Compartilhados',
    VEICULO_FINANCEIRO: 'Veículo Financeiro',
    UNIDADE_DEFICITARIA: 'Unidade Deficitária',
    UNIDADE_ESTRATEGICA: 'Unidade Estratégica',
  };
  return map[role] || role.replace(/_/g, ' ');
}

export function formatSystemicRiskLabel(riskType: string): string {
  const map: Record<string, string> = {
    LIQUIDITY_CHAIN_COLLAPSE: 'Colapso em Cadeia de Liquidez',
    DEBT_CONCENTRATION: 'Concentração de Endividamento',
    SYSTEMIC_DEPENDENCY: 'Dependência Sistêmica',
    DOMINO_EFFECT: 'Efeito Dominó',
    TREASURY_CONTAMINATION: 'Contaminação de Tesouraria',
    FRAGILITY_CONSOLIDATION: 'Consolidação de Fragilidades',
  };
  return map[riskType] || riskType.replace(/_/g, ' ');
}

export function formatCausalityLabel(causalityType: string): string {
  const map: Record<string, string> = {
    ARTIFICIAL_GROWTH: 'Crescimento Artificial Intragrupo',
    OPERATIONAL_PARASITISM: 'Parasitismo Operacional',
    CROSS_REVENUE_DEPENDENCY: 'Dependência Cruzada de Receita',
    INTERCOMPANY_FUNDING: 'Financiamento Intercompany',
    ARTIFICIAL_SUBSIDIZATION: 'Subvenção Artificial',
    REVENUE_CONCENTRATION: 'Concentração de Receita',
    DEBT_CONCENTRATION: 'Concentração de Dívida',
  };
  return map[causalityType] || causalityType.replace(/_/g, ' ');
}

export function formatDependencyTypeLabel(depType: string): string {
  const map: Record<string, string> = {
    FUNDING: 'Aporte / Mútuo',
    REVENUE: 'Receita Intercompany',
    DEBT: 'Endividamento Cruzado',
    GUARANTEE: 'Garantia / Fiança',
  };
  return map[depType] || depType;
}

export function formatEntityName(entityId: string): string {
  if (!entityId) return '';
  const clean = entityId.trim();
  const map: Record<string, string> = {
    'holding-1': 'Holding Patrimonial (Matriz)',
    'sub-op-1': 'Subsidiária Operacional 1',
    'sub-op-2': 'Subsidiária Operacional 2',
    'holding-2': 'Holding 2',
    'spe-1': 'SPE 1',
  };
  if (map[clean]) return map[clean];
  
  return clean
    .replace(/^holding-/i, 'Holding ')
    .replace(/^sub-op-/i, 'Subsidiária Operacional ')
    .replace(/^spe-/i, 'SPE ')
    .replace(/-/g, ' ');
}
