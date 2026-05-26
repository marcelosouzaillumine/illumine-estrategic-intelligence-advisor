import React from 'react';
import { Presentation, FileText, History, ShieldCheck, Download, Search } from 'lucide-react';
import { PageHeader } from '../../Common';

export function BoardDeckCenter() {
  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-12 pb-32 animate-executive-fade">
      {/* Cabeçalho */}
      <PageHeader 
        title="Central de Relatórios do Conselho"
        subtitle="Board Packs auditáveis, com rastreabilidade (Lineage Hash) e validade fiduciária."
        icon={Presentation}
        transparent
        actions={
          <button className="btn-executive flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Gerar Novo Board Deck
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Menu Lateral de Categorias */}
        <div className="space-y-2">
          <h3 className="text-[10px] uppercase tracking-widest font-black text-slate-500 mb-4 px-3">Categorias</h3>
          {['Board Packs Mensais', 'Fiduciary Snapshots', 'Atas e Reuniões', 'Executive Narratives', 'Decision Attachments', 'Histórico de Auditoria'].map((item, idx) => (
            <div 
              key={idx} 
              className={`px-4 py-3 rounded-xl cursor-pointer text-xs font-bold uppercase tracking-wider transition-all border ${
                idx === 0 
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                  : 'text-slate-400 hover:text-slate-200 bg-transparent border-transparent hover:bg-slate-900/50'
              }`}
            >
              {item}
            </div>
          ))}
        </div>

        {/* Área Principal de Arquivos */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Busca */}
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-secondary transition-colors">
              <Search size={16} strokeWidth={2} />
            </span>
            <input 
              type="text" 
              placeholder="Buscar por mês, decisão ou Lineage Hash..." 
              className="w-full pl-11 pr-4 py-3 bg-surface-container/40 border border-border rounded-button text-xs font-bold text-foreground focus:border-secondary transition-all outline-none placeholder:text-muted-foreground/30 placeholder:font-bold placeholder:uppercase placeholder:tracking-wider"
            />
          </div>

          {/* Lista de Decks Recentes (Mock UI) */}
          <div className="space-y-4">
            {[
              { title: 'Board Deck - Consolidação Q3 2026', date: 'Hoje, 09:00', hash: 'Lx9A-1b', status: 'Assinado' },
              { title: 'Fiduciary Snapshot - Aprovação M&A', date: 'Ontem, 16:45', hash: 'Fx88-2c', status: 'Pendente' },
              { title: 'Executive Narrative - Gestão de Risco', date: '12 Maio 2026', hash: 'Nx77-3d', status: 'Assinado' },
            ].map((doc, idx) => (
              <div key={idx} className="card-premium p-6 hover:border-slate-700 transition-all flex justify-between items-center group">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-800/40 rounded-xl text-slate-300 border border-border/10">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-slate-200 font-medium text-sm md:text-base">{doc.title}</h3>
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
                  <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
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
