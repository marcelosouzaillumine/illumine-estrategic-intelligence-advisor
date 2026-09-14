import { ConstitutionalProtocol, ValidationResult } from '../ConstitutionalProtocolDefinition';
import { DecisionConflictEngine } from '../../decision-intelligence/DecisionConflictEngine';
import { DecisionSurvivabilityFilter } from '../../decision-intelligence/DecisionSurvivabilityFilter';
import { DecisionLineageFramework } from '../../decision-intelligence/DecisionLineageFramework';
import { ExecutiveDecisionObject } from '../../decision-intelligence/ExecutiveDecisionObject';

export class ExecutiveDecisionConstitutionProtocol implements ConstitutionalProtocol {
  public protocolId = 'EDCF';
  public protocolName = 'Executive Decision Constitution Framework';
  public protocolVersion = '1.0';
  public authorityLevel = 'EXECUTIVE';

  public validate(context: { cglContext: any, decisions: ExecutiveDecisionObject[] }): ValidationResult {
    const violations: string[] = [];
    const decisions = context.decisions || [];

    // 1. Conflict Validation
    const conflictResult = DecisionConflictEngine.validate(decisions);
    if (conflictResult.status !== 'VALID') {
      violations.push(`EXECUTIVE_DECISION_CONSTITUTION_VIOLATION: ${conflictResult.conflicts?.join(', ')}`);
    }

    // 2. Survivability Validation
    for (const decision of decisions) {
      const survResult = DecisionSurvivabilityFilter.validate(decision, context.cglContext);
      if (survResult.status !== 'VALID') {
        violations.push(`EXECUTIVE_DECISION_CONSTITUTION_VIOLATION: ${survResult.reason}`);
      }
    }

    // 3. Lineage Validation
    for (const decision of decisions) {
      const lineageResult = DecisionLineageFramework.validate(decision);
      if (lineageResult.status !== 'VALID') {
        violations.push(`EXECUTIVE_DECISION_CONSTITUTION_VIOLATION: ${lineageResult.reason}`);
      }
    }

    if (violations.length > 0) {
      return {
        status: 'FAIL',
        violations
      };
    }

    return {
      status: 'PASS',
      violations: []
    };
  }
}

