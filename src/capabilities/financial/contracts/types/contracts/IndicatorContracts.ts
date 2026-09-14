
export interface IndicatorValue {
  nome: string;
  valor: string | number;
}

export interface EconomicAssumption {
  categoria: string;
  indicadores?: IndicatorValue[];
}

export interface IndicatorSeries {
  [key: string]: unknown;
}

export interface IndicatorDataset {
  [key: string]: unknown;
}
