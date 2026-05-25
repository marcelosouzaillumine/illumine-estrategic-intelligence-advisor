import { PilotEnvironment } from './PilotReadinessTypes';

export class PilotEnvironmentManager {
  static getPilotStatus(tenantId: string): PilotEnvironment {
    return {
      pilotId: 'PILOT-' + tenantId,
      tenantId,
      sandboxName: 'Enterprise Validation Sandbox',
      status: 'ACTIVE',
      readinessScore: 85
    };
  }
}
