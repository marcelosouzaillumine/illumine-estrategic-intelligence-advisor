import { EconomicDiagnosisOutput } from './EconomicDiagnosisEngine';
import { CrossStatementIsolationValidator } from './CrossStatementIsolationValidator';

/**
 * BoardDecisionFramework — 7 perguntas fiduciárias obrigatórias do Conselho
 */
export interface BoardDecisionFramework {
  // P1: A empresa cria ou destrói valor?
  criacaoDeValor: string;
  // P2: O faturamento sustenta a estrutura?
  faturamentoSustaenta: string;
  // P3: Quanto falta para atingir o equilíbrio?
  lacunaEquilibrio: string;
  // P4: Qual é a principal restrição econômica?
  restricaoPrincipal: string;
  // P5: Qual é a principal oportunidade econômica?
  oportunidadePrincipal: string;
  // P6: Se nada for feito, o que acontece?
  consequenciaDaInacao: string;
  // P7: Qual é a prioridade do Conselho?
  prioridadeConselho: string;
  // P8: Estamos criando valor econômico?
  criacaoValorEconomico: string;
  // P9: Qual iniciativa possui maior potencial de retorno?
  maiorPotencialRetorno: string;
  // Campos legados (backward compat)
  geraValor: string;
  problemaPrincipal: string;
  recuperavel: string;
  prioridade: string;
  risco: string;
}

export class DREBoardDecisionSupportEngine {
  public static generateFramework(
    diagnosis: EconomicDiagnosisOutput,
    context?: { breakEvenGap?: number; netRevenue?: number; breakEvenRevenue?: number }
  ): BoardDecisionFramework {
    const { valueCreationAssessment, primaryConstraint, recoverabilityAssessment, strategicPriority, boardOutlook } = diagnosis;

    // P1 — Criação de Valor
    const criacaoDeValor = valueCreationAssessment === 'Sim'
      ? 'Sim — a operação gera resultado positivo neste exercício.'
      : 'Não — a operação consome mais recursos do que gera. Há destruição de valor econômico.';

    // P2 — O faturamento sustenta a estrutura?
    let faturamentoSustaenta = 'O faturamento atual é insuficiente para cobrir a estrutura operacional instalada.';
    if (valueCreationAssessment === 'Sim') {
      faturamentoSustaenta = 'Sim — o faturamento supera os custos da estrutura operacional.';
    }

    // P3 — Quanto falta para atingir o equilíbrio?
    let lacunaEquilibrio = 'Análise indisponível — dados de break-even não calculados.';
    if (context?.breakEvenGap !== undefined && context?.breakEvenRevenue !== undefined && context?.netRevenue !== undefined) {
      if (context.breakEvenGap <= 0) {
        lacunaEquilibrio = 'A operação já superou o ponto de equilíbrio. A receita atual é suficiente.';
      } else {
        const gapFormatted = context.breakEvenGap.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        lacunaEquilibrio = `Faltam ${gapFormatted} adicionais de receita para atingir o ponto de equilíbrio operacional.`;
      }
    }

    // P4 — Principal Restrição Econômica
    const restricaoPrincipal = CrossStatementIsolationValidator.isWithinDREDomain(primaryConstraint)
      ? primaryConstraint
      : 'Estrutura operacional incompatível com o nível de receita atual.';

    // P5 — Principal Oportunidade Econômica
    let oportunidadePrincipal = 'Expansão da receita e revisão da estrutura de custos fixos.';
    if (primaryConstraint.toLowerCase().includes('escala')) {
      oportunidadePrincipal = 'Alavancagem de volume — a estrutura existente permite absorver mais receita sem crescimento proporcional dos custos.';
    } else if (primaryConstraint.toLowerCase().includes('margem')) {
      oportunidadePrincipal = 'Otimização de precificação e revisão de custos diretos para ampliar a margem de contribuição.';
    } else if (primaryConstraint.toLowerCase().includes('custo')) {
      oportunidadePrincipal = 'Redimensionamento da estrutura fixa para torná-la compatível com o volume atual de receita.';
    }

    // P6 — Se nada for feito
    const consequenciaDaInacao = boardOutlook;

    // P7 — Prioridade do Conselho
    const prioridadeConselho = strategicPriority;

    // P8 — Estamos criando valor econômico?
    const criacaoValorEconomico = valueCreationAssessment === 'Sim'
      ? 'A operação gera retorno positivo, mas a criação de valor real depende do custo implícito de capital empregado.'
      : 'Não. O resultado operacional negativo caracteriza destruição imediata de valor econômico e consumo de patrimônio.';

    // P9 — Qual iniciativa possui maior potencial de retorno?
    let maiorPotencialRetorno = 'Aceleração comercial para escala e diluição de despesas fixas de estrutura.';
    if (primaryConstraint.toLowerCase().includes('margem')) {
      maiorPotencialRetorno = 'Otimização de precificação e negociação com fornecedores para restabelecer a margem de contribuição.';
    } else if (primaryConstraint.toLowerCase().includes('custo') || primaryConstraint.toLowerCase().includes('estrutura')) {
      maiorPotencialRetorno = 'Redimensionamento da estrutura de custos fixos e otimização da capacidade instalada.';
    }

    return {
      criacaoDeValor,
      faturamentoSustaenta,
      lacunaEquilibrio,
      restricaoPrincipal,
      oportunidadePrincipal,
      consequenciaDaInacao,
      prioridadeConselho,
      criacaoValorEconomico,
      maiorPotencialRetorno,
      // backward compat
      geraValor: valueCreationAssessment,
      problemaPrincipal: primaryConstraint,
      recuperavel: recoverabilityAssessment,
      prioridade: strategicPriority,
      risco: boardOutlook,
    };
  }
}
