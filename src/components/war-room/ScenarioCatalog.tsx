import React from 'react';
import { UIWarRoomScenario } from '../../viewmodels/war-room/WarRoomViewModel';
import { Target, Archive, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ScenarioCatalogProps {
  scenarios: UIWarRoomScenario[];
  activeScenarioId: string | null;
}

export const ScenarioCatalog: React.FC<ScenarioCatalogProps> = ({ scenarios, activeScenarioId }) => {
  const navigate = useNavigate();
  
  if (scenarios.length === 0) {
    return (
      <div className="card-premium p-6 text-center">
        <Archive className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
        <h4 className="text-sm font-bold text-foreground">Nenhum cenário persistido disponível.</h4>
        <p className="text-xs text-muted-foreground mt-2">
          Os cenários não são gerados em tempo real pelo War Room. Retorne ao ambiente de planejamento para calcular novos cenários.
        </p>
      </div>
    );
  }

  return (
    <div className="card-premium overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-border bg-surface-container-highest flex items-center justify-between">
        <h3 className="text-eyebrow text-foreground uppercase tracking-widest flex items-center gap-2">
          <Target className="w-4 h-4 text-amber-500" />
          Catálogo de Cenários
        </h3>
        <span className="text-[10px] font-mono text-muted-foreground tabular-nums">{scenarios.length} calculados</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {scenarios.map(scenario => (
          <button
            key={scenario.id}
            onClick={() => {
              const navRef = {
                tenantId: 'SYSTEM_TENANT',
                sourceWorkspace: 'WAR_ROOM',
                targetWorkspace: 'WAR_ROOM',
                objectId: scenario.id,
                correlationId: `nav-${Date.now()}`
              };
              navigate(`/war-room/${scenario.id}`, { state: { navRef } });
            }}
            className={`w-full text-left p-3 rounded-xl border transition-all ${
              activeScenarioId === scenario.id 
                ? 'bg-warning-soft0/10 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.05)]' 
                : 'bg-surface-container/40 border-border/50 hover:bg-surface-container hover:border-border-hover'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                scenario.confidenceLevel === 'HIGH' ? 'bg-success-soft0/10 text-emerald-400' :
                scenario.confidenceLevel === 'MEDIUM' ? 'bg-warning-soft0/10 text-amber-400' :
                'bg-critical-soft0/10 text-rose-400'
              }`}>
                {scenario.confidenceLevel} Confiança
              </span>
              <span className="text-[9px] font-mono text-muted-foreground tabular-nums">{scenario.date}</span>
            </div>
            <h4 className={`text-sm font-bold ${activeScenarioId === scenario.id ? 'text-amber-400' : 'text-foreground'} mb-1`}>
              {scenario.name}
            </h4>
            <div className="flex justify-between items-center mt-2">
              <span className="text-eyebrow text-muted-foreground bg-surface-container-highest px-2 py-0.5 rounded">
                {scenario.category}
              </span>
              <ChevronRight className={`w-4 h-4 ${activeScenarioId === scenario.id ? 'text-amber-500' : 'text-muted-foreground'}`} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
