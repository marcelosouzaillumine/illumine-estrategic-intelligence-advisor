import React from 'react';
import { Presentation, FileText, History, ShieldCheck, Download, Search, Filter, ChevronRight, CheckCircle2, Clock, BarChart3, FileBarChart } from 'lucide-react';
import { PageHeader } from '../../Common';
import type { Page } from '../../../app/navigation';

export interface BoardDeckCenterProps {
  onNavigate?: (page: Page) => void;
}

export function BoardDeckCenter({ onNavigate }: BoardDeckCenterProps) {
  // Mock data for metrics
  const metrics = [
    { label: 'Total Decks Gerados', value: '124', icon: FileBarChart, color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { label: 'Aprovações Pendentes', value: '3', icon: Clock, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { label: 'Decks Assinados', value: '118', icon: CheckCircle2, color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { label: 'Índice de Conformidade', value: '99.8%', icon: ShieldCheck, color: 'text-primary dark:text-primary', bg: 'bg-primary', border: 'border-primary' },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-10 pb-32 animate-executive-fade">
      {/* Premium Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent blur-3xl -z-10 rounded-full" />
        <PageHeader 
          title="Central de Relatórios do Conselho"
          subtitle="Board Packs auditáveis com rastreabilidade (Lineage Hash) e validade fiduciária garantida por sistema."
          icon={Presentation}
          transparent
          actions={
            <button className="btn-executive flex items-center gap-2 group">
              <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Gerar Novo Board Deck</span>
            </button>
          }
        />
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4 items-stretch">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className="card-premium p-5 flex items-center gap-5 group hover:-translate-y-1 transition-all duration-300 h-full">
              <div className={`p-4 rounded-xl ${metric.bg} ${metric.color} ${metric.border} border group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{metric.label}</p>
                <div className="text-2xl font-light text-foreground tracking-tight">{metric.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          <div className="card-premium p-4 sticky top-6">
            <h3 className="text-[10px] uppercase tracking-widest font-black text-muted-foreground mb-4 px-2 flex items-center gap-2">
              <BarChart3 className="w-3 h-3" /> Categorias
            </h3>
            <div className="space-y-1">
              {[
                { name: 'Board Packs Mensais', page: 'board_deck_center', active: true },
                { name: 'Fiduciary Snapshots', page: 'fiduciary_governance_center', active: false },
                { name: 'Atas e Reuniões', page: 'atas_reuniao', active: false },
                { name: 'Executive Narratives', page: null, active: false },
                { name: 'Decision Attachments', page: null, active: false },
                { name: 'Histórico de Auditoria', page: 'observability_console', active: false },
              ].map((item, idx) => (
                <button 
                  key={idx} 
                  onClick={() => {
                    if (item.page && onNavigate) {
                      onNavigate(item.page as Page);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border group ${
                    item.active 
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 shadow-glow-amber' 
                      : 'text-muted-foreground hover:text-foreground bg-transparent border-transparent hover:bg-surface-container'
                  }`}
                >
                  <span>{item.name}</span>
                  {item.active && <ChevronRight className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative group flex-1 w-full">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-amber-500 transition-colors">
                <Search size={16} strokeWidth={2} />
              </span>
              <input 
                type="text" 
                placeholder="Buscar por mês, decisão ou Lineage Hash..." 
                className="w-full pl-11 pr-4 py-3.5 bg-surface-container/50 border border-border rounded-xl text-sm font-medium text-foreground focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all outline-none placeholder:text-muted-foreground/60"
              />
            </div>
            <button className="btn-secondary px-4 py-3.5 flex items-center gap-2 rounded-xl border border-border hover:border-foreground/20 bg-surface-container/50 text-foreground w-full sm:w-auto justify-center">
              <Filter className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Filtros</span>
            </button>
          </div>

          {/* List of Decks */}
          <div className="space-y-4">
            {[
              { title: 'Board Deck - Consolidação Q3 2026', date: 'Hoje, 09:00', hash: 'Lx9A-1b', status: 'Assinado', type: 'deck' },
              { title: 'Fiduciary Snapshot - Aprovação M&A', date: 'Ontem, 16:45', hash: 'Fx88-2c', status: 'Pendente', type: 'snapshot' },
              { title: 'Executive Narrative - Gestão de Risco', date: '12 Maio 2026', hash: 'Nx77-3d', status: 'Assinado', type: 'narrative' },
              { title: 'Board Deck - Consolidação Q2 2026', date: '01 Abr 2026', hash: 'Qx22-9p', status: 'Assinado', type: 'deck' },
            ].map((doc, idx) => (
              <div key={idx} className="card-premium p-1 relative overflow-hidden group hover:border-border transition-all duration-300">
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/0 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="bg-surface/80 backdrop-blur-xl rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                  <div className="flex items-start gap-5">
                    <div className="p-3.5 bg-surface-container rounded-xl text-secondary border border-border/50 shadow-sm group-hover:border-amber-500/30 group-hover:text-amber-500 transition-colors">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-foreground font-semibold text-base mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{doc.title}</h3>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs text-muted-foreground flex items-center gap-1.5 bg-surface-container/50 px-2.5 py-1 rounded-md border border-border/50">
                          <History className="w-3.5 h-3.5" /> {doc.date}
                        </span>
                        <span className="text-[10px] uppercase font-mono font-bold text-foreground bg-surface-container px-2.5 py-1 rounded-md border border-border flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 
                          <span className="text-muted-foreground">LINEAGE:</span> {doc.hash}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t border-border md:border-none pt-4 md:pt-0 mt-2 md:mt-0">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5 ${
                      doc.status === 'Assinado' 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    }`}>
                      {doc.status === 'Assinado' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      {doc.status}
                    </span>
                    <button className="p-2.5 text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-all border border-transparent hover:border-amber-500/20 focus:outline-none">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
