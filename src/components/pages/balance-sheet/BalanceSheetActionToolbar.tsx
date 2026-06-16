import React from 'react';
import { Plus, Upload, Trash2 } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveText } from '../../ui/executive-typography';

export type BalanceSheetActionToolbarProps = {
  onLaunchData: () => void;
  onImport: () => void;
  onDelete: () => void;
};

export const BalanceSheetActionToolbar = ({ onLaunchData, onImport, onDelete }: BalanceSheetActionToolbarProps) => {
  return (
    <ExecutiveSurface variant="transparent" padding="none" elevation="none" className="flex items-center gap-3">
      <button
        onClick={onLaunchData}
        className="px-3 py-1.5 h-8 bg-success-soft hover:bg-success text-success hover:text-white border border-success/20 rounded-md transition-all flex items-center gap-2 shadow-sm"
      >
        <ExecutiveText as="span" variant="microLabel" className="text-inherit flex items-center gap-2"><Plus size={14} /> Lançar Dados</ExecutiveText>
      </button>
      <button
        onClick={onImport}
        className="px-3 py-1.5 h-8 bg-secondary/10 hover:bg-secondary text-secondary hover:text-white border border-secondary/20 rounded-md transition-all flex items-center gap-2 shadow-sm"
      >
        <ExecutiveText as="span" variant="microLabel" className="text-inherit flex items-center gap-2"><Upload size={14} /> Importar</ExecutiveText>
      </button>
      <button
        onClick={onDelete}
        className="px-3 py-1.5 h-8 bg-critical-soft hover:bg-destructive text-destructive hover:text-white border border-destructive/20 rounded-md transition-all flex items-center gap-2 shadow-sm"
      >
        <ExecutiveText as="span" variant="microLabel" className="text-inherit flex items-center gap-2"><Trash2 size={14} /> Excluir</ExecutiveText>
      </button>
    </ExecutiveSurface>
  );
};
