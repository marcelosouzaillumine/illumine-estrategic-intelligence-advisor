import { sha256 } from '../../../workspace/runtime/executive/types';
import { ExecutiveDecisionObject } from './ExecutiveDecisionObject';
import { ExecutiveDecisionReport } from './ExecutiveDecisionReport';
import { DecisionPrioritizationEngine } from './DecisionPrioritizationEngine';
import { ExecutiveActionMatrixEngine } from './ExecutiveActionMatrixEngine';
import { ConstitutionalActionRegistry } from './ConstitutionalActionRegistry';
import { ExecutiveDecisionConstitutionProtocol } from '../constitutional-governance/protocols/ExecutiveDecisionConstitutionProtocol';

export class ConstitutionalDecisionRuntime {
  public static evaluate(
    cglStatus: string,
    context: any
  ): ExecutiveDecisionReport | { status: 'CDIL_BLOCKED_BY_CGL' } {
    if (cglStatus !== 'VALID') {
      return { status: 'CDIL_BLOCKED_BY_CGL' };
    }

    const priority = DecisionPrioritizationEngine.evaluatePriority(context);
    const urgency = DecisionPrioritizationEngine.evaluateUrgency(priority);

    const mappedActionIds = ExecutiveActionMatrixEngine.mapActions(context);
    
    const decisions: ExecutiveDecisionObject[] = mappedActionIds.map((actionId, index) => {
      const actionDef = ConstitutionalActionRegistry.getAction(actionId);
      return {
        decisionId: `DEC-${context?.lineageHash || 'UNKNOWN'}-${index}`,
        actionId,
        actionSource: 'CAR',
        category: (actionDef?.category as ExecutiveDecisionObject['category']) || 'TREASURY',
        priority,
        urgency,
        constitutionalStatus: 'VALID',
        recommendedAction: actionDef?.title || 'Unknown Action',
        rationale: ['Mapped deterministically by ExecutiveActionMatrixEngine'],
        supportingMetrics: ['FCO', 'Liquidity Score'],
        lineageReferences: [context?.lineageHash || 'NO_LINEAGE'],
        constitutionalProtocols: actionDef?.constitutionalProtocols || []
      };
    });

    const edcf = new ExecutiveDecisionConstitutionProtocol();
    const edcfReport = edcf.validate({ cglContext: context, decisions });

    const isEdcfValid = edcfReport.status === 'PASS';

    // Hash deterministic excluding generatedAt
    const hashPayload = {
      decisions: decisions.map(d => ({
        decisionId: d.decisionId,
        actionId: d.actionId,
        category: d.category,
        priority: d.priority,
        urgency: d.urgency,
        supportingMetrics: d.supportingMetrics,
        lineageReferences: d.lineageReferences,
        constitutionalProtocols: d.constitutionalProtocols
      }))
    };

    const decisionHash = sha256(JSON.stringify(hashPayload)).substring(0, 16);

    return {
      overallPriority: priority,
      executiveDecisions: decisions,
      constitutionalStatus: isEdcfValid ? 'VALID' : 'BLOCKED',
      decisionHash,
      generatedAt: new Date().toISOString(),
      decisionCompliance: {
        constitutionalStatus: isEdcfValid ? 'VALID' : 'INVALID',
        lineageStatus: isEdcfValid ? 'VALID' : 'INVALID',
        survivabilityStatus: isEdcfValid ? 'VALID' : 'INVALID',
        conflictStatus: isEdcfValid ? 'VALID' : 'INVALID'
      }
    };
  }
}
