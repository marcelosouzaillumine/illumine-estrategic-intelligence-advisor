import { ExecutiveDecisionPackage } from '../contracts/ExecutiveDecisionPackage';

export interface ExecutivePerspectiveAgent {
  domain: string;
  mandate: string;
  biasesToWatch: string[];
  evaluationCriteria: string[];
  argument: string;
  evidence: string[];
  confidence: number;
}

export class ExecutiveDebateService {
  debate(pkg: ExecutiveDecisionPackage): ExecutiveDecisionPackage {
    const agents: ExecutivePerspectiveAgent[] = [
      {
        domain: "Financial",
        mandate: "Protect margins and cash flow",
        biasesToWatch: ["Over-indexing on short-term costs"],
        evaluationCriteria: ["ROI", "EBITDA Impact"],
        argument: "The aggressive investment risks quarterly margins.",
        evidence: ["Historical Q3 drops"],
        confidence: 85
      },
      {
        domain: "Risk",
        mandate: "Ensure enterprise resilience",
        biasesToWatch: ["Extreme risk aversion"],
        evaluationCriteria: ["Exposure", "Compliance"],
        argument: "Organic growth protects downside.",
        evidence: ["Market volatility index"],
        confidence: 78
      }
    ];
    return { ...pkg, state: 'DEBATED', debate: { agents, divergences: [] } };
  }
}

