export interface BPStrategicDiagnosisDrivers {
  [key: string]: number | string | boolean;
  liquidezReal: number;
  liquidezSeca: number;
  liquidezInstantaneaReal: number;
  endividamentoGeral: number;
  autonomiaFinanceira: number;
  patrimonioLiquido: number;
  dependenciaCapitalTerceiros: number;
}

export class BPStrategicDiagnosisDriverMapper {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  /**
   * Mapeia as fontes brutas de UI/dados para o formato canônico exigido
   * pelo Fiduciary Framework, garantindo que nenhum valor seja nulo,
   * indefinido, string ou NaN.
   */
  public static map(
    financialIndicators: any[],
    bpSummary: any
  ): BPStrategicDiagnosisDrivers {
    
    // Helper para garantir a conversão segura para número e fallback 0
    const safeNum = (val: any): number => {
      if (val === null || val === undefined) return 0;
      const parsed = Number(val);
      if (Number.isNaN(parsed)) return 0;
      return parsed;
    };

    const findIndicator = (name: string) => financialIndicators?.find((i: any) => i.metricName === name)?.value;

    const parseValue = (name: string, isSummary: boolean = false) => {
      const val = isSummary ? bpSummary?.[name] : findIndicator(name);
      return safeNum(val);
    };

    return {
      liquidezReal: parseValue('Liquidez Corrente'),
      liquidezSeca: parseValue('Liquidez Seca'),
      liquidezInstantaneaReal: parseValue('Liquidez Imediata'),
      endividamentoGeral: parseValue('Endividamento Geral'),
      autonomiaFinanceira: parseValue('Autonomia Financeira'),
      patrimonioLiquido: parseValue('patrimonioLiquido', true),
      dependenciaCapitalTerceiros: parseValue('Dependência de Capital de Terceiros')
    };
  }
}
