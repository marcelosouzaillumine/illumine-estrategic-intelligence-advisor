import React, { useState } from 'react';
import { Calendar, ShieldCheck, FileText, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  category: string;
  author: string;
  hash: string;
}

export const InstitutionalTimelineNavigator: React.FC = () => {
  const { t } = useLanguage();
  const [selectedId, setSelectedId] = useState<string>('ev-1');

  const events: TimelineEvent[] = [
    { id: 'ev-1', date: '26 Mai 2026', title: 'Homologação do Planejamento Orçamentário Retificado', category: 'Fiduciário', author: 'Conselho de Administração', hash: 'SHA256-bd992a88' },
    { id: 'ev-2', date: '14 Mai 2026', title: 'Auditoria de Segregação de Funções (SoD) Executada', category: 'Compliance', author: 'Comitê de Auditoria', hash: 'SHA256-ff771a33' },
    { id: 'ev-3', date: '30 Abr 2026', title: 'Aprovação de Projeções de Cenários What-If', category: 'Cenários', author: 'Diretoria Executiva', hash: 'SHA256-cd884b22' }
  ];

  return (
    <div className="card-premium p-8 space-y-6">
      <div>
        <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          Linha do Tempo de Deliberações
        </h4>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          Rastreabilidade cronológica das homologações formais da instituição.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {events.map((ev, idx) => {
          const isSelected = selectedId === ev.id;
          return (
            <div 
              key={ev.id}
              onClick={() => setSelectedId(ev.id)}
              className={`p-5 rounded-xl border cursor-pointer transition-all ${
                isSelected 
                  ? 'bg-primary border-primary text-primary' 
                  : 'bg-slate-950/20 border-border/10 text-muted-foreground hover:border-border'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-mono text-muted-foreground">{ev.date}</span>
                <span className="text-[9px] uppercase font-mono tracking-widest px-2 py-0.5 bg-slate-900 border border-border/5 rounded-xl text-muted-foreground">
                  {ev.category}
                </span>
              </div>
              <h5 className="text-xs font-bold text-muted-foreground leading-relaxed uppercase tracking-wide line-clamp-2">{ev.title}</h5>
              
              {isSelected && (
                <div className="mt-4 pt-4 border-t border-primary space-y-2 text-[10px] text-muted-foreground font-mono">
                  <p>{t("overlays.author")} {ev.author}</p>
                  <p>{t("overlays.lineage_hash")} {ev.hash}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
