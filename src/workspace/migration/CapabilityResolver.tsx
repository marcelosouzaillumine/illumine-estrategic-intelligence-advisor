import React from 'react';
import { NAVIGATION_SURFACE_REGISTRY } from '../../core/navigation/navigation-surface.registry';
import { FinancialPerformanceCapability } from '../capabilities/cfo/financial-performance/FinancialPerformanceCapability';
import { CashIntelligenceCapability } from '../capabilities/cfo/cash-intelligence/CashIntelligenceCapability';
import { PlanningForecastCapability } from '../capabilities/cfo/planning-forecast/PlanningForecastCapability';
import { WorkingCapitalCapability } from '../capabilities/cfo/working-capital/WorkingCapitalCapability';
import { ExecutiveOverviewCapability } from '../capabilities/ceo/executive-overview/ExecutiveOverviewCapability';
import { StrategicPerformanceCapability } from '../capabilities/ceo/strategic-performance/StrategicPerformanceCapability';
import { GrowthIntelligenceCapability } from '../capabilities/ceo/growth-intelligence/GrowthIntelligenceCapability';
import { RiskOverviewCapability } from '../capabilities/ceo/risk-overview/RiskOverviewCapability';
import { CommercialOverviewCapability } from '../capabilities/commercial/executive-overview/CommercialOverviewCapability';
import { CommercialPerformanceCapability } from '../capabilities/commercial/commercial-performance/CommercialPerformanceCapability';
import { PipelineIntelligenceCapability } from '../capabilities/commercial/pipeline-intelligence/PipelineIntelligenceCapability';
import { CustomerIntelligenceCapability } from '../capabilities/commercial/customer-intelligence/CustomerIntelligenceCapability';
import { OperationalOverviewCapability } from '../capabilities/coo/executive-overview/OperationalOverviewCapability';
import { ProcessExecutionCapability } from '../capabilities/coo/process-execution/ProcessExecutionCapability';
import { LogisticsSupplyChainCapability } from '../capabilities/coo/logistics-supply-chain/LogisticsSupplyChainCapability';
import { ProcurementIntelligenceCapability } from '../capabilities/coo/procurement-intelligence/ProcurementIntelligenceCapability';
import { OperationalExcellenceCapability } from '../capabilities/coo/operational-excellence/OperationalExcellenceCapability';
import { PeopleOverviewCapability } from '../capabilities/people/executive-overview/PeopleOverviewCapability';
import { WorkforceCapability } from '../capabilities/people/workforce-intelligence/WorkforceCapability';
import { CultureCapability } from '../capabilities/people/culture-engagement/CultureCapability';
import { LeadershipCapability } from '../capabilities/people/leadership-intelligence/LeadershipCapability';
import { PeopleFinancialCapability } from '../capabilities/people/people-costs/PeopleFinancialCapability';
import { CapabilityDevelopmentCapability } from '../capabilities/people/learning-development/CapabilityDevelopmentCapability';
import { OrganizationalIntelligenceCapability } from '../capabilities/people/organizational-intelligence/OrganizationalIntelligenceCapability';

import { GovernanceOverviewCapability } from '../capabilities/governance/executive-overview/GovernanceOverviewCapability';
import { StrategicAlignmentCapability } from '../capabilities/governance/strategic-alignment/StrategicAlignmentCapability';
import { DecisionIntelligenceCapability } from '../capabilities/governance/decision-intelligence/DecisionIntelligenceCapability';
import { BoardIntelligenceCapability } from '../capabilities/governance/board-intelligence/BoardIntelligenceCapability';
import { GovernanceMaturityCapability } from '../capabilities/governance/governance-maturity/GovernanceMaturityCapability';

import { RiskOverviewCapability as RiskOfficeOverviewCapability } from '../capabilities/risk/executive-overview/RiskOverviewCapability';
import { RiskIntelligenceCapability } from '../capabilities/risk/risk-intelligence/RiskIntelligenceCapability';
import { EnterpriseRiskCapability } from '../capabilities/risk/enterprise-risk/EnterpriseRiskCapability';
import { ComplianceCapability } from '../capabilities/risk/compliance-intelligence/ComplianceCapability';
import { ControlMaturityCapability } from '../capabilities/risk/control-maturity/ControlMaturityCapability';
import { AuditIntelligenceCapability } from '../capabilities/risk/audit-intelligence/AuditIntelligenceCapability';
import { EnterpriseResilienceCapability } from '../capabilities/risk/enterprise-resilience/EnterpriseResilienceCapability';

import { InnovationOverviewCapability } from '../capabilities/innovation/executive-overview/InnovationOverviewCapability';
import { InnovationIntelligenceCapability } from '../capabilities/innovation/innovation-intelligence/InnovationIntelligenceCapability';
import { InnovationPortfolioCapability } from '../capabilities/innovation/innovation-portfolio/InnovationPortfolioCapability';
import { OpportunityIntelligenceCapability } from '../capabilities/innovation/opportunity-intelligence/OpportunityIntelligenceCapability';
import { ExperimentManagementCapability } from '../capabilities/innovation/experiment-management/ExperimentManagementCapability';
import { DigitalTransformationCapability } from '../capabilities/innovation/digital-transformation/DigitalTransformationCapability';
import { KnowledgeEvolutionCapability } from '../capabilities/innovation/knowledge-evolution/KnowledgeEvolutionCapability';

import { EnterpriseIntelligencePreview } from '../capabilities/intelligence/preview/EnterpriseIntelligencePreview';

import { ExecutiveContext } from '../context/executive-context.types';

interface CapabilityResolverProps {
  currentPage: string;
  context: ExecutiveContext;
  tenantId: string;
}

export const CapabilityResolver: React.FC<CapabilityResolverProps> = ({ currentPage, context, tenantId }) => {
  // Inject tenantId for the adapters
  const resolvedContext = { ...context, tenantId } as ExecutiveContext;
  // Lookup using the new Surface Registry
  const surfaceDef = NAVIGATION_SURFACE_REGISTRY.find(s => s.surfaceId === currentPage);

  if (!surfaceDef) {
    return null; // Let the fallback rendering in routes.tsx handle it if it's not a registered surface
  }

  const { capabilityId } = surfaceDef;

  switch (capabilityId) {
    case 'cfo.financial-performance':
      return <FinancialPerformanceCapability context={resolvedContext} />;
    case 'cfo.cash-governance':
      return <CashIntelligenceCapability context={resolvedContext} />;
    case 'cfo.planning-forecast':
      return <PlanningForecastCapability context={resolvedContext} />;
    case 'cfo.working-capital':
      return <WorkingCapitalCapability context={resolvedContext} />;
    case 'ceo.executive-overview':
      return <ExecutiveOverviewCapability context={resolvedContext} />;
    case 'ceo.strategic-performance':
      return <StrategicPerformanceCapability context={resolvedContext} />;
    case 'ceo.growth-governance':
      return <GrowthIntelligenceCapability context={resolvedContext} />;
    case 'ceo.risk-overview':
      return <RiskOverviewCapability context={resolvedContext} />;
    case 'commercial.executive-overview':
      return <CommercialOverviewCapability context={resolvedContext} />;
    case 'commercial.commercial-performance':
      return <CommercialPerformanceCapability context={resolvedContext} />;
    case 'commercial.pipeline-governance':
      return <PipelineIntelligenceCapability context={resolvedContext} />;
    case 'commercial.customer-governance':
      return <CustomerIntelligenceCapability context={resolvedContext} />;
    case 'coo.executive-overview':
      return <OperationalOverviewCapability context={resolvedContext} />;
    case 'coo.process-execution':
      return <ProcessExecutionCapability context={resolvedContext} />;
    case 'coo.logistics-supply-chain':
      return <LogisticsSupplyChainCapability context={resolvedContext} />;
    case 'coo.procurement-governance':
      return <ProcurementIntelligenceCapability context={resolvedContext} />;
    case 'coo.operational-excellence':
      return <OperationalExcellenceCapability context={resolvedContext} />;
    case 'people.executive-overview':
      return <PeopleOverviewCapability context={resolvedContext} />;
    case 'people.workforce-governance':
      return <WorkforceCapability context={resolvedContext} />;
    case 'people.culture-engagement':
      return <CultureCapability context={resolvedContext} />;
    case 'people.leadership-governance':
      return <LeadershipCapability context={resolvedContext} />;
    case 'people.people-costs':
      return <PeopleFinancialCapability context={resolvedContext} />;
    case 'people.learning-development':
      return <CapabilityDevelopmentCapability context={resolvedContext} />;
    case 'people.organizational-governance':
      return <OrganizationalIntelligenceCapability context={resolvedContext} />;
    case 'governance.executive-overview':
      return <GovernanceOverviewCapability context={resolvedContext} />;
    case 'governance.strategic-alignment':
      return <StrategicAlignmentCapability context={resolvedContext} />;
    case 'governance.decision-governance':
      return <DecisionIntelligenceCapability context={resolvedContext} />;
    case 'governance.board-governance':
      return <BoardIntelligenceCapability context={resolvedContext} />;
    case 'governance.governance-maturity':
      return <GovernanceMaturityCapability context={resolvedContext} />;
    case 'risk.executive-overview':
      return <RiskOfficeOverviewCapability context={resolvedContext} />;
    case 'risk.risk-governance':
      return <RiskIntelligenceCapability context={resolvedContext} />;
    case 'risk.enterprise-risk':
      return <EnterpriseRiskCapability context={resolvedContext} />;
    case 'risk.compliance-governance':
      return <ComplianceCapability context={resolvedContext} />;
    case 'risk.control-maturity':
      return <ControlMaturityCapability context={resolvedContext} />;
    case 'risk.audit-governance':
      return <AuditIntelligenceCapability context={resolvedContext} />;
    case 'risk.enterprise-resilience':
      return <EnterpriseResilienceCapability context={resolvedContext} />;
    case 'innovation.executive-overview':
      return <InnovationOverviewCapability context={resolvedContext} />;
    case 'innovation.innovation-governance':
      return <InnovationIntelligenceCapability context={resolvedContext} />;
    case 'innovation.innovation-portfolio':
      return <InnovationPortfolioCapability context={resolvedContext} />;
    case 'innovation.opportunity-governance':
      return <OpportunityIntelligenceCapability context={resolvedContext} />;
    case 'innovation.experiment-management':
      return <ExperimentManagementCapability context={resolvedContext} />;
    case 'innovation.digital-transformation':
      return <DigitalTransformationCapability context={resolvedContext} />;
    case 'innovation.knowledge-evolution':
      return <KnowledgeEvolutionCapability context={resolvedContext} />;
    
    // Enterprise Intelligence (Wave 17J)
    case 'governance.preview':
      return <EnterpriseIntelligencePreview context={resolvedContext} />;
      
    default:
      return null;
  }
};
