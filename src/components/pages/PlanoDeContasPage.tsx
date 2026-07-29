import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Save, UploadCloud, Link2, CheckCircle2, Loader2, Edit2, Trash2, BookOpen, ChevronRight, Sparkles, AlertTriangle, X, List, LayoutGrid } from 'lucide-react';
import { DATA } from '../../data';
import { AccountModal } from '../modals/AccountModal';
import { ImportPlanoModal } from '../modals/ImportPlanoModal';
import { MappingWizard } from '../modals/MappingWizard';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, where, onSnapshot, getDocs, writeBatch, doc, addDoc, updateDoc, deleteDoc, orderBy, serverTimestamp } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../../lib/firebase';
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveAccordion } from '../ui/executive-accordion';
import { ExecutiveEmptyState } from '../ui/executive-empty-state';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';
import { ExecutiveBadge } from '../ui/executive-badge';
import { ExecutiveTechnicalLayer } from '../ui/executive-technical-layer';
import { createPortal } from 'react-dom';
import { ExecutiveSummarySection } from '../ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../ui/executive-decision-trace';
import { usePlanoDeContasPageViewModel } from '../../viewmodels/usePlanoDeContasPageViewModel';

export function PlanoDeContasPage({ 
  clients, 
  selectedClient, 
  planType = 'accounting' 
}: { 
  clients: any[], 
  selectedClient: string, 
  planType?: 'accounting' | 'managerial' 
}) {
  const { state: vmState, computed: vmComputed, actions: vmActions } = usePlanoDeContasPageViewModel({ clientId: selectedClient });
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [editingAccount, setEditingAccount] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const currentClient = clients.find(c => c.id === selectedClient);
  const clientName = currentClient?.fantasia || currentClient?.name || 'Cliente';

  useEffect(() => {
    if (!selectedClient) {
      setAccounts([]);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'plano_de_contas'),
      where('clientId', '==', selectedClient),
      where('planType', '==', planType)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAccounts(docs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching plan:", error);
      setAccounts([]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedClient, planType]);

  const filteredAccounts = accounts.filter(a => 
    (a.name || a.nome || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.code || a.codigo || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ExecutivePageTemplate header={{
      title: planType === 'accounting' ? "Plano de Contas Contábil" : "Plano de Contas Gerencial",
      description: `Estruturação de contas, mapeamento de De-Para e categorização de lançamentos · ${clientName}`,
    }}>
      <div className="space-y-8 pb-24 animate-executive-fade max-w-[1440px] mx-auto">

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsImportModalOpen(true)}
              className="px-4 py-2.5 bg-card border border-border rounded-xl text-xs font-bold text-foreground hover:bg-surface-container transition-all flex items-center gap-2"
            >
              <UploadCloud size={14} /> IMPORTAR PLANO
            </button>
          </div>

          <button 
            onClick={() => { setEditingAccount(null); setIsModalOpen(true); }}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-widest shadow-md hover:scale-105 transition-all flex items-center gap-2"
          >
            <Plus size={16} /> NOVA CONTA
          </button>
        </div>

        {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DE PLANO DE CONTAS) --- */}
        <ExecutiveSummarySection 
          className="mb-8"
          status={{ label: 'Plano Homologado', variant: 'success' }}
          question="Como está estruturado o plano de contas e o mapeamento de KPIs para demonstrativos?"
          opinion="O comitê fiduciário homologa a estrutura do plano de contas, garantindo o correto enquadramento e consistência nos balancetes."
          driver="Contas sintéticas, analíticas, de-para gerencial e mapeamento de DRE/DFC."
          implication="Padronização da escrituração contábil e agilidade no fechamento de ciclos fiduciários."
          action="Manter o de-para de contas atualizado a cada novo lançamento no ERP."
        >
          <ExecutiveStrategicTensions tensions={[]} />
          <ExecutiveDecisionTrace trace={[]} />
        </ExecutiveSummarySection>

        {/* --- CAMADA 2: DIRETORIA & RESUMO DE ESTRUTURA --- */}
        <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm mb-8">
          <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
            <div>
              <ExecutiveHeading as="h3" className="text-foreground">Estrutura de Contas Ativa</ExecutiveHeading>
              <ExecutiveText variant="caption" className="text-muted-foreground">{accounts.length} contas mapeadas no plano {planType === 'accounting' ? 'contábil' : 'gerencial'}.</ExecutiveText>
            </div>
            <ExecutiveBadge variant="info">
              {planType === 'accounting' ? 'Contábil Oficial' : 'Visão Gerencial'}
            </ExecutiveBadge>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div className="relative w-full sm:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Buscar por código ou nome de conta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container border border-border rounded-xl text-xs font-semibold outline-none text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface-container/30 border-b border-border text-muted-foreground font-bold uppercase tracking-wider">
                  <th className="p-4">Código</th>
                  <th className="p-4">Nome da Conta</th>
                  <th className="p-4">Tipo</th>
                  <th className="p-4">Natureza</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredAccounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-surface-container/30 transition-colors">
                    <td className="p-4 font-mono font-bold text-foreground">{acc.code || acc.codigo}</td>
                    <td className="p-4 font-bold text-foreground">{acc.name || acc.nome}</td>
                    <td className="p-4">
                      <ExecutiveBadge variant={acc.type === 'Sintética' ? 'neutral' : 'info'}>
                        {acc.type || 'Analítica'}
                      </ExecutiveBadge>
                    </td>
                    <td className="p-4 font-mono text-muted-foreground">{acc.nature || acc.natureza || 'Devedora'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ExecutiveSurface>

      </div>
    </ExecutivePageTemplate>
  );
}
