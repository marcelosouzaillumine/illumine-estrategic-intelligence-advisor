import { CashFlowInput, CashFlowIntelligenceReport, analyzeCashFlowIntelligence } from './cash-flow-intelligence-engine';
import { OperationalInput, OperationalIntelligenceReport, analyzeOperationalIntelligence } from './operational-intelligence-engine';
import { MasterCausalOutput, evaluateMasterCausality } from './master-causal-engine';
import { ExecutiveAdvisoryReport, generateExecutiveAdvisory } from './executive-advisory-engine';
import { BPSummary } from './bpEngine';

/**
 * @deprecated MOTOR LEGADO (FASE 1/2) - SERÁ REMOVIDO APÓS 0 IMPORTS ATIVOS.
 * POR FAVOR, USE O NOVO MOTOR: `src/capabilities/runtime/scenario-intelligence/`
 */

// --- INTERFACES ---

export interface ScenarioParameters {
  revenueMultiplier?: number; // ex: 1.2 for +20%
  cogsMultiplier?: number; // ex: 1.1 for +10%
  opexMultiplier?: number; // ex: 1.3 for +30%
  headcountAddition?: number; // fixed cost addition
  debtInjection?: number; // funding injection (debt)
  capitalInjection?: number; // funding injection (equity)
  capexInvestment?: number; // cash outflow
  receivablesDaysExtension?: number; // ex: +30 days
  payablesDaysExtension?: number; // ex: +15 days
}

export interface SimulationBaseData {
  operational: OperationalInput;
  cashFlow: CashFlowInput;
  bpSummary: BPSummary;
  metrics: any; // FinancialMetrics
  identity: any; // BusinessIdentity
  historyLength: number;
}

export interface SimulationInput {
  baseData: SimulationBaseData;
  parameters: ScenarioParameters;
}

export interface ProjectedData {
  projectedOperational: OperationalInput;
  projectedCashFlow: CashFlowInput;
  projectedBpSummary: BPSummary;
  projectedMetrics: any;
}

export interface SimulationOutput {
  scenarioName: string;
  projectedData: ProjectedData;
  projectedRunwayMonths: number;
  causalOutput: MasterCausalOutput;
  operationalOutput: OperationalIntelligenceReport;
  cashFlowOutput: CashFlowIntelligenceReport;
  advisory: ExecutiveAdvisoryReport;
}

// --- ENGINE LOGIC ---

/**
 * Aplica os parâmetros de simulação na base de dados para gerar uma projeção financeira bruta.
 */
function applyScenarioModifiers(input: SimulationInput): ProjectedData {
  const { baseData, parameters } = input;
  const p = parameters;
  
  // Clone base data to avoid mutating original state
  const projOp: OperationalInput = { ...baseData.operational };
  const projCF: CashFlowInput = { ...baseData.cashFlow };
  const projBP: BPSummary = JSON.parse(JSON.stringify(baseData.bpSummary));
  const projMetrics = { ...baseData.metrics };

  // 1. Receita e Custos Operacionais
  if (p.revenueMultiplier !== undefined) {
    projOp.receitaLiquida *= p.revenueMultiplier;
    projOp.crescimentoReceita = (p.revenueMultiplier - 1) * 100;
    projMetrics.receitaMedia *= p.revenueMultiplier; // simplificação
  }
  if (p.cogsMultiplier !== undefined) {
    projOp.custosVariaveis *= p.cogsMultiplier;
  }
  if (p.opexMultiplier !== undefined) {
    projOp.despesasOperacionais *= p.opexMultiplier;
    projOp.custosFixos *= p.opexMultiplier;
    projCF.recurringFixedCashOutflows *= p.opexMultiplier;
  }
  if (p.headcountAddition !== undefined) {
    projOp.custosFixos += p.headcountAddition;
    projOp.despesasOperacionais += p.headcountAddition;
    projCF.recurringFixedCashOutflows += p.headcountAddition;
  }

  // Recalcular EBITDA projetado
  projOp.ebitda = projOp.receitaLiquida - projOp.custosVariaveis - projOp.custosFixos - projOp.despesasOperacionais;
  projMetrics.ebitda = projOp.ebitda;
  
  // Aproximação: Variação no EBITDA reflete no Operating Cash Flow diretamente, mitigado por NCG
  const ebitdaDelta = projOp.ebitda - baseData.operational.ebitda;
  projCF.operatingCashFlow += ebitdaDelta;

  // 2. Capital Structure & Funding
  if (p.debtInjection !== undefined) {
    projCF.fundingInflows += p.debtInjection;
    projCF.currentCashBalance += p.debtInjection;
    projBP.passivoCirculante += p.debtInjection; // Simplificando como CP para gerar pressão
  }
  if (p.capitalInjection !== undefined) {
    projCF.partnerCapitalInjections += p.capitalInjection;
    projCF.currentCashBalance += p.capitalInjection;
    projBP.patrimonioLiquido += p.capitalInjection;
  }
  if (p.capexInvestment !== undefined) {
    projCF.currentCashBalance -= p.capexInvestment;
    // Opex/CAPEX burn (impacta saldo mas não burn rate mensal regular)
  }

  // 3. Treasury Stress (Recebíveis / Fornecedores)
  if (p.receivablesDaysExtension !== undefined) {
    projOp.diasRecebimento += p.receivablesDaysExtension;
    projCF.receivablesAging += p.receivablesDaysExtension;
    // Atraso de recebíveis corrói caixa momentâneo
    const impactCash = (projOp.receitaLiquida / 30) * p.receivablesDaysExtension;
    projCF.currentCashBalance -= impactCash;
    projCF.overdueReceivables += impactCash;
  }
  if (p.payablesDaysExtension !== undefined) {
    // Alivia caixa curto prazo
    const impactCash = ((projOp.custosVariaveis + projOp.despesasOperacionais) / 30) * p.payablesDaysExtension;
    projCF.currentCashBalance += impactCash;
    projCF.shortTermObligations += impactCash;
  }

  // Atualizar Burn Rate (Burn rate é derivado dos fluxos de saída recorrentes)
  // Simplificação: Burn = Recurring Outflows + Debt Amortization - Operating Inflows (se Op Inflow < Outflow)
  // Caso a empresa queime caixa (OpFlow < Outflows fixos)
  const monthlyOutflows = projCF.recurringFixedCashOutflows + projCF.debtAmortization;
  const netBurn = monthlyOutflows - (projCF.operatingCashFlow > 0 ? projCF.operatingCashFlow : 0);
  projCF.monthlyCashBurnRate = netBurn > 0 ? netBurn : 0;

  return {
    projectedOperational: projOp,
    projectedCashFlow: projCF,
    projectedBpSummary: projBP,
    projectedMetrics: projMetrics
  };
}

/**
 * Linearização do Runway Projetado.
 * Isolado para permitir substituição por curvas não lineares (Monte Carlo, decaimento sazonal, etc).
 */
export function calculateProjectedRunway(cashFlow: CashFlowInput): number {
  if (cashFlow.currentCashBalance <= 0) return 0;
  if (cashFlow.monthlyCashBurnRate <= 0) return 999; // Runway infinito (gerador de caixa limpo)
  return cashFlow.currentCashBalance / cashFlow.monthlyCashBurnRate;
}

/**
 * Propagação Causal Obrigatória: Executa a malha institucional sobre os dados projetados.
 */
export function propagateScenarioCausality(projData: ProjectedData): { causal: MasterCausalOutput, op: OperationalIntelligenceReport, cf: CashFlowIntelligenceReport } {
  const op = analyzeOperationalIntelligence(projData.projectedOperational);
  const cf = analyzeCashFlowIntelligence(projData.projectedCashFlow);
  
  // Mock historical series as we are projecting a single future state.
  const causal = evaluateMasterCausality(
    projData.projectedBpSummary,
    projData.projectedMetrics,
    { modeloDeNegocio: projData.projectedOperational.segmentoEmpresarial } as any, // Mock identity
    1, // history length
    0, // prev pl
    [] // temporal
  );

  return { causal, op, cf };
}

/**
 * Gera o Advisory Executivo Preditivo baseado nos resultados da causalidade propagada.
 */
export function generateProjectedExecutiveAdvisory(projData: ProjectedData): ExecutiveAdvisoryReport {
  const propagated = propagateScenarioCausality(projData);
  const advisory = generateExecutiveAdvisory({
    causal: propagated.causal,
    operational: propagated.op,
    cashFlow: propagated.cf
  });
  return advisory;
}

// --- PUBLIC SIMULATION FUNCTIONS ---

function runSimulation(scenarioName: string, input: SimulationInput): SimulationOutput {
  const projectedData = applyScenarioModifiers(input);
  const runway = calculateProjectedRunway(projectedData.projectedCashFlow);
  const propagated = propagateScenarioCausality(projectedData);
  const advisory = generateExecutiveAdvisory({
    causal: propagated.causal,
    operational: propagated.op,
    cashFlow: propagated.cf
  });

  return {
    scenarioName,
    projectedData,
    projectedRunwayMonths: runway,
    causalOutput: propagated.causal,
    operationalOutput: propagated.op,
    cashFlowOutput: propagated.cf,
    advisory
  };
}

export function simulateGrowthScenario(input: SimulationInput): SimulationOutput {
  return runSimulation('GROWTH SIMULATION', input);
}

export function simulateStressScenario(input: SimulationInput): SimulationOutput {
  return runSimulation('STRESS SIMULATION', input);
}

export function simulateTreasuryScenario(input: SimulationInput): SimulationOutput {
  return runSimulation('TREASURY SIMULATION', input);
}

export function simulateCapitalStructureScenario(input: SimulationInput): SimulationOutput {
  return runSimulation('CAPITAL STRUCTURE SIMULATION', input);
}

export function simulateOperationalScenario(input: SimulationInput): SimulationOutput {
  return runSimulation('OPERATIONAL SIMULATION', input);
}

export function simulateInvestmentScenario(input: SimulationInput): SimulationOutput {
  return runSimulation('INVESTMENT SIMULATION', input);
}
