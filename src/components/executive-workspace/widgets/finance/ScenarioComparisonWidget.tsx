import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useExecutiveFormatter } from '../../../../core/localization';

export interface ScenarioComparisonWidgetProps {
  data: Array<{
    month: string;
    actual: number;
    budget: number;
    forecast: number;
  }>;
}

export function ScenarioComparisonWidget({ data }: ScenarioComparisonWidgetProps) {
  const formatter = useExecutiveFormatter();
  const formatCurrency = (val: number) => {
    return formatter.currency(val);
  };

  return (
    <div className="bg-surface-elevated border border-border rounded-xl p-5 shadow-sm h-[300px] flex flex-col">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Comparação de Cenários</h3>
      <div className="flex-1 w-full h-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Line type="monotone" dataKey="actual" name="Realizado" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="budget" name="Orçado" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            <Line type="monotone" dataKey="forecast" name="Projetado" stroke="#f59e0b" strokeWidth={2} strokeDasharray="3 3" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
