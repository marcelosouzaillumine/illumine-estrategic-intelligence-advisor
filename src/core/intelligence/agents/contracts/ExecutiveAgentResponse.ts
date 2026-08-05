export interface AgentInsight {
  finding: string;
  severity: string;
}

export interface AgentEvidence {
  description: string;
  source: string;
}

export interface ExecutiveAgentResponse {
  answer: string;
  evidence: AgentEvidence[];
  insights: AgentInsight[];
  confidence: number;
  limitations: string[];
  relatedQuestions: string[];
}
