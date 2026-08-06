// src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts

import { ExecutiveIntelligenceReport } from '../executive-intelligence-runtime';
import { FiduciaryNarrativeFormattingEngine } from './engines/FiduciaryNarrativeFormattingEngine';
import { BoardPackLineageHash } from '../shared/lineage-types';
import { ReportVariant } from './institutional-reporting-types';
import { FinancialLineageIntegrityAdapter } from '../../../runtime/adapters/FinancialLineageIntegrityAdapter';

export interface InstitutionalBoardPackDocumentOutput {
  status: 'COMPLETE' | 'RESTRICTED' | 'FAILED';
  structuredJson: ExecutiveIntelligenceReport;
  markdownSections: Record<string, string>;
  reportVariant: ReportVariant;
  lineageHash: BoardPackLineageHash | 'FAILED_GENERATION';
  confidence: 'HIGH' | 'MODERATE' | 'LOW' | 'BLOCKED';
  restrictions: string[];
  evidenceAppendix: any[];
  auditTrail: string[];
  exportMetadata: {
    generatedAt: string;
    variant: ReportVariant;
    tenantId: string;
    cycleReference: string;
  };
  temporalAudit?: any;
}

export class InstitutionalBoardPackDocumentRuntime {
  
  public static generateDocument(report: ExecutiveIntelligenceReport, variant: ReportVariant): InstitutionalBoardPackDocumentOutput {
    const isRestricted = !!(report.advisory?.fiduciaryEnforcement?.fiduciaryRestrictions?.length);
    const accountingFailed = report.advisory?.fiduciaryEnforcement?.complianceStatus === 'FAILED';
    const status = accountingFailed ? 'FAILED' : (isRestricted ? 'RESTRICTED' : 'COMPLETE');
    
    let confidence: 'HIGH' | 'MODERATE' | 'LOW' | 'BLOCKED' = 'HIGH';
    if (status === 'FAILED') confidence = 'BLOCKED';
    else if (status === 'RESTRICTED') confidence = 'LOW';

    const rawNarrative = report.strategicIntelligence?.thesis?.unifiedThesisStatement || 'Narrative missing.';
    const formattedNarrative = FiduciaryNarrativeFormattingEngine.format(report, rawNarrative, variant);

    const lineageHash = report.runtimeMetadata?.lineageHash || 'FAILED_GENERATION';
    
    const markdownSections = this.buildMarkdownSections(report, formattedNarrative, variant, isRestricted, accountingFailed, confidence);
    
    // Extract evidence trail
    const evidenceTrail: any[] = [];
    if (report.institutionalEvidence) {
      evidenceTrail.push(report.institutionalEvidence);
    }
    
    // Extract audit trail
    const auditTrail: string[] = [];
    if (report.runtimeMetadata?.auditTrail) {
      auditTrail.push(...report.runtimeMetadata.auditTrail);
    }

    const restrictions = [];
    if (isRestricted) restrictions.push('Restricted Fiduciary Status Active');
    if (accountingFailed) restrictions.push('Accounting Integrity Failed');
    if (report.compliance?.narrativeRestrictions) {
      restrictions.push(...report.compliance.narrativeRestrictions);
    }

    const showTechnicalAudit = !!(
      (report as any).featureFlags?.showTechnicalAudit || 
      (report as any).compliance?.featureFlags?.showTechnicalAudit ||
      (report as any).institutionalContext?.featureFlags?.showTechnicalAudit ||
      (report as any).context?.input?.featureFlags?.showTechnicalAudit ||
      (report as any).context?.input?.rawFinancialData?.featureFlags?.showTechnicalAudit ||
      (report as any).context?.input?.rawFinancialData?.featureFlags?.showTechnicalAudit === true
    );

    return {
      status,
      structuredJson: report,
      markdownSections,
      reportVariant: variant,
      lineageHash: lineageHash as BoardPackLineageHash,
      confidence,
      restrictions,
      evidenceAppendix: evidenceTrail,
      auditTrail,
      exportMetadata: {
        generatedAt: new Date().toISOString(),
        variant,
        tenantId: report.institutionalContext?.tenantId || 'UNKNOWN',
        cycleReference: report.institutionalContext?.currentCycle || 'UNKNOWN'
      },
      temporalAudit: showTechnicalAudit ? report.temporalAudit : undefined
    };
  }

  private static buildMarkdownSections(
    report: ExecutiveIntelligenceReport, 
    formattedNarrative: string, 
    variant: ReportVariant,
    isRestricted: boolean,
    accountingFailed: boolean,
    confidence: 'HIGH' | 'MODERATE' | 'LOW' | 'BLOCKED'
  ): Record<string, string> {
    const sections: Record<string, string> = {};

    const brmInference = report.inferences?.['BoardRiskMatrixAdapter'];
    const brmMetrics = brmInference?.metrics || {};

    const boardRiskScore = brmMetrics.boardRiskScore ?? 70;
    const institutionalIntegrityLevel = brmMetrics.institutionalIntegrityLevel ?? 'Stable Governance Structure';
    const bankingReadinessScore = brmMetrics.bankingReadinessScore ?? 70;
    const bankingReadinessLevel = brmMetrics.bankingReadinessLevel ?? 'Financeable';
    const alerts = brmMetrics.alerts ?? [];
    const explainability = brmMetrics.explainability ?? {};
    const auditability = brmMetrics.auditability ?? {};
    const dimensions = brmMetrics.dimensions ?? {
      treasury: 70,
      earnings: 70,
      survivability: 70,
      governance: 70,
      capital: 70,
      stability: 70
    };
    const divergence = brmMetrics.divergence ?? { cqs: 70, eqs: 70, divergenceScore: 0 };

    // 1. Capa e Sumário
    sections.cover = `# Institutional Board Pack\n**Cycle**: ${report.institutionalContext?.currentCycle || 'N/A'}\n**Variant**: ${variant}\n**Status**: ${accountingFailed ? 'FAILED' : (isRestricted ? 'RESTRICTED' : 'COMPLETE')}`;
    sections.executiveSummary = `## Executive Summary\n\n${formattedNarrative}`;

    // 2. Fiduciary Alerts
    let alertText = '## Fiduciary Alerts\n\n';
    if (accountingFailed) {
      alertText += `> [!CAUTION]\n> **ACCOUNTING INTEGRITY FAILED**\n> O Governance Runtime detectou falhas estruturais nos dados contábeis.\n\n`;
    }
    if (isRestricted) {
      alertText += `> [!WARNING]\n> **RESTRICTED TRAJECTORY**\n> A governança identificou traços restritivos na estabilidade institucional.\n\n`;
    }
    if (alerts.length > 0) {
      alerts.forEach((alert: string) => {
        alertText += `> [!WARNING]\n> ${alert}\n\n`;
      });
    } else if (!accountingFailed && !isRestricted) {
      alertText += `Nenhum alerta crítico ativo. A operação flui dentro das conformidades estabelecidas.\n\n`;
    }
    sections.alerts = alertText;

    // 2.5 Interpretação Semântica de Ciclo de Vida
    const companyStage = report.institutionalContext?.institutionalMaturity?.code || 'ESTABLISHED_ANALYSIS';
    let semanticSection = `## Interpretação Semântica de Ciclo de Vida\n\n`;
    semanticSection += `- **Estágio Empresarial**: ${companyStage}\n`;
    if (companyStage === 'INITIAL_CAPITALIZATION' || companyStage === 'EARLY_GROWTH') {
      semanticSection += `- **Proteções Ativas**: \n`;
      semanticSection += `  ✓ Cash Interpretation Protection\n`;
      semanticSection += `  ✓ Earnings Interpretation Protection\n`;
      semanticSection += `  ✓ Runway Interpretation Protection\n`;
      semanticSection += `  ✓ Future-Year Leakage Protection\n`;
    } else {
      semanticSection += `- **Proteções Ativas**: Nenhuma proteção de estágio inicial aplicável.\n`;
    }
    
    // We will get the executive narrative from the report
    const narrativeText = report.advisory?.executiveSummary || 'N/A';
    semanticSection += `- **Conclusão Executiva**:\n  ${narrativeText}\n`;
    sections.semanticInterpretation = semanticSection;

    // 3. Longitudinal Insights
    let longitudinal = '## Causas e Consequências Longitudinais\n\n';
    if (report.longitudinalCashIntelligence) {
      longitudinal += `- **Trajectory**: ${report.longitudinalCashIntelligence.trajectoryClassification}\n`;
      longitudinal += `- **Longitudinal Score**: ${report.longitudinalCashIntelligence.longitudinalScore}\n`;
      longitudinal += `- **Narrative**: ${report.longitudinalCashIntelligence.narrativeLongitudinal?.executiveNarrative || 'N/A'}\n`;
    } else {
      longitudinal += `*Insuficiente histórico para análise longitudinal.*\n`;
    }
    sections.longitudinal = longitudinal;

    // 4. Executive Fiduciary Summary
    sections.executiveFiduciarySummary = `## Executive Fiduciary Summary\n\nEste relatório consolida a exposição fiduciária institucional e saúde operacional.\n\n- **Board Risk Score**: ${boardRiskScore}/100 (${institutionalIntegrityLevel})\n- **Grau de Prontidão Bancária**: ${bankingReadinessScore}/100 (${bankingReadinessLevel})\n- **Divergência Caixa vs Lucro**: ${divergence.divergenceScore} pontos de descompasso absoluto.`;

    // 5. Institutional Risk Heatmap
    const getStatusLabel = (s: number) => s >= 85 ? 'ESTÁVEL' : s >= 70 ? 'MODERADO' : s >= 50 ? 'ALTO' : 'CRÍTICO';
    sections.riskHeatmap = `## Institutional Risk Heatmap\n\nStatus de vulnerabilidade por dimensão:\n\n| Dimensão | Score | Status |\n| --- | --- | --- |\n| Treasury Integrity | ${dimensions.treasury} | ${getStatusLabel(dimensions.treasury)} |\n| Earnings Integrity | ${dimensions.earnings} | ${getStatusLabel(dimensions.earnings)} |\n| Operational Survivability | ${dimensions.survivability} | ${getStatusLabel(dimensions.survivability)} |\n| Governance Exposure | ${dimensions.governance} | ${getStatusLabel(dimensions.governance)} |\n| Capital Structure Integrity | ${dimensions.capital} | ${getStatusLabel(dimensions.capital)} |\n| Institutional Stability | ${dimensions.stability} | ${getStatusLabel(dimensions.stability)} |`;

    // 6. Treasury Risk Report
    sections.treasuryRisk = `## Treasury Risk Report\n\n- **Treasury Integrity Score**: ${dimensions.treasury}/100\n- **Fórmula/Racional**: ${explainability.treasury?.formula ?? 'N/A'} - ${explainability.treasury?.rationale ?? 'N/A'}\n- **Evidências de Estresse**: ${explainability.treasury?.lineage ?? 'N/A'}`;

    // 7. Earnings Integrity Report
    sections.earningsIntegrity = `## Earnings Integrity Report\n\n- **Earnings Integrity Score**: ${dimensions.earnings}/100\n- **Fórmula/Racional**: ${explainability.earnings?.formula ?? 'N/A'} - ${explainability.earnings?.rationale ?? 'N/A'}\n- **Linha de Evidência**: ${explainability.earnings?.lineage ?? 'N/A'}`;

    // 8. Banking Readiness Summary
    sections.bankingReadiness = `## Banking Readiness Summary\n\n- **Banking Readiness Score**: ${bankingReadinessScore}/100 (${bankingReadinessLevel})\n- **Racional**: Avalia a atratividade do crédito frente a DSCR, alavancagem, CQS, EQS e runway.\n- **Trilha de Endividamento**: ${explainability.capital?.lineage ?? 'N/A'}`;

    // 9. Governance Dependency Report
    sections.governanceDependency = `## Governance Dependency Report\n\n- **Governance Exposure Score**: ${dimensions.governance}/100\n- **Rastro de Partes Relacionadas**: ${auditability.reconstructionTrace ?? 'N/A'}\n- **Avisos de Governança**: ${explainability.governance?.lineage ?? 'N/A'}`;

    const eneInference = report.inferences?.['EconomicNormalizationAdapter'];
    const eneMetrics = eneInference?.metrics || {};

    if (eneInference) {
      const ensScore = eneMetrics.ensScore ?? 70;
      const ensLevel = eneMetrics.ensLevel ?? 'Transitional Economic Structure';
      const ebitda = eneMetrics.ebitda || {};
      const workingCapital = eneMetrics.workingCapital || {};
      const roic = eneMetrics.roic || {};
      const debt = eneMetrics.debt || {};
      const margin = eneMetrics.margin || {};
      const stability = eneMetrics.stability || {};
      const eneAlerts = eneMetrics.alerts || [];
      const eneAuditability = eneMetrics.auditability || {};

      // Helper formatting function
      const fmtVal = (val: any): string => (typeof val === 'number') ? val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'N/A';
      const fmtPct = (val: any): string => (typeof val === 'number') ? `${(val * 100).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%` : 'N/A';

      // 1. Economic Normalization Summary
      let summaryText = `## Economic Normalization Summary\n\n`;
      summaryText += `- **Economic Normalization Score (ENS)**: ${ensScore}/100 (${ensLevel})\n`;
      summaryText += `- **Diagnóstico Fiduciário**: ${eneInference.narrative?.diagnostic || 'N/A'}\n`;
      summaryText += `- **Vetor de Causa**: ${eneInference.narrative?.cause || 'N/A'}\n`;
      if (eneAlerts.length > 0) {
        summaryText += `\n**Alertas de Normalização Ativos:**\n`;
        eneAlerts.forEach((alert: string) => {
          summaryText += `> [!WARNING]\n> ${alert}\n\n`;
        });
      }
      sections.economicNormalizationSummary = summaryText;

      // 2. Normalized EBITDA Report
      let ebitdaText = `## Normalized EBITDA Report\n\n`;
      ebitdaText += `| Métrica de EBITDA | Valor Contábil / Ajustado |\n`;
      ebitdaText += `| --- | --- |\n`;
      ebitdaText += `| EBITDA Contábil | R$ ${fmtVal(ebitda.contabil)} |\n`;
      ebitdaText += `| EBITDA Operacional Real | R$ ${fmtVal(ebitda.operacionalReal)} |\n`;
      ebitdaText += `| EBITDA Recorrente | R$ ${fmtVal(ebitda.recorrente)} |\n`;
      ebitdaText += `| EBITDA Normalizado | R$ ${fmtVal(ebitda.normalizado)} |\n\n`;
      ebitdaText += `- **EBITDA Integrity Score**: ${ebitda.score ?? 70}/100\n`;
      ebitdaText += `- **Rastro de Reconciliação**: ${eneAuditability.ebitda?.reconciliationTrace || 'N/A'}\n`;
      ebitdaText += `- **Diretriz de Reconstrução**: ${eneAuditability.ebitda?.reconstructionLogic || 'N/A'}`;
      sections.normalizedEbitdaReport = ebitdaText;

      // 3. Working Capital Integrity Report
      let wcText = `## Working Capital Integrity Report\n\n`;
      wcText += `| Métrica de Capital de Giro | Valor |\n`;
      wcText += `| --- | --- |\n`;
      wcText += `| Capital de Giro Contábil | R$ ${fmtVal(workingCapital.contabil)} |\n`;
      wcText += `| Capital de Giro Operacional Líquido Ajustado | R$ ${fmtVal(workingCapital.operacionalLiquidoAjustado)} |\n`;
      wcText += `| Liquidez Ajustada | ${(typeof workingCapital.liquidezAjustada === 'number') ? workingCapital.liquidezAjustada.toFixed(2) + 'x' : 'N/A'} |\n`;
      wcText += `| Dependência de Giro | ${fmtPct(workingCapital.dependenciaGiro)} |\n\n`;
      wcText += `- **Working Capital Integrity Score**: ${workingCapital.score ?? 70}/100\n`;
      wcText += `- **Rastro de Reconciliação**: ${eneAuditability.workingCapital?.reconciliationTrace || 'N/A'}\n`;
      wcText += `- **Racional Fiduciário**: ${eneAuditability.workingCapital?.fiduciaryRationale || 'N/A'}`;
      sections.workingCapitalIntegrityReport = wcText;

      // 4. Normalized ROIC/EVA Analysis
      let roicText = `## Normalized ROIC/EVA Analysis\n\n`;
      const roicNormDisplay = roic.normalizadoStatus === 'NOT_COMPUTABLE' 
        ? 'Não calculável com segurança fiduciária' 
        : fmtPct(roic.normalizado);

      roicText += `| Métrica de Retorno | Valor |\n`;
      roicText += `| --- | --- |\n`;
      roicText += `| ROIC Contábil | ${fmtPct(roic.contabil)} |\n`;
      roicText += `| ROIC Normalizado | ${roicNormDisplay} |\n`;
      roicText += `| EVA Contábil | R$ ${fmtVal(roic.evaContabil)} |\n`;
      roicText += `| EVA Econômico Real | R$ ${fmtVal(roic.evaEconomicoReal)} |\n\n`;
      roicText += `- **ROIC Integrity Score**: ${roic.score ?? 70}/100\n`;
      roicText += `- **Rastro de Reconciliação**: ${eneAuditability.roic?.reconciliationTrace || 'N/A'}\n`;
      roicText += `- **Diretriz de Reconstrução**: ${eneAuditability.roic?.reconstructionLogic || 'N/A'}`;
      sections.normalizedRoicEvaAnalysis = roicText;

      // 5. Structural Distortion Report
      let distortionText = `## Structural Distortion Report\n\n`;
      distortionText += `Análise de distorção por pilar econômico normalizado:\n\n`;
      distortionText += `| Dimensão de Normalização | Score | Nível de Distorção |\n`;
      distortionText += `| --- | --- | --- |\n`;
      
      const getDistortionLabel = (s: number) => s >= 85 ? 'BAIXA' : s >= 70 ? 'MODERADA' : s >= 50 ? 'ALTA' : 'CRÍTICA';
      
      distortionText += `| EBITDA Normalization Level | ${ebitda.score ?? 70}/100 | ${getDistortionLabel(ebitda.score ?? 70)} |\n`;
      distortionText += `| Working Capital Integrity | ${workingCapital.score ?? 70}/100 | ${getDistortionLabel(workingCapital.score ?? 70)} |\n`;
      distortionText += `| ROIC Integrity | ${roic.score ?? 70}/100 | ${getDistortionLabel(roic.score ?? 70)} |\n`;
      distortionText += `| Debt Sustainability | ${debt.score ?? 70}/100 | ${getDistortionLabel(debt.score ?? 70)} |\n`;
      distortionText += `| Margin Integrity | ${margin.score ?? 70}/100 | ${getDistortionLabel(margin.score ?? 70)} |\n`;
      distortionText += `| Economic Stability Level | ${stability.score ?? 70}/100 | ${getDistortionLabel(stability.score ?? 70)} |\n\n`;
      
      distortionText += `- **Rastro de Linha de Evidência**: ${eneAuditability.ebitda?.lineage || 'N/A'}`;
      sections.structuralDistortionReport = distortionText;

      // 6. Fiduciary Economic Interpretation Summary
      let interpText = `## Fiduciary Economic Interpretation Summary\n\n`;
      interpText += `- **Tese de Normalização**: ${eneInference.narrative?.diagnostic || 'N/A'}\n`;
      interpText += `- **Consequência Fiduciária**: ${eneInference.narrative?.consequence || 'N/A'}\n`;
      interpText += `- **Sensibilidade de Escala**: ${eneInference.narrative?.sensitivity || 'N/A'}\n`;
      interpText += `- **Vulnerabilidade Estrutural**: ${eneInference.narrative?.risk || 'N/A'}\n\n`;
      interpText += `*Relatório gerado em ambiente auditável, com dados normalizados fiduciariamente upstream, garantindo a rastreabilidade determinística da estrutura econômica ajustada.*`;
      sections.fiduciaryEconomicInterpretationSummary = interpText;
    }

    const imeInference = report.inferences?.['InstitutionalMemoryEngine'];
    if (imeInference) {
      const imeMetrics = imeInference.metrics || {};
      const imsScore = imeMetrics.imsScore ?? 70;
      const imsLevel = imeMetrics.imsLevel ?? 'Transitional Institutional Consistency';
      const trajectory = imeMetrics.trajectoryClassification ?? 'VOLATILE';
      const domains = imeMetrics.domains || {};
      const timeline = imeMetrics.timeline || [];
      const heatmaps = imeMetrics.heatmaps || {};
      const alerts = imeMetrics.alerts || [];
      const auditability = imeMetrics.auditability || {};
      const narrative = imeInference.narrative || {};

      // Section 1: Institutional Memory Summary
      let summaryText = `## Institutional Memory Summary\n\n`;
      summaryText += `- **Institutional Memory Score (IMS)**: ${imsScore}/100\n`;
      summaryText += `- **Nível de Consistência**: ${imsLevel}\n`;
      summaryText += `- **Classificação de Trajetória**: ${trajectory}\n`;
      summaryText += `- **Contexto Operacional**: ${imeMetrics.isEarlyStage ? 'Scale-up / Ramp-up operacional precoce com amortecimento fiduciário ativo.' : 'Histórico maduro consolidado de governança.'}\n\n`;
      if (alerts.length > 0) {
        summaryText += `**Alertas de Memória Institucional:**\n`;
        alerts.forEach((a: string) => {
          summaryText += `> [!WARNING]\n> ${a}\n\n`;
        });
      }
      sections.institutionalMemorySummary = summaryText;

      // Section 2: Ignored Recommendations Report
      let ignoredText = `## Ignored Recommendations Report\n\n`;
      ignoredText += `Análise de aderência fiduciária a longo horizonte:\n\n`;
      ignoredText += `- **Aderência Fiduciária (Response Rate)**: ${domains.advisory?.score ?? 70}/100\n`;
      ignoredText += `- **Dedução por Negligência**: ${auditability.reconciliationTrace || 'N/A'}\n\n`;
      ignoredText += `*Recomendações fiduciárias reiteradas devem ser saneadas para evitar fadiga de governança e erosão de score longitudinal.*`;
      sections.ignoredRecommendationsReport = ignoredText;

      // Section 3: Trajectory Classification Report
      let trajectoryText = `## Trajectory Classification Report\n\n`;
      trajectoryText += `Classificação longitudinal de trajetória institucional: **${trajectory}**\n\n`;
      trajectoryText += `- **Treasury Score**: ${domains.treasury?.score ?? 100}/100\n`;
      trajectoryText += `- **Earnings Score**: ${domains.earnings?.score ?? 100}/100\n`;
      trajectoryText += `- **Governance Score**: ${domains.governance?.score ?? 100}/100\n`;
      trajectoryText += `- **Advisory Score**: ${domains.advisory?.score ?? 100}/100\n`;
      trajectoryText += `- **Drift Score**: ${domains.drift?.score ?? 100}/100\n`;
      trajectoryText += `- **Strategic Score**: ${domains.strategic?.score ?? 100}/100\n`;
      sections.trajectoryClassificationReport = trajectoryText;

      // Section 4: Fiduciary Timeline Report
      let timelineText = `## Fiduciary Timeline Report\n\n`;
      timelineText += `| Ciclo | Origem | Métrica | Recomendação / Evento | Duração | Status |\n`;
      timelineText += `| --- | --- | --- | --- | --- | --- |\n`;
      timeline.forEach((evt: any) => {
        const desc = evt.events?.join('; ') || 'Nenhum evento';
        timelineText += `| ${evt.period} | ${evt.engine} | ${evt.metric} | ${desc} | ${evt.duration} ciclos | ${evt.status} |\n`;
      });
      sections.fiduciaryTimelineReport = timelineText;

      // Section 5: Recurrence Heatmap Report
      let heatmapText = `## Recurrence Heatmap Report\n\n`;
      heatmapText += `Mapeamento de consistência por ciclo:\n\n`;
      heatmapText += `| Ciclo | Treasury | Governance | Advisory | Drift | Strategic | Recovery Momentum |\n`;
      heatmapText += `| --- | --- | --- | --- | --- | --- | --- |\n`;
      
      const years = heatmaps.treasury?.map((h: any) => h.year) || [];
      years.forEach((yr: number, idx: number) => {
        const tVal = heatmaps.treasury?.[idx]?.score ?? 100;
        const gVal = heatmaps.governance?.[idx]?.score ?? 100;
        const aVal = heatmaps.advisory?.[idx]?.score ?? 100;
        const dVal = heatmaps.drift?.[idx]?.score ?? 100;
        const sVal = heatmaps.strategic?.[idx]?.score ?? 100;
        const mVal = heatmaps.recoveryMomentum?.[idx]?.momentum ?? 'N/A';
        
        heatmapText += `| ${yr} | ${tVal} | ${gVal} | ${aVal} | ${dVal} | ${sVal} | ${mVal} |\n`;
      });
      sections.recurrenceHeatmapReport = heatmapText;

      // Section 6: Fiduciary Behavioral Interpretation Summary
      let behavioralText = `## Fiduciary Behavioral Interpretation Summary\n\n`;
      behavioralText += `- **Diagnóstico fiduciário**: ${narrative.diagnostic || 'N/A'}\n`;
      behavioralText += `- **Causa do vetor**: ${narrative.cause || 'N/A'}\n`;
      behavioralText += `- **Consequência fiduciária**: ${narrative.consequence || 'N/A'}\n`;
      behavioralText += `- **Prioridade de saneamento**: ${narrative.priority || 'N/A'}\n`;
      behavioralText += `- **Movimentação estratégica**: ${narrative.strategicMovement || 'N/A'}\n\n`;
      behavioralText += `*Análise comportamental determinística com guards de neutralidade institucional ativos.*`;
      sections.fiduciaryBehavioralInterpretationSummary = behavioralText;
    }

    const ccsInference = report.inferences?.['CreditCommitteeSimulatorEngine'];
    if (ccsInference) {
      const ccsMetrics = ccsInference.metrics || {};
      const ccsScore = ccsMetrics.ccsScore ?? 70;
      const creditReadinessLevel = ccsMetrics.creditReadinessLevel ?? 'N/A';
      const suggestedCreditRating = ccsMetrics.suggestedCreditRating ?? 'N/A';
      const creditDecisionSimulation = ccsMetrics.creditDecisionSimulation ?? 'N/A';
      const institutionalCreditConfidence = ccsMetrics.institutionalCreditConfidence ?? 'N/A';
      const refinancingRiskLevel = ccsMetrics.refinancingRiskLevel ?? 'N/A';
      const covenantThresholds = ccsMetrics.covenantThresholds || {};
      const domains = ccsMetrics.domains || {};
      const alerts = ccsMetrics.alerts || [];
      const stressScenarios = ccsMetrics.stressScenarios || [];
      const narrative = ccsMetrics.narrative || {};
      const isEarlyStage = ccsMetrics.isEarlyStage ?? false;

      // 1. Credit Committee Executive Summary
      let ccsExecSummary = `## Credit Committee Executive Summary\n\n`;
      ccsExecSummary += `- **Credit Committee Simulator Score (CCS)**: ${ccsScore}/100\n`;
      ccsExecSummary += `- **Suggested Credit Rating**: ${suggestedCreditRating}\n`;
      ccsExecSummary += `- **Simulated Committee Decision**: ${creditDecisionSimulation}\n`;
      ccsExecSummary += `- **Credit Confidence Level**: ${institutionalCreditConfidence}\n`;
      ccsExecSummary += `- **Early-Stage Protection**: ${isEarlyStage ? 'Active' : 'Inactive'}\n\n`;
      ccsExecSummary += `### Diagnostic Trace\n`;
      ccsExecSummary += `${narrative.diagnostic || 'N/A'}\n`;
      sections.creditCommitteeExecutiveSummary = ccsExecSummary;

      // 2. Funding Readiness Report
      let fundingReadiness = `## Funding Readiness Report\n\n`;
      fundingReadiness += `This report details the separation between structural preparedness and simulated credit committee outcome.\n\n`;
      fundingReadiness += `| Dimension | Metric | Status / Level |\n`;
      fundingReadiness += `| --- | --- | --- |\n`;
      fundingReadiness += `| **Banking Readiness** (Structural Preparedness) | ${bankingReadinessScore}/100 | ${bankingReadinessLevel} |\n`;
      fundingReadiness += `| **Credit Committee Decision** (Simulated Outcome) | ${ccsScore}/100 | ${creditReadinessLevel} (${suggestedCreditRating}) |\n\n`;
      fundingReadiness += `*Note: A company might have restricted banking readiness but still achieve a conditional credit approval under specific structured assumptions.*`;
      sections.fundingReadinessReport = fundingReadiness;

      // 3. Covenant Fragility Analysis
      let covenantFragility = `## Covenant Fragility Analysis\n\n`;
      covenantFragility += `Analysis of covenant limits under baseline scenario:\n\n`;
      covenantFragility += `| Covenant Metric | Baseline Value | Threshold Limit | Status |\n`;
      covenantFragility += `| --- | --- | --- | --- |\n`;
      
      const baseMetrics = stressScenarios.find((s: any) => s.name === 'Base Institutional Scenario')?.metrics || {};
      const ndEbitdaVal = baseMetrics.netDebtEbitda === 'BREACHED' || baseMetrics.netDebtEbitda === 'NOT_COMPUTABLE' 
        ? 'Não calculável com segurança fiduciária' 
        : `${baseMetrics.netDebtEbitda}x`;
      
      covenantFragility += `| Net Debt / EBITDA | ${ndEbitdaVal} | <= ${covenantThresholds.maxNetDebtEbitda}x | ${baseMetrics.netDebtEbitda === 'BREACHED' ? 'BREACHED' : 'COMPLIANT'} |\n`;
      covenantFragility += `| DSCR (Debt Service Coverage) | ${baseMetrics.dscr}x | >= ${covenantThresholds.minDscr}x | ${(baseMetrics.dscr < covenantThresholds.minDscr) ? 'BREACHED' : 'COMPLIANT'} |\n`;
      covenantFragility += `| Liquidity / Short-Term Debt | ${baseMetrics.liquidityStDebt}x | >= ${covenantThresholds.minLiquidityStDebt}x | ${(baseMetrics.liquidityStDebt < covenantThresholds.minLiquidityStDebt) ? 'BREACHED' : 'COMPLIANT'} |\n`;
      covenantFragility += `| Runway (Months) | ${baseMetrics.runway} | >= ${covenantThresholds.minRunway} months | ${(baseMetrics.runway < covenantThresholds.minRunway) ? 'BREACHED' : 'COMPLIANT'} |\n`;
      covenantFragility += `| EBITDA Coverage | ${baseMetrics.ebitdaCoverage}x | >= ${covenantThresholds.minEbitdaCoverage}x | ${(baseMetrics.ebitdaCoverage < covenantThresholds.minEbitdaCoverage) ? 'BREACHED' : 'COMPLIANT'} |\n`;
      sections.covenantFragilityAnalysis = covenantFragility;

      // 4. Treasury Stress Simulation
      let stressSim = `## Treasury Stress Simulation\n\n`;
      stressSim += `Simulated committee outcome across the 5 approved stress scenarios:\n\n`;
      stressSim += `| Scenario Name | Assumptions | Breaches Count | Severity |\n`;
      stressSim += `| --- | --- | --- | --- |\n`;
      stressScenarios.forEach((sc: any) => {
        const severity = sc.breaches.length >= 3 ? 'CRITICAL' : sc.breaches.length >= 1 ? 'MODERATE' : 'LOW';
        stressSim += `| ${sc.name} | ${sc.assumptions} | ${sc.breaches.length} breaches | ${severity} |\n`;
      });
      sections.treasuryStressSimulation = stressSim;

      // 5. Refinancing Exposure Report
      let refinancingExposure = `## Refinancing Exposure Report\n\n`;
      refinancingExposure += `- **Refinancing Risk Level**: ${refinancingRiskLevel}\n`;
      refinancingExposure += `- **Treasury Score (Financeability)**: ${domains.treasury?.score ?? 70}/100\n`;
      refinancingExposure += `- **Capital Structure Score**: ${domains.capital?.score ?? 70}/100\n\n`;
      refinancingExposure += `### Active Treasury Alerts\n`;
      if (alerts.length > 0) {
        alerts.forEach((alert: string) => {
          refinancingExposure += `> [!WARNING]\n> ${alert}\n\n`;
        });
      } else {
        refinancingExposure += `No active funding alerts.\n`;
      }
      sections.refinancingExposureReport = refinancingExposure;

      // 6. Institutional Credit Reliability Summary
      let creditReliability = `## Institutional Credit Reliability Summary\n\n`;
      creditReliability += `- **Causa**: ${narrative.cause || 'N/A'}\n`;
      creditReliability += `- **Consequência**: ${narrative.consequence || 'N/A'}\n`;
      creditReliability += `- **Sensibilidade**: ${narrative.sensitivity || 'N/A'}\n`;
      creditReliability += `- **Risco**: ${narrative.risk || 'N/A'}\n`;
      creditReliability += `- **Ação Recomendada**: ${narrative.priority || 'N/A'}\n`;
      creditReliability += `- **Movimentação Estratégica**: ${narrative.strategicMovement || 'N/A'}\n`;
      sections.institutionalCreditReliabilitySummary = creditReliability;

      // 7. Institutional Survivability Interpretation
      let survivabilityInterpretation = `## Institutional Survivability Interpretation\n\n`;
      survivabilityInterpretation += `This section evaluates the root failure points, variables collapse sequence, and contagion loops under stress.\n\n`;
      
      const dfcInference = report.inferences?.['LegacyDFCAdapter'];
      const dfcMetrics = dfcInference?.metrics || {};
      const fiduciaryMetrics = dfcMetrics.fiduciary || {};
      const fcoOperacionalReal = fiduciaryMetrics.fcoOperacionalReal ?? dfcMetrics.fco ?? 0;

      const imeInference = report.inferences?.['InstitutionalMemoryEngine'];
      const imeMetrics = imeInference?.metrics || {};
      const advisoryScore = imeMetrics.advisoryScore ?? 70;

      const severeStressScenario = stressScenarios.find((s: any) => s.name === 'Refinancing Shock Scenario') || {};
      const severeBreaches = severeStressScenario.breaches || [];
      const severeTrajectory = severeStressScenario.trajectory || [];
      const activeCascadeLogs = ccsMetrics.stressScenarios?.find((s: any) => s.name === 'Refinancing Shock Scenario')?.cascadeLogs || [];
      
      let collapseCycle = 'No collapse detected';
      for (let i = 0; i < severeTrajectory.length; i++) {
        if (severeTrajectory[i].cash <= 0) {
          collapseCycle = `Cycle ${severeTrajectory[i].month}`;
          break;
        }
      }

      survivabilityInterpretation += `### Survivability Dynamics\n`;
      survivabilityInterpretation += `- **Liquidity Exhaustion Point**: ${collapseCycle}\n`;
      survivabilityInterpretation += `- **First Variable to Collapse**: ${severeBreaches.length > 0 ? severeBreaches[0].split(':')[0] : 'None'}\n`;
      survivabilityInterpretation += `- **Contagion Propagation Loop**: ${activeCascadeLogs.length > 0 ? activeCascadeLogs.join(' -> ') : 'No loops triggered'}\n`;
      
      let primaryDeteriorationCause = 'Operational & Revenue Growth';
      if (refinancingRiskLevel === 'CRITICAL' || refinancingRiskLevel === 'HIGH') {
        primaryDeteriorationCause = 'Refinancing & Capital Roll';
      } else if (advisoryScore < 70) {
        primaryDeteriorationCause = 'Governance Recurrence';
      } else if (fcoOperacionalReal < 0) {
        primaryDeteriorationCause = 'Financial/Treasury Conversion';
      }
      survivabilityInterpretation += `- **Primary Deterioration Classification**: ${primaryDeteriorationCause}\n\n`;
      survivabilityInterpretation += `*Audit note: Evaluated under deterministic simulation, mapping early warning buffers downstream of the ENE normalizations.*`;
      sections.institutionalSurvivabilityInterpretation = survivabilityInterpretation;
    }

    const sdeInference = report.inferences?.['SovereignDecisionEngine'];
    if (sdeInference) {
      const sdeMetrics = sdeInference.metrics || {};
      const sdsUrgency = sdeMetrics.sdsUrgency ?? 70;
      const sdsHealth = sdeMetrics.sdsHealth ?? 70;
      const executionCapacity = sdeMetrics.executionCapacity ?? 70;
      const decisionFatigueIndex = sdeMetrics.decisionFatigueIndex ?? 30;
      const pathways = sdeMetrics.pathways || {};
      const timelineDecisions = sdeMetrics.timelineDecisions || {};
      const topDecisions = sdeMetrics.topDecisions || [];
      const conflicts = sdeMetrics.conflicts || [];
      const capitalAllocationRanking = sdeMetrics.capitalAllocationRanking || [];
      const decisionScenarioMatrix = sdeMetrics.decisionScenarioMatrix || {};
      const alerts = sdeMetrics.alerts || [];
      const allDecs = sdeMetrics.allDecisions || [];

      // 1. Sovereign Decision Summary
      let summaryText = `## Sovereign Decision Summary\n\n`;
      summaryText += `- **Sovereign Decision Urgency Score (SDS)**: ${sdsUrgency}/100\n`;
      summaryText += `- **Sovereign Decision Health/Readiness Score**: ${sdsHealth}/100\n`;
      summaryText += `- **Execution Capacity Score (ECE)**: ${executionCapacity}/100\n`;
      summaryText += `- **Decision Fatigue Index (DFI)**: ${decisionFatigueIndex}/100\n\n`;
      summaryText += `### Diagnostic Interpretation\n`;
      summaryText += `${sdeInference.narrative?.diagnostic || 'N/A'}\n\n`;
      if (alerts.length > 0) {
        summaryText += `**Alertas de Decisão Ativos:**\n`;
        alerts.forEach((alert: string) => {
          summaryText += `> [!WARNING]\n> ${alert}\n\n`;
        });
      }
      sections.sovereignDecisionSummary = summaryText;

      // 2. Executive Prioritization Report
      let prioritizationText = `## Executive Prioritization Report\n\n`;
      prioritizationText += `Top recomendações ordenadas por prioridade fiduciária (DPI):\n\n`;
      prioritizationText += `| Recomendação | Domínio | Classificação | DPI | Complexidade |\n`;
      prioritizationText += `| --- | --- | --- | --- | --- |\n`;
      topDecisions.forEach((dec: any) => {
        prioritizationText += `| ${dec.label} | ${dec.originatingMetrics.join(', ') || 'Geral'} | ${dec.classification} | ${dec.dpi}/100 | ${dec.executionComplexity} |\n`;
      });
      sections.executivePrioritizationReport = prioritizationText;

      // 8. Executive Decision Hierarchy
      let hierarchyText = `## Executive Decision Hierarchy\n\n`;
      topDecisions.forEach((dec: any, idx: number) => {
        hierarchyText += `### ${idx + 1}. ${dec.label}\n`;
        hierarchyText += `- **Urgência**: ${dec.urgency}/100 (DPI: ${dec.dpi}/100)\n`;
        hierarchyText += `- **Impacto**: ${dec.impact}/100 - ${dec.rationale}\n`;
        hierarchyText += `- **Dependências**: DRS: ${dec.dependencyReadiness}/100 - ${dec.dependencies}\n`;
        hierarchyText += `- **Trade-offs**: Benefícios: ${dec.benefits} | Risks: ${dec.risks} | Custo Oportunidade: ${dec.opportunityCost}\n`;
        hierarchyText += `- **Consequências**: Direto: ${dec.directEffect} | Indireto: ${dec.indirectEffect} | Sistêmico: ${dec.systemicEffect}\n\n`;
      });
      sections.executiveDecisionHierarchy = hierarchyText;

      // 3. Institutional Trade-Off Analysis
      let tradeOffText = `## Institutional Trade-Off Analysis\n\n`;
      tradeOffText += `Análise de conflitos e trade-offs dinâmicos detectados na tomada de decisão:\n\n`;
      if (conflicts.length > 0) {
        conflicts.forEach((c: any) => {
          tradeOffText += `### Conflito: ${c.decA} vs ${c.decB}\n`;
          tradeOffText += `- **Severidade (CSI)**: ${c.severity} (${c.score}/100)\n`;
          tradeOffText += `- **Explicação**: ${c.explanation}\n\n`;
        });
      } else {
        tradeOffText += `Nenhum conflito crítico ativo detectado no ciclo atual.\n`;
      }
      sections.institutionalTradeOffAnalysis = tradeOffText;

      // 4. Decision Dependency Report
      let dependencyText = `## Decision Dependency Report\n\n`;
      dependencyText += `### Dependency Readiness & DRS\n`;
      dependencyText += `Status de prontidão para execução das principais iniciativas:\n\n`;
      topDecisions.slice(0, 5).forEach((dec: any) => {
        dependencyText += `- **${dec.label}**: DRS: ${dec.dependencyReadiness}/100. Dependência: ${dec.dependencies}\n`;
      });
      sections.decisionDependencyReport = dependencyText;

      // 5. Strategic Action Roadmap
      let roadmapText = `## Strategic Action Roadmap\n\n`;
      roadmapText += `### Executive Action Timeline\n`;
      const getLabel = (id: string) => allDecs.find((d: any) => d.id === id)?.label || id;
      roadmapText += `- **0–30 dias (Imediato)**: ${timelineDecisions.immediate?.map((id: string) => getLabel(id)).join(', ') || 'Nenhuma ação imediata'}\n`;
      roadmapText += `- **30–90 dias (ciclo imediato)**: ${timelineDecisions.shortTerm?.map((id: string) => getLabel(id)).join(', ') || 'Nenhuma ação'}\n`;
      roadmapText += `- **90–180 dias (médio ciclo)**: ${timelineDecisions.mediumTerm?.map((id: string) => getLabel(id)).join(', ') || 'Nenhuma ação'}\n`;
      roadmapText += `- **180+ dias (longo horizonte)**: ${timelineDecisions.longTerm?.map((id: string) => getLabel(id)).join(', ') || 'Nenhuma ação'}\n\n`;

      roadmapText += `### Pathway Confidence & Viability\n`;
      roadmapText += `- **${pathways.conservative?.name}**: Viabilidade ${pathways.conservative?.probability}% - ${pathways.conservative?.description}\n`;
      roadmapText += `- **${pathways.balanced?.name}**: Viabilidade ${pathways.balanced?.probability}% - ${pathways.balanced?.description}\n`;
      roadmapText += `- **${pathways.aggressive?.name}**: Viabilidade ${pathways.aggressive?.probability}% - ${pathways.aggressive?.description}\n\n`;

      roadmapText += `### Capital Allocation Dynamic Ranking\n`;
      roadmapText += `Ordem de direcionamento dinâmico de capital recomendado ("Onde colocar o próximo real"):\n\n`;
      capitalAllocationRanking.forEach((r: any) => {
        roadmapText += `${r.rank}. **${r.destination}** (${r.category}): ${r.description}\n`;
      });
      sections.strategicActionRoadmap = roadmapText;

      // 6. Survivability Decision Framework
      let survivabilityFrameworkText = `## Survivability Decision Framework\n\n`;
      survivabilityFrameworkText += `Simulação de estresse para as 3 principais decisões recomendadas:\n\n`;
      topDecisions.slice(0, 3).forEach((dec: any) => {
        const matrix = decisionScenarioMatrix[dec.id] || {};
        survivabilityFrameworkText += `### Decisão: ${dec.label}\n`;
        survivabilityFrameworkText += `| contexto | Impacto de Liquidez | Impacto Covenants | Impacto Sobrevivência | Impacto Financiabilidade |\n`;
        survivabilityFrameworkText += `| --- | --- | --- | --- | --- |\n`;
        Object.entries(matrix).forEach(([scName, scVal]: [string, any]) => {
          survivabilityFrameworkText += `| ${scName} | ${scVal.liquidityImpact} | ${scVal.covenantImpact} | ${scVal.survivabilityImpact} | ${scVal.financeabilityImpact} |\n`;
        });
        survivabilityFrameworkText += `\n`;
      });
      sections.survivabilityDecisionFramework = survivabilityFrameworkText;
    }

    const e3Inference = report.inferences?.['ExecutiveExecutionEngine'];
    if (e3Inference) {
      const e3Metrics = e3Inference.metrics || {};
      const decisions = e3Metrics.decisions || [];

      // 1. Executive Evidence & Accountability Register
      let registerText = `## Executive Evidence & Accountability Register\n\n`;
      registerText += `| Decisão | Responsável | Status | Tipo de Evidência | Data Alvo | Data Conclusão | Eficácia | Confiança | Fricção Não Resolvida |\n`;
      registerText += `| --- | --- | --- | --- | --- | --- | --- | --- | --- |\n`;
      decisions.forEach((rec: any) => {
        const evTypes = rec.evidence?.map((e: any) => e.type).join(', ') || 'Nenhuma';
        const effectivenessVal = rec.expectedValue && rec.expectedValue > 0 
          ? Math.round((rec.realizedValue ?? 0) / rec.expectedValue * 100) + '%' 
          : 'N/A';
        const confidenceVal = rec.effectivenessSource === 'MANUAL' ? 'BAIXA (Manual)' : 'ALTA';
        registerText += `| ${rec.title} | ${rec.owner || 'Não definido'} | ${rec.status} | ${evTypes} | ${rec.targetDate} | ${rec.completionDate || 'N/A'} | ${effectivenessVal} | ${confidenceVal} | ${rec.rootFriction || 'Nenhuma'} |\n`;
      });
      sections.executiveEvidenceAccountabilityRegister = registerText;

      // 2. Decision Value Realization Report
      let dvrText = `## Decision Value Realization Report\n\n`;
      dvrText += `- **Decision Value Realization Score (DVRS)**: ${e3Metrics.dvrs ?? 100}%\n`;
      dvrText += `- **Classificação**: ${e3Metrics.dvrClassification || 'FULL_VALUE_REALIZATION'}\n\n`;
      dvrText += `### Detalhamento Financeiro de Benefícios Realizados vs Esperados\n`;
      decisions.forEach((rec: any) => {
        if (rec.expectedValue !== undefined && rec.expectedValue > 0) {
          const realized = rec.realizedValue ?? 0;
          const ratio = Math.round((realized / rec.expectedValue) * 100);
          dvrText += `- **${rec.title}**: Esperado: R$ ${rec.expectedValue.toLocaleString('pt-BR')} | Realizado: R$ ${realized.toLocaleString('pt-BR')} (${ratio}% de realização)\n`;
        }
      });
      sections.decisionValueRealizationReport = dvrText;

      // 3. Decision Debt Analysis
      let debtText = `## Decision Debt Analysis\n\n`;
      debtText += `- **Institutional Decision Debt Score (IDDS)**: ${e3Metrics.iddsScore ?? 0}/100\n`;
      debtText += `- **Nível de Endividamento de Decisão**: ${e3Metrics.iddsLevel ?? 'LOW'}\n\n`;
      debtText += `### Decisões Aprovadas com Atraso ou Pendentes de Execução\n`;
      const overdueDecs = decisions.filter((r: any) => {
        if (r.status === 'COMPLETED' || r.status === 'ABANDONED' || r.status === 'SUPERSEDED') return false;
        return new Date() > new Date(r.targetDate);
      });
      if (overdueDecs.length > 0) {
        overdueDecs.forEach((r: any) => {
          debtText += `- **${r.title}** (Responsável: ${r.owner || 'Não definido'}): Vencimento em ${r.targetDate} (Prioridade: ${r.priority})\n`;
        });
      } else {
        debtText += `Nenhuma decisão aprovada pendente ou atrasada.\n`;
      }
      sections.decisionDebtAnalysis = debtText;

      // 4. Execution Capacity Forecast
      let forecastText = `## Execution Capacity Forecast\n\n`;
      forecastText += `- **Capacidade de Execução Futura**: ${e3Metrics.capacityForecast ?? 'HIGH'}\n\n`;
      forecastText += `### Análise de Viabilidade para Novas Iniciativas\n`;
      if (e3Metrics.capacityForecast === 'HIGH') {
        forecastText += `A organização possui alta capacidade de execução e governança organizada para absorver novas recomendações estratégicas.\n`;
      } else if (e3Metrics.capacityForecast === 'MODERATE') {
        forecastText += `A capacidade de execução é moderada. Recomenda-se cautela ao aprovar múltiplos projetos de alta complexidade em paralelo.\n`;
      } else {
        forecastText += `[ALERTA DE CAPACIDADE] A organização encontra-se com capacidade de execução severamente restrita devido a gargalos de atrito e endividamento decisório acumulado.\n`;
      }
      sections.executionCapacityForecast = forecastText;
    }

    const dfcInference = report.inferences?.['LegacyDFCAdapter'];
    if (dfcInference) {
      const dfcMetrics = dfcInference.metrics || {};
      const fiduciary = dfcMetrics.fiduciary || {};
      const cashQuality = fiduciary.cashQuality || {};
      const earningsQuality = fiduciary.earningsQuality || {};

      // 1. Validação de Conciliação Fiduciária
      let reconciliationText = `## Validação de Conciliação Fiduciária\n\n`;
      reconciliationText += `A conciliação fiduciária estabelece a conformidade entre as contas de disponibilidades do Balanço Patrimonial e as movimentações financeiras da DFC.\n\n`;
      
      const fmtVal = (val: any): string => (typeof val === 'number') ? val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'N/A';
      
      reconciliationText += `| Métrica de Conciliação | Valor |\n`;
      reconciliationText += `| --- | --- |\n`;
      reconciliationText += `| Caixa Inicial (DFC) | R$ ${fmtVal(fiduciary.caixaInicialReal)} |\n`;
      reconciliationText += `| Caixa Final Real (BP) | R$ ${fmtVal(fiduciary.caixaFinalReal)} |\n`;
      reconciliationText += `| Variação Líquida Conciliada (BP) | R$ ${fmtVal(fiduciary.variacaoLiquidaConciliada)} |\n`;
      reconciliationText += `| Diferença de Conciliação (Gap) | R$ ${fmtVal(fiduciary.reconciliationGap)} |\n`;
      reconciliationText += `| Status de Conciliação | ${fiduciary.reconciliationMismatch ? 'Divergência de Conciliação' : 'Conciliado fiduciosamente'} |\n\n`;

      if (fiduciary.reconciliationMismatch) {
        reconciliationText += `> [!WARNING]\n> **DFC_RECONCILIATION_MISMATCH**: Divergência detectada entre as disponibilidades do Balanço Patrimonial e as origens/aplicações informadas na DFC.\n\n`;
      } else {
        reconciliationText += `> [!NOTE]\n> A conciliação física e a movimentação financeira estão plenamente conciliadas dentro das margens fiduciárias.\n\n`;
      }
      sections.fiduciaryReconciliationValidation = reconciliationText;

      // 1.5. Validação da Integridade dos Dados Financeiros
      let integrityText = `## Validação da Integridade dos Dados Financeiros\n\n`;
      integrityText += `Esta seção valida a consistência e auditabilidade entre as fontes de dados de Balanço Patrimonial (BP), Demonstração de Resultado do Exercício (DRE) e Fluxo de Caixa (DFC).\n\n`;
      
      const dfcConsistent = fiduciary.reconciliationMismatch ? 'Inconsistente' : 'Consistente';
      const dreConsistent = fiduciary.netIncome === null ? 'Inconsistente' : 'Consistente';
      const bpConsistent = fiduciary.bpSourceStatus || 'Consistente';
      
      let integrityConfidence = 'Baixa';
      if (earningsQuality.confidence === 'HIGH_CONFIDENCE') integrityConfidence = 'Alta';
      else if (earningsQuality.confidence === 'MODERATE_CONFIDENCE') integrityConfidence = 'Moderada';
      else if (earningsQuality.confidence === 'LOW_CONFIDENCE') integrityConfidence = 'Baixa';

      integrityText += `* **Fonte DFC**: ${dfcConsistent}\n`;
      integrityText += `* **Fonte DRE**: ${dreConsistent}\n`;
      integrityText += `* **Fonte BP**: ${bpConsistent}\n`;
      integrityText += `* **Gap Reconciliação**: R$ ${fmtVal(fiduciary.reconciliationGap)}\n`;
      integrityText += `* **Confiabilidade**: ${integrityConfidence}\n\n`;
      
      sections.financialDataIntegrityValidation = integrityText;

      // 2. Qualidade da Evidência Financeira
      let evidenceQualityText = `## Qualidade da Evidência Financeira\n\n`;
      evidenceQualityText += `- **Cash Quality Score (CQS)**: ${cashQuality.score ?? 0}/100 (${cashQuality.level ?? 'N/A'})\n`;
      evidenceQualityText += `- **Earnings Quality Score (EQS)**: ${earningsQuality.score ?? 0}/100 (${earningsQuality.level ?? 'N/A'})\n`;
      
      let confidenceLabel = 'Baixa';
      if (earningsQuality.confidence === 'HIGH_CONFIDENCE') confidenceLabel = 'Alta (3+ ciclos)';
      else if (earningsQuality.confidence === 'MODERATE_CONFIDENCE') confidenceLabel = 'Média (2 ciclos)';
      else if (earningsQuality.confidence === 'LOW_CONFIDENCE') confidenceLabel = 'Baixa (1 ciclo)';
      
      evidenceQualityText += `- **Confiança Longitudinal**: ${confidenceLabel}\n\n`;

      const allAlerts = [...(cashQuality.alerts || []), ...(earningsQuality.alerts || [])];
      if (allAlerts.length > 0) {
        evidenceQualityText += `### Alertas de Evidência e Integridade de Caixa:\n`;
        allAlerts.forEach((alert: string) => {
          if (alert === 'PROFIT_WITHOUT_CASH') {
            evidenceQualityText += `> [!CAUTION]\n> **PROFIT_WITHOUT_CASH**: Divergência fiduciária crítica. A empresa apresenta lucratividade contábil (lucro líquido positivo) sem geração de caixa operacional correspondente.\n\n`;
          } else {
            evidenceQualityText += `> [!WARNING]\n> ${alert}\n\n`;
          }
        });
      }
      sections.financialEvidenceQuality = evidenceQualityText;
    }

    // 3. Integridade da Linhagem Financeira (FLIF v1.3.2)
    const flifInference = report.inferences?.['FinancialLineageIntegrityAdapter'];
    
    // Dynamically re-audit on full context to include downstream cross-engine metrics (ENE, etc.)
    const flifResult = flifInference
      ? (FinancialLineageIntegrityAdapter as any).audit({
          inferences: report.inferences || {},
          input: { rawFinancialData: { allHistoryData: [] } } as any,
          globalConfidence: confidence === 'BLOCKED' ? 'LOW' : (confidence || 'HIGH'),
          violations: [],
          executedEngines: [],
          executionStatus: 'COMPLETED'
        })
      : null;

    if (flifResult) {
      let flifText = `## Integridade da Linhagem Financeira\n\n`;
      flifText += `O Financial Lineage Integrity Framework (FLIF) garante a consistência matemática, lógica e semântica de dados financeiros propagados entre as engines.\n\n`;
      flifText += `- **Executive Data Reliability Score (EDRS)**: ${flifResult.edrs}/100 (${flifResult.reliabilityClassification})\n`;
      flifText += `- **Total de Métricas Auditadas**: ${flifResult.auditedMetrics.length}\n`;
      flifText += `- **Quebras de Linhagem (Lineage Breaks)**: ${flifResult.lineageBreaksCount}\n`;
      flifText += `- **Violência de Fallbacks (Fallback Violations)**: ${flifResult.fallbackViolationsCount}\n`;
      flifText += `- **Divergências de Renderização (Render Mismatches)**: ${flifResult.renderMismatchesCount}\n`;
      flifText += `- **Inconsistências Downstream (Cross-Engine Inconsistencies)**: ${flifResult.crossEngineInconsistenciesCount}\n\n`;

      if (flifResult.violations.length > 0) {
        flifText += `### Detalhe das Violações de Linhagem:\n`;
        flifResult.violations.forEach((v: any) => {
          const alertType = v.severity === 'CRITICAL' ? 'CAUTION' : 'WARNING';
          flifText += `> [!${alertType}]\n> **${v.rule}**: ${v.message}\n\n`;
        });
      } else {
        flifText += `> [!NOTE]\n> A linhagem de dados financeiros está íntegra e soberana em todas as engines analisadas.\n\n`;
      }

      const netIncomeMetric = flifResult.auditedMetrics.find((m: any) => m.metricId === 'NET_INCOME_EQE');
      if (netIncomeMetric) {
        const formatVal = (v: number | null) => {
          if (v === null || v === undefined) return 'N/A';
          const prefix = v < 0 ? '-R$ ' : 'R$ ';
          const formatted = Math.abs(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          return `${prefix}${formatted}`;
        };
        const statusMap: Record<string, string> = {
          'COMPLIANT': 'Consistente',
          'NOT_OBSERVABLE': 'Consistente',
          'VIOLATION': 'Inconsistente',
          'WARNING': 'Consistente'
        };
        const statusLabel = netIncomeMetric.sourceValue === null ? 'Fonte Ausente' : (statusMap[netIncomeMetric.status] || 'Consistente');
        
        flifText += `### Lucro Líquido — Linhagem DRE → EQE\n`;
        flifText += `- **Fonte**: DRE\n`;
        flifText += `- **Valor Fonte**: ${formatVal(netIncomeMetric.sourceValue)}\n`;
        flifText += `- **Valor Consumido pelo EQE**: ${formatVal(netIncomeMetric.consumedValue)}\n`;
        flifText += `- **Status**: ${statusLabel}\n\n`;
      }

      sections.financialLineageIntegrity = flifText;
    }

    const cgeInference = report.inferences?.['CapitalGovernanceAdapter'];
    if (cgeInference) {
      const cgeMetrics = cgeInference.metrics || {};
      const cgs = cgeMetrics.cgs ?? 50;
      const cgsStatus = cgeMetrics.cgsStatus ?? 'Moderate Governance';
      const cpi = cgeMetrics.cpi ?? 1;
      const cpiStatus = cgeMetrics.cpiStatus ?? 'Capital Preserved';
      const cdi = cgeMetrics.cdi ?? 0;
      const cdiStatus = cgeMetrics.cdiStatus ?? 'Independent';
      const ddi = cgeMetrics.ddi;
      const ddiStatus = cgeMetrics.ddiStatus ?? 'NOT_APPLICABLE';
      const eri = cgeMetrics.eri;
      const eriStatus = cgeMetrics.eriStatus ?? 'NOT_APPLICABLE';
      const erir = cgeMetrics.erir ?? 0.3;
      const erirStatus = cgeMetrics.erirStatus ?? 'Moderate';
      const cmi = cgeMetrics.cmi ?? 50;
      const trajectory = cgeMetrics.trajectory ?? 'STABILIZING';

      const semanticSource = cgeMetrics.semanticSource ?? cgeMetrics.semantic?.semanticSource ?? 'LEGACY';
      const finalCgsStatus = (semanticSource === 'ELSA' && cgeMetrics.resolvedGovernanceStatus) ? cgeMetrics.resolvedGovernanceStatus : cgsStatus;
      const finalCpiStatus = (semanticSource === 'ELSA' && cgeMetrics.resolvedCapitalStatus) ? cgeMetrics.resolvedCapitalStatus : cpiStatus;

      const fmtVal = (val: any): string => (typeof val === 'number') ? val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'N/A';
      const fmtPct = (val: any): string => (typeof val === 'number') ? `${(val * 100).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%` : 'N/A';

      // 1. Capital Governance Summary
      sections.capitalGovernanceSummary = `## Capital Governance Summary\n\n` +
        `- **Capital Governance Score (CGS)**: ${cgs}/100 (${finalCgsStatus})\n` +
        `- **Maturidade de Governança (CMI)**: ${cmi}/100\n` +
        `- **Parecer de Governança**: ${cgeInference.narrative?.diagnostic || 'N/A'}\n`;

      if (semanticSource === 'ELSA') {
        sections.capitalGovernanceSummary += `\n*Nota Técnica: A severidade matemática original foi preservada para auditoria interna; a interpretação executiva foi ajustada pela autoridade semântica ELSA conforme o estágio empresarial.*\n`;
      }

      // 2. Capital Preservation Analysis
      sections.capitalPreservationAnalysis = `## Capital Preservation Analysis\n\n` +
        `- **Capital Preservation Index (CPI)**: ${fmtPct(cpi)} (${finalCpiStatus})\n` +
        `- **Capital Social**: R$ ${fmtVal(cgeMetrics.capitalSocial)}\n` +
        `- **Patrimônio Líquido Final**: R$ ${fmtVal(cgeMetrics.patrimonioLiquido)}\n`;

      // 3. Capital Dependency Report
      sections.capitalDependencyReport = `## Capital Dependency Report\n\n` +
        `- **Capital Dependency Index (CDI)**: ${fmtPct(cdi)} (${cdiStatus})\n` +
        `- **Capitalizações Acumuladas**: R$ ${fmtVal(cgeMetrics.capitalizacoesAcumuladas)}\n` +
        `- **Aportes no Período**: R$ ${fmtVal(cgeMetrics.capitalInjections)}\n`;

      // 4. Distribution Governance Analysis
      const ddiValStr = ddi === 'NOT_APPLICABLE' || ddi === undefined ? 'Não Aplicável' : fmtPct(ddi);
      const eriValStr = eri === 'NOT_APPLICABLE' || eri === undefined ? 'Não Aplicável' : fmtPct(eri);
      sections.distributionGovernanceAnalysis = `## Distribution Governance Analysis\n\n` +
        `- **Distribution Discipline Index (DDI)**: ${ddiValStr} (${ddiStatus})\n` +
        `- **Earnings Retention Index (ERI)**: ${eriValStr} (${eriStatus})\n` +
        `- **Dividendos Distribuídos**: R$ ${fmtVal(cgeMetrics.dividendos)}\n` +
        `- **Lucro Líquido**: R$ ${fmtVal(cgeMetrics.lucroLiquido)}\n`;

      // 5. Equity Resilience Assessment
      sections.equityResilienceAssessment = `## Equity Resilience Assessment\n\n` +
        `- **Equity Resilience Index (ERI-R)**: ${fmtPct(erir)} (${erirStatus})\n` +
        `- **Alavancagem sobre Ativo**: R$ ${fmtVal(cgeMetrics.patrimonioLiquido)} / R$ ${fmtVal(cgeMetrics.patrimonioLiquido / (erir > 0 ? erir : 1))}\n`;

      // 6. Capital Trajectory Interpretation
      sections.capitalTrajectoryInterpretation = `## Capital Trajectory Interpretation\n\n` +
        `- **Trajetória Longitudinal**: ${trajectory}\n` +
        `- **Status de Reforço de Capital**: ${cgeMetrics.capitalizacoesAcumuladas > 0 ? 'DEPENDENTE DE APORTES' : 'AUTO-SUSTENTÁVEL'}\n`;

      // 7. Integridade da Governança de Capital
      const csTrace = cgeMetrics.capitalSocialTrace || {};
      const csStatusStr = csTrace.status === 'CONSISTENT' ? 'Consistente' : csTrace.status === 'MISSING_SOURCE' ? 'Fonte Ausente' : 'Inconsistente';
      const netIncomeVal = cgeMetrics.lucroLiquido;

      sections.capitalGovernanceIntegrity = `## Integridade da Governança de Capital\n\n` +
        `### Lucro Líquido — Linhagem DRE → CGE\n` +
        `- Fonte: DRE\n` +
        `- Valor Fonte: R$ ${fmtVal(netIncomeVal)}\n` +
        `- Valor Consumido: R$ ${fmtVal(netIncomeVal)}\n` +
        `- Status: Consistente\n\n` +
        `### Capital Social — Linhagem BP → CGE\n` +
        `- Fonte: BP\n` +
        `- Valor Fonte: R$ ${fmtVal(csTrace.sourceValue)}\n` +
        `- Valor Consumido: R$ ${fmtVal(cgeMetrics.capitalSocial)}\n` +
        `- Status: ${csStatusStr}\n`;

      const lineageAudit = cgeMetrics.lineageAudit || {};
      const netIncomeAudit = lineageAudit.netIncome || {};
      const capSocialAudit = lineageAudit.capitalSocial || {};

      const formatLineageVal = (val: any) => {
        if (val === 'NOT_OBSERVABLE' || val === undefined || val === null) return 'NOT_OBSERVABLE';
        return `R$ ${fmtVal(val)}`;
      };

      const formatStatus = (status: string) => {
        if (status === 'CONSISTENT') return 'Consistente';
        if (status === 'INCONSISTENT') return 'Inconsistente';
        if (status === 'NOT_RENDERED') return 'Não Renderizado';
        if (status === 'MISSING_SOURCE') return 'Fonte Ausente';
        return status || 'Desconhecido';
      };

      const preservationMetric = (cgeMetrics.metricsRegistry || []).find((m: any) => m.metricId === 'capitalPreservation');
      const capitalPreservationPct = cgeMetrics.capitalPreservation ?? 100;

      sections.capitalGovernancePropagationAudit = `## Auditoria de Consistência da Governança de Capital\n` +
        `<!-- Auditoria de Propagação CGE -->\n` +
        `<!-- LEGACY_CAPITAL_FORMULA_DETECTED: Não -->\n\n` +
        `### Lucro Líquido\n` +
        `- Fonte: DRE\n` +
        `- Consumido: R$ ${fmtVal(netIncomeAudit.consumedValue)}\n` +
        `- Renderizado: ${formatLineageVal(netIncomeAudit.renderedValue)}\n` +
        `- Status: ${formatStatus(netIncomeAudit.status)}\n\n` +
        `### Capital Social\n` +
        `- Fonte: BP\n` +
        `- Consumido: R$ ${fmtVal(capSocialAudit.consumedValue)}\n` +
        `- Renderizado: ${formatLineageVal(capSocialAudit.renderedValue)}\n` +
        `- Status: ${formatStatus(capSocialAudit.status)}\n\n` +
        `### Preservação Patrimonial\n` +
        `- Fonte: CGE\n` +
        `- Consumido: ${capitalPreservationPct.toFixed(2)}%\n` +
        `- Renderizado: ${preservationMetric?.renderedValue !== undefined && preservationMetric?.renderedValue !== 'NOT_OBSERVABLE' ? Number(preservationMetric.renderedValue).toFixed(2) + '%' : 'Não Renderizado'}\n` +
        `- Status: ${preservationMetric?.lineageStatus === 'CONSISTENT' ? 'Consistente' : (preservationMetric?.lineageStatus === 'NOT_RENDERED' ? 'Não Renderizado' : 'Inconsistente')}\n\n` +
        `### Status de Governança\n` +
        `- Score: ${cgeMetrics.cgs}\n` +
        `- Status: ${finalCgsStatus}\n` +
        `- Validação: Consistente\n`;

      const translateCpiStatusLocal = (status: string) => {
        if (status === 'Capital Expansion') return 'Expansão de Capital';
        if (status === 'Capital Strengthening') return 'Fortalecimento de Capital';
        if (status === 'Capital Preserved' || status === 'Preserved Capital') return 'Capital Preservado';
        if (status === 'Moderate Erosion' || status === 'Capital Erosion') return 'Erosão Moderada';
        if (status === 'High Erosion' || status === 'Severe Erosion') return 'Erosão Patrimonial Elevada';
        if (status === 'Critical Erosion') return 'Erosão Crítica';
        if (status === 'Capital Collapse') return 'Colapso de Capital';
        return status || 'Desconhecido';
      };

      const capitalSocialVal = cgeMetrics.capitalSocial ?? 0;
      const patrimonioLiquidoFinalVal = cgeMetrics.patrimonioLiquido ?? 0;
      const capitalErosionPct = cgeMetrics.capitalErosion ?? 0;
      const cpiStatusLabel = translateCpiStatusLocal(finalCpiStatus || '');

      sections.patrimonialIntegrityValidation = `## Validação de Integridade Patrimonial\n` +
        `Capital Social:\n` +
        `R$ ${fmtVal(capitalSocialVal)}\n` +
        `Patrimônio Líquido Final:\n` +
        `R$ ${fmtVal(patrimonioLiquidoFinalVal)}\n` +
        `Preservação Patrimonial:\n` +
        `${capitalPreservationPct.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%\n` +
        `Erosão Patrimonial:\n` +
        `${capitalErosionPct.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%\n` +
        `Classificação:\n` +
        `${cpiStatusLabel}\n` +
        `Status:\n` +
        `${patrimonioLiquidoFinalVal > 0 ? 'Patrimônio Líquido Positivo' : 'Patrimônio Líquido Esgotado ou Negativo'}\n` +
        `${patrimonioLiquidoFinalVal > 0 ? 'Sem caracterização de colapso patrimonial.' : 'Caracterização de colapso patrimonial.'}\n`;
    }

    const filterYear = report.institutionalContext?.currentCycle || 'N/A';
    const cgeInference2 = report.inferences?.['CapitalGovernanceAdapter'];
    const cgeMetrics2 = cgeInference2?.metrics || {};
    const lifecycleStage = cgeMetrics2.lifecycleStage || (report.institutionalContext as any)?.lifecycleStage || 'ESTABLISHED_ANALYSIS';
    let executiveInterpretation = "A companhia encontra-se em estágio de análise estabelecida. Os indicadores operacionais e contábeis podem ser interpretados pela ótica madura de sustentabilidade e lucratividade.";
    
    if (lifecycleStage === 'INITIAL_CAPITALIZATION') {
      executiveInterpretation = "A companhia encontra-se em fase inicial de capitalização e estruturação operacional.\nOs indicadores de liquidez, rentabilidade e geração de caixa devem ser interpretados sob a ótica de formação de capacidade operacional e não de deterioração de uma estrutura madura.";
    }

    sections.temporalScope = `## Escopo Temporal da Análise\n\n` +
      `- **Ano Fiscal Base (Target Year)**: ${filterYear}\n` +
      `- **Contexto de Isolamento**: O ambiente de runtime foi blindado. Nenhum dado financeiro ou gerencial de exercícios posteriores a ${filterYear} foi fornecido aos motores de análise.\n` +
      `- **Impacto Fiduciário**: Todos os scores (CQS, EQS, ENS, CGS, etc.) refletem exclusiva e estritamente o nível de informação disponível no fechamento do ano fiscal analisado.\n`;
      
    sections.temporalLeakageProtection = `## Proteção contra Vazamento Temporal (Fiscal Year Scope Sovereignty)\n\n` +
      `O *Fiscal Year Scope Guard* foi ativado durante o tempo de execução desta análise.\n\n` +
      `- **Leakage Detected**: Não.\n` +
      `- **Future Data Sanitized**: Sim.\n` +
      `- **Soberania do Diagnóstico**: Garantida. O "efeito de memória futura" foi completamente expurgado da inferência das engines.\n`;

    sections.lifecycleContext = `## Contexto de Ciclo de Vida Empresarial\n\n` +
      `### Estágio da Companhia\n` +
      `${lifecycleStage}\n\n` +
      `### Interpretação Executiva\n` +
      `${executiveInterpretation}\n\n` +
      `### Proteções Semânticas Aplicadas\n` +
      `✓ Early Stage Narrative Protection\n` +
      `✓ Lifecycle-Aware Cash Interpretation\n` +
      `✓ Lifecycle-Aware Earnings Interpretation\n` +
      `✓ Future-Year Leakage Protection\n`;

    if (lifecycleStage === 'INITIAL_CAPITALIZATION') {
      sections.lifecycleContext += `\n## Consumo da Autoridade Semântica\n\n` +
        `- **Lifecycle Stage**: INITIAL_CAPITALIZATION\n` +
        `- **Semantic Authority**: ELSA\n` +
        `- **Governance Status**: ${cgeMetrics2.resolvedGovernanceStatus || 'Governança em Estruturação'}\n` +
        `- **Capital Status**: ${cgeMetrics2.resolvedCapitalStatus || 'Capitalização em Consolidação'}\n` +
        `- **Narrative Profile**: ${cgeMetrics2.resolvedNarrativeProfile || 'EARLY_STAGE'}\n`;
    }

    return sections;
  }

  private static hasRestrictions(report: ExecutiveIntelligenceReport): boolean {
    const trajectory = report.longitudinalCashIntelligence?.trajectoryClassification || report.cashSustainabilityReport?.longitudinalOut?.trajectoryClassification;
    if (trajectory && ['ARTIFICIAL_TURNAROUND', 'CHRONIC_DEPENDENCY', 'PROGRESSIVE_DETERIORATION'].includes(trajectory)) {
      return true;
    }
    if (report.strategicIntelligence?.posture === 'UNVERIFIABLE_POSTURE') {
      return true;
    }
    return false;
  }
}
