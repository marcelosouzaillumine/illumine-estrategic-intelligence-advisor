export interface ExecutionAssessmentInput {
  efosScore: number;
  projectedRevenueGrowth: number; // percentage
  projectedCapexGrowth: number; // percentage
  projectedOperationalComplexity: number; // 0-100
}

export interface ExecutionAssessmentOutput {
  governancePressureIndex: number;
  institutionalExecutionIndex: number;
  riskLevel: 'Baixo' | 'Moderado' | 'Elevado' | 'Crítico';
  executionCapacity: string;
  institutionalReadiness: string;
  narrative: string;
}

export function calculateInstitutionalExecution(input: ExecutionAssessmentInput): ExecutionAssessmentOutput {
  // Governance Pressure Index (GPI)
  // Higher growth and complexity = higher pressure
  let gpi = (input.projectedRevenueGrowth * 0.4) + (input.projectedCapexGrowth * 0.3) + (input.projectedOperationalComplexity * 0.3);
  if (gpi > 100) gpi = 100;
  if (gpi < 0) gpi = 0;

  // Institutional Execution Index (IEI)
  // IEI = EFOS Score - Governance Penalty (If pressure exceeds maturity)
  // If EFOS is high, it can absorb pressure. 
  let penalty = 0;
  if (gpi > input.efosScore) {
    penalty = (gpi - input.efosScore) * 0.5; // Penalize by half the gap
  }
  
  let iei = input.efosScore - penalty;
  if (iei > 100) iei = 100;
  if (iei < 0) iei = 0;

  // Determine Risk Level
  let riskLevel: 'Baixo' | 'Moderado' | 'Elevado' | 'Crítico' = 'Crítico';
  if (iei >= 80) riskLevel = 'Baixo';
  else if (iei >= 60) riskLevel = 'Moderado';
  else if (iei >= 40) riskLevel = 'Elevado';

  let executionCapacity = '';
  let institutionalReadiness = '';

  if (riskLevel === 'Baixo') {
    executionCapacity = 'Preparado';
    institutionalReadiness = 'A organização possui robustez estrutural para absorver a complexidade do cenário com risco controlado.';
  } else if (riskLevel === 'Moderado') {
    executionCapacity = 'Adequado';
    institutionalReadiness = 'A capacidade de execução suporta o cenário, mas exigirá atenção pontual em processos fiduciários ou operacionais.';
  } else if (riskLevel === 'Elevado') {
    executionCapacity = 'Vulnerável';
    institutionalReadiness = 'A pressão do cenário excede a maturidade atual. Risco elevado de gargalos operacionais ou quebras de governança.';
  } else {
    executionCapacity = 'Crítico';
    institutionalReadiness = 'O cenário projeta uma expansão incompatível com a fundação institucional vigente. Execução altamente comprometida.';
  }

  // Narrative Generation
  const narrative = `O cenário analisado projeta uma Pressão de Governança (GPI) de ${gpi.toFixed(1)}/100 devido ao crescimento e Capex estimados. Com um EFOS Score basal de ${input.efosScore.toFixed(1)}/100, o Índice de Execução Institucional (IEI) resultante é de ${iei.toFixed(1)}/100, classificando a capacidade de execução como ${executionCapacity} (Risco ${riskLevel}). ${institutionalReadiness} Recomenda-se ${riskLevel === 'Baixo' || riskLevel === 'Moderado' ? 'prosseguir com o plano de ação mantendo a cadência de auditorias contínuas' : 'fortalecer os mecanismos de governança e execução antes da implementação integral do cenário'}.`;

  return {
    governancePressureIndex: gpi,
    institutionalExecutionIndex: iei,
    riskLevel,
    executionCapacity,
    institutionalReadiness,
    narrative
  };
}
