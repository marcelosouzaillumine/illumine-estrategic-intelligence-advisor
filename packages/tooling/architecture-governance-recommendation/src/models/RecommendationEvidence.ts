export interface RecommendationEvidence {
  readonly id: string;
  readonly sourceType: 'MEMORY' | 'KNOWLEDGE' | 'CERTIFICATION' | 'EVOLUTION';
  readonly sourceId: string;
  readonly relevanceScore: number;
}
