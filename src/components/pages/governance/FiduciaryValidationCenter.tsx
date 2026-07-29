import React from 'react';
import { ShieldCheck, UserX, Network, FileWarning, BookOpen, Clock, Layers, Lock } from 'lucide-react';
import { ExecutiveText } from '../../ui/executive-typography';
import { ExecutiveHeading } from '../../ui/executive-heading';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveMetricCard } from '../../ui/executive-metric-card';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { Button } from '../../ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../ui/tabs';
import { PageHeader } from '../../ui/page-header';
import { ExecutiveDecisionIntegrityBadge } from '../../ui/executive-decision-integrity-badge';
import { ExecutiveConflictCard } from '../../ui/executive-conflict-card';
import { ExecutiveDecisionCard } from '../../ui/executive-decision-card';
import { SemanticGovernanceFilterBar } from '../../ui/semantic-governance-filter-bar';
import { useFiduciaryValidationPageViewModel } from '../../../viewmodels/useFiduciaryValidationPageViewModel';
import { CriticalDecisionSurface, ExecutivePriorityStack } from '../../executive-cognitive';
import { GovernanceHistoryExplorer, GovernanceRecurrencePanel, AdvisoryContinuitySurface, MemoryIntegrityBadge } from '../../institutional-memory';

export function FiduciaryValidationCenter() {
  const {
    projection,
    activeSection,
    setActiveSection,
    filters,
    setSearchQuery,
    setSeverityFilter,
    setStatusFilter,
    filteredConflicts,
    filteredDecisions
  } = useFiduciaryValidationPageViewModel();

  const { fiduciaryHealth, decisionIntegrityIndex, provenance } = projection;

  return (
    <div className="w-full max-w-full space-y-6 sm:space-y-8 min-w-0 overflow-hidden text-foreground leading-relaxed">
      {/* 1. Sovereign Page Header */}
      <PageHeader
        title="Governança Fiduciária — Reference Page L4"
        description="Validação de impedimentos, rastreabilidade de decisões e monitoramento contínuo sob a Wave 12 Architecture."
        actions={
          <Button variant="default" size="sm">
            <ShieldCheck className="w-4 h-4 mr-1.5" /> Exportar Dossiê Fiduciário L4
          </Button>
        }
      />

      {/* 2. Executive Integrity & Decision Quality Surface */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 sm:gap-6 w-full min-w-0">
        <ExecutiveDecisionIntegrityBadge 
          score={decisionIntegrityIndex}
          className="flex-1 w-full min-w-0"
        />
        <ExecutiveSurface padding="sm" radius="lg" className="flex flex-wrap items-center justify-between gap-3 w-full xl:w-auto min-w-0">
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground truncate">
            <Lock className="w-4 h-4 text-success shrink-0" />
            <span>Caso Executivo: <strong className="text-foreground">{projection.executiveCaseId}</strong></span>
          </div>
          <ExecutiveBadge variant="neutral" className="font-mono text-[10px] truncate">
            Hash: {provenance.lineageHash}
          </ExecutiveBadge>
        </ExecutiveSurface>
      </div>

      {/* 3. Critical Decision Surface & Priority Queue */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8 w-full min-w-0">
        <div className="xl:col-span-2 w-full min-w-0">
          <CriticalDecisionSurface />
        </div>
        <div className="xl:col-span-1 w-full min-w-0">
          <ExecutivePriorityStack />
        </div>
      </div>

      {/* 4. Executive KRI Metrics Summary Grid (Reactive Projection Binding) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full min-w-0">
        <ExecutiveMetricCard 
          label="Conflitos Declarados" 
          value={fiduciaryHealth.declaredConflictsCount.toString()} 
          icon={FileWarning} 
          trend="Período Vigente"
          tone="warning"
        />
        <ExecutiveMetricCard 
          label="Partes Relacionadas" 
          value={fiduciaryHealth.monitoredPartiesCount.toString()} 
          icon={Network} 
          trend="Arm's Length Ativo"
          tone="info"
        />
        <ExecutiveMetricCard 
          label="Decisões Bloqueadas" 
          value={fiduciaryHealth.blockedDecisionsCount.toString()} 
          icon={UserX} 
          trend="Nos últimos 30 dias"
          tone="critical"
        />
        <ExecutiveMetricCard 
          label="Pendências de Disclosure" 
          value={fiduciaryHealth.pendingDisclosuresCount.toString()} 
          icon={Clock} 
          trend="Diretores com atraso"
          tone="neutral"
        />
      </div>

      {/* 5. Radix UI Native Canonical Navigation Tabs */}
      <Tabs 
        value={activeSection} 
        onValueChange={(val: any) => setActiveSection(val)}
        className="w-full flex flex-col space-y-6 min-w-0"
      >
        <TabsList variant="line" className="w-full justify-start overflow-x-auto no-scrollbar flex-nowrap min-w-0">
          <TabsTrigger value="overview" className="gap-2 whitespace-nowrap shrink-0">
            <Layers className="w-4 h-4" /> Visão Geral (4)
          </TabsTrigger>
          <TabsTrigger value="conflicts" className="gap-2 whitespace-nowrap shrink-0">
            <FileWarning className="w-4 h-4 text-warning" /> Conflitos de Interesse ({projection.conflicts.length})
          </TabsTrigger>
          <TabsTrigger value="decisions" className="gap-2 whitespace-nowrap shrink-0">
            <ShieldCheck className="w-4 h-4 text-success" /> Gateway de Decisões ({projection.decisions.length})
          </TabsTrigger>
          <TabsTrigger value="related_parties" className="gap-2 whitespace-nowrap shrink-0">
            <Network className="w-4 h-4" /> Partes Relacionadas (0)
          </TabsTrigger>
          <TabsTrigger value="audit_trail" className="gap-2 whitespace-nowrap shrink-0">
            <Clock className="w-4 h-4" /> Memória Fiduciária (100%)
          </TabsTrigger>
        </TabsList>

        {/* 6. Semantic Governance Filter Toolbar */}
        <SemanticGovernanceFilterBar 
          searchQuery={filters.searchQuery}
          onSearchChange={setSearchQuery}
          severityFilter={filters.severity}
          onSeverityChange={setSeverityFilter}
          statusFilter={filters.status}
          onStatusChange={setStatusFilter}
          onReset={() => {
            setSearchQuery('');
            setSeverityFilter('ALL');
            setStatusFilter('ALL');
          }}
          className="w-full min-w-0"
        />

        {/* 7. Section Content Views */}
        <TabsContent value="overview" className="space-y-6 w-full min-w-0">
          <ExecutiveHeading as="h2" variant="sectionTitle" className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary shrink-0" />
            Declarações de Impedimento & Conflitos Identificados
          </ExecutiveHeading>
          <div className="space-y-6 w-full min-w-0">
            {filteredConflicts.map(c => (
              <ExecutiveConflictCard 
                key={c.id} 
                conflict={c}
                onReview={id => console.log('Review conflict', id)}
                onEscalate={id => console.log('Escalate conflict', id)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="conflicts" className="space-y-6 w-full min-w-0">
          <ExecutiveHeading as="h2" variant="sectionTitle" className="flex items-center gap-2">
            <FileWarning className="w-5 h-5 text-warning shrink-0" />
            Central de Conflitos & Matriz de Impedimentos
          </ExecutiveHeading>
          <div className="space-y-6 w-full min-w-0">
            {filteredConflicts.map(c => (
              <ExecutiveConflictCard 
                key={c.id} 
                conflict={c}
                onReview={id => console.log('Review conflict', id)}
                onEscalate={id => console.log('Escalate conflict', id)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="decisions" className="space-y-6 w-full min-w-0">
          <ExecutiveHeading as="h2" variant="sectionTitle" className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-success shrink-0" />
            Gateway de Validação de Decisões Executivas
          </ExecutiveHeading>
          <div className="space-y-6 w-full min-w-0">
            {filteredDecisions.map(d => (
              <ExecutiveDecisionCard key={d.id} decision={d} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="related_parties" className="w-full min-w-0">
          <ExecutiveSurface padding="xl" radius="xl" className="text-center py-12 sm:py-16 space-y-6 w-full min-w-0">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mx-auto flex items-center justify-center text-primary shadow-sm">
              <Network className="w-8 h-8" />
            </div>
            <div className="max-w-xl mx-auto space-y-2 px-4">
              <ExecutiveHeading as="h3" variant="moduleTitle">
                Arm's Length Monitoring Active
              </ExecutiveHeading>
              <ExecutiveText as="p" variant="bodyStandard" className="text-muted-foreground">
                Nenhuma transação atípica ou não alinhada a condições de mercado detectada com partes relacionadas nos últimos 30 dias. O monitoramento fiduciário permanece ativo através das políticas de governança vigentes.
              </ExecutiveText>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-4 text-left px-4">
              <ExecutiveSurface padding="sm" radius="xl">
                <ExecutiveText as="span" variant="caption" className="text-muted-foreground uppercase font-bold tracking-wider">
                  Última Verificação
                </ExecutiveText>
                <ExecutiveText as="p" variant="bodyStandard" className="font-mono font-semibold text-foreground mt-1">
                  Hoje, 09:30 BRT
                </ExecutiveText>
              </ExecutiveSurface>
              <ExecutiveSurface padding="sm" radius="xl">
                <ExecutiveText as="span" variant="caption" className="text-muted-foreground uppercase font-bold tracking-wider">
                  Política Aplicada
                </ExecutiveText>
                <ExecutiveText as="p" variant="bodyStandard" className="font-mono font-semibold text-foreground mt-1">
                  POL-ARMS-LENGTH-v4
                </ExecutiveText>
              </ExecutiveSurface>
              <ExecutiveSurface padding="sm" radius="xl">
                <ExecutiveText as="span" variant="caption" className="text-muted-foreground uppercase font-bold tracking-wider">
                  Nível de Confiança
                </ExecutiveText>
                <ExecutiveText as="p" variant="bodyStandard" className="font-mono font-semibold text-success mt-1">
                  99.4% Verificado
                </ExecutiveText>
              </ExecutiveSurface>
            </div>
          </ExecutiveSurface>
        </TabsContent>

        <TabsContent value="audit_trail" className="space-y-8 w-full min-w-0">
          <ExecutiveSurface variant="default" padding="sm" radius="xl" className="flex flex-wrap justify-between items-center gap-4">
            <ExecutiveText as="span" variant="caption" className="text-muted-foreground uppercase tracking-widest font-semibold flex items-center gap-2">
              Status da Linhagem Histórica & Rastreabilidade Soberana:
              <MemoryIntegrityBadge />
            </ExecutiveText>
          </ExecutiveSurface>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 w-full min-w-0">
            <GovernanceRecurrencePanel />
            <AdvisoryContinuitySurface />
          </div>
          <GovernanceHistoryExplorer />
        </TabsContent>
      </Tabs>
    </div>
  );
}
