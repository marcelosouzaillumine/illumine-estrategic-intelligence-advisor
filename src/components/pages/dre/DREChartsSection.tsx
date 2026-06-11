import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { 
  BarChart, 
  Bar, 
} from 'recharts';
import { 
  ExecutiveChart,
  ExecutiveChartGrid,
  ExecutiveChartXAxis,
  ExecutiveChartTooltip
} from '../../ui/executive-chart';
import { formatCurrency } from '../../../lib/utils';
import { DREChartsSectionViewModel } from './view-models';

interface Props {
  viewModel: DREChartsSectionViewModel;
}

export function DREChartsSection({ viewModel }: Props) {
  const { t } = useLanguage();

  return (
    <ExecutiveChart 
      title={t('dre.evolution.title')}
      description="Receita, EBITDA e Lucro"
      height={300}
      className="w-full"
    >
      <div className="flex gap-4 absolute top-6 right-6 z-10">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span className="text-[9px] font-bold uppercase text-muted-foreground">{t('dre.metrics.net_revenue')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-critical-soft0" />
          <span className="text-[9px] font-bold uppercase text-muted-foreground">{viewModel.cmvLabel}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-success-soft0" />
          <span className="text-[9px] font-bold uppercase text-muted-foreground">{t('dre.metrics.ebitda')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
          <span className="text-[9px] font-bold uppercase text-muted-foreground">{t('dre.metrics.net_result')}</span>
        </div>
      </div>
      <BarChart data={viewModel.data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <ExecutiveChartGrid vertical={false} />
        <ExecutiveChartXAxis dataKey="year" dy={10} />
        <ExecutiveChartTooltip 
          content={({ active, payload }: any) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-foreground text-white p-4 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-md">
                  <p className="text-[10px] font-black uppercase tracking-widest mb-2 text-white/50">{payload[0].payload.year}</p>
                  <div className="space-y-1.5">
                    {payload.map((p: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between gap-8">
                        <span className="text-[10px] font-bold text-white/70 uppercase">{p.name}</span>
                        <span className="text-xs font-black">{formatCurrency(p.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey="receita" name="Receita Líquida" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        <Bar dataKey="cmv" name={viewModel.cmvLabel} fill="#f43f5e" radius={[4, 4, 0, 0]} />
        <Bar dataKey="ebitda" name="EBITDA" fill="#10b981" radius={[4, 4, 0, 0]} />
        <Bar dataKey="lucro" name="Resultado Líquido" fill="#a855f7" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ExecutiveChart>
  );
}
