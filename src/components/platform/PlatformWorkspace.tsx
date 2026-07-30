import React from 'react';
import { Table, Search, Filter, Plus } from 'lucide-react';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveText } from '../ui/executive-typography';

export interface PlatformWorkspaceProps {
  readonly title: string;
  readonly children: React.ReactNode;
  readonly searchValue?: string;
  readonly onSearchChange?: (val: string) => void;
  readonly onNewClick?: () => void;
  readonly newButtonLabel?: string;
}

export const PlatformWorkspace: React.FC<PlatformWorkspaceProps> = ({
  title,
  children,
  searchValue = '',
  onSearchChange,
  onNewClick,
  newButtonLabel = 'Novo Cadastro'
}) => {
  return (
    <ExecutiveSurface className="p-4 mb-6 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-primary" />
          <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
            Layer 4 — Workspace Operacional ({title})
          </ExecutiveText>
        </div>

        <div className="flex items-center gap-3">
          {onSearchChange && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar registros..."
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-surface-container/40 border border-border/50 rounded text-xs text-foreground outline-none focus:border-primary"
              />
            </div>
          )}

          {onNewClick && (
            <button
              onClick={onNewClick}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded text-xs font-semibold hover:bg-primary/90 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{newButtonLabel}</span>
            </button>
          )}
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        {children}
      </div>
    </ExecutiveSurface>
  );
};
