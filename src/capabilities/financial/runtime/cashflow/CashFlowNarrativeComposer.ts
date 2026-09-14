// src/core/runtime/cashflow/CashFlowNarrativeComposer.ts
import { CashFlowDiagnostics } from './cashflow-types';

export function composeCashFlowNarrative(diagnostics: CashFlowDiagnostics): string {
  if (!diagnostics.isAvailable || !diagnostics.operational || !diagnostics.conversion || !diagnostics.treasury || !diagnostics.sustainability || !diagnostics.funding) {
    return 'DFC indisponível para análise institucional.';
  }

  let narrative = '';

  // Operational Pattern
  if (diagnostics.operational.pattern === 'OPERACIONAL_SUSTENTAVEL') {
    narrative += 'A operação demonstra capacidade estrutural de autofinanciamento, gerando caixa operacional suficiente para suportar suas atividades. ';
  } else if (diagnostics.operational.pattern === 'OPERACIONAL_DEFICITARIO') {
    narrative += 'O modelo de negócios atual drena liquidez da operação, resultando em queima crônica de caixa. ';
  } else if (diagnostics.operational.pattern === 'DEPENDENTE_TERCEIROS') {
    narrative += 'A operação não se sustenta organicamente, exigindo aportes contínuos de capital de terceiros ou sócios. ';
  }

  // Conversion
  if (diagnostics.conversion.qualityOfEarnings === 'INSUFICIENTE') {
    narrative += 'A ausência de EBITDA positivo impede qualquer conversão orgânica de caixa. ';
  } else if (diagnostics.conversion.qualityOfEarnings === 'BAIXA') {
    narrative += 'A retenção de capital de giro asfixia a conversão operacional, transformando lucro contábil em escassez de liquidez. ';
  }

  // Treasury
  if (diagnostics.treasury.pressureLevel === 'CRÍTICA') {
    narrative += 'Há um risco iminente de ruptura de tesouraria frente aos compromissos assumidos. ';
  }

  // Sustainability & Funding
  if (diagnostics.funding.dependencyStatus === 'ALAVANCAGEM_CRÍTICA') {
    narrative += 'O déficit operacional transfere a sobrevivência do negócio exclusivamente para a captação de dívida. ';
  } else if (diagnostics.funding.dependencyStatus === 'DEPENDÊNCIA_SÓCIOS') {
    narrative += 'A empresa atua como um dreno de capital proprietário, dependendo de aportes para manter sua solvência. ';
  }

  if (narrative.trim() === '') {
    narrative = 'O comportamento de caixa apresenta dinâmica neutra, sem pressões críticas detectadas no ciclo.';
  }

  return narrative.trim();
}
