export interface CashFlowInput {
  currentCashBalance: number;
  monthlyCashBurnRate: number; // Consumo real de caixa mensal (positivo = queima)
  operatingCashFlow: number; // Geração de caixa pela operação (positivo = entra)
  debtAmortization: number; // Saídas para dívida
  fundingInflows: number; // Entradas de empréstimos novos
  partnerCapitalInjections: number; // Aportes de sócios
  receivablesAging: number; // Dias de recebimento médio
  overdueReceivables: number; // Volume de recebíveis vencidos
  shortTermObligations: number; // Obrigações de curto prazo (contas a pagar, etc)
  recurringFixedCashOutflows: number; // Saídas fixas (opex)
  seasonalityContext: boolean;
  businessModelContext: string;
}

export interface CashFlowSignal {
  classification: string;
  confidence: 'Alta' | 'Média' | 'Baixa';
  causalFlags: string[];
  advisoryNotes: string[];
  blockedFalsePositives: string[];
}

export interface CashFlowIntelligenceReport {
  cashQuality: CashFlowSignal;
  runway: CashFlowSignal;
  financialDependency: CashFlowSignal;
  treasuryPressure: CashFlowSignal;
  riskPropagationSignals: string[];
}

export function analyzeCashFlowIntelligence(input: CashFlowInput): CashFlowIntelligenceReport {
  
  const riskSignals: string[] = [];
  
  // 1. Dependência Financeira
  const totalArtificialFunding = input.fundingInflows + input.partnerCapitalInjections;
  const isArtificial = totalArtificialFunding > 0 && input.operatingCashFlow <= 0;
  
  let dependencyClassification = 'baixa';
  let dependencyFlags: string[] = [];
  
  if (totalArtificialFunding > input.currentCashBalance && totalArtificialFunding > 0) {
    dependencyClassification = 'crítica';
    dependencyFlags.push('dependência de dívida', 'dependência de capitalização', 'funding artificial');
    riskSignals.push('Inviabilidade Sem Capital Externo');
  } else if (input.debtAmortization > input.operatingCashFlow && input.operatingCashFlow > 0) {
    dependencyClassification = 'elevada';
    dependencyFlags.push('dependência de dívida');
  } else if (totalArtificialFunding > 0) {
    dependencyClassification = 'moderada';
  }
  
  const financialDependency: CashFlowSignal = {
    classification: dependencyClassification,
    confidence: 'Alta',
    causalFlags: dependencyFlags,
    advisoryNotes: dependencyClassification === 'crítica' 
      ? ['A operação não se sustenta. O caixa atual é ilusório e proveniente inteiramente de funding externo.'] 
      : [],
    blockedFalsePositives: ['Independência Financeira']
  };

  // 2. Runway Financeiro
  // Cálculo de meses de sobrevida
  // Se monthlyCashBurnRate > 0, runway = currentCashBalance / monthlyCashBurnRate.
  // Se for 0 ou negativo, significa que a empresa não está queimando caixa, logo runway tende a infinito (ou saudável).
  const monthsOfRunway = input.monthlyCashBurnRate > 0 ? (input.currentCashBalance / input.monthlyCashBurnRate) : 999;
  
  let runwayClassification = 'RUNWAY_SAUDAVEL';
  let runwayFlags: string[] = [];
  let runwayAdvisory = ['Autonomia financeira confirmada. Caixa suporta as operações sem sobressaltos.'];
  
  if (monthsOfRunway < 3) {
    runwayClassification = 'RUNWAY_CRITICO';
    runwayFlags.push('runway insuficiente', 'risco de ruptura');
    runwayAdvisory = ['Sobrevivência financeira em risco iminente. Preservação imediata de caixa é obrigatória.'];
    riskSignals.push('Risco Iminente de Ruptura de Liquidez');
  } else if (monthsOfRunway < 6) {
    runwayClassification = 'RUNWAY_LIMITADO';
    runwayFlags.push('runway insuficiente');
    runwayAdvisory = ['Runway de curto prazo exige controle rígido e eventual captação preventiva.'];
  }

  const runway: CashFlowSignal = {
    classification: runwayClassification,
    confidence: 'Alta',
    causalFlags: runwayFlags,
    advisoryNotes: runwayAdvisory,
    blockedFalsePositives: ['Caixa Forte (Saldo Bruto)', 'Sustentabilidade Garantida']
  };

  // 3. Pressão de Tesouraria
  const pressureRatio = input.shortTermObligations > 0 ? (input.currentCashBalance / input.shortTermObligations) : 999;
  const overduePressure = input.overdueReceivables > (input.currentCashBalance * 0.5);
  
  let pressureClassification = 'baixa';
  let pressureFlags: string[] = [];
  
  if (pressureRatio < 0.5 && overduePressure) {
    pressureClassification = 'severa';
    pressureFlags.push('pressão por recebíveis vencidos', 'risco de ruptura');
  } else if (pressureRatio < 0.8 || overduePressure) {
    pressureClassification = 'elevada';
    if (overduePressure) pressureFlags.push('pressão por recebíveis vencidos');
  } else if (pressureRatio < 1.2) {
    pressureClassification = 'sensível';
  }
  
  if (input.seasonalityContext && pressureClassification !== 'baixa') {
    pressureFlags.push('sazonalidade recorrente');
    // Moderamos a pressão
    if (pressureClassification === 'severa') pressureClassification = 'elevada';
    else if (pressureClassification === 'elevada') pressureClassification = 'sensível';
  }

  const treasuryPressure: CashFlowSignal = {
    classification: pressureClassification,
    confidence: 'Alta',
    causalFlags: pressureFlags,
    advisoryNotes: [],
    blockedFalsePositives: ['Ausência de Tensão', 'Colapso Estrutural sem Persistência']
  };

  // 4. Qualidade do Caixa
  let cashQualityClass = 'CAIXA_OPERACIONAL_SAUDAVEL';
  let cashFlags: string[] = [];
  let cashAdvisory: string[] = [];
  let blockedFP: string[] = [];
  
  const isGrowingWithoutCash = input.operatingCashFlow < 0 && input.monthlyCashBurnRate > 0 && input.recurringFixedCashOutflows > 0;
  
  const isHospital = input.businessModelContext === 'hospital' || input.businessModelContext === 'saude';
  const isHospitalPressure = isHospital && input.receivablesAging > 90;

  if (dependencyClassification === 'crítica') {
    cashQualityClass = 'CAIXA_ARTIFICIAL';
    cashFlags.push('funding artificial');
    cashAdvisory.push('O saldo atual do banco é integralmente composto por rolagem ou capitalização. O negócio não se paga.');
    blockedFP.push('Saúde Automática pelo Saldo Bancário');
  } else if (runwayClassification === 'RUNWAY_CRITICO' && pressureClassification === 'severa') {
    cashQualityClass = 'CAIXA_FRAGIL';
    cashFlags.push('drenagem operacional');
    cashAdvisory.push('Tesouraria altamente asfixiada por consumo operacional e obrigações de curto prazo.');
    blockedFP.push('Equilíbrio Dinâmico');
  } else if (isHospitalPressure) {
    cashQualityClass = 'CAIXA_FRAGIL';
    cashFlags.push('drenagem operacional');
    cashAdvisory.push('Pressão de caixa severa decorrente do descasamento crônico de recebíveis.');
    blockedFP.push('Saúde Automática pelo Saldo Bancário');
  } else if (isGrowingWithoutCash) {
    cashQualityClass = 'CAIXA_DESTRUTIVO';
    cashFlags.push('crescimento consumindo caixa', 'drenagem operacional');
    cashAdvisory.push('Crescimento acelerado ou ineficiência estrutural está destruindo agressivamente a liquidez.');
    blockedFP.push('Expansão Saudável');
  } else if (input.operatingCashFlow > 0 && input.currentCashBalance > input.shortTermObligations) {
    cashQualityClass = 'CAIXA_OPERACIONAL_SAUDAVEL';
    cashFlags.push('geração de caixa genuína');
    cashAdvisory.push('Estrutura financeira resiliente, com caixa primariamente derivado da operação e suportando obrigações.');
  } else {
    cashQualityClass = 'CAIXA_FRAGIL';
    cashFlags.push('drenagem operacional');
  }

  const cashQuality: CashFlowSignal = {
    classification: cashQualityClass,
    confidence: 'Alta',
    causalFlags: cashFlags,
    advisoryNotes: cashAdvisory,
    blockedFalsePositives: blockedFP
  };

  return {
    cashQuality,
    runway,
    financialDependency,
    treasuryPressure,
    riskPropagationSignals: riskSignals
  };
}
