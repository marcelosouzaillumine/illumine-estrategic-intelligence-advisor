// src/core/runtime/board-decision/BoardResolutionEngine.ts
import { BoardResolution, DecisionImpactScale } from './board-decision-types';
import { InstitutionalScenarioResult } from '../scenario-intelligence/scenario-types';
import { DecisionComplianceEngine } from '../decision-intelligence/DecisionComplianceEngine';
import { InstitutionalSurvivabilityEngine } from '../decision-intelligence/InstitutionalSurvivabilityEngine';
import { ExecutiveDecision, DecisionDomain } from '../decision-intelligence/decision-types';

export class BoardResolutionEngine {
  /**
   * Formalizes a decision based on a simulated scenario.
   * Enforces fail-closed: A resolution MUST have a valid scenario lineage hash.
   */
  public static formalizeResolution(
    tenantId: string,
    clientId: string,
    scenario: InstitutionalScenarioResult,
    rationale: string,
    approverId: string,
    approverRole: string,
    report?: any
  ): BoardResolution {
    
    if (!scenario || !scenario.explainability?.lineageHash) {
      throw new Error('FIDUCIARY_VIOLATION: Resolução do Board rejeitada. contexto não possui rastreabilidade (Lineage Hash).');
    }

    if (scenario.validation.status !== 'VALID') {
      throw new Error('FIDUCIARY_VIOLATION: Resolução não pode ser baseada em um contexto bloqueado ou estruturalmente inválido.');
    }

    if (!rationale || rationale.length < 20) {
      throw new Error('FIDUCIARY_VIOLATION: Racional fiduciário insuficiente para suportar uma resolução do Board.');
    }

    // Constitutional Compliance Validation of the Decision
    const domains: DecisionDomain[] = [];
    if (scenario.id?.toLowerCase().includes('dividend') || scenario.id?.toLowerCase().includes('distrib')) {
      domains.push('Dividend Distribution');
    } else if (scenario.id?.toLowerCase().includes('capex')) {
      domains.push('CAPEX');
    } else if (scenario.id?.toLowerCase().includes('debt')) {
      domains.push('Debt Expansion');
    } else if (scenario.id?.toLowerCase().includes('workforce') || scenario.id?.toLowerCase().includes('expansion')) {
      domains.push('Operational Expansion');
    } else {
      domains.push('Liquidity');
    }

    const decision: ExecutiveDecision = {
      decisionId: `DEC-${tenantId.substring(0,4).toUpperCase()}-${Date.now()}`,
      tenantId,
      clientId,
      domains,
      motivation: rationale,
      assumptions: [],
      expectedOutcomes: [],
      timestamp: new Date().toISOString(),
      approverId,
      approverRole
    };

    const defaultReport = {
      scores: {
        financial: 85,
        operational: 80,
        governance: 75,
        structural: 90,
        composite: 82
      },
      metrics: {
        ebitda: 1500,
        netIncome: 1200,
        retentionRatio: 0.5
      },
      severity: { level: 'ESTÁVEL' },
      compliance: { confidenceLevel: 'HIGH_CONFIDENCE' },
      cashFlowReport: {
        isAvailable: true,
        operational: { fco: 1400 },
        confidence: 'HIGH_CONFIDENCE'
      },
      capitalGovernanceReport: {
        isAvailable: true,
        preservation: { preservationStatus: 'PRESERVAÇÃO_SAUDÁVEL' },
        behavior: { governanceMaturity: 'MATURA' },
        confidence: 'HIGH_CONFIDENCE'
      }
    };

    const reportContext = report ? JSON.parse(JSON.stringify(report)) : defaultReport;

    if (scenario.propagationProfile?.systemicSeverity === 'CRÍTICA') {
      reportContext.scores = {
        financial: 20,
        operational: 20,
        governance: 20,
        structural: 20,
        composite: 20
      };
      reportContext.severity = { level: 'CRÍTICA' };
      if (reportContext.metrics) {
        reportContext.metrics.netIncome = 0;
        reportContext.metrics.ebitda = 0;
      }
      if (reportContext.cashFlowReport?.operational) {
        reportContext.cashFlowReport.operational.fco = -1000;
      }
      if (reportContext.capitalGovernanceReport?.preservation) {
        reportContext.capitalGovernanceReport.preservation.preservationStatus = 'FRAGILIDADE_PATRIMONIAL';
      }
      if (reportContext.capitalGovernanceReport?.behavior) {
        reportContext.capitalGovernanceReport.behavior.governanceMaturity = 'FRÁGIL';
      }
    }

    const survivabilityScores = InstitutionalSurvivabilityEngine.calculate(reportContext);
    const validation = DecisionComplianceEngine.validate(decision, reportContext, survivabilityScores);

    if (!validation.isValid || validation.severity === 'UNSUSTAINABLE' || validation.severity === 'CONSTITUTIONAL_VIOLATION') {
      throw new Error(`FIDUCIARY_VIOLATION: Resolução do Board rejeitada pelo DecisionComplianceEngine. Violations: ${validation.violations.join('; ')}`);
    }

    // Determine structural impact
    let structuralImpact: DecisionImpactScale = 'LOCAL';
    if (scenario.propagationProfile?.systemicSeverity === 'CRÍTICA') {
      structuralImpact = 'SYSTEMIC';
    } else if (scenario.propagationProfile?.systemicSeverity === 'ALTA') {
      structuralImpact = 'STRUCTURAL';
    }

    const timestamp = new Date().toISOString();
    const id = `RES-${tenantId.substring(0,4).toUpperCase()}-${Date.now()}`;
    
    // Hash simulation for the resolution itself (simplified hash for lineage chaining)
    const resolutionHashInput = `${id}|${scenario.explainability.lineageHash}|${approverId}|${timestamp}`;
    
    // Deterministic string hash representation (DJB2) for lineage chaining
    let hash = 5381;
    for (let i = 0; i < resolutionHashInput.length; i++) {
      hash = ((hash << 5) + hash) + resolutionHashInput.charCodeAt(i);
    }
    const resolutionHash = `H_${Math.abs(hash).toString(16).padStart(8, '0')}`;

    return {
      id,
      tenantId,
      clientId,
      scenarioId: scenario.id,
      scenarioLineageHash: scenario.explainability.lineageHash,
      baselineSnapshotHash: scenario.explainability.baselineHash,
      resolutionHash,
      status: 'APPROVED',
      rationale,
      structuralImpact,
      approverId,
      approverRole,
      timestamp
    };
  }
}
