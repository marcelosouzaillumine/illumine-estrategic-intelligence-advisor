import { BalanceSheetGovernanceOutput } from './BalanceSheetGovernanceOutput';

export class BalanceSheetExecutiveNarrativeEngine {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  static generate(indicators: any[], summary: any, exerciseYear: number, summaryHash: string): { text: string; narrativeMetadata: any } {
    const parts: string[] = [];
    
    if (!summary || summary.patrimonioLiquido === undefined) {
      return { 
        text: 'Contexto indisponível: falta de dados no sumário patrimonial.',
        narrativeMetadata: { generatedFromExercise: exerciseYear, generatedFromSummaryHash: summaryHash }
      };
    }

    // 1. Solvência e Patrimônio
    const pl = summary.patrimonioLiquido;
    const plFormatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pl);
    const ativoTotal = summary.ativoTotal || 1; // prevent div by 0
    const pctAtivo = ((pl / ativoTotal) * 100).toFixed(1).replace('.', ',');

    if (pl > 0) {
      parts.push(`A companhia encerrou o exercício com patrimônio líquido positivo de ${plFormatted}, representando ${pctAtivo}% do ativo total, o que evidencia solvência patrimonial preservada e elevada autonomia financeira.`);
    } else {
      parts.push(`A companhia encerrou o exercício com patrimônio líquido negativo (passivo a descoberto) de ${plFormatted}, evidenciando ruptura de solvência patrimonial.`);
    }

    const growthEquityInd = indicators.find(i => i.metricName === 'Crescimento do PL' || i.metricName === 'Variação do Patrimônio Líquido');
    if (growthEquityInd && Number(growthEquityInd.value) < 0) {
      const dropPct = Math.abs(Number(growthEquityInd.value) * 100).toFixed(1).replace('.', ',');
      parts.push(`Consumo de reservas impactou o PL em -${dropPct}%.`);
    }

    // 2. Liquidez
    const liqRealInd = indicators.find(i => i.metricName === 'Liquidez Real');
    const liqInstInd = indicators.find(i => i.metricName === 'Liquidez Instantânea Real');
    if (liqRealInd && liqInstInd) {
      const liqR = Number(liqRealInd.value).toFixed(2).replace('.', ',');
      const liqI = Number(liqInstInd.value).toFixed(2).replace('.', ',');
      if (Number(liqRealInd.value) > 1) {
        parts.push(`A liquidez permanece forte, com Liquidez Real de ${liqR} e Liquidez Instantânea Real de ${liqI}, indicando ampla capacidade de cobertura das obrigações de curto prazo.`);
      } else {
        parts.push(`A liquidez apresenta restrições, com Liquidez Real de ${liqR} e Liquidez Instantânea Real de ${liqI}, requerendo atenção à cobertura de curto prazo.`);
        parts.push(`Compressão de caixa reduziu liquidez para ${liqR}.`);
      }
    }

    // 3. Endividamento
    const endGeralInd = indicators.find(i => i.metricName === 'Endividamento Geral');
    const depTerceirosInd = indicators.find(i => i.metricName === 'Dependência de Capital de Terceiros');
    
    if (endGeralInd && depTerceirosInd) {
      const endVal = (Number(endGeralInd.value) * 100).toFixed(1).replace('.', ',');
      const depVal = Number(depTerceirosInd.value).toFixed(2).replace('.', ',');
      parts.push(`O endividamento geral é ${Number(endGeralInd.value) < 0.5 ? 'reduzido' : 'elevado'}, equivalente a ${endVal}% dos ativos, e a dependência de capital de terceiros permanece em ${depVal}x.`);
    }

    // 4. Capital Consumido
    const capConsumidoInd = indicators.find(i => i.metricName === 'Capital Consumido');
    if (capConsumidoInd && capConsumidoInd.evidence?.capitalConsumedAmount) {
      const prejuizo = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(capConsumidoInd.evidence.capitalConsumedAmount);
      const pctConsumo = (Number(capConsumidoInd.value) * 100).toFixed(1).replace('.', ',');
      parts.push(`Embora a companhia ainda carregue prejuízos acumulados de ${prejuizo}, estes representam ${pctConsumo}% do capital social, caracterizando consumo parcial de capital, sem configurar restrição patrimonial crítica.`);
    }

    // 5. Reserva Financeira & DFC
    // Adicionar ressalva estratégica obrigatória conforme prompt "Reserva financeira elevada"
    const isCaixaAlta = indicators.some(i => i.metricName === 'Capital de Giro Líquido' && i.classification === 'ATTENTION' && String(i.rationale).includes('ociosidade'));
    if (isCaixaAlta || summary.caixaEquivalentes > summary.passivoCirculante) {
      parts.push(`A concentração relevante em disponibilidades deve ser interpretada como reserva financeira elevada no estágio atual, e não como fragilidade automática.`);
    }

    parts.push(`A recomendação patrimonial é preservar disciplina de capital, manter retenção prudencial de lucros futuros e acompanhar, em camada secundária, a conversão econômica em caixa pela DFC.`);

    return {
      text: parts.join(' '),
      narrativeMetadata: {
        generatedFromExercise: exerciseYear,
        generatedFromSummaryHash: summaryHash
      }
    };
  }
}
