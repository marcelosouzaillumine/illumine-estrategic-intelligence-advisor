import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface HistoricalCycle {
  cycleId: string;
  fco?: number;
  survivalModeActive?: boolean;
  treasurySeverity?: string;
  [key: string]: any;
}

interface InstitutionalTrajectoryGraphProps {
  longitudinalRuntimeHistory: HistoricalCycle[];
  confidenceLevel: string;
}

export function InstitutionalTrajectoryGraph({
  longitudinalRuntimeHistory,
  confidenceLevel
}: InstitutionalTrajectoryGraphProps) {
  const { t } = useLanguage();

  const isFailClosed = confidenceLevel === 'LOW';

  // Render-only: we transform the runtime output into chart points without any calculation.
  // Each point displays the raw FCO and survival status from the runtime history.
  const chartData = longitudinalRuntimeHistory.map((cycle, idx) => ({
    name: cycle.cycleId || `C${idx + 1}`,
    fco: cycle.fco ?? 0,
    isSurvival: cycle.survivalModeActive ? 1 : 0,
    severity: cycle.treasurySeverity || 'UNKNOWN'
  }));

  // Determine dot color per severity (render-only mapping, no calculation)
  const severityColorMap: Record<string, string> = {
    STABLE: '#34d399',
    STRESSED: '#fbbf24',
    CRITICAL: '#ef4444',
    UNKNOWN: '#71717a'
  };

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    const color = severityColorMap[payload.severity] || severityColorMap['UNKNOWN'];
    const isSurvival = payload.isSurvival === 1;

    return (
      <g>
        <circle cx={cx} cy={cy} r={isSurvival ? 6 : 4} fill={color} stroke="#18181b" strokeWidth={2} />
        {isSurvival && (
          <circle cx={cx} cy={cy} r={9} fill="none" stroke="#ef4444" strokeWidth={1} strokeDasharray="3 2" />
        )}
      </g>
    );
  };

  const CustomTooltipContent = ({ active, payload, label }: any) => {
    if (!active || !payload || payload.length === 0) return null;
    const data = payload[0].payload;
    return (
      <div className="bg-zinc-900 border border-zinc-700 rounded p-3 font-mono text-xs">
        <p className="text-zinc-300 font-bold mb-1">{label}</p>
        <p className="text-zinc-400">{t('summary.fco_label')} <span className={data.fco >= 0 ? 'text-emerald-400' : 'text-red-400'}>{data.fco.toLocaleString()}</span></p>
        <p className="text-zinc-400">{t('summary.treasury_label')} <span className="text-zinc-300">{data.severity}</span></p>
        {data.isSurvival === 1 && (
          <p className="text-red-400 mt-1 font-bold">{t('summary.survival_mode_alert')}</p>
        )}
      </div>
    );
  };

  if (chartData.length === 0) {
    return (
      <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg w-full font-mono">
        <h3 className="text-zinc-400 text-xs font-semibold tracking-wider uppercase mb-4">
          {t('summary.institutional_trajectory')}
        </h3>
        <div className="text-center py-8">
          <p className="text-zinc-600 text-xs">{t('summary.no_longitudinal_history')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg w-full font-mono">
      <h3 className="text-zinc-400 text-xs font-semibold tracking-wider uppercase mb-4">
        {t('summary.institutional_trajectory')}
      </h3>

      <div className={`w-full ${isFailClosed ? 'opacity-40' : ''}`} style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }} 
              axisLine={{ stroke: '#3f3f46' }}
            />
            <YAxis 
              tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'monospace' }} 
              axisLine={{ stroke: '#3f3f46' }}
            />
            <Tooltip content={<CustomTooltipContent />} />
            <ReferenceLine y={0} stroke="#52525b" strokeDasharray="4 2" />
            <Line
              type="monotone"
              dataKey="fco"
              stroke="#818cf8"
              strokeWidth={2}
              dot={<CustomDot />}
              activeDot={{ r: 6, stroke: '#818cf8', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 text-[10px] text-zinc-500">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
          {t('summary.treasury_stable')}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block"></span>
          {t('summary.treasury_stressed')}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block"></span>
          {t('summary.treasury_critical')}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full border border-red-500 border-dashed inline-block"></span>
          {t('summary.survival_mode')}
        </div>
      </div>

      {isFailClosed && (
        <div className="mt-3 p-2.5 bg-red-950/40 border border-red-900/40 rounded flex items-start gap-2">
          <AlertTriangle size={14} className="text-red-500 mt-0.5 shrink-0" />
          <p className="text-[10px] text-red-400">{t('summary.trajectory_visualization_constrained')}</p>
        </div>
      )}
    </div>
  );
}
