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
  asset: { color: 'var(--color-success, #10b981)', strokeWidth: 2 },
  liability: { color: 'var(--color-info, #3b82f6)', strokeWidth: 2 },
  equity: { color: 'var(--color-warning, #f59e0b)', strokeWidth: 2 },
  success: { color: 'var(--color-success, #10b981)', strokeWidth: 2 },
  attention: { color: 'var(--color-attention, #eab308)', strokeWidth: 2 },
  warning: { color: 'var(--color-warning, #f97316)', strokeWidth: 2 },
  critical: { color: 'var(--color-critical, #f43f5e)', strokeWidth: 2 },
  info: { color: 'var(--color-info, #3b82f6)', strokeWidth: 2 },
  accent: { color: 'var(--color-accent, #6366f1)', strokeWidth: 2 },
  neutral: { color: 'var(--color-executive-muted, #64748b)', strokeWidth: 2 },
  secondary: { color: 'var(--color-executive-secondary, #94a3b8)', strokeWidth: 2 },
  primary: { color: 'var(--color-executive-primary, #0f172a)', strokeWidth: 2 }
};

export function getExecutiveSeriesDefinition(variant: SemanticVariant): ExecutiveSeriesDefinition {
  return ExecutiveChartSeriesRegistry[variant] || ExecutiveChartSeriesRegistry['neutral'];
}
