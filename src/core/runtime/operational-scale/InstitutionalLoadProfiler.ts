import { ScaleLoadProfile } from './OperationalScaleTypes';

export class InstitutionalLoadProfiler {
  static profile(tenantId: string, advisorMode: boolean): ScaleLoadProfile {
    return {
      profileId: 'LOAD-' + Date.now(),
      tenantId,
      activeSessions: advisorMode ? 4 : 1,
      concurrentWorkflows: advisorMode ? 11 : 3,
      iosDomainsSynced: 6,
      memoryPressureLevel: advisorMode ? 'HIGH' : 'MEDIUM'
    };
  }
}
