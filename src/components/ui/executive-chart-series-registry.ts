export type SemanticVariant = 
  | 'primary' 
  | 'secondary' 
  | 'neutral' 
  | 'accent' 
  | 'success' 
  | 'attention' 
  | 'warning' 
  | 'critical' 
  | 'info' 
  | 'asset' 
  | 'liability' 
  | 'equity';

export interface ExecutiveSeriesDefinition {
  color: string;
  gradient?: string;
  strokeWidth?: number;
  legendLabel?: string;
  tooltipLabel?: string;
}

export const ExecutiveChartSeriesRegistry: Record<SemanticVariant, ExecutiveSeriesDefinition> = {
  asset: { color: '#10b981', strokeWidth: 2 },       // emerald-500
  liability: { color: '#3b82f6', strokeWidth: 2 },   // blue-500
  equity: { color: '#f59e0b', strokeWidth: 2 },      // amber-500
  success: { color: '#10b981', strokeWidth: 2 },
  attention: { color: '#eab308', strokeWidth: 2 },   // yellow-500
  warning: { color: '#f97316', strokeWidth: 2 },     // orange-500
  critical: { color: '#f43f5e', strokeWidth: 2 },    // rose-500
  info: { color: '#3b82f6', strokeWidth: 2 },
  accent: { color: '#6366f1', strokeWidth: 2 },      // indigo-500
  neutral: { color: '#64748b', strokeWidth: 2 },     // slate-500
  secondary: { color: '#94a3b8', strokeWidth: 2 },   // slate-400
  primary: { color: '#0f172a', strokeWidth: 2 }      // slate-900
};

export function getExecutiveSeriesDefinition(variant: SemanticVariant): ExecutiveSeriesDefinition {
  return ExecutiveChartSeriesRegistry[variant] || ExecutiveChartSeriesRegistry['neutral'];
}
