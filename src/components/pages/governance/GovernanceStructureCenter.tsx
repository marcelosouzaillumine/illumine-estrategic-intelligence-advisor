import React from 'react';
import { Users, Building2, Network, ShieldCheck, UserX, UserCheck } from 'lucide-react';

export function GovernanceStructureCenter() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Cabeçalho */}
      <div className="border-b border-slate-800 pb-6 mb-8">
        <h1 className="text-3xl font-light text-slate-100 tracking-tight flex items-center gap-3">
          <Users className="w-8 h-8 text-teal-500" />
          Estrutura Institucional de Governança
        </h1>
        <p className="text-slate-400 mt-2">
          Avaliação de organograma, segregação de funções (SoD), cadeias de autoridade e composição de comitês.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Painel Principal: Organograma e Comitês */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-slate-200 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-teal-400" />
                Cadeia de Autoridade Fiduciária
              </h2>
              <button className="text-sm text-teal-400 hover:text-teal-300 transition-colors">Expandir Visão</button>
            </div>
            
            <div className="aspect-video bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center relative">
               <div className="text-center">
                  <Network className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">Organograma Dinâmico Renderizado Aqui</p>
               </div>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-medium text-slate-200 mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-400" />
              Comitês de Assessoramento
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Comitê de Auditoria e Riscos', 'Comitê de Pessoas e Cultura', 'Comitê de Inovação', 'Comitê ESG e Ética'].map((comite, idx) => (
                <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-lg flex items-start gap-3">
                  <div className="p-2 bg-slate-800 rounded text-slate-400">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-200">{comite}</h3>
                    <p className="text-xs text-slate-500 mt-1">3 Membros • Ativo</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Sidebar de Gaps e Avaliação */}
        <div className="space-y-6">
          
          {/* Card de Avaliação de Segregação (SoD) */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Segregação de Funções (SoD)
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <UserCheck className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-slate-200">Aprovação vs Execução</h4>
                  <p className="text-xs text-slate-500">Nenhum diretor executa e aprova o mesmo orçamento.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <UserX className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-slate-200">Gaps Identificados (1)</h4>
                  <p className="text-xs text-slate-500 mt-1 p-2 bg-amber-500/10 rounded border border-amber-500/20 text-amber-400">
                    O CFO atual acumula a diretoria de Relações com Investidores. Risco de conflito.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Composição do Conselho */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Composição do Board
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Independentes</span>
                <span className="font-medium text-slate-200">3 (60%)</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[60%]"></div>
              </div>
              
              <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-800">
                <span className="text-slate-400">Membros Familiares</span>
                <span className="font-medium text-slate-200">2 (40%)</span>
              </div>
              
              <div className="mt-4 p-3 bg-slate-950 border border-slate-800 rounded text-xs text-slate-400 text-center">
                Aderente às práticas do IBGC para conselhos não listados.
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
