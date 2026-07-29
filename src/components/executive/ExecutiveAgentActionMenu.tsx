import React from 'react';
import { AgentActionMapping } from '@illumine/executive-page-intelligence';

export interface ExecutiveAgentActionMenuProps {
  mappings: AgentActionMapping[];
  onSelectAction?: (agentId: string, actionName: string) => void;
}

/**
 * ExecutiveAgentActionMenu (Refatorado conforme ADR-066 e ADR-067)
 * Agentes executivos atuam exclusivamente como serviços cognitivos internos no runtime.
 * Este componente retorna null para evitar a renderização de superfícies ou cards de agentes visuais na tela.
 */
export const ExecutiveAgentActionMenu: React.FC<ExecutiveAgentActionMenuProps> = () => {
  return null;
};
