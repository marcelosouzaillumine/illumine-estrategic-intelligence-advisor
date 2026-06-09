import React from 'react';

export interface OperationalBenchmarkPanelProps {
  currentValue: number;
  benchmarkValue: number;
  prudenceThreshold: number;
  metricName: string;
}

export const OperationalBenchmarkPanel: React.FC<OperationalBenchmarkPanelProps> = ({
  currentValue,
  benchmarkValue,
  prudenceThreshold,
  metricName
}) => {
  return (
    <div className="flex flex-col gap-2 p-4 bg-gray-50 border border-gray-200 rounded-lg">
      <h3 className="text-sm font-semibold text-gray-700">{metricName} - Benchmark Setorial</h3>
      <div className="grid grid-cols-3 gap-4 mt-2">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 uppercase">Atual</span>
          <span className="text-lg font-bold text-gray-900">{currentValue.toFixed(1)}%</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 uppercase">Benchmark</span>
          <span className="text-lg font-bold text-blue-600">{benchmarkValue.toFixed(1)}%</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 uppercase">Min. Prudencial</span>
          <span className="text-lg font-bold text-orange-600">{prudenceThreshold.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};
