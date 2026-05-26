import { IResolverContext, NarrativeGovernance } from './types';

export class NarrativeGovernanceResolver {
  static resolve(
    ctx: IResolverContext,
    stage: string,
    model: string,
    density: string
  ): NarrativeGovernance {
    const allowedNarrativeFrame: string[] = [];
    const blockedNarrativeClaims: string[] = [];
    const evidenceRequiredClaims: Record<string, string[]> = {};

    // 1. Allowed Narrative Frames
    if (stage === 'FIRST_OPERATIONAL_YEAR' || density === 'SINGLE_YEAR_ONLY') {
      allowedNarrativeFrame.push(
        'Foco em diagnóstico de estrutura inicial.',
        'Análise estática de ponto de equilíbrio.',
        'Mapeamento de gargalos imediatos de capital de giro.'
      );
    } else if (stage === 'TURNAROUND_DISTRESS') {
      allowedNarrativeFrame.push(
        'Foco emergencial em preservação de caixa e solvência.',
        'Renegociação estrutural de passivos com fornecedores e bancos.',
        'Eliminação de custos não essenciais.'
      );
    } else if (stage === 'GROWTH_STAGE' || stage === 'SCALE_STAGE') {
      allowedNarrativeFrame.push(
        'Análise de alavancagem operacional e escalabilidade.',
        'Expansão de margem e otimização de custos variáveis.',
        'Fidelização de receita recorrente.'
      );
    } else {
      allowedNarrativeFrame.push(
        'Otimização do retorno sobre capital investido (ROIC).',
        'Gestão fina de estoques e prazos médios contábeis.',
        'Preservação da solidez patrimonial e dividendos.'
      );
    }

    // 2. Blocked Narrative Claims (Garantias proibidas)
    if (density === 'SINGLE_YEAR_ONLY' || density === 'LOW_HISTORICAL_DENSITY') {
      blockedNarrativeClaims.push(
        'Melhoria consistente e sustentável de longo prazo',
        'Tendência longitudinal secular de expansão de margens',
        'Recuperação histórica de rentabilidade consolidada',
        'Turnaround estrutural de longo prazo comprovado'
      );
    }

    if (stage === 'TURNAROUND_DISTRESS') {
      blockedNarrativeClaims.push(
        'Estrutura de capital confortável e livre de pressões',
        'Folga líquida para expansão acelerada sem riscos',
        'Baixa exposição a risco operacional de fornecimento'
      );
    }

    // 3. Evidence Required Claims
    evidenceRequiredClaims['Proteção de Market Share'] = [
      'crescimento_receita_anual',
      'lucro_bruto_positivo'
    ];
    evidenceRequiredClaims['Caixa Livre para Expansão'] = [
      'caixa_equivalentes_superior_a_passivo_circulante',
      'patrimonio_liquido_positivo'
    ];
    evidenceRequiredClaims['Alavancagem Saudável'] = [
      'ebitda_crescente',
      'divida_financeira_menor_que_pl'
    ];

    return {
      allowedNarrativeFrame,
      blockedNarrativeClaims,
      evidenceRequiredClaims
    };
  }
}
