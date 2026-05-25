import React from 'react';
import { Presentation, FileText, History, ShieldCheck, Download, Search } from 'lucide-react';

export function BoardDeckCenter() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex justify-between items-end border-b border-slate-800 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-light text-slate-100 tracking-tight flex items-center gap-3">
            <Presentation className="w-8 h-8 text-amber-500" />
            Central de Relatórios do Conselho
          </h1>
          <p className="text-slate-400 mt-2">
            Board Packs auditáveis, com rastreabilidade (Lineage Hash) e validade fiduciária.
          </p>
        </div>
        <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Gerar Novo Board Deck
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Menu Lateral de Categorias */}
        <div className="space-y-2">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-4 px-3">Categorias</h3>
          {['Board Packs Mensais', 'Fiduciary Snapshots', 'Atas e Reuniões', 'Executive Narratives', 'Decision Attachments', 'Histórico de Auditoria'].map((item, idx) => (
            <div key={idx} className={`px-4 py-3 rounded-lg cursor-pointer text-sm font-medium transition-colors ${idx === 0 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
              {item}
            </div>
          ))}
        </div>

        {/* Área Principal de Arquivos */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Busca */}
          <div className="relative">
            <Search className="w-5 h-5 text-slate-500 absolute left-4 top-3" />
            <input 
              type="text" 
              placeholder="Buscar por mês, decisão ou Lineage Hash..." 
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Lista de Decks Recentes (Mock UI) */}
          <div className="space-y-3">
            {[
              { title: 'Board Deck - Consolidação Q3 2026', date: 'Hoje, 09:00', hash: 'Lx9A-1b', status: 'Assinado' },
              { title: 'Fiduciary Snapshot - Aprovação M&A', date: 'Ontem, 16:45', hash: 'Fx88-2c', status: 'Pendente' },
              { title: 'Executive Narrative - Gestão de Risco', date: '12 Maio 2026', hash: 'Nx77-3d', status: 'Assinado' },
            ].map((doc, idx) => (
              <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 hover:border-slate-600 transition-all flex justify-between items-center group">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-800 rounded-lg text-slate-300">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-slate-200 font-medium">{doc.title}</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <History className="w-3 h-3" /> {doc.date}
                      </span>
                      <span className="text-[10px] uppercase font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-500" /> 
                        Lineage: {doc.hash}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${doc.status === 'Assinado' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                    {doc.status}
                  </span>
                  <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
