// src/lib/governance-copilot-confidence-engine.ts

import type { GovernanceCopilotReasoningResult, GovernanceCopilotConfidence, GovernanceCopilotConfidenceLevel, GovernanceCopilotReasoningInput } from './governance-copilot-reasoning-types';

export class GovernanceCopilotConfidenceEngine {
  /**
   * Evaluates the institutional confidence level based on weighted factors.
   */
  static evaluateConfidence(
    input: GovernanceCopilotReasoningInput,
    evidenceCount: number,
    memoryCount: number,
    requiredSources: string[],
    conflictCount: number
  ): GovernanceCopilotConfidence {
    
    // Calculate weights
    let intelligenceWeight = 0;
    let missingSources = 0;

    for (const source of requiredSources) {
      if ((input as any)[source]) {
        intelligenceWeight += 1;
      } else {
        missingSources += 1;
      }
    }

    // Normalize weights (arbitrary heuristic scales for determinism)
    // 1 unit of evidence = 0.5 points
    // 1 unit of memory = 0.3 points
    // 1 present required source = 1.0 points
    
    const evidenceScore = evidenceCount * 0.5;
    const memoryScore = memoryCount * 0.3;
    const intelligenceScore = intelligenceWeight * 1.0;
    
    // Penalties
    const conflictPenaltyScore = conflictCount * 1.0;
    const missingSourcePenalty = missingSources * 0.5;

    const totalScore = (evidenceScore + memoryScore + intelligenceScore) - conflictPenaltyScore - missingSourcePenalty;

    let level: GovernanceCopilotConfidenceLevel = 'LOW';

    // Strict evaluation rules as per constitutional requirements:
    // "HIGH intelligence, LOW evidence, LOW memory não deveria resultar em: VERY_HIGH"
    
    if (evidenceCount === 0 && memoryCount === 0) {
      // If we have no institutional evidence or memory, confidence cannot exceed MODERATE
      level = totalScore > 2 ? 'MODERATE' : 'LOW';
    } else if (conflictCount >= 2) {
      // High conflict heavily caps confidence
      level = 'LOW';
    } else {
      if (totalScore <= 2) {
        level = 'LOW';
      } else if (totalScore <= 5) {
        level = 'MODERATE';
      } else if (totalScore <= 8) {
        level = 'HIGH';
      } else {
        // Requires strong evidence and low missing sources to be VERY_HIGH
        if (evidenceCount > 2 && missingSources === 0 && conflictCount === 0) {
          level = 'VERY_HIGH';
        } else {
          level = 'HIGH';
        }
      }
    }

    return {
      level,
      evidenceWeight: evidenceScore,
      memoryWeight: memoryScore,
      intelligenceWeight: intelligenceScore,
      conflictPenalty: conflictPenaltyScore
    };
  }
}
