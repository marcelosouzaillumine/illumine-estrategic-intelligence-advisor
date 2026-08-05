import React from 'react';
import { ExecutiveAction } from '../foundation/ExecutiveAction';
import { Settings, FileText, Download } from 'lucide-react';

interface WorkspaceActionProps {
  type: 'settings' | 'export' | 'report';
  onClick?: () => void;
}

export function WorkspaceAction({ type, onClick }: WorkspaceActionProps) {
  const configs = {
    settings: { icon: Settings, label: 'Configurações' },
    export: { icon: Download, label: 'Exportar Dados' },
    report: { icon: FileText, label: 'Gerar Relatório' }
  };

  const config = configs[type];

  return (
    <ExecutiveAction variant="secondary" size="sm" icon={config.icon} onClick={onClick}>
      <span className="hidden sm:inline">{config.label}</span>
    </ExecutiveAction>
  );
}
