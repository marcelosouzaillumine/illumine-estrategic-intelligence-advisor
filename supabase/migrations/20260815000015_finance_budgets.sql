-- Migration: 20260815000015_finance_budgets.sql
-- Description: Creates the finance.budgets table replacing Firestore budgeting logic.

-------------------------------------------------------------------------------
-- 1. BUDGETS TABLE
-------------------------------------------------------------------------------
CREATE TABLE finance.budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES tenant.companies(id) ON DELETE CASCADE,
    period_id UUID NOT NULL REFERENCES finance.financial_periods(id) ON DELETE RESTRICT,
    account_id UUID NOT NULL REFERENCES finance.chart_of_accounts(id) ON DELETE RESTRICT,
    unit VARCHAR(100),
    branch VARCHAR(100),
    cost_center VARCHAR(100),
    amount NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'APPROVED', -- Enum: PENDING, APPROVED, REJECTED
    requires_approval BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES tenant.users(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes
CREATE INDEX idx_finance_budgets_company ON finance.budgets(company_id);
CREATE INDEX idx_finance_budgets_period ON finance.budgets(company_id, period_id);
CREATE INDEX idx_finance_budgets_account ON finance.budgets(company_id, account_id);

-------------------------------------------------------------------------------
-- 2. RLS POLICIES
-------------------------------------------------------------------------------
ALTER TABLE finance.budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view budgets of their company" 
    ON finance.budgets FOR SELECT 
    USING (tenant.has_company_access(company_id));

CREATE POLICY "Users can insert budgets to their company" 
    ON finance.budgets FOR INSERT 
    WITH CHECK (tenant.has_company_access(company_id));

CREATE POLICY "Users can update budgets of their company" 
    ON finance.budgets FOR UPDATE 
    USING (tenant.has_company_access(company_id));

CREATE POLICY "Users can delete budgets of their company" 
    ON finance.budgets FOR DELETE 
    USING (tenant.has_company_access(company_id));
