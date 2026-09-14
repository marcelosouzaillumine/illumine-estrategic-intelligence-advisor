import React, { useState, useEffect } from 'react';
import { PageHeader, StatusBadge } from '../../../../components/Common';
import { User, Mail, Shield, Key, Camera, Building, CheckCircle2, AlertCircle, ChevronRight, LogOut, Activity, Save, X, Loader2, RefreshCw, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, getThemeColors } from '../../../../lib/utils';
import { useProfileAdapter } from '../../../../adapters/ui/useProfileAdapter';
import { ExecutivePageTemplate } from '../../../../components/ui/executive-page-template';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveAccordion } from '../../../../components/ui/executive-accordion';
import { ExecutiveEmptyState } from '../../../../components/ui/executive-empty-state';
import { ExecutiveHeading } from '../../../../components/ui/executive-heading';
import { ExecutiveText } from '../../../../components/ui/executive-typography';
import { ExecutiveBadge } from '../../../../components/ui/executive-badge';
import { ExecutiveMetricCard } from '../../../../components/ui/executive-metric-card';
import { ExecutiveSummarySection } from '../../../../components/ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../../../../components/ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../../../../components/ui/executive-decision-trace';
import { ExecutiveTechnicalLayer } from '../../../../components/ui/executive-technical-layer';
import { useProfilePageViewModel } from '../../../../viewmodels/useProfilePageViewModel';

interface ProfilePageProps {
  user: any | null;
  clients?: any[];
  selectedClient?: string;
}

export function ProfilePage({ user, clients = [], selectedClient = '' }: ProfilePageProps) {
  const { state: vmState, computed: vmComputed, actions: vmActions } = useProfilePageViewModel({ clientId: selectedClient });
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');

  const isMaster = Boolean(user?.email?.includes('master') || user?.email?.includes('admin'));
  
  const currentClient = clients.find(c => c.id === selectedClient);
  const companyName = isMaster ? 'Illumine Governance' : (currentClient?.fantasia || currentClient?.razao || 'Empresa não vinculada');

  return (
    <ExecutivePageTemplate header={{
      title: "Perfil Executivo de Governança",
      description: "Gerencie suas credenciais de acesso, perfil de autenticação e papéis fiduciários.",
    }}>
      <div className="space-y-8 pb-24 animate-executive-fade max-w-[1440px] mx-auto">

        {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DE PERFIL E CREDENCIAIS) --- */}
        <ExecutiveSummarySection 
          className="mb-8"
          status={{ label: 'Sessão Autenticada', variant: 'success' }}
          question="Quais são as credenciais ativas, privilégios de acesso e entidade vinculada ao usuário?"
          opinion="O comitê fiduciário homologa o perfil de acesso do usuário, atestando o nível de autorização e o respeito às políticas de segurança."
          driver="Nível de acesso, permissões de escrita/leitura, autenticação MFA e vínculo corporativo."
          implication="Garantia de que apenas usuários credenciados acessem dados confidenciais do grupo econômico."
          executiveQuestion="Manter as credenciais atualizadas e habilitar a autenticação em dois fatores."
        >
          <ExecutiveStrategicTensions tensions={[]} />
          <ExecutiveDecisionTrace trace={[]} />
        </ExecutiveSummarySection>

        {/* --- CAMADA 2: DIRETORIA & KPIS DE ACESSO --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ExecutiveMetricCard
            label="Usuário Autenticado"
            value={user?.displayName || user?.email || 'Usuário'}
            statusBadge={<ExecutiveBadge variant="success">Sessão Válida</ExecutiveBadge>}
            tone="neutral"
            className="bg-card border border-border shadow-sm h-full"
          />

          <ExecutiveMetricCard
            label="Papel Fiduciário"
            value={isMaster ? 'Master Admin' : 'Consultor Estratégico'}
            statusBadge={<ExecutiveBadge variant="info">Autorizado</ExecutiveBadge>}
            tone="neutral"
            className="bg-card border border-border shadow-sm h-full"
          />

          <ExecutiveMetricCard
            label="Entidade Vinculada"
            value={companyName}
            statusBadge={<ExecutiveBadge variant="neutral">Corporativo</ExecutiveBadge>}
            tone="neutral"
            className="bg-card border border-border shadow-sm h-full"
          />
        </div>

        {/* --- CAMADA 3: CAMADA TÉCNICA E DETALHES DA CONTA --- */}
        <ExecutiveTechnicalLayer
          title="Camada Técnica de Credenciais"
          subtitle="Informações Cadastrais e Registro de Segurança"
          description="E-mail principal, token de sessão e preferências de conta."
          className="mb-8"
        >
          <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center font-bold text-lg border border-border">
                {user?.displayName ? user.displayName.substring(0, 2).toUpperCase() : 'US'}
              </div>
              <div>
                <ExecutiveHeading as="h4" className="text-foreground">{user?.displayName || 'Usuário Sem Nome'}</ExecutiveHeading>
                <ExecutiveText variant="caption" className="text-muted-foreground">{user?.email}</ExecutiveText>
              </div>
            </div>
          </ExecutiveSurface>
        </ExecutiveTechnicalLayer>

      </div>
    </ExecutivePageTemplate>
  );
}
