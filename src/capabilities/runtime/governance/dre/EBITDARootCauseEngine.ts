export interface EBITDARootCauseReport {
  principalCause: string;
  contributions: {
    escalaInsuficiente: number;
    margemInsuficiente: number;
    estruturaExcessiva: number;
    pressaoFinanceira: number;
  };
  formattedNarrative: string;
}

export class EBITDARootCauseEngine {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  static evaluate(
    receitaLiquida: number,
    margemBruta: number,
    ebitda: number,
    despesasOperacionais: number,
    pontoEquilibrio: number
  ): EBITDARootCauseReport | null {
    if (ebitda >= 0 || receitaLiquida <= 0) {
      return null; // Apenas explica EBITDA negativo
    }

    const custosVariaveis = receitaLiquida - margemBruta;
    const mbPercent = margemBruta / receitaLiquida;
    const isEscalaInsuf = receitaLiquida < pontoEquilibrio;
    const isMargemFraca = mbPercent <= 0.40;
    
    // Cálculo simplificado de pesos/contribuição baseados na proporção de desvio
    let pesoEscala = 0;
    let pesoMargem = 0;
    let pesoEstrutura = 0;
    
    if (isEscalaInsuf) {
      // O gap de receita até o PE
      pesoEscala = (pontoEquilibrio - receitaLiquida) * (mbPercent > 0 ? mbPercent : 0.2); 
    }
    
    if (isMargemFraca) {
      // Gap da margem (ex: deveria ser 40%, é 20%) vezes a receita
      pesoMargem = (0.40 - mbPercent) * receitaLiquida;
    }
    
    if (despesasOperacionais > margemBruta && mbPercent > 0.40) {
      // Excesso de OPEX sobre a MB
      pesoEstrutura = despesasOperacionais - margemBruta;
    }

    const totalPeso = pesoEscala + pesoMargem + pesoEstrutura;
    
    if (totalPeso === 0) {
      return null;
    }

    const percEscala = Math.round((pesoEscala / totalPeso) * 100);
    const percMargem = Math.round((pesoMargem / totalPeso) * 100);
    const percEstrutura = Math.round((pesoEstrutura / totalPeso) * 100);
    
    // Determine the principal cause
    let principalCause = 'Múltiplos Fatores';
    if (percEstrutura >= percMargem && percEstrutura >= percEscala) {
      principalCause = 'Estrutura Excessiva (OPEX)';
    } else if (percEscala >= percMargem && percEscala >= percEstrutura) {
      principalCause = 'Escala Insuficiente';
    } else {
      principalCause = 'Margem Primária Insuficiente';
    }

    const formattedNarrative = `
Contribuição para a deterioração do EBITDA:
- ${principalCause === 'Estrutura Excessiva (OPEX)' ? 'Estrutura Administrativa (OPEX)' : 'Estrutura Administrativa'}: ${percEstrutura}%
- Escala Insuficiente: ${percEscala}%
- Margem de Contribuição: ${percMargem}%
`.trim();

    return {
      principalCause,
      contributions: {
        escalaInsuficiente: percEscala,
        margemInsuficiente: percMargem,
        estruturaExcessiva: percEstrutura,
        pressaoFinanceira: 0 // Simplificado para este contexto (DRE antes de juros não afeta Ebitda, então pressaoFinanceira na DRE raiz Ebitda é zero)
      },
      formattedNarrative
    };
  }
}
