import React from 'react';
import { cn } from '../../lib/utils';
import { ExecutiveSurface } from './executive-surface';
import { ExecutiveScore } from './executive-score';
import { ExecutiveNarrative } from './executive-narrative';
import { ExecutiveTable, ExecutiveTableHeader, ExecutiveTableRow, ExecutiveTableBody } from './executive-table';
import { TrendingUp, Activity } from 'lucide-react';

export interface HeroMetricComponent {
  label: string;
  weight: number; // usually between 0 and 1, or 0 and 100
}

export interface ExecutiveHeroMetricProps {
  title: string;
  subtitle?: string;
  narrative?: string;
  components?: HeroMetricComponent[];
  score: number;
  maxScore?: number;
  scoreColor?: 'emerald' | 'blue' | 'amber' | 'rose' | 'slate';
  classification?: string;
  classificationTone?: 'success' | 'warning' | 'critical' | 'info' | 'neutral';
  riskLevel?: string;
  className?: string;
}

export function ExecutiveHeroMetric({
  title,
  subtitle,
  narrative,
  components = [],
  score,
  maxScore = 100,
  scoreColor = 'slate',
  classification,
  classificationTone = 'neutral',
  riskLevel,
  className
}: ExecutiveHeroMetricProps) {

  const toneClassMap: Record<string, string> = {
    success: 'bg-success-soft0 text-success border-success/20',
    warning: 'bg-warning-soft0 text-warning border-warning/20',
    critical: 'bg-critical-soft0 text-critical border-critical/20',
    info: 'bg-info-soft0 text-info border-info/20',
    neutral: 'bg-surface-container text-muted-foreground border-border'
  };

  return (
    <ExecutiveSurface padding="xl" radius="xl" className={cn("border-border", className)}>
      <div className="flex flex-col xl:flex-row gap-8 lg:gap-12 items-stretch">
        
        {/* Left Side: Context & Narrative */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-surface-container/50 border border-border flex items-center justify-center">
                <TrendingUp size={20} className="text-primary" />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-foreground">{title}</h3>
            </div>
            {subtitle && (
              <p className="text-sm text-foreground/70 font-medium leading-relaxed mb-6">
                {subtitle}
              </p>
            )}

            {narrative && (
              <div className="mb-8">
                <ExecutiveNarrative 
                  title="Parecer Estratégico"
                  variant={
                    classificationTone === 'success' ? 'recommendation' :
                    classificationTone === 'critical' ? 'risk' :
                    classificationTone === 'warning' ? 'board-note' :
                    'summary'
                  }
                >
                  {narrative}
                </ExecutiveNarrative>
              </div>
            )}
          </div>

          {components && components.length > 0 && (
            <div className="mt-auto">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">
                Composição do Índice
              </h4>
              <ExecutiveTable className="w-full text-xs">
                <ExecutiveTableHeader>
                  <ExecutiveTableRow className="bg-surface-container/30 border-b border-border">
                    <th className="text-left py-3 px-4 font-bold text-muted-foreground uppercase tracking-wider">Componente</th>
                    <th className="text-right py-3 px-4 font-bold text-muted-foreground uppercase tracking-wider">Peso</th>
                  </ExecutiveTableRow>
                </ExecutiveTableHeader>
                <ExecutiveTableBody>
                  {components.map((comp, idx) => (
                    <ExecutiveTableRow key={idx} className="border-b border-border last:border-0 hover:bg-surface-container/10 transition-colors">
                      <td className="py-2.5 px-4 font-medium text-foreground/80">{comp.label}</td>
                      <td className="py-2.5 px-4 text-right font-mono text-muted-foreground">
                        {comp.weight > 1 ? comp.weight.toFixed(0) : (comp.weight * 100).toFixed(0)}%
                      </td>
                    </ExecutiveTableRow>
                  ))}
                </ExecutiveTableBody>
              </ExecutiveTable>
            </div>
          )}
        </div>

        {/* Right Side: Hero Score */}
        <div className="w-full xl:w-[320px] shrink-0">
          <div className="h-full bg-surface-container/20 border border-border rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
            
            {/* Subtle background glow based on tone */}
            <div className={cn(
              "absolute inset-0 opacity-10 pointer-events-none transition-colors",
              classificationTone === 'success' ? 'bg-success' :
              classificationTone === 'warning' ? 'bg-warning' :
              classificationTone === 'critical' ? 'bg-critical' :
              classificationTone === 'info' ? 'bg-info' : 'bg-transparent'
            )} />

            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-8 text-center relative z-10">
              Score Institucional
            </h4>
            
            <div className="relative z-10">
              <ExecutiveScore 
                label="" // Intentionally blank as the context surrounds it
                value={score}
                maxValue={maxScore}
                color={scoreColor}
                size="xl"
                className="bg-transparent border-0 min-h-0 shadow-none !p-0" 
              />
            </div>

            <div className="mt-8 flex flex-col items-center gap-3 w-full relative z-10">
              {classification && (
                <div className={cn("px-4 py-1.5 rounded-full border text-xs font-black uppercase tracking-widest w-full text-center truncate", toneClassMap[classificationTone])}>
                  {classification}
                </div>
              )}
              {riskLevel && (
                <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                  <Activity size={14} />
                  {riskLevel}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </ExecutiveSurface>
  );
}
