import React from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { GovernanceSeverity, GovernanceStatus } from '../../../../contracts/governance/FiduciaryValidationProjection';

export interface SemanticGovernanceFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  severityFilter: GovernanceSeverity | 'ALL';
  onSeverityChange: (severity: GovernanceSeverity | 'ALL') => void;
  statusFilter: GovernanceStatus | 'ALL';
  onStatusChange: (status: GovernanceStatus | 'ALL') => void;
  onReset?: () => void;
  className?: string;
}

export function SemanticGovernanceFilterBar({
  searchQuery,
  onSearchChange,
  severityFilter,
  onSeverityChange,
  statusFilter,
  onStatusChange,
  onReset,
  className = ''
}: SemanticGovernanceFilterBarProps) {
  return (
    <ExecutiveSurface 
      padding="sm" 
      radius="xl" 
      className={`flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 ${className}`}
    >
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Filtrar por diretor, ID de caso, pauta ou vínculo..."
          className="w-full pl-9 pr-4 py-2 bg-card/60 border border-border/20 rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all font-medium"
        />
      </div>

      {/* Semantic Filters */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold px-2">
          <Filter className="w-3.5 h-3.5 text-primary" />
          <span>Filtros Semânticos:</span>
        </div>

        {/* Severity Selector */}
        <select 
          value={severityFilter}
          onChange={e => onSeverityChange(e.target.value as any)}
          className="px-3 py-2 bg-card/60 border border-border/20 rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary/50 transition-all cursor-pointer"
        >
          <option value="ALL">Severidade: Todas</option>
          <option value="CRITICAL">Crítica (Critical)</option>
          <option value="HIGH">Alta (High)</option>
          <option value="MEDIUM">Média (Medium)</option>
          <option value="LOW">Baixa (Low)</option>
        </select>

        {/* Status Selector */}
        <select 
          value={statusFilter}
          onChange={e => onStatusChange(e.target.value as any)}
          className="px-3 py-2 bg-card/60 border border-border/20 rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary/50 transition-all cursor-pointer"
        >
          <option value="ALL">Status: Todos</option>
          <option value="OPEN">Aberto (Open)</option>
          <option value="UNDER_REVIEW">Em Análise (Under Review)</option>
          <option value="BLOCKED">Bloqueado (Blocked)</option>
          <option value="RESOLVED">Resolvido (Resolved)</option>
        </select>

        {onReset && (
          <button 
            onClick={onReset}
            className="p-2 rounded-xl bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
            title="Limpar filtros"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </ExecutiveSurface>
  );
}
