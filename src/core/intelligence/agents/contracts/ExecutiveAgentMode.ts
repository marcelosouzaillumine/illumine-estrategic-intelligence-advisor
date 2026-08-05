export type ExecutiveAgentMode = 
  | 'ANALYST' // Somente explica
  | 'ADVISOR' // Explora cenários
  | 'BOARD'; // Prepara decisões (Nunca AUTONOMOUS)

export interface AgentModeContext {
  mode: ExecutiveAgentMode;
  allowedActions: string[];
}
