import { RiskSignal } from './EarlyWarningTypes';

export class RiskSignalAggregator {
  static aggregateSignals(signals: RiskSignal[]): number {
    if (signals.length === 0) return 0;
    
    // Aggregação simples para o MVP. Na realidade haveria pesos por fonte.
    const sum = signals.reduce((acc, curr) => acc + curr.value, 0);
    const avg = sum / signals.length;
    
    // Amplificador baseado em volume
    const multiplier = Math.min(1 + (signals.length * 0.05), 1.5);
    
    return Math.min(avg * multiplier, 1.0);
  }
}
