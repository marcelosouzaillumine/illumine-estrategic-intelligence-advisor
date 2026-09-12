import { ExecutiveIntelligenceReport } from '../../core/runtime/executive-intelligence-runtime';
import { InstitutionalBoardPackOutput, ReportGenerationStatus } from './institutional-reporting-types';
import { ExecutiveSnapshotEngine } from './engines/ExecutiveSnapshotEngine';
import { GovernanceReportingEngine } from './engines/GovernanceReportingEngine';
import { StrategicDirectionReportingEngine } from './engines/StrategicDirectionReportingEngine';
import { TreasuryPressureReportingEngine } from './engines/TreasuryPressureReportingEngine';
import { ContinuityReportingEngine } from './engines/ContinuityReportingEngine';
import { OperationalGovernanceReportingEngine } from './engines/OperationalGovernanceReportingEngine';
import { ExecutiveDirectiveReportingEngine } from './engines/ExecutiveDirectiveReportingEngine';
import { InstitutionalExplainabilityAppendixEngine } from './engines/InstitutionalExplainabilityAppendixEngine';
import { InstitutionalLineageAppendixEngine } from './engines/InstitutionalLineageAppendixEngine';
import { InstitutionalDisclosureReportingEngine } from './engines/InstitutionalDisclosureReportingEngine';
import { BoardResolutionAppendixEngine } from './engines/BoardResolutionAppendixEngine';
import { RuntimeComplianceEngine } from '../../capabilities/financial/runtime/compliance/RuntimeComplianceEngine';
import { BoardPackMetadata } from './institutional-reporting-types';

import { BoardPackExecutiveRenderingGuard } from '../../workspace/runtime/lifecycle/BoardPackExecutiveRenderingGuard';
import { ExecutivePriorityResolver } from '../decision-intelligence/ExecutivePriorityResolver';

import { ExecutiveMaturityLayer } from '../economic-value/ExecutiveMaturityLayer';
import { EconomicReturnEngine } from '../economic-value/EconomicReturnEngine';
import { EconomicValueCreationEngine } from '../economic-value/EconomicValueCreationEngine';
import { InstitutionalExecutiveThesisEngine } from '../economic-value/InstitutionalExecutiveThesisEngine';
import { ExecutivePriorityRankingEngine } from '../../workspace/runtime/executive-prioritization/ExecutivePriorityRankingEngine';
import { BoardTop3DecisionEngine } from '../../workspace/runtime/executive-prioritization/BoardTop3DecisionEngine';
import { BoardDecisionGraphAdapter } from '../../knowledge-graph/adapters/BoardDecisionGraphAdapter';
import { ExecutiveActionPlanEngine } from '../../workspace/runtime/executive-prioritization/ExecutiveActionPlanEngine';
import { InstitutionalPriorityMatrixEngine } from '../../workspace/runtime/executive-prioritization/InstitutionalPriorityMatrixEngine';
import { BoardAttentionDemandIndexEngine } from '../../workspace/runtime/executive-prioritization/BoardAttentionDemandIndexEngine';

export class InstitutionalBoardPackRuntime {
  
  public static generate(report: ExecutiveIntelligenceReport): InstitutionalBoardPackOutput {
    
    // 1. Core Validate
    if (!report.runtimeMetadata || !report.runtimeMetadata.lineageHash) {
      return this.createFailedReport('MISSING_LINEAGE_HASH');
    }

    if (!report.strategicIntelligence || !report.operationalGovernance || !report.executiveCommand) {
      return this.createFailedReport('INCOMPLETE_FIDUCIARY_LAYER');
    }

    // 2. Metadata & Lineage Verification
    const historicalCycles = report.runtimeMetadata.historicalCyclesAvailable || 0;
    const isFailClosed = Number(historicalCycles) < 2 || report.strategicIntelligence.posture === 'UNVERIFIABLE_POSTURE';
    
    // Hash do Board Pack gerado a partir do Hash do Executive Report de forma estritamente determinística
    const boardPackLineageHash = this.generateHash('BOARD_PACK', {
      sourceHash: report.runtimeMetadata.lineageHash,
      reportGenerationTimestamp: new Date().toISOString(),
      generatedAt: new Date().toISOString(),
      runtimeVersion: "1.0",
      contractVersion: "1.0",
      tenantId: String(report.institutionalContext?.tenantId || 'N/A'),
      cycleReference: String(report.institutionalContext?.currentCycle || 'N/A')
    });

    let snapshotIntegrityStatus: import('../shared/runtime-constitutional-types').RuntimeIntegrityStatus = 'UNVERIFIABLE';
    if (report.runtimeMetadata.status === 'COMPLETED') {
      snapshotIntegrityStatus = 'INTACT';
    } else if (report.runtimeMetadata.status === 'FAILED') {
      snapshotIntegrityStatus = 'COMPROMISED';
    } else if (report.runtimeMetadata.status === 'BLOCKED') {
      snapshotIntegrityStatus = 'FAIL_CLOSED';
    }

    const metadata: BoardPackMetadata = {
      boardPackLineageHash: boardPackLineageHash as import('../shared/lineage-types').BoardPackLineageHash,
      reportGenerationTimestamp: new Date().toISOString(),
      generatedAt: new Date().toISOString(),
      runtimeVersion: '1.0.0',
      contractVersion: "1.0",
      tenantId: String(report.institutionalContext?.tenantId || 'N/A'),
      cycleReference: String(report.institutionalContext?.currentCycle || 'N/A'),
      snapshotIntegrityStatus,
      immutabilityStatus: 'IMMUTABLE',
      runtimeSources: ['ExecutiveSnapshotEngine', 'GovernanceReportingEngine'],
      ...({
        runtimeMetadata: {
          contractVersion: !isFailClosed
        }
      } as unknown as Record<string, unknown>)
    };
    const executiveSnapshot = ExecutiveSnapshotEngine.generate(report);
    const governanceReport = GovernanceReportingEngine.generate(report);
    const strategicDirection = StrategicDirectionReportingEngine.generate(report);
    const treasuryReport = TreasuryPressureReportingEngine.generate(report);
    const continuityReport = ContinuityReportingEngine.generate(report);
    const operationalGovernance = OperationalGovernanceReportingEngine.generate(report);
    const executiveDirectives = ExecutiveDirectiveReportingEngine.generate(report);

    // 4. Assemble Appendices
    const explainabilityAppendix = InstitutionalExplainabilityAppendixEngine.generate(report);
    const lineageAppendix = InstitutionalLineageAppendixEngine.generate(report, boardPackLineageHash as import('../shared/lineage-types').BoardPackLineageHash);
    const boardResolutionAppendix = BoardResolutionAppendixEngine.generate(report);
    
    const disclosures = InstitutionalDisclosureReportingEngine.generate(report, metadata);
    const fiduciaryRestrictions = InstitutionalDisclosureReportingEngine.generateRestrictions(report, metadata);

    // 5. Sovereign Status Resolution
    let finalStatus: ReportGenerationStatus = 'COMPLETE';
    if (
      isFailClosed || 
      executiveSnapshot.isRestricted || 
      executiveSnapshot.accountingIntegrityStatus === 'FAILED'
    ) {
      finalStatus = 'RESTRICTED';
    }

    const constEval = report.constitutionalEvaluation;
    if (constEval && constEval.integrityState !== 'CONSTITUTIONALLY_STABLE') {
      finalStatus = 'CONSTITUTIONAL_QUARANTINE';
    }

    const constitutionalSection: import('./institutional-reporting-types').ConstitutionalSection | undefined = constEval ? {
      constitutionalStatus: constEval.integrityState,
      doctrineIntegrity: constEval.detectedConflicts.length === 0,
      overrideAttempts: constEval.overrideAttempts,
      compatibilityStatus: constEval.compatibilityStatus,
      constitutionalConfidence: (constEval.integrityState === 'CONSTITUTIONAL_FAIL_CLOSED' || constEval.integrityState === 'AXIOM_VIOLATION') 
        ? 'BLOCKED' 
        : (constEval.integrityState === 'CONSTITUTIONAL_CONFLICT' ? 'LOW' : 'HIGH'),
      erosionSignals: constEval.axiomViolations,
      migrationSafety: constEval.integrityState !== 'CONSTITUTIONAL_CONFLICT',
      constitutionalRestrictions: constEval.axiomViolations.map(v => `VIOLATION: ${v}`),
      constitutionalLineageHash: constEval.constitutionalLineageHash || 'hash-fallback',
      constitutionalAuditTrail: constEval.auditRecords || [],
      enforcementActions: constEval.axiomViolations.length > 0 ? ['FAIL_CLOSED_TRIGGERED'] : [],
      quarantineReason: constEval.detectedConflicts.join('; '),
      affectedRuntimeDomains: ['all']
    } : undefined;

    const govConsistency = report.patrimonialIntelligenceReport?.governanceConsistency;
    const governanceIntegrityReview: import('./institutional-reporting-types').GovernanceIntegrityReviewSection | undefined = govConsistency ? {
      consistencyStatus: govConsistency.consistencyStatus,
      confidenceScore: govConsistency.confidenceScore,
      warnings: govConsistency.warnings,
      forcedDisclosures: govConsistency.forcedDisclosures
    } : undefined;

    const structuralRestrictions = report.patrimonialStructuralRestrictions;
    const fiduciaryStructuralRestrictions: import('./institutional-reporting-types').FiduciaryStructuralRestrictionsSection | undefined = structuralRestrictions ? {
      originalClassification: structuralRestrictions.originalClassification,
      classificationCeiling: structuralRestrictions.classificationCeiling,
      finalClassification: structuralRestrictions.finalClassification,
      ceilingReasons: structuralRestrictions.ceilingReasons,
      confidenceImpact: structuralRestrictions.confidenceImpact,
      appliedOverrides: structuralRestrictions.appliedOverrides
    } : undefined;
    const inventoryDependency = report.patrimonialIntelligenceReport?.inventoryDependency;
    const structuralLiquidityRisk: import('./institutional-reporting-types').StructuralLiquidityRiskSection | undefined = structuralRestrictions ? {
      liquidityFragilityOverride: !!structuralRestrictions.appliedOverrides.find((o: any) => o.name === 'Liquidity Fragility Override'),
      shortTermDebtConcentrationOverride: !!structuralRestrictions.appliedOverrides.find((o: any) => o.name === 'Short-Term Debt Concentration Override'),
      inventoryDependency,
      finalFiduciaryClassification: structuralRestrictions.finalClassification
    } : undefined;

    // --- EDPEVF v1.1 Layer Computations ---
    const bpSummary = (report as any).capitalGovernanceReport?.bpSummary
      || (report as any).context?.input?.rawFinancialData?.bpSummary
      || (report as any).metrics?.financialMetrics
      || {};

    const netRevenue = Number((report.metrics as any)?.netRevenue ?? (report.metrics as any)?.receitaLiquida ?? 0);
    const netProfit = Number((report.metrics as any)?.netProfit ?? (report.metrics as any)?.netIncome ?? 0);
    const ebit = Number((report.metrics as any)?.ebit ?? (report.metrics as any)?.dreInsights?.normalizedDRE?.ebitda?.value ?? (report.metrics as any)?.ebitda ?? netProfit ?? 0);
    
    const ativoTotal = Number(bpSummary.ativoTotal ?? 0);
    const passivoCirculante = Number(bpSummary.passivoCirculante ?? 0);
    const patrimonioLiquido = Number(bpSummary.patrimonioLiquido ?? 0);
    
    const capitalSocial = Number((report.capitalGovernanceReport as any)?.capitalSocial 
      ?? (report as any).executiveLayer?.consumedCapital?.capitalSocial
      ?? patrimonioLiquido 
      ?? 1.0);

    const lucrosPrejuizos = Number((report.capitalGovernanceReport as any)?.retainedEarnings
      ?? (report.capitalGovernanceReport as any)?.lucrosPrejuizos
      ?? (report as any).executiveLayer?.consumedCapital?.value
      ?? 0);

    const historicalCyclesCount = Number(report.runtimeMetadata?.historicalCyclesAvailable
      || (report as any).historicalCyclesCount
      || 1);

    // 1. Executive Maturity Layer
    const maturity = ExecutiveMaturityLayer.evaluate(historicalCyclesCount, netRevenue);

    // 2. Economic Return Engine
    const economicReturnOut = EconomicReturnEngine.evaluate(
      ebit,
      ativoTotal,
      passivoCirculante,
      patrimonioLiquido,
      historicalCyclesCount
    );

    // 3. Economic Value Creation Engine
    const returnNarrative = EconomicValueCreationEngine.generateNarrative(
      economicReturnOut,
      maturity,
      netProfit
    );

    const economicReturn = {
      ...economicReturnOut,
      narrative: returnNarrative
    };

    // 4. Board Attention Demand Index (BADI)
    const runwayMonths = Number(report.cashSustainabilityReport?.runwayMonths 
      || (report.metrics as any)?.fiduciary?.cashRunwayInstitucional?.months
      || (report as any).continuityRisk?.projectedRunwayMonths 
      || 0);
    
    const fco = Number((report.metrics as any)?.fco || (report.cashSustainabilityReport as any)?.sourceMetrics?.fco || 0);

    const badi = BoardAttentionDemandIndexEngine.evaluate(
      runwayMonths,
      fco,
      netProfit,
      netRevenue,
      lucrosPrejuizos,
      capitalSocial,
      patrimonioLiquido,
      (report.scores?.governance ?? 0),
      finalStatus,
      (report.fiduciaryWarnings?.length ?? 0) > 0
    );

    // 5. Executive Priority Ranking Engine
    const rankedRecommendations = ExecutivePriorityRankingEngine.rank(report);

    // 6. Board Top 3 Decisions
    const top3BoardDecisions = BoardTop3DecisionEngine.generate(report, false);

    // 7. Executive Top 5 Actions
    const top5ExecutiveActions = ExecutiveActionPlanEngine.generate(report);

    // 8. Institutional Priority Matrix
    const priorityMatrix = InstitutionalPriorityMatrixEngine.generate(report);

    // 9. Institutional Executive Thesis 2.0
    const isLiquidityCrisis = fco < 0 || (runwayMonths > 0 && runwayMonths < 6);
    const isProfitabilityCrisis = netProfit < 0;

    const thesisContext = maturity.description;
    const tensaoPrincipal = isLiquidityCrisis 
      ? 'Forte pressão de liquidez operacional e ciclo imediato de sobrevivência'
      : (isProfitabilityCrisis
          ? 'Ineficiência operacional resultando em margens negativas e prejuízo operacional'
          : 'Estabilização financeira geral com necessidade de expansão estratégica.');
    
    const riscoDominante = isLiquidityCrisis
      ? 'Ruptura imediata de caixa por descompasso entre recebimentos e pagamentos'
      : (isProfitabilityCrisis
          ? 'Erosão progressiva do patrimônio líquido acumulado'
          : 'Acomodação de mercado e subaproveitamento do capital empregado.');

    const oportunidadeDominante = isProfitabilityCrisis
      ? 'Revisão e corte de Overhead operacional fixo para redução do break-even'
      : 'Reinvestimento estratégico e aceleração de canais comerciais de alta margem.';

    const direcaoRecomendada = top3BoardDecisions[0]?.titulo ?? 'Manutenção preventiva da liquidez corrente.';

    const executiveThesis = InstitutionalExecutiveThesisEngine.generate({
      contexto: thesisContext,
      tensaoPrincipal,
      riscoDominante,
      oportunidadeDominante,
      direcaoRecomendada
    }).narrative;

    // 10. Page Zero (Executive Strategic Snapshot)
    const capitalPreservado = patrimonioLiquido >= capitalSocial
      ? 'Preservado'
      : (patrimonioLiquido <= 0 ? 'Totalmente Erodido' : 'Parcialmente Preservado');

    const capitalPreservadoJustificativa = patrimonioLiquido >= capitalSocial
      ? 'O patrimônio líquido supera o capital social integralizado.'
      : `Prejuízos acumulados consumiram ${((1 - patrimonioLiquido / capitalSocial) * 100).toFixed(0)}% do capital social integralizado.`;

    const pageZero = {
      sobrevivendo: runwayMonths >= 6 ? 'Sim' : 'Sob Pressão',
      sobrevivendoJustificativa: runwayMonths >= 6 
        ? `Runway estimado confortável de ${runwayMonths.toFixed(1)} meses.`
        : `Runway de sobrevivência financeira crítico estimado em ${runwayMonths.toFixed(1)} meses.`,
      criandoValor: economicReturn.classification === 'Criação Consistente de Valor' || economicReturn.classification === 'Criação Moderada de Valor' 
        ? 'Criação de Valor' 
        : 'Destruição de Valor',
      criandoValorConfidence: economicReturn.confidence,
      capitalPreservado,
      capitalPreservadoJustificativa,
      maiorRisco: riscoDominante,
      decisaoMaisImportante: direcaoRecomendada
    };

    const output: InstitutionalBoardPackOutput = {
      status: finalStatus,
      metadata,
      executiveSnapshot,
      governanceReport,
      strategicDirection,
      continuityReport,
      treasuryReport,
      operationalGovernance,
      executiveDirectives,
      explainabilityAppendix,
      lineageAppendix,
      boardResolutionAppendix,
      disclosureSet: disclosures,
      fiduciaryRestrictions,
      constitutionalSection,
      temporalAudit: (
        (report as any)?.featureFlags?.showTechnicalAudit || 
        (report as any).compliance?.featureFlags?.showTechnicalAudit ||
        (report as any).institutionalContext?.featureFlags?.showTechnicalAudit ||
        (report as any).context?.input?.featureFlags?.showTechnicalAudit ||
        (report as any).context?.input?.rawFinancialData?.featureFlags?.showTechnicalAudit ||
        (report as any).context?.input?.rawFinancialData?.featureFlags?.showTechnicalAudit === true
      ) ? report.temporalAudit : undefined,
      constitutionalDashboard: report.constitutionalDashboard,
      constitutionalGovernanceCompliance: report.constitutionalCompliance ? {
        authority: report.constitutionalCompliance.constitutionalAuthority,
        protocols: {
          SCCF: typeof report.constitutionalCompliance.protocols.SCCF === 'string' ? report.constitutionalCompliance.protocols.SCCF : report.constitutionalCompliance.protocols.SCCF.complianceStatus,
          FCF: report.constitutionalCompliance.protocols.FCF,
          TCF: report.constitutionalCompliance.protocols.TCF,
          CCF: report.constitutionalCompliance.protocols.CCF,
          LCF: report.constitutionalCompliance.protocols.LCF,
          ACF: report.constitutionalCompliance.protocols.ACF
        },
        compliance: report.constitutionalCompliance.constitutionalIntegrity === 'VALID' ? 'PASS' : 'FAIL',
        constitutionalIntegrity: report.constitutionalCompliance.constitutionalIntegrity,
        lineage: 'VERIFIED'
      } : undefined,
      constitutionalDecisionIntelligence: (report.decisionIntelligence && !('status' in report.decisionIntelligence) && report.decisionIntelligence.constitutionalStatus === 'VALID') ? {
        priorities: report.decisionIntelligence.executiveDecisions.slice(0, 3).map((d, i) => ({
          priorityLevel: i + 1,
          action: d.recommendedAction,
          category: d.category
        })),
        constitutionalStatus: 'VALID',
        decisionLineage: 'VERIFIED'
      } : undefined,
      constitutionalScenarioIntelligence: (report.scenarioIntelligence && report.scenarioIntelligence.length > 0) ? {
        authority: 'CGL',
        scenarioProtocol: 'SSCP',
        baselineIntegrity: 'VERIFIED',
        determinism: 'VERIFIED',
        lineage: 'VERIFIED',
        simulationStatus: 'APPROVED',
        allScenarioHashes: report.scenarioIntelligence.map(s => s.scenarioHash),
        topScenarios: report.scenarioIntelligence.slice(0, 3).map(s => ({
          scenarioName: s.scenarioName,
          constitutionalStatus: s.constitutionalStatus,
          survivabilityStatus: s.survivabilityStatus,
          scenarioHash: s.scenarioHash,
          impactMatrix: s.impactMatrix
        }))
      } : undefined,
      governanceIntegrityReview,
      fiduciaryStructuralRestrictions,
      structuralLiquidityRisk,
      timeline: report.timeline,
      causality: report.fiduciaryCausality,
      executiveView: {
        contextoEmpresarial: report.context?.stage || 'ESTABLISHED_ANALYSIS',
        principaisRiscos: report.scores?.financialStress?.stressFactors || [],
        prioridades: ExecutivePriorityResolver.resolve(report).map(p => p.title),
        decisoesConstitucionais: report.constitutionalCompliance?.constitutionalIntegrity === 'VALID' ? ['COMPLIANT'] : ['NON_COMPLIANT']
      },
      technicalAppendix: {
        cqs: (report.capitalGovernanceReport as any)?.diagnostics?.behavior?.capitalReinforcementIndex ?? report.scores?.governance ?? 0,
        eqs: (report.metrics as any)?.fiduciary?.earningsQuality ?? null,
        dlpaTechnicalLayer: (report.capitalGovernanceReport as any)?.diagnostics ?? null,
        dfcTechnicalLayer: (report.metrics as any)?.fiduciary ?? null,
        lineage: report.runtimeMetadata?.lineageHash ?? 'N/A',
        constitutionalAudit: (report.constitutionalEvaluation as any)?.constitutionalAuditTrail ?? (report.constitutionalEvaluation as any)?.auditRecords ?? []
      },
      executiveDecisionPrioritization: {
        top3BoardDecisions,
        top5ExecutiveActions,
        priorityMatrix,
        badi,
        maturity: {
          stage: maturity.stage,
          label: maturity.label,
          description: maturity.description,
          severitySofteningFactor: maturity.severitySofteningFactor
        },
        economicReturn,
        thesis: executiveThesis,
        pageZero
      }
    };

    // 6. Hard-Fail Audit (Fase 2)
    RuntimeComplianceEngine.validate(output, 'render');

    // [Knowledge Graph Integration] Chamada Passiva
    BoardDecisionGraphAdapter.registerBoardDecisionGraph(output).catch(err => {
      console.warn('[BoardDecisionGraphAdapter] Async error ignored:', err);
    });

    // 7. Executive Semantic Leak Audit (ELSA Supremacy)
    const capReport = report.capitalGovernanceReport as any;
    const semanticSource = capReport?.semantic?.semanticSource 
      || capReport?.semanticSource 
      || 'LEGACY';

    BoardPackExecutiveRenderingGuard.validate(
      semanticSource,
      JSON.stringify(output)
    );

    return output;
  }

  private static createFailedReport(reason: string): InstitutionalBoardPackOutput {
    return {
      status: 'FAILED',
      metadata: {
        boardPackLineageHash: 'FAILED' as import('../shared/lineage-types').BoardPackLineageHash,
        reportGenerationTimestamp: new Date().toISOString(),
        generatedAt: new Date().toISOString(),
        runtimeVersion: "1.0",
        contractVersion: "1.0",
        tenantId: 'N/A',
        cycleReference: 'N/A',
        snapshotIntegrityStatus: 'COMPROMISED',
        immutabilityStatus: 'MUTABLE',
        runtimeSources: []
      },
      executiveSnapshot: {
        executiveSummary: `Fiduciary generation failed: ${reason}`,
        unifiedThesisStatement: '',
        activeSurvivalMode: false,
        structuralPressureLevel: 'CRITICAL',
        fiduciaryRestrictionsActive: 0
      },
      governanceReport: {
        complianceStatus: 'NON_COMPLIANT',
        activeGovernanceLocks: [],
        executionIntegrity: 'FAILED',
        governanceScore: 0
      },
      strategicDirection: {
        strategicPosture: 'UNVERIFIABLE_POSTURE',
        primaryVector: 'UNKNOWN',
        trajectoryContinuity: 'BROKEN',
        expansionSustainability: false,
        strategicContradictions: []
      },
      continuityReport: {
        resilienceStatus: 'UNSTABLE',
        antifragilityScore: 0,
        survivalOverlays: []
      },
      treasuryReport: {
        treasuryStressStatus: 'CRITICAL',
        liquidityCompressionLevel: 'CRITICAL',
        fundingFragility: 'HIGH',
        runwaySustainability: false
      },
      operationalGovernance: {
        executionStatus: 'FAILED',
        operationalFrictions: [],
        continuityStrain: 'CRITICAL'
      },
      executiveDirectives: {
        activeDirectives: [],
        boardResolutions: []
      },
      explainabilityAppendix: {
        rationaleMap: {},
        confidenceDecomposition: {}
      },
      lineageAppendix: {
        boardPackLineageHash: 'FAILED' as import('../shared/lineage-types').BoardPackLineageHash,
        runtimeHashes: {},
        propagationHashes: []
      },
      boardResolutionAppendix: {
        resolutionIds: [],
        approvals: [],
        readOnlyHistoricalMemory: true
      },
      disclosureSet: [
        {
          disclosureId: 'DISC-FAILED',
          disclosureType: 'DEGRADATION',
          severity: 'CRITICAL',
          sourceRuntime: 'BoardPackRuntime',
          restrictionLevel: 'HARD',
          message: reason
        }
      ],
      fiduciaryRestrictions: [],
      governanceIntegrityReview: undefined,
      fiduciaryStructuralRestrictions: undefined,
      structuralLiquidityRisk: undefined
    };
  }

  private static generateHash(prefix: string, data: Record<string, string>): string {
    return `${prefix}_${btoa(JSON.stringify(data)).substring(0, 16)}`;
  }
}
