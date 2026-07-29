import React, { useState, useEffect } from 'react';
import { FileText, Plus, Search, Calendar, Users, Clock, ChevronRight, MoreHorizontal, Trash2, Edit3, Download, ChevronLeft, Save, X, AlertCircle, CheckCircle2, Briefcase, MapPin, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, where, getDocs, addDoc, serverTimestamp, updateDoc, doc, deleteDoc, orderBy, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { PageHeader, StatusBadge } from '../Common';
import { createPortal } from 'react-dom';
import { ExecutiveSummarySection } from '../ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../ui/executive-decision-trace';
import { useMeetingMinutesPageViewModel } from '../../viewmodels/useMeetingMinutesPageViewModel';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { ExecutiveAccordion } from '../ui/executive-accordion';
import { ExecutiveEmptyState } from '../ui/executive-empty-state';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveMetricCard } from '../ui/executive-metric-card';
import { ExecutiveBadge } from '../ui/executive-badge';
import { ExecutiveTechnicalLayer } from '../ui/executive-technical-layer';
import { cn } from '../../lib/utils';

export function MeetingMinutesPage({ clientId }: { clientId: string }) {
  const { state: vmState, computed: vmComputed, actions: vmActions } = useMeetingMinutesPageViewModel({ clientId });
  const [minutes, setMinutes] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!clientId) return;

    const q = query(
      collection(db, 'meeting_minutes'),
      where('clientId', '==', clientId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMinutes(data);
    });

    return () => unsubscribe();
  }, [clientId]);

  const filteredMinutes = minutes.filter(m => 
    (m.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.objective || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ExecutivePageTemplate header={{
      title: "Atas de Reunião de Conselho",
      description: "Registro de deliberações fiduciárias, plano de ação e rastreabilidade de decisões.",
    }}>
      <div className="space-y-8 pb-24 animate-executive-fade max-w-[1440px] mx-auto">

        {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DE DELIBERAÇÕES) --- */}
        <ExecutiveSummarySection 
          className="mb-8"
          status={{ label: 'Atas Auditadas', variant: 'success' }}
          question="Quais as principais deliberações registradas em atas do conselho e o status dos planos de ação?"
          opinion="O comitê fiduciário homologa os registros de atas e resoluções do conselho de administração, validando a execução dos planos de ação."
          driver="Deliberações formais, encaminhamentos operacionais, responsáveis e prazos de cumprimento."
          implication="Garantia de segurança jurídica, governança corporativa transparente e responsabilização fiduciária."
          action="Acompanhar o cumprimento das tarefas encaminhadas nas reuniões de diretoria e conselho."
        >
          <ExecutiveStrategicTensions tensions={[]} />
          <ExecutiveDecisionTrace trace={[]} />
        </ExecutiveSummarySection>

        {/* --- CAMADA 2: DIRETORIA & KPIS DE REUNIÃO --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ExecutiveMetricCard
            label="Total de Atas Registradas"
            value={String(minutes.length)}
            statusBadge={<ExecutiveBadge variant="info">Livro de Atas</ExecutiveBadge>}
            tone="neutral"
            description={<span className="text-xs text-muted-foreground font-medium">Deliberações Oficiais</span>}
            className="bg-card border border-border shadow-sm h-full"
          />

          <ExecutiveMetricCard
            label="Status de Homologação"
            value="Conforme"
            statusBadge={<ExecutiveBadge variant="success">Assinaturas Válidas</ExecutiveBadge>}
            tone="neutral"
            description={<span className="text-xs text-muted-foreground font-medium">Compliance Fiduciário</span>}
            className="bg-card border border-border shadow-sm h-full"
          />
        </div>

        {/* --- CAMADA 3: CAMADA TÉCNICA E LIVRO DE ATAS --- */}
        <ExecutiveTechnicalLayer
          title="Camada Técnica — Livro Eletrônico de Atas"
          subtitle="Tabela Analítica de Reuniões e Resoluções"
          description="Rastreabilidade de pauta, participantes e planos de ação deliberados."
          className="mb-8"
        >
          <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Buscar atas por título ou objetivo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-container border border-border rounded-xl text-xs font-semibold outline-none text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <span className="text-xs text-muted-foreground font-bold">{filteredMinutes.length} Atas Registradas</span>
            </div>

            <div className="overflow-x-auto border border-border rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-surface-container/30 border-b border-border text-muted-foreground font-bold uppercase tracking-wider">
                    <th className="p-4">Data</th>
                    <th className="p-4">Título da Reunião</th>
                    <th className="p-4">Local / Canal</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredMinutes.map((m) => (
                    <tr key={m.id} className="hover:bg-surface-container/30 transition-colors">
                      <td className="p-4 font-mono text-muted-foreground">{m.date}</td>
                      <td className="p-4 font-bold text-foreground">{m.title}</td>
                      <td className="p-4 text-muted-foreground">{m.location || 'Remoto'}</td>
                      <td className="p-4">
                        <ExecutiveBadge variant={m.status === 'Finalized' ? 'success' : 'warning'}>
                          {m.status === 'Finalized' ? 'Finalizada' : 'Rascunho'}
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
