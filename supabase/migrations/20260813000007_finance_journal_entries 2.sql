-- Migration: 20260813000007_finance_journal_entries.sql
-- Description: Introduces Journal Entries for strict double-entry accounting and Indicator status rules

-------------------------------------------------------------------------------
-- 1. JOURNAL ENTRIES (Invariante 0)
-------------------------------------------------------------------------------

CREATE TABLE finance.journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_id UUID NOT NULL REFERENCES finance.financial_periods(id) ON DELETE CASCADE,
    description VARCHAR(255) NOT NULL,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES tenant.users(id) ON DELETE RESTRICT
);

-- Add journal_entry_id to financial_entries
-- We will allow NULL initially to migrate data if needed, then set NOT NULL,
-- but since this is early phase we can truncate or delete existing seed entries and enforce it immediately.
-- However, we'll just add it as NULLable first, update existing data, then alter to NOT NULL.

ALTER TABLE finance.financial_entries
    ADD COLUMN journal_entry_id UUID REFERENCES finance.journal_entries(id) ON DELETE CASCADE;

-- Enforce RLS on journal_entries
ALTER TABLE finance.journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Access journal entries via period" ON finance.journal_entries
    FOR ALL USING (tenant.has_period_access(period_id));

-------------------------------------------------------------------------------
-- 2. DOUBLE-ENTRY INTEGRITY CHECK (Trigger)
-------------------------------------------------------------------------------
-- A journal entry is only valid if SUM(DEBIT) = SUM(CREDIT).
-- We can enforce this strictly at the transaction boundary (e.g. at end of transaction) using a constraint trigger.

CREATE OR REPLACE FUNCTION finance.check_journal_entry_balance()
RETURNS TRIGGER AS $$
DECLARE
    v_total_debit NUMERIC;
    v_total_credit NUMERIC;
BEGIN
    SELECT 
        COALESCE(SUM(amount) FILTER (WHERE entry_type = 'DEBIT'), 0),
        COALESCE(SUM(amount) FILTER (WHERE entry_type = 'CREDIT'), 0)
    INTO v_total_debit, v_total_credit
    FROM finance.financial_entries
    WHERE journal_entry_id = NEW.journal_entry_id;

    IF v_total_debit != v_total_credit THEN
        RAISE EXCEPTION 'Invariante 0 Violated: Journal Entry % is unbalanced. Debits: %, Credits: %', 
            NEW.journal_entry_id, v_total_debit, v_total_credit;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- DEFERRABLE trigger so it runs at the end of the transaction after all entries are inserted
CREATE CONSTRAINT TRIGGER trigger_check_journal_balance
AFTER INSERT OR UPDATE ON finance.financial_entries
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION finance.check_journal_entry_balance();

-------------------------------------------------------------------------------
-- 3. INDICATOR STATUS TYPES
-------------------------------------------------------------------------------

CREATE TYPE finance.indicator_status AS ENUM (
    'CALCULATED',
    'NOT_APPLICABLE',
    'UNDEFINED',
    'MISSING_DATA'
);

-------------------------------------------------------------------------------
-- 4. REWRITE FINANCIAL INDICATORS WITH EXPLICIT STATUS
-------------------------------------------------------------------------------

DROP VIEW IF EXISTS finance.vw_financial_indicators;

CREATE OR REPLACE VIEW finance.vw_financial_indicators AS
SELECT 
    bp.company_id,
    bp.period_date,
    
    -- Liquidez Corrente
    CASE WHEN bp.current_liabilities = 0 THEN NULL ELSE (bp.current_assets / bp.current_liabilities) END as current_ratio,
    CASE WHEN bp.current_liabilities = 0 THEN 'NOT_APPLICABLE'::finance.indicator_status ELSE 'CALCULATED'::finance.indicator_status END as current_ratio_status,
    
    -- Liquidez Seca
    CASE WHEN bp.current_liabilities = 0 THEN NULL ELSE ((bp.current_assets - bp.inventory) / bp.current_liabilities) END as quick_ratio,
    CASE WHEN bp.current_liabilities = 0 THEN 'NOT_APPLICABLE'::finance.indicator_status ELSE 'CALCULATED'::finance.indicator_status END as quick_ratio_status,
    
    -- Liquidez Imediata
    CASE WHEN bp.current_liabilities = 0 THEN NULL ELSE (bp.cash_and_equivalents / bp.current_liabilities) END as cash_ratio,
    CASE WHEN bp.current_liabilities = 0 THEN 'NOT_APPLICABLE'::finance.indicator_status ELSE 'CALCULATED'::finance.indicator_status END as cash_ratio_status,
    
    -- Estrutura de Capital
    CASE WHEN bp.total_equity = 0 THEN NULL ELSE (bp.total_liabilities_and_equity / bp.total_equity) END as debt_to_equity_ratio,
    CASE WHEN bp.total_equity = 0 THEN 'NOT_APPLICABLE'::finance.indicator_status ELSE 'CALCULATED'::finance.indicator_status END as debt_to_equity_ratio_status,
    
    CASE WHEN bp.total_liabilities_and_equity = 0 THEN NULL ELSE ((bp.short_term_debt + bp.long_term_debt) / bp.total_liabilities_and_equity) END as bank_dependency_ratio,
    CASE WHEN bp.total_liabilities_and_equity = 0 THEN 'NOT_APPLICABLE'::finance.indicator_status ELSE 'CALCULATED'::finance.indicator_status END as bank_dependency_ratio_status,
    
    -- Fleuriet (Capital de Giro) (Absolute values are always calculated)
    (bp.current_assets - bp.current_liabilities) as cgl,
    'CALCULATED'::finance.indicator_status as cgl_status,
    
    ((bp.accounts_receivable + bp.inventory + bp.other_current_assets) - (bp.suppliers + bp.labor_obligations + bp.taxes_payable + bp.other_current_liabilities)) as ncg,
    'CALCULATED'::finance.indicator_status as ncg_status,
    
    ((bp.current_assets - bp.current_liabilities) - ((bp.accounts_receivable + bp.inventory + bp.other_current_assets) - (bp.suppliers + bp.labor_obligations + bp.taxes_payable + bp.other_current_liabilities))) as treasury_balance,
    'CALCULATED'::finance.indicator_status as treasury_balance_status,
    
    -- Rentabilidade
    CASE WHEN bp.total_equity = 0 THEN NULL ELSE (dre.net_income / bp.total_equity) END as roe,
    CASE WHEN bp.total_equity = 0 THEN 'NOT_APPLICABLE'::finance.indicator_status ELSE 'CALCULATED'::finance.indicator_status END as roe_status,
    
    CASE WHEN bp.total_assets = 0 THEN NULL ELSE (dre.net_income / bp.total_assets) END as roa,
    CASE WHEN bp.total_assets = 0 THEN 'NOT_APPLICABLE'::finance.indicator_status ELSE 'CALCULATED'::finance.indicator_status END as roa_status,
    
    CASE WHEN (bp.total_equity + bp.long_term_debt + bp.short_term_debt) = 0 THEN NULL ELSE (dre.net_income / (bp.total_equity + bp.long_term_debt + bp.short_term_debt)) END as roi,
    CASE WHEN (bp.total_equity + bp.long_term_debt + bp.short_term_debt) = 0 THEN 'NOT_APPLICABLE'::finance.indicator_status ELSE 'CALCULATED'::finance.indicator_status END as roi_status,
    
    CASE WHEN dre.net_revenue = 0 THEN NULL ELSE (dre.gross_profit / dre.net_revenue) END as gross_margin,
    CASE WHEN dre.net_revenue = 0 THEN 'NOT_APPLICABLE'::finance.indicator_status ELSE 'CALCULATED'::finance.indicator_status END as gross_margin_status,
    
    CASE WHEN dre.net_revenue = 0 THEN NULL ELSE (dre.ebitda / dre.net_revenue) END as ebitda_margin,
    CASE WHEN dre.net_revenue = 0 THEN 'NOT_APPLICABLE'::finance.indicator_status ELSE 'CALCULATED'::finance.indicator_status END as ebitda_margin_status,
    
    CASE WHEN dre.net_revenue = 0 THEN NULL ELSE (dre.net_income / dre.net_revenue) END as net_margin,
    CASE WHEN dre.net_revenue = 0 THEN 'NOT_APPLICABLE'::finance.indicator_status ELSE 'CALCULATED'::finance.indicator_status END as net_margin_status,
    
    -- Ciclos
    CASE WHEN dre.cogs = 0 THEN NULL ELSE ((bp.inventory / ABS(dre.cogs)) * 30) END as pmre,
    CASE WHEN dre.cogs = 0 THEN 'NOT_APPLICABLE'::finance.indicator_status ELSE 'CALCULATED'::finance.indicator_status END as pmre_status,
    
    CASE WHEN dre.net_revenue = 0 THEN NULL ELSE ((bp.accounts_receivable / dre.net_revenue) * 30) END as pmrv,
    CASE WHEN dre.net_revenue = 0 THEN 'NOT_APPLICABLE'::finance.indicator_status ELSE 'CALCULATED'::finance.indicator_status END as pmrv_status,
    
    CASE WHEN dre.cogs = 0 THEN NULL ELSE ((bp.suppliers / ABS(dre.cogs)) * 30) END as pmpc,
    CASE WHEN dre.cogs = 0 THEN 'NOT_APPLICABLE'::finance.indicator_status ELSE 'CALCULATED'::finance.indicator_status END as pmpc_status
    
FROM finance.vw_balance_sheet bp
JOIN finance.vw_dre_statement dre ON bp.company_id = dre.company_id AND bp.period_date = dre.period_date;

-------------------------------------------------------------------------------
-- 5. REWRITE DFC TO ISOLATE CASH NET MOVEMENT
-------------------------------------------------------------------------------

DROP VIEW IF EXISTS finance.vw_cash_flow_statement;

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
cash_accounts_movement AS (
    -- Get the net effective movement directly in cash_and_equivalents accounts
    SELECT 
        fp.company_id,
        fp.period_date,
        SUM(
            CASE 
                WHEN fe.entry_type::text = a.normal_balance::text THEN fe.amount 
                ELSE -fe.amount 
            END
        ) as cash_net_movement
    FROM finance.financial_entries fe
    JOIN finance.accounts a ON fe.account_id = a.id
    JOIN finance.financial_periods fp ON fe.period_id = fp.id
    WHERE a.bp_category = 'CASH_AND_EQUIVALENTS'
    GROUP BY fp.company_id, fp.period_date
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
    (cp.operating_cash_flow + cp.investing_cash_flow + cp.financing_cash_flow) as derived_net_change_in_cash,
    COALESCE(cam.cash_net_movement, 0) as actual_cash_net_movement,
    (cb.closing_cash - COALESCE(cam.cash_net_movement, 0)) as opening_cash,
    cb.closing_cash,
    COALESCE(
        LAG(cb.closing_cash) OVER (PARTITION BY cp.company_id ORDER BY cp.period_date), 
        0
    ) as prior_period_closing_cash
FROM cf_pivot cp
LEFT JOIN cash_accounts_movement cam ON cp.company_id = cam.company_id AND cp.period_date = cam.period_date
JOIN cash_balances cb ON cp.company_id = cb.company_id AND cp.period_date = cb.period_date;

