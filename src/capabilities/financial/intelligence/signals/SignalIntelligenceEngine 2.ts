import { IntelligenceSignal } from '../../contracts/IntelligenceSignal';
import { SignalMaterialityEngine } from './SignalMaterialityEngine';
import { SignalPersistenceEngine } from './SignalPersistenceEngine';
import { SignalHorizonEngine } from './SignalHorizonEngine';
import { SignalConfidenceEngine } from './SignalConfidenceEngine';
import { IntelligenceTraceabilityEngine } from '../traceability/IntelligenceTraceabilityEngine';
import { FinancialNarrativeEngine } from '../narrative/FinancialNarrativeEngine';
import { ExecutiveFormattingService } from '../formatting/ExecutiveFormattingService';

export class SignalIntelligenceEngine {
  static synthesize(
      exposures: any[], 
      history: any[], 
      current: any,
      ruleEvaluator?: (period: any) => any[]
  ): IntelligenceSignal[] {
    return exposures.map(exp => {
      const metricName = exp.metric || 'Indicador';
      const rawValueString = typeof exp.value === 'number' ? ExecutiveFormattingService.formatPercentage(exp.value) : String(exp.value);
      
      const interpretation = FinancialNarrativeEngine.generateInterpretation({
        metric: metricName,
        value: rawValueString,
        category: exp.category
      });

      const categoryMap: Record<string, any> = {
        'LIQUIDITY': 'liquidity',
        'CAPITAL_STRUCTURE': 'capital_structure',
        'WORKING_CAPITAL': 'working_capital',
        'SOLVENCY': 'solvency'
      };

      const severityMap: Record<string, any> = {
        'CRITICAL': 'critical',
        'HIGH': 'attention',
        'MEDIUM': 'attention',
        'LOW': 'informational'
      };

      const category = categoryMap[exp.category] || 'liquidity';
      const severity = severityMap[exp.severity] || 'attention';

      const materiality = SignalMaterialityEngine.evaluate(exp.value, category);
      const persistence = SignalPersistenceEngine.evaluate(exp.id, history, ruleEvaluator);
      const horizon = SignalHorizonEngine.evaluate(category, exp.id);
      const confidence = SignalConfidenceEngine.evaluate(history);

      return {
        id: exp.id,
        category,
        severity,
        materiality,
        persistence,
        horizon,
        confidence,
        observation: { text: exp.message.split('.')[0] || 'Alerta financeiro' },
        evidence: { text: exp.message },
        interpretation,
        sourceMetric: { name: metricName, value: rawValueString },
        
        // Gate 7: Evidence Graph Strict Fields
        metric: metricName,
        value: typeof exp.value === 'number' ? exp.value : undefined,
        threshold: exp.threshold || 'N/A', // If passed from risk engine
        period: current.year,
        direction: exp.direction || 'none',

        traceability: IntelligenceTraceabilityEngine.synthesize(exp, current)
      };
    });
  }
}
