// src/core/runtime/capital-governance/capital-governance-adapter.ts
//
// Ref: Governance Runtime Correction — DLPA Fiduciary Interpretation Refactor

import { CapitalGovernanceDiagnostics } from './capital-governance-types';
import { DLPAFiduciaryInterpretationEngine, DLPAFiduciaryOutput } from '../governance/dlpa/DLPAFiduciaryInterpretationEngine';
import { FinancialRuntimeContext } from '../financial-context/FinancialRuntimeContextTypes';
import { FinancialRuntimeContextAdapter } from '../financial-context/FinancialRuntimeContextAdapter';
import { InstitutionalBusinessProfile } from '../institutional-identity/InstitutionalBusinessProfile';

export interface HistoricalCycleMetrics {
  year: number;
  netIncome: number;
  totalDistributed: number;
  startingEquity: number;
  endingEquity: number;
  operatingCashFlow: number;
}

export class CapitalGovernanceAdapter {
  /**
   * Main entry point to process DLPA governance analysis.
   */
  static process(
    dlpaData: any[],
    netIncome: number,
    retainedEarnings: number,
    totalDistributed: number,
    startingEquity: number,
    endingEquity: number,
    capitalInjections: number,
    context?: any,
    historicalCyclesRaw?: any[]
  ): { diagnostics: CapitalGovernanceDiagnostics & { fiduciaryOutput?: DLPAFiduciaryOutput }; narrative: string } {
    
    if (!dlpaData || dlpaData.length === 0) {
      return {
        diagnostics: {
          isAvailable: false,
          retention: null,
          distribution: null,
          preservation: null,
          capitalization: null,
          behavior: null
        },
        narrative: 'DLPA/DMPL indisponível para análise institucional.'
      };
    }

    // 1. Resolve / Construct FinancialRuntimeContext safely to enforce fail-closed or partial fallbacks
    let runtimeContext: FinancialRuntimeContext | undefined = context;
    if (!runtimeContext) {
      // Fallback context: create basic profile with segmentoEmpresa to prevent UI crash,
      // but strictly flag as PARTIAL and LOW confidence in accordance with the user's rule.
      try {
        const contextAdapter = new FinancialRuntimeContextAdapter();
        const profile: InstitutionalBusinessProfile = {
          segmentoOperacional: 'Default'
        };
        const basicContext = contextAdapter.createContext(profile);
        
        // Force the fallback context to reflect partial/low confidence
        basicContext.contextualConfidence = 'LOW';
        if (!basicContext.interpretationWarnings.includes('FinancialRuntimeContext incompleto')) {
          basicContext.interpretationWarnings.push('FinancialRuntimeContext incompleto');
        }
        
        runtimeContext = basicContext;
      } catch (err) {
        // Safe fallback in case of context engine error
        runtimeContext = undefined;
      }
    }

    // 2. Parse Historical Cycles from raw format
    const historicalCycles = this.parseHistoricalCycles(historicalCyclesRaw);

    // 3. Estimate auxiliary fields
    const capitalSocial = dlpaData[0]?.capitalSocial ?? dlpaData[0]?.valorCapitalSocial ?? endingEquity;
    const lucrosPrejuizos = dlpaData[0]?.lucrosRetidosAcumulados ?? dlpaData[0]?.lucrosPrejuizos ?? retainedEarnings;
    
    // Attempt to extract operating cash flow from context or historical cycles if available
    let operatingCashFlow = 0;
    if (historicalCycles && historicalCycles.length > 0) {
      const currentYear = dlpaData[0]?.year;
      const currentCycle = historicalCycles.find(c => c.year === currentYear);
      if (currentCycle) {
        operatingCashFlow = currentCycle.operatingCashFlow;
      }
    }

    // 4. Invoke the official DLPA Fiduciary engine
    const fidOutput = DLPAFiduciaryInterpretationEngine.evaluate({
      context: runtimeContext,
      dlpaData,
      netIncome,
      retainedEarnings,
      totalDistributed,
      startingEquity,
      endingEquity,
      capitalInjections,
      operatingCashFlow,
      capitalSocial,
      lucrosPrejuizos,
      historicalCycles
    });

    // 5. Calculate retro-compatible metrics for diagnostics block
    const retentionRatio = netIncome > 0 ? retainedEarnings / netIncome : 0;
    const distributionRatio = netIncome > 0 ? totalDistributed / netIncome : 0;
    const capitalPreservationIndex = fidOutput.preservationRatio ?? 1.0;

    const diagnostics: CapitalGovernanceDiagnostics & { fiduciaryOutput?: DLPAFiduciaryOutput } = {
      isAvailable: true,
      retention: {
        netIncome,
        retainedEarnings,
        retentionRatio,
        retentionStatus: fidOutput.retentionClassification as any
      },
      distribution: {
        totalDistributed,
        distributionRatio,
        hasDistributiveEvidence: totalDistributed > 0,
        distributionPressure: fidOutput.distributionEligibility.eligible ? 'BAIXA' : 'CRÍTICA'
      },
      preservation: {
        startingEquity,
        endingEquity,
        equityPreservationRatio: capitalPreservationIndex,
        preservationStatus: fidOutput.patrimonialIntegrityStatus as any,
        capitalSupportRatio: 0
      },
      capitalization: {
        capitalInjections,
        capitalizationRatio: startingEquity > 0 ? capitalInjections / startingEquity : 0,
        capitalizationStatus: capitalInjections > 0 ? 'INJEÇÃO_EXTERNA' : (netIncome > 0 ? 'ORGÂNICA' : 'SEM_CAPITALIZAÇÃO')
      },
      behavior: {
        capitalReinforcementIndex: fidOutput.patrimonialIntegrityStatus === 'PRESERVED' ? 80 : (fidOutput.patrimonialIntegrityStatus === 'PRESSURED' ? 55 : 30),
        hasDistributiveEvidence: totalDistributed > 0,
        governanceMaturity: fidOutput.retentionClassification === 'STRATEGIC_RETENTION' ? 'MATURA' :
                             fidOutput.retentionClassification === 'GOVERNANCE_RETENTION' ? 'EM_DESENVOLVIMENTO' : 'FRAGILIZADA'
      },
      fiduciaryOutput: fidOutput
    };

    return {
      diagnostics,
      narrative: fidOutput.governanceNarrative
    };
  }

  /**
   * Helper to parse historical cycles from flat lists (e.g. database query arrays) or structured history.
   */
  private static parseHistoricalCycles(rawHistory?: any[]): HistoricalCycleMetrics[] {
    if (!rawHistory || rawHistory.length === 0) return [];

    // If it's already structured HistoricalCycleMetrics, return directly
    if (rawHistory[0] && typeof rawHistory[0].year === 'number' && typeof rawHistory[0].netIncome === 'number') {
      return rawHistory;
    }

    // Handle flat database results (e.g., FinancialEntry[] from useHistoricalDemonstracoes)
    if (rawHistory[0] && (rawHistory[0].docType || rawHistory[0].category || rawHistory[0].conta)) {
      const cyclesMap = new Map<number, Partial<HistoricalCycleMetrics>>();

      rawHistory.forEach((entry: any) => {
        const year = Number(entry.year);
        if (!year) return;

        if (!cyclesMap.has(year)) {
          cyclesMap.set(year, { year, netIncome: 0, totalDistributed: 0, startingEquity: 0, endingEquity: 0, operatingCashFlow: 0 });
        }

        const cycle = cyclesMap.get(year)!;
        const normConta = (entry.conta || entry.category || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const val = Number(entry.val || entry.valor || entry.value || 0);

        if (entry.docType === 'DRE' || entry.docType === 'DRE Contábil' || entry.docType === 'DRE Gerencial') {
          if (normConta.includes('lucro liquido') || normConta.includes('lucro do exercicio') || normConta.includes('resultado liquido')) {
            cycle.netIncome = val;
          }
        } else if (entry.docType === 'BP' || entry.docType === 'Balanço Patrimonial') {
          if (normConta.includes('patrimonio liquido') || normConta.includes('pl fim') || normConta.includes('saldo final')) {
            cycle.endingEquity = val;
          }
          if (normConta.includes('pl inicio') || normConta.includes('saldo inicial')) {
            cycle.startingEquity = val;
          }
        } else if (entry.docType === 'DLPA') {
          if (normConta.includes('dividendo') || normConta.includes('distribuicao') || normConta.includes('jcp')) {
            cycle.totalDistributed = Math.abs(val);
          }
        } else if (entry.docType === 'DFC') {
          if (normConta.includes('caixa operacional') || normConta.includes('fluxo de caixa operacional') || normConta.includes('fco')) {
            cycle.operatingCashFlow = val;
          }
        }
      });

      // Fill in defaults for missing values
      const parsedCycles: HistoricalCycleMetrics[] = [];
      cyclesMap.forEach((cycle) => {
        if (!cycle.startingEquity && cycle.endingEquity) {
          cycle.startingEquity = cycle.endingEquity; // Fallback
        }
        parsedCycles.push({
          year: cycle.year!,
          netIncome: cycle.netIncome ?? 0,
          totalDistributed: cycle.totalDistributed ?? 0,
          startingEquity: cycle.startingEquity ?? 0,
          endingEquity: cycle.endingEquity ?? 0,
          operatingCashFlow: cycle.operatingCashFlow ?? 0
        });
      });

      return parsedCycles;
    }

    // Default map for other cycle schemas (e.g. rawData.runtimeHistory)
    return rawHistory.map((h: any) => {
      const netIncome = h.rawFinancialData?.lucroLiquido ?? h.netIncome ?? 0;
      const totalDistributed = h.totalDistributed ?? 0;
      const startingEquity = h.rawFinancialData?.prevPl ?? h.startingEquity ?? 0;
      const endingEquity = h.rawFinancialData?.bpSummary?.patrimonioLiquido ?? h.endingEquity ?? 0;
      const operatingCashFlow = h.operatingCashFlow ?? 0;

      return {
        year: Number(h.year),
        netIncome,
        totalDistributed,
        startingEquity,
        endingEquity,
        operatingCashFlow
      };
    });
  }
}
