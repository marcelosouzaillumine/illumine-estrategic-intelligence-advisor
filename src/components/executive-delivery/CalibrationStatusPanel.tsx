import React from 'react';
import { Sliders, CheckCircle2, Info } from 'lucide-react';
import { ExecutiveIntelligenceReport } from '../../services/FiduciaryRuntimeAdapter';
import { CalibrationEngine } from '../../services/FiduciaryRuntimeAdapter';
import { cn } from '../../lib/utils';

interface CalibrationStatusPanelProps {
  report: ExecutiveIntelligenceReport;
  className?: string;
}

export function CalibrationStatusPanel({ report, className }: CalibrationStatusPanelProps) {
  if (!report) return null;

  const activeProfileId = (report.runtimeMetadata as any)?.calibrationProfileId || CalibrationEngine.getActiveProfileId();
  const compilerVersion = (report.runtimeMetadata as any)?.engineVersion || CalibrationEngine.getVersion();

  const getProfileDescription = (profileId: string) => {
    switch (profileId) {
      case 'conservative':
        return 'Modo Conservador: Alertas precoces ativados, sensibilidade de stress elevada.';
      case 'balanced':
        return 'Modo Balanceado: Baseline institucional padrão da plataforma Illumine.';
      case 'aggressive':
        return 'Modo Dinâmico / Agressivo: Maior tolerância a variações de capital de giro.';
      case 'board_mode':
        return 'Modo de Conselho: Foco em governança corporativa e integridade fiduciária.';
      default:
        return `Perfil de Calibração: ${profileId}`;
    }
  };

  return (
    <div className={cn("bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm", className)}>
      <div className="flex items-center gap-2 mb-6">
        <Sliders className="text-slate-400" size={18} />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Perfil de Calibração Ativo</span>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        
        {/* Profile Card */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 w-full md:w-auto md:min-w-[280px]">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 block" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Active Profile</span>
          </div>
          <p className="text-xl font-black text-slate-900 tracking-tight mt-2 uppercase">
            {activeProfileId}
          </p>
          <p className="text-[10px] font-semibold text-slate-400 mt-1">
            Compiler Version: {compilerVersion}
          </p>
        </div>

        {/* Profile Details */}
        <div className="flex-1">
          <div className="flex gap-2.5 items-start">
            <Info size={16} className="text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-slate-800 leading-snug">
                {getProfileDescription(activeProfileId)}
              </p>
              <p className="text-[10px] font-semibold text-slate-500 mt-2 leading-relaxed">
                Este perfil de calibração dita os coeficientes de penalização de score, thresholds de stress e filtros de ruído aplicados deterministicamente pelo Core Runtime. A alteração deste perfil é restrita a usuários autorizados via painel de governança.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
