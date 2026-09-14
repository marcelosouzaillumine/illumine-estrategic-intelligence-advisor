import React from 'react';

export interface ExecutiveIntelligenceRuntimeInspectorProps {
  pageId: string;
  hasRealData?: boolean;
}

export const ExecutiveIntelligenceRuntimeInspector: React.FC<ExecutiveIntelligenceRuntimeInspectorProps> = ({ pageId, hasRealData }) => {
  // Ocultar barras de depuração interna do ambiente executivo do cliente
  return null;
};
