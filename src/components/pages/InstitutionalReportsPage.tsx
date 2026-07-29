import React, { useState, useEffect } from 'react';
import { FileText, Printer, Download, ShieldCheck, Clock, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';
import { PageHeader, StatusBadge } from '../Common';
import { GroupOnboardingRepository, EconomicGroupModel } from '../../services/FiduciaryRuntimeAdapter';
import { ExecutiveBoardPack } from '../../services/FiduciaryRuntimeAdapter';
import { GovernedRepositoryWrapper } from '../../core/security/governed-repository';
import { DataAccessContext } from '../../core/security/data-access-context';
import { useAuthAdapter } from '../../adapters/ui/useAuthAdapter';
import { useLanguage } from '../../contexts/LanguageContext';
import { createPortal } from 'react-dom';
import { ExecutiveSummarySection } from '../ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../ui/executive-decision-trace';
import { useInstitutionalReportsPageViewModel } from '../../viewmodels/useInstitutionalReportsPageViewModel';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveBadge } from '../ui/executive-badge';
import { ExecutiveMetricCard } from '../ui/executive-metric-card';
import { ExecutiveTechnicalLayer } from '../ui/executive-technical-layer';

export function InstitutionalReportsPage() {
  const { state: vmState, computed: vmComputed, actions: vmActions } = useInstitutionalReportsPageViewModel({ clientId: '' });
  const { translateLabel: t } = useLanguage();
  const [groups, setGroups] = useState<EconomicGroupModel[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');

  useEffect(() => {
    GroupOnboardingRepository.listGroups().then(setGroups);
  }, []);

  return (
    <ExecutivePageTemplate header={{
      title: "Relatórios Institucionais & Board Packs",
      description: "Geração de relatórios fiduciários governados com carimbo de linhagem para o Conselho.",
    }}>
      <div className="space-y-8 pb-24 animate-executive-fade max-w-[1440px] mx-auto">

        {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DE RELATÓRIOS INSTITUCIONAIS) --- */}
        <ExecutiveSummarySection 
          className="mb-8"
          status={{ label: 'Relatórios Fiduciários', variant: 'success' }}
          question="Como os Board Packs institucionais são compilados, assinados e distribuídos ao Conselho?"
          opinion="O comitê fiduciário homologa a emissão de relatórios institucionais com carimbo digital e linhagem rastreável de auditabilidade."
          driver="Board Pack consolidado, hash de linhagem, política de visibilidade e governança de download."
          implication="Garantia de reporte fiduciário imutável e seguro para investidores e conselheiros."
          action="Exportar o pacote mensal de governança para distribuição aos membros do conselho de administração."
        >
          <ExecutiveStrategicTensions tensions={[]} />
          <ExecutiveDecisionTrace trace={[]} />
        </ExecutiveSummarySection>

        {/* --- CAMADA 2: DIRETORIA & EMISSÃO DE BOARD PACKS --- */}
        <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm mb-8 space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <ExecutiveHeading as="h3" className="text-foreground">Emissão de Board Pack Consolidado</ExecutiveHeading>
              <ExecutiveText variant="caption" className="text-muted-foreground">Selecione o grupo econômico para compilação do relatório.</ExecutiveText>
            </div>
            <ExecutiveBadge variant="info">Protocolo Deny-by-Default</ExecutiveBadge>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <select
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              className="w-full sm:w-80 px-4 py-2.5 bg-surface-container border border-border rounded-xl text-xs font-semibold outline-none text-foreground"
            >
              <option value="">Selecione o Grupo Econômico...</option>
              {groups.map(g => (
                <option key={g.id} value={g.id}>{g.groupName}</option>
              ))}
            </select>
          </div>
        </ExecutiveSurface>

        {/* --- CAMADA 3: CAMADA TÉCNICA E LINHAGEM DIGITAL --- */}
        <ExecutiveTechnicalLayer
          title="Camada Técnica de Carimbo Fiduciário (Lineage Stamp)"
          subtitle="Rastreabilidade Digital e Validação de Criptografia"
          description="Hash de linhagem e chaves de auditoria geradas para garantir imutabilidade."
          className="mb-8"
        >
          <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm">
            <ExecutiveHeading as="h4" className="text-foreground mb-2">Protocolo de Segurança e Exportação</ExecutiveHeading>
            <ExecutiveText variant="bodyStandard" className="text-muted-foreground">
              Toda exportação de Board Pack é governada pelo repositório fiduciário e registra log auditável com o usuário solicitante.
            </ExecutiveText>
          </ExecutiveSurface>
        </ExecutiveTechnicalLayer>

      </div>
    </ExecutivePageTemplate>
  );
}
