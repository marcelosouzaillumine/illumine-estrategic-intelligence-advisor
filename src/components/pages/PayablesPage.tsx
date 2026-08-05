import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Filter, ChevronLeft, ChevronRight, Edit2, Trash2, Loader2, X, TrendingUp, PieChart as PieChartIcon, Save, UploadCloud } from 'lucide-react';
import { ImportTransactionsModal } from '../modals/ImportTransactionsModal';
import { motion } from 'motion/react';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, where, orderBy, onSnapshot, getDocs, writeBatch } from 'firebase/firestore';
import { createPortal } from 'react-dom';
import { ExecutiveSummarySection } from '../ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../ui/executive-decision-trace';
import { usePayablesPageViewModel } from '../../viewmodels/usePayablesPageViewModel';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';
import { db, auth } from '../../lib/firebase';
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveAccordion } from '../ui/executive-accordion';
import { ExecutiveEmptyState } from '../ui/executive-empty-state';
import { ExecutiveMetricCard } from '../ui/executive-metric-card';
import { ExecutiveBadge } from '../ui/executive-badge';
import { ExecutiveTechnicalLayer } from '../ui/executive-technical-layer';
import { SortableHeader } from '../SortableHeader';
import { cn, formatCurrency, formatDate } from '../../lib/utils';
import { useDataTable } from '../../hooks/useDataTable';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function PayablesPage({ clients, selectedClient, isMaster }: { clients: any[], selectedClient: string, isMaster?: boolean }) {
  const { state: vmState, computed: vmComputed, actions: vmActions } = usePayablesPageViewModel({ clientId: selectedClient });
  const [payables, setPayables] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingPayable, setEditingPayable] = useState<any | null>(null);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  const tableData = useMemo(() => 
    payables.filter(p => !p.fornecedor?.toLowerCase().includes('total')), 
    [payables]
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
    filteredData: filteredPayables,
    paginatedData: paginatedPayables
  } = useDataTable(tableData, {
    searchFields: ['fornecedor', 'documento', 'categoria', 'centroCusto'],
    initialSort: { key: 'vencimento', direction: 'asc' as const },
    itemsPerPage: 10
  });

  useEffect(() => {
    if (!selectedClient) {
      setPayables([]);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'payables'),
      where('clientId', '==', selectedClient)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() as any }))
        .filter(d => d.status !== 'pending' && d.status !== 'rejected');
      setPayables(docs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching payables:", error);
      setPayables([]);
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
    
    return payables.reduce((acc, p) => {
      const valor = Number(p.valor) || 0;
      const valorAberto = Number(p.valorAberto ?? (p.status === 'Pago' ? 0 : valor)) || 0;
      acc.total += valor;
      
      let status = p.status || '';
      if (status !== 'Pago') {
        if (p.vencimento && p.vencimento < todayStr) {
          status = 'Em atraso';
        } else {
          status = 'A vencer';
        }
      }

      if (status === 'Pago') {
        acc.pago += valor;
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
    }, { total: 0, emAtraso: 0, aVencer30: 0, aVencerApos30: 0, pago: 0 });
  }, [payables]);

  const clientName = clients.find(c => c.id === selectedClient)?.fantasia || 'Cliente';

  return (
    <ExecutivePageTemplate header={{
      title: "Contas a Pagar",
      description: `Gestão centralizada de obrigações de saída e análise de fornecedores · ${clientName}`,
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
            onClick={() => { setEditingPayable(null); setIsModalOpen(true); }}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-widest shadow-md hover:scale-105 transition-all flex items-center gap-2"
          >
            <Plus size={16} /> LANÇAR TÍTULO
          </button>
        </div>

        {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DE CONTAS A PAGAR) --- */}
        <ExecutiveSummarySection 
          className="mb-8"
          status={{ label: 'Passivos Auditados', variant: 'success' }}
          question="Qual o montante total de obrigações a vencer, taxa de inadimplência e compromissos do mês?"
          opinion="O comitê fiduciário homologa a posição de contas a pagar, registrando controle rigoroso das saídas operacionais e prazos de fornecedores."
          driver="Montante em atraso, vencimentos em 30 dias, obrigações de longo prazo e pagamentos efetuados."
          implication="Manutenção do rating de crédito com fornecedores e preservação do capital de giro."
          executiveQuestion="Negociar prorrogação de títulos em atraso e otimizar prazos médios de pagamento (PMP)."
        >
          <ExecutiveStrategicTensions tensions={[]} />
          <ExecutiveDecisionTrace trace={[]} />
        </ExecutiveSummarySection>

        {/* --- CAMADA 2: DIRETORIA & KPIS DE CONTAS A PAGAR --- */}
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
            statusBadge={<ExecutiveBadge variant={kpis.emAtraso > 0 ? "critical" : "success"}>{kpis.emAtraso > 0 ? "Atrasado" : "Regular"}</ExecutiveBadge>}
            tone="neutral"
            className="bg-card border border-border shadow-sm h-full"
          />

          <ExecutiveMetricCard
            label="A Vencer (30 dias)"
            value={formatCurrency(kpis.aVencer30)}
            statusBadge={<ExecutiveBadge variant="warning">Curto Prazo</ExecutiveBadge>}
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
            label="Total Pago"
            value={formatCurrency(kpis.pago)}
            statusBadge={<ExecutiveBadge variant="success">Liquidado</ExecutiveBadge>}
            tone="neutral"
            className="bg-card border border-border shadow-sm h-full"
          />
        </div>

        {/* --- CAMADA 3: CAMADA TÉCNICA E REGISTRO DE TÍTULOS --- */}
        <ExecutiveTechnicalLayer
          title="Camada Técnica de Títulos a Pagar"
          subtitle="Tabela Analítica de Obrigações e Fornecedores"
          description="Filtro, busca, liquidação individual e rastreio por centro de custo."
          className="mb-8"
        >
          <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Buscar fornecedor, documento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-container border border-border rounded-xl text-xs font-semibold outline-none text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <span className="text-xs text-muted-foreground font-bold">{filteredPayables.length} Títulos Registrados</span>
            </div>

            <div className="overflow-x-auto border border-border rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-surface-container/30 border-b border-border text-muted-foreground font-bold uppercase tracking-wider">
                    <th className="p-4">Fornecedor</th>
                    <th className="p-4">Documento</th>
                    <th className="p-4">Vencimento</th>
                    <th className="p-4 text-right">Valor</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedPayables.map((p) => (
                    <tr key={p.id} className="hover:bg-surface-container/30 transition-colors">
                      <td className="p-4 font-bold text-foreground">{p.fornecedor}</td>
                      <td className="p-4 font-mono text-muted-foreground">{p.documento || '---'}</td>
                      <td className="p-4 font-mono text-muted-foreground">{formatDate(p.vencimento)}</td>
                      <td className="p-4 text-right font-mono font-bold text-foreground">{formatCurrency(p.valor)}</td>
                      <td className="p-4">
                        <ExecutiveBadge variant={p.status === 'Pago' ? 'success' : p.vencimento < new Date().toISOString().split('T')[0] ? 'critical' : 'warning'}>
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
