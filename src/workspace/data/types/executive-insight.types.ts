export type InsightSeverity = 'info' | 'warning' | 'critical' | 'success';

export interface InsightAction {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  url?: string;
}

export interface ExecutiveInsight {
  id: string;
  title: string;
  severity: InsightSeverity;
  narrative: string; // The main message/insight
  evidence: string[]; // Bullet points proving the insight
  impact: string; // What happens because of this
  recommendation: string; // What should be done (deprecated or simple text)
  confidence?: number; // 0-100 indicating AI confidence
  affectedCapability?: string; // e.g., 'coo.process-execution'
  affectedOffice?: string; // e.g., 'coo'
  relatedOffices?: string[]; // e.g., ['cfo', 'commercial']
  recommendedActions?: InsightAction[];
  action?: { // Legacy action format
    label: string;
    url: string;
  };
}
