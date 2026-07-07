import { InstitutionalObservabilityRegistry } from '../../../core/observability/InstitutionalObservabilityRegistry';

export class WarRoomApplicationService {
  static recordWarRoomOpened(tenantId: string, activeScenarioId?: string) {
    InstitutionalObservabilityRegistry.recordWarRoomOpened(
      tenantId,
      `ctx-${Date.now()}`,
      'CURRENT_USER',
      activeScenarioId
    );
  }
}
