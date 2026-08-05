import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useExecutiveFormatter } from '../../../../core/localization';

export interface CashForecastWidgetProps {
  data: Array<{
    period: string;
    inflows: number;
    outflows: number;
    netCash: number;
  }>;
}

export function CashForecastWidget({ data }: CashForecastWidgetProps) {
  const formatter = useExecutiveFormatter();
  const formatCurrency = (val: number) => {
    return formatter.currency(val);
  };

  return (
    <div className="bg-surface-elevated border border-border rounded-xl p-5 shadow-sm h-[300px] flex flex-col">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Projeção de Caixa Livre (90 Dias)</h3>
      <div className="flex-1 w-full h-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="period" tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
            />
            <ReferenceLine y={0} stroke="#475569" />
            <Bar dataKey="inflows" name="Entradas" fill="#10b981" radius={[4, 4, 0, 0]} barSize={12} />
            <Bar dataKey="outflows" name="Saídas" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={12} />
            <Bar dataKey="netCash" name="Caixa Líquido" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={12} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
