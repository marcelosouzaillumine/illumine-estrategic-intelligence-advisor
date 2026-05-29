import React from 'react';
import { TemporalDensityMap } from '../../core/runtime/institutional-memory/types';

interface TemporalHeatmapPanelProps {
  densityMaps: TemporalDensityMap[];
}

export const TemporalHeatmapPanel: React.FC<TemporalHeatmapPanelProps> = ({ densityMaps }) => {
  if (!densityMaps || densityMaps.length === 0) {
    return null; // Dummy Renderer
  }

  // Pre-calculate density shades (0-100) -> opacity or color
  const getHeatColor = (density: number) => {
    if (density < 20) return 'bg-slate-800';
    if (density < 40) return 'bg-yellow-900';
    if (density < 60) return 'bg-orange-800';
    if (density < 80) return 'bg-red-800';
    return 'bg-red-600';
  };

  const keys: Array<{ key: keyof TemporalDensityMap; label: string }> = [
    { key: 'anomalyDensity', label: 'Anomaly Density' },
    { key: 'recurrenceDensity', label: 'Recurrence Density' },
    { key: 'fatigueDensity', label: 'Fatigue Density' },
    { key: 'treasuryInstabilityDensity', label: 'Treasury Instability' },
    { key: 'operationalPressureDensity', label: 'Operational Pressure' },
    { key: 'governanceBreakdownDensity', label: 'Gov. Breakdown' }
  ];

  return (
    <div className="temporal-heatmap-panel p-6 bg-slate-900 border border-slate-700 rounded-lg shadow-md text-slate-100 overflow-x-auto">
      <div className="mb-6 border-b border-slate-700 pb-4 min-w-[600px]">
        <h3 className="text-lg font-semibold text-slate-50">Temporal Event Density Heatmap</h3>
        <p className="text-xs text-slate-400 mt-1">Cross-sectional density of institutional stress markers over time</p>
      </div>

      <div className="min-w-[600px]">
        <div className="grid grid-cols-[200px_repeat(auto-fit,minmax(50px,1fr))] gap-1 mb-2">
          <div className="text-xs font-semibold text-slate-400 uppercase">Marker</div>
          {densityMaps.map((map, idx) => (
            <div key={idx} className="text-center text-xs font-mono text-slate-500">{map.period}</div>
          ))}
        </div>

        {keys.map(({ key, label }) => (
          <div key={key} className="grid grid-cols-[200px_repeat(auto-fit,minmax(50px,1fr))] gap-1 mb-1 items-center">
            <div className="text-sm text-slate-300 truncate pr-2">{label}</div>
            {densityMaps.map((map, idx) => {
              const val = map[key] as number;
              return (
                <div 
                  key={idx} 
                  className={`h-8 rounded-sm ${getHeatColor(val)} flex items-center justify-center transition-colors group relative`}
                >
                  <span className="opacity-0 group-hover:opacity-100 text-[10px] font-mono font-bold text-white transition-opacity">
                    {val}
                  </span>
                </div>
              );
            })}
          </div>
        ))}

        <div className="mt-6 flex items-center justify-end gap-2 text-xs text-slate-400">
          <span>Low Density</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 bg-slate-800 rounded-sm"></div>
            <div className="w-4 h-4 bg-yellow-900 rounded-sm"></div>
            <div className="w-4 h-4 bg-orange-800 rounded-sm"></div>
            <div className="w-4 h-4 bg-red-800 rounded-sm"></div>
            <div className="w-4 h-4 bg-red-600 rounded-sm"></div>
          </div>
          <span>High Density</span>
        </div>
      </div>
    </div>
  );
};
