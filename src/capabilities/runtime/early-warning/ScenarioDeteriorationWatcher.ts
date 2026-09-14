import { RiskSignal } from './EarlyWarningTypes';

export class ScenarioDeteriorationWatcher {
  static watchScenarios(tenantId: string): RiskSignal[] {
    // MOCK: Redução da sobrevivência em contextos de stress
    return [
      {
        source: 'SCENARIO_RUNTIME',
        value: 0.9,
        metadata: {
          insight: 'Redução drástica de survivability em contextos de stress de capital.',
          scenarioIds: ['SCN-STR-01']
        }
      }
    ];
  }
}
