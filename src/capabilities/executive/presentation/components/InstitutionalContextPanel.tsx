import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Activity, ShieldCheck } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { ExecutivePerspectiveViewData } from '../view-models/ExecutivePerspectiveViewData';

interface InstitutionalContextPanelProps {
  contextData: ExecutivePerspectiveViewData['institutionalContext'];
}

export function InstitutionalContextPanel({ contextData }: InstitutionalContextPanelProps) {
  const [showPrudencyDetails, setShowPrudencyDetails] = useState(false);

  if (!contextData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-10 p-6 bg-primary rounded-3xl border border-primary relative overflow-hidden"
    >
      <div className="absolute right-0 bottom-0 w-32 h-32 bg-primary rounded-full blur-2xl pointer-events-none" />
      <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
        <Activity size={14} className="text-primary" /> Contexto Institucional Detectado
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        <div className="space-y-3">
          <div>
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Segmento Operacional</p>
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-muted-foreground">{contextData.operationalSegment.label}</p>
              {contextData.operationalSegment.confidenceTone && (
                <span className={cn(
                  "text-[8px] font-bold px-1.5 py-0.5 rounded-sm border uppercase tracking-wider",
                  contextData.operationalSegment.confidenceTone === 'success' ? "bg-success-soft text-emerald-600 border-emerald-200" :
                  contextData.operationalSegment.confidenceTone === 'warning' ? "bg-warning-soft text-amber-600 border-amber-200" :
                  "bg-critical-soft text-rose-600 border-rose-200"
                )}>
                  {contextData.operationalSegment.inferenceModeLabel}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Modelo Operacional</p>
            <p className="text-sm font-bold text-muted-foreground">{contextData.operationalModel.label}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Perfil Financeiro</p>
            <p className="text-sm font-bold text-muted-foreground">{contextData.financialProfile.label}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Maturidade Institucional</p>
            <p className="text-sm font-bold text-muted-foreground">{contextData.institutionalMaturity.label}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 mt-6 pt-6 border-t border-primary">
        <div className="space-y-3">
          <div>
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Confiança Estratégica</p>
            <span className={cn(
              "inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border",
              contextData.strategicConfidence.tone === 'success' ? "bg-emerald-100 text-emerald-800 border-emerald-200" :
              contextData.strategicConfidence.tone === 'info' ? "bg-blue-100 text-blue-800 border-blue-200" :
              "bg-amber-100 text-amber-800 border-amber-200"
            )}>
              {contextData.strategicConfidence.label}
            </span>
          </div>
        </div>

        <div className="space-y-3 col-span-1">
          <div>
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Limitações Interpretativas</p>
            <div className="max-h-24 overflow-y-auto space-y-1 mt-1 text-[11px] text-muted-foreground font-medium">
              {contextData.interpretativeLimitations.map((limit, idx) => (
                <p key={idx} className="leading-tight">• {limit}</p>
              ))}
              {contextData.interpretativeLimitations.length === 0 && (
                <p className="italic text-muted-foreground">Nenhuma limitação ativa.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {contextData.prudencyApplied && (
        <div className="mt-6 pt-6 border-t border-primary">
          <div className="flex flex-col">
            <button 
              onClick={() => setShowPrudencyDetails(!showPrudencyDetails)}
              className="flex items-center justify-between w-full text-left group focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <div className="text-primary">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <h5 className="text-[10px] font-black text-primary uppercase tracking-widest mb-0.5">
                    Calibração de Prudência Institucional Ativa
                  </h5>
                  <span className="text-[10px] text-accent font-medium group-hover:text-accent transition-colors">
                    {showPrudencyDetails ? 'Ocultar critérios utilizados' : '[Ver critérios utilizados]'}
                  </span>
                </div>
              </div>
            </button>

            {showPrudencyDetails && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 pl-7"
              >
                <p className="text-[11px] font-bold text-muted-foreground mb-2">
                  A calibração prudencial considerou:
                </p>
                <ul className="space-y-2.5">
                  {contextData.prudencyApplied.reasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-border">
                      <span className={cn(
                        "w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0",
                        reason.severity === 'critical' ? "bg-rose-400" : "bg-amber-400"
                      )} /> 
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">{reason.title}</p>
                        <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">{reason.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
