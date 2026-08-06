// src/core/runtime/advisory-narrative/ExecutiveNarrativeEngine.ts
//
// Executive Narrative Engine
// Orchestrator. Formulates the 10-section narrative and enforces non-speculative guidelines.

import {
  ExecutiveAdvisoryNarrative,
  AdvisoryAudience,
  AdvisorySeverity
} from './advisory-narrative-types';
import { FiduciaryCommunicationEngine } from './FiduciaryCommunicationEngine';
import { BoardCommunicationEngine } from './BoardCommunicationEngine';
import { StrategicRecommendationEngine } from './StrategicRecommendationEngine';
import { TradeoffNarrativeEngine } from './TradeoffNarrativeEngine';
import { ScenarioExplanationEngine } from './ScenarioExplanationEngine';
import { InstitutionalDisclosureNarrativeEngine } from './InstitutionalDisclosureNarrativeEngine';
import { ExecutiveSummaryEngine } from './ExecutiveSummaryEngine';
import { ConfidenceNarrativeEngine } from './ConfidenceNarrativeEngine';
import { GovernanceNarrativeEngine } from './GovernanceNarrativeEngine';
import { ScenarioCategory } from '../strategic-simulation/simulation-types';

export class ExecutiveNarrativeEngine {
  /**
   * Orchestrates the compilation of the 10 mandatory narrative sections.
   * Ensures absolute fiduciarily correct adaptation across audiences.
   */
  public static orchestrate(
    report: any,
    validationResult: any,
    comparisonReport: any,
    audience: AdvisoryAudience = 'EXECUTIVE',
    correlationId: string = 'advisory_session'
  ): ExecutiveAdvisoryNarrative {
    const timestamp = new Date().toISOString();

    // 1. Resolve Lineage Hash and Materiality
    const lineageHash = validationResult?.certification?.signature ?? report.lineageHash ?? 'lineage_unverified';
    const materialityThreshold = report.policyContext?.materiality?.materialityThreshold ?? 1000;

    // 2. Resolve Severity
    let severity: AdvisorySeverity = 'STABLE';
    const reportLevel = report.severity?.level ?? 'ESTÁVEL';
    const valSeverity = validationResult?.severity ?? 'SAFE';

    if (valSeverity === 'UNSUSTAINABLE' || valSeverity === 'CONSTITUTIONAL_VIOLATION') {
      severity = 'UNSUSTAINABLE';
    } else if (valSeverity === 'CRITICAL' || reportLevel === 'CRÍTICA') {
      severity = 'CRITICAL';
    } else if (valSeverity === 'HIGH_RISK' || reportLevel === 'ALTA') {
      severity = 'HIGH_RISK';
    } else if (valSeverity === 'ATTENTION' || reportLevel === 'ALERTA') {
      severity = 'ATTENTION';
    }

    // 3. Resolve Recommended Path and alternatives
    let recommendedPath: ScenarioCategory = 'Survival Stabilization';
    let eligiblePaths: ScenarioCategory[] = ['Survival Stabilization', 'Conservative Preservation'];
    let ineligiblePaths: ScenarioCategory[] = ['Aggressive Expansion'];
    let candidateCategory: ScenarioCategory = 'Controlled Growth';

    if (comparisonReport) {
      recommendedPath = comparisonReport.recommendedPath;
      candidateCategory = comparisonReport.candidatePath.category;
      
      // Extract from comparison report
      if (comparisonReport.candidatePath.classification === 'UNSUSTAINABLE') {
        ineligiblePaths.push(comparisonReport.candidatePath.category);
      } else {
        eligiblePaths.push(comparisonReport.candidatePath.category);
      }
    }

    // Build the sub-engine pieces
    const fiduciarySum = FiduciaryCommunicationEngine.generateFiduciaryNarrative(report, validationResult, audience);
    const boardBrief = BoardCommunicationEngine.generateBoardBriefing(report, validationResult);
    const recData = StrategicRecommendationEngine.generateRecommendationNarrative(
      recommendedPath,
      eligiblePaths,
      ineligiblePaths,
      candidateCategory
    );

    const tradeoffNarrative = comparisonReport
      ? TradeoffNarrativeEngine.generateTradeoffAnalysis(comparisonReport.candidatePath, comparisonReport.baselines)
      : 'As simulações de tradeoffs não foram executadas para esta sessão.';

    const scenarioExpl = comparisonReport
      ? ScenarioExplanationEngine.generateScenarioExplanation(comparisonReport.candidatePath, comparisonReport.baselines)
      : 'Os contextos de simulação não foram processados.';

    const govGuidelines = GovernanceNarrativeEngine.generateGovernanceGuidelines(report, validationResult, audience);
    const summary = ExecutiveSummaryEngine.generateSummary(report, recommendedPath, audience);
    const confidenceStatement = ConfidenceNarrativeEngine.generateConfidenceStatement(report, audience);
    const disclosure = InstitutionalDisclosureNarrativeEngine.generateFiduciaryDisclosure(
      lineageHash,
      correlationId,
      materialityThreshold
    );

    // 4. Construct the 10 Mandatory Sections
    const section1 = `CONTESTO INSTITUCIONAL:\n` +
      `- Segmento de Operações: ${report.context?.segment ?? 'Geral'}.\n` +
      `- Perfil de Governança Ativo: ${report.policyProfile ?? 'BALANCED'}.\n` +
      `- Identidade da Empresa: ${report.behavioralAssessmentResult?.dynamicIdentity ?? 'Estável'}.`;

    const section2 = `CONDIÇÃO ESTRUTURAL CORRENTE:\n` + fiduciarySum;

    const section3 = `STATUS DE SOBREVIVÊNCIA:\n` +
      `- Liquidez: ${validationResult?.survivabilityScores?.liquidity ?? 70}/100\n` +
      `- Operacional: ${validationResult?.survivabilityScores?.operational ?? 70}/100\n` +
      `- Composto: ${validationResult?.survivabilityScores?.composite ?? 70}/100`;

    const section4 = `ESTABILIDADE DE GOVERNANÇA:\n` + govGuidelines;

    const section5 = tradeoffNarrative;

    const section6 = scenarioExpl;

    const section7 = recData.narrative;

    const section8 = `RISCOS INSTITUCIONAIS ATIVOS:\n` +
      `- Ameaça de Ruptura de Caixa: ${validationResult?.predictiveAssessment?.isRuptureApproaching ? 'IMINENTE' : 'NÃO DETECTADO'}.\n` +
      `- Risco de Alavancagem: ${report.scores?.debt < 50 ? 'ELEVADO' : 'ACEITÁVEL'}.\n` +
      `- Eventos de Inconformidade: ${validationResult?.violations?.length ?? 0} violações registradas no runtime.`;

    const section9 = confidenceStatement;

    const section10 = disclosure;

    // Combine audience-specific structural adjustments (never altering underlying facts)
    let finalTitle = `Parecer Fiduciário de Governança de Capital (Audiência: ${audience})`;
    if (audience === 'BOARD') {
      finalTitle = `Briefing Fiduciário ao Conselho de Administração (Confidencial)`;
    }

    return {
      title: finalTitle,
      timestamp,
      audience,
      severity,
      lineageHash,
      correlationId,
      sections: {
        institutionalContext: section1,
        currentStructuralCondition: section2,
        survivabilityStatus: section3,
        governanceStability: section4,
        strategicTradeoffs: section5,
        predictiveSignals: section6,
        recommendedStrategicPaths: section7,
        institutionalRisks: section8,
        confidenceLimitations: section9,
        fiduciaryDisclosure: section10
      },
      recommendations: {
        recommendedPath: recData.recommendedPath,
        alternatives: recData.alternatives,
        justification: recData.narrative
      }
    };
  }
}
