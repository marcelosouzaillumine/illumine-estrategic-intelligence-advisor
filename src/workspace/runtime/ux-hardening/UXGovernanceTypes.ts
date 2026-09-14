export interface UXValidationMetrics {
  metricsId: string;
  cognitiveLoadScore: number; // 0 to 1
  navigationFriction: number; // 0 to 1
  taskCompletionTime: number; // seconds
}

export interface ExecutiveJourney {
  journeyId: string;
  role: 'CFO' | 'CONTROLLER' | 'BOARD_MEMBER' | 'ADVISOR';
  steps: string[];
  frictionPoints: string[];
  complexityScore: number;
}
