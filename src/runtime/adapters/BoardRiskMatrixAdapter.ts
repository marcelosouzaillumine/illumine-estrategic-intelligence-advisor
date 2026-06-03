import { EngineDefinition, InstitutionalContext, EngineExecutionResult, InferenceBlock, CausalityChain, AdvisoryNarrative } from '../types';
import { InstitutionalSurvivabilityEngine } from '../../core/runtime/decision-intelligence/InstitutionalSurvivabilityEngine';

export const BoardRiskMatrixAdapter: EngineDefinition = {
  name: 'BoardRiskMatrixAdapter',
  priority: 60,
  dependencies: ['LegacyFinancialAdapter', 'LegacyDREAdapter', 'LegacyDFCAdapter', 'StressTestAdapter'],
  requiredData: ['rawFinancialData'],
  inferenceScope: 'Matriz de Risco (Board Risk Matrix)',
  minimumEvidenceLevel: 'Balanço Patrimonial básico',
  execute: async (context: InstitutionalContext): Promise<EngineExecutionResult> => {
    try {
      const dfcInference = context.inferences['LegacyDFCAdapter'];
      const financialInference = context.inferences['LegacyFinancialAdapter'];
      const dreInference = context.inferences['LegacyDREAdapter'];
      const stressInference = context.inferences['StressTestAdapter'];

      // Fallbacks
      const cqs = dfcInference?.metrics?.fiduciary?.cashQuality?.score ?? 70;
      const eqs = dfcInference?.metrics?.fiduciary?.earningsQuality?.score ?? 70;

      // Extract variables for calculations
      const input = context.input.rawFinancialData || {};
      const filterYear = Number(input.filterYear || input.year || new Date().getFullYear());
      const allHistoryData = input.allHistoryData || [];

      const bpSummary = financialInference?.metrics?.bpSummary || {};
      const passivoCirculante = bpSummary.passivoCirculante ?? 0;
      const passivoNaoCirculante = bpSummary.passivoNaoCirculante ?? 0;
      const passivoTotal = bpSummary.passivoTotal ?? 1;
      const patrimonioLiquido = bpSummary.patrimonioLiquido ?? 0;
      const ativoCirculante = bpSummary.ativoCirculante ?? 0;
      const ativoTotal = bpSummary.ativoTotal ?? 1;
      const passivosFinanceiros = bpSummary.passivosFinanceiros ?? 0;

      const dreMetrics = dreInference?.metrics || {};
      const ebitda = dreMetrics.ebitda ?? 0;
      const netRevenue = dreMetrics.recLiquida ?? 0;
      const lucroLiquido = dreMetrics.lucroLiq ?? 0;

      const dfcMetrics = dfcInference?.metrics || {};
      const fco = dfcMetrics.fco ?? 0;
      
      const fiduciaryMetrics = dfcInference?.metrics?.fiduciary || {};
      const fcoOperacionalReal = fiduciaryMetrics.fcoOperacionalReal ?? 0;
      const runway = fiduciaryMetrics.runway ?? 12;
      const intensidadePartesRelacionadas = fiduciaryMetrics.intensidadePartesRelacionadas ?? 0;
      const fluxoPartesRelacionadas = fiduciaryMetrics.fluxoPartesRelacionadas ?? 0;
      const saidasParaPartesRelacionadasAbs = Math.abs(fluxoPartesRelacionadas);
      const varConciliacao = Math.abs(fcoOperacionalReal - fco);
      const governanceWarnings = fiduciaryMetrics.governanceWarnings || [];

      // 1. Operational Survivability (20%)
      // Run Survivability Engine
      const report = {
        scores: {
          financial: financialInference?.score ?? 70,
          operational: 70,
          governance: 70,
          structural: 70,
          composite: 70
        },
        ocf: fco,
        ebitda: ebitda,
        inferences: context.inferences,
        capitalGovernanceReport: {
          behavior: {
            governanceMaturity: 'MATURA',
            overallNarrative: ''
          },
          preservation: {
            preservationStatus: 'PRESERVAÇÃO_SAUDÁVEL'
          }
        },
        compliance: {
          confidenceLevel: context.globalConfidence === 'HIGH' ? 'HIGH_CONFIDENCE' : 'LOW_CONFIDENCE'
        }
      };

      const survivabilityScores = InstitutionalSurvivabilityEngine.calculate(report);
      const operationalSurvivability = survivabilityScores.operational;

      // 2. Governance Exposure (15%)
      let governanceExposureScore = 100;
      let govDeductions: string[] = [];
      if (intensidadePartesRelacionadas > 0.25) {
        governanceExposureScore -= 30;
        govDeductions.push('Shareholder dependency > 25% (-30)');
      }
      const warningDeduction = Math.min(30, governanceWarnings.length * 10);
      if (warningDeduction > 0) {
        governanceExposureScore -= warningDeduction;
        govDeductions.push(`DFC warnings count: ${governanceWarnings.length} (-${warningDeduction})`);
      }
      if (varConciliacao > 0.05 * netRevenue) {
        governanceExposureScore -= 20;
        govDeductions.push('Reconciliation variance > 5% of Net Revenue (-20)');
      }
      if (saidasParaPartesRelacionadasAbs > ebitda && ebitda > 0) {
        governanceExposureScore -= 20;
        govDeductions.push('Related-party flow > EBITDA (-20)');
      }
      governanceExposureScore = Math.max(0, governanceExposureScore);

      // 3. Capital Structure Integrity (15%)
      let capitalStructureScore = 100;
      let capDeductions: string[] = [];
      const plRatio = ativoTotal > 0 ? (patrimonioLiquido / ativoTotal) : 0;
      if (plRatio < 0.1) {
        capitalStructureScore -= 30;
        capDeductions.push('PL / Ativo Total < 10% (-30)');
      }
      const leverageRatio = ativoTotal > 0 ? (passivosFinanceiros / ativoTotal) : 0;
      if (leverageRatio > 0.5) {
        capitalStructureScore -= 25;
        capDeductions.push('Financial liabilities / Ativo Total > 50% (-25)');
      }
      const shortTermDebt = passivoCirculante > 0 ? passivosFinanceiros * (passivoCirculante / passivoTotal) : passivosFinanceiros;
      const totalDebt = passivosFinanceiros || 1;
      const stDebtRatio = shortTermDebt / totalDebt;
      if (stDebtRatio > 0.7) {
        capitalStructureScore -= 25;
        capDeductions.push('Short-term debt > 70% of total debt (-25)');
      }
      const currentRatio = passivoCirculante > 0 ? (ativoCirculante / passivoCirculante) : 0;
      if (currentRatio < 1.0) {
        capitalStructureScore -= 20;
        capDeductions.push('Current ratio < 1.0 (-20)');
      }
      capitalStructureScore = Math.max(0, capitalStructureScore);

      // 4. Institutional Stability (10%)
      const historicalCyclesCount = context.input.historicalCyclesCount ?? 1;
      const isEarlyStage = historicalCyclesCount < 3;
      let institutionalStabilityScore = 100;
      let stabilityDeductions: string[] = [];
      if (isEarlyStage) {
        institutionalStabilityScore = 80;
      } else {
        // Calculate loss years in last 3 cycles
        let lossYearsCount = 0;
        [filterYear, filterYear - 1, filterYear - 2].forEach(y => {
          const yearEntries = allHistoryData.filter((d: any) => Number(d.year) === y);
          const hasDRE = yearEntries.some((d: any) => d.type === 'dre' || d.docType === 'dre' || d.entryType === 'dre');
          if (hasDRE) {
            const yearLL = yearEntries.find((d: any) => {
              const c = (d.conta || d.category || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
              return c.includes('lucro liquido') || c.includes('resultado liquido') || c.includes('prejuizo');
            });
            const llVal = yearLL?.val || yearLL?.valor || yearLL?.value || 0;
            if (llVal < 0) {
              lossYearsCount++;
            }
          }
        });
        if (lossYearsCount > 0) {
          institutionalStabilityScore -= 20 * lossYearsCount;
          stabilityDeductions.push(`${lossYearsCount} cycles with net loss (-${20 * lossYearsCount})`);
        }

        // EBITDA margin volatility over past years
        const marginList: number[] = [];
        [filterYear, filterYear - 1, filterYear - 2].forEach(y => {
          const yearEntries = allHistoryData.filter((d: any) => Number(d.year) === y);
          const ebitdaRow = yearEntries.find((d: any) => (d.conta || d.category || '').toLowerCase().includes('ebitda'));
          const revRow = yearEntries.find((d: any) => (d.conta || d.category || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes('receita liquida'));
          const eVal = ebitdaRow?.val || ebitdaRow?.valor || ebitdaRow?.value || 0;
          const rVal = revRow?.val || revRow?.valor || revRow?.value || 0;
          if (rVal > 0) {
            marginList.push(eVal / rVal);
          }
        });
        let ebitdaVol = 0;
        if (marginList.length >= 2) {
          ebitdaVol = Math.max(...marginList) - Math.min(...marginList);
        }
        if (ebitdaVol > 0.15) {
          institutionalStabilityScore -= 20;
          stabilityDeductions.push(`EBITDA margin volatility: ${(ebitdaVol*100).toFixed(1)}% > 15% (-20)`);
        }

        if (runway < 6) {
          institutionalStabilityScore -= 20;
          stabilityDeductions.push('Runway < 6 months (-20)');
        }

        // turnaround validation (prev loss, current profit)
        const prevLL = allHistoryData.find((d: any) => Number(d.year) === filterYear - 1 && (d.conta || d.category || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes('lucro liquido'));
        const prevLLVal = prevLL?.val || prevLL?.valor || prevLL?.value || 0;
        if (prevLLVal < 0 && lucroLiquido > 0) {
          institutionalStabilityScore += 10;
          stabilityDeductions.push('Turnaround validated: prev loss to current profit (+10)');
        }
      }
      institutionalStabilityScore = Math.max(0, Math.min(100, institutionalStabilityScore));

      // Compute final Board Risk Score
      const boardRiskScore = Math.round(
        (cqs * 0.20) +
        (eqs * 0.20) +
        (operationalSurvivability * 0.20) +
        (governanceExposureScore * 0.15) +
        (capitalStructureScore * 0.15) +
        (institutionalStabilityScore * 0.10)
      );

      // Interpret Board Risk Score
      let institutionalIntegrityLevel = 'Transitional Institutional Risk';
      if (boardRiskScore >= 85) institutionalIntegrityLevel = 'Institutional Resilience';
      else if (boardRiskScore >= 70) institutionalIntegrityLevel = 'Stable Governance Structure';
      else if (boardRiskScore >= 50) institutionalIntegrityLevel = 'Transitional Institutional Risk';
      else if (boardRiskScore >= 30) institutionalIntegrityLevel = 'Fragile Institutional Structure';
      else institutionalIntegrityLevel = 'Critical Fiduciary Risk';

      // 5. Banking Readiness Score (0-100)
      let bankingReadinessScore = 100;
      let bankingDeductions: string[] = [];
      const dscrCausal = stressInference?.metrics?.dscrCausal ?? 99.9;
      if (dscrCausal < 1.0) {
        bankingReadinessScore -= 25;
        bankingDeductions.push('DSCR Causal < 1.0 (-25)');
      }
      if (cqs < 50) {
        bankingReadinessScore -= 20;
        bankingDeductions.push('CQS < 50 (-20)');
      }
      if (eqs < 50) {
        bankingReadinessScore -= 20;
        bankingDeductions.push('EQS < 50 (-20)');
      }
      if (runway < 6) {
        bankingReadinessScore -= 20;
        bankingDeductions.push('Runway < 6 months (-20)');
      }
      if (leverageRatio > 0.5) {
        bankingReadinessScore -= 15;
        bankingDeductions.push('Leverage > 50% (-15)');
      }
      bankingReadinessScore = Math.max(0, bankingReadinessScore);

      let bankingReadinessLevel = 'Restricted Credit Readiness';
      if (bankingReadinessScore >= 85) bankingReadinessLevel = 'Institutional Banking Grade';
      else if (bankingReadinessScore >= 70) bankingReadinessLevel = 'Financeable';
      else if (bankingReadinessScore >= 50) bankingReadinessLevel = 'Restricted Credit Readiness';
      else if (bankingReadinessScore >= 30) bankingReadinessLevel = 'Fragile Banking Structure';
      else bankingReadinessLevel = 'Critical Funding Risk';

      // 6. Alerts Generation
      const alerts: string[] = [];
      if (runway < 6) {
        alerts.push('Treasury survivability horizon is critically compressed.');
      }
      if (eqs < 50) {
        alerts.push('Operational profitability quality presents structural fragility.');
      }
      if (intensidadePartesRelacionadas > 0.25) {
        alerts.push('Operational continuity demonstrates elevated dependency on shareholder-supported structures.');
      }
      if (stDebtRatio > 0.7) {
        alerts.push('Capital structure presents elevated short-term refinancing pressure.');
      }
      if (cqs < 50 && eqs < 50 && runway < 6) {
        alerts.push('Institutional structure presents restricted banking-grade sustainability.');
      }

      // Narrative Sanitization Helpers
      const sanitizeNarrative = (text: string): string => {
        if (!text) return '';
        let sanitized = text;
        const forbidden = [
          { pattern: /collapse/gi, replacement: 'elevated treasury sensitivity under operational stress' },
          { pattern: /fraud/gi, replacement: 'irregular reconciliation discrepancy' },
          { pattern: /terminal insolvency/gi, replacement: 'critical restructuring phase' },
          { pattern: /irreversible failure/gi, replacement: 'structural capital dependency challenge' },
          { pattern: /unsurvivable/gi, replacement: 'operation under extreme treasury compression' }
        ];
        forbidden.forEach(rule => {
          sanitized = sanitized.replace(rule.pattern, rule.replacement);
        });
        return sanitized;
      };

      // Diagnostic & Narrative
      let diagnostic = `A estrutura de governança apresenta um Board Risk Score de ${boardRiskScore}/100, classificado como ${institutionalIntegrityLevel}.`;
      if (isEarlyStage) {
        diagnostic += ` Contexto de scale-up e formação de capital atenuado para maturidade institucional inicial.`;
      } else {
        if (boardRiskScore < 50) {
          diagnostic += ` Risco fiduciário elevado devido a fragilidades estruturais identificadas.`;
        } else {
          diagnostic += ` Resiliência institucional consolidada.`;
        }
      }
      diagnostic = sanitizeNarrative(diagnostic);

      const narrative: AdvisoryNarrative = {
        diagnostic,
        cause: fcoOperacionalReal > 0 ? 'Geração líquida de caixa operacional real.' : 'Consumo estrutural de caixa operacional core.',
        consequence: boardRiskScore < 50 ? 'Restrição de acesso a linhas de crédito convencionais e pressão de governança.' : 'Preservação da autonomia de capital e credibilidade bancária.',
        sensitivity: isEarlyStage ? 'Sensibilidade de escala inicial' : 'Sensibilidade determinística longitudinal',
        risk: boardRiskScore < 50 ? 'Alto risco fiduciário' : 'Risco sob controle',
        priority: 'Otimização da estrutura de capital e redução de dependência societária.',
        strategicMovement: 'Conformidade fiduciária executiva integrada.'
      };

      // Explainability details
      const explainability = {
        treasury: {
          score: cqs,
          formula: 'Cash Quality Score (CQS)',
          source: 'LegacyDFCAdapter',
          lineage: `CQS score calculated: ${cqs}`,
          adjustments: 'Expurgo de suportes de liquidez artificial',
          rationale: 'Mede a qualidade, recorrência e legitimidade da geração de caixa operacional.'
        },
        earnings: {
          score: eqs,
          formula: 'Earnings Quality Score (EQS)',
          source: 'LegacyDFCAdapter',
          lineage: `EQS score calculated: ${eqs}`,
          adjustments: 'Ajuste por receitas não recorrentes e volatilidade',
          rationale: 'Avalia a sustentabilidade e consistência da lucratividade declarada.'
        },
        survivability: {
          score: operationalSurvivability,
          formula: 'InstitutionalSurvivabilityEngine.calculate()',
          source: 'InstitutionalSurvivabilityEngine',
          lineage: `Operational survivability score: ${operationalSurvivability}`,
          adjustments: 'Penalização por EBITDA negativo e queima de caixa',
          rationale: 'Estima o horizonte e resiliência de sobrevivência sob cenários de estresse.'
        },
        governance: {
          score: governanceExposureScore,
          formula: '100 - deduções (Partes Relacionadas > 25%, avisos DFC, descompasso conciliação, RP > EBITDA)',
          source: 'LegacyDFCAdapter & Raw Inputs',
          lineage: govDeductions.join(' | ') || 'Nenhuma dedução aplicada',
          adjustments: 'Avaliação de transações com partes relacionadas e inconsistências',
          rationale: 'Mapeia a opacidade e riscos de dreno societário.'
        },
        capital: {
          score: capitalStructureScore,
          formula: '100 - deduções (PL/Ativo < 10%, Dívida/Ativo > 50%, Curto Prazo > 70%, Liquidez Corrente < 1.0)',
          source: 'LegacyFinancialAdapter',
          lineage: capDeductions.join(' | ') || 'Nenhuma dedução aplicada',
          adjustments: 'Refinanciamento de dívidas e alavancagem estrutural',
          rationale: 'Identifica a solvência a longo prazo e a rigidez do balanço.'
        },
        stability: {
          score: institutionalStabilityScore,
          formula: isEarlyStage ? 'Maturity Protection Score (80)' : '100 - deduções (Prejuízos recorrentes, volatilidade e runway)',
          source: 'LegacyFinancialAdapter & DFC',
          lineage: stabilityDeductions.join(' | ') || 'Nenhuma dedução aplicada (ou proteção early-stage)',
          adjustments: 'Proteção estatística para empresas com menos de 3 ciclos',
          rationale: 'Avalia a consistência longitudinal dos resultados corporativos.'
        }
      };

      const auditability = {
        reconciliationLogic: 'Reconciliação entre DFC Fiduciária e Balanço Patrimonial',
        lineageTrace: `Variação de conciliação calculada: ${varConciliacao.toFixed(2)} (Limite de tolerância: 5% da Receita Líquida)`,
        reconstructionTrace: `Fluxo de partes relacionadas considerado: ${fluxoPartesRelacionadas.toFixed(2)}`
      };

      const metrics = {
        boardRiskScore,
        institutionalIntegrityLevel,
        bankingReadinessScore,
        bankingReadinessLevel,
        alerts,
        explainability,
        auditability,
        dimensions: {
          treasury: cqs,
          earnings: eqs,
          survivability: operationalSurvivability,
          governance: governanceExposureScore,
          capital: capitalStructureScore,
          stability: institutionalStabilityScore
        },
        divergence: {
          cqs,
          eqs,
          divergenceScore: Math.abs(cqs - eqs)
        },
        intensidadePartesRelacionadas,
        leverageRatio,
        stDebtRatio
      };

      const inference: InferenceBlock = {
        domain: 'Matriz de Risco (Board Risk Matrix)',
        metrics,
        causality: [],
        narrative,
        confidence: context.globalConfidence,
        evidenceLevel: isEarlyStage ? 'MATURAÇÃO_ESCALA' : 'LONGITUDINAL_CERTIFIED',
        score: boardRiskScore
      };

      return {
        engineName: 'BoardRiskMatrixAdapter',
        success: true,
        confidence: context.globalConfidence,
        inference
      };

    } catch (e: any) {
      return {
        engineName: 'BoardRiskMatrixAdapter',
        success: false,
        confidence: 'LOW',
        violations: [{
          rule: 'BOARD_RISK_MATRIX_CRASH',
          severity: 'CRITICAL',
          message: `Erro ao processar Board Risk Matrix: ${e.message}`,
          blocked: true
        }]
      };
    }
  }
};
