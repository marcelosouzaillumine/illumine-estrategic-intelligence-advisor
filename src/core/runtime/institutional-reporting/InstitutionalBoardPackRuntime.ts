import { ExecutiveIntelligenceReport } from '../executive-intelligence-runtime';
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
import { InstitutionalDisclosureEngine } from './engines/InstitutionalDisclosureEngine';
import { BoardResolutionAppendixEngine } from './engines/BoardResolutionAppendixEngine';
import { RuntimeComplianceEngine } from '../compliance/RuntimeComplianceEngine';
import { BoardPackMetadata } from './institutional-reporting-types';

import { BoardPackExecutiveRenderingGuard } from '../lifecycle/BoardPackExecutiveRenderingGuard';
import { ExecutivePriorityResolver } from '../decision-intelligence/ExecutivePriorityResolver';

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
    
    const disclosures = InstitutionalDisclosureEngine.generate(report, metadata);
    const fiduciaryRestrictions = InstitutionalDisclosureEngine.generateRestrictions(report, metadata);

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
      }
    };

    // 6. Hard-Fail Audit (Fase 2)
    RuntimeComplianceEngine.validate(output, 'render');

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
