import { MasterCausalOutput } from './master-causal-engine';
import { OperationalIntelligenceReport } from './operational-intelligence-engine';
import { CashFlowIntelligenceReport } from './cash-flow-intelligence-engine';

export interface ExecutiveAction {
  acao: string;
  impacto: 'Alto' | 'Médio' | 'Baixo';
  velocidade: 'Imediata' | 'Curto Prazo' | 'Médio Prazo' | 'Longo Prazo';
  complexidade: 'Alta' | 'Média' | 'Baixa';
  prioridade: 'Imediata' | 'Alta' | 'Moderada' | 'Estratégica';
}

export interface ExecutiveAdvisoryReport {
  executiveSummary: string;
  institutionalDiagnosis: string;
  dominantRisks: string[];
  strategicPriorities: string[];
  actionMatrix: ExecutiveAction[];
  confidenceLevel: 'Alta' | 'Média' | 'Baixa';
  narrativeModeration: string[];
  blockedFalsePositives: string[];
  recommendedBoardDecision: string;
  
  sourceSignals: string[];
  causalConflicts: string[];
  propagationSignals: string[];
  executivePosture: string;
}

export interface AdvisoryInput {
  causal: MasterCausalOutput;
  operational: OperationalIntelligenceReport;
  cashFlow: CashFlowIntelligenceReport;
}

export function generateExecutiveAdvisory(input: AdvisoryInput): ExecutiveAdvisoryReport {
  
  const { causal, operational, cashFlow } = input;
  
  let executiveSummary = '';
  let institutionalDiagnosis = '';
  let dominantRisks: string[] = [];
  let strategicPriorities: string[] = [];
  let actionMatrix: ExecutiveAction[] = [];
  let confidenceLevel: 'Alta' | 'Média' | 'Baixa' = 'Alta';
  let narrativeModeration: string[] = [];
  let blockedFalsePositives: string[] = [];
  let recommendedBoardDecision = '';
  
  let sourceSignals: string[] = [];
  let causalConflicts: string[] = [];
  let propagationSignals: string[] = [];
  let executivePosture = '';

  // Extract signals
  const isRunwayCritico = cashFlow.runway.classification === 'RUNWAY_CRITICO';
  const isEbitdaSaudavel = operational.ebitdaQuality.classification === 'EBITDA_SAUDAVEL';
  const isCrescimentoDestrutivo = cashFlow.cashQuality.classification === 'CAIXA_DESTRUTIVO' || operational.ebitdaQuality.classification === 'EBITDA_DESTRUTIVO';
  const isFundingArtificial = cashFlow.financialDependency.classification === 'crítica' && cashFlow.cashQuality.classification === 'CAIXA_ARTIFICIAL';
  const isCorrosao = causal.scenarios.some(s => s.id === 'CORROSAO_PATRIMONIAL');
  const hasCriticalBp = causal.scenarios.some(s => s.severity === 'Crítica');
  const isBpSaudavel = !hasCriticalBp && !isCorrosao;
  
  // Rule 1: EBITDA saudável + Runway crítico
  if (isEbitdaSaudavel && isRunwayCritico) {
    narrativeModeration.push('Moderado: EBITDA Saudável não anula Risco de Ruptura.');
    blockedFalsePositives.push('Falso Positivo de Sucesso Operacional (Runway Oculto)');
    executiveSummary = 'A operação gera resultados contábeis, mas a empresa enfrenta risco iminente de ruptura de caixa.';
    institutionalDiagnosis = 'Descasamento severo entre a DRE e o Fluxo de Caixa. O resultado não está se convertendo em sobrevivência líquida.';
    strategicPriorities.push('Preservação imediata de caixa', 'Alongamento de passivos de curtíssimo prazo');
    dominantRisks.push('Ruptura Iminente de Liquidez');
    recommendedBoardDecision = 'Aprovar medidas emergenciais de preservação de tesouraria e focar na conversão de caixa antes de qualquer outro objetivo.';
    executivePosture = 'Conservadora com Foco em Tesouraria';
    actionMatrix.push({ acao: 'Comitê de Crise de Tesouraria', impacto: 'Alto', velocidade: 'Imediata', complexidade: 'Média', prioridade: 'Imediata' });
  }
  
  // Rule 2: Crescimento de receita + consumo destrutivo
  else if (isCrescimentoDestrutivo) {
    narrativeModeration.push('Bloqueado: Expansão Destrutiva não deve ser incentivada.');
    blockedFalsePositives.push('Falso Positivo de Crescimento Saudável');
    executiveSummary = 'O modelo de crescimento atual está destruindo agressivamente a liquidez institucional da empresa.';
    institutionalDiagnosis = 'Expansão desalinhada com a capacidade de funding da tesouraria. Cada real faturado a mais corrói o runway estrutural.';
    strategicPriorities.push('Revisão do modelo de expansão', 'Estabilização do consumo de giro');
    dominantRisks.push('Crescimento Consumindo Caixa');
    recommendedBoardDecision = 'Interromper ou desacelerar o vetor de crescimento até que a eficiência de capital seja reestabelecida.';
    executivePosture = 'Restritiva';
    actionMatrix.push({ acao: 'Congelamento de CAPEX de Expansão', impacto: 'Alto', velocidade: 'Imediata', complexidade: 'Baixa', prioridade: 'Imediata' });
  }
  
  // Rule 3: Caixa elevado + funding artificial
  else if (isFundingArtificial) {
    narrativeModeration.push('Moderado: Saldo Bancário é mantido artificialmente.');
    blockedFalsePositives.push('Falso Positivo de Caixa Elevado/Liquidez Saudável');
    executiveSummary = 'A liquidez atual da empresa é puramente baseada em endividamento e capitalização, mascarando o déficit da operação.';
    institutionalDiagnosis = 'Dependência crítica de funding externo. A operação em si não se sustenta e exige rodadas sucessivas ou dívidas para não parar.';
    strategicPriorities.push('Corte de queima operacional', 'Melhoria na margem bruta orgânica');
    dominantRisks.push('Funding Artificial', 'Inviabilidade Sem Capital Externo');
    recommendedBoardDecision = 'Aprovar reestruturação operacional profunda para buscar o breakeven antes do fim do funding atual.';
    executivePosture = 'Defensiva e Reestruturante';
    actionMatrix.push({ acao: 'Plano de Desalavancagem Operacional', impacto: 'Alto', velocidade: 'Curto Prazo', complexidade: 'Alta', prioridade: 'Alta' });
  }
  
  // Rule 4: PL positivo + corrosão patrimonial
  else if (isCorrosao) {
    narrativeModeration.push('Moderado: Patrimônio ainda positivo, mas em trajetória de erosão fatal.');
    blockedFalsePositives.push('Falso Positivo de Estabilidade Patrimonial (PL Positivo)');
    executiveSummary = 'A base patrimonial está sendo corroída por sucessivos déficits operacionais, ameaçando a viabilidade de longo prazo.';
    institutionalDiagnosis = 'Destruição de valor ao acionista em curso. A estrutura de capital está se deteriorando rapidamente.';
    strategicPriorities.push('Estancamento do prejuízo contínuo', 'Blindagem patrimonial');
    dominantRisks.push('Corrosão Patrimonial Acelerada');
    recommendedBoardDecision = 'Mudança imediata no modelo de negócios para reverter a queima de patrimônio estrutural.';
    executivePosture = 'Vigilante e Corretiva';
    actionMatrix.push({ acao: 'Revisão de Modelo de Negócios / Pricing', impacto: 'Alto', velocidade: 'Longo Prazo', complexidade: 'Alta', prioridade: 'Alta' });
  }
  
  // Rule 5: BP Saudável + DRE Saudável + Runway Confortável
  else if (isBpSaudavel && isEbitdaSaudavel && cashFlow.runway.classification === 'RUNWAY_SAUDAVEL') {
    narrativeModeration.push('Verificado: Alinhamento institucional perfeito. Otimismo seguro.');
    executiveSummary = 'As três engrenagens de inteligência estão em harmonia. A operação é rentável, converte caixa e o balanço é robusto.';
    institutionalDiagnosis = 'Posicionamento financeiro exemplar. A empresa possui resiliência alta para chocar mercados e executar expansão de longo prazo.';
    strategicPriorities.push('Expansão de Market Share', 'Otimização de Retorno do Capital Empregado (ROCE)');
    dominantRisks.push('Risco mínimo. Apenas oscilações macroeconômicas normais.');
    recommendedBoardDecision = 'Aprovar liberação de capital para expansão disciplinada e investimentos em crescimento com caixa livre orgânico.';
    executivePosture = 'Expansiva e Estratégica';
    actionMatrix.push({ acao: 'Plano de Expansão Acelerada', impacto: 'Médio', velocidade: 'Médio Prazo', complexidade: 'Média', prioridade: 'Estratégica' });
  } 
  
  // Default (Mixed signals)
  else {
    narrativeModeration.push('Contexto Misto. Moderação executiva aplicada na síntese.');
    executiveSummary = 'A empresa apresenta uma dinâmica financeira de transição, com sinais positivos em algumas vertentes e alertas operacionais em outras.';
    institutionalDiagnosis = 'Balanço e operação requerem ajustes para buscar uma harmonia institucional plena e destravar crescimento seguro.';
    strategicPriorities.push('Equilíbrio entre Operação e Capital de Giro');
    dominantRisks.push(...causal.scenarios.map(s => s.name));
    recommendedBoardDecision = 'Manter monitoramento de perto. Focar em melhorias de eficiência sem assumir riscos de endividamento.';
    executivePosture = 'Equilibrada';
    actionMatrix.push({ acao: 'Auditoria de Gargalos Operacionais', impacto: 'Médio', velocidade: 'Curto Prazo', complexidade: 'Média', prioridade: 'Moderada' });
  }

  // Populate generic propagation signals
  sourceSignals.push(...causal.scenarios.map(s => s.id));
  sourceSignals.push(operational.ebitdaQuality.classification);
  sourceSignals.push(cashFlow.runway.classification);
  
  if (isEbitdaSaudavel && isRunwayCritico) {
    causalConflicts.push('EBITDA x RUNWAY');
  }
  if (cashFlow.financialDependency.classification === 'crítica' && isBpSaudavel) {
    causalConflicts.push('BP x DEPENDÊNCIA CAIXA');
  }

  return {
    executiveSummary,
    institutionalDiagnosis,
    dominantRisks,
    strategicPriorities,
    actionMatrix,
    confidenceLevel,
    narrativeModeration,
    blockedFalsePositives,
    recommendedBoardDecision,
    sourceSignals,
    causalConflicts,
    propagationSignals,
    executivePosture
  };
}
