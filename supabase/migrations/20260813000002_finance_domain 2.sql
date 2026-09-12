-- Migration: 20260813000002_finance_domain.sql
-- Description: Canonical Financial Data Model, integrity locks, and derivations.

-------------------------------------------------------------------------------
-- 1. ENUMS & TYPES
-------------------------------------------------------------------------------
CREATE TYPE finance.period_status AS ENUM ('OPEN', 'CLOSED');
CREATE TYPE finance.account_type AS ENUM ('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE');
CREATE TYPE finance.entry_type AS ENUM ('DEBIT', 'CREDIT');

-------------------------------------------------------------------------------
-- 2. TABLES
-------------------------------------------------------------------------------

-- 2.1 Chart of Accounts
CREATE TABLE finance.chart_of_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES tenant.companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    version INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

-- 2.2 Accounts
CREATE TABLE finance.accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chart_of_account_id UUID NOT NULL REFERENCES finance.chart_of_accounts(id) ON DELETE CASCADE,
    parent_account_id UUID REFERENCES finance.accounts(id) ON DELETE RESTRICT,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    type finance.account_type NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ,
    UNIQUE(chart_of_account_id, code)
);

-- 2.3 Financial Period
CREATE TABLE finance.financial_periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES tenant.companies(id) ON DELETE CASCADE,
    period_date DATE NOT NULL, -- e.g., 2026-01-01 for January 2026
    status finance.period_status NOT NULL DEFAULT 'OPEN',
    closed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(company_id, period_date)
);

-- 2.4 Raw Financial Import (SOURCE layer)
CREATE TABLE finance.raw_imports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES tenant.companies(id) ON DELETE CASCADE,
    source_type VARCHAR(50) NOT NULL, -- e.g., 'ERP_CONTA_AZUL', 'AI_PDF_EXTRACT'
    payload JSONB NOT NULL,
    import_hash VARCHAR(255) NOT NULL, -- To prove immutability of raw data
    imported_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    imported_by UUID REFERENCES tenant.users(id) ON DELETE RESTRICT
);

-- 2.5 Financial Entries (FACT layer)
CREATE TABLE finance.financial_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_id UUID NOT NULL REFERENCES finance.financial_periods(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES finance.accounts(id) ON DELETE RESTRICT,
    raw_import_id UUID REFERENCES finance.raw_imports(id) ON DELETE SET NULL,
    amount NUMERIC(19,4) NOT NULL CHECK (amount >= 0),
    entry_type finance.entry_type NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES tenant.users(id) ON DELETE RESTRICT
);

-- 2.6 Adjustment Entries (Corrective Layer for Closed Periods)
CREATE TABLE finance.adjustment_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    financial_entry_id UUID NOT NULL REFERENCES finance.financial_entries(id) ON DELETE RESTRICT,
    amount_diff NUMERIC(19,4) NOT NULL, -- can be negative to reduce, positive to increase
    rationale TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES tenant.users(id) ON DELETE RESTRICT
);

-------------------------------------------------------------------------------
-- 3. INTEGRITY PROTECTIONS (TRIGGERS)
-------------------------------------------------------------------------------

-- Prevent modification or deletion of financial entries if the period is closed.
CREATE OR REPLACE FUNCTION finance.check_period_closed()
RETURNS TRIGGER AS $$
DECLARE
    v_status finance.period_status;
    v_period_id UUID;
BEGIN
    IF TG_OP = 'DELETE' THEN
        v_period_id := OLD.period_id;
    ELSE
        v_period_id := NEW.period_id;
    END IF;

    SELECT status INTO v_status FROM finance.financial_periods WHERE id = v_period_id;
    
    IF v_status = 'CLOSED' THEN
        RAISE EXCEPTION 'Cannot modify financial entries for a CLOSED period. Use adjustment_entries instead.';
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_closed_period
BEFORE INSERT OR UPDATE OR DELETE ON finance.financial_entries
FOR EACH ROW EXECUTE FUNCTION finance.check_period_closed();


-- Prevent modifying an adjustment entry once created (strict immutable history)
CREATE OR REPLACE FUNCTION finance.prevent_adjustment_modification()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Adjustment entries are immutable.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_immutable_adjustments
BEFORE UPDATE OR DELETE ON finance.adjustment_entries
FOR EACH ROW EXECUTE FUNCTION finance.prevent_adjustment_modification();

-------------------------------------------------------------------------------
-- 4. VIEWS (DERIVED METRICS & STATEMENTS)
-------------------------------------------------------------------------------
-- Financial Statements (DRE, BP, etc) must be derived, not duplicated manual tables.

CREATE OR REPLACE VIEW finance.v_financial_statements AS
SELECT 
    fe.period_id,
    fp.company_id,
    fp.period_date,
    a.id as account_id,
    a.code as account_code,
    a.name as account_name,
    a.type as account_type,
    fe.entry_type,
    SUM(fe.amount + COALESCE(adj_sum.total_diff, 0)) as net_amount
FROM finance.financial_entries fe
JOIN finance.financial_periods fp ON fp.id = fe.period_id
JOIN finance.accounts a ON a.id = fe.account_id
LEFT JOIN (
    SELECT financial_entry_id, SUM(amount_diff) as total_diff
    FROM finance.adjustment_entries
    GROUP BY financial_entry_id
) adj_sum ON adj_sum.financial_entry_id = fe.id
GROUP BY fe.period_id, fp.company_id, fp.period_date, a.id, a.code, a.name, a.type, fe.entry_type;


-------------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS)
-------------------------------------------------------------------------------
ALTER TABLE finance.chart_of_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.financial_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.raw_imports ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.financial_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.adjustment_entries ENABLE ROW LEVEL SECURITY;

-- Helper to check if user has access to the company via tenant
CREATE OR REPLACE FUNCTION tenant.has_company_access(p_company_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_tenant_id UUID;
BEGIN
    SELECT tenant_id INTO v_tenant_id FROM tenant.companies WHERE id = p_company_id;
    RETURN tenant.has_active_membership(v_tenant_id);
END;
$$ LANGUAGE plpgsql STABLE;

-- Helper to check if user has access to a period
CREATE OR REPLACE FUNCTION tenant.has_period_access(p_period_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_company_id UUID;
BEGIN
    SELECT company_id INTO v_company_id FROM finance.financial_periods WHERE id = p_period_id;
    RETURN tenant.has_company_access(v_company_id);
END;
$$ LANGUAGE plpgsql STABLE;

-- RLS Policies
CREATE POLICY "Access COA via company" ON finance.chart_of_accounts
    FOR ALL USING (tenant.has_company_access(company_id));

CREATE POLICY "Access accounts via COA" ON finance.accounts
    FOR ALL USING (
        tenant.has_company_access((SELECT company_id FROM finance.chart_of_accounts WHERE id = chart_of_account_id))
    );

CREATE POLICY "Access periods via company" ON finance.financial_periods
    FOR ALL USING (tenant.has_company_access(company_id));

CREATE POLICY "Access raw imports via company" ON finance.raw_imports
    FOR ALL USING (tenant.has_company_access(company_id));

CREATE POLICY "Access entries via period" ON finance.financial_entries
    FOR ALL USING (tenant.has_period_access(period_id));

CREATE POLICY "Access adjustments via entry" ON finance.adjustment_entries
    FOR ALL USING (
        tenant.has_period_access((SELECT period_id FROM finance.financial_entries WHERE id = financial_entry_id))
    );
