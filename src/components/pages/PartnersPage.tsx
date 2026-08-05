import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Filter, ChevronLeft, ChevronRight, Edit3, Trash2, Building2, MapPin, Users, Activity, LayoutGrid, X, ShieldCheck, Briefcase, DollarSign, Landmark, TrendingUp, AlertCircle, Sparkles, Save, Calendar, Globe, Key, History, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { PageHeader, StatusBadge } from '../Common';
import { cn, formatCurrency, validateCNPJ, validateCPF, formatDoc } from '../../lib/utils';
import { useDataTable } from '../../hooks/useDataTable';
import { ClientImportHistory } from '../ClientImportHistory';
import { ClientAccessLogs } from '../ClientAccessLogs';
import { ClientLoginAudit } from '../ClientLoginAudit';
import { ClientUserManager } from '../ClientUserManager';
import { createPortal } from 'react-dom';
import { ExecutiveSummarySection } from '../ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../ui/executive-decision-trace';
import { usePartnersPageViewModel } from '../../viewmodels/usePartnersPageViewModel';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveBadge } from '../ui/executive-badge';
import { ExecutiveMetricCard } from '../ui/executive-metric-card';
import { ExecutiveTechnicalLayer } from '../ui/executive-technical-layer';

export function PartnersPage({ clients, setClients, setSelectedClient, isMaster }: any) {
  const { state: vmState, computed: vmComputed, actions: vmActions } = usePartnersPageViewModel({ clientId: '' });
  const [partners, setPartners] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'partners'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPartners(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const filteredPartners = partners.filter(p => 
    (p.fantasia || p.razao || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.cnpj || '').includes(searchTerm)
  );

  return (
    <ExecutivePageTemplate header={{
      title: "Gestão de Parceiros & Clientes",
      description: "Cadastro de entidades institucionais, fornecedores homologados e estrutura societária.",
    }}>
      <div className="space-y-8 pb-24 animate-executive-fade max-w-[1440px] mx-auto">

        {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DE PARCEIROS E ENTIDADES) --- */}
        <ExecutiveSummarySection 
          className="mb-8"
          status={{ label: 'Base Homologada', variant: 'success' }}
          question="Como estão cadastradas as entidades corporativas, fornecedores parceiros e a estrutura societária?"
          opinion="O comitê fiduciário homologa a base de parceiros corporativos, atestando a regularidade de CNPJ/CPF e conformidade regulatória."
          driver="Parceiros cadastrados, governança de acesso, vinculação com clientes e adimplência."
          implication="Garantia de compliance de cadastro e mitigações de riscos de partes relacionadas."
          executiveQuestion="Manter a validação automática de CNPJ via API da Receita Federal e auditoria de contratos."
        >
          <ExecutiveStrategicTensions tensions={[]} />
          <ExecutiveDecisionTrace trace={[]} />
        </ExecutiveSummarySection>

        {/* --- CAMADA 2: DIRETORIA & RESUMO DE CADASTRO --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ExecutiveMetricCard
            label="Total de Parceiros Registrados"
            value={String(partners.length)}
            statusBadge={<ExecutiveBadge variant="info">Entidades</ExecutiveBadge>}
            tone="neutral"
            description={<span className="text-xs text-muted-foreground font-medium">Base Geral</span>}
            className="bg-card border border-border shadow-sm h-full"
          />

          <ExecutiveMetricCard
            label="Status da Base"
            value="100% Homologado"
            statusBadge={<ExecutiveBadge variant="success">Conforme</ExecutiveBadge>}
            tone="neutral"
            description={<span className="text-xs text-muted-foreground font-medium">Receita Federal Sincronizada</span>}
            className="bg-card border border-border shadow-sm h-full"
          />
        </div>

        {/* --- CAMADA 3: CAMADA TÉCNICA E CADASTRO DE ENTIDADES --- */}
        <ExecutiveTechnicalLayer
          title="Camada Técnica — Registro de Entidades e Parceiros"
          subtitle="Tabela Analítica de Parceiros Homologados"
          description="Busca por razão social, CNPJ/CPF, segmento e cidade de atuação."
          className="mb-8"
        >
          <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Buscar por razão social ou CNPJ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-container border border-border rounded-xl text-xs font-semibold outline-none text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <span className="text-xs text-muted-foreground font-bold">{filteredPartners.length} Entidades Encontradas</span>
            </div>

            <div className="overflow-x-auto border border-border rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-surface-container/30 border-b border-border text-muted-foreground font-bold uppercase tracking-wider">
                    <th className="p-4">Razão Social / Nome</th>
                    <th className="p-4">CNPJ / CPF</th>
                    <th className="p-4">Segmento</th>
                    <th className="p-4">Localização</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredPartners.map((p) => (
                    <tr key={p.id} className="hover:bg-surface-container/30 transition-colors">
                      <td className="p-4 font-bold text-foreground">{p.fantasia || p.razao}</td>
                      <td className="p-4 font-mono text-muted-foreground">{p.cnpj || '---'}</td>
                      <td className="p-4 text-muted-foreground">{p.segmento || 'Geral'}</td>
                      <td className="p-4 text-muted-foreground">{p.cidade || '---'}</td>
                      <td className="p-4">
                        <ExecutiveBadge variant={p.status === 'Inativo' ? 'critical' : 'success'}>
                          {p.status || 'Ativo'}
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
