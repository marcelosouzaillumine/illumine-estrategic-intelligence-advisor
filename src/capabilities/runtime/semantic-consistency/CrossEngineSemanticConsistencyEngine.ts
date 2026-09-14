import { EngineSemanticOutput, SemanticConcept } from './ExecutiveSemanticRegistry';
import { normalizeClassification, getCategoryNumericValue, SemanticCategory } from './SemanticClassificationNormalizer';
import { hasSemanticAuthority } from './SemanticCompatibilityMatrix';

export enum ConflictSeverity {
  CRITICAL_CONTRADICTION = 'CRITICAL_CONTRADICTION',
  MAJOR_DIVERGENCE = 'MAJOR_DIVERGENCE',
  MINOR_DIVERGENCE = 'MINOR_DIVERGENCE',
  CONSISTENCY = 'CONSISTENCY'
}

export enum SemanticConsistencyStatus {
  ALTA_CONSISTENCIA = 'ALTA_CONSISTENCIA',
  CONSISTENCIA_MODERADA = 'CONSISTENCIA_MODERADA',
  DIVERGENCIA_RELEVANTE = 'DIVERGENCIA_RELEVANTE',
  CONTRADICAO_CRITICA = 'CONTRADICAO_CRITICA'
}

export interface SemanticConflict {
  concept: SemanticConcept;
  severity: ConflictSeverity;
  engines: string[];
  details: string;
}

export interface SemanticConsistencyResult {
  score: number;
  status: SemanticConsistencyStatus;
  conflicts: SemanticConflict[];
}

export class CrossEngineSemanticConsistencyEngine {
  public static evaluate(outputs: EngineSemanticOutput[]): SemanticConsistencyResult {
    // Group outputs by Concept
    const grouped = new Map<SemanticConcept, EngineSemanticOutput[]>();
    
    outputs.forEach(output => {
      // Only process if the engine has authority over this concept
      if (!hasSemanticAuthority(output.engineId, output.concept)) return;
      
      const list = grouped.get(output.concept) || [];
      list.push(output);
      grouped.set(output.concept, list);
    });

    const conflicts: SemanticConflict[] = [];
    let criticalCount = 0;
    let majorCount = 0;
    let minorCount = 0;

    grouped.forEach((engineOutputs, concept) => {
      if (engineOutputs.length < 2) return; // Need at least 2 to compare

      let maxVal = -1;
      let minVal = 6;
      let maxEngine = '';
      let minEngine = '';
      let maxCategory = '';
      let minCategory = '';

      engineOutputs.forEach(out => {
        const cat = normalizeClassification(out.rawClassification);
        const val = getCategoryNumericValue(cat);
        if (val > maxVal) { maxVal = val; maxEngine = out.engineId; maxCategory = cat; }
        if (val < minVal) { minVal = val; minEngine = out.engineId; minCategory = cat; }
      });

      const diff = maxVal - minVal;

      if (diff >= 3) {
        criticalCount++;
        conflicts.push({
          concept,
          severity: ConflictSeverity.CRITICAL_CONTRADICTION,
          engines: [maxEngine, minEngine],
          details: `${maxEngine} (${maxCategory}) vs ${minEngine} (${minCategory})`
        });
      } else if (diff === 2) {
        majorCount++;
        conflicts.push({
          concept,
          severity: ConflictSeverity.MAJOR_DIVERGENCE,
          engines: [maxEngine, minEngine],
          details: `${maxEngine} (${maxCategory}) vs ${minEngine} (${minCategory})`
        });
      } else if (diff === 1) {
        minorCount++;
        conflicts.push({
          concept,
          severity: ConflictSeverity.MINOR_DIVERGENCE,
          engines: [maxEngine, minEngine],
          details: `${maxEngine} (${maxCategory}) vs ${minEngine} (${minCategory})`
        });
      }
    });

    let score = 100 - (criticalCount * 30) - (majorCount * 15) - (minorCount * 5);
    if (score < 0) score = 0;

    let status = SemanticConsistencyStatus.ALTA_CONSISTENCIA;
    if (score < 30) status = SemanticConsistencyStatus.CONTRADICAO_CRITICA;
    else if (score < 60) status = SemanticConsistencyStatus.DIVERGENCIA_RELEVANTE;
    else if (score < 80) status = SemanticConsistencyStatus.CONSISTENCIA_MODERADA;

    return {
      score,
      status,
      conflicts
    };
  }
}
