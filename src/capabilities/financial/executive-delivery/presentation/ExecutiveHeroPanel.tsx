import React from 'react';
import { Shield, TrendingUp, Activity, Award } from 'lucide-react';
import { ExecutiveIntelligenceReport } from '../../../../services/FiduciaryRuntimeAdapter';
import { cn } from '../../../../lib/utils';

interface ExecutiveHeroPanelProps {
  report: ExecutiveIntelligenceReport;
  className?: string;
}

export function ExecutiveHeroPanel({ report, className }: ExecutiveHeroPanelProps) {
  if (!report) return null;

  const { scores, severity } = report;

  // Map severity levels to colors passively (just mapping, no decision logic)
  const severityColors: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
    'SAUDÁVEL': { bg: 'bg-success-soft', border: 'border-emerald-200', text: 'text-emerald-700', iconBg: 'bg-emerald-100' },
    'SENSÍVEL': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', iconBg: 'bg-blue-100' },
    'PRESSIONADO': { bg: 'bg-warning-soft', border: 'border-amber-200', text: 'text-amber-700', iconBg: 'bg-amber-100' },
    'RESTRITIVO': { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', iconBg: 'bg-orange-100' },
    'ESTRESSADO': { bg: 'bg-critical-soft', border: 'border-rose-200', text: 'text-rose-700', iconBg: 'bg-rose-100' },
    'CRÍTICO': { bg: 'bg-red-100', border: 'border-red-300', text: 'text-red-800', iconBg: 'bg-red-200' },
    'COLAPSO': { bg: 'bg-stone-900', border: 'border-stone-700', text: 'text-rose-500', iconBg: 'bg-stone-800' }
  };

  const currentColors = severityColors[severity.level] || { bg: 'bg-slate-50', border: 'border-border', text: 'text-muted-foreground', iconBg: 'bg-slate-100' };

  return (
    <div className={cn("bg-white border border-border rounded-[32px] p-6 shadow-sm", className)}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Score Display */}
        <div className="lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Award className="text-muted-foreground" size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Composite Health Score</span>
            </div>
            
            <div className="flex items-baseline gap-4">
              <span className="text-6xl font-black text-muted-foreground tracking-tight">
                {scores.composite}
              </span>
              <span className="text-lg font-bold text-muted-foreground">/ 100</span>
            </div>
            
            <p className="text-sm font-bold text-muted-foreground mt-4 leading-relaxed">
              {severity.justification}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
            <div>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Liquidez</p>
              <p className="text-lg font-black text-muted-foreground">{scores.financial}/100</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Operacional</p>
              <p className="text-lg font-black text-muted-foreground">{scores.operational}/100</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Governança</p>
              <p className="text-lg font-black text-muted-foreground">{scores.governance}/100</p>
            </div>
          </div>
        </div>

        {/* Severity Banner */}
        <div className={cn("rounded-2xl p-6 border flex flex-col justify-between", currentColors.bg, currentColors.border)}>
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1">
                Grau de Severidade
              </span>
              <h4 className={cn("text-2xl font-black tracking-tight uppercase", currentColors.text)}>
                {severity.level}
              </h4>
            </div>
            <div className={cn("p-3 rounded-xl shrink-0 shadow-sm", currentColors.iconBg)}>
              <Shield className={cn(currentColors.text)} size={24} />
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-muted-foreground">
              <Activity size={14} />
              <span>Ajuste de Risco Ativo</span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 text-[11px] font-semibold text-muted-foreground leading-snug">
              O runtime aplicou calibradores baseados na matriz de causalidade contábil e no perfil de calibração ativo.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
