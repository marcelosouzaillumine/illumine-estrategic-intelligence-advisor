export interface HeroMetricComponent {
  label: string;
  weight: number;
}

export const CPS_COMPONENTS: HeroMetricComponent[] = [
  { label: 'Capital Remanescente', weight: 0.45 },
  { label: 'Dependência de Aportes', weight: 0.30 },
  { label: 'Distribuição de Lucros', weight: 0.10 },
  { label: 'Horizonte de Recuperação', weight: 0.15 }
];

export function getCPSClassification(score: number): {
  classification: string;
  tone: 'success' | 'warning' | 'critical' | 'info' | 'neutral';
  riskLevel: string;
} {
  if (score >= 80) return { classification: 'Excelente', tone: 'success', riskLevel: 'Risco Mínimo' };
  if (score >= 60) return { classification: 'Saudável', tone: 'info', riskLevel: 'Risco Baixo' };
  if (score >= 40) return { classification: 'Atenção', tone: 'warning', riskLevel: 'Risco Moderado' };
  if (score >= 20) return { classification: 'Fragilizado', tone: 'critical', riskLevel: 'Risco Elevado' };
  return { classification: 'Capital Erodido', tone: 'critical', riskLevel: 'Risco Crítico' };
}
