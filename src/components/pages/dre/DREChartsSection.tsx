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
    >
      <div className="flex gap-4 absolute top-6 right-6 z-10">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--color-chart-1)' }} />
          <span className="text-[10px] font-bold uppercase text-muted-foreground">{t('dre.metrics.net_revenue')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--color-chart-2)' }} />
          <span className="text-[10px] font-bold uppercase text-muted-foreground">{viewModel.cmvLabel}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--color-chart-3)' }} />
          <span className="text-[10px] font-bold uppercase text-muted-foreground">{t('dre.metrics.ebitda')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--color-chart-4)' }} />
          <span className="text-[10px] font-bold uppercase text-muted-foreground">{t('dre.metrics.net_result')}</span>
        </div>
      </div>
      <BarChart data={viewModel.data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <ExecutiveChartGrid vertical={false} />
        <ExecutiveChartXAxis dataKey="year" dy={10} />
        <ExecutiveChartTooltip 
          formatter={(value: any) => formatCurrency(Number(value))}
          cursor={{ fill: 'var(--color-muted)', opacity: 0.2 }}
        />
        <Bar dataKey="receita" name="Receita Líquida" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="cmv" name={viewModel.cmvLabel} fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="ebitda" name="EBITDA" fill="var(--color-chart-3)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="lucro" name="Resultado Líquido" fill="var(--color-chart-4)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ExecutiveChart>
  );
}
