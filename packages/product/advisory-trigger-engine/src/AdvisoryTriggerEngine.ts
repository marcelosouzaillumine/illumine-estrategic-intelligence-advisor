import { Identifier } from '@illumine/core-primitives';
import { CorporateDimensionType } from '@illumine/semantic-model';
import { EnterpriseSignalEvent } from '@illumine/continuous-intelligence-monitor';

export type TriggerCategory = 'Financial' | 'Operational' | 'Strategic' | 'Risk';

export interface AdvisoryTrigger {
  readonly triggerId: Identifier;
  readonly triggerType: TriggerCategory;
  readonly urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  readonly affectedDomain: CorporateDimensionType;
  readonly recommendedAgents: string[];
  readonly expectedImpactSummary: string;
}

export class AdvisoryTriggerEngine {
  public static evaluateSignal(signal: EnterpriseSignalEvent): AdvisoryTrigger | null {
    if (signal.severity === 'HIGH' || signal.severity === 'CRITICAL') {
      return {
        triggerId: `trig-${signal.signalId}`,
        triggerType: signal.domain === 'FINANCE' ? 'Financial' : 'Risk',
        urgency: signal.severity,
        affectedDomain: signal.domain,
        recommendedAgents: ['cfo-governance-agent', 'executive-decision-agent'],
        expectedImpactSummary: `Gatilho proativo ativado para atenuação de risco em ${signal.metric}`
      };
    }
    return null;
  }
}
