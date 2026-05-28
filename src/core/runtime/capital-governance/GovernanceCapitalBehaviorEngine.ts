import { GovernanceCapitalBehaviorMetrics } from './capital-governance-types';

export class GovernanceCapitalBehaviorEngine {
  public static calculate(
    dlpaDoc: any,
    netIncome: number
  ): GovernanceCapitalBehaviorMetrics {
    if (!dlpaDoc) {
      return {
        shareholderLoansVolume: 0,
        capitalDisciplineRating: 'FALTA_DADO',
        isShareholderDrainingCompany: false,
        loansToNetIncomeRatio: null,
        narrative: 'Dados de DLPA/DMPL não fornecidos para análise de comportamento de mútuos.'
      };
    }

    // Capture loans made by company to shareholders (Mútuos Ativos)
    const mutuoAtivo = Number(dlpaDoc.mutuoAtivo ?? dlpaDoc.mutuosAtivos ?? 0);
    // Capture loans made by shareholders to company (Mútuos Passivos)
    const mutuoPassivo = Number(dlpaDoc.mutuoPassivo ?? dlpaDoc.mutuosPassivos ?? 0);
    
    // Generic volume
    const shareholderLoansVolume = Number(dlpaDoc.mutuoSocios ?? dlpaDoc.mutuos ?? 0);

    let isShareholderDrainingCompany = false;
    let capitalDisciplineRating: 'FORTE' | 'SENSÍVEL' | 'DISPLICENTE' | 'CRÍTICA' | 'FALTA_DADO' = 'FORTE';
    let loansToNetIncomeRatio: number | null = null;

    if (netIncome > 0) {
      loansToNetIncomeRatio = Math.abs(shareholderLoansVolume) / netIncome;
    }

    if (mutuoAtivo > 0 || (shareholderLoansVolume > 0 && dlpaDoc.mutuosOrigem === 'ATREVIDO_A_SOCIO')) {
      isShareholderDrainingCompany = true;
      if (loansToNetIncomeRatio && loansToNetIncomeRatio > 0.5) {
        capitalDisciplineRating = 'CRÍTICA';
      } else {
        capitalDisciplineRating = 'DISPLICENTE';
      }
    } else if (mutuoPassivo > 0) {
      capitalDisciplineRating = 'SENSÍVEL'; // Partners are injecting loans to cover cash, indicating cash tension
    }

    // Narrative
    let narrative = '';
    if (isShareholderDrainingCompany) {
      narrative = `Risco de governança: sócios estão retirando recursos via contratos de mútuo (R$ ${mutuoAtivo.toLocaleString('pt-BR')}), gerando um canal paralelo de drenagem financeira sem tributação ou dividendos correspondentes.`;
      if (capitalDisciplineRating === 'CRÍTICA') {
        narrative += ' Esta prática atinge níveis críticos, superando a metade do resultado operacional gerado.';
      }
    } else if (mutuoPassivo > 0) {
      narrative = `Os sócios estão aportando recursos na empresa através de mútuos (R$ ${mutuoPassivo.toLocaleString('pt-BR')}). Embora evite endividamento bancário imediato, aponta necessidade de fomento direto dos sócios na operação.`;
    } else {
      narrative = 'Nenhuma movimentação de mútuo relevante com partes relacionadas ou sócios foi registrada, mantendo a disciplina clássica de capital social e lucros.';
    }

    return {
      shareholderLoansVolume: mutuoAtivo > 0 ? mutuoAtivo : mutuoPassivo > 0 ? -mutuoPassivo : shareholderLoansVolume,
      capitalDisciplineRating,
      isShareholderDrainingCompany,
      loansToNetIncomeRatio,
      narrative
    };
  }
}
