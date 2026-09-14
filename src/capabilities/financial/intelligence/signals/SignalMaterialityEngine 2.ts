import { SignalMateriality } from '../../contracts/IntelligenceSignal';

export class SignalMaterialityEngine {
  /**
   * Determine the materiality based on the exposure value and severity.
   * Materiality represents the potential impact weight on the executive reading,
   * NOT the severity of the diagnosis.
   */
  static evaluate(value: number, category: string): SignalMateriality {
    // Basic heuristic: 
    // If the exposure value (which is a percentage relative to total assets usually)
    // is above 50%, it's critical materiality.
    // > 30% -> high
    // > 10% -> moderate
    // else -> low
    
    if (value >= 0.5) return 'critical';
    if (value >= 0.3) return 'high';
    if (value >= 0.1) return 'moderate';
    
    return 'low';
  }
}
