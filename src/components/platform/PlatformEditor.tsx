import React from 'react';
import { Edit3, Save, X } from 'lucide-react';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveText } from '../ui/executive-typography';

export interface PlatformEditorProps {
  readonly title: string;
  readonly children: React.ReactNode;
  readonly onSave?: () => void;
  readonly onCancel?: () => void;
}

export const PlatformEditor: React.FC<PlatformEditorProps> = ({
  title,
  children,
  onSave,
  onCancel
}) => {
  return (
    <ExecutiveSurface className="p-4 mb-6 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Edit3 className="w-4 h-4 text-primary" />
          <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
            Layer 5 — Editor Operacional ({title})
          </ExecutiveText>
        </div>

        <div className="flex items-center gap-2">
          {onCancel && (
            <button
              onClick={onCancel}
              className="flex items-center gap-1 px-3 py-1.5 bg-surface-container border border-border rounded text-xs text-muted-foreground hover:text-foreground transition-all"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancelar</span>
            </button>
          )}
          {onSave && (
            <button
              onClick={onSave}
              className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded text-xs font-semibold hover:bg-primary/90 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Salvar Parâmetros</span>
            </button>
          )}
        </div>
      </div>

      <div className="w-full">
        {children}
      </div>
    </ExecutiveSurface>
  );
};
