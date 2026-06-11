import React from 'react';
import { AreaChart as RechartsAreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';
import { ExecutiveChart, ExecutiveChartGrid, ExecutiveChartXAxis, ExecutiveChartTooltip } from '../../ui/executive-chart';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { BalanceSheetEvolutionViewModel } from './view-models';
import { cn } from '../../../lib/utils';
import { ExecutiveEmptyState } from '../../ui/executive-empty-state';

export function BalanceSheetEvolutionAnalysisSection({
  viewModel,
  formatCurrency
}: {
  viewModel: BalanceSheetEvolutionViewModel;
  formatCurrency: (value: number) => string;
}) {
  if (!viewModel.hasEnoughData) {
    return (
      <ExecutiveEmptyState 
        icon={TrendingDown}
        title="Evolução histórica insuficiente"
        description="São necessários ao menos dois exercícios para gerar inferências longitudinais."
        className="mb-6"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <ExecutiveChart 
        title="Análise de Evolução Histórica"
        description="Comparativo de 5 Anos"
        height={320}
        className="xl:col-span-2 group"
        empty={!viewModel.chartData || viewModel.chartData.length === 0}
      >
        <div className="flex gap-5 bg-surface-container/30 px-4 py-2 rounded-full border border-border absolute top-6 right-6 z-10">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Ativo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-surface-container 400 shadow-[0_0_8px_rgba(148,163,184,0.5)]" />
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Passivo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Patrimônio</span>
          </div>
        </div>
        <RechartsAreaChart data={viewModel.chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorAtivo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorPassivo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorPl" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <ExecutiveChartGrid vertical={false} />
          <ExecutiveChartXAxis dataKey="year" dy={10} />
          <ExecutiveChartTooltip 
            content={({ active, payload }: any) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-foreground/90 text-white p-5 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-xl">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-white/50">{payload[0].payload.year}</p>
                    <div className="space-y-3">
                      {payload.map((p: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between gap-10">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                            <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">{p.name}</span>
                          </div>
                          <span className="text-xs font-black tabular-nums">{formatCurrency(p.value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area type="monotone" dataKey="ativo" name="Ativo" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorAtivo)" />
          <Area type="monotone" dataKey="passivo" name="Passivo" stroke="#94a3b8" strokeWidth={3} fillOpacity={1} fill="url(#colorPassivo)" />
          <Area type="monotone" dataKey="patrimonioLiquido" name="PL" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorPl)" />
        </RechartsAreaChart>
      </ExecutiveChart>

      <div className="bg-foreground text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
        
        <h3 className="text-lg font-black mb-1">Destaques Analíticos</h3>
        <p className="text-secondary">Variações Significativas (YoY)</p>
        
        <div className="space-y-6 flex-1 mt-6">
          {viewModel.highlights.map((change, i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className={cn(
                "p-2 rounded-xl shrink-0",
                change.tone === 'positive' ? "bg-success-soft0/20 text-emerald-700" : 
                change.tone === 'negative' ? "bg-critical-soft0/20 text-rose-700" : 
                "bg-surface-container/20 text-muted-foreground"
              )}>
                {change.tone === 'positive' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              </div>
              <div>
                <p className="text-secondary">{change.label}</p>
                <p className="text-sm font-bold">{change.valueFormatted}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn(
                    "text-[10px] font-black", 
                    change.tone === 'positive' ? "text-emerald-400" : 
                    change.tone === 'negative' ? "text-rose-400" : 
                    "text-muted-foreground"
                  )}>
                    {change.tone === 'positive' ? '+' : ''}{change.horizontalAnalysis.toFixed(2)}%
                  </span>
                  <span className="text-[9px] text-white/30 font-medium">vs ano anterior</span>
                </div>
              </div>
            </div>
          ))}
          {viewModel.highlights.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 opacity-50 text-center px-4">
              <Info size={32} className="mb-3 text-muted-foreground" />
              <p className="text-secondary">Estabilidade Estrutural</p>
              <p className="text-secondary mt-1">A arquitetura de capital não sofreu realocações bruscas entre os ciclos avaliados.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
