export interface IntelligenceInsight {
  id: string;
  category: string;
  type: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'WARNING';
  title: string;
  description: string;
  impactScale?: number; // 0 to 1
}
