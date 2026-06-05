import { BoardDecisionMaterialityResolver } from './BoardDecisionMaterialityResolver';

export interface BoardDecision {
  titulo: string;
  problema: string;
  impactoEsperado: string;
  prazoRecomendadoLabel: string;
  prazoRecomendado?: string;
  consequenciaInacao: string;
  impactLabel: string;
  urgencyLabel: string;
  origin: string;
  evidence: any[];
  domain?: string;
}

export class BoardTop3DecisionEngine {
  public static generate(report: any, requiresEscalation: boolean): BoardDecision[] {
    const defaultDecisions: BoardDecision[] = [
      {
        titulo: 'Revisão Estratégica Executiva',
        problema: 'Ausência de diagnóstico consolidado para o Conselho.',
        impactoEsperado: 'Alinhamento fiduciário.',
        consequenciaInacao: 'Manutenção do status quo.',
        prazoRecomendadoLabel: 'Curto Prazo',
        impactLabel: 'Alto',
        urgencyLabel: 'Alta',
        origin: 'EFOS_ADVISORY',
        evidence: [],
        domain: 'Estratégia'
      }
    ];

    if (!report || !report.scores) {
      return requiresEscalation ? defaultDecisions : [];
    }

    const netIncome = report.dre?.executiveLayer?.resultadosEstrategicos?.lucroLiquido || 0;
    const fco = report.dfc?.executiveLayer?.fluxoCaixaOperacional || 0;
    const capitalConsumed = report.dlpa?.radar?.capitalConsumidoValue || 0;
    const runwayMonths = report.dfc?.radar?.runwayMonths || 12;
    const badiScore = report.advisory?.badi || 0;

    const materialityInput = {
      netIncome,
      fco,
      capitalConsumed,
      runwayMonths,
      badiScore
    };

    const prohibitedDomains = BoardDecisionMaterialityResolver.prohibitDomains(materialityInput);

    // Filter and sort the decisions
    let decisions: BoardDecision[] = [];

    if (report.advisory?.boardTop3 && Array.isArray(report.advisory.boardTop3) && report.advisory.boardTop3.length > 0) {
      decisions = [...report.advisory.boardTop3];
    } else if (requiresEscalation) {
      // Fallback estático caso advisory esteja incompleto mas a escalada seja obrigatória
      decisions = [
        {
          titulo: 'Restabelecer viabilidade econômica da operação',
          problema: 'Resultado e caixa pressionados',
          impactoEsperado: 'Estancar queima de caixa',
          consequenciaInacao: 'Insolvência',
          prazoRecomendadoLabel: 'Imediato',
          impactLabel: 'Muito Alto',
          urgencyLabel: 'Crítica',
          origin: 'EFOS_ADVISORY',
          evidence: [],
          domain: 'Destruição de Valor'
        },
        {
          titulo: 'Preservar liquidez e reduzir consumo de caixa',
          problema: 'Runway insuficiente',
          impactoEsperado: 'Aumento de fôlego',
          consequenciaInacao: 'Default operacional',
          prazoRecomendadoLabel: 'Imediato',
          impactLabel: 'Muito Alto',
          urgencyLabel: 'Crítica',
          origin: 'EFOS_ADVISORY',
          evidence: [],
          domain: 'Liquidez'
        },
        {
          titulo: 'Recompor integridade do capital dos sócios',
          problema: 'Capital fragilizado por prejuízos',
          impactoEsperado: 'Proteção patrimonial',
          consequenciaInacao: 'Diluição ou falência',
          prazoRecomendadoLabel: 'Curto Prazo',
          impactLabel: 'Alto',
          urgencyLabel: 'Alta',
          origin: 'EFOS_ADVISORY',
          evidence: [],
          domain: 'Capital'
        }
      ];
    }

    // Proibir domínios
    decisions = decisions.filter(d => !prohibitedDomains.includes(d.domain || ''));

    // Ordenar pela hierarquia de materialidade
    decisions.sort((a, b) => {
      const sorted = BoardDecisionMaterialityResolver.sortByMateriality([a.domain || '', b.domain || '']);
      if (sorted[0] === a.domain) return -1;
      if (sorted[0] === b.domain) return 1;
      return 0;
    });

    if (decisions.length === 0 && requiresEscalation) {
      decisions = defaultDecisions;
    }

    // Garante que não passará de 3
    return decisions.slice(0, 3);
  }
}
