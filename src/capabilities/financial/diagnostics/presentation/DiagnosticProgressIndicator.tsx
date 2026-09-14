import React from 'react';

interface DiagnosticProgressIndicatorProps {
  currentDimensionName: string;
  nextDimensionName?: string;
  completedDimensionsCount: number;
  totalDimensionsCount: number;
}

export function DiagnosticProgressIndicator({
  currentDimensionName,
  nextDimensionName,
  completedDimensionsCount,
  totalDimensionsCount
}: DiagnosticProgressIndicatorProps) {
  
  const percentage = Math.max(5, (completedDimensionsCount / totalDimensionsCount) * 100);

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-end mb-2">
        <div>
          <p className="text-xs text-amber-500 font-bold uppercase tracking-widest mb-1">
            Explorando Inteligência Executiva
          </p>
          <h3 className="text-white text-lg font-medium">
            {currentDimensionName.replace('™', '')}
          </h3>
        </div>
        <div className="text-right">
          <span className="text-slate-500 text-xs font-medium">
            {completedDimensionsCount} de {totalDimensionsCount} áreas
          </span>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-[#1A1A1D] rounded-full overflow-hidden">
        <div 
          className="h-full bg-amber-500 transition-all duration-700 ease-in-out" 
          style={{ width: `${percentage}%` }}
        />
      </div>

      {nextDimensionName && (
        <p className="text-slate-500 text-xs mt-2 font-medium">
          Próxima área: <span className="text-slate-400">{nextDimensionName.replace('™', '')}</span>
        </p>
      )}
    </div>
  );
}
