// src/core/runtime/compliance/RuntimeComplianceEngine.ts
//
// Institutional Fiduciary Runtime Constitution
// Ref: docs/implementation_plan.md

import {
  FiduciaryRuntimeContract,
  MathematicalIntegrityContract,
  SemanticGovernanceContract,
  LineagePropagationContract,
  ConfidencePropagationContract,
  FailClosedContract,
  InstitutionalAuditabilityContract
} from './FiduciaryContracts';
import { RuntimeLabel } from '../../../i18n/translationKeyGovernance';

export interface RuntimeCertification {
  isCertified: boolean;
  scores: {
    deterministicIntegrity: number; // 0-100
    fiduciaryCompliance: number;    // 0-100
    lineageSafety: number;          // 0-100
    mathematicalStability: number;  // 0-100
    failClosedCompliance: number;   // 0-100
    semanticGovernanceIntegrity: number; // 0-100
    institutionalAuditability: number;   // 0-100
  };
  overallGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  certifiedAt: string;
  signature: string;
}

export interface ComplianceValidationResult {
  isValid: boolean;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  violations: RuntimeLabel[];
  warnings: RuntimeLabel[];
  certification: RuntimeCertification;
}

export type ComplianceMode = 'render' | 'export' | 'publish' | 'advisory';

const FORBIDDEN_WORDS = [
  'falência inevitável',
  'roubo',
  'fraude',
  'desvio',
  'sonegação',
  'crime',
  'destruição total',
  'colapso definitivo',
  'empresa inviável'
];

export class RuntimeComplianceEngine implements
  FiduciaryRuntimeContract,
  MathematicalIntegrityContract,
  SemanticGovernanceContract,
  LineagePropagationContract,
  ConfidencePropagationContract,
  FailClosedContract,
  InstitutionalAuditabilityContract
{
  private static instance: RuntimeComplianceEngine;

  public static getInstance(): RuntimeComplianceEngine {
    if (!RuntimeComplianceEngine.instance) {
      RuntimeComplianceEngine.instance = new RuntimeComplianceEngine();
    }
    return RuntimeComplianceEngine.instance;
  }

  /**
   * Materiality Denominator Validation.
   * If denominator is zero, near-zero, or structurally invalid, return "Base insuficiente..."
   */
  public validateDenominator(numerator: number, denominator: number, threshold = 0.01): number | RuntimeLabel {
    if (isNaN(denominator) || isNaN(numerator)) {
      return { labelKey: 'runtime.compliance.insufficient_base_for_deterministic_calculation', severity: 'critical' };
    }
    if (Math.abs(denominator) <= threshold) {
      return { labelKey: 'runtime.compliance.insufficient_base_for_deterministic_calculation', severity: 'critical' };
    }
    return numerator / denominator;
  }

  public static validateBoardPack(boardPack: any): void {
    // Basic wrapper to satisfy institutional requirements
    // Real implementation would validate specific board pack constraints
    const engine = RuntimeComplianceEngine.getInstance();
    
    // Ensure the board pack has lineage
    const lineageCheck = engine.verifyLineage(boardPack);
    if (!lineageCheck.isComplete) {
       console.warn('Board Pack lineage incomplete');
    }
  }

  /**
   * Universal entry point to validate any runtime output.
   */
  public static validate(report: any, mode: ComplianceMode): ComplianceValidationResult {
    const engine = RuntimeComplianceEngine.getInstance();
    const violations: RuntimeLabel[] = [];
    const warnings: RuntimeLabel[] = [];

    if (!report) {
      throw new Error('VIOLAÇÃO DE GOVERNANÇA: Impossível validar relatório nulo ou inexistente.');
    }

    // 1. Math Sanity Check
    const mathCheck = engine.validateMathSanity(report);
    if (!mathCheck.isValid) {
      violations.push(...mathCheck.errors);
    }

    // 2. Fiduciary Validation
    const fiduciaryCheck = engine.validateFiduciarySafety(report);
    if (!fiduciaryCheck.isSafe) {
      violations.push(...fiduciaryCheck.violations);
    }

    // 3. Semantic Validation
    const semanticCheck = engine.validateSemanticSobriety(report);
    warnings.push(...semanticCheck.warnings);
    if (!semanticCheck.isValid) {
      violations.push(...semanticCheck.forbiddenTermsFound);
    }

    // 4. Lineage Check
    const lineageCheck = engine.verifyLineage(report);
    if (!lineageCheck.isComplete) {
      violations.push(...lineageCheck.missingFields);
    }

    // 5. Confidence check
    const confCheck = engine.propagateConfidence(report);
    if (report.compliance && report.compliance.confidenceLevel) {
      if (report.compliance.confidenceLevel !== confCheck.confidenceLevel) {
        violations.push({ 
          labelKey: 'runtime.compliance.confidence_corruption',
          severity: 'critical',
          args: { reported: report.compliance.confidenceLevel, propagated: confCheck.confidenceLevel }
        });
      }
    }

    // Calculate certification scores and grade
    const certification = engine.certifyReport(report, violations, mathCheck, semanticCheck, lineageCheck, confCheck);
    const grade = certification.overallGrade;
    const isValid = grade !== 'F' && violations.length === 0;

    // Apply enforcement behavior based on mode
    if (mode === 'export' || mode === 'publish') {
      if (!isValid) {
        throw new Error(`BLOQUEIO CONSTITUCIONAL: Geração de documento institucional bloqueada devido a falha de compliance fiduciário (Grau ${grade}). Violations: ${violations.map(v => v.labelKey).join('; ')}`);
      }
    } else if (mode === 'advisory') {
      // advisoryMode - Sanitize and degrade
      if (!isValid) {
        engine.applyFailClosed(report, `Validation failed: ${violations.map(v => v.labelKey).join(', ')}`);
      }
    } else if (mode === 'render') {
      // renderMode - Allow degraded visualization with banner
      if (!isValid) {
        if (!report.compliance) report.compliance = {};
        if (!report.compliance.auditFlags) report.compliance.auditFlags = [];
        report.compliance.auditFlags.push('NON_COMPLIANT_RENDER_DEGRADED');
        report.compliance.complianceGrade = grade;
        report.compliance.isCertified = false;
        report.compliance.validationErrors = violations;
      }
    }

    return {
      isValid,
      grade,
      violations,
      warnings,
      certification
    };
  }

  /**
   * Computes grading metrics and signature
   */
  private certifyReport(
    report: any,
    violations: RuntimeLabel[],
    mathCheck: any,
    semanticCheck: any,
    lineageCheck: any,
    confCheck: any
  ): RuntimeCertification {
    const scores = {
      deterministicIntegrity: violations.some(v => v.labelKey.includes('bypass') || v.labelKey.includes('ui')) ? 30 : 100,
      fiduciaryCompliance: violations.some(v => v.labelKey.includes('governance') || v.labelKey.includes('distributive')) ? 40 : 100,
      lineageSafety: lineageCheck.isComplete ? 100 : 50,
      mathematicalStability: mathCheck.isValid ? 100 : 50,
      failClosedCompliance: (report.telemetry?.isFailClosedActivated || report.telemetry?.isFailClosedTriggered) ? 100 : 90,
      semanticGovernanceIntegrity: semanticCheck.isValid ? 100 : 60,
      institutionalAuditability: report.runtimeMetadata ? 100 : 40
    };

    // Deduct scores if warnings exist
    if (semanticCheck.warnings.length > 0) {
      scores.semanticGovernanceIntegrity = Math.max(0, scores.semanticGovernanceIntegrity - 15);
    }
    if (mathCheck.errors.length > 0) {
      scores.mathematicalStability = Math.max(0, scores.mathematicalStability - 20);
    }

    // Determine overall grade
    const minScore = Math.min(
      scores.deterministicIntegrity,
      scores.fiduciaryCompliance,
      scores.lineageSafety,
      scores.mathematicalStability,
      scores.failClosedCompliance,
      scores.semanticGovernanceIntegrity,
      scores.institutionalAuditability
    );

    let overallGrade: 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
    if (minScore >= 95 && violations.length === 0) overallGrade = 'A';
    else if (minScore >= 80 && violations.length === 0) overallGrade = 'B';
    else if (minScore >= 70 && violations.length === 0) overallGrade = 'C';
    else if (minScore >= 60 && violations.length === 0) overallGrade = 'D';
    else overallGrade = 'F';

    const timestamp = new Date().toISOString();
    const signature = `CERT-SIG-${timestamp}-${minScore}-${overallGrade}-${Math.floor(Math.random() * 1000)}`;

    return {
      isCertified: overallGrade !== 'F',
      scores,
      overallGrade,
      certifiedAt: timestamp,
      signature
    };
  }

  // ── Contracts Implementation ──────────────────────────────────────────────

  /**
   * FiduciaryRuntimeContract: validate safety of report decisions/interpretations
   */
  public validateFiduciarySafety(report: any): { isSafe: boolean; violations: RuntimeLabel[] } {
    const violations: RuntimeLabel[] = [];

    // Rule: DESTRUTIVA requires explicit distributive evidence
    const behavior = report.capitalGovernanceReport?.behavior || report.behavior;
    const hasDistributiveEvidence = report.capitalGovernanceReport?.distribution?.hasDistributiveEvidence ||
      report.capitalGovernanceReport?.hasDistributiveEvidence ||
      report.compliance?.hasDistributiveEvidence ||
      false;

    if (behavior) {
      const maturity = typeof behavior === 'object' ? behavior.governanceMaturity : behavior;
      if (maturity === 'DESTRUTIVA' && !hasDistributiveEvidence) {
        violations.push({ labelKey: 'runtime.compliance.fiduciary_violation_destructive_without_evidence', severity: 'critical' });
      }
    }

    // Ensure UI cannot calculate score
    if (report.recalculatedOnUI === true) {
      violations.push({ labelKey: 'runtime.compliance.architecture_bypass_ui_recalculation', severity: 'critical' });
    }

    return {
      isSafe: violations.length === 0,
      violations
    };
  }

  /**
   * MathematicalIntegrityContract: validate math sanity of calculations
   */
  public validateMathSanity(metrics: any): { isValid: boolean; errors: RuntimeLabel[] } {
    const errors: RuntimeLabel[] = [];

    // Helper: Recursively look for NaN, Infinity or explosive values in numerical fields
    const scanNumbers = (obj: any, path = '') => {
      if (!obj) return;
      for (const key in obj) {
        const val = obj[key];
        const currentPath = path ? `${path}.${key}` : key;
        
        if (typeof val === 'number') {
          if (isNaN(val)) {
            errors.push({ labelKey: 'runtime.math.nan_error', severity: 'critical', args: { path: currentPath } });
          } else if (!isFinite(val)) {
            errors.push({ labelKey: 'runtime.math.infinity_error', severity: 'critical', args: { path: currentPath } });
          } else if (
            // Verify explosive percentage limits on structural ratios: retention, distribution, preservation, capitalization
            (key.toLowerCase().includes('ratio') || key.toLowerCase().includes('taxa') || key.toLowerCase().includes('index')) &&
            // Exclude operational which contains the substring "ratio" (ope-ratio-nal)
            !key.toLowerCase().includes('operational') &&
            // Filter: variation or growth metrics are excluded from hard block
            !key.toLowerCase().includes('growth') && 
            !key.toLowerCase().includes('variation') &&
            !key.toLowerCase().includes('recovery') &&
            !key.toLowerCase().includes('crescimento') &&
            !key.toLowerCase().includes('variação')
          ) {
            // Hard block absolute ratio values exceeding 10.0 (1000%) or below -10.0 (-1000%)
            if (val > 10.0 || val < -10.0) {
              errors.push({ labelKey: 'runtime.math.explosive_metric', severity: 'critical', args: { path: currentPath, value: (val * 100).toFixed(0) } });
            }
          }
        } else if (typeof val === 'object') {
          scanNumbers(val, currentPath);
        }
      }
    };

    scanNumbers(metrics);

    // Verify institutional scores are valid
    if (metrics.scores) {
      for (const k in metrics.scores) {
        const score = metrics.scores[k];
        if (typeof score === 'number') {
          if (score < 0 || score > 100 || isNaN(score) || !isFinite(score)) {
            errors.push({ labelKey: 'runtime.math.invalid_score', severity: 'critical', args: { scoreName: k, value: score } });
          }
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * SemanticGovernanceContract: validate narrative style
   */
  public validateSemanticSobriety(report: any): { isValid: boolean; warnings: RuntimeLabel[]; forbiddenTermsFound: RuntimeLabel[] } {
    const warnings: RuntimeLabel[] = [];
    const forbiddenTermsFound: RuntimeLabel[] = [];

    // Distributive evidence check
    const hasDistributiveEvidence = report.capitalGovernanceReport?.distribution?.hasDistributiveEvidence ||
      report.capitalGovernanceReport?.hasDistributiveEvidence ||
      false;

    const scanText = (obj: any, path = '') => {
      if (!obj) return;
      for (const key in obj) {
        const val = obj[key];
        const currentPath = path ? `${path}.${key}` : key;

        if (typeof val === 'string') {
          const lower = val.toLowerCase();

          // Scan forbidden words
          FORBIDDEN_WORDS.forEach(word => {
            if (lower.includes(word)) {
              forbiddenTermsFound.push({ labelKey: 'runtime.semantic.forbidden_term', severity: 'critical', args: { term: word } });
            }
          });

          // Check "predatório" or "destrutiva" without distributive evidence
          if (!hasDistributiveEvidence) {
            if (lower.includes('predatório') || lower.includes('predatória') || lower.includes('destrutivo') || lower.includes('destrutiva')) {
              forbiddenTermsFound.push({ labelKey: 'runtime.semantic.destructive_term_without_evidence', severity: 'critical' });
            }
          }

          // Check dramatic language (adjectives like catastrófico, absurdo, terrível, roubo, pânico)
          const dramaticWords = ['catastrófico', 'catastrófica', 'absurdo', 'terrível', 'pânico', 'desastroso', 'desastrosa'];
          dramaticWords.forEach(word => {
            if (lower.includes(word)) {
              warnings.push({ labelKey: 'runtime.semantic.non_institutional_tone', severity: 'warning', args: { path: currentPath, term: word } });
            }
          });
        } else if (typeof val === 'object') {
          scanText(val, currentPath);
        }
      }
    };

    scanText(report);

    return {
      isValid: forbiddenTermsFound.length === 0,
      warnings,
      forbiddenTermsFound
    };
  }

  /**
   * LineagePropagationContract: verify tracing hashes
   */
  public verifyLineage(report: any): { isComplete: boolean; lineageHash?: string; missingFields: RuntimeLabel[] } {
    const missingFields: RuntimeLabel[] = [];
    const metadata = report.runtimeMetadata;
    const lineage = metadata?.lineage;

    if (!metadata) {
      missingFields.push({ labelKey: 'runtime.lineage.missing_field', severity: 'critical', args: { field: 'runtimeMetadata' } });
    }
    if (!lineage) {
      missingFields.push({ labelKey: 'runtime.lineage.missing_field', severity: 'critical', args: { field: 'runtimeMetadata.lineage' } });
    } else {
      if (!lineage.datasetHash) missingFields.push({ labelKey: 'runtime.lineage.missing_field', severity: 'critical', args: { field: 'lineage.datasetHash' } });
      if (!lineage.tenantId) missingFields.push({ labelKey: 'runtime.lineage.missing_field', severity: 'critical', args: { field: 'lineage.tenantId' } });
      if (!lineage.importId) missingFields.push({ labelKey: 'runtime.lineage.missing_field', severity: 'critical', args: { field: 'lineage.importId' } });
    }

    return {
      isComplete: missingFields.length === 0,
      lineageHash: lineage?.datasetHash,
      missingFields
    };
  }

  /**
   * ConfidencePropagationContract: calculate correct propagated confidence level
   */
  public propagateConfidence(report: any): { confidenceLevel: 'HIGH_CONFIDENCE' | 'MEDIUM_CONFIDENCE' | 'LOW_CONFIDENCE'; factors: RuntimeLabel[] } {
    const factors: RuntimeLabel[] = [];
    
    // Check various component confidences
    const cashFlowConf = report.cashFlowReport?.isAvailable ? (report.cashFlowReport.confidence || 'HIGH_CONFIDENCE') : 'HIGH_CONFIDENCE';
    const capGovConf = report.capitalGovernanceReport?.isAvailable ? (report.capitalGovernanceReport.confidence || 'HIGH_CONFIDENCE') : 'HIGH_CONFIDENCE';
    const contextConf = report.institutionalContext?.confidence?.strategicConfidence || 'HIGH_CONFIDENCE';
    
    // Map to levels
    const getLevelVal = (l: string) => {
      if (l.includes('LOW') || l.includes('UNVERIFIABLE') || l.includes('LIMITED')) return 1;
      if (l.includes('MEDIUM') || l.includes('MODERATE')) return 2;
      return 3;
    };

    const cfVal = getLevelVal(cashFlowConf);
    const cgVal = getLevelVal(capGovConf);
    const cxVal = getLevelVal(contextConf);

    const minVal = Math.min(cfVal, cgVal, cxVal);
    let confidenceLevel: 'HIGH_CONFIDENCE' | 'MEDIUM_CONFIDENCE' | 'LOW_CONFIDENCE' = 'HIGH_CONFIDENCE';

    if (minVal === 1) {
      confidenceLevel = 'LOW_CONFIDENCE';
      factors.push({ labelKey: 'runtime.confidence.downgraded_insufficient_data', severity: 'warning' });
    } else if (minVal === 2) {
      confidenceLevel = 'MEDIUM_CONFIDENCE';
      factors.push({ labelKey: 'runtime.confidence.moderate_coverage', severity: 'info' });
    }

    return {
      confidenceLevel,
      factors
    };
  }

  /**
   * FailClosedContract: apply fail closed degradation
   */
  public applyFailClosed(report: any, reason: string): any {
    console.warn(`[Fail Closed Compliance] Degradando relatório fiduciário: ${reason}`);

    // Set scores to neutral/safe levels
    if (report.scores) {
      report.scores.financial = 0;
      report.scores.operational = 0;
      report.scores.governance = 0;
      report.scores.structural = 0;
      report.scores.composite = 0;
    }

    // Degrade narratives
    if (report.advisory) {
      report.advisory.executiveSummary = 'Informação insuficiente para inferência institucional validada devido a violação de segurança constitucional.';
      report.advisory.priorityFocus = 'Regularizar conformidade dos dados contábeis.';
      report.advisory.actionMatrix = ['[ ] Auditoria estrutural urgente e reintegração dos lançamentos contábeis.'];
    }

    if (report.orchestratedNarrative) {
      report.orchestratedNarrative.summary = 'Execução restrita pela governança fiduciária.';
      report.orchestratedNarrative.tensions = [];
      report.orchestratedNarrative.recommendations = [];
    }

    if (report.compliance) {
      if (!report.compliance.auditFlags) report.compliance.auditFlags = [];
      report.compliance.auditFlags.push('FAIL_CLOSED_ACTIVATED');
      report.compliance.failClosedReason = reason;
      report.compliance.confidenceLevel = 'LOW_CONFIDENCE';
    }

    return report;
  }

  /**
   * InstitutionalAuditabilityContract
   */
  public generateAuditTrail(report: any) {
    return {
      auditId: `AUDIT-COMPLIANCE-${Date.now()}`,
      timestamp: new Date().toISOString(),
      reportId: report.runtimeMetadata?.importId || 'N/A',
      tenantId: report.runtimeMetadata?.lineage?.tenantId || 'N/A',
      grade: report.compliance?.complianceGrade || 'F',
      certified: report.compliance?.isCertified || false,
      violations: report.compliance?.validationErrors || []
    };
  }
}
