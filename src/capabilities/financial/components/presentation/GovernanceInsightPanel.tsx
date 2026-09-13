import React from 'react';
import { BookOpen, ShieldAlert, CheckCircle2, Layers, HelpCircle } from 'lucide-react';
import { GovernancePrinciple, getPrincipleById } from '../../../../lib/governanceIntelligence';
import { cn } from '../../../../lib/utils';
import { MarkdownText } from '../../../../components/Common';

interface GovernanceInsightPanelProps {
  principleId: string;
  misalignment?: string;
  impact?: string;
  recommendation?: string;
  className?: string;
  compact?: boolean;
}

export function GovernanceInsightPanel({ 
  principleId, 
  misalignment, 
  impact, 
  recommendation,
  className,
  compact = false
}: GovernanceInsightPanelProps) {
  const principle = getPrincipleById(principleId);

  if (!principle) return null;

  if (compact) {
    return (
      <div className={cn("bg-primary border border-primary rounded-xl p-3 flex flex-col gap-2", className)}>
        <div className="flex items-center gap-2 text-primary">
          <Layers size={14} />
          <span className="text-xs font-black uppercase tracking-widest">{principle.name}</span>
        </div>
        <div className="text-[10px] text-primary font-bold leading-relaxed">
          <MarkdownText text={recommendation || principle.executiveRecommendations[0]} />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-gradient-to-br from-slate-50 to-indigo-50 border border-border rounded-3xl p-8 shadow-sm", className)}>
      <div className="flex items-start gap-5 mb-6">
        <div className="p-4 bg-primary text-primary rounded-2xl shrink-0 shadow-sm">
          <Layers size={28} />
        </div>
        <div>
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-black text-muted-foreground tracking-tight">{principle.name}</h3>
            <span className="text-[9px] bg-white px-3 py-1 rounded-full border border-primary text-primary font-black uppercase tracking-widest">
              Princípio de Discernimento
            </span>
          </div>
          <p className="text-sm font-bold text-muted-foreground mt-2 italic leading-relaxed">"{principle.philosophicalFoundation.text}"</p>
        </div>
      </div>

      <div className="space-y-6 bg-white/80 p-6 rounded-[32px] border border-primary shadow-inner">
        {misalignment && (
          <div className="flex gap-4">
            <ShieldAlert size={20} className="text-rose-500 shrink-0 mt-1" />
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Desalinhamento Detectado</p>
              <div className="text-sm font-bold text-muted-foreground leading-snug">
                <MarkdownText text={misalignment} />
              </div>
              {impact && (
                <div className="text-xs text-rose-600 mt-2 font-medium bg-critical-soft px-3 py-1 rounded-lg border border-rose-100 inline-block">
                  Impacto: <MarkdownText text={impact} />
                </div>
              )}
            </div>
          </div>
        )}
        
        {principle.situationalScenario && (
          <div className="flex gap-4 p-4 bg-warning-soft/50 rounded-2xl border border-amber-100/50">
            <HelpCircle size={20} className="text-amber-500 shrink-0 mt-1" />
            <div>
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Cenário de Maturidade Organizacional</p>
              <p className="text-sm font-medium text-amber-900/80 italic leading-snug">"{principle.situationalScenario}"</p>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-1" />
          <div className="flex-1">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Recomendação Executiva</p>
            <div className="text-sm font-bold text-muted-foreground leading-relaxed">
              <MarkdownText text={recommendation || principle.executiveRecommendations[0]} />
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
              {principle.executiveRecommendations.slice(1, 5).map((rec, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-border group hover:border-accent transition-colors">
                  <div className="w-5 h-5 rounded-full bg-white text-[9px] font-black flex items-center justify-center border border-border text-muted-foreground group-hover:bg-accent group-hover:text-white transition-colors">{i+2}</div>
                  <div className="text-[10px] font-bold text-muted-foreground">
                    <MarkdownText text={rec} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
