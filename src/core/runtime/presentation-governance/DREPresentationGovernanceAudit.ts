/**
 * DREPresentationGovernanceAudit
 * 
 * DEGFF v1.0 & v1.1 — Validates DRE presentation compliance.
 */

import { CrossStatementNarrativeIsolationRegistry } from './CrossStatementNarrativeIsolationRegistry';

export interface DREAuditResult {
  terminologyLeakage: boolean;
  cashContamination: boolean;
  technicalLayerCollapsed: boolean;
  severityValid: boolean;
  advisoryValid: boolean;
  governanceStatus: 'PASS' | 'FAIL';
}

export class DREPresentationGovernanceAudit {
  public static validate(
    narrative: string,
    isTechnicalLayerExpanded: boolean,
    severity: string,
    advisoryLength: number,
    advisoryStructureCompliant: boolean
  ): DREAuditResult {
    const cashValidation = CrossStatementNarrativeIsolationRegistry.validate(narrative);
    const hasEnglishTerms = narrative.includes('Net Revenue') || narrative.includes('Gross Revenue');
    
    // Valid Severities
    const validSeverities = ['Estrutura Saudável', 'Atenção', 'Restritivo', 'Crítico', 'Colapso Econômico'];
    const severityValid = validSeverities.includes(severity);

    const advisoryValid = advisoryLength <= 800 && advisoryStructureCompliant;

    const result: DREAuditResult = {
      terminologyLeakage: hasEnglishTerms,
      cashContamination: !cashValidation.isCompliant,
      technicalLayerCollapsed: !isTechnicalLayerExpanded,
      severityValid,
      advisoryValid,
      governanceStatus: 'FAIL'
    };

    if (!result.terminologyLeakage && 
        !result.cashContamination && 
        result.technicalLayerCollapsed && 
        result.severityValid && 
        result.advisoryValid) {
      result.governanceStatus = 'PASS';
    }

    return result;
  }
}
