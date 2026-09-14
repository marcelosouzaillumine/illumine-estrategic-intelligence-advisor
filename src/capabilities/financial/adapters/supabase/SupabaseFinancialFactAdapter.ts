import { SupabaseClient } from '@supabase/supabase-js';
import { FinancialFactAdapterContract } from '../../contracts/FinancialFactAdapterContract';
import { FinancialIndicatorsFact, IndicatorStatus } from '../../domain/types/FinancialIndicatorsFact';

export class SupabaseFinancialFactAdapter implements FinancialFactAdapterContract {
    constructor(private readonly supabase: SupabaseClient) {}

    async getFinancialIndicators(companyId: string, periodDate: string): Promise<FinancialIndicatorsFact | null> {
        const { data, error } = await this.supabase
            .schema('finance')
            .from('vw_financial_indicators')
            .select('*')
            .eq('company_id', companyId)
            .eq('period_date', periodDate)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return null; // Not found
            }
            throw new Error(`Failed to fetch indicators: ${error.message}`);
        }

        return {
            companyId: data.company_id,
            periodDate: data.period_date,

            // Liquidez
            currentRatio: { value: data.current_ratio ? Number(data.current_ratio) : null, status: data.current_ratio_status as IndicatorStatus },
            quickRatio: { value: data.quick_ratio ? Number(data.quick_ratio) : null, status: data.quick_ratio_status as IndicatorStatus },
            cashRatio: { value: data.cash_ratio ? Number(data.cash_ratio) : null, status: data.cash_ratio_status as IndicatorStatus },

            // Estrutura de Capital
            debtToEquityRatio: { value: data.debt_to_equity_ratio ? Number(data.debt_to_equity_ratio) : null, status: data.debt_to_equity_ratio_status as IndicatorStatus },
            bankDependencyRatio: { value: data.bank_dependency_ratio ? Number(data.bank_dependency_ratio) : null, status: data.bank_dependency_ratio_status as IndicatorStatus },

            // Capital de Giro (Fleuriet)
            cgl: { value: data.cgl ? Number(data.cgl) : null, status: data.cgl_status as IndicatorStatus },
            ncg: { value: data.ncg ? Number(data.ncg) : null, status: data.ncg_status as IndicatorStatus },
            treasuryBalance: { value: data.treasury_balance ? Number(data.treasury_balance) : null, status: data.treasury_balance_status as IndicatorStatus },

            // Rentabilidade
            roe: { value: data.roe ? Number(data.roe) : null, status: data.roe_status as IndicatorStatus },
            roa: { value: data.roa ? Number(data.roa) : null, status: data.roa_status as IndicatorStatus },
            roi: { value: data.roi ? Number(data.roi) : null, status: data.roi_status as IndicatorStatus },
            grossMargin: { value: data.gross_margin ? Number(data.gross_margin) : null, status: data.gross_margin_status as IndicatorStatus },
            ebitdaMargin: { value: data.ebitda_margin ? Number(data.ebitda_margin) : null, status: data.ebitda_margin_status as IndicatorStatus },
            netMargin: { value: data.net_margin ? Number(data.net_margin) : null, status: data.net_margin_status as IndicatorStatus },

            // Ciclos
            pmre: { value: data.pmre ? Number(data.pmre) : null, status: data.pmre_status as IndicatorStatus },
            pmrv: { value: data.pmrv ? Number(data.pmrv) : null, status: data.pmrv_status as IndicatorStatus },
            pmpc: { value: data.pmpc ? Number(data.pmpc) : null, status: data.pmpc_status as IndicatorStatus },
        };
    }
}
