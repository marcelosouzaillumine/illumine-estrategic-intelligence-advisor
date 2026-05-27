import { ExecutiveNarrativeCompression } from './types';

export interface CompressionInput {
  summary: string;
  insights: string[];
  violations: string[];
  missingDependencies: string[];
  lineageHash?: string;
  fiduciaryBlockers: string[];
  confidenceLabel: string;
}

export interface CompressedOutput {
  narratives: string[];
  compressionMode: ExecutiveNarrativeCompression;
  preservedFiduciaryBlockers: string[];
  preservedDependencies: string[];
  confidenceLabel: string;
  lineageHash?: string;
}

export class NarrativeCompressionEngine {
  /**
   * Compresses insights and warnings into executive summaries.
   * Ensures that original Runtime meaning, confidence boundaries,
   * dependencies, lineage, and fiduciary blockers are never lost or suppressed.
   */
  public static compress(input: CompressionInput, mode: 'board' | 'cfo' | 'advisor' | 'operational'): CompressedOutput {
    let compressionMode: ExecutiveNarrativeCompression = 'FULL';
    let maxInsights = 100;

    switch (mode) {
      case 'board':
        compressionMode = 'CRITICAL_ONLY';
        maxInsights = 2;
        break;
      case 'cfo':
        compressionMode = 'EXECUTIVE_BRIEF';
        maxInsights = 4;
        break;
      case 'advisor':
        compressionMode = 'SUMMARIZED';
        maxInsights = 6;
        break;
      case 'operational':
      default:
        compressionMode = 'FULL';
        maxInsights = 100;
        break;
    }

    // Limit insights but preserve important ones (fiduciary/critical warnings are handled separately to never suppress them)
    const compressedInsights = input.insights.slice(0, maxInsights);

    // Build the narratives array: starting with summary
    const narratives: string[] = [];
    if (input.summary) {
      narratives.push(input.summary);
    }
    
    // Add insights
    compressedInsights.forEach(ins => narratives.push(ins));

    // Force inclusion of all violations
    input.violations.forEach(v => {
      if (!narratives.includes(v)) {
        narratives.push(`VIOLATION: ${v}`);
      }
    });

    return {
      narratives,
      compressionMode,
      preservedFiduciaryBlockers: [...input.fiduciaryBlockers],
      preservedDependencies: [...input.missingDependencies],
      confidenceLabel: input.confidenceLabel,
      lineageHash: input.lineageHash
    };
  }
}
