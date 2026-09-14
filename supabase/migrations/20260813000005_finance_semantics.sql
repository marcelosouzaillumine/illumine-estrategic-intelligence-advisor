-- Migration: 20260813000005_finance_semantics.sql
-- Description: Semantic Hardening for Financial Read Models

-------------------------------------------------------------------------------
-- 1. ENUMS
-------------------------------------------------------------------------------

CREATE TYPE finance.normal_balance AS ENUM ('DEBIT', 'CREDIT');
CREATE TYPE finance.cash_flow_category AS ENUM ('OPERATING', 'INVESTING', 'FINANCING');
CREATE TYPE finance.dre_sign AS ENUM ('POSITIVE', 'NEGATIVE');

CREATE TYPE finance.bp_category AS ENUM (
    'CASH_AND_EQUIVALENTS', 
    'ACCOUNTS_RECEIVABLE', 
    'INVENTORY', 
    'OTHER_CURRENT_ASSETS',
    'FIXED_ASSETS', 
    'INTANGIBLE_ASSETS', 
    'OTHER_NON_CURRENT_ASSETS',
    'SUPPLIERS', 
    'LABOR_OBLIGATIONS', 
    'TAXES_PAYABLE', 
    'SHORT_TERM_DEBT', 
    'OTHER_CURRENT_LIABILITIES',
    'LONG_TERM_DEBT', 
    'OTHER_NON_CURRENT_LIABILITIES',
    'CAPITAL', 
    'RETAINED_EARNINGS', 
    'OTHER_EQUITY'
);

CREATE TYPE finance.dre_category AS ENUM (
    'GROSS_REVENUE', 
    'REVENUE_DEDUCTIONS', 
    'NET_REVENUE_ADJUSTMENTS', 
    'COGS', 
    'OPERATING_EXPENSES', 
    'SELLING_EXPENSES', 
    'GENERAL_ADMINISTRATIVE_EXPENSES',
    'DEPRECIATION_AMORTIZATION', 
    'OTHER_OPERATING_REVENUE', 
    'OTHER_OPERATING_EXPENSES',
    'FINANCIAL_REVENUE', 
    'FINANCIAL_EXPENSES', 
    'TAXES_ON_PROFIT', 
    'NON_OPERATING_RESULT'
);

-------------------------------------------------------------------------------
-- 2. ALTER ACCOUNTS TABLE
-------------------------------------------------------------------------------

ALTER TABLE finance.accounts 
    ADD COLUMN normal_balance finance.normal_balance,
    ADD COLUMN bp_category finance.bp_category,
    ADD COLUMN dre_category finance.dre_category,
    ADD COLUMN dre_sign finance.dre_sign,
    ADD COLUMN cash_flow_category finance.cash_flow_category;

-------------------------------------------------------------------------------
-- 3. FINANCIAL COHERENCE CONSTRAINTS (HARDENING)
-------------------------------------------------------------------------------

-- 3.1 Constraints for normal_balance based on account_type
ALTER TABLE finance.accounts
    ADD CONSTRAINT chk_normal_balance_asset_expense 
    CHECK (
        (type IN ('ASSET', 'EXPENSE') AND normal_balance = 'DEBIT') OR
        (type NOT IN ('ASSET', 'EXPENSE'))
    );

ALTER TABLE finance.accounts
    ADD CONSTRAINT chk_normal_balance_liability_equity_revenue 
    CHECK (
        (type IN ('LIABILITY', 'EQUITY', 'REVENUE') AND normal_balance = 'CREDIT') OR
        (type NOT IN ('LIABILITY', 'EQUITY', 'REVENUE'))
    );

-- 3.2 Constraints for categories isolation (An account is either BP or DRE, never both)
ALTER TABLE finance.accounts
    ADD CONSTRAINT chk_exclusive_categories 
    CHECK (
        (bp_category IS NOT NULL AND dre_category IS NULL) OR
        (dre_category IS NOT NULL AND bp_category IS NULL) OR
        (bp_category IS NULL AND dre_category IS NULL)
    );

-- 3.3 Constraints for BP types
ALTER TABLE finance.accounts
    ADD CONSTRAINT chk_bp_types 
    CHECK (
        (type IN ('ASSET', 'LIABILITY', 'EQUITY') AND dre_category IS NULL) OR
        (type NOT IN ('ASSET', 'LIABILITY', 'EQUITY'))
    );

-- 3.4 Constraints for DRE types
ALTER TABLE finance.accounts
    ADD CONSTRAINT chk_dre_types 
    CHECK (
        (type IN ('REVENUE', 'EXPENSE') AND bp_category IS NULL) OR
        (type NOT IN ('REVENUE', 'EXPENSE'))
    );

-- 3.5 Cash and Equivalents logic
ALTER TABLE finance.accounts
    ADD CONSTRAINT chk_cash_flow_source 
    CHECK (
        -- Cash and Equivalents IS the cash flow, so it doesn't belong to a source category
        (bp_category = 'CASH_AND_EQUIVALENTS' AND cash_flow_category IS NULL) OR
        (bp_category IS DISTINCT FROM 'CASH_AND_EQUIVALENTS')
    );

-- 3.6 Require DRE sign for DRE accounts
ALTER TABLE finance.accounts
    ADD CONSTRAINT chk_dre_sign_required
    CHECK (
        (dre_category IS NOT NULL AND dre_sign IS NOT NULL) OR
        (dre_category IS NULL AND dre_sign IS NULL)
    );

-------------------------------------------------------------------------------
-- 4. MATHEMATICAL FUNCTIONS
-------------------------------------------------------------------------------

-- 4.1 get_dre_impact
-- Resolves whether an entry adds to or subtracts from Net Income
CREATE OR REPLACE FUNCTION finance.get_dre_impact(
    p_entry_type finance.entry_type,
    p_amount NUMERIC,
    p_normal_balance finance.normal_balance,
    p_dre_sign finance.dre_sign
) RETURNS NUMERIC AS $$
DECLARE
    v_net_amount NUMERIC;
BEGIN
    IF p_dre_sign IS NULL THEN
        RETURN 0;
    END IF;

    -- Net movement of the account's balance
    IF (p_entry_type::text = p_normal_balance::text) THEN
        v_net_amount := p_amount;
    ELSE
        v_net_amount := -p_amount;
    END IF;

    -- Translate account movement into DRE impact
    IF p_dre_sign = 'NEGATIVE' THEN
        RETURN -v_net_amount;
    ELSE
        RETURN v_net_amount;
    END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;


-- 4.2 get_cash_flow_impact
-- Translates a change in any non-cash account into its net effect on cash
CREATE OR REPLACE FUNCTION finance.get_cash_flow_impact(
    p_entry_type finance.entry_type,
    p_amount NUMERIC,
    p_normal_balance finance.normal_balance
) RETURNS NUMERIC AS $$
DECLARE
    v_net_amount NUMERIC;
BEGIN
    IF (p_entry_type::text = p_normal_balance::text) THEN
        v_net_amount := p_amount;
    ELSE
        v_net_amount := -p_amount;
    END IF;

    -- Increase in Assets (Debit) -> Decreases Cash
    -- Increase in Liabilities/Equity/Revenue (Credit) -> Increases Cash
    IF p_normal_balance = 'DEBIT' THEN
        RETURN -v_net_amount;
    ELSE
        RETURN v_net_amount;
    END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
