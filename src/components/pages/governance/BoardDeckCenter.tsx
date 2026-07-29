import React, { useState } from 'react';
import { Presentation, FileText, History, ShieldCheck, Download, Search, Filter, ChevronRight, CheckCircle2, Clock, BarChart3, FileBarChart } from 'lucide-react';
import { ExecutiveText } from '@/components/ui/executive-typography';
import { ExecutiveHeading } from '@/components/ui/executive-heading';
import { ExecutiveSurface } from '@/components/ui/executive-surface';
import { ExecutiveMetricCard } from '@/components/ui/executive-metric-card';
import { ExecutiveBadge } from '@/components/ui/executive-badge';
import { PageHeader } from '@/components/Common';
import { GenerateBoardReportModal } from '@/components/modals/GenerateBoardReportModal';
import type { Page } from '@/app/navigation';

export interface BoardDeckCenterProps {
  onNavigate?: (page: Page) => void;
  selectedClient?: string;
  selectedYear?: number;
}

export function BoardDeckCenter({ onNavigate, selectedClient = 'demo-client', selectedYear = 2026 }: BoardDeckCenterProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data for metrics
  const metrics = [
    { label: 'Total Decks Gerados', value: '124', icon: FileBarChart, tone: 'info' as const },
    { label: 'Aprovações Pendentes', value: '3', icon: Clock, tone: 'warning' as const },
    { label: 'Decks Assinados', value: '118', icon: CheckCircle2, tone: 'success' as const },
    { label: 'Índice de Conformidade', value: '99.8%', icon: ShieldCheck, tone: 'neutral' as const },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-10 pb-32 animate-executive-fade">
      {/* Premium Header */}
      <div className="relative">
        <PageHeader 
          title="Central de Relatórios do Conselho"
          subtitle="Board Packs auditáveis com rastreabilidade (Lineage Hash) e validade fiduciária garantida por sistema."
          icon={Presentation}
          transparent
          actions={
            <button 
              onClick={() => setIsModalOpen(true)}
              className="btn-executive flex items-center gap-2 group cursor-pointer"
            >
              <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Gerar Novo Board Deck</span>
            </button>
          }
        />
      </div>

      <GenerateBoardReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        clientId={selectedClient}
        companyName="Empresa Selecionada"
        financialData={[]}
        selectedYear={selectedYear}
      />

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-stretch">
        {metrics.map((metric, idx) => (
          <ExecutiveMetricCard
            key={idx}
            label={metric.label}
            value={metric.value}
            tone={metric.tone}
            icon={metric.icon}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          <ExecutiveSurface variant="default" padding="md" className="sticky top-6">
            <ExecutiveHeading as="h3" className="text-muted-foreground mb-4 px-2 flex items-center gap-2">
              <BarChart3 className="w-3.5 h-3.5" /> Categorias
            </ExecutiveHeading>
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
                      ? 'bg-warning-soft text-warning border-warning/20' 
                      : 'text-muted-foreground hover:text-foreground bg-transparent border-transparent hover:bg-muted/10'
                  }`}
                >
                  <span>{item.name}</span>
                  {item.active && <ChevronRight className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </ExecutiveSurface>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative group flex-1 w-full">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
                <Search size={16} strokeWidth={2} />
              </span>
              <input 
                type="text" 
                placeholder="Buscar por mês, decisão ou Lineage Hash..." 
                className="w-full pl-11 pr-4 py-3.5 bg-card border border-border rounded-xl text-sm font-medium text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none placeholder:text-muted-foreground/60"
              />
            </div>
            <button className="btn-secondary px-4 py-3.5 flex items-center gap-2 rounded-xl border border-border hover:border-foreground/20 bg-card text-foreground w-full sm:w-auto justify-center">
              <Filter className="w-4 h-4" />
              <ExecutiveText as="span" variant="caption" className="font-bold uppercase tracking-wider">Filtros</ExecutiveText>
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
              <ExecutiveSurface key={idx} variant="default" padding="md" className="transition-all duration-300">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex items-start gap-5">
                    <div className="p-3.5 bg-muted/20 rounded-xl text-primary border border-border/50 shadow-sm">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <ExecutiveHeading as="h3" className="text-foreground mb-2">{doc.title}</ExecutiveHeading>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs text-muted-foreground flex items-center gap-1.5 bg-muted/20 px-2.5 py-1 rounded-md border border-border/50">
                          <History className="w-3.5 h-3.5" /> {doc.date}
                        </span>
                        <span className="text-[10px] uppercase font-mono font-bold text-foreground bg-muted/20 px-2.5 py-1 rounded-md border border-border flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 
                          <span className="text-muted-foreground">LINEAGE:</span> {doc.hash}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t border-border/40 md:border-none pt-4 md:pt-0 mt-2 md:mt-0">
                    <ExecutiveBadge variant={doc.status === 'Assinado' ? 'success' : 'warning'}>
                      {doc.status}
                    </ExecutiveBadge>
                    <button aria-label="Baixar relatório" className="p-2.5 text-muted-foreground hover:text-primary hover:bg-muted/20 rounded-lg transition-all border border-transparent hover:border-border">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </ExecutiveSurface>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
