import React from 'react';
import { Plus, Upload, Trash2 } from 'lucide-react';
import { ActionToolbarButton } from '../../ui/action-toolbar';

export type DLPAActionToolbarProps = {
  onLaunchData: () => void;
  onImport: () => void;
  onDelete: () => void;
};

export const DLPAActionToolbar = ({ onLaunchData, onImport, onDelete }: DLPAActionToolbarProps) => {
  return (
    <div className="flex items-center gap-2">
      <ActionToolbarButton onClick={onLaunchData} variant="success" icon={<Plus />}>
        Lançar Dados
      </ActionToolbarButton>
      <ActionToolbarButton onClick={onImport} variant="secondary" icon={<Upload />}>
        Importar
      </ActionToolbarButton>
      <ActionToolbarButton onClick={onDelete} variant="critical" icon={<Trash2 />}>
        Excluir
      </ActionToolbarButton>
    </div>
  );
};
