export interface ExecutivePeriod {
  type: 'monthly' | 'quarterly' | 'annual';
  month?: number;
  quarter?: number;
  year: number;
}

export interface ExecutiveContext {
  office: string;
  period: ExecutivePeriod;
  scenario: 'actual' | 'budget' | 'forecast';
  currency: string;
}
