import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { ExecutiveChart, ExecutiveChartTooltip } from '../../ui/executive-chart';
import { BalanceSheetCompositionViewModel } from './view-models';

export function BalanceSheetCompositionChartsSection({
  viewModel,
  formatCurrency
}: {
  viewModel: BalanceSheetCompositionViewModel;
  formatCurrency: (value: number) => string;
}) {
  return (
    <>
      {/* Composição do Ativo */}
      <ExecutiveChart 
        title="Composição do Ativo"
        description="Distribuição do Capital Aplicado"
        height={256}
        empty={!viewModel.assetsData || viewModel.assetsData.length === 0}
      >
        <div className="flex items-center h-full w-full">
          <div className="h-full w-1/2">
              <RechartsPieChart width={250} height={250}>
                <Pie
                  data={viewModel.assetsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {viewModel.assetsData && viewModel.assetsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill || '#3b82f6'} />
                  ))}
                </Pie>
                <ExecutiveChartTooltip formatter={(value: number) => formatCurrency(value)} />
              </RechartsPieChart>
          </div>
          <div className="w-1/2 pl-4 space-y-3">
            {viewModel.assetsData && viewModel.assetsData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.fill || '#3b82f6' }} />
                <div>
                   <p className="text-secondary" title={item.name}>{item.name}</p>
                   <p className="text-secondary">{formatCurrency(item.value)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ExecutiveChart>

      {/* Composição do Passivo */}
      <ExecutiveChart 
        title="Composição do Passivo"
        description="Origem dos Recursos"
        height={256}
        empty={!viewModel.liabilitiesData || viewModel.liabilitiesData.length === 0}
      >
        <div className="flex items-center h-full w-full">
          <div className="h-full w-1/2">
              <RechartsPieChart width={250} height={250}>
                <Pie
                  data={viewModel.liabilitiesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {viewModel.liabilitiesData && viewModel.liabilitiesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill || '#3b82f6'} />
                  ))}
                </Pie>
                <ExecutiveChartTooltip formatter={(value: number) => formatCurrency(value)} />
              </RechartsPieChart>
          </div>
          <div className="w-1/2 pl-4 space-y-3">
            {viewModel.liabilitiesData && viewModel.liabilitiesData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.fill || '#3b82f6' }} />
                <div>
                   <p className="text-secondary" title={item.name}>{item.name}</p>
                   <p className="text-secondary">{formatCurrency(item.value)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ExecutiveChart>
    </>
  );
}
