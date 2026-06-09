import React from 'react';
import { UIWarRoomImpact } from '../../viewmodels/war-room/WarRoomViewModel';
import { Map as MapIcon } from 'lucide-react';

interface ScenarioImpactMapProps {
  impacts: UIWarRoomImpact[];
}

export const ScenarioImpactMap: React.FC<ScenarioImpactMapProps> = ({ impacts }) => {
  if (impacts.length === 0) {
    return (
      <div className="bg-primary/40 border border-slate-800 rounded-2xl p-6 h-full flex flex-col items-center justify-center">
        <MapIcon className="w-8 h-8 text-muted-foreground mb-3" />
        <h4 className="text-sm font-bold text-muted-foreground">Nenhum mapa de impacto disponível.</h4>
        <p className="text-sm text-muted-foreground mt-2 text-center max-w-sm">
          A topologia de consequências depende do carregamento prévio do Institutional Knowledge Graph.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-primary/60 border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-[400px]">
      <div className="p-4 border-b border-slate-800 bg-primary/80 flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <MapIcon className="w-4 h-4 text-indigo-500" />
          Mapa de Consequências Sistêmicas
        </h3>
      </div>
      
      <div className="flex-1 relative bg-slate-950/80 p-6 flex flex-col items-center justify-center">
        {/* Mock representation of a graph visualization */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at center, #4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
        />
        <div className="z-10 bg-primary/80 p-6 rounded-2xl border border-slate-700/50 backdrop-blur shadow-xl text-center max-w-lg">
          <h4 className="text-sm font-bold text-slate-200 mb-2">Representação Gráfica Estática</h4>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Aqui seria renderizado o componente D3.js ou React Flow com a arquitetura de impactos extraída do Knowledge Graph. Zero inferência. Apenas visualização de caminhos fiduciários validados.
          </p>
          <div className="flex items-center justify-center gap-3 text-[10px] font-mono text-muted-foreground uppercase">
            <span>{impacts.length} NÓS CARREGADOS</span>
            <span className="w-1 h-1 bg-slate-600 rounded-full" />
            <span>TOPOLOGIA READ-ONLY</span>
          </div>
        </div>
      </div>
    </div>
  );
};
