export type InsightValidationStatus = 'approved' | 'approved_low_confidence' | 'rejected';

export interface ValidatedInsight {
  originalInsight: any;
  status: InsightValidationStatus;
  rejectionReason?: string;
}

export class InsightQualityValidator {
  /**
   * Validates if an insight has minimum acceptable executive quality.
   */
  static validate(insight: any): ValidatedInsight {
    // Basic quality criteria
    if (!insight.title || !insight.description) {
      return { originalInsight: insight, status: 'rejected', rejectionReason: 'Missing title or description' };
    }

    // Evidence requirement
    if (insight.description.length < 20 || !this.containsEvidence(insight.description)) {
      return { originalInsight: insight, status: 'rejected', rejectionReason: 'Lacks evidence or reasoning' };
    }

    // Confidence
    const confidence = insight.confidenceScore || 0;
    if (confidence < 50) {
      return { originalInsight: insight, status: 'approved_low_confidence' };
    }

    return { originalInsight: insight, status: 'approved' };
  }

  private static containsEvidence(text: string): boolean {
    // A heuristic for evidence. In a real system, might use NLP or keyword matching (%, $, "devido a", etc.)
    const evidenceKeywords = ['%', 'aument', 'reduz', 'devido', 'impacto', 'causa', 'gerou'];
    const lowerText = text.toLowerCase();
    return evidenceKeywords.some(kw => lowerText.includes(kw));
  }
}
