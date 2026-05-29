// src/components/war-gaming/CrisisScenarioPanel.tsx

import React, { useState } from 'react';
import { CrisisInput, CrisisType } from '../../core/runtime/war-gaming/war-gaming-types';

export function CrisisScenarioPanel({ onSimulate }: { onSimulate: (inputs: CrisisInput[]) => void }) {
  const [magnitude, setMagnitude] = useState<number>(45);
  const [type, setType] = useState<CrisisType>('REVENUE_COMPRESSION');

  const handleSimulate = () => {
    const inputs: CrisisInput[] = [{
      id: `CR-${Date.now()}`,
      type,
      description: 'Simulação de compressão',
      magnitude: magnitude / 100,
      targetVariable: type === 'REVENUE_COMPRESSION' ? 'Receita Líquida' : 'Variável Genérica',
      durationMonths: 12
    }];
    onSimulate(inputs);
  };

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
      <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest mb-6 border-b border-slate-100 pb-2">Configuração de Crise</h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Vetor de Choque</label>
          <select 
            className="w-full bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 rounded-lg p-3 outline-none focus:border-slate-400"
            value={type}
            onChange={(e) => setType(e.target.value as CrisisType)}
          >
            <option value="REVENUE_COMPRESSION">Compressão de Receita</option>
            <option value="SUPPLIER_SHOCK">Choque de Fornecedores</option>
            <option value="TREASURY_COLLAPSE">Colapso de Tesouraria</option>
            <option value="MARGIN_COLLAPSE">Colapso de Margem</option>
            <option value="CAPITAL_DRAIN">Drenagem de Capital</option>
          </select>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Magnitude Estrutural</label>
            <span className="text-xs font-black text-rose-600">-{magnitude}%</span>
          </div>
          <input 
            type="range" 
            min="5" 
            max="100" 
            step="5"
            value={magnitude}
            onChange={(e) => setMagnitude(Number(e.target.value))}
            className="w-full accent-rose-600"
          />
        </div>

        <button 
          onClick={handleSimulate}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-widest py-4 rounded-xl transition-colors"
        >
          Executar War Game
        </button>
      </div>
    </div>
  );
}
