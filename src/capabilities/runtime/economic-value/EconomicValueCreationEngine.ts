// src/core/runtime/economic-value/EconomicValueCreationEngine.ts

import { EconomicReturnOutput } from './EconomicReturnEngine';
import { ExecutiveMaturityOutput } from './ExecutiveMaturityLayer';

export class EconomicValueCreationEngine {
  public static generateNarrative(
    returnOut: EconomicReturnOutput,
    maturity: ExecutiveMaturityOutput,
    netProfit: number
  ): string {
    const isEmerging = maturity.stage === 'EMERGENTE' || maturity.stage === 'ESTRUTURANDO';
    const rateText = returnOut.returnRate.toFixed(1).replace('.', ',') + '%';

    if (returnOut.returnRate >= 12) {
      return `A operação produz retorno de ${rateText} sobre o capital empregado, superando o custo implícito de oportunidade do capital. Isto indica geração consistente e sustentável de valor econômico no período.`;
    }

    if (netProfit > 0) {
      if (returnOut.returnRate >= 6) {
        let text = `A operação é lucrativa sob a perspectiva contábil, mas o retorno de ${rateText} sobre o capital empregado é moderado e está abaixo do custo de oportunidade exigido pelos investidores.`;
        if (isEmerging) {
          text += ` Contudo, por ser uma empresa em fase de ${maturity.label.toLowerCase()}, este retorno inicial é condizente com a fase de estruturação operacional.`;
        } else {
          text += ` Caracteriza-se uma geração de valor econômico insuficiente frente aos riscos de mercado.`;
        }
        return text;
      } else {
        let text = `Apesar do lucro contábil positivo, o retorno de ${rateText} sobre o capital empregado é muito baixo, não remunerando o capital investido de forma justa.`;
        if (isEmerging) {
          text += ` Em empresas na fase ${maturity.label}, esta defasagem é comum até o atingimento da escala ideal, exigindo atenção contínua do Conselho.`;
        } else {
          text += ` Isto representa destruição líquida de valor econômico sob a ótica dos acionistas.`;
        }
        return text;
      }
    }

    // Net profit is negative
    let text = `A operação apresenta resultado contábil negativo e retorno negativo de ${rateText} sobre o capital empregado, indicando que a atividade consome mais recursos do que gera.`;
    if (isEmerging) {
      text += ` Esta queima de valor é um comportamento típico de implantação e tração da fase de ${maturity.label.toLowerCase()}, mas demanda controle rigoroso da queima de caixa (runway).`;
    } else {
      text += ` Configura-se um quadro grave de destruição acelerada de valor econômico e erosão de patrimônio, necessitando de reestruturação operacional urgente.`;
    }
    return text;
  }
}
