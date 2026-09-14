import React, { useState } from 'react';
import { useExecutiveInteraction } from '../../../../context/executive-interaction/ExecutiveInteractionProvider';
import { Search, Eye, History, FileText, ClipboardList } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';

interface Evidence {
  id: string;
  source: string;
  details: string;
  timestamp: string;
  hash: string;
}

interface ExecutiveEvidenceExplorerProps {
  evidences?: Evidence[];
}

export const ExecutiveEvidenceExplorer: React.FC<ExecutiveEvidenceExplorerProps> = ({
  evidences = []
}) => {
  const { translateLabel: t } = useLanguage();
  const { evidenceVisibility, setEvidenceVisibility } = useExecutiveInteraction();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const defaultEvidences: Evidence[] = [
    { id: 'ev-1', source: 'ERP Integration Connector', details: 'Sincronização de faturamento consolidado de R$ 14,2M referente a Q1.', timestamp: 'Ontem, 18:24', hash: 'SHA256-abc8812f' },
    { id: 'ev-2', source: 'Causal Inference Engine', details: 'Identificação de atraso médio de recebimento de 42 para 54 dias.', timestamp: 'Hoje, 09:12', hash: 'SHA256-dfc99132' },
    { id: 'ev-3', source: 'Fiduciary Board Pack Portal', details: 'Validação de Ata da Assembleia Geral Ordinária de Acionistas.', timestamp: 'Há 3 dias', hash: 'SHA256-xyz77611' }
  ];

  const activeEvidences = evidences.length > 0 ? evidences : defaultEvidences;

  const filtered = activeEvidences.filter(ev => 
    ev.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ev.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ev.hash.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card-premium p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-primary" />
            Rastreamento de Evidências Fiduciárias
          </h4>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Consulte as fontes originadoras e auditoria dos fatos relatados.
          </p>
        </div>

        {/* Visibilidade controls */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-border/10">
          {(['SUMMARY', 'EXPANDED', 'FULL_TRACE'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setEvidenceVisibility(mode)}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors ${
                evidenceVisibility === mode
                  ? 'bg-secondary text-primary font-bold'
                  : 'text-muted-foreground hover:text-muted-foreground'
              }`}
            >
              {mode.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Busca */}
      <div className="relative group">
        <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-secondary transition-colors">
          <Search size={14} strokeWidth={2} />
        </span>
        <input 
          type="text" 
          placeholder={t("overlays.search_placeholder")} 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-surface-container/30 border border-border/10 rounded-button text-xs font-bold text-foreground focus:border-secondary transition-all outline-none placeholder:text-muted-foreground/30 placeholder:font-bold placeholder:uppercase placeholder:tracking-wider"
        />
      </div>

      <div className="space-y-3">
        {filtered.map(ev => {
          const isExpanded = expandedId === ev.id || evidenceVisibility === 'FULL_TRACE';
          
          return (
            <div 
              key={ev.id} 
              className="p-4 bg-slate-950/45 border border-border/10 rounded-xl hover:border-border transition-all cursor-pointer"
              onClick={() => setExpandedId(expandedId === ev.id ? null : ev.id)}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-900 border border-border/5 rounded-xl text-muted-foreground">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{ev.source}</h5>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{ev.timestamp}</p>
                  </div>
                </div>
                
                {evidenceVisibility !== 'SUMMARY' && (
                  <span className="text-[9px] font-mono text-muted-foreground flex items-center gap-1">
                    <History className="w-3 h-3" />
                    {ev.hash}
                  </span>
                )}
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-border/5 text-xs text-muted-foreground leading-relaxed font-medium">
                  {ev.details}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
