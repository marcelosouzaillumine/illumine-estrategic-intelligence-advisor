export interface HeaderView {
  title: string;
  subtitle: string;
  statusBadge: string;
  statusVariant: 'success' | 'warning' | 'destructive' | 'default';
  contextDescription: string;
}

export interface KPIView {
  id: string;
  label: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
  status: 'HEALTHY' | 'ATTENTION' | 'CRITICAL';
  isVisible: boolean; // Controlado estritamente pela governança
}

export interface PriorityView {
  id: string;
  type: 'ALERT' | 'ACTION' | 'OPPORTUNITY';
  title: string;
  description: string;
  priorityLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  actionableContext: string;
}

export interface ScenarioView {
  id: string;
  name: string;
  description: string;
  type: 'SURVIVAL' | 'OPTIMIZATION' | 'GROWTH';
  isAllowed: boolean;
  steps: string[];
}

export interface NarrativeViewBlock {
  type: 'DIAGNOSIS' | 'RISK' | 'EXECUTION' | 'MONITORING';
  title: string;
  body: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendation: string;
}

export interface ExecutionView {
  plan: {
    action: string;
    owner: string;
    deadline: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  }[];
}

export interface ConfidenceView {
  overallConfidence: number;
  reasoning: string;
  factors: {
    name: string;
    score: number;
  }[];
}

/**
 * Single Source of Executive Truth™ para a camada de Apresentação (UI)
 * Todos os componentes React consumirão fragmentos deste modelo.
 */
export interface ExecutiveDashboardState {
  sessionId: string;
  header: HeaderView;
  kpis: KPIView[];
  priorities: PriorityView[];
  scenarios: ScenarioView[];
  narrative: NarrativeViewBlock[];
  execution: ExecutionView;
  confidence: ConfidenceView;
}
