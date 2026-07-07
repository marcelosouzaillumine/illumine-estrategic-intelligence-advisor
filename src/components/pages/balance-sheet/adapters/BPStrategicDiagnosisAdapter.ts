import { BPStrategicDiagnosisDriverMapper, BPStrategicDiagnosisDrivers } from '../../../../services/FiduciaryRuntimeAdapter';

/**
 * Adapter to proxy access to runtime mappers from the Balance Sheet UI.
 * This ensures the UI component does not directly import from core/runtime,
 * maintaining the architectural boundary.
 */
export class BPStrategicDiagnosisAdapter {
  public static mapDrivers(
    financialIndicators: any[],
    bpSummary: any
  ): BPStrategicDiagnosisDrivers {
    return BPStrategicDiagnosisDriverMapper.map(financialIndicators, bpSummary);
  }
}

export type { BPStrategicDiagnosisDrivers };
