import { TreasurySustainabilityOutput } from '../../capabilities/financial/runtime/cash-intelligence/CashIntelligenceTypes';

export class TreasurySustainabilityEngine {
  public static evaluate(
    fco: number,
    fci: number,
    runwayMonths: number,
    fundingRatio: number
  ): TreasurySustainabilityOutput {
    // 1. FCO Score (35%)
    let fcoScore = 0;
    if (fco >= 0) {
      fcoScore = 100;
    } else {
      if (runwayMonths >= 12) fcoScore = 70;
      else if (runwayMonths >= 6) fcoScore = 50;
      else if (runwayMonths >= 3) fcoScore = 30;
      else fcoScore = 10;
    }

    // 2. Runway Score (35%)
    let runwayScore = 0;
    if (runwayMonths >= 12) runwayScore = 100;
    else if (runwayMonths >= 6) runwayScore = 75;
    else if (runwayMonths >= 3) runwayScore = 40;
    else if (runwayMonths >= 1) runwayScore = 15;
    else runwayScore = 0;

    // 3. Funding Ratio Score (15%)
    let fundingScore = 0;
    if (fundingRatio <= 0.10) fundingScore = 100;
    else if (fundingRatio <= 0.30) fundingScore = 80;
    else if (fundingRatio <= 0.50) fundingScore = 50;
    else if (fundingRatio <= 0.70) fundingScore = 20;
    else fundingScore = 0;

    // 4. Reinvestment Score (15%)
    const reinvestmentRate = fco > 0 ? Math.abs(fci) / fco : 0;
    let reinvestmentScore = 0;
    if (fco > 0) {
      if (reinvestmentRate >= 0.10 && reinvestmentRate <= 0.50) {
        reinvestmentScore = 100;
      } else if (reinvestmentRate > 0.05 && reinvestmentRate <= 1.0) {
        reinvestmentScore = 70;
      } else {
        reinvestmentScore = 40;
      }
    } else {
      reinvestmentScore = 10; // FCO negative makes reinvestment highly unsustainable
    }

    const efsiScore = Math.round(
      0.35 * fcoScore + 
      0.35 * runwayScore + 
      0.15 * fundingScore + 
      0.15 * reinvestmentScore
    );

    // Social Continuity Capacity
    let socialCapacity: TreasurySustainabilityOutput['socialContinuity']['capacity'] = 'Alta';
    let socialJustification = '';
    if (fco >= 0 && runwayMonths >= 12) {
      socialCapacity = 'Alta';
      socialJustification = 'Geração de caixa superavitária e liquidez robusta garantem estabilidade total de pessoal e investimentos comunitários de longo horizonte.';
    } else if (runwayMonths >= 6) {
      socialCapacity = 'Parcial';
      socialJustification = 'Liquidez estável de ciclo imediato mitiga demissões iminentes, porém a ausência de geração de caixa própria restringe novas contratações ou projetos.';
    } else if (runwayMonths >= 3) {
      socialCapacity = 'Vulnerável';
      socialJustification = 'O caixa comprimido ameaça a manutenção de empregos operacionais secundários e suspende investimentos sociais planejados.';
    } else {
      socialCapacity = 'Crítica';
      socialJustification = 'Risco imediato de cortes de pessoal e paralisação de projetos sociais por severa insuficiência de capital de giro.';
    }

    // Governance Liquidity Integrity
    let govStatus = 'Consistente';
    let govJustification = '';
    if (fundingRatio <= 0.30 && runwayMonths >= 12) {
      govStatus = 'Consistente';
      govJustification = 'Baixa dependência societária e runway seguro de longo horizonte atestam conformidade fiduciária e resiliência de caixa.';
    } else if (fundingRatio <= 0.50 && runwayMonths >= 6) {
      govStatus = 'Moderada';
      govJustification = 'A liquidez está garantida temporariamente, com dependência administrável de aportes societários de contingência.';
    } else {
      govStatus = 'Pressionada';
      govJustification = 'Elevada dependência de capitalização externa ou de sócios para manutenção da liquidez básica.';
    }

    // Reinvestment Capacity Index
    let reinvestmentStatus: TreasurySustainabilityOutput['reinvestmentCapacityIndex']['status'] = 'Inadequado';
    let reinvestmentJustification = '';
    if (fco <= 0) {
      reinvestmentStatus = 'Inadequado';
      reinvestmentJustification = 'Operação consome caixa; impossibilidade de reinvestir sem endividamento ou novos aportes.';
    } else if (reinvestmentRate > 0.10 && reinvestmentRate <= 0.50) {
      reinvestmentStatus = 'Ótimo';
      reinvestmentJustification = 'Reinvestimento equilibrado suportado pela geração operacional de caixa da própria atividade.';
    } else if (reinvestmentRate <= 0.10) {
      reinvestmentStatus = 'Sub-ótimo';
      reinvestmentJustification = 'Baixa taxa de reinvestimento; risco de obsolescência tecnológica ou operacional.';
    } else {
      reinvestmentStatus = 'Estressado';
      reinvestmentJustification = 'O reinvestimento excede a geração operacional de caixa, pressionando o caixa livre e a liquidez.';
    }

    // Board Output
    const question = 'A organização possui caixa suficiente para sustentar sua missão?';
    let answer: TreasurySustainabilityOutput['boardOutput']['answer'] = 'Sim';
    let justification = '';

    if (runwayMonths >= 12 && fco >= 0) {
      answer = 'Sim';
      justification = `O runway confortável de ${runwayMonths.toFixed(1)} meses e a geração operacional positiva de caixa garantem a sustentabilidade financeira da missão institucional.`;
    } else if (runwayMonths >= 6) {
      answer = 'Parcialmente';
      justification = `A liquidez atual de ${runwayMonths.toFixed(1)} meses garante a continuidade das atividades no ciclo imediato, mas a ausência de excedentes operacionais exige captação complementar.`;
    } else {
      answer = 'Não';
      justification = `O runway extremamente comprimido de ${runwayMonths.toFixed(1)} meses coloca a continuidade institucional em risco imediato, exigindo readequação estrutural.`;
    }

    return {
      efsiScore,
      socialContinuity: {
        capacity: socialCapacity,
        justification: socialJustification
      },
      governanceLiquidityIntegrity: {
        status: govStatus,
        justification: govJustification
      },
      reinvestmentCapacityIndex: {
        value: Math.round(reinvestmentRate * 100),
        status: reinvestmentStatus,
        justification: reinvestmentJustification
      },
      boardOutput: {
        question,
        answer,
        justification
      },
      fcoBasis: 'ADJUSTED_OPERATIONAL_BURN'
    };
  }
}
