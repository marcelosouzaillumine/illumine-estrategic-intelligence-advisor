export type IndicatorStatus = 'CALCULATED' | 'NOT_APPLICABLE' | 'UNDEFINED' | 'MISSING_DATA';

export interface Indicator<T = number> {
    value: T | null;
    status: IndicatorStatus;
}

export interface FinancialIndicatorsFact {
    companyId: string;
    periodDate: string;

    // Liquidez
    currentRatio: Indicator;
    quickRatio: Indicator;
    cashRatio: Indicator;

    // Estrutura de Capital
    debtToEquityRatio: Indicator;
    bankDependencyRatio: Indicator;

    // Capital de Giro (Fleuriet)
    cgl: Indicator;
    ncg: Indicator;
    treasuryBalance: Indicator;

    // Rentabilidade
    roe: Indicator;
    roa: Indicator;
    roi: Indicator;
    grossMargin: Indicator;
    ebitdaMargin: Indicator;
    netMargin: Indicator;

    // Ciclos
    pmre: Indicator;
    pmrv: Indicator;
    pmpc: Indicator;
}
