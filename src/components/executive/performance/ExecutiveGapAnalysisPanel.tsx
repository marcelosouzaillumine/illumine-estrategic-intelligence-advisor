import React from 'react';

export interface ExecutiveGapAnalysisPanelProps {
  metricName: string;
  gapVsBenchmark: number;
  gapVsTarget: number;
  status: 'CRÍTICO' | 'ALERTA' | 'SAUDÁVEL' | 'EXCELÊNCIA';
  narrative: string;
}

export const ExecutiveGapAnalysisPanel: React.FC<ExecutiveGapAnalysisPanelProps> = ({
  metricName,
  gapVsBenchmark,
  gapVsTarget,
  status,
  narrative
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'CRÍTICO': return 'bg-red-100 text-red-800 border-red-200';
      case 'ALERTA': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'SAUDÁVEL': return 'bg-green-100 text-green-800 border-green-200';
      case 'EXCELÊNCIA': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={`flex flex-col gap-3 p-4 border rounded-lg ${getStatusColor()}`}>
      <div className="flex justify-between items-center border-b pb-2">
        <h4 className="font-semibold">{metricName} - Análise de Gap</h4>
        <span className="px-2 py-1 text-xs font-bold uppercase rounded bg-white/50">{status}</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs uppercase opacity-70">Gap vs Benchmark</p>
          <p className="text-base font-bold">{gapVsBenchmark > 0 ? '+' : ''}{gapVsBenchmark.toFixed(1)} p.p.</p>
        </div>
        <div>
          <p className="text-xs uppercase opacity-70">Gap vs Meta</p>
          <p className="text-base font-bold">{gapVsTarget > 0 ? '+' : ''}{gapVsTarget.toFixed(1)} p.p.</p>
        </div>
      </div>
      <p className="text-sm mt-2 font-medium">{narrative}</p>
    </div>
  );
};
