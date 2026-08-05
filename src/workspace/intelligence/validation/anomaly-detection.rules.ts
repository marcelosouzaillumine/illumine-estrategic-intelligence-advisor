export interface AnomalyDetectionRule {
  id: string;
  condition: (data: any) => boolean;
  alertType: 'warning' | 'critical';
  message: string;
}

export const CFO_ANOMALY_RULES: AnomalyDetectionRule[] = [
  {
    id: 'anomaly-runway',
    condition: (data: any) => data.cashIntelligence?.liquidity?.runwayDays < 30,
    alertType: 'critical',
    message: 'Caixa abaixo do runway mínimo de 30 dias.'
  },
  {
    id: 'anomaly-margin',
    condition: (data: any) => data.performance?.ebitda?.margin < 0,
    alertType: 'warning',
    message: 'Margem EBITDA negativa detectada no período.'
  }
];
