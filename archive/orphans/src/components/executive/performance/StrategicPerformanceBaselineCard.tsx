import React from 'react';

export interface StrategicPerformanceBaselineCardProps {
  currentValue: number;
  strategicTarget: number;
  kpiId: string;
}

export const StrategicPerformanceBaselineCard: React.FC<StrategicPerformanceBaselineCardProps> = ({
  currentValue,
  strategicTarget,
  kpiId
}) => {
  const isMeetingTarget = currentValue >= strategicTarget;

  return (
    <div className="flex flex-col p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-500 uppercase">{kpiId.replace(/_/g, ' ')}</span>
        {isMeetingTarget ? (
           <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded">Target Achieved</span>
        ) : (
           <span className="text-xs text-orange-600 font-bold bg-orange-50 px-2 py-1 rounded">Below Target</span>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-gray-900">{currentValue.toFixed(1)}%</span>
        <span className="text-sm font-medium text-gray-500">/ meta {strategicTarget.toFixed(1)}%</span>
      </div>
    </div>
  );
};
