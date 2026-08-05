import { ILeadReadProvider } from '../providers/ILeadReadProvider';
import { IForecastReadProvider } from '../providers/IForecastReadProvider';
import { IProposalReadProvider } from '../providers/IProposalReadProvider';
import { IDecisionReadProvider } from '../providers/IDecisionReadProvider';
import { IPartnerReadProvider } from '../providers/IPartnerReadProvider';
import { IIntelligenceReadProvider } from '../providers/IIntelligenceReadProvider';
import { CommercialPipelineReadModel } from '../read-models/CommercialPipelineReadModel';
import { PipelineMetricsReadModel } from '../read-models/PipelineMetricsReadModel';
import { ForecastReadModel } from '../read-models/ForecastReadModel';

export class CommercialPipelineAggregator {
  constructor(
    private leadProvider: ILeadReadProvider,
    private forecastProvider: IForecastReadProvider,
    private proposalProvider: IProposalReadProvider,
    private decisionProvider: IDecisionReadProvider,
    private partnerProvider: IPartnerReadProvider,
    private intelligenceProvider: IIntelligenceReadProvider
  ) {}

  async buildPipelineView(officeId: string): Promise<CommercialPipelineReadModel> {
    const leads = await this.leadProvider.getLeads();
    const forecast = await this.forecastProvider.getForecast();
    
    // In a real scenario, we might calculate active metrics based on the leads,
    // or fetch them from a PipelineMetrics provider.
    const metrics: PipelineMetricsReadModel = {
      activeOpportunities: leads.length,
      totalPipelineValue: leads.reduce((acc, l) => acc + l.value, 0),
      pipelineCoverage: 3.5, // Mocked for now
      forecastAccuracy: 88,
      expectedArr: forecast.expectedArr,
      averageTicket: leads.length > 0 ? (leads.reduce((acc, l) => acc + l.value, 0) / leads.length) : 0,
      averageSalesCycle: 45,
      expectedGrossMargin: 72,
      activeExecutivePartners: 12,
      activeAdvisors: 4
    };

    return {
      header: {
        officeId,
        lastSync: new Date().toISOString()
      },
      metrics,
      forecast,
      board: {
        cards: leads
      },
      selectedOpportunity: null,
      timeline: [],
      intelligence: [],
      activities: []
    };
  }

  async buildOpportunityWorkspace(opportunityId: string): Promise<CommercialPipelineReadModel> {
    const lead = await this.leadProvider.getLead(opportunityId);
    if (!lead) throw new Error(`Opportunity not found: ${opportunityId}`);

    const timeline = await this.decisionProvider.getDecisionTimeline(opportunityId);
    const intelligence = await this.intelligenceProvider.getInsights(opportunityId);
    // proposalProvider, partnerProvider could also be used here
    const forecast = await this.forecastProvider.getForecast();

    return {
      header: {
        officeId: 'workspace',
        lastSync: new Date().toISOString()
      },
      metrics: {
        activeOpportunities: 0,
        totalPipelineValue: 0,
        pipelineCoverage: 0,
        forecastAccuracy: 0,
        expectedArr: 0,
        averageTicket: 0,
        averageSalesCycle: 0,
        expectedGrossMargin: 0,
        activeExecutivePartners: 0,
        activeAdvisors: 0
      }, // Workspace might not need full metrics
      forecast,
      board: {
        cards: []
      },
      selectedOpportunity: lead,
      timeline,
      intelligence,
      activities: [] // mock activities
    };
  }
}
