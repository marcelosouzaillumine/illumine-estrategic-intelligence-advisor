import React from 'react';
import { Database, ShieldCheck, Activity, Network, GitMerge, Share2 } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveText } from '../../ui/executive-typography';
import { ExecutiveHeading } from '../../ui/executive-heading';
import { UniversalOntologyCard } from './UniversalOntologyCard';
import { EntityResolutionCard } from './EntityResolutionCard';
import { KnowledgeGraphHardeningCard } from './KnowledgeGraphHardeningCard';
import { UniversalTaxonomyCard } from './UniversalTaxonomyCard';
import { EnterpriseDataHealthIndexCard } from './EnterpriseDataHealthIndexCard';

export const EnterpriseKnowledgeFoundationWorkspace: React.FC = () => {
  const mockOntology = {
    ontologyId: 'ont-fin-cashflow',
    domain: 'FINANCIAL' as const,
    entityType: 'CashFlowEvent',
    semanticDefinition: 'Evento financeiro canônico de entrada e saída de caixa corporativo.',
    keyProperties: ['id', 'amount', 'timestamp', 'accountCode'],
    relationships: ['IMPACTS_LIQUIDITY', 'BELONGS_TO_COMPANY']
  };

  const mockResolution = {
    resolutionId: 'res-101',
    canonicalEntityId: 'entity-cnpj-12345678000199',
    sourceSystemId: 'sap-erp-prod',
    externalEntityId: 'SAP-CUST-8812',
    matchConfidencePercent: 100,
    resolutionStrategy: 'EXACT_TAX_ID' as const
  };

  const mockGraph = {
    nodeGraphId: 'graph-granatum',
    companyId: 'comp-granatum',
    totalEntitiesCount: 210,
    totalCausalEdgesCount: 540,
    graphHardeningScore: 99.4,
    lastHardenedTimestamp: new Date().toISOString()
  };

  const mockTaxonomy = {
    taxonomyId: 'tax-rev-saas',
    categoryCode: 'REV_SAAS_ARR',
    canonicalName: 'Receita Recorrente Anual (ARR)',
    mappedDomain: 'FINANCIAL'
  };

  const mockHealth = {
    completenessScore: 98.5,
    freshnessScore: 97.0,
    consistencyScore: 99.2,
    reliabilityScore: 98.0,
    lineageScore: 100.0,
    compositeIndex: 98.5
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* 1. PLATFORM EXPERIENCE PROTOCOL: HEADER */}
      <ExecutiveSurface className="p-6 bg-card border border-border rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Database className="w-5 h-5 text-primary" />
              <ExecutiveHeading as="h2" className="text-xl font-bold text-primary">
                Enterprise Knowledge Foundation Hardening (EKFH v1.0)
              </ExecutiveHeading>
            </div>
            <ExecutiveText variant="bodyStandard" className="text-muted-foreground text-xs">
              Hardening da fundação de conhecimento ontológico, resolução de entidades e Enterprise Data Health Index pré-integração.
            </ExecutiveText>
          </div>
          <ExecutiveBadge variant="success">
            Knowledge Base: Hardened & Governed
          </ExecutiveBadge>
        </div>
      </ExecutiveSurface>

      {/* 2. PLATFORM EXPERIENCE PROTOCOL: GOVERNANCE */}
      <ExecutiveSurface className="p-4 bg-card border border-border rounded-lg shadow-sm">
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/50">
          <ShieldCheck className="w-4 h-4 text-success" />
          <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
            Governança da Ontologia Universal & Desambiguação de Dados
          </ExecutiveText>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2 p-2 bg-surface-container/30 rounded border border-border/30">
            <Network className="w-3.5 h-3.5 text-primary" />
            <span>Ontologia 6 Domínios Corporativos</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-surface-container/30 rounded border border-border/30">
            <GitMerge className="w-3.5 h-3.5 text-primary" />
            <span>Entity Resolution Determinística</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-surface-container/30 rounded border border-border/30">
            <Share2 className="w-3.5 h-3.5 text-primary" />
            <span>Knowledge Graph Hardened (99.4)</span>
          </div>
        </div>
      </ExecutiveSurface>

      {/* 3. PLATFORM EXPERIENCE PROTOCOL: METRICS */}
      <EnterpriseDataHealthIndexCard healthScore={mockHealth} />

      {/* 4. PLATFORM EXPERIENCE PROTOCOL: WORKSPACE */}
      <div className="space-y-4">
        <KnowledgeGraphHardeningCard graph={mockGraph} />
        <UniversalOntologyCard ontology={mockOntology} />
        <EntityResolutionCard resolution={mockResolution} />
      </div>

      {/* 5. PLATFORM EXPERIENCE PROTOCOL: EDITOR & TAXONOMIA */}
      <UniversalTaxonomyCard taxonomy={mockTaxonomy} />

      {/* 6. PLATFORM EXPERIENCE PROTOCOL: AUDIT TRAIL */}
      <ExecutiveSurface className="p-3 bg-card border border-border rounded-lg shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-success" />
            <ExecutiveText variant="bodyStandard" className="font-semibold text-foreground">
              Audit Trail de Conhecimento (Grafo ID: {mockGraph.nodeGraphId})
            </ExecutiveText>
          </div>
          <span className="text-xs text-muted-foreground">Log: <strong className="text-success font-mono font-bold">KNOWLEDGE_HARDENING_SUCCESS</strong></span>
        </div>
      </ExecutiveSurface>
    </div>
  );
};
