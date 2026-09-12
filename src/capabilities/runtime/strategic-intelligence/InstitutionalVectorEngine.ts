// src/core/runtime/strategic-intelligence/InstitutionalVectorEngine.ts

import { StrategicEvaluationContext, InstitutionalVector, InstitutionalVectorDirection } from './strategic-intelligence-types';

export class InstitutionalVectorEngine {
  static evaluate(context: StrategicEvaluationContext): InstitutionalVector {
    
    if (context.metadata.historicalCyclesCount < 2) {
      return {
        direction: 'NEUTRAL',
        vectorPersistence: 0,
        vectorStability: 0,
        vectorConfidence: 'UNVERIFIABLE',
        description: 'Dados insuficientes para vetorização.'
      };
    }

    const { scaleEfficiency, financialMetrics } = context.metrics;
    const { fundingDependenceLevel } = context.capitalStructure;
    
    let direction: InstitutionalVectorDirection = 'NEUTRAL';
    let persistence = 0.5;
    let stability = 0.5;

    // Crescimento Recorrente vs Expansão Tensionada
    if (scaleEfficiency.recGrowth && scaleEfficiency.recGrowth > 0.05) {
      if (financialMetrics.ocf < 0 || fundingDependenceLevel === 'HIGH' || fundingDependenceLevel === 'CRITICAL') {
        direction = 'STRAINED_EXPANSION';
        stability = 0.3;
        persistence = 0.6;
      } else {
        direction = 'RECURRENT_GROWTH';
        stability = 0.8;
        persistence = 0.8;
      }
    } 
    // Compressão / Deterioração
    else if (scaleEfficiency.recGrowth && scaleEfficiency.recGrowth < -0.05) {
      if (financialMetrics.ocf < 0) {
        direction = 'LONGITUDINAL_DETERIORATION';
        stability = 0.2;
        persistence = 0.7;
      } else {
        direction = 'STRUCTURAL_COMPRESSION';
        stability = 0.5;
        persistence = 0.6;
      }
    }
    // Preservação vs Pressão Acumulativa
    else {
      if (context.operatingPressureReport?.structuralPressureSeverity === 'CRITICAL') {
        direction = 'ACCUMULATIVE_PRESSURE';
        stability = 0.4;
      } else if (financialMetrics.ocf > 0) {
        direction = 'CONSISTENT_PRESERVATION';
        stability = 0.9;
        persistence = 0.9;
      }
    }

    const confidence = context.metadata.historicalCyclesCount >= 4 ? 'HIGH' : 'MEDIUM';

    return {
      direction,
      vectorPersistence: persistence,
      vectorStability: stability,
      vectorConfidence: confidence,
      description: `O vetor primário detectado é ${direction.replace(/_/g, ' ')} com confiança ${confidence}.`
    };
  }
}
