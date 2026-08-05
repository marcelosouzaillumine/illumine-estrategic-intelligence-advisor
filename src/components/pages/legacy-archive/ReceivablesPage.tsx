// @ts-nocheck
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Filter, ChevronLeft, ChevronRight, Edit2, Trash2, Loader2, X, TrendingUp, PieChart as PieChartIcon, Save, UploadCloud } from 'lucide-react';
import { ImportTransactionsModal } from '../../modals/ImportTransactionsModal';
import { motion } from 'motion/react';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, where, orderBy, onSnapshot, getDocs, writeBatch } from 'firebase/firestore';
import { createPortal } from 'react-dom';
import { ExecutiveSummarySection } from '../../ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../../ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../../ui/executive-decision-trace';
import { useReceivablesPageViewModel } from '../../../viewmodels/useReceivablesPageViewModel';
import { ExecutiveHeading } from '../../ui/executive-heading';
import { ExecutiveText } from '../../ui/executive-typography';
import { db, auth } from '../../../lib/firebase';
import { ExecutivePageTemplate } from '../../ui/executive-page-template';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveAccordion } from '../../ui/executive-accordion';
import { ExecutiveEmptyState } from '../../ui/executive-empty-state';
import { ExecutiveMetricCard } from '../../ui/executive-metric-card';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveTechnicalLayer } from '../../ui/executive-technical-layer';
import { SortableHeader } from '../../SortableHeader';
import { cn, formatCurrency, formatDate } from '../../../lib/utils';
import { useDataTable } from '../../../hooks/useDataTable';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function ReceivablesPage({ clients, selectedClient, isMaster }: { clients: any[], selectedClient: string, isMaster?: boolean }) {
  const { state: vmState, computed: vmComputed, actions: vmActions } = useReceivablesPageViewModel({ clientId: selectedClient });
  const [receivables, setReceivables] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingReceivable, setEditingReceivable] = useState<any | null>(null);

  const tableData = useMemo(() => 
    receivables.filter(p => !p.cliente?.toLowerCase().includes('total')), 
    [receivables]
  );

  const {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    sort,
    toggleSort,
    currentPage,
    setCurrentPage,
    totalPages,
    filteredData: filteredReceivables,
    paginatedData: paginatedReceivables
  } = useDataTable(tableData, {
    searchFields: ['cliente', 'documento', 'categoria', 'centroCusto'],
    initialSort: { key: 'vencimento', direction: 'asc' as const },
    itemsPerPage: 10
  });

  useEffect(() => {
    if (!selectedClient) {
      setReceivables([]);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'receivables'),
      where('clientId', '==', selectedClient)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() as any }))
        .filter(d => d.status !== 'pending' && d.status !== 'rejected');
      setReceivables(docs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching receivables:", error);
      setReceivables([]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedClient]);

  const kpis = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const date30Days = new Date();
    date30Days.setDate(today.getDate() + 30);
    const date30DaysStr = date30Days.toISOString().split('T')[0];
    
    return receivables.reduce((acc, p) => {
      const valor = Number(p.valor) || 0;
      const valorAberto = Number(p.valorAberto ?? (p.status === 'Recebido' ? 0 : valor)) || 0;
      acc.total += valor;
      
      let status = p.status || '';
      if (status !== 'Recebido') {
        if (p.vencimento && p.vencimento < todayStr) {
          status = 'Em atraso';
        } else {
          status = 'A vencer';
        }
      }

      if (status === 'Recebido') {
        acc.recebido += valor;
      } else if (status === 'Em atraso') {
        acc.emAtraso += valorAberto;
      } else {
        if (p.vencimento && p.vencimento <= date30DaysStr) {
          acc.aVencer30 += valorAberto;
        } else {
          acc.aVencerApos30 += valorAberto;
        }
      }
      
      return acc;
    }, { total: 0, emAtraso: 0, aVencer30: 0, aVencerApos30: 0, recebido: 0 });
  }, [receivables]);

  const clientName = clients.find(c => c.id === selectedClient)?.fantasia || 'Cliente';

  return (
    <ExecutivePageTemplate header={{
      title: "Contas a Receber",
      description: `Gestão centralizada de recebimentos e controle de inadimplência · ${clientName}`,
    }}>
      <div className="space-y-8 pb-24 animate-executive-fade max-w-[1440px] mx-auto">

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsImportModalOpen(true)}
              className="px-4 py-2.5 bg-card border border-border rounded-xl text-xs font-bold text-foreground hover:bg-surface-container transition-all flex items-center gap-2"
            >
              <UploadCloud size={14} /> IMPORTAR
            </button>
          </div>

          <button 
            onClick={() => { setEditingReceivable(null); setIsModalOpen(true); }}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-widest shadow-md hover:scale-105 transition-all flex items-center gap-2"
          >
            <Plus size={16} /> LANÇAR TÍTULO
          </button>
        </div>

        {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DE CONTAS A RECEBER) --- */}
        <ExecutiveSummarySection 
          className="mb-8"
          status={{ label: 'Recebíveis Auditados', variant: 'success' }}
          question="Qual a taxa de inadimplência, volume a receber no mês e liquidação efetiva de clientes?"
          opinion="O comitê fiduciário homologa a carteira de contas a receber, atestando a qualidade dos ativos de crédito e o fluxo de entradas."
          driver="Títulos em atraso, vencimentos em 30 dias, recebíveis futuros e faturamento liquidado."
          implication="Manutenção da liquidez imediata e previsibilidade do FCO."
          executiveQuestion="Acionar régua de cobrança para títulos inadimplentes e reavaliar limites de crédito."
        >
          <ExecutiveStrategicTensions tensions={[]} />
          <ExecutiveDecisionTrace trace={[]} />
        </ExecutiveSummarySection>

        {/* --- CAMADA 2: DIRETORIA & KPIS DE CONTAS A RECEBER --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          <ExecutiveMetricCard
            label="Total em Aberto"
            value={formatCurrency(kpis.aVencer30 + kpis.aVencerApos30 + kpis.emAtraso)}
            statusBadge={<ExecutiveBadge variant="info">Total</ExecutiveBadge>}
            tone="neutral"
            className="bg-card border border-border shadow-sm h-full"
          />

          <ExecutiveMetricCard
            label="Em Atraso"
            value={formatCurrency(kpis.emAtraso)}
            statusBadge={<ExecutiveBadge variant={kpis.emAtraso > 0 ? "critical" : "success"}>{kpis.emAtraso > 0 ? "Inadimplente" : "Adimplente"}</ExecutiveBadge>}
            tone="neutral"
            className="bg-card border border-border shadow-sm h-full"
          />

          <ExecutiveMetricCard
            label="A Vencer (30 dias)"
            value={formatCurrency(kpis.aVencer30)}
            statusBadge={<ExecutiveBadge variant="success">Curto Prazo</ExecutiveBadge>}
            tone="neutral"
            className="bg-card border border-border shadow-sm h-full"
          />

          <ExecutiveMetricCard
            label="Após 30 dias"
            value={formatCurrency(kpis.aVencerApos30)}
            statusBadge={<ExecutiveBadge variant="neutral">Longo Prazo</ExecutiveBadge>}
            tone="neutral"
            className="bg-card border border-border shadow-sm h-full"
          />

          <ExecutiveMetricCard
            label="Total Recebido"
            value={formatCurrency(kpis.recebido)}
            statusBadge={<ExecutiveBadge variant="success">Efetivado</ExecutiveBadge>}
            tone="neutral"
            className="bg-card border border-border shadow-sm h-full"
          />
        </div>

        {/* --- CAMADA 3: CAMADA TÉCNICA E REGISTRO DE RECEBÍVEIS --- */}
        <ExecutiveTechnicalLayer
          title="Camada Técnica de Recebíveis"
          subtitle="Tabela Analítica de Títulos a Receber"
          description="Filtro, busca, baixa de títulos e acompanhamento por cliente."
          className="mb-8"
        >
          <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Buscar cliente, documento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-container border border-border rounded-xl text-xs font-semibold outline-none text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <span className="text-xs text-muted-foreground font-bold">{filteredReceivables.length} Títulos Registrados</span>
            </div>

            <div className="overflow-x-auto border border-border rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-surface-container/30 border-b border-border text-muted-foreground font-bold uppercase tracking-wider">
                    <th className="p-4">Cliente</th>
                    <th className="p-4">Documento</th>
                    <th className="p-4">Vencimento</th>
                    <th className="p-4 text-right">Valor</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedReceivables.map((p) => (
                    <tr key={p.id} className="hover:bg-surface-container/30 transition-colors">
                      <td className="p-4 font-bold text-foreground">{p.cliente}</td>
                      <td className="p-4 font-mono text-muted-foreground">{p.documento || '---'}</td>
                      <td className="p-4 font-mono text-muted-foreground">{formatDate(p.vencimento)}</td>
                      <td className="p-4 text-right font-mono font-bold text-foreground">{formatCurrency(p.valor)}</td>
                      <td className="p-4">
                        <ExecutiveBadge variant={p.status === 'Recebido' ? 'success' : p.vencimento < new Date().toISOString().split('T')[0] ? 'critical' : 'info'}>
                          {p.status || 'A Vencer'}
                        </ExecutiveBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ExecutiveSurface>
        </ExecutiveTechnicalLayer>

      </div>
    </ExecutivePageTemplate>
  );
}
