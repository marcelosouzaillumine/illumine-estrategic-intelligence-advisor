-- =======================================================================================
-- MIGRATION: 20260813000009_finance_legacy_mirrors.sql
-- DESCRIPTION: Cria tabelas auxiliares para espelhar dados legados do Firestore (cash flows,
-- scenarios, modeling inputs) que não podem ser diretamente mapeados para o modelo
-- de partidas dobradas canônicas (journal_entries).
-- =======================================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS finance.legacy_cash_flows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES tenant.tenants(id),
    owner_id UUID,
    legacy_source VARCHAR(50) DEFAULT 'FIRESTORE',
    legacy_id VARCHAR(255) UNIQUE,
    payload JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS finance.legacy_modeling_inputs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES tenant.tenants(id),
    legacy_source VARCHAR(50) DEFAULT 'FIRESTORE',
    legacy_id VARCHAR(255) UNIQUE,
    payload JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS finance.legacy_institutional_scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES tenant.tenants(id),
    status VARCHAR(50) DEFAULT 'draft',
    legacy_source VARCHAR(50) DEFAULT 'FIRESTORE',
    legacy_id VARCHAR(255) UNIQUE,
    payload JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS finance.legacy_scenario_impacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scenario_id UUID NOT NULL REFERENCES finance.legacy_institutional_scenarios(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES tenant.tenants(id),
    revenue_impact NUMERIC(15,2) DEFAULT 0,
    legacy_source VARCHAR(50) DEFAULT 'FIRESTORE',
    legacy_id VARCHAR(255) UNIQUE,
    payload JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- RLS Policies
ALTER TABLE finance.legacy_cash_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.legacy_modeling_inputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.legacy_institutional_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.legacy_scenario_impacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Legacy isolation for cash flows" ON finance.legacy_cash_flows FOR ALL USING (
    company_id = auth.uid() OR auth.role() = 'service_role'
);

CREATE POLICY "Legacy isolation for modeling inputs" ON finance.legacy_modeling_inputs FOR ALL USING (
    company_id = auth.uid() OR auth.role() = 'service_role'
);

CREATE POLICY "Legacy isolation for scenarios" ON finance.legacy_institutional_scenarios FOR ALL USING (
    company_id = auth.uid() OR auth.role() = 'service_role'
);

CREATE POLICY "Legacy isolation for scenario impacts" ON finance.legacy_scenario_impacts FOR ALL USING (
    company_id = auth.uid() OR auth.role() = 'service_role'
);

COMMIT;
