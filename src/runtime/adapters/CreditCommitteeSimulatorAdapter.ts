import { EngineDefinition, InstitutionalContext, EngineExecutionResult, InferenceBlock, CausalityChain, AdvisoryNarrative } from '../types';

export const CreditCommitteeSimulatorAdapter: EngineDefinition = {
  name: 'CreditCommitteeSimulatorEngine',
  priority: 70, // Downstream of BRM (60) and IME (60)
  dependencies: [
    'LegacyFinancialAdapter',
    'LegacyDREAdapter',
    'LegacyDFCAdapter',
    'EconomicNormalizationAdapter',
    'StressTestAdapter',
    'ExecutiveDecisionEngine',
    'InstitutionalMemoryEngine',
    'BoardRiskMatrixAdapter'
  ],
  requiredData: ['historicalCyclesCount'],
  inferenceScope: 'credit_simulation',
  minimumEvidenceLevel: 'EVIDENCE_BASED',

  execute: async (context: InstitutionalContext): Promise<EngineExecutionResult> => {
    try {
      const allHistoryData = context.input.rawFinancialData?.allHistoryData || [];
      const filterYear = Number(context.input.rawFinancialData?.filterYear || context.input.rawFinancialData?.year || new Date().getFullYear());
      const historicalCyclesCount = context.input.historicalCyclesCount ?? 1;

      // Downstream inferences
      const dfcInference = context.inferences['LegacyDFCAdapter'];
      const financialInference = context.inferences['LegacyFinancialAdapter'];
      const dreInference = context.inferences['LegacyDREAdapter'];
      const stressInference = context.inferences['StressTestAdapter'];
      const eneInference = context.inferences['EconomicNormalizationAdapter'];
      const imeInference = context.inferences['InstitutionalMemoryEngine'];
      const brmInference = context.inferences['BoardRiskMatrixAdapter'];

      // Extraction of indicators
      const bpSummary = financialInference?.metrics?.bpSummary || {};
      const dreMetrics = dreInference?.metrics || {};
      const dfcMetrics = dfcInference?.metrics || {};
      const fiduciaryMetrics = dfcInference?.metrics?.fiduciary || {};
      const eneMetrics = eneInference?.metrics || {};
      const imeMetrics = imeInference?.metrics || {};
      const brmMetrics = brmInference?.metrics || {};

      const cqs = fiduciaryMetrics.cashQuality?.score ?? 70;
      const eqs = fiduciaryMetrics.earningsQuality?.score ?? 70;
      const brmScore = brmMetrics.boardRiskScore ?? 70;
      const imsScore = imeMetrics.imsScore ?? 70;
      const advisoryScore = imeMetrics.advisoryScore ?? 70;

      const fco = dfcMetrics.fco ?? 0;
      const ebitda = dreMetrics.ebitda || context.input.rawFinancialData?.ebitda || 0;
      const netRevenue = dreMetrics.recLiquida || context.input.rawFinancialData?.netRevenue || context.input.rawFinancialData?.receitaLiquida || 0;
      const shortTermDebt = bpSummary.shortTermDebt ?? bpSummary.passivosFinanceiros ?? 0;
      const cash = bpSummary.caixaEquivalentes ?? bpSummary.disponibilidades ?? 0;
      const passivoCirculante = bpSummary.passivoCirculante ?? 0;
      const passivoTotal = bpSummary.passivoTotal ?? 1;
      const ativoCirculante = bpSummary.ativoCirculante ?? 0;
      const patrimonioLiquido = bpSummary.patrimonioLiquido ?? 0;
      const passivosSocietarios = bpSummary.passivosSocietarios ?? 0;
      const netDebt = bpSummary.netDebt ?? Math.max(0, (bpSummary.passivosFinanceiros ?? 0) - cash);

      const fcoOperacionalReal = fiduciaryMetrics.fcoOperacionalReal ?? fco;
      const runway = fiduciaryMetrics.runway ?? 12;
      const varConciliacao = Math.abs(fcoOperacionalReal - fco);
      const intensityRelatedParties = fiduciaryMetrics.intensidadePartesRelacionadas ?? 0;

      const isEarlyStage = historicalCyclesCount < 3;

      // ── 1. DYNAMIC COVENANTS INITIALIZATION ──
      const overrides = context.input.rawFinancialData?.covenantOverrides || {};
      const covenantThresholds = {
        maxNetDebtEbitda: overrides.maxNetDebtEbitda ?? 3.5,
        minDscr: overrides.minDscr ?? 1.2,
        minLiquidityStDebt: overrides.minLiquidityStDebt ?? 0.20,
        minRunway: overrides.minRunway ?? 6,
        minEbitdaCoverage: overrides.minEbitdaCoverage ?? 1.5
      };

      // ── 2. FORWARD TREASURY ENGINE (FTE) ──
      // Default parameters for the 5 scenarios
      const scenarioParams: Record<string, { revMult: number; marginMult: number; recDelayDays: number; interestMult: number; supplierMult: number; description: string }> = {
        'Base Institutional Scenario': { revMult: 1.0, marginMult: 1.0, recDelayDays: 0, interestMult: 1.0, supplierMult: 1.0, description: 'stable parameters' },
        'Conservative Treasury Scenario': { revMult: 0.90, marginMult: 0.95, recDelayDays: 10, interestMult: 1.10, supplierMult: 0.95, description: 'moderate stress' },
        'EBITDA Compression Scenario': { revMult: 0.80, marginMult: 0.85, recDelayDays: 20, interestMult: 1.25, supplierMult: 0.90, description: 'high compression' },
        'Refinancing Shock Scenario': { revMult: 0.65, marginMult: 0.70, recDelayDays: 40, interestMult: 1.50, supplierMult: 0.80, description: 'liquidity squeeze' },
        'Combined Institutional Stress Scenario': { revMult: 1.15, marginMult: 1.10, recDelayDays: 0, interestMult: 1.0, supplierMult: 1.05, description: 'recovery & healing' }
      };

      // Project trajectory loop (12 months)
      const projectTrajectory = (scenarioName: string) => {
        const params = scenarioParams[scenarioName] || { revMult: 1.0, marginMult: 1.0, recDelayDays: 0, interestMult: 1.0, supplierMult: 1.0, description: 'Base' };
        const trajectoryPoints: any[] = [];
        const breaches: string[] = [];
        const cascadeLogs: string[] = [];

        let currentCash = cash;
        let currentDebt = shortTermDebt;
        const baseMonthlyEbitda = (ebitda / 12);
        const baseMonthlyFco = (fcoOperacionalReal / 12);

        for (let t = 1; t <= 12; t++) {
          // Stability Guard: Max depth of covenant cascade propagation is 5
          let cascadeDepth = 0;
          let interestSurcharge = 1.0;
          let supplierTermsSqueeze = 1.0;
          let creditCutAmount = 0;

          // Cascade evaluation
          const runwayBreach = t > 1 && trajectoryPoints[t-2]?.runway < covenantThresholds.minRunway;
          const dscrBreach = t > 1 && trajectoryPoints[t-2]?.dscr < covenantThresholds.minDscr;
          const liqBreach = t > 1 && trajectoryPoints[t-2]?.liquidityStDebt < covenantThresholds.minLiquidityStDebt;

          if (runwayBreach && cascadeDepth < 5) {
            interestSurcharge *= 1.30;
            supplierTermsSqueeze *= 0.90;
            cascadeDepth++;
            if (t === 2) cascadeLogs.push('Runway breach -> Refinancing cost +30%, Supplier terms -10%');
          }
          if (dscrBreach && cascadeDepth < 5) {
            creditCutAmount += currentDebt * 0.10 / 12; // Forced amortizations
            cascadeDepth++;
            if (t === 2) cascadeLogs.push('DSCR breach -> Credit cut 10% YoY');
          }
          if (liqBreach && cascadeDepth < 5) {
            interestSurcharge *= 1.20;
            cascadeDepth++;
            if (t === 2) cascadeLogs.push('Liquidity breach -> Refinancing surcharge +20%');
          }

          // Calculate step inputs
          const projectedEbitda = baseMonthlyEbitda * params.revMult * params.marginMult;
          const interestPayment = currentDebt * (0.12 / 12) * params.interestMult * interestSurcharge;
          
          let projectedFco = baseMonthlyFco * params.revMult * params.marginMult - interestPayment - creditCutAmount;
          
          // Receivables delay impact (applied in initial cycles)
          const receivablesImpact = (netRevenue / 12) * (params.recDelayDays / 30) * (t <= 2 ? 0.5 : 0);
          
          // Floor cash at zero
          currentCash = Math.max(0, currentCash + projectedFco - receivablesImpact);
          currentDebt = Math.max(0, currentDebt + creditCutAmount * 0.5);

          // Stop recursive cascade if threshold is breached (cash floor reached)
          if (currentCash <= 0) {
            projectedFco = 0;
          }

          // Ratios calculations
          let ndEbitda: number | string = 'NOT_COMPUTABLE';
          if (projectedEbitda * 12 > 0) {
            ndEbitda = Number((Math.max(0, currentDebt - currentCash) / (projectedEbitda * 12)).toFixed(2));
          } else {
            ndEbitda = currentDebt > 0 ? 'BREACHED' : 'NOT_COMPUTABLE';
          }

          const dscr = Number((projectedFco * 12 / Math.max(1, currentDebt)).toFixed(2));
          const liqRatio = Number((currentCash / Math.max(1, currentDebt)).toFixed(2));
          const runwayStep = projectedFco < 0 ? Number((currentCash / Math.abs(projectedFco)).toFixed(1)) : 12;
          const ebitdaCoverage = Number(((projectedEbitda * 12) / Math.max(1, currentDebt * 0.1)).toFixed(2));

          trajectoryPoints.push({
            month: t,
            cash: Math.round(currentCash),
            debt: Math.round(currentDebt),
            ebitda: Math.round(projectedEbitda * 12),
            fco: Math.round(projectedFco * 12),
            netDebtEbitda: ndEbitda,
            dscr,
            liquidityStDebt: liqRatio,
            runway: runwayStep,
            ebitdaCoverage
          });
        }

        // Evaluate breaches on the final step
        const lastStep = trajectoryPoints[11];
        if (typeof lastStep.netDebtEbitda === 'number' && lastStep.netDebtEbitda > covenantThresholds.maxNetDebtEbitda) {
          breaches.push(`Net Debt / EBITDA: ${lastStep.netDebtEbitda}x (Limit: ${covenantThresholds.maxNetDebtEbitda}x)`);
        } else if (lastStep.netDebtEbitda === 'BREACHED') {
          breaches.push('Net Debt / EBITDA: EBITDA <= 0 with positive debt');
        }
        if (lastStep.dscr < covenantThresholds.minDscr) {
          breaches.push(`DSCR: ${lastStep.dscr}x (Limit: ${covenantThresholds.minDscr}x)`);
        }
        if (lastStep.liquidityStDebt < covenantThresholds.minLiquidityStDebt) {
          breaches.push(`Liquidity / ST Debt: ${lastStep.liquidityStDebt}x (Limit: ${covenantThresholds.minLiquidityStDebt}x)`);
        }
        if (lastStep.runway < covenantThresholds.minRunway) {
          breaches.push(`Runway: ${lastStep.runway} months (Limit: ${covenantThresholds.minRunway} months)`);
        }
        if (lastStep.ebitdaCoverage < covenantThresholds.minEbitdaCoverage) {
          breaches.push(`EBITDA Coverage: ${lastStep.ebitdaCoverage}x (Limit: ${covenantThresholds.minEbitdaCoverage}x)`);
        }

        return {
          name: scenarioName,
          assumptions: params.description,
          trajectory: trajectoryPoints,
          breaches,
          cascadeLogs
        };
      };

      const scenario1 = projectTrajectory('Base Institutional Scenario');
      const scenario2 = projectTrajectory('Conservative Treasury Scenario');
      const scenario3 = projectTrajectory('EBITDA Compression Scenario');
      const scenario4 = projectTrajectory('Refinancing Shock Scenario');
      const scenario5 = projectTrajectory('Combined Institutional Stress Scenario');

      const stressScenarios = [scenario1, scenario2, scenario3, scenario4, scenario5];

      // ── 3. COVENANT CASCADE PROPAGATION ANALYSIS ──
      const activeCascadeLogs = scenario4.cascadeLogs; // Refinancing shock is representative of cascade contagion

      // ── 4. RECOVERY MOMENTUM VECTOR ──
      // Evaluate operational healing acceleration
      let recoveryMomentum: 'ACCELERATING_RECOVERY' | 'STABILIZING_RECOVERY' | 'VOLATILE_RECOVERY' | 'STALLED_RECOVERY' | 'DETERIORATING' = 'STABILIZING_RECOVERY';
      if (ebitda > 0 && fcoOperacionalReal > 0) {
        recoveryMomentum = 'ACCELERATING_RECOVERY';
      } else if (ebitda < 0 && fcoOperacionalReal < 0) {
        recoveryMomentum = 'DETERIORATING';
      } else if (Math.abs(ebitda - fcoOperacionalReal) > 0.3 * netRevenue) {
        recoveryMomentum = 'VOLATILE_RECOVERY';
      } else {
        recoveryMomentum = 'STALLED_RECOVERY';
      }

      // ── 5. FUNDING GAP SIMULATOR ──
      // Calculate liquidity gap to restore target liquidity (minLiquidityStDebt * ST Debt) at 30d, 90d, 180d, 360d under Stress Case
      const stressTrajectory = scenario3.trajectory;
      const getFundingGap = (monthIdx: number): number => {
        const point = stressTrajectory[monthIdx];
        if (!point) return 0;
        const targetLiquidity = covenantThresholds.minLiquidityStDebt * point.debt;
        return Math.max(0, Math.round(targetLiquidity - point.cash));
      };

      const fundingGapTimeline = {
        '30d': getFundingGap(0),   // month 1
        '90d': getFundingGap(2),   // month 3
        '180d': getFundingGap(5),  // month 6
        '360d': getFundingGap(11)  // month 12
      };

      // ── 6. HISTORICAL YOY FRACTURE DETECTION (WITH SHIELDS) ──
      // Helpers to pull YoY metrics from history
      const getHistoryVal = (year: number, keywords: string[]): number => {
        const entries = allHistoryData.filter((d: any) => Number(d.year) === year);
        const match = entries.find((d: any) => {
          const cat = (d.category || d.conta || d.categoryName || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          return keywords.some(kw => cat.includes(kw));
        });
        return match?.val || match?.valor || match?.value || 0;
      };

      const ebitdaPrev = getHistoryVal(filterYear - 1, ['ebitda']);
      const fcoPrev = getHistoryVal(filterYear - 1, ['fluxo de caixa das atividades operacionais', 'fco', 'caixa operacional']);
      const runwayPrev = getHistoryVal(filterYear - 1, ['runway']);
      const revenuePrev = getHistoryVal(filterYear - 1, ['receita liquida', 'faturamento liquido', 'rec liquida']);
      const profitPrev = getHistoryVal(filterYear - 1, ['lucro liquido', 'resultado liquido', 'prejuizo']);
      const relatedPartyPrev = getHistoryVal(filterYear - 1, ['mutuo', 'partes relacionadas', 'socios']);
      const suppliersPrev = getHistoryVal(filterYear - 1, ['fornecedores', 'contas a pagar']);

      const fractures: { code: string; name: string; active: boolean; waived: boolean; rationale: string }[] = [];

      // Shields/Waivers trigger checks
      const capexExpansionActive = !!context.input.rawFinancialData?.capexExpansionActive;
      const restructuringActive = !!context.input.rawFinancialData?.restructuringActive;
      const acquisitionCycleActive = !!context.input.rawFinancialData?.acquisitionCycleActive;
      const industrialMaturationActive = !!context.input.rawFinancialData?.industrialMaturationActive;
      const hasActiveShield = capexExpansionActive || restructuringActive || acquisitionCycleActive || industrialMaturationActive;

      if (historicalCyclesCount >= 2) {
        // Pattern 1: EBITDA grows but FCO falls
        const p1Active = ebitda > ebitdaPrev && fcoOperacionalReal < fcoPrev;
        fractures.push({
          code: 'FRACTURE_COSMETIC_EBITDA',
          name: 'Cosmetic EBITDA Margin Distortion',
          active: p1Active,
          waived: p1Active && hasActiveShield,
          rationale: 'EBITDA shows positive YoY trajectory, but real operational cash generation deteriorates.'
        });

        // Pattern 2: Revenue grows but Runway falls
        const p2Active = netRevenue > revenuePrev && runway < runwayPrev;
        fractures.push({
          code: 'FRACTURE_BURN_SCALING',
          name: 'Destructive Over-Trading Burn',
          active: p2Active,
          waived: p2Active && hasActiveShield,
          rationale: 'Scale revenue expands, but short-term cash runway is eroded rapidly.'
        });

        // Pattern 3: Profit grows but related party dependency increases
        const p3Active = profitPrev < (dreMetrics.lucroLiq ?? 0) && intensityRelatedParties > 0.2;
        fractures.push({
          code: 'FRACTURE_SOCIETARY_DEPENDENCY',
          name: 'Societary Reinvestment Dependency',
          active: p3Active,
          waived: p3Active && hasActiveShield,
          rationale: 'Accounting earnings show improvement, but rely heavily on related party financial support.'
        });

        // Pattern 4: EBITDA margin improves but Working Capital requirements explode
        const currentMargin = netRevenue > 0 ? (ebitda / netRevenue) : 0;
        const prevMargin = revenuePrev > 0 ? (ebitdaPrev / revenuePrev) : 0;
        const p4Active = currentMargin > prevMargin && (bpSummary.ativoCirculante ?? 0) > (getHistoryVal(filterYear - 1, ['ativo circulante']) || 0) * 1.3;
        fractures.push({
          code: 'FRACTURE_WC_OVERLOAD',
          name: 'Working Capital Cycle Squeeze',
          active: p4Active,
          waived: p4Active && hasActiveShield,
          rationale: 'Operating margins improve, but balance sheet liquidity is locked up in working capital.'
        });

        // Pattern 5: OCF drops but accounts payable to suppliers increases
        const p5Active = fcoOperacionalReal < fcoPrev && (bpSummary.fornecedores ?? bpSummary.contasAPagar ?? 0) > suppliersPrev * 1.2;
        fractures.push({
          code: 'FRACTURE_SUPPLIER_FINANCED',
          name: 'Supplier-Financed Liquidity Spiral',
          active: p5Active,
          waived: p5Active && hasActiveShield,
          rationale: 'Real cash flow drops, while accounts payable terms are extended artificially.'
        });
      }

      // ── 7. DOMAIN SCORING & ADJUSTMENTS ──
      // Domain 1: Treasury Financeability (25%)
      let treasuryCredit = 100;
      if (cqs < 70) treasuryCredit -= 20;
      if (runway < covenantThresholds.minRunway) treasuryCredit -= 25;
      if (fcoOperacionalReal < 0) treasuryCredit -= 20;
      if (shortTermDebt > cash) treasuryCredit -= 15;
      if (isEarlyStage) treasuryCredit = Math.max(40, treasuryCredit); // Capped minimum
      treasuryCredit = Math.max(0, treasuryCredit);

      // Domain 2: Earnings Financeability (20%)
      let earningsCredit = 100;
      if (eqs < 70) earningsCredit -= 20;
      if (ebitda < 0) earningsCredit -= 25;
      if (eneMetrics.stability?.ebitdaVol > 20) earningsCredit -= 15;
      if (eneMetrics.receitasNaoRecorrentes > 0.15 * Math.abs(ebitda || 1)) earningsCredit -= 15;
      if (isEarlyStage) earningsCredit = Math.max(40, earningsCredit);
      earningsCredit = Math.max(0, earningsCredit);

      // Domain 3: Capital Structure Sustainability (20%)
      let capitalCredit = 100;
      if (ebitda <= 0 || netDebt / Math.max(1, ebitda) > covenantThresholds.maxNetDebtEbitda) {
        capitalCredit -= 25;
      }
      if (shortTermDebt > 0.5 * (shortTermDebt + (bpSummary.passivosFinanceirosNaoCirculantes || 0))) {
        capitalCredit -= 15;
      }
      if (passivosSocietarios > 0.15 * (patrimonioLiquido + passivoCirculante)) {
        capitalCredit -= 15;
      }
      if (isEarlyStage) capitalCredit = Math.max(40, capitalCredit);
      capitalCredit = Math.max(0, capitalCredit);

      // Domain 4: Governance & Fiduciary Reliability (15%)
      let governanceCredit = 100;
      if (brmScore < 70) governanceCredit -= 20;
      if (imeMetrics.advisoryScore < 70) governanceCredit -= 20;
      if (varConciliacao > 0.05 * (netRevenue || 1)) {
        governanceCredit -= 15;
      }
      if (isEarlyStage) governanceCredit = Math.max(40, governanceCredit);
      governanceCredit = Math.max(0, governanceCredit);

      // Domain 5: Longitudinal Stability (10%)
      let longitudinalCredit = 100;
      const trajectory = imeMetrics.trajectoryClassification || 'VOLATILE';
      if (trajectory === 'DETERIORATING' || trajectory === 'STRUCTURALLY_FRAGILE') {
        longitudinalCredit -= 30;
      }
      if (imeMetrics.domains?.drift?.score < 70) {
        longitudinalCredit -= 20;
      }
      if (isEarlyStage) longitudinalCredit = Math.max(40, longitudinalCredit);
      longitudinalCredit = Math.max(0, longitudinalCredit);

      // Domain 6: Covenant Resilience (10%)
      let covenantCredit = 100 - (scenario4.breaches.length * 20); // evaluated on refinancing shock scenario
      covenantCredit = Math.max(0, covenantCredit);

      // Apply Fracture Deductions (Phase 1 calibration: reduction by 70% if waived)
      fractures.forEach(f => {
        if (f.active) {
          const deduction = f.waived ? 5 : 15; // 15 points normal deduction, 5 points if waived
          treasuryCredit = Math.max(0, treasuryCredit - deduction);
          earningsCredit = Math.max(0, earningsCredit - deduction);
        }
      });

      // ── 8. COMPOSITE CREDIT SCORE (CCS) ──
      const ccsScore = Math.round(
        (treasuryCredit * 0.25) +
        (earningsCredit * 0.20) +
        (capitalCredit * 0.20) +
        (governanceCredit * 0.15) +
        (longitudinalCredit * 0.10) +
        (covenantCredit * 0.10)
      );

      let creditReadinessLevel = 'Transitional Credit Consistency';
      if (ccsScore >= 85) creditReadinessLevel = 'Institutional Credit Grade';
      else if (ccsScore >= 70) creditReadinessLevel = 'Financeable Structure';
      else if (ccsScore >= 50) creditReadinessLevel = 'Restricted Credit Structure';
      else if (ccsScore >= 30) creditReadinessLevel = 'Fragile Funding Structure';
      else creditReadinessLevel = 'Critical Credit Risk';

      const mapGrade = (score: number) => score >= 85 ? 'A' : score >= 70 ? 'B' : score >= 50 ? 'C' : score >= 30 ? 'D' : 'E';
      const institutionalFundingGrade = mapGrade(ccsScore);
      const treasuryFundingGrade = mapGrade(treasuryCredit);
      const covenantResilienceGrade = mapGrade(covenantCredit);

      // ── 9. COMBINED GATING LOGIC FOR CREDIT DECISION ──
      let creditDecisionSimulation: 'APPROVED' | 'APPROVED_WITH_RESTRICTIONS' | 'CONDITIONAL_APPROVAL' | 'HIGH_MONITORING_REQUIRED' | 'RESTRICTED_CREDIT' | 'DECLINED' = 'DECLINED';
      
      if (ccsScore >= 90) creditDecisionSimulation = 'APPROVED';
      else if (ccsScore >= 80) creditDecisionSimulation = 'APPROVED_WITH_RESTRICTIONS';
      else if (ccsScore >= 70) creditDecisionSimulation = 'CONDITIONAL_APPROVAL';
      else if (ccsScore >= 50) creditDecisionSimulation = 'HIGH_MONITORING_REQUIRED';
      else if (ccsScore >= 30) creditDecisionSimulation = 'RESTRICTED_CREDIT';
      else creditDecisionSimulation = 'DECLINED';

      // Gating constraints
      const hasCovenantBreach = scenario4.breaches.length > 0;
      if (hasCovenantBreach) {
        if (creditDecisionSimulation === 'APPROVED') {
          creditDecisionSimulation = 'APPROVED_WITH_RESTRICTIONS';
        } else if (creditDecisionSimulation === 'APPROVED_WITH_RESTRICTIONS') {
          creditDecisionSimulation = 'CONDITIONAL_APPROVAL';
        }
      }

      if (cqs < 50 || runway < 6) {
        if (creditDecisionSimulation === 'APPROVED' || creditDecisionSimulation === 'APPROVED_WITH_RESTRICTIONS' || creditDecisionSimulation === 'CONDITIONAL_APPROVAL') {
          creditDecisionSimulation = 'HIGH_MONITORING_REQUIRED';
        }
        if (ebitda < 0 || runway <= 3) {
          if (creditDecisionSimulation !== 'DECLINED') {
            creditDecisionSimulation = 'RESTRICTED_CREDIT';
          }
        }
      }

      if (trajectory === 'STRUCTURALLY_FRAGILE' || trajectory === 'DETERIORATING') {
        if (creditDecisionSimulation !== 'DECLINED') {
          creditDecisionSimulation = 'RESTRICTED_CREDIT';
        }
      }

      // Early stage protection must not force approval but must block absolute rejection
      if (isEarlyStage && creditDecisionSimulation === 'DECLINED') {
        creditDecisionSimulation = 'RESTRICTED_CREDIT';
      }

      // Fracture Hard Gate: if any active, non-waived fracture exists, cap decision at RESTRICTED_CREDIT
      const hasActiveUnwaivedFracture = fractures.some(f => f.active && !f.waived);
      if (hasActiveUnwaivedFracture) {
        if (creditDecisionSimulation !== 'DECLINED') {
          creditDecisionSimulation = 'RESTRICTED_CREDIT';
        }
      }

      let suggestedCreditRating = 'High Distress';
      if (ccsScore >= 90) suggestedCreditRating = 'AA Institutional';
      else if (ccsScore >= 80) suggestedCreditRating = 'A Institutional';
      else if (ccsScore >= 70) suggestedCreditRating = 'BBB';
      else if (ccsScore >= 60) suggestedCreditRating = 'BB';
      else if (ccsScore >= 50) suggestedCreditRating = 'B';
      else if (ccsScore >= 30) suggestedCreditRating = 'CCC';
      else suggestedCreditRating = 'High Distress';

      // ── 10. CREDIT CONFIDENCE LEVEL WITH DEGRADATION ──
      let institutionalCreditConfidence: 'HIGH_CONFIDENCE' | 'MODERATE_CONFIDENCE' | 'LOW_CONFIDENCE' = 'HIGH_CONFIDENCE';
      let confidenceLevelValue = 3; // 3 = High, 2 = Mod, 1 = Low

      // historical cycles degradation
      if (historicalCyclesCount < 2) {
        confidenceLevelValue = 1;
      } else if (historicalCyclesCount <= 3) {
        confidenceLevelValue = 2;
      }

      // other degradation factors
      const hasReconstruction = varConciliacao > 0.05 * (netRevenue || 1);
      const isHighlyVolatile = (eneMetrics.stability?.ebitdaVol ?? 0) > 20;
      const governanceFragile = brmScore < 70 || advisoryScore < 70;
      const relatedPartyExposure = intensityRelatedParties > 0.2;

      if (hasReconstruction) confidenceLevelValue = Math.max(1, confidenceLevelValue - 1);
      if (isHighlyVolatile) confidenceLevelValue = Math.max(1, confidenceLevelValue - 1);
      if (governanceFragile) confidenceLevelValue = Math.max(1, confidenceLevelValue - 1);
      if (relatedPartyExposure) confidenceLevelValue = Math.max(1, confidenceLevelValue - 1);

      if (confidenceLevelValue === 1) {
        institutionalCreditConfidence = 'LOW_CONFIDENCE';
      } else if (confidenceLevelValue === 2) {
        institutionalCreditConfidence = 'MODERATE_CONFIDENCE';
      } else {
        institutionalCreditConfidence = 'HIGH_CONFIDENCE';
      }

      const refinancingRiskLevel = shortTermDebt > cash ? 'CRITICAL' : shortTermDebt > 0.5 * cash ? 'HIGH' : 'LOW';
      const bankingExposureLevel = netDebt > 3.0 * ebitda ? 'HIGH' : 'LOW';

      // ── 11. WARNINGS & ALERTS ──
      const alerts: string[] = [];
      if (runway < 6) {
        alerts.push('Treasury survivability demonstrates elevated funding fragility.');
      }
      if (ebitda > 0 && fcoOperacionalReal < 0) {
        alerts.push('Profitability demonstrates weak treasury conversion support.');
      }
      if (shortTermDebt > 0.5 * cash) {
        alerts.push('Institutional structure demonstrates elevated refinancing dependency.');
      }
      if (imeMetrics.advisoryScore < 70) {
        alerts.push('Governance recurrence may restrict institutional credit confidence.');
      }
      if (scenario4.breaches.length > 0) {
        alerts.push('Simulated stress conditions indicate elevated covenant sensitivity.');
      }

      // Add Fracture Alerts
      fractures.forEach(f => {
        if (f.active) {
          if (f.waived) {
            alerts.push(`[WAIVED] ${f.name}: Operational transition pattern observed but waived due to expansion/restructuring status.`);
          } else {
            alerts.push(`[FRACTURE] ${f.name}: Active structural distortion observed: ${f.rationale}`);
          }
        }
      });

      // ── 12. NARRATIVE GUARDS AND SANITIZATION ──
      const sanitizeNarrative = (text: string): string => {
        if (!text) return '';
        let clean = text;
        const forbidden = [
          { pattern: /bankruptcy/gi, replacement: 'elevated funding sensitivity' },
          { pattern: /falência/gi, replacement: 'sensibilidade de captação elevada' },
          { pattern: /fraud/gi, replacement: 'governance inconsistency' },
          { pattern: /fraude/gi, replacement: 'inconsistência de governança' },
          { pattern: /unfinanceable/gi, replacement: 'restricted credit readiness' },
          { pattern: /inavegável/gi, replacement: 'elegibilidade restrita a crédito' },
          { pattern: /terminal insolvency/gi, replacement: 'refinancing dependency' },
          { pattern: /insolvência terminal/gi, replacement: 'dependência de refinanciamento' },
          { pattern: /irreversible default/gi, replacement: 'treasury fragility' },
          { pattern: /inadimplemento irreversível/gi, replacement: 'fragilidade de tesouraria' }
        ];
        forbidden.forEach(rule => {
          clean = clean.replace(rule.pattern, rule.replacement);
        });
        return clean;
      };

      let diagnostic = `A atratividade a crédito institucional apresenta score CCS de ${ccsScore}/100 (${creditReadinessLevel}), com decisão de ${creditDecisionSimulation} e rating ${suggestedCreditRating}.`;
      if (isEarlyStage) {
        diagnostic += ` Contexto de ramping inicial de capital e atenuação de sensibilidades creditícias ativo.`;
      }
      if (hasActiveShield) {
        diagnostic += ` Transição operacional e salvaguardas de expansão ativas.`;
      }
      diagnostic = sanitizeNarrative(diagnostic);

      const narrative: AdvisoryNarrative = {
        diagnostic,
        cause: hasCovenantBreach ? 'Quebras simuladas de covenant sob cenários de estresse de capital.' : 'Estrutura patrimonial e cobertura de serviço da dívida sob conformidade fiduciária.',
        consequence: ccsScore < 50 ? 'Restrição de linhas de capital e agravamento da fragilidade sob estresse.' : 'Manutenção da elegibilidade regular de funding estratégico.',
        sensitivity: isEarlyStage ? 'Atenuado sob escala inicial' : 'Consolidado sob base temporal multi-ciclo',
        risk: ccsScore < 50 ? 'Presença de risco de rolagem' : 'Risco sob controle fiduciário',
        priority: 'Ajustar cobertura de juros operacionais e mitigar vencimentos de curto prazo.',
        strategicMovement: 'Refinanciamento planejado e alongamento do passivo financeiro.'
      };

      const auditability = {
        ccsScore,
        creditReadinessLevel,
        creditDecisionSimulation,
        covenantThresholds,
        reconciliationTrace: `Treasury: ${treasuryCredit.toFixed(0)} | Earnings: ${earningsCredit.toFixed(0)} | Capital: ${capitalCredit.toFixed(0)} | Governance: ${governanceCredit.toFixed(0)}`,
        fiduciaryRationale: 'CCS avalia a atratividade do crédito a partir da estrutura normalizada real YoY e covenants dinâmicos sob stress.',
        reconstructionLogic: 'CCS = (Treasury * 0.25) + (Earnings * 0.20) + (Capital * 0.20) + (Governance * 0.15) + (Longitudinal * 0.10) + (Covenant * 0.10)',
        activeShields: { capexExpansionActive, restructuringActive, acquisitionCycleActive, industrialMaturationActive }
      };

      const heatmaps = {
        covenantStress: stressScenarios.map(s => ({ scenario: s.name, breachesCount: s.breaches.length })),
        treasuryFunding: stressScenarios.map(s => ({ scenario: s.name, score: s.name === 'Base Institutional Scenario' ? treasuryCredit : Math.max(0, treasuryCredit - 25) })),
        refinancingDependency: stressScenarios.map(s => ({ scenario: s.name, score: s.name === 'Refinancing Shock Scenario' ? Math.max(0, capitalCredit - 30) : capitalCredit })),
        governanceReliability: stressScenarios.map(s => ({ scenario: s.name, score: governanceCredit })),
        institutionalStability: stressScenarios.map(s => ({ scenario: s.name, score: longitudinalCredit }))
      };

      // ── 13. SCENARIO DELTA COMPARISON ──
      // Calculate deltas relative to Base Scenario point-by-point
      const baseTrajectory = scenario1.trajectory;
      const getDeltaComparison = (otherScenario: any) => {
        const otherTrajectory = otherScenario.trajectory;
        return baseTrajectory.map((basePt, idx) => {
          const otherPt = otherTrajectory[idx];
          return {
            month: basePt.month,
            cashDelta: otherPt.cash - basePt.cash,
            liquidityDelta: Number((otherPt.liquidityStDebt - basePt.liquidityStDebt).toFixed(2)),
            dscrDelta: Number((otherPt.dscr - basePt.dscr).toFixed(2))
          };
        });
      };

      const deltas = {
        conservative: getDeltaComparison(scenario2),
        stress: getDeltaComparison(scenario3),
        severeStress: getDeltaComparison(scenario4),
        recovery: getDeltaComparison(scenario5)
      };

      const inference: InferenceBlock = {
        domain: 'credit_simulation',
        metrics: {
          ccsScore,
          creditReadinessLevel,
          suggestedCreditRating,
          creditDecisionSimulation,
          institutionalFundingGrade,
          treasuryFundingGrade,
          covenantResilienceGrade,
          institutionalCreditConfidence,
          refinancingRiskLevel,
          bankingExposureLevel,
          covenantThresholds,
          recoveryMomentum,
          fundingGapTimeline,
          fractures,
          activeShields: { capexExpansionActive, restructuringActive, acquisitionCycleActive, industrialMaturationActive },
          domains: {
            treasury: { score: treasuryCredit },
            earnings: { score: earningsCredit },
            capital: { score: capitalCredit },
            governance: { score: governanceCredit },
            longitudinal: { score: longitudinalCredit },
            covenant: { score: covenantCredit }
          },
          alerts,
          stressScenarios,
          heatmaps,
          deltas,
          auditability,
          isEarlyStage
        },
        causality: [],
        narrative,
        confidence: institutionalCreditConfidence === 'HIGH_CONFIDENCE' ? 'HIGH' : 'LOW',
        evidenceLevel: 'EVIDENCE_BASED',
        score: ccsScore
      };

      return {
        engineName: 'CreditCommitteeSimulatorEngine',
        success: true,
        confidence: institutionalCreditConfidence === 'HIGH_CONFIDENCE' ? 'HIGH' : 'LOW',
        inference,
        violations: undefined
      };

    } catch (e: any) {
      return {
        engineName: 'CreditCommitteeSimulatorEngine',
        success: false,
        confidence: 'LOW',
        violations: [{
          rule: 'ccs_engine_error',
          severity: 'CRITICAL',
          message: `Erro ao processar Credit Committee Simulator Engine: ${e.message}`,
          blocked: true
        }]
      };
    }
  }
};
