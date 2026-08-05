export interface RiskExposure {
  id: string;
  category: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  metric: string;
  value: number;
  triggerCondition: string;
  message: string;
}
