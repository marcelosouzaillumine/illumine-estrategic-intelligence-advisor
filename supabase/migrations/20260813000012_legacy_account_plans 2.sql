BEGIN;
CREATE TABLE IF NOT EXISTS finance.legacy_account_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES tenant.tenants(id),
    legacy_source VARCHAR(50) DEFAULT 'FIRESTORE',
    legacy_id VARCHAR(255) UNIQUE,
    payload JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
ALTER TABLE finance.legacy_account_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Legacy isolation for account plans" ON finance.legacy_account_plans FOR ALL USING (
    company_id = auth.uid() OR auth.role() = 'service_role'
);
COMMIT;
