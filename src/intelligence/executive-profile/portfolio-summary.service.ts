import { DiagnosticDomain, MaturityLevel } from '../diagnostics/core/diagnostic-types';
import { ExecutiveProfilePortfolio } from './portfolio-types';
import { DomainRegistry } from '../diagnostics/core/domain-registry';
import { ExecutiveDomainGraph } from '../progression/executive-domain-graph';

export type OrganizationalStage = 
  | "Foundation Building"
  | "Growth Transition"
  | "Enterprise Development"
  | "Strategic Scale"
  | "Unknown";

export interface ExecutiveIntelligenceSummary {
  organizationalStage: OrganizationalStage;
  intelligenceIndex: number;
  dominantCapabilities: string[];
  attentionAreas: string[];
  maturityEvolution: {
    domain: DiagnosticDomain;
    previousLevel?: MaturityLevel;
    currentLevel: MaturityLevel;
    evolutionDirection: "improving" | "stable" | "attention";
  }[];
  recommendedEvolution: {
    nextJourneyId: string;
    reason: string;
    expectedImpact: string;
  };
}

export class PortfolioSummaryService {
  
  private maturityScores: Record<MaturityLevel, number> = {
    initial: 20,
    developing: 40,
    structured: 60,
    advanced: 80,
    excellence: 100
  };

  public calculateIntelligenceIndex(portfolio: ExecutiveProfilePortfolio): number {
    const registry = DomainRegistry.getInstance();
    const allDomains = registry.getAllDomains();
    const coreDomains = registry.getCoreFoundations();
    
    const activeDomains = Object.values(portfolio.domains).filter(d => d && d.status === 'completed' && d.currentMaturity);
    
    if (activeDomains.length === 0) return 0;

    // 1. Domain Maturity (Average)
    const scores = activeDomains.map(d => this.maturityScores[d!.currentMaturity!]);
    const domainMaturity = scores.reduce((a, b) => a + b, 0) / scores.length;

    // 2. Coverage
    const coverage = (activeDomains.length / Math.max(allDomains.length, 1)) * 100;

    // 3. Balance (Penalize variance)
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);
    const balance = 100 - (maxScore - minScore); // If all equal, 100. If 100 and 20, balance is 20.

    // 4. Critical Foundations
    let foundationScore = 100;
    for (const core of coreDomains) {
      if (!portfolio.domains[core.domain] || portfolio.domains[core.domain]!.status !== 'completed') {
        foundationScore -= (100 / coreDomains.length);
      }
    }
    foundationScore = Math.max(foundationScore, 0);

    // Final Index (weighted)
    // Maturity 40%, Coverage 20%, Balance 20%, Foundations 20%
    const index = (domainMaturity * 0.4) + (coverage * 0.2) + (balance * 0.2) + (foundationScore * 0.2);
    
    return Math.round(index);
  }

  private deriveStageFromIndex(index: number): OrganizationalStage {
    if (index >= 75) return "Strategic Scale";
    if (index >= 55) return "Enterprise Development";
    if (index >= 35) return "Growth Transition";
    if (index > 0) return "Foundation Building";
    return "Unknown";
  }

  public generateSummary(portfolio: ExecutiveProfilePortfolio): ExecutiveIntelligenceSummary {
    const index = this.calculateIntelligenceIndex(portfolio);
    const stage = this.deriveStageFromIndex(index);
    
    const graph = ExecutiveDomainGraph.getInstance();
    const completedDomains = Object.keys(portfolio.domains)
      .filter(k => portfolio.domains[k as DiagnosticDomain]?.status === 'completed') as DiagnosticDomain[];

    const registry = DomainRegistry.getInstance();
    const coreFoundations = registry.getCoreFoundations();
    const firstCore = coreFoundations.length > 0 ? coreFoundations[0].domain : 'executive360';
    let nextJourneyId = `${firstCore}-intelligence`;
    let reason = `The organization should begin by establishing a baseline of core intelligence (${coreFoundations[0]?.name}).`;
    let expectedImpact = "Clear visibility over essential foundations.";

    if (completedDomains.length > 0) {
      const suggestion = graph.suggestNext(completedDomains);
      if (suggestion) {
        nextJourneyId = `${suggestion.target}-intelligence`;
        reason = suggestion.reason;
        expectedImpact = `Strengthening ${suggestion.target} capabilities for next growth phase.`;
      } else {
        // Fallback
        nextJourneyId = "executive360-intelligence";
        reason = "All primary strategic domains mapped. Proceed to continuous 360 evolution.";
        expectedImpact = "Continuous holistic improvement.";
      }
    }

    const dominantCapabilities: string[] = [];
    const attentionAreas: string[] = [];
    const maturityEvolution: ExecutiveIntelligenceSummary['maturityEvolution'] = [];


    for (const [domainKey, state] of Object.entries(portfolio.domains)) {
      if (!state || state.status !== 'completed' || !state.currentMaturity) continue;
      
      const domainId = domainKey as DiagnosticDomain;
      const domainMeta = registry.getDomain(domainId);
      const name = domainMeta ? domainMeta.name : domainId;

      maturityEvolution.push({
        domain: domainId,
        currentLevel: state.currentMaturity,
        evolutionDirection: 'stable'
      });

      if (['advanced', 'excellence'].includes(state.currentMaturity)) {
        dominantCapabilities.push(name);
      } else if (['initial', 'developing'].includes(state.currentMaturity)) {
        attentionAreas.push(name);
      }
    }

    return {
      organizationalStage: stage,
      intelligenceIndex: index,
      dominantCapabilities,
      attentionAreas,
      maturityEvolution,
      recommendedEvolution: {
        nextJourneyId,
        reason,
        expectedImpact
      }
    };
  }
}
