// src/core/runtime/capital-governance/capital-governance-adapter.ts
//
// Ref: Governance Runtime Correction — DLPA Fiduciary Interpretation Refactor

import { CapitalGovernanceDiagnostics } from './capital-governance-types';
import { mapReportToExecutiveFinancialStoryInput } from '../../../lib/executive-financial-story-mapper';
import { buildExecutiveFinancialStory } from '../../../lib/executive-financial-story-engine';
import { ExecutiveFinancialStory } from '../../../lib/executive-financial-story-types';

import { mapReportToBoardNarrativeInput } from '../../../lib/board-narrative-mapper';
import { buildBoardNarrative } from '../../../lib/board-narrative-engine';
import type { BoardNarrative } from '../../../lib/board-narrative-types';

import { mapReportToAdvisoryNarrativeInput } from '../../../lib/advisory-narrative-mapper';
import { buildAdvisoryNarrative } from '../../../lib/advisory-narrative-engine';
import type { AdvisoryNarrative } from '../../../lib/advisory-narrative-types';

import { mapReportToPartnerNarrativeInput } from '../../../lib/partner-narrative-mapper';
import { buildPartnerNarrative } from '../../../lib/partner-narrative-engine';
import type { PartnerNarrative } from '../../../lib/partner-narrative-types';

import { mapReportToManagementNarrativeInput } from '../../../lib/management-narrative-mapper';
import { buildManagementNarrative } from '../../../lib/management-narrative-engine';
import type { ManagementNarrative } from '../../../lib/management-narrative-types';

import { mapReportToGovernanceCommunicationFrameworkInput } from '../../../lib/governance-communication-framework-mapper';
import { buildGovernanceCommunicationFramework } from '../../../lib/governance-communication-framework-engine';
import type { GovernanceCommunicationFramework } from '../../../lib/governance-communication-framework-types';

import { mapReportToBoardPackInput } from '../../../lib/board-pack-mapper';
import { buildBoardPack } from '../../../lib/board-pack-engine';
import type { BoardPack } from '../../../lib/board-pack-types';

import { mapReportToBoardDeckInput } from '../../../lib/board-deck-mapper';
import { buildBoardDeck } from '../../../lib/board-deck-engine';
import type { BoardDeck } from '../../../lib/board-deck-types';

import { DLPAFiduciaryInterpretationEngine, DLPAFiduciaryOutput } from '../governance/dlpa/DLPAFiduciaryInterpretationEngine';
import { FinancialRuntimeContext } from '../financial-context/FinancialRuntimeContextTypes';
import { FinancialRuntimeContextAdapter } from '../financial-context/FinancialRuntimeContextAdapter';
import { InstitutionalBusinessProfile } from '../institutional-identity/InstitutionalBusinessProfile';
import { buildGovernanceScore } from '../../../runtime/adapters/CapitalGovernanceAdapter';
import { LifecycleFallbackReasons, LifecycleFallbackReason } from '../lifecycle/LifecycleFallbackReasons';
import { LifecyclePropagationAudit } from '../lifecycle/LifecyclePropagationAudit';
import { CapitalGovernanceSemanticEngine } from '../../../runtime/governance/capital/CapitalGovernanceSemanticEngine';

import { DLPAMetricsEngine } from '../governance/dlpa/DLPAMetricsEngine';
import { DLPACapitalConsumptionEngine } from '../governance/dlpa/DLPACapitalConsumptionEngine';
import { DLPAShareholderCapitalDependencyEngine } from '../governance/dlpa/DLPAShareholderCapitalDependencyEngine';
import { DLPAEquityFormationQualityEngine } from '../governance/dlpa/DLPAEquityFormationQualityEngine';
import { DLPADistributionCapacityEngine } from '../governance/dlpa/DLPADistributionCapacityEngine';
import { DLPARetentionEngine } from '../governance/dlpa/DLPARetentionEngine';
import { DLPAGovernanceInterpretationEngine } from '../governance/dlpa/DLPAGovernanceInterpretationEngine';
import { DLPABoardDecisionSupportEngine } from '../governance/dlpa/DLPABoardDecisionSupportEngine';
import { DLPABoardAdvisoryEngine } from '../governance/dlpa/DLPABoardAdvisoryEngine';
import { CapitalRecoveryEngine } from '../governance/dlpa/CapitalRecoveryEngine';
import { CapitalErosionRiskEngine } from '../governance/dlpa/CapitalErosionRiskEngine';
import { CapitalPreservationStatusEngine } from '../governance/dlpa/CapitalPreservationStatusEngine';
import { ShareholderDependencyNarrativeEngine } from '../governance/dlpa/ShareholderDependencyNarrativeEngine';
import { CapitalRecoveryRequirementEngine } from '../governance/dlpa/CapitalRecoveryRequirementEngine';
import { PatrimonialRecoveryHorizonEngine } from '../governance/dlpa/PatrimonialRecoveryHorizonEngine';
import { CapitalRecoverabilityEngine } from '../governance/dlpa/CapitalRecoverabilityEngine';
import { CapitalPreservationScoreEngine } from '../governance/dlpa/CapitalPreservationScoreEngine';
import { TemporalEvidenceFilter } from '../temporal-governance/TemporalEvidenceFilter';
import { TemporalFiduciaryIntegrityEngine } from '../temporal-governance/TemporalFiduciaryIntegrityEngine';
import { DLPAGovernanceRadarEngine } from '../governance/dlpa/DLPAGovernanceRadarEngine';
import { DLPAConsistencyAuditEngine } from '../governance/dlpa/DLPAConsistencyAuditEngine';
import { DLPALegacyPayloadAudit } from '../governance/dlpa/DLPALegacyPayloadAudit';

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
  ): {
    diagnostics: CapitalGovernanceDiagnostics & { fiduciaryOutput?: DLPAFiduciaryOutput };
    narrative: string;
    resolvedGovernanceStatus?: string;
    resolvedCapitalStatus?: string;
    resolvedNarrativeProfile?: string;
    semanticSource?: string;
    executiveLayer?: {
      preservedCapital: any;
      consumedCapital: any;
      capitalRecovery?: any;
      capitalErosionRisk?: any;
      capitalDependency: any;
      formationQuality: any;
      distributionCapacity: any;
      retention: any;
      governanceInterpretation: any;
      boardDecisionSupport: any;
      boardAdvisory: any;
      capitalPreservationStatus?: any;
      shareholderDependencyNarrative?: any;
      capitalRecoveryRequirement?: any;
      patrimonialRecoveryHorizon?: any;
      capitalRecoverability?: any;
      capitalPreservationScore?: any;
    };
    lifecycleAudit?: LifecyclePropagationAudit;
    temporalAudit?: any;
    semantic?: {
      semanticSource: 'ELSA' | 'LEGACY';
      lifecycleStage: string;
      rawGovernanceStatus: string;
      resolvedGovernanceStatus: string;
      rawCapitalStatus: string;
      resolvedCapitalStatus: string;
      rawPatrimonialStatus: string;
      resolvedPatrimonialStatus: string;
      cpiStatus: string;
      semanticContext: {
        semanticSource: string;
        lifecycleStage: string;
        lifecycleLabel: string;
        foundationYear: number | null;
        analysisYear: number | null;
        companyAge: number | null;
        lifecycleConfidence: string;
      };
    };
    consistencyAudit?: any;
    patrimonialRecoveryHorizon?: any;
    capitalRecoverability?: any;
    capitalPreservationScore?: any;
    capitalStatus?: string;
    executiveFinancialStory?: ExecutiveFinancialStory;
    boardNarrative?: BoardNarrative;
    advisoryNarrative?: AdvisoryNarrative;
    partnerNarrative?: PartnerNarrative;
    managementNarrative?: ManagementNarrative;
    governanceCommunicationFramework?: GovernanceCommunicationFramework;
    boardPack?: BoardPack;
    boardDeck?: BoardDeck;
  } {
    
    let fallbackActivated = false;
    let fallbackReason: LifecycleFallbackReason | undefined = undefined;
    
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
      fallbackActivated = true;
      fallbackReason = LifecycleFallbackReasons.RUNTIME_CONTEXT_MISSING_LIFECYCLE;
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
        fallbackActivated = true;
        fallbackReason = LifecycleFallbackReasons.UNKNOWN;
      }
    } else if (!runtimeContext.lifecycleProfile) {
      fallbackActivated = true;
      fallbackReason = LifecycleFallbackReasons.LIFECYCLE_PROFILE_NOT_BUILT;
    }

    // 3. Estimate auxiliary fields
    const normalize = (s: string) =>
      (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const capSocialEntry = dlpaData.find((e: any) => {
      const n = normalize(e.conta || e.category || '');
      return n.includes('capital social') || n.includes('capital integralizado') || n.includes('capital subscrito');
    });

    let filterYear: number;
    const contextYear = context?.lifecycle?.analysisYear || context?.analysisYear;
    if (contextYear !== undefined && contextYear !== null) {
      filterYear = Number(contextYear);
    } else {
      const hasExecutiveContext = !!(context?.lifecycle || context?.lifecycleProfile);
      if (hasExecutiveContext) {
        throw new Error('DLPA_UI_HARD_FAIL: Contexto executivo presente mas analysisYear está ausente.');
      }
      filterYear = Number(dlpaData[0]?.year || new Date().getFullYear());
    }

    // Hard assert: Se context.lifecycle.analysisYear existir, nenhum ciclo futuro poderá ser usado
    if (context?.lifecycle?.analysisYear !== undefined && context?.lifecycle?.analysisYear !== null) {
      const parsedAnalysisYear = Number(context.lifecycle.analysisYear);
      if (filterYear !== parsedAnalysisYear) {
        throw new Error(`DLPA_UI_HARD_FAIL: filterYear resolved to ${filterYear} instead of analysisYear ${parsedAnalysisYear}`);
      }
    }

    const cleanDlpaData = dlpaData.filter(d => {
      const yr = Number(d.year || d.ano);
      return isNaN(yr) || yr <= filterYear;
    });

    const cleanHistoricalCyclesRaw = (historicalCyclesRaw || []).filter(d => {
      const yr = Number(d.year || d.ano);
      return isNaN(yr) || yr <= filterYear;
    });

    // 2. Parse Historical Cycles from raw format
    const historicalCycles = this.parseHistoricalCycles(cleanHistoricalCyclesRaw);

    // Hard assert: Se context.lifecycle.analysisYear existir, nenhum ciclo futuro poderá ser usado
    if (context?.lifecycle?.analysisYear !== undefined && context?.lifecycle?.analysisYear !== null) {
      const parsedAnalysisYear = Number(context.lifecycle.analysisYear);
      const futureDlpa = cleanDlpaData.filter(d => {
        const yr = Number(d.year || d.ano);
        return !isNaN(yr) && yr > parsedAnalysisYear;
      });
      if (futureDlpa.length > 0) {
        throw new Error(`DLPA_UI_HARD_FAIL: Future cycle in cleanDlpaData found: ${futureDlpa[0].year} > analysisYear ${parsedAnalysisYear}`);
      }

      const futureCycles = historicalCycles.filter(c => c.year > parsedAnalysisYear);
      if (futureCycles.length > 0) {
        throw new Error(`DLPA_UI_HARD_FAIL: Future cycle in historicalCycles found: ${futureCycles[0].year} > analysisYear ${parsedAnalysisYear}`);
      }
    }

    // Try to extract Capital Social from Balance Sheet (BP) in history first
    let bpCapitalSocial = 0;
    if (cleanHistoricalCyclesRaw && cleanHistoricalCyclesRaw.length > 0) {
      const bpEntries = cleanHistoricalCyclesRaw.filter((d: any) => 
        Number(d.year) === filterYear && 
        ['bp', 'balanço patrimonial', 'balanco patrimonial', 'balanco'].includes(normalize(d.docType || d.type || ''))
      );
      const matchedBPEntry = bpEntries.find((e: any) => {
        const n = normalize(e.conta || e.category || '');
        return n === 'capital social' || n === 'capital social integralizado' || n === 'capital integralizado' || n === 'capital subscrito';
      });
      if (matchedBPEntry) {
        bpCapitalSocial = Math.abs(Number(matchedBPEntry.val ?? matchedBPEntry.valor ?? matchedBPEntry.value ?? 0));
      }
    }

    const capitalSocial = bpCapitalSocial > 0 
      ? bpCapitalSocial 
      : (capSocialEntry
        ? Math.abs(Number(capSocialEntry.val ?? capSocialEntry.valor ?? capSocialEntry.value ?? 0))
        : (cleanDlpaData[0]?.capitalSocial ?? cleanDlpaData[0]?.valorCapitalSocial ?? endingEquity));


    const bpEntriesForLp = (cleanHistoricalCyclesRaw || []).filter((d: any) =>
      Number(d.year) === filterYear &&
      ['bp', 'balanço patrimonial', 'balanco patrimonial', 'balanco'].includes(normalize(d.docType || d.type || ''))
    );

    let bpLucrosPrejuizos = 0;
    let foundBpLp = false;
    if (bpEntriesForLp.length > 0) {
      const lpEntry = bpEntriesForLp.find((e: any) => {
        const n = normalize(e.conta || e.category || '');
        return (n.includes('lucros acumulados') || n.includes('prejuizos acumulados') || n.includes('lucros/prejuizos acumulados') || n.includes('lucros ou prejuizos acumulados') || n.includes('prejuizo acumulado')) && e.type === 'pl';
      });
      if (lpEntry) {
        bpLucrosPrejuizos = Number(lpEntry.val || lpEntry.valor || lpEntry.value || 0);
        const nameNorm = normalize(lpEntry.conta || lpEntry.category || '');
        if ((nameNorm.includes('prejuizo') || nameNorm.includes('(-)')) && bpLucrosPrejuizos > 0) {
          bpLucrosPrejuizos = -bpLucrosPrejuizos;
        }
        foundBpLp = true;
      }
    }

    const lucrosPrejuizosEntry = cleanDlpaData.find((e: any) => {
      const n = normalize(e.conta || e.category || '');
      // Exclude starting/initial lines to find the ending balance
      if (n.includes('inicio') || n.includes('inicial') || n.includes('abertura') || n.includes('anterior')) {
        return false;
      }
      return n.includes('lucros acumulados') || n.includes('prejuizos acumulados') || n.includes('lucros/prejuizos') || n.includes('lucros ou prejuizos') || n.includes('lucro retido') || n.includes('prejuizo acumulado');
    });

    const dlpaLpVal = lucrosPrejuizosEntry
      ? Number(lucrosPrejuizosEntry.val ?? lucrosPrejuizosEntry.valor ?? lucrosPrejuizosEntry.value ?? 0)
      : null;

    let lucrosPrejuizos = foundBpLp ? bpLucrosPrejuizos : (dlpaLpVal !== null ? dlpaLpVal : retainedEarnings);

    if (!foundBpLp && lucrosPrejuizosEntry) {
      const nameNorm = normalize(lucrosPrejuizosEntry.conta || lucrosPrejuizosEntry.category || '');
      if ((nameNorm.includes('prejuizo') || nameNorm.includes('(-)')) && lucrosPrejuizos > 0) {
        lucrosPrejuizos = -lucrosPrejuizos;
      }
    }

    if (lucrosPrejuizos === 0) {
      lucrosPrejuizos = (startingEquity || 0) + (netIncome || 0);
    }


    // Attempt to extract operating cash flow from context or historical cycles if available
    let operatingCashFlow = 0;
    if (historicalCycles && historicalCycles.length > 0) {
      const currentYear = cleanDlpaData[0]?.year;
      const currentCycle = historicalCycles.find(c => c.year === currentYear);
      if (currentCycle) {
        operatingCashFlow = currentCycle.operatingCashFlow;
      }
    }

    // 4. Invoke the official DLPA Fiduciary engine
    const fidOutput = DLPAFiduciaryInterpretationEngine.evaluate({
      context: runtimeContext,
      dlpaData: cleanDlpaData,
      netIncome,
      retainedEarnings,
      totalDistributed,
      startingEquity,
      endingEquity,
      capitalInjections,
      operatingCashFlow,
      capitalSocial,
      lucrosPrejuizos,
      historicalCycles,
      semanticSource: runtimeContext?.lifecycleProfile ? 'ELSA' : 'LEGACY'
    });

    // 5. Calculate retro-compatible metrics for diagnostics block
    const retentionRatio = netIncome > 0 ? retainedEarnings / netIncome : 0;
    const distributionRatio = netIncome > 0 ? totalDistributed / netIncome : 0;
    
    // Capital preservation ratio relative to capital social instead of starting equity
    const capitalPreservationIndex = capitalSocial > 0 ? endingEquity / capitalSocial : 1.0;

    const hasSevereOrHighErosion = fidOutput.patrimonialIntegrityStatus === 'SEVERELY_ERODED' || fidOutput.patrimonialIntegrityStatus === 'CAPITAL_COLLAPSE_RISK' || capitalPreservationIndex < 0.75;
    
    // Compute score & status dynamically using the official CGE algorithm
    const { score: cgs, status: cgsStatus } = buildGovernanceScore({
      preservationRatio: capitalPreservationIndex,
      netIncome,
      endingEquity,
      capitalSocial,
      cashPosition: 0,
      hasSevereOrHighErosion,
      context: runtimeContext
    });


    const diagnostics: CapitalGovernanceDiagnostics & { fiduciaryOutput?: DLPAFiduciaryOutput } = {
      isAvailable: true,
      retention: {
        netIncome,
        retainedEarnings,
        retentionRatio,
        retentionStatus: fidOutput.retentionClassification as any,
        lucrosPrejuizos
      },
      distribution: {
        totalDistributed,
        distributionRatio,
        hasDistributiveEvidence: totalDistributed > 0,
        distributionPressure: totalDistributed > 0 ? (fidOutput.distributionEligibility.eligible ? 'BAIXA' : 'CRÍTICA') : 'NÃO_APLICÁVEL_SEM_LUCRO'
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
        capitalReinforcementIndex: cgs,
        hasDistributiveEvidence: totalDistributed > 0,
        governanceMaturity: cgsStatus
      },
      fiduciaryOutput: fidOutput
    };

    // 6. Execute the new Executive Capital Governance Layer
    const preservedCapital = DLPAMetricsEngine.evaluate(endingEquity, capitalSocial);
    const consumedCapital = DLPACapitalConsumptionEngine.evaluate(lucrosPrejuizos, capitalSocial);
    const capitalRecovery = CapitalRecoveryEngine.evaluate(endingEquity, capitalSocial);
    const capitalErosionRisk = CapitalErosionRiskEngine.evaluate(lucrosPrejuizos, capitalSocial);
    const capitalDependency = DLPAShareholderCapitalDependencyEngine.evaluate(capitalSocial, endingEquity);
    
    // Evaluate if there are actual accumulated losses
    const hasLosses = lucrosPrejuizos < 0;
    const formationQuality = DLPAEquityFormationQualityEngine.evaluate(capitalDependency.value as number, hasLosses);
    const distributionCapacity = DLPADistributionCapacityEngine.evaluate(netIncome, lucrosPrejuizos);
    const retention = DLPARetentionEngine.evaluate(netIncome, retainedEarnings, lucrosPrejuizos);
    
    const governanceInterpretation = DLPAGovernanceInterpretationEngine.evaluate(
      capitalDependency.value as number,
      formationQuality.classification,
      distributionCapacity.classification,
      lucrosPrejuizos
    );

    const capitalPreservationStatus = CapitalPreservationStatusEngine.evaluate(endingEquity, capitalSocial);
    const shareholderDependencyNarrative = ShareholderDependencyNarrativeEngine.evaluate(capitalSocial, endingEquity);
    const capitalRecoveryRequirement = CapitalRecoveryRequirementEngine.evaluate(lucrosPrejuizos, capitalSocial);
    
    // Resolve perspective for temporal audit
    const perspective = (context?.perspective === 'RETROSPECTIVE' || context?.runtimeMode === 'RETROSPECTIVE') ? 'RETROSPECTIVE' : 'EXECUTIVE';
    const rawHistoricalCycles = this.parseHistoricalCycles(historicalCyclesRaw || []);
    const rawHistoricalYears = rawHistoricalCycles.map(c => Number(c.year));
    const rawDlpaYears = (dlpaData || []).map(d => Number(d.year || d.ano));
    const rawYears = [...new Set([...rawHistoricalYears, ...rawDlpaYears])].filter(y => !isNaN(y) && y > 0);
    const temporalAudit = context?.temporalAudit || TemporalFiduciaryIntegrityEngine.validate(
      filterYear,
      rawYears,
      perspective
    );

    // Enforced Temporal Evidence Contract: filter historical cycles to keep only eligible ones
    const eligibleHistoricalCycles = TemporalEvidenceFilter.filterByAnalysisYear(historicalCycles, filterYear);

    const capitalToRecover = lucrosPrejuizos < 0 ? Math.abs(lucrosPrejuizos) : 0;
    const patrimonialRecoveryHorizon = PatrimonialRecoveryHorizonEngine.evaluate({
      capitalToRecover,
      currentNetProfit: netIncome,
      eligibleHistoricalCycles,
      analysisYear: filterYear,
      temporalAudit
    });

    const capitalRecoverability = CapitalRecoverabilityEngine.evaluate(endingEquity, patrimonialRecoveryHorizon);
    const capitalPreservationScore = CapitalPreservationScoreEngine.evaluate(
      capitalPreservationStatus.value,
      shareholderDependencyNarrative.value,
      distributionCapacity.classification,
      patrimonialRecoveryHorizon.formatted,
      patrimonialRecoveryHorizon.value,
      endingEquity,
      filterYear
    );

    const boardDecisionSupport = DLPABoardDecisionSupportEngine.evaluate(
      formationQuality.classification,
      netIncome,
      capitalPreservationStatus.value,
      capitalErosionRisk.value as number,
      capitalRecoveryRequirement.capitalRecoveryRequired,
      distributionCapacity.classification,
      shareholderDependencyNarrative.classification,
      shareholderDependencyNarrative.value as number,
      endingEquity
    );

    const boardAdvisory = DLPABoardAdvisoryEngine.evaluate(
      endingEquity,
      formationQuality.classification,
      capitalErosionRisk.value as number,
      netIncome,
      distributionCapacity.classification,
      capitalPreservationStatus.value,
      governanceInterpretation.shareholderCapitalProtection
    );

    const executiveLayer = {
      preservedCapital,
      consumedCapital,
      capitalRecovery,
      capitalErosionRisk,
      capitalDependency,
      formationQuality,
      distributionCapacity,
      retention,
      governanceInterpretation,
      boardDecisionSupport,
      boardAdvisory,
      capitalPreservationStatus,
      shareholderDependencyNarrative,
      capitalRecoveryRequirement,
      patrimonialRecoveryHorizon,
      capitalRecoverability,
      capitalPreservationScore
    };

    const lifecycleAudit: LifecyclePropagationAudit = {
      clientFound: true,
      foundationYearFound: true,
      lifecycleContextBuilt: !!runtimeContext?.lifecycle,
      lifecycleProfileBuilt: !!runtimeContext?.lifecycleProfile,
      runtimeContextContainsLifecycle: !!runtimeContext?.lifecycleProfile,
      adapterReceivedLifecycle: !!context?.lifecycleProfile,
      dlpaEngineReceivedLifecycle: !!runtimeContext?.lifecycleProfile, // Simplified, DLPA uses runtimeContext
      uiReceivedLifecycle: false, // Set in UI
      semanticSource: runtimeContext?.lifecycleProfile ? 'ELSA' : 'LEGACY',
      fallbackActivated,
      fallbackReason
    };

    let resolvedCapitalStatus = runtimeContext?.lifecycleProfile?.capitalStatus?.semanticLabel || (fidOutput.patrimonialIntegrityStatus as any);
    const capitalPreservedPercent = capitalPreservationIndex * 100;
    resolvedCapitalStatus = DLPAGovernanceRadarEngine.resolveStatus(resolvedCapitalStatus, capitalPreservedPercent);

    const adaptedReport = {
      diagnostics,
      narrative: fidOutput.governanceNarrative,
      resolvedGovernanceStatus: runtimeContext?.lifecycleProfile?.governanceStatus?.semanticLabel || cgsStatus,
      resolvedCapitalStatus,
      resolvedNarrativeProfile: runtimeContext?.lifecycleProfile?.narrativeProfile || 'UNKNOWN',
      semanticSource: runtimeContext?.lifecycleProfile ? 'ELSA' : 'LEGACY',
      executiveLayer,
      lifecycleAudit,
      temporalAudit,
      semantic: {
        semanticSource: (runtimeContext?.lifecycleProfile ? 'ELSA' : 'LEGACY') as 'ELSA' | 'LEGACY',
        lifecycleStage: runtimeContext?.lifecycleProfile?.lifecycleStage || (historicalCycles.length <= 1 ? 'INITIAL_CAPITALIZATION' : 'SURVIVAL'),
        rawGovernanceStatus: CapitalGovernanceSemanticEngine.resolveStatus(cgs, hasSevereOrHighErosion),
        resolvedGovernanceStatus: runtimeContext?.lifecycleProfile?.governanceStatus?.semanticLabel || cgsStatus,
        rawCapitalStatus: fidOutput.patrimonialIntegrityStatus as string,
        resolvedCapitalStatus,
        rawPatrimonialStatus: fidOutput.patrimonialIntegrityStatus as string,
        resolvedPatrimonialStatus: resolvedCapitalStatus,
        cpiStatus: resolvedCapitalStatus,
        semanticContext: {
          semanticSource: runtimeContext?.lifecycleProfile ? 'ELSA' : 'LEGACY',
          lifecycleStage: runtimeContext?.lifecycleProfile?.lifecycleStage || (historicalCycles.length <= 1 ? 'INITIAL_CAPITALIZATION' : 'SURVIVAL'),
          lifecycleLabel: runtimeContext?.lifecycleProfile?.narrativeProfile || 'N/A',
          foundationYear: runtimeContext?.lifecycle?.foundationYear || null,
          analysisYear: runtimeContext?.lifecycle?.analysisYear || null,
          companyAge: runtimeContext?.lifecycle?.foundationYear ? runtimeContext.lifecycle.analysisYear - runtimeContext.lifecycle.foundationYear : null,
          lifecycleConfidence: runtimeContext?.lifecycleProfile?.lifecycleConfidence || 'LOW'
        }
      }
    };

    const consistencyAudit = DLPAConsistencyAuditEngine.validate({
      ...adaptedReport,
      preservation: {
        equityPreservationRatio: capitalPreservationIndex
      },
      distribution: {
        distributionRatio: diagnostics.distribution?.distributionRatio
      },
      distributionCapacity: distributionCapacity.classification
    });

    let finalReport = {
      ...adaptedReport,
      patrimonialRecoveryHorizon,
      capitalRecoverability,
      capitalPreservationScore,
      capitalStatus: resolvedCapitalStatus,
      consistencyAudit,
      narrativeContext: context?.narrativeContext,
      unifiedFinancialNarrative: context?.unifiedFinancialNarrative
    };
    // Integrate Executive Financial Story Layer (EFSL)
    const executiveStoryInput = mapReportToExecutiveFinancialStoryInput(finalReport);
    const executiveStory = buildExecutiveFinancialStory(executiveStoryInput);
    
    const reportWithExecutiveStory = {
      ...finalReport,
      ...(executiveStory && { executiveFinancialStory: executiveStory })
    };

    delete (reportWithExecutiveStory as any).legacyRecoveryYears;
    delete (reportWithExecutiveStory as any).legacyRecoveryClassification;
    delete (reportWithExecutiveStory as any).legacyCpsScore;

    const legacyAudit = DLPALegacyPayloadAudit.audit(reportWithExecutiveStory);
    if (!legacyAudit.valid) {
      console.warn(`[DLPALegacyPayloadAudit WARNING]: ${legacyAudit.error}`);
    }

    const boardNarrativeInput = mapReportToBoardNarrativeInput(reportWithExecutiveStory);
    const boardNarrative = buildBoardNarrative(boardNarrativeInput);

    const reportWithBoardNarrative = {
      ...reportWithExecutiveStory,
      ...(boardNarrative && { boardNarrative })
    };

    const advisoryNarrativeInput = mapReportToAdvisoryNarrativeInput(reportWithBoardNarrative);
    const advisoryNarrative = buildAdvisoryNarrative(advisoryNarrativeInput);

    const reportWithAdvisoryNarrative = {
      ...reportWithBoardNarrative,
      ...(advisoryNarrative && { advisoryNarrative })
    };

    const partnerNarrativeInput = mapReportToPartnerNarrativeInput(reportWithAdvisoryNarrative);
    const partnerNarrative = buildPartnerNarrative(partnerNarrativeInput);

    const reportWithPartnerNarrative = {
      ...reportWithAdvisoryNarrative,
      ...(partnerNarrative && { partnerNarrative })
    };

    const managementNarrativeInput = mapReportToManagementNarrativeInput(reportWithPartnerNarrative);
    const managementNarrative = buildManagementNarrative(managementNarrativeInput);

    const reportWithManagementNarrative = {
      ...reportWithPartnerNarrative,
      ...(managementNarrative && { managementNarrative })
    };

    const gcfInput = mapReportToGovernanceCommunicationFrameworkInput(reportWithManagementNarrative);
    const governanceCommunicationFramework = buildGovernanceCommunicationFramework(gcfInput);

    const reportWithGovernanceFramework = {
      ...reportWithManagementNarrative,
      ...(governanceCommunicationFramework && { governanceCommunicationFramework })
    };

    const boardPackInput = mapReportToBoardPackInput(reportWithGovernanceFramework);
    const boardPack = buildBoardPack(boardPackInput);

    const reportWithBoardPack = {
      ...reportWithGovernanceFramework,
      ...(boardPack && { boardPack })
    };

    const boardDeckInput = mapReportToBoardDeckInput(reportWithBoardPack);
    const boardDeck = buildBoardDeck(boardDeckInput);

    const reportWithBoardDeck = {
      ...reportWithBoardPack,
      ...(boardDeck && { boardDeck })
    };

    return reportWithBoardDeck;

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
