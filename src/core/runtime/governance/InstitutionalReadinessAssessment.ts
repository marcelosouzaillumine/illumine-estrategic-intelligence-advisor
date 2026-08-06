export interface InstitutionalReadinessAssessmentInput {
  efosScore: number;
  ieiScore: number;
  governancePressureIndex: number;
  enterpriseValueDelta: number;
  projectedOperationalComplexity: number;
}

export interface InstitutionalReadinessAssessmentOutput {
  readinessGap: number; // IRG 0-100
  readinessLevel: string;
  roadmapHorizon: string;
  governancePriority: string;
  narrative: string;
}

export function calculateInstitutionalReadiness(input: InstitutionalReadinessAssessmentInput): InstitutionalReadinessAssessmentOutput {
  // Institutional Readiness Gap (IRG)
  // Base gap is 100 - IEI
  let baseGap = 100 - input.ieiScore;

  // Pressure intensifier: if GPI is high, gap widens
  let pressureModifier = (input.governancePressureIndex / 100) * 20; // up to +20 points
  
  // Complexity intensifier
  let complexityModifier = (input.projectedOperationalComplexity / 100) * 10; // up to +10 points

  let irg = baseGap + pressureModifier + complexityModifier;
  
  if (irg > 100) irg = 100;
  if (irg < 0) irg = 0;

  // Ensure determinism: if iei is 100 and no pressure, irg could be very low
  // If efosScore is low, gap should at least reflect EFOS gap
  const efosGap = 100 - input.efosScore;
  if (irg < efosGap * 0.5) {
    irg = efosGap * 0.5;
  }

  let readinessLevel = '';
  let roadmapHorizon = '';
  let governancePriority = '';

  if (irg <= 20) {
    readinessLevel = 'Pronto';
    roadmapHorizon = 'ciclo imediato focado em Otimização';
    governancePriority = 'Manutenção e Monitoramento Contínuo';
  } else if (irg <= 40) {
    readinessLevel = 'Pequenos Ajustes';
    roadmapHorizon = 'Curto/médio ciclo (3-6 meses)';
    governancePriority = 'Formalização de Processos Chave e Comitês Menores';
  } else if (irg <= 60) {
    readinessLevel = 'Transformação Necessária';
    roadmapHorizon = 'médio ciclo (6-12 meses)';
    governancePriority = 'Estruturação da Governança Executiva e Gestão de Riscos';
  } else if (irg <= 80) {
    readinessLevel = 'Reestruturação Relevante';
    roadmapHorizon = 'longo horizonte (12-18 meses)';
    governancePriority = 'Fundação de Governança Fiduciária (Conselhos e Auditoria)';
  } else {
    readinessLevel = 'Alto Risco Institucional';
    roadmapHorizon = 'Plurianual (18-24 meses)';
    governancePriority = 'Reconstrução Completa da Capacidade Organizacional';
  }

  const narrative = `O contexto avaliado possui potencial de geração de R$ ${(input.enterpriseValueDelta / 1000000).toFixed(1)} milhões em valor econômico adicional. Entretanto, o Institutional Execution Index (IEI) indica capacidade de execução de ${input.ieiScore.toFixed(0)}/100, e o Institutional Readiness Gap (IRG) atinge ${irg.toFixed(0)}/100, apontando uma situação de ${readinessLevel}. As recomendações prioritárias concentram-se em ${governancePriority.toLowerCase()} antes da execução integral da estratégia, com horizonte principal de ${roadmapHorizon}.`;

  return {
    readinessGap: irg,
    readinessLevel,
    roadmapHorizon,
    governancePriority,
    narrative
  };
}
