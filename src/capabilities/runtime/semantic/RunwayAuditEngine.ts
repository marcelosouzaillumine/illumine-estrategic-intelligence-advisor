export interface RunwayAuditResult {
  caixaDisponivel: number;
  fcoUsado: number;
  consumoMensalMedio: number;
  runwayMeses: number;
  periodoBase: string;
  formula: string;
}

export class RunwayAuditEngine {
  public static calculate(
    caixaDisponivel: number, 
    fcoUsado: number, 
    periodoBase: string = '12 meses'
  ): RunwayAuditResult {
    const isBurn = fcoUsado < 0;
    const consumoMensalMedio = isBurn ? Math.abs(fcoUsado) / 12 : 0;
    const runwayMeses = isBurn ? (caixaDisponivel / consumoMensalMedio) : Infinity;

    return {
      caixaDisponivel,
      fcoUsado,
      consumoMensalMedio,
      runwayMeses,
      periodoBase,
      formula: 'Caixa Disponível ÷ Consumo Médio Mensal (FCO / 12)'
    };
  }
}
