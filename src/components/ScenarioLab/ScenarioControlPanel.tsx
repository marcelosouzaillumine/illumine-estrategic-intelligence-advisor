import React from 'react';
import { ShieldCheck, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useExecutiveFormatter } from '../../core/localization';


interface Props {
  parameters: any;
  onChange: (params: any) => void;
}

export function ScenarioControlPanel({ parameters, onChange }: Props) {
  const formatter = useExecutiveFormatter();
  
  const handleSlider = (field: string, val: string) => {
    onChange({ ...parameters, [field]: parseFloat(val) });
  };

  return (
    <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary text-primary rounded-lg">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h2 className="text-sm font-black text-muted-foreground uppercase tracking-widest">Painel de Simulação</h2>
          <p className="text-xs text-muted-foreground">Ajuste os parâmetros para simular o cenário institucional.</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* GROWTH */}
        <div>
          <label className="text-xs font-bold text-muted-foreground flex justify-between mb-2">
            <span className="flex items-center gap-1"><TrendingUp size={14} className="text-emerald-500"/> Multiplicador de Receita</span>
            <span className="text-primary font-mono">x{(parameters.revenueMultiplier || 1).toFixed(2)}</span>
          </label>
          <input 
            type="range" min="0.5" max="2" step="0.05" 
            value={parameters.revenueMultiplier || 1} 
            onChange={(e) => handleSlider('revenueMultiplier', e.target.value)}
            className="w-full accent-indigo-600"
          />
        </div>

        {/* COGS */}
        <div>
          <label className="text-xs font-bold text-muted-foreground flex justify-between mb-2">
            <span className="flex items-center gap-1"><TrendingDown size={14} className="text-rose-500"/> Multiplicador de CMV (Custos Var)</span>
            <span className="text-rose-600 font-mono">x{(parameters.cogsMultiplier || 1).toFixed(2)}</span>
          </label>
          <input 
            type="range" min="0.5" max="2" step="0.05" 
            value={parameters.cogsMultiplier || 1} 
            onChange={(e) => handleSlider('cogsMultiplier', e.target.value)}
            className="w-full accent-rose-500"
          />
        </div>

        {/* OPEX */}
        <div>
          <label className="text-xs font-bold text-muted-foreground flex justify-between mb-2">
            <span>Multiplicador de OPEX (Fixos)</span>
            <span className="text-rose-600 font-mono">x{(parameters.opexMultiplier || 1).toFixed(2)}</span>
          </label>
          <input 
            type="range" min="0.5" max="2" step="0.05" 
            value={parameters.opexMultiplier || 1} 
            onChange={(e) => handleSlider('opexMultiplier', e.target.value)}
            className="w-full accent-rose-500"
          />
        </div>

        {/* DEBT INJECTION */}
        <div>
          <label className="text-xs font-bold text-muted-foreground flex justify-between mb-2">
            <span className="flex items-center gap-1"><DollarSign size={14} className="text-primary"/> Injeção de Dívida (Funding)</span>
            <span className="text-primary font-mono">{formatter.currency(parameters.debtInjection || 0)}</span>
          </label>
          <input 
            type="range" min="0" max="10000000" step="100000" 
            value={parameters.debtInjection || 0} 
            onChange={(e) => handleSlider('debtInjection', e.target.value)}
            className="w-full accent-indigo-600"
          />
        </div>
        
        {/* HEADCOUNT */}
        <div>
          <label className="text-xs font-bold text-muted-foreground flex justify-between mb-2">
            <span>Aumento de Headcount (R$ Mensal)</span>
            <span className="text-amber-600 font-mono">+ {formatter.currency(parameters.headcountAddition || 0)}</span>
          </label>
          <input 
            type="range" min="0" max="2000000" step="50000" 
            value={parameters.headcountAddition || 0} 
            onChange={(e) => handleSlider('headcountAddition', e.target.value)}
            className="w-full accent-amber-500"
          />
        </div>
      </div>
    </div>
  );
}
