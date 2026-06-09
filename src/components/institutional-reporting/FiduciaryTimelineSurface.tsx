import React from 'react';
import { FiduciaryTimelineSection } from '../../services/FiduciaryRuntimeAdapter';
import { ShieldAlert, AlertTriangle, Info, Clock, Activity, Target } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface FiduciaryTimelineSurfaceProps {
  timeline?: FiduciaryTimelineSection;
}

export const FiduciaryTimelineSurface: React.FC<FiduciaryTimelineSurfaceProps> = ({ timeline }) => {
  const { translateLabel: t } = useLanguage();
  if (!timeline) {
    return null;
  }

  if (timeline.timelineIntegrityStatus === 'INSUFFICIENT_HISTORY') {
    return (
      <div className="bg-slate-900/50 border border-border rounded-xl p-6 text-center">
        <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
        <h3 className="text-muted-foreground font-medium mb-1">{t("panels.insufficient_history")}</h3>
        <p className="text-muted-foreground text-sm">
          A Timeline Fiduciária requer múltiplos ciclos consolidados para aferir sustentabilidade longitudinal.
        </p>
      </div>
    );
  }

  if (timeline.timelineIntegrityStatus === 'BROKEN') {
    return (
      <div className="bg-red-950/20 border border-red-900/50 rounded-xl p-6 text-center">
        <ShieldAlert className="w-8 h-8 text-red-500 mx-auto mb-3" />
        <h3 className="text-red-400 font-medium mb-1">{t("panels.temporal_integrity_break")}</h3>
        <p className="text-red-500/70 text-sm">
          A leitura longitudinal foi bloqueada devido a falhas de reconciliação em ciclos anteriores. A continuidade da trajetória não pôde ser atestada fiduciariamente.
        </p>
      </div>
    );
  }

  const { runwayEvolution, burnEvolution, fcoEvolution, liquidityQualityEvolution, periodsCovered } = timeline;

  const renderTimelineBlocks = (data: (number | string)[], type: 'NUMBER' | 'QUALITY') => {
    return (
      <div className="flex items-center gap-1 mt-2">
        {data.map((val, idx) => {
          let bgColor = 'bg-slate-800';
          let textColor = 'text-muted-foreground';
          
          if (type === 'NUMBER') {
            const num = val as number;
            if (num < 0) { bgColor = 'bg-red-500/20'; textColor = 'text-red-400'; }
            else if (num > 0) { bgColor = 'bg-emerald-500/20'; textColor = 'text-emerald-400'; }
          } else {
            const str = val as string;
            if (str === 'LIQUIDEZ_ARTIFICIAL') { bgColor = 'bg-amber-500/20'; textColor = 'text-amber-400'; }
            else if (str === 'HEALTHY' || str === 'SAUDÁVEL') { bgColor = 'bg-emerald-500/20'; textColor = 'text-emerald-400'; }
            else { bgColor = 'bg-slate-500/20'; textColor = 'text-muted-foreground'; }
          }

          return (
            <div key={idx} className={`flex-1 h-12 flex items-center justify-center border border-white/5 ${bgColor}`}>
              <span className={`text-[10px] font-mono ${textColor}`}>
                {type === 'NUMBER' ? (val as number).toFixed(1) : (val as string).substring(0, 3)}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      <div className="bg-slate-900/50 border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-muted-foreground font-medium text-sm">{t("panels.fiduciary_cash_evolution")}</h3>
          </div>
          <span className="text-xs text-muted-foreground font-mono">{periodsCovered} CICLOS ANALISADOS</span>
        </div>
        
        <div className="space-y-5">
          <div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Geração Operacional (FCO)</div>
            {renderTimelineBlocks(fcoEvolution, 'NUMBER')}
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">{t("panels.liquidity_quality")}</div>
            {renderTimelineBlocks(liquidityQualityEvolution, 'QUALITY')}
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Runway (Meses)</div>
            {renderTimelineBlocks(runwayEvolution, 'NUMBER')}
          </div>
        </div>
      </div>

      {(timeline.fiduciaryWarnings.length > 0 || timeline.dependencyRecurrence > 0) && (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h3 className="text-amber-500 font-medium text-sm">{t("panels.trajectory_markers")}</h3>
          </div>
          <ul className="space-y-2">
            {timeline.dependencyRecurrence > 0 && (
              <li className="text-xs text-amber-400/80 flex items-start gap-2">
                <Target className="w-3.5 h-3.5 mt-0.5 opacity-70" />
                <span>Identificada recorrência em injeções externas de caixa ({Math.round(timeline.artificialLiquidityFrequency * 100)}% dos ciclos).</span>
              </li>
            )}
            {!timeline.ebitdaToCashConsistency && (
              <li className="text-xs text-amber-400/80 flex items-start gap-2">
                <Target className="w-3.5 h-3.5 mt-0.5 opacity-70" />
                <span>Inconsistência identificada entre Lucro Declarado (EBITDA/Líquido) e Geração Real de Caixa (FCO).</span>
              </li>
            )}
            {timeline.trajectoryMarkers.map((marker, i) => (
              <li key={i} className="text-xs text-amber-400/80 flex items-start gap-2">
                <Target className="w-3.5 h-3.5 mt-0.5 opacity-70" />
                <span>{marker.replace(/_/g, ' ')}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
};
