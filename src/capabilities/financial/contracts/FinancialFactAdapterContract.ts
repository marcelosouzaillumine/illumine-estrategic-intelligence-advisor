import { FinancialIndicatorsFact } from '../domain/types/FinancialIndicatorsFact';

export interface FinancialFactAdapterContract {
    getFinancialIndicators(companyId: string, periodDate: string): Promise<FinancialIndicatorsFact | null>;
}
