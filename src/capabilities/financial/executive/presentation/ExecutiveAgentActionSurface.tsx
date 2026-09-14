import React from 'react';

export interface ExecutiveAgentActionSurfaceProps {
  onTriggerAction?: (agentId: string, actionName: string) => void;
}

/**
 * ExecutiveAgentActionSurface (Wave 17.12 Refactored)
 * Os agentes atuam como serviços cognitivos internos invisíveis do Agent Runtime (ADR-066).
 * Este componente não renderiza blocos visuais de agentes soltos na tela.
 */
export const ExecutiveAgentActionSurface: React.FC<ExecutiveAgentActionSurfaceProps> = () => {
  return null;
};
