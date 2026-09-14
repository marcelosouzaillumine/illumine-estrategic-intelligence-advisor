-- Migration: 20260813000006_finance_views.sql
-- Description: Financial Read Models (DRE, BP, DFC, Indicators)

-------------------------------------------------------------------------------
-- 1. DRE (INCOME STATEMENT)
-------------------------------------------------------------------------------

CREATE OR REPLACE VIEW finance.vw_dre_statement AS
WITH dre_totals AS (
    SELECT 
        fe.period_id,
        fp.company_id,
        fp.period_date,
        a.dre_category,
        SUM(finance.get_dre_impact(fe.entry_type, fe.amount, a.normal_balance, a.dre_sign)) as total_amount
    FROM finance.financial_entries fe
    JOIN finance.accounts a ON fe.account_id = a.id
    JOIN finance.financial_periods fp ON fe.period_id = fp.id
    WHERE a.dre_category IS NOT NULL
    GROUP BY fe.period_id, fp.company_id, fp.period_date, a.dre_category
),
dre_pivot AS (
    SELECT 
        period_id,
        company_id,
        period_date,
        COALESCE(SUM(total_amount) FILTER (WHERE dre_category = 'GROSS_REVENUE'), 0) as gross_revenue,
        COALESCE(SUM(total_amount) FILTER (WHERE dre_category = 'REVENUE_DEDUCTIONS'), 0) as revenue_deductions,
        COALESCE(SUM(total_amount) FILTER (WHERE dre_category = 'NET_REVENUE_ADJUSTMENTS'), 0) as net_revenue_adjustments,
        COALESCE(SUM(total_amount) FILTER (WHERE dre_category = 'COGS'), 0) as cogs,
        COALESCE(SUM(total_amount) FILTER (WHERE dre_category = 'OPERATING_EXPENSES'), 0) as operating_expenses,
        COALESCE(SUM(total_amount) FILTER (WHERE dre_category = 'SELLING_EXPENSES'), 0) as selling_expenses,
        COALESCE(SUM(total_amount) FILTER (WHERE dre_category = 'GENERAL_ADMINISTRATIVE_EXPENSES'), 0) as general_administrative_expenses,
        COALESCE(SUM(total_amount) FILTER (WHERE dre_category = 'DEPRECIATION_AMORTIZATION'), 0) as depreciation_amortization,
        COALESCE(SUM(total_amount) FILTER (WHERE dre_category = 'OTHER_OPERATING_REVENUE'), 0) as other_operating_revenue,
        COALESCE(SUM(total_amount) FILTER (WHERE dre_category = 'OTHER_OPERATING_EXPENSES'), 0) as other_operating_expenses,
        COALESCE(SUM(total_amount) FILTER (WHERE dre_category = 'FINANCIAL_REVENUE'), 0) as financial_revenue,
        COALESCE(SUM(total_amount) FILTER (WHERE dre_category = 'FINANCIAL_EXPENSES'), 0) as financial_expenses,
        COALESCE(SUM(total_amount) FILTER (WHERE dre_category = 'TAXES_ON_PROFIT'), 0) as taxes_on_profit,
        COALESCE(SUM(total_amount) FILTER (WHERE dre_category = 'NON_OPERATING_RESULT'), 0) as non_operating_result
    FROM dre_totals
    GROUP BY period_id, company_id, period_date
)
SELECT 
    period_id,
    company_id,
    period_date,
    gross_revenue,
    revenue_deductions,
    net_revenue_adjustments,
    -- 1. Receita Liquida
    (gross_revenue + revenue_deductions + net_revenue_adjustments) as net_revenue,
    cogs,
    -- 2. Resultado Bruto
    (gross_revenue + revenue_deductions + net_revenue_adjustments + cogs) as gross_profit,
    operating_expenses,
    selling_expenses,
    general_administrative_expenses,
    other_operating_revenue,
    other_operating_expenses,
    -- 3. EBITDA
    (
        (gross_revenue + revenue_deductions + net_revenue_adjustments + cogs)
        + operating_expenses + selling_expenses + general_administrative_expenses 
        + other_operating_revenue + other_operating_expenses
    ) as ebitda,
    depreciation_amortization,
    -- 4. EBIT
    (
        (gross_revenue + revenue_deductions + net_revenue_adjustments + cogs)
        + operating_expenses + selling_expenses + general_administrative_expenses 
        + other_operating_revenue + other_operating_expenses
        + depreciation_amortization
    ) as ebit,
    financial_revenue,
    financial_expenses,
    -- 5. LAIR (Lucro Antes do Imposto de Renda)
    (
        (gross_revenue + revenue_deductions + net_revenue_adjustments + cogs)
        + operating_expenses + selling_expenses + general_administrative_expenses 
        + other_operating_revenue + other_operating_expenses
        + depreciation_amortization
        + financial_revenue + financial_expenses
    ) as ebt,
    taxes_on_profit,
    non_operating_result,
    -- 6. Lucro Liquido
    (
        (gross_revenue + revenue_deductions + net_revenue_adjustments + cogs)
        + operating_expenses + selling_expenses + general_administrative_expenses 
        + other_operating_revenue + other_operating_expenses
        + depreciation_amortization
        + financial_revenue + financial_expenses
        + taxes_on_profit
        + non_operating_result
    ) as net_income
FROM dre_pivot;


-------------------------------------------------------------------------------
-- 2. BALANCE SHEET
-------------------------------------------------------------------------------

CREATE OR REPLACE VIEW finance.vw_cumulative_net_income AS
SELECT 
    p1.company_id,
    p1.period_date,
    SUM(dre.net_income) as cumulative_net_income
FROM (SELECT DISTINCT company_id, period_date FROM finance.financial_periods) p1
JOIN finance.vw_dre_statement dre 
    ON p1.company_id = dre.company_id 
    AND dre.period_date <= p1.period_date
GROUP BY p1.company_id, p1.period_date;

CREATE OR REPLACE VIEW finance.vw_balance_sheet AS
WITH bp_totals_per_period AS (
    SELECT 
        fp.company_id,
        fp.period_date,
        a.bp_category,
        SUM(
            CASE 
                WHEN fe.entry_type::text = a.normal_balance::text THEN fe.amount 
                ELSE -fe.amount 
            END
        ) as net_period_amount
    FROM finance.financial_entries fe
    JOIN finance.accounts a ON fe.account_id = a.id
    JOIN finance.financial_periods fp ON fe.period_id = fp.id
    WHERE a.bp_category IS NOT NULL
    GROUP BY fp.company_id, fp.period_date, a.bp_category
),
cumulative_balances AS (
    SELECT
        p1.company_id,
        p1.period_date,
        b.bp_category,
        SUM(b.net_period_amount) as cumulative_amount
    FROM (SELECT DISTINCT company_id, period_date FROM finance.financial_periods) p1
    JOIN bp_totals_per_period b 
        ON p1.company_id = b.company_id 
        AND b.period_date <= p1.period_date
    GROUP BY p1.company_id, p1.period_date, b.bp_category
),
bp_pivot AS (
    SELECT
        company_id,
        period_date,
        COALESCE(SUM(cumulative_amount) FILTER (WHERE bp_category = 'CASH_AND_EQUIVALENTS'), 0) as cash_and_equivalents,
        COALESCE(SUM(cumulative_amount) FILTER (WHERE bp_category = 'ACCOUNTS_RECEIVABLE'), 0) as accounts_receivable,
        COALESCE(SUM(cumulative_amount) FILTER (WHERE bp_category = 'INVENTORY'), 0) as inventory,
        COALESCE(SUM(cumulative_amount) FILTER (WHERE bp_category = 'OTHER_CURRENT_ASSETS'), 0) as other_current_assets,
        COALESCE(SUM(cumulative_amount) FILTER (WHERE bp_category = 'FIXED_ASSETS'), 0) as fixed_assets,
        COALESCE(SUM(cumulative_amount) FILTER (WHERE bp_category = 'INTANGIBLE_ASSETS'), 0) as intangible_assets,
        COALESCE(SUM(cumulative_amount) FILTER (WHERE bp_category = 'OTHER_NON_CURRENT_ASSETS'), 0) as other_non_current_assets,
        
        COALESCE(SUM(cumulative_amount) FILTER (WHERE bp_category = 'SUPPLIERS'), 0) as suppliers,
        COALESCE(SUM(cumulative_amount) FILTER (WHERE bp_category = 'LABOR_OBLIGATIONS'), 0) as labor_obligations,
        COALESCE(SUM(cumulative_amount) FILTER (WHERE bp_category = 'TAXES_PAYABLE'), 0) as taxes_payable,
        COALESCE(SUM(cumulative_amount) FILTER (WHERE bp_category = 'SHORT_TERM_DEBT'), 0) as short_term_debt,
        COALESCE(SUM(cumulative_amount) FILTER (WHERE bp_category = 'OTHER_CURRENT_LIABILITIES'), 0) as other_current_liabilities,
        
        COALESCE(SUM(cumulative_amount) FILTER (WHERE bp_category = 'LONG_TERM_DEBT'), 0) as long_term_debt,
        COALESCE(SUM(cumulative_amount) FILTER (WHERE bp_category = 'OTHER_NON_CURRENT_LIABILITIES'), 0) as other_non_current_liabilities,
        
        COALESCE(SUM(cumulative_amount) FILTER (WHERE bp_category = 'CAPITAL'), 0) as capital,
        COALESCE(SUM(cumulative_amount) FILTER (WHERE bp_category = 'RETAINED_EARNINGS'), 0) as retained_earnings,
        COALESCE(SUM(cumulative_amount) FILTER (WHERE bp_category = 'OTHER_EQUITY'), 0) as other_equity
    FROM cumulative_balances
    GROUP BY company_id, period_date
)
SELECT 
    bp.company_id,
    bp.period_date,
    bp.cash_and_equivalents,
    bp.accounts_receivable,
    bp.inventory,
    bp.other_current_assets,
    (bp.cash_and_equivalents + bp.accounts_receivable + bp.inventory + bp.other_current_assets) as current_assets,
    
    bp.fixed_assets,
    bp.intangible_assets,
    bp.other_non_current_assets,
    (bp.fixed_assets + bp.intangible_assets + bp.other_non_current_assets) as non_current_assets,
    
    (bp.cash_and_equivalents + bp.accounts_receivable + bp.inventory + bp.other_current_assets + bp.fixed_assets + bp.intangible_assets + bp.other_non_current_assets) as total_assets,
    
    bp.suppliers,
    bp.labor_obligations,
    bp.taxes_payable,
    bp.short_term_debt,
    bp.other_current_liabilities,
    (bp.suppliers + bp.labor_obligations + bp.taxes_payable + bp.short_term_debt + bp.other_current_liabilities) as current_liabilities,
    
    bp.long_term_debt,
    bp.other_non_current_liabilities,
    (bp.long_term_debt + bp.other_non_current_liabilities) as non_current_liabilities,
    
    bp.capital,
    bp.retained_earnings,
    bp.other_equity,
    COALESCE(cni.cumulative_net_income, 0) as accumulated_net_income,
    
    (bp.capital + bp.retained_earnings + bp.other_equity + COALESCE(cni.cumulative_net_income, 0)) as total_equity,
    
    (
        (bp.suppliers + bp.labor_obligations + bp.taxes_payable + bp.short_term_debt + bp.other_current_liabilities)
        + (bp.long_term_debt + bp.other_non_current_liabilities)
        + (bp.capital + bp.retained_earnings + bp.other_equity + COALESCE(cni.cumulative_net_income, 0))
    ) as total_liabilities_and_equity
FROM bp_pivot bp
LEFT JOIN finance.vw_cumulative_net_income cni 
    ON bp.company_id = cni.company_id AND bp.period_date = cni.period_date;

-------------------------------------------------------------------------------
-- 3. CASH FLOW STATEMENT
-------------------------------------------------------------------------------

CREATE OR REPLACE VIEW finance.vw_cash_flow_statement AS
WITH cf_totals AS (
    SELECT 
        fp.company_id,
        fp.period_date,
        a.cash_flow_category,
        SUM(finance.get_cash_flow_impact(fe.entry_type, fe.amount, a.normal_balance)) as amount
    FROM finance.financial_entries fe
    JOIN finance.accounts a ON fe.account_id = a.id
    JOIN finance.financial_periods fp ON fe.period_id = fp.id
    WHERE a.cash_flow_category IS NOT NULL
    GROUP BY fp.company_id, fp.period_date, a.cash_flow_category
),
cf_pivot AS (
    SELECT 
        company_id,
        period_date,
        COALESCE(SUM(amount) FILTER (WHERE cash_flow_category = 'OPERATING'), 0) as operating_cash_flow,
        COALESCE(SUM(amount) FILTER (WHERE cash_flow_category = 'INVESTING'), 0) as investing_cash_flow,
        COALESCE(SUM(amount) FILTER (WHERE cash_flow_category = 'FINANCING'), 0) as financing_cash_flow
    FROM cf_totals
    GROUP BY company_id, period_date
),
cash_balances AS (
    SELECT company_id, period_date, cash_and_equivalents as closing_cash
    FROM finance.vw_balance_sheet
)
SELECT 
    cp.company_id,
    cp.period_date,
    cp.operating_cash_flow,
    cp.investing_cash_flow,
    cp.financing_cash_flow,
    (cp.operating_cash_flow + cp.investing_cash_flow + cp.financing_cash_flow) as net_change_in_cash,
    (cb.closing_cash - (cp.operating_cash_flow + cp.investing_cash_flow + cp.financing_cash_flow)) as opening_cash,
    cb.closing_cash,
    COALESCE(
        LAG(cb.closing_cash) OVER (PARTITION BY cp.company_id ORDER BY cp.period_date), 
        0
    ) as prior_period_closing_cash
FROM cf_pivot cp
JOIN cash_balances cb ON cp.company_id = cb.company_id AND cp.period_date = cb.period_date;

-------------------------------------------------------------------------------
-- 4. FINANCIAL INDICATORS
-------------------------------------------------------------------------------

CREATE OR REPLACE VIEW finance.vw_financial_indicators AS
SELECT 
    bp.company_id,
    bp.period_date,
    
    -- Liquidez
    CASE WHEN bp.current_liabilities = 0 THEN 0 ELSE (bp.current_assets / bp.current_liabilities) END as current_ratio,
    CASE WHEN bp.current_liabilities = 0 THEN 0 ELSE ((bp.current_assets - bp.inventory) / bp.current_liabilities) END as quick_ratio,
    CASE WHEN bp.current_liabilities = 0 THEN 0 ELSE (bp.cash_and_equivalents / bp.current_liabilities) END as cash_ratio,
    
    -- Estrutura de Capital
    CASE WHEN bp.total_equity = 0 THEN 0 ELSE (bp.total_liabilities_and_equity / bp.total_equity) END as debt_to_equity_ratio,
    CASE WHEN bp.total_liabilities_and_equity = 0 THEN 0 ELSE ((bp.short_term_debt + bp.long_term_debt) / bp.total_liabilities_and_equity) END as bank_dependency_ratio,
    
    -- Fleuriet (Capital de Giro)
    (bp.current_assets - bp.current_liabilities) as cgl,
    ((bp.accounts_receivable + bp.inventory + bp.other_current_assets) - (bp.suppliers + bp.labor_obligations + bp.taxes_payable + bp.other_current_liabilities)) as ncg,
    ((bp.current_assets - bp.current_liabilities) - ((bp.accounts_receivable + bp.inventory + bp.other_current_assets) - (bp.suppliers + bp.labor_obligations + bp.taxes_payable + bp.other_current_liabilities))) as treasury_balance,
    
    -- Rentabilidade
    CASE WHEN bp.total_equity = 0 THEN 0 ELSE (dre.net_income / bp.total_equity) END as roe,
    CASE WHEN bp.total_assets = 0 THEN 0 ELSE (dre.net_income / bp.total_assets) END as roa,
    CASE WHEN (bp.total_equity + bp.long_term_debt + bp.short_term_debt) = 0 THEN 0 ELSE (dre.net_income / (bp.total_equity + bp.long_term_debt + bp.short_term_debt)) END as roi,
    
    CASE WHEN dre.net_revenue = 0 THEN 0 ELSE (dre.gross_profit / dre.net_revenue) END as gross_margin,
    CASE WHEN dre.net_revenue = 0 THEN 0 ELSE (dre.ebitda / dre.net_revenue) END as ebitda_margin,
    CASE WHEN dre.net_revenue = 0 THEN 0 ELSE (dre.net_income / dre.net_revenue) END as net_margin,
    
    -- Ciclos
    CASE WHEN dre.cogs = 0 THEN 0 ELSE ((bp.inventory / ABS(dre.cogs)) * 30) END as pmre,
    CASE WHEN dre.net_revenue = 0 THEN 0 ELSE ((bp.accounts_receivable / dre.net_revenue) * 30) END as pmrv,
    CASE WHEN dre.cogs = 0 THEN 0 ELSE ((bp.suppliers / ABS(dre.cogs)) * 30) END as pmpc
    
FROM finance.vw_balance_sheet bp
JOIN finance.vw_dre_statement dre ON bp.company_id = dre.company_id AND bp.period_date = dre.period_date;
