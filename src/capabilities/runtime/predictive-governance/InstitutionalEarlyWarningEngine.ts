import { PredictiveBase, InstitutionalSnapshot } from './PredictiveTypes';

export enum EarlyWarningSignal {
  GREEN = 'GREEN',
  YELLOW = 'YELLOW',
  ORANGE = 'ORANGE',
  RED = 'RED'
}

export interface EarlyWarningOutput extends PredictiveBase {
  signal: EarlyWarningSignal;
  alerts: string[];
}

export class InstitutionalEarlyWarningEngine {
  public static generateWarnings(snapshots: InstitutionalSnapshot[]): EarlyWarningOutput {
    if (!snapshots || snapshots.length < 2) {
      return {
        confidenceLevel: 'INSUFFICIENT_HISTORY',
        confidenceReason: 'Histórico insuficiente para acionamento do Early Warning System.',
        signal: EarlyWarningSignal.GREEN,
        alerts: []
      };
    }

    const current = snapshots[snapshots.length - 1];
    const prev = snapshots[snapshots.length - 2];
    const alerts: string[] = [];
    let signal = EarlyWarningSignal.GREEN;

    if (current.cescfScore < prev.cescfScore) {
      alerts.push('Consistência semântica institucional em deterioração acelerada.');
      signal = EarlyWarningSignal.YELLOW;
    }

    if (current.bpHealth < 60 && current.bpHealth < prev.bpHealth && current.dfcHealth < 50) {
      alerts.push('Capital consumido aumentando agressivamente contra liquidez restrita.');
      signal = EarlyWarningSignal.ORANGE;
    }
    
    if (current.governanceScore < 50 && prev.governanceScore > 60) {
      alerts.push('Ruptura crítica severa na jornada de governança detectada.');
      signal = EarlyWarningSignal.RED;
    }

    return {
      confidenceLevel: 'MODERATE',
      confidenceReason: 'Alertas derivados das derivadas de primeira ordem entre o ciclo atual e os anteriores.',
      signal,
      alerts
    };
  }
}
