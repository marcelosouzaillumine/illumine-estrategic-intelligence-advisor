import { ExecutiveNarrativeContract } from '@illumine/executive-contracts';

export class ExecutiveNarrativeEngine {
  public static translateToExecutiveNarrative(
    technicalMetricName: string,
    rawValue: number | string
  ): ExecutiveNarrativeContract {
    let narrativeText = '';
    let tone: 'NEUTRAL' | 'WARNING' | 'OPPORTUNITY' | 'CRITICAL' = 'NEUTRAL';

    if (technicalMetricName === 'Liquidez Corrente' && typeof rawValue === 'number') {
      if (rawValue < 1.0) {
        narrativeText = `A empresa apresenta pressão de liquidez no curto prazo (${rawValue}). Caso nenhuma medida seja tomada, existe risco crescente de restrição operacional.`;
        tone = 'WARNING';
      } else {
        narrativeText = `A posição de liquidez corrente (${rawValue}) permanece dentro do intervalo de segurança fiduciária.`;
        tone = 'NEUTRAL';
      }
    } else if (technicalMetricName === 'Margem EBITDA' && typeof rawValue === 'number') {
      if (rawValue < 10.0) {
        narrativeText = `A rentabilidade operacional (${rawValue}%) reduziu no período. O principal fator está relacionado ao aumento do custo operacional SG&A.`;
        tone = 'WARNING';
      } else {
        narrativeText = `A rentabilidade operacional (${rawValue}%) demonstra forte eficiência de geração de caixa.`;
        tone = 'OPPORTUNITY';
      }
    } else {
      narrativeText = `O indicador ${technicalMetricName} foi registrado em ${rawValue} sob acompanhamento institucional.`;
    }

    return {
      narrativeId: `narr-${Date.now()}`,
      technicalMetricName,
      rawValue,
      executiveNarrativeText: narrativeText,
      tone,
      generatedAt: new Date().toISOString()
    };
  }
}
