import { EngineSemanticOutput } from './ExecutiveSemanticRegistry';
import { CrossEngineSemanticConsistencyEngine, SemanticConsistencyResult } from './CrossEngineSemanticConsistencyEngine';
import { NarrativeConsistencyEngine, NarrativeStatus } from './NarrativeConsistencyEngine';
import { InstitutionalCausalAlignmentEngine } from './InstitutionalCausalAlignmentEngine';

export interface ExecutiveConsistencyReport extends SemanticConsistencyResult {
  narrativeStatus: NarrativeStatus;
  causalNarrative: string;
  executiveSummary: string;
}

export class ExecutiveConsistencyReportEngine {
  public static generateReport(outputs: EngineSemanticOutput[]): ExecutiveConsistencyReport {
    // 1. Evaluate Cross-Engine Consistency
    const consistencyResult = CrossEngineSemanticConsistencyEngine.evaluate(outputs);

    // 2. Evaluate Narrative Consistency
    const narratives = outputs.filter(o => o.narrative).map(o => o.narrative!);
    const narrativeStatus = NarrativeConsistencyEngine.evaluate(narratives);

    // 3. Generate Causal Alignment
    const causalNarrative = InstitutionalCausalAlignmentEngine.generateCausalExplanation(consistencyResult.conflicts);

    // 4. Construct Executive Summary
    let summary = `Score Semântico: ${consistencyResult.score}/100. `;
    if (consistencyResult.conflicts.length === 0) {
      summary += 'Excelente nível de coerência informacional institucional.';
    } else {
      summary += `Detectados ${consistencyResult.conflicts.length} desvios de interpretação cruzada.`;
    }

    return {
      ...consistencyResult,
      narrativeStatus,
      causalNarrative,
      executiveSummary: summary
    };
  }
}
