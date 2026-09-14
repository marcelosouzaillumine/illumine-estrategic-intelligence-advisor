import { EngineDefinition, InstitutionalContext, EngineExecutionResult, InferenceBlock, CausalityChain, AdvisoryNarrative } from '../../../../runtime/types';

export interface DecisionRecommendation {
  id: string;
  label: string;
  classification: 'PRESERVE' | 'OPTIMIZE' | 'RESTRUCTURE' | 'STABILIZE' | 'TRANSFORM';
  urgency: number;
  impact: number;
  survivability: number;
  riskReduction: number;
  feasibility: number;
  dependencyReadiness: number;
  dpi: number;
  benefits: string;
  risks: string;
  opportunityCost: string;
  dependencies: string;
  executionComplexity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  formula: string;
  originatingMetrics: string[];
  contributingEngines: string[];
  rationale: string;
  lineageHash: string;
  directEffect: string;
  indirectEffect: string;
  systemicEffect: string;
}

export interface FutureIntegrations {
  simulateCapitalAllocation: (allocationProfile: any) => any;
  simulateFundingStrategy: (strategyProfile: any) => any;
  integrateDigitalTwin: (twinData: any) => any;
  runWarGameScenario: (wargameParams: any) => any;
}

export const SovereignDecisionAdapter: EngineDefinition & FutureIntegrations = {
  name: 'SovereignDecisionEngine',
  priority: 80, // Downstream of CreditCommitteeSimulatorEngine (70)
  dependencies: [
    'LegacyFinancialAdapter',
    'LegacyDREAdapter',
    'LegacyDFCAdapter',
    'EconomicNormalizationAdapter',
    'StressTestAdapter',
    'ExecutiveDecisionEngine',
    'InstitutionalMemoryEngine',
    'BoardRiskMatrixAdapter',
    'CreditCommitteeSimulatorEngine'
  ],
  requiredData: ['historicalCyclesCount'],
  inferenceScope: 'sovereign_decision',
  minimumEvidenceLevel: 'EVIDENCE_BASED',

  // Future integration stubs
  simulateCapitalAllocation(allocationProfile: any) {
    return { success: true, simulatedAllocation: allocationProfile, status: 'READY_FOR_INTEGRATION' };
  },
  simulateFundingStrategy(strategyProfile: any) {
    return { success: true, simulatedFunding: strategyProfile, status: 'READY_FOR_INTEGRATION' };
  },
  integrateDigitalTwin(twinData: any) {
    return { success: true, status: 'READY_FOR_INTEGRATION', twinHash: 'twin-stub-100234' };
  },
  runWarGameScenario(wargameParams: any) {
    return { success: true, scenarioRan: wargameParams, status: 'READY_FOR_INTEGRATION' };
  },

  execute: async (context: InstitutionalContext): Promise<EngineExecutionResult> => {
    try {
      const historicalCyclesCount = context.input.historicalCyclesCount ?? 1;
      const isEarlyStage = historicalCyclesCount < 3;

      // Downstream inferences
      const dfcInference = context.inferences['LegacyDFCAdapter'];
      const financialInference = context.inferences['LegacyFinancialAdapter'];
      const dreInference = context.inferences['LegacyDREAdapter'];
      const eneInference = context.inferences['EconomicNormalizationAdapter'];
      const imeInference = context.inferences['InstitutionalMemoryEngine'];
      const brmInference = context.inferences['BoardRiskMatrixAdapter'];
      const ccsInference = context.inferences['CreditCommitteeSimulatorEngine'];

      // Extract raw metrics from adapters
      const bpSummary = financialInference?.metrics?.bpSummary || {};
      const dreMetrics = dreInference?.metrics || {};
      const dfcMetrics = dfcInference?.metrics || {};
      const fiduciaryMetrics = dfcMetrics.fiduciary || {};
      const eneMetrics = eneInference?.metrics || {};
      const imeMetrics = imeInference?.metrics || {};
      const brmMetrics = brmInference?.metrics || {};
      const ccsMetrics = ccsInference?.metrics || {};

      const cqs = fiduciaryMetrics.cashQuality?.score ?? 70;
      const eqs = fiduciaryMetrics.earningsQuality?.score ?? 70;
      const ensScore = eneMetrics.ensScore ?? eneInference?.score ?? 70;
      const brmScore = brmMetrics.boardRiskScore ?? brmInference?.score ?? 70;
      const imsScore = imeMetrics.imsScore ?? imeInference?.score ?? 70;
      const ccsScore = ccsMetrics.ccsScore ?? ccsInference?.score ?? 70;

      const runway = fiduciaryMetrics.runway ?? 12;
      const ebitda = dreMetrics.ebitda ?? 0;
      const fco = dfcMetrics.fco ?? 0;
      const fcoOperacionalReal = fiduciaryMetrics.fcoOperacionalReal ?? fco;
      const shortTermDebt = bpSummary.shortTermDebt ?? 0;
      const intensidadePartesRelacionadas = fiduciaryMetrics.intensidadePartesRelacionadas ?? 0;
      const advisoryScore = imeMetrics.domains?.advisory?.score ?? imeMetrics.advisoryScore ?? 70;
      const governanceMaturity = imeMetrics.domains?.governance?.score ?? 70;
      const operationalStability = eneMetrics.stability?.score ?? 70;
      const executionHistory = imeMetrics.domains?.strategic?.score ?? 70;

      // Check if covenant is breached
      const covenantThresholds = ccsMetrics.covenantThresholds || { maxNetDebtEbitda: 3.5, minDscr: 1.2 };
      const baseScenario = ccsMetrics.stressScenarios?.find((s: any) => s.name === 'Base Institutional Scenario') || {};
      const baseBreaches = baseScenario.breaches || [];
      const hasCriticalCovenantBreach = baseBreaches.length > 0;

      // ── 1. EXECUTION CAPACITY ENGINE (ECE) ──
      const executionCapacity = Math.round(
        (governanceMaturity * 0.3) +
        (advisoryScore * 0.3) +
        (operationalStability * 0.2) +
        (executionHistory * 0.2)
      );

      // ── 2. DOMAIN-LEVEL URGENCY & SOVEREIGN DECISION SCORE (SDS) ──
      const treasuryUrgency = Math.round(100 - (0.3 * cqs + 0.4 * Math.min(100, runway * 8.3) + 0.3 * ccsScore));
      const capitalStructureUrgency = Math.round(100 - (0.4 * ensScore + 0.3 * ccsScore + 0.3 * brmScore));
      const growthUrgency = Math.round(100 - (0.3 * imsScore + 0.3 * ccsScore + 0.2 * ensScore + 0.2 * eqs));
      const profitabilityUrgency = Math.round(100 - (0.4 * eqs + 0.4 * ensScore + 0.2 * brmScore));
      const governanceUrgency = Math.round(100 - (0.5 * imsScore + 0.5 * brmScore));
      const strategicUrgency = Math.round(100 - (0.4 * ccsScore + 0.3 * imsScore + 0.3 * ensScore));

      const domainScores = {
        treasury: Math.max(0, Math.min(100, treasuryUrgency)),
        capital: Math.max(0, Math.min(100, capitalStructureUrgency)),
        growth: Math.max(0, Math.min(100, growthUrgency)),
        profitability: Math.max(0, Math.min(100, profitabilityUrgency)),
        governance: Math.max(0, Math.min(100, governanceUrgency)),
        strategic: Math.max(0, Math.min(100, strategicUrgency))
      };

      // Base Weighted SDS
      const weightedSdsUrgency = Math.round(
        0.25 * domainScores.treasury +
        0.20 * domainScores.capital +
        0.15 * domainScores.growth +
        0.15 * domainScores.profitability +
        0.15 * domainScores.governance +
        0.10 * domainScores.strategic
      );

      // SDS Health represents general institutional preparedness (100 is perfect, 0 is severe stress)
      const weightedSdsHealth = Math.round(
        0.25 * (100 - domainScores.treasury) +
        0.20 * (100 - domainScores.capital) +
        0.15 * (100 - domainScores.growth) +
        0.15 * (100 - domainScores.profitability) +
        0.15 * (100 - domainScores.governance) +
        0.10 * (100 - domainScores.strategic)
      );

      // CRITICAL CONSTRAINT LAYER (SDS Ceiling & Floor)
      const fcoRecurrentNegative = fcoOperacionalReal < 0 && (context.input.rawFinancialData?.prevFco ?? 0) < 0;
      const isCriticalConstraintActive = runway < 3 || fcoRecurrentNegative || hasCriticalCovenantBreach;

      let sdsUrgency = weightedSdsUrgency;
      let sdsHealth = weightedSdsHealth;

      if (isCriticalConstraintActive) {
        sdsUrgency = Math.max(85, weightedSdsUrgency);
        sdsHealth = Math.min(60, weightedSdsHealth);
      }

      // ── 3. DECISION RECOMMENDATION CATALOG (21 items) ──
      // Define calculations for each recommendation
      const buildRecommendation = (
        id: string,
        label: string,
        classification: DecisionRecommendation['classification'],
        baseUrgency: number,
        baseImpact: number,
        baseSurvivability: number,
        baseRiskReduction: number,
        baseFeasibility: number,
        baseDRS: number,
        complexity: DecisionRecommendation['executionComplexity'],
        textFields: { benefits: string; risks: string; optCost: string; deps: string; rationale: string },
        cascadeFields: { direct: string; indirect: string; systemic: string },
        formula: string,
        metricsList: string[],
        enginesList: string[]
      ): DecisionRecommendation => {
        // execution capacity modifier
        let feasibility = baseFeasibility;
        let dependencyReadiness = baseDRS;
        
        if (executionCapacity < 50 && (complexity === 'HIGH' || complexity === 'CRITICAL')) {
          // Penalize feasibility and dependency readiness if execution capacity is low
          feasibility = Math.round(feasibility * 0.7);
          dependencyReadiness = Math.round(dependencyReadiness * 0.7);
        }

        const dpi = Math.round(
          0.25 * baseUrgency +
          0.20 * baseImpact +
          0.20 * baseSurvivability +
          0.15 * baseRiskReduction +
          0.10 * feasibility +
          0.10 * dependencyReadiness
        );

        const lineageHash = `sde-rec-${id}-${runway}-${cqs.toFixed(0)}-${dpi}`;

        return {
          id,
          label,
          classification,
          urgency: baseUrgency,
          impact: baseImpact,
          survivability: baseSurvivability,
          riskReduction: baseRiskReduction,
          feasibility,
          dependencyReadiness,
          dpi,
          benefits: textFields.benefits,
          risks: textFields.risks,
          opportunityCost: textFields.optCost,
          dependencies: textFields.deps,
          executionComplexity: complexity,
          formula,
          originatingMetrics: metricsList,
          contributingEngines: enginesList,
          rationale: textFields.rationale,
          lineageHash,
          directEffect: cascadeFields.direct,
          indirectEffect: cascadeFields.indirect,
          systemicEffect: cascadeFields.systemic
        };
      };

      const allDecisionsList: DecisionRecommendation[] = [];

      // 1. Preserve Cash
      const preserveCashUrgency = Math.max(0, Math.min(100, 100 - runway * 8 - cqs * 0.2));
      allDecisionsList.push(buildRecommendation(
        'preserve_cash',
        'Preserve Cash',
        'STABILIZE',
        preserveCashUrgency,
        85, 95, 90, 85, 100,
        'HIGH',
        {
          benefits: 'Reduz o consumo imediato de caixa e protege a solvabilidade de curto prazo.',
          risks: 'Pode desacelerar o ritmo operacional e atrasar investimentos programados.',
          optCost: 'Sacrifício de iniciativas de crescimento ou melhoria de infraestrutura.',
          deps: 'Nenhuma dependência crítica externa.',
          rationale: `Urgência calculada em função da runway (${runway.toFixed(1)} meses) e do Cash Quality Score (${cqs.toFixed(0)}).`
        },
        {
          direct: 'Reduz o fluxo de saída operacional imediato.',
          indirect: 'Melhora o saldo de caixa acumulado e a liquidez imediata.',
          systemic: 'Aumenta a resiliência do cockpit de continuidade e reduz o risco de ruptura de tesouraria.'
        },
        '100 - Runway * 8 - CQS * 0.2',
        ['runway', 'cqs'],
        ['LegacyDFCAdapter']
      ));

      // 2. Refinance Debt
      const refinanceDebtUrgency = shortTermDebt > 0 ? Math.max(10, Math.min(100, 100 - ccsScore * 0.8 - ensScore * 0.2)) : 10;
      const refinanceDebtDRS = Math.max(10, Math.min(100, ccsScore * 1.0)); // Highly dependent on credit simulator
      allDecisionsList.push(buildRecommendation(
        'refinance_debt',
        'Refinance Debt',
        'RESTRUCTURE',
        refinanceDebtUrgency,
        80, 90, 85, 50, refinanceDebtDRS,
        'HIGH',
        {
          benefits: 'Substitui dívidas de curto prazo por vencimentos de longo prazo, aliviando o passivo circulante.',
          risks: 'Sujeito a taxas de juros mais elevadas se a nota de crédito (CCS) estiver fragilizada.',
          optCost: 'Custos de transação e taxas de estruturação de dívida.',
          deps: 'Depende diretamente de um score CCS favorável para aprovação estruturada.',
          rationale: `Urgência indexada à necessidade de reperfilamento de dívida e atratividade frente ao simulador de comitê de crédito (${ccsScore.toFixed(0)}).`
        },
        {
          direct: 'Reprograma o perfil de vencimento das obrigações financeiras.',
          indirect: 'Diminui a pressão de amortização imediata e melhora o capital de giro contábil.',
          systemic: 'Eleva a nota de prontidão bancária e afasta o risco de covenant contagion.'
        },
        '100 - CCS * 0.8 - ENE * 0.2',
        ['shortTermDebt', 'ccsScore', 'ensScore'],
        ['CreditCommitteeSimulatorEngine', 'EconomicNormalizationAdapter']
      ));

      // 3. Renegotiate Suppliers
      const renegotiateSuppliersUrgency = Math.max(0, Math.min(100, 100 - cqs * 0.5 - (fcoOperacionalReal < 0 ? 30 : 0)));
      allDecisionsList.push(buildRecommendation(
        'renegotiate_suppliers',
        'Renegotiate Suppliers',
        'OPTIMIZE',
        renegotiateSuppliersUrgency,
        70, 75, 70, 70, 90,
        'MODERATE',
        {
          benefits: 'Estende os prazos de pagamento a fornecedores, otimizando o ciclo financeiro.',
          risks: 'Pode comprometer o relacionamento comercial ou implicar em perda de descontos pontuais.',
          optCost: 'Perda de competitividade na aquisição de insumos críticos.',
          deps: 'Nenhuma dependência externa complexa.',
          rationale: `Calculado a partir do CQS (${cqs.toFixed(0)}) e da geração líquida de caixa operacional.`
        },
        {
          direct: 'Estende o prazo médio de pagamento de fornecedores (PMP).',
          indirect: 'Otimiza o ciclo de caixa e libera capital de giro operacional.',
          systemic: 'Estabiliza a liquidez operacional sem necessidade de captação de dívida bancária.'
        },
        '100 - CQS * 0.5 - Penalty(FCO < 0)',
        ['cqs', 'fcoOperacionalReal'],
        ['LegacyDFCAdapter']
      ));

      // 4. Reduce Operating Expenses
      const reduceSgaUrgency = Math.max(0, Math.min(100, 100 - eqs * 0.6 - ensScore * 0.4));
      allDecisionsList.push(buildRecommendation(
        'reduce_opex',
        'Reduce Operating Expenses',
        'OPTIMIZE',
        reduceSgaUrgency,
        75, 80, 75, 75, 95,
        'MODERATE',
        {
          benefits: 'Reduz as despesas de SG&A permanentes, melhorando a margem de EBITDA operacional.',
          risks: 'Pode afetar a capacidade produtiva ou a eficiência da equipe de suporte corporativo.',
          optCost: 'Possível perda de talentos e impacto na qualidade dos serviços internos.',
          deps: 'Nenhuma dependência regulatória ou externa.',
          rationale: `Definido pela integridade de lucros (EQS: ${eqs.toFixed(0)}) e pela normalização de SG&A no ENE.`
        },
        {
          direct: 'Diminui a linha de despesas operacionais administrativas (SG&A).',
          indirect: 'Expande a margem EBITDA e a margem operacional recorrente.',
          systemic: 'Melhora o retorno sobre o capital investido (ROIC) e a atratividade perante investidores.'
        },
        '100 - EQS * 0.6 - ENE * 0.4',
        ['eqs', 'ensScore'],
        ['LegacyDFCAdapter', 'EconomicNormalizationAdapter']
      ));

      // 5. Improve Pricing
      const improvePricingUrgency = Math.max(0, Math.min(100, 80 - eqs * 0.5));
      allDecisionsList.push(buildRecommendation(
        'improve_pricing',
        'Improve Pricing',
        'OPTIMIZE',
        improvePricingUrgency,
        70, 65, 60, 60, 85,
        'MODERATE',
        {
          benefits: 'Melhora a receita média por unidade vendida e a recomposição de margens.',
          risks: 'Risco de perda de volume de vendas para concorrentes (elasticidade-preço).',
          optCost: 'Perda potencial de fatia de mercado (market share) no curto prazo.',
          deps: 'Depende de validação comercial ativa.',
          rationale: `Análise derivada da qualidade dos resultados contábeis (EQS: ${eqs.toFixed(0)}).`
        },
        {
          direct: 'Eleva a receita média por transação operacional.',
          indirect: 'Melhora a margem bruta operacional e a contribuição marginal.',
          systemic: 'Melhora a geração de caixa operacional primário atestada no DFC.'
        },
        '80 - EQS * 0.5',
        ['eqs'],
        ['LegacyDFCAdapter']
      ));

      // 6. Increase Gross Margin
      const increaseGrossMarginUrgency = Math.max(0, Math.min(100, 85 - ensScore * 0.6 - eqs * 0.2));
      allDecisionsList.push(buildRecommendation(
        'increase_gross_margin',
        'Increase Gross Margin',
        'OPTIMIZE',
        increaseGrossMarginUrgency,
        75, 70, 65, 65, 80,
        'HIGH',
        {
          benefits: 'Reduz o custo dos bens/serviços vendidos (CPV/COGS) em relação à receita.',
          risks: 'Pode exigir substituição de insumos críticos por alternativas mais baratas de menor qualidade.',
          optCost: 'Investimento em eficiência produtiva e negociação de contratos.',
          deps: 'Depende de contratos produtivos estáveis.',
          rationale: `Baseado no nível de margem recorrente avaliado pelo motor de normalização econômica (${ensScore.toFixed(0)}).`
        },
        {
          direct: 'Otimiza o custo dos produtos vendidos (CPV).',
          indirect: 'Aumenta a lucratividade operacional primária do DRE.',
          systemic: 'Alivia as necessidades de capital de giro e melhora o ROIC normalizado.'
        },
        '85 - ENE * 0.6 - EQS * 0.2',
        ['ensScore', 'eqs'],
        ['EconomicNormalizationAdapter', 'LegacyDFCAdapter']
      ));

      // 7. Improve Working Capital
      const improveWorkingCapitalUrgency = Math.max(0, Math.min(100, 90 - cqs * 0.5 - ensScore * 0.3));
      allDecisionsList.push(buildRecommendation(
        'improve_working_capital',
        'Improve Working Capital',
        'OPTIMIZE',
        improveWorkingCapitalUrgency,
        80, 80, 75, 75, 90,
        'MODERATE',
        {
          benefits: 'Reduz o ciclo financeiro global (contas a receber + estoques - fornecedores).',
          risks: 'Pode restringir a flexibilidade comercial (crédito a clientes) ou o nível de estoque de segurança.',
          optCost: 'Perda tática de vendas por falta de estoque ou prazos curtos.',
          deps: 'Nenhuma dependência crítica.',
          rationale: `Reflete a qualidade do caixa operacional em face dos componentes circulantes no ENE.`
        },
        {
          direct: 'Ajusta o ciclo de conversão de caixa (CCC).',
          indirect: 'Libera recursos líquidos que estavam presos no balanço patrimonial.',
          systemic: 'Melhora o score CQS e afasta o risco de dependência excessiva de terceiros.'
        },
        '90 - CQS * 0.5 - ENE * 0.3',
        ['cqs', 'ensScore'],
        ['LegacyDFCAdapter', 'EconomicNormalizationAdapter']
      ));

      // 8. Raise Equity
      const raiseEquityUrgency = Math.max(0, Math.min(100, 100 - runway * 6 - ccsScore * 0.4));
      allDecisionsList.push(buildRecommendation(
        'raise_equity',
        'Raise Equity',
        'TRANSFORM',
        raiseEquityUrgency,
        90, 95, 90, 45, 80,
        'CRITICAL',
        {
          benefits: 'Injeta capital de longo prazo sem pressão de endividamento, eliminando custos financeiros.',
          risks: 'Diluição da participação acionária dos sócios fundadores.',
          optCost: 'Desgaste societário e longo processo de captação (valuation/due diligence).',
          deps: 'Depende de atratividade de tese perante investidores (IMS e BRM).',
          rationale: `Urgência definida pela exaustão iminente de runway (${runway.toFixed(1)} meses) e baixa atratividade de crédito.`
        },
        {
          direct: 'Injeta caixa primário diretamente na conta de Capital Social (PL).',
          indirect: 'Zera o endividamento líquido imediato e eleva a liquidez corrente.',
          systemic: 'Restaura a solvabilidade absoluta e fornece runway estável para expansão.'
        },
        '100 - Runway * 6 - CCS * 0.4',
        ['runway', 'ccsScore'],
        ['LegacyDFCAdapter', 'CreditCommitteeSimulatorEngine']
      ));

      // 9. Raise Debt
      const raiseDebtUrgency = Math.max(0, Math.min(100, 80 - runway * 4)) * (ccsScore >= 50 ? 1.0 : 0.2);
      const raiseDebtDRS = Math.max(10, Math.min(100, ccsScore * 1.0)); // Highly dependent on credit rating simulator
      allDecisionsList.push(buildRecommendation(
        'raise_debt',
        'Raise Debt',
        'TRANSFORM',
        raiseDebtUrgency,
        75, 70, 60, 55, raiseDebtDRS,
        'HIGH',
        {
          benefits: 'Acesso rápido a liquidez complementar para projetos de investimento.',
          risks: 'Aumenta as despesas financeiras futuras e compromete o índice de alavancagem.',
          optCost: 'Consumo futuro de fluxo de caixa operacional para amortização.',
          deps: 'Depende crucialmente da aprovação do comitê de crédito no CCS.',
          rationale: `Geração indexada à runway e à viabilidade simulada perante comitês bancários (CCS: ${ccsScore.toFixed(0)}).`
        },
        {
          direct: 'Aumenta a linha de passivos financeiros de curto/longo prazo.',
          indirect: 'Aumenta o saldo disponível em disponibilidades líquidas.',
          systemic: 'Pode aumentar o risco de quebra de covenants se o endividamento líquido for excessivo.'
        },
        '(80 - Runway * 4) * Modifier(CCS >= 50)',
        ['runway', 'ccsScore'],
        ['CreditCommitteeSimulatorEngine']
      ));

      // 10. Divest Non-Core Assets
      const divestAssetsUrgency = Math.max(0, Math.min(100, 90 - runway * 5 - ccsScore * 0.3));
      allDecisionsList.push(buildRecommendation(
        'divest_non_core',
        'Divest Non-Core Assets',
        'RESTRUCTURE',
        divestAssetsUrgency,
        80, 85, 80, 50, 85,
        'HIGH',
        {
          benefits: 'Geração imediata de caixa não operacional através da alienação de ativos supérfluos.',
          risks: 'Pode implicar em prejuízos contábeis temporários (write-offs) se vendidos abaixo do valor contábil.',
          optCost: 'Perda de ativos que poderiam ter utilidade futura em cenários de expansão.',
          deps: 'Necessita de liquidez de mercado para os ativos a serem desmobilizados.',
          rationale: `Recomendado sob estresse de runway para proteção da sobrevivência operacional.`
        },
        {
          direct: 'Desmobiliza ativos não operacionais no balanço patrimonial.',
          indirect: 'Injeta recursos de capital não recorrente diretamente no caixa.',
          systemic: 'Preserva a solvabilidade sem diluição societária ou contratação de passivos.'
        },
        '90 - Runway * 5 - CCS * 0.3',
        ['runway', 'ccsScore'],
        ['LegacyDFCAdapter', 'CreditCommitteeSimulatorEngine']
      ));

      // 11. Reduce Inventory
      const reduceInventoryUrgency = Math.max(0, Math.min(100, 85 - cqs * 0.5 - ensScore * 0.3));
      allDecisionsList.push(buildRecommendation(
        'reduce_inventory',
        'Reduce Inventory',
        'OPTIMIZE',
        reduceInventoryUrgency,
        70, 75, 70, 80, 95,
        'LOW',
        {
          benefits: 'Libera capital de giro retido em mercadorias de giro lento, reduzindo custos de armazenagem.',
          risks: 'Aumenta o risco de ruptura de estoque e insatisfação de clientes por falta de produtos.',
          optCost: 'Margens unitárias reduzidas devido a liquidações forçadas de estoques.',
          deps: 'Depende de campanhas de escoamento e demanda comercial.',
          rationale: `Vinculado ao baixo giro e eficiência de capital operacional avaliados pelo ENE (${ensScore.toFixed(0)}).`
        },
        {
          direct: 'Reduz a conta de estoques no ativo circulante.',
          indirect: 'Melhora o fluxo de entradas operacionais primárias.',
          systemic: 'Diminui a necessidade de captação de giro e melhora a liquidez real.'
        },
        '85 - CQS * 0.5 - ENE * 0.3',
        ['cqs', 'ensScore'],
        ['LegacyDFCAdapter', 'EconomicNormalizationAdapter']
      ));

      // 12. Improve Receivables
      const improveReceivablesUrgency = Math.max(0, Math.min(100, 85 - cqs * 0.6 - ensScore * 0.2));
      allDecisionsList.push(buildRecommendation(
        'improve_receivables',
        'Improve Receivables',
        'OPTIMIZE',
        improveReceivablesUrgency,
        75, 75, 70, 75, 90,
        'MODERATE',
        {
          benefits: 'Antecipa recebíveis ou endurece políticas de cobrança, encurtando o prazo de recebimento.',
          risks: 'Pode afastar clientes que demandam prazos longos de pagamento comercial.',
          optCost: 'Despesas financeiras adicionais se envolver operações de antecipação (descontos).',
          deps: 'Depende de aceitação comercial e taxas bancárias.',
          rationale: `Reflete a qualidade do faturamento contábil e prazos de conversão líquida.`
        },
        {
          direct: 'Reduz o saldo de contas a receber no ativo circulante.',
          indirect: 'Gera entradas imediatas de caixa operacional no DFC.',
          systemic: 'Aumenta o Cash Quality Score (CQS) e afasta riscos de insolvência de clientes.'
        },
        '85 - CQS * 0.6 - ENE * 0.2',
        ['cqs', 'ensScore'],
        ['LegacyDFCAdapter', 'EconomicNormalizationAdapter']
      ));

      // 13. Formalize Governance
      const formalizeGovUrgency = Math.max(0, Math.min(100, 100 - brmScore * 0.7 - imsScore * 0.3));
      allDecisionsList.push(buildRecommendation(
        'formalize_governance',
        'Formalize Governance',
        'OPTIMIZE',
        formalizeGovUrgency,
        65, 60, 75, 80, 85,
        'MODERATE',
        {
          benefits: 'Cria comitês, segrega funções e mitiga riscos de controle interno e conformidade.',
          risks: 'Aumenta o custo administrativo (SG&A) da alta administração.',
          optCost: 'Velocidade decisória ligeiramente reduzida por processos formais de aprovação.',
          deps: 'Depende de comprometimento do board institucional.',
          rationale: `Calculado em função do Board Risk Score (${brmScore.toFixed(0)}) e da maturidade longitudinal (IMS).`
        },
        {
          direct: 'Implementa políticas internas de segregação e controle.',
          indirect: 'Mitiga o risco de governança apontado nas auditorias do BRM.',
          systemic: 'Eleva a nota de governança no CCS e atrai investidores institucionais.'
        },
        '100 - BRM * 0.7 - IMS * 0.3',
        ['brmScore', 'imsScore'],
        ['BoardRiskMatrixAdapter', 'InstitutionalMemoryEngine']
      ));

      // 14. Reduce Related Party Exposure
      const relPartyUrgency = intensidadePartesRelacionadas > 0.1 ? Math.max(10, Math.min(100, 100 - brmScore * 0.8)) : 10;
      allDecisionsList.push(buildRecommendation(
        'reduce_related_party',
        'Reduce Related Party Exposure',
        'RESTRUCTURE',
        relPartyUrgency,
        80, 80, 85, 75, 75,
        'HIGH',
        {
          benefits: 'Isola o caixa da empresa de transações com sócios ou controladoras, eliminando drenos atípicos.',
          risks: 'Pode exigir que o sócio/controladora busque fontes alternativas externas de financiamento.',
          optCost: 'Desgaste societário e reestruturação de acordos de acionistas.',
          deps: 'Depende diretamente de acordos e assinaturas dos acionistas controladores.',
          rationale: `Urgência ativada pelo volume de fluxos com partes relacionadas (${(intensidadePartesRelacionadas * 100).toFixed(1)}%) e score BRM.`
        },
        {
          direct: 'Elimina ou mitiga fluxos financeiros intercompany não comerciais.',
          indirect: 'Reduz o descompasso DFC/DRE gerado por transações societárias.',
          systemic: 'Estabiliza a legitimidade fiduciária auditada no Fiduciary Validation Center.'
        },
        '100 - BRM * 0.8 (if RelatedParties > 0.1)',
        ['intensidadePartesRelacionadas', 'brmScore'],
        ['LegacyDFCAdapter', 'BoardRiskMatrixAdapter']
      ));

      // 15. Expand Operations
      const canExpand = fcoOperacionalReal > 0 && ebitda > 0 && runway >= 6;
      const expandUrgency = canExpand ? Math.max(10, Math.min(100, (ccsScore * 0.5 + ensScore * 0.3 + imsScore * 0.2))) : 10;
      const expandDRS = canExpand ? 100 : 20; // Blocker if cash is tight
      allDecisionsList.push(buildRecommendation(
        'expand_operations',
        'Expand Operations',
        'TRANSFORM',
        expandUrgency,
        85, 30, 20, 45, expandDRS,
        'HIGH',
        {
          benefits: 'Aumenta a escala operacional, abre novos mercados e expande receitas a longo prazo.',
          risks: 'Consome volumes massivos de liquidez e pode pressionar o capital de giro.',
          optCost: 'Sacrifício de liquidez de segurança e foco em proteção contra crises.',
          deps: 'Requer necessariamente superávit de caixa de segurança e conformidade nos covenants.',
          rationale: `Somente recomendado se houver geração de caixa saudável (${fcoOperacionalReal.toFixed(0)}) e folga fiduciária.`
        },
        {
          direct: 'Aumenta as despesas de capital (CAPEX) e contratação de pessoal comercial.',
          indirect: 'Expande o faturamento bruto e as despesas operacionais no DRE.',
          systemic: 'Reduz temporariamente os indicadores de liquidez antes do payback operacional.'
        },
        '(CCS * 0.5 + ENE * 0.3 + IMS * 0.2) * Modifier(Healthy)',
        ['fcoOperacionalReal', 'ebitda', 'runway', 'ccsScore', 'ensScore', 'imsScore'],
        ['CreditCommitteeSimulatorEngine', 'EconomicNormalizationAdapter', 'InstitutionalMemoryEngine']
      ));

      // 16. Pause Expansion
      const pauseExpansionUrgency = runway < 6 || fcoOperacionalReal < 0 ? Math.max(10, Math.min(100, 100 - runway * 10)) : 10;
      allDecisionsList.push(buildRecommendation(
        'pause_expansion',
        'Pause Expansion',
        'PRESERVE',
        pauseExpansionUrgency,
        75, 85, 80, 80, 100,
        'LOW',
        {
          benefits: 'Estanca imediatamente saídas de caixa destinadas a investimentos de expansão não maduros.',
          risks: 'Pode deixar projetos de expansão incompletos e adiar ganhos de escala previstos.',
          optCost: 'Perda de market share temporária e interrupção de cronogramas estratégicos.',
          deps: 'Nenhuma dependência externa.',
          rationale: `Definido pela fragilidade de runway e geração negativa de caixa operacional.`
        },
        {
          direct: 'Congela os desembolsos de CAPEX e investimentos não operacionais.',
          indirect: 'Reduz a queima de caixa e estabiliza a tesouraria no curto prazo.',
          systemic: 'Preserva a solvabilidade geral no cockpit de continuidade institucional.'
        },
        '100 - Runway * 10 (under stress)',
        ['runway', 'fcoOperacionalReal'],
        ['LegacyDFCAdapter']
      ));

      // 17. Restructure Operations
      const restructureOpsUrgency = Math.max(0, Math.min(100, 95 - eqs * 0.6 - ensScore * 0.3));
      allDecisionsList.push(buildRecommendation(
        'restructure_operations',
        'Restructure Operations',
        'RESTRUCTURE',
        restructureOpsUrgency,
        80, 85, 80, 60, 80,
        'HIGH',
        {
          benefits: 'Saneia divisões deficitárias, unifica equipes e otimiza a eficiência geral de custos.',
          risks: 'Custos trabalhistas e de reestruturação iniciais podem pressionar o caixa imediatamente.',
          optCost: 'Redução temporária na qualidade das entregas comerciais e fricções internas.',
          deps: 'Requer apoio do comitê executivo e do conselho de administração.',
          rationale: `Identificado pela ineficiência estrutural e baixa recorrência operacional no ENE.`
        },
        {
          direct: 'Promove cortes e readequação de processos operacionais primários.',
          indirect: 'Diminui custos fixos corporativos e otimiza margens no DRE.',
          systemic: 'Melhora o score ensScore e eleva o retorno do capital investido longitudinal.'
        },
        '95 - EQS * 0.6 - ENE * 0.3',
        ['eqs', 'ensScore'],
        ['LegacyDFCAdapter', 'EconomicNormalizationAdapter']
      ));

      // 18. Execute Turnaround Program
      const isTurnaroundCandidate = runway < 4 || (ebitda < 0 && fcoOperacionalReal < 0);
      const turnaroundUrgency = isTurnaroundCandidate ? Math.max(10, Math.min(100, 100 - runway * 12)) : 10;
      allDecisionsList.push(buildRecommendation(
        'execute_turnaround',
        'Execute Turnaround Program',
        'RESTRUCTURE',
        turnaroundUrgency,
        90, 95, 90, 40, 75,
        'CRITICAL',
        {
          benefits: 'Correção radical de rumo corporativo, renegociação global de passivos e foco em sobrevivência.',
          risks: 'Extrema fricção operacional, publicidade negativa de mercado e risco de liquidação.',
          optCost: 'Sacrifício total de qualquer ambição de crescimento nos próximos ciclos.',
          deps: 'Requer mandato soberano do board e assessoria externa especializada.',
          rationale: `Acionado em caráter de emergência sob exaustão extrema de liquidez (runway < 4 meses).`
        },
        {
          direct: 'Intervenção estrutural em todas as contas de despesa e contas de capital.',
          indirect: 'Redução drástica do burn rate e eliminação de vazamentos de caixa.',
          systemic: 'Foco exclusivo em restabelecer a continuidade operacional mínima garantida.'
        },
        '100 - Runway * 12 (under critical stress)',
        ['runway', 'ebitda', 'fcoOperacionalReal'],
        ['LegacyDFCAdapter', 'LegacyDREAdapter']
      ));

      // 19. Pursue Strategic Partnerships
      const partnersUrgency = Math.max(0, Math.min(100, 80 - imsScore * 0.5 - ccsScore * 0.3));
      allDecisionsList.push(buildRecommendation(
        'strategic_partnerships',
        'Pursue Strategic Partnerships',
        'OPTIMIZE',
        partnersUrgency,
        70, 60, 60, 65, 80,
        'MODERATE',
        {
          benefits: 'Compartilha riscos de mercado, reduz CAPEX exigido e melhora acesso comercial.',
          risks: 'Fricção de governança e alinhamento estratégico entre organizações distintas.',
          optCost: 'Perda de controle total sobre projetos específicos ou propriedade intelectual.',
          deps: 'Depende de prospecção de parceiros de mercado.',
          rationale: `Definido pela consistência longitudinal e nota de crédito no CCS.`
        },
        {
          direct: 'Firmamento de acordos comerciais de compartilhamento de risco.',
          indirect: 'Diluição de necessidades de Capex futuro nas demonstrações.',
          systemic: 'Melhora o posicionamento estratégico auditado no IMS.'
        },
        '80 - IMS * 0.5 - CCS * 0.3',
        ['imsScore', 'ccsScore'],
        ['InstitutionalMemoryEngine', 'CreditCommitteeSimulatorEngine']
      ));

      // 20. Evaluate Acquisition
      const acquisitionUrgency = canExpand ? Math.max(5, Math.min(100, ccsScore * 0.6 + ensScore * 0.4 - 20)) : 5;
      const acquisitionDRS = canExpand ? 100 : 10;
      allDecisionsList.push(buildRecommendation(
        'evaluate_acquisition',
        'Evaluate Acquisition',
        'TRANSFORM',
        acquisitionUrgency,
        80, 20, 15, 30, acquisitionDRS,
        'CRITICAL',
        {
          benefits: 'Aquisição de concorrente para ganho rápido de escala e consolidação setorial.',
          risks: 'Elevado consumo de caixa, risco de integração de sistemas/cultura corporativa.',
          optCost: 'Imobilização de expressivo capital líquido em goodwill e ativos imobilizados.',
          deps: 'Depende de farta liquidez excedente e ratings AAA/AA no simulador de crédito.',
          rationale: `Habilitado somente em cenários de alta liquidez e folga de covenants.`
        },
        {
          direct: 'Saída maciça de caixa de investimentos por fusões e aquisições.',
          indirect: 'Incorporação de novos ativos e novos passivos consolidados.',
          systemic: 'Diminuição drástica de margem de segurança de caixa imediata.'
        },
        '(CCS * 0.6 + ENE * 0.4 - 20) * Modifier(Healthy)',
        ['fcoOperacionalReal', 'runway', 'ccsScore', 'ensScore'],
        ['CreditCommitteeSimulatorEngine', 'EconomicNormalizationAdapter']
      ));

      // 21. Evaluate Divestiture
      const divestitureUrgency = Math.max(0, Math.min(100, 85 - runway * 4 - ccsScore * 0.3));
      allDecisionsList.push(buildRecommendation(
        'evaluate_divestiture',
        'Evaluate Divestiture',
        'RESTRUCTURE',
        divestitureUrgency,
        75, 75, 70, 55, 80,
        'HIGH',
        {
          benefits: 'Venda de unidade de negócios secundária para capitalização primária rápida.',
          risks: 'Pode reduzir o faturamento consolidado global da companhia de forma irreversível.',
          optCost: 'Desistência de linhas de negócio promissoras para saneamento de curto prazo.',
          deps: 'Requer interessados de compra ativos e avaliação de valuation mínima.',
          rationale: `Definido como via estrutural para captação não recorrente sob restrições.`
        },
        {
          direct: 'Descontinuação e venda de linhas de negócio consolidadas.',
          indirect: 'Entradas na conta de fluxo de caixa de investimentos no DFC.',
          systemic: 'Simplificação da governança corporativa e recomposição de liquidez.'
        },
        '85 - Runway * 4 - CCS * 0.3',
        ['runway', 'ccsScore'],
        ['LegacyDFCAdapter', 'CreditCommitteeSimulatorEngine']
      ));

      // ── 4. DECISION PRIORITY BOARD (TOP 10 RANKED BY DPI) ──
      const sortedDecisions = [...allDecisionsList].sort((a, b) => b.dpi - a.dpi);
      const topDecisions = sortedDecisions.slice(0, 10);

      // ── 5. DECISION TIMELINE CLASSIFICATION ──
      // Group all 21 recommendations into urgency time horizons
      const timelineDecisions = {
        immediate: allDecisionsList.filter(d => d.dpi >= 75).map(d => d.id),
        shortTerm: allDecisionsList.filter(d => d.dpi >= 50 && d.dpi < 75).map(d => d.id),
        mediumTerm: allDecisionsList.filter(d => d.dpi >= 30 && d.dpi < 50).map(d => d.id),
        longTerm: allDecisionsList.filter(d => d.dpi < 30).map(d => d.id)
      };

      // ── 6. BIDIRECTIONAL DECISION CONFLICT ENGINE & CSI ──
      const conflicts: Array<{ id: string; decA: string; decB: string; severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'; score: number; explanation: string }> = [];

      const checkConflict = (
        id: string,
        idA: string,
        idB: string,
        labelA: string,
        labelB: string,
        conflictCondition: boolean,
        baseExplanation: string
      ) => {
        const decA = allDecisionsList.find(d => d.id === idA);
        const decB = allDecisionsList.find(d => d.id === idB);

        if (decA && decB && (decA.dpi >= 50 && decB.dpi >= 50)) {
          // Both have high priority, conflict is active!
          let severityScore = 50;
          if (conflictCondition) {
            severityScore = 95; // Stressed context amplifies conflict to critical
          } else {
            severityScore = 35;
          }

          let severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'MODERATE';
          if (severityScore >= 80) severity = 'CRITICAL';
          else if (severityScore >= 60) severity = 'HIGH';
          else if (severityScore >= 30) severity = 'MODERATE';
          else severity = 'LOW';

          conflicts.push({
            id,
            decA: labelA,
            decB: labelB,
            severity,
            score: severityScore,
            explanation: `${baseExplanation} Em virtude da realidade financeira da instituição (Runway: ${runway.toFixed(1)} meses, FCO: R$ ${fcoOperacionalReal.toLocaleString('pt-BR')}), esta contradição possui severidade ${severity.toUpperCase()}.`
          });
        }
      };

      // Conflict 1: Raise Debt vs Reduce Leverage (Refinance/Reduce Debt)
      const hasDebtLoad = shortTermDebt > 0;
      checkConflict(
        'debt_vs_leverage',
        'raise_debt',
        'refinance_debt',
        'Captar Dívida',
        'Refinanciar Dívida (Reperfilamento)',
        hasDebtLoad && runway < 6,
        'Captação de novas dívidas entra em choque direto com o esforço de redução de alavancagem/reperfilamento sob liquidez apertada.'
      );

      // Conflict 2: Accelerate Growth vs Preserve Cash
      checkConflict(
        'growth_vs_cash',
        'expand_operations',
        'preserve_cash',
        'Expandir Operações (CAPEX)',
        'Preservar Caixa',
        runway < 6 || fcoOperacionalReal < 0,
        'A aceleração operacional exige desmobilização de caixa imediata para crescimento, contrapondo-se à estratégia de proteção urgente de liquidez.'
      );

      // Conflict 3: Increase Inventory vs Improve Working Capital (Reduce Inventory)
      checkConflict(
        'inventory_vs_wc',
        'expand_operations', // Expand implies inventory
        'reduce_inventory',
        'Expansão Comercial',
        'Reduzir Estoques',
        ensScore < 60 || fcoOperacionalReal < 0,
        'O aumento de estoques para faturamento expandido retém liquidez operacional e entra em colisão direta com as recomendações de escoamento e saneamento do capital de giro.'
      );

      // Conflict 4: CAPEX Expansion vs Treasury Preservation
      checkConflict(
        'capex_vs_treasury',
        'expand_operations',
        'pause_expansion',
        'Investimento em CAPEX',
        'Pausar Expansão',
        runway < 4 || hasCriticalCovenantBreach,
        'A alocação em ativos fixos (CAPEX) conflitua de maneira crítica com o congelamento e estancamento de saídas de caixa necessários para a sobrevivência operacional.'
      );

      // ── 7. DECISION FATIGUE INDEX (DFI) ──
      const activeDecisionsCount = allDecisionsList.filter(d => d.dpi >= 50).length;
      const averageComplexityFactor = allDecisionsList.filter(d => d.dpi >= 50).reduce((acc, d) => {
        if (d.executionComplexity === 'CRITICAL') return acc + 1.0;
        if (d.executionComplexity === 'HIGH') return acc + 0.8;
        if (d.executionComplexity === 'MODERATE') return acc + 0.5;
        return acc + 0.2;
      }, 0) / (activeDecisionsCount || 1);

      const unresolvedDepsCount = conflicts.length; // use conflict count as proxy for unresolved board dependencies
      const decisionFatigueIndex = Math.min(100, Math.round(
        (activeDecisionsCount * 8) + (averageComplexityFactor * 30) + (unresolvedDepsCount * 10)
      ));

      // ── 8. DECISION PATHWAYS WITH PROBABILITIES ──
      // Grouping into paths
      const pathAIds = ['preserve_cash', 'pause_expansion', 'reduce_opex', 'improve_working_capital', 'reduce_inventory', 'improve_receivables'];
      const pathBIds = ['renegotiate_suppliers', 'improve_pricing', 'increase_gross_margin', 'refinance_debt', 'formalize_governance', 'strategic_partnerships'];
      const pathCIds = ['expand_operations', 'raise_equity', 'raise_debt', 'evaluate_acquisition', 'evaluate_divestiture', 'divest_non_core', 'execute_turnaround', 'reduce_related_party', 'restructure_operations'];

      // Probability math:
      // Conservative path has very high probability under crisis, moderate under health.
      // Balanced path has high probability under normal conditions.
      // Aggressive path has low probability under crisis, high under cash surplus.
      let conservativeProb = 90;
      let balancedProb = 75;
      let aggressiveProb = 30;

      if (runway < 3 || fcoOperacionalReal < 0) {
        conservativeProb = 95;
        balancedProb = 50;
        aggressiveProb = 10;
      } else if (runway > 12 && fcoOperacionalReal > 0) {
        conservativeProb = 65;
        balancedProb = 85;
        aggressiveProb = 75;
      }

      // Early stage adjusts aggressive downward
      if (isEarlyStage) {
        aggressiveProb = Math.round(aggressiveProb * 0.6);
      }

      const pathways = {
        conservative: {
          name: 'Caminho A — Conservador (Preservação de Liquidez)',
          probability: conservativeProb,
          decisions: pathAIds,
          description: 'Foco exclusivo em proteger a tesouraria, reduzindo burn-rate e otimizando capital de giro sem assumir riscos de expansão.'
        },
        balanced: {
          name: 'Caminho B — Balanceado (Proteção com Otimização)',
          probability: balancedProb,
          decisions: pathBIds,
          description: 'Equilíbrio entre a estabilização operacional e melhorias de margens, precificação e estruturação de governança corporativa.'
        },
        aggressive: {
          name: 'Caminho C — Agressivo (Expansão e Transformação)',
          probability: aggressiveProb,
          decisions: pathCIds,
          description: 'Prioriza reposicionamento estratégico ativo, captação de recursos relevantes e crescimento de mercado (M&A ou CAPEX).'
        }
      };

      // ── 9. CAPITAL ALLOCATION LAYER (DYNAMIC RANKING) ──
      const rawAllocationOrder = [
        { dest: 'Liquidez', type: 'treasury', desc: 'Preservação de saldos de tesouraria imediata.' },
        { dest: 'Redução de dívida', type: 'capital', desc: 'Amortizações e alongamento de obrigações.' },
        { dest: 'Capital de giro', type: 'operations', desc: 'Alocação em estoques e concessão de prazos operacionais.' },
        { dest: 'CAPEX', type: 'growth', desc: 'Investimentos fixos produtivos.' },
        { dest: 'Crescimento', type: 'growth', desc: 'Orçamentos comerciais e marketing expansionista.' },
        { dest: 'Aquisições', type: 'strategic', desc: 'Fusões e aquisições corporativas.' }
      ];

      // Sort logic based on financial context
      let sortedAllocation: typeof rawAllocationOrder = [];
      if (runway < 6 || fcoOperacionalReal < 0) {
        // High liquidity stress: Liquidez first, Debt reduction second
        sortedAllocation = [
          rawAllocationOrder[0], // Liquidez
          rawAllocationOrder[1], // Redução divida
          rawAllocationOrder[2], // Capital de giro
          rawAllocationOrder[3], // CAPEX
          rawAllocationOrder[4], // Crescimento
          rawAllocationOrder[5]  // Aquisições
        ];
      } else if (runway > 12 && fcoOperacionalReal > 0) {
        // High liquidity health: Capex / Growth move up
        sortedAllocation = [
          rawAllocationOrder[3], // CAPEX
          rawAllocationOrder[4], // Crescimento
          rawAllocationOrder[2], // Capital de giro
          rawAllocationOrder[0], // Liquidez
          rawAllocationOrder[1], // Redução divida
          rawAllocationOrder[5]  // Aquisições
        ];
      } else {
        // Balanced
        sortedAllocation = [
          rawAllocationOrder[0], // Liquidez
          rawAllocationOrder[2], // Capital de giro
          rawAllocationOrder[3], // CAPEX
          rawAllocationOrder[1], // Redução divida
          rawAllocationOrder[4], // Crescimento
          rawAllocationOrder[5]  // Aquisições
        ];
      }

      const capitalAllocationRanking = sortedAllocation.map((item, index) => ({
        rank: index + 1,
        destination: item.dest,
        category: item.type,
        description: item.desc
      }));

      // ── 10. STRESS SCENARIO SIMULATOR FOR TOP 10 DECISIONS ──
      // Evaluate top decisions under CCS scenarios: Base, Conservative, EBITDA Compression, Squeeze, Recovery
      const decisionScenarioMatrix: Record<string, any> = {};

      topDecisions.forEach(dec => {
        decisionScenarioMatrix[dec.id] = {
          base: {
            liquidityImpact: dec.classification === 'STABILIZE' || dec.classification === 'PRESERVE' ? 'Positivo (+15%)' : 'Neutro / Reduzido',
            covenantImpact: 'Sem novos rompimentos',
            survivabilityImpact: dec.classification === 'STABILIZE' || dec.classification === 'PRESERVE' ? 'Aumentada' : 'Sob pressão',
            financeabilityImpact: dec.id === 'refinance_debt' ? 'Melhora significativa' : 'Estável'
          },
          conservative: {
            liquidityImpact: dec.classification === 'STABILIZE' || dec.classification === 'PRESERVE' ? 'Positivo marginal (+5%)' : 'Consumo (-10%)',
            covenantImpact: 'Sem novos rompimentos',
            survivabilityImpact: 'Preservada',
            financeabilityImpact: 'Estável'
          },
          stress: {
            liquidityImpact: dec.classification === 'STABILIZE' ? 'Preservado' : 'Consumo relevante (-20%)',
            covenantImpact: dec.classification === 'TRANSFORM' ? 'Breach em DSCR' : 'Sem novos rompimentos',
            survivabilityImpact: dec.classification === 'STABILIZE' ? 'Estabilizada' : 'Deterioração',
            financeabilityImpact: 'Sob pressão'
          },
          severeStress: {
            liquidityImpact: dec.classification === 'STABILIZE' ? 'Reduzido (Risco mitigado)' : 'Erosão grave de caixa (-35%)',
            covenantImpact: 'Múltiplos rompimentos detectados',
            survivabilityImpact: dec.classification === 'STABILIZE' ? 'Solvabilidade mínima garantida' : 'Risco de colapso de caixa',
            financeabilityImpact: 'Altamente restrito'
          },
          recovery: {
            liquidityImpact: 'Positivo robusto (+25%)',
            covenantImpact: 'Sem novos rompimentos',
            survivabilityImpact: 'Plena expansão',
            financeabilityImpact: 'Elevada atratividade (Prime)'
          }
        };
      });

      // ── 11. EARLY-STAGE SAFEGUARDS & FORBIDDEN NARRATIVES SCRUBBING ──
      // Sanitizer function
      const sanitizeNarrative = (text: string): string => {
        if (!text) return '';
        let clean = text;
        const forbiddenPatterns = [
          { pattern: /\bincompetence\b/gi, replacement: 'elevated institutional pressure' },
          { pattern: /\bfailure\b/gi, replacement: 'operational transition' },
          { pattern: /\bbankruptcy\b/gi, replacement: 'treasury fragility' },
          { pattern: /\bfraud\b/gi, replacement: 'governance dependency' },
          { pattern: /\bcollapse\b/gi, replacement: 'elevated pressure' },
          { pattern: /\bterminal deterioration\b/gi, replacement: 'strategic sensitivity' },
          { pattern: /\bfalha\b/gi, replacement: 'transição operacional' },
          { pattern: /\bfalência\b/gi, replacement: 'fragilidade de tesouraria' },
          { pattern: /\bfraude\b/gi, replacement: 'dependência de governança' },
          { pattern: /\bcolapso\b/gi, replacement: 'pressão elevada' },
          { pattern: /\bdeterioração terminal\b/gi, replacement: 'sensibilidade estratégica' },
          { pattern: /\bincompetência\b/gi, replacement: 'pressão institucional elevada' }
        ];

        forbiddenPatterns.forEach(f => {
          clean = clean.replace(f.pattern, f.replacement);
        });
        return clean;
      };

      // Rationale formatting & Safeguards for early stage (< 3 cycles)
      allDecisionsList.forEach(dec => {
        dec.benefits = sanitizeNarrative(dec.benefits);
        dec.risks = sanitizeNarrative(dec.risks);
        dec.opportunityCost = sanitizeNarrative(dec.opportunityCost);
        dec.rationale = sanitizeNarrative(dec.rationale);

        if (isEarlyStage) {
          // Mitigate narrative in early stage
          if (dec.classification === 'RESTRUCTURE' || dec.classification === 'TRANSFORM') {
            dec.rationale += ` (Contextualizado em estágio de maturação operacional e absorção de capital precoce com ${historicalCyclesCount} ciclo(s) auditados).`;
          }
        }
      });

      // Assemble auditability / lineage
      const auditability = {
        sdsUrgency,
        sdsHealth,
        executionCapacity,
        decisionFatigueIndex,
        lineage: 'BP.ShortTermDebt, DFC.FCO, DFC.Runway, DRE.EBITDA, CQS, EQS, ENE, BRM, IME, CCS',
        reconstructionLogic: 'SDS = Weighted SDS with Floor/Ceiling constraints applied under treasury/covenant alerts',
        fiduciaryRationale: 'O Sovereign Decision Engine (SDE) orquestra e prioriza as decisões fiduciárias mais urgentes e indica o direcionamento dinâmico de capital.'
      };

      const alerts: string[] = [];
      if (sdsUrgency >= 75) {
        alerts.push('Decisões imediatas de estabilização de caixa e governança são prioritárias na instituição.');
      }
      if (decisionFatigueIndex > 70) {
        alerts.push('Alerta de fadiga de governança ativo: Board congestionado com excesso de iniciativas complexas recomendadas.');
      }

      const confidence = isEarlyStage ? 'LOW' : 'HIGH';

      const narrative: AdvisoryNarrative = {
        diagnostic: sdsUrgency >= 75 
          ? sanitizeNarrative('A instituição apresenta fraca integridade de liquidez que exige priorização imediata de preservação de caixa.')
          : sanitizeNarrative('O portfólio de decisões está balanceado e focado em melhorias incrementais de processos.'),
        cause: isCriticalConstraintActive ? 'Presença de restrições críticas na tesouraria' : 'Estabilidade institucional relativa',
        consequence: sdsUrgency >= 75 ? 'Bloqueio tático de CAPEX de expansão' : 'Margem de manobra para crescimento estratégico',
        sensitivity: isEarlyStage ? 'Sensibilidade alta em virtude de ciclo histórico reduzido' : 'Sensibilidade moderada',
        risk: isCriticalConstraintActive ? 'Risco severo de liquidez e covenants' : 'Risco controlado',
        priority: sdsUrgency >= 75 ? 'Estabilização e Reperfilamento de Tesouraria' : 'Melhorias de Margem e Governança',
        strategicMovement: topDecisions[0]?.label || 'Preserve Cash'
      };

      const inference: InferenceBlock = {
        domain: 'sovereign_decision',
        metrics: {
          sdsUrgency,
          sdsHealth,
          executionCapacity,
          decisionFatigueIndex,
          domainScores,
          capitalAllocationRanking,
          pathways,
          timelineDecisions,
          topDecisions,
          allDecisions: allDecisionsList,
          conflicts,
          decisionScenarioMatrix,
          alerts,
          isEarlyStage,
          auditability,
          lineageHash: `sde-root-hash-${runway}-${sdsUrgency}`
        },
        causality: [],
        narrative,
        confidence,
        evidenceLevel: 'EVIDENCE_BASED',
        score: sdsUrgency
      };

      return {
        engineName: 'SovereignDecisionEngine',
        success: true,
        confidence,
        inference,
        violations: undefined
      };

    } catch (e: any) {
      return {
        engineName: 'SovereignDecisionEngine',
        success: false,
        confidence: 'LOW',
        violations: [{
          rule: 'sde_engine_error',
          severity: 'CRITICAL',
          message: `Erro ao processar Sovereign Decision Engine: ${e.message}`,
          blocked: true
        }]
      };
    }
  }
};
