BEGIN;
SELECT plan(13);

-- Setup: Enable pgtap if not exists
CREATE EXTENSION IF NOT EXISTS pgtap;

-- 1. Schema & Table verification
SELECT has_schema('tenant', 'Schema tenant exists');
SELECT has_schema('finance', 'Schema finance exists');
SELECT has_schema('intelligence', 'Schema intelligence exists');
SELECT has_table('tenant', 'companies', 'tenant.companies exists');

-- Switch to a non-superuser role to enforce RLS
GRANT USAGE ON SCHEMA tenant TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA tenant TO authenticated;
SET local ROLE authenticated;

-- 2. Switch to Exec A context (Tenant A)
-- We simulate the backend setting the external_auth_id
SELECT set_config('request.jwt.claim.sub', 'fb_uid_tenant_a', true);

-- Test 2.1: Exec A can see their own tenant's companies
SELECT results_eq(
    'SELECT name FROM tenant.companies',
    ARRAY['Company A1']::VARCHAR[],
    'Exec A sees only Company A1'
);

-- Test 2.2: Cross-tenant SELECT denial
SELECT is_empty(
    'SELECT * FROM tenant.companies WHERE name = ''Company B1''',
    'Exec A cannot see Company B1 (cross-tenant denial)'
);

-- Test 2.3: Cross-tenant INSERT denial
SELECT throws_ok(
    $$ INSERT INTO tenant.companies (tenant_id, name) VALUES ('bbbb0000-0000-0000-0000-000000000001', 'Hacked Company') $$,
    'new row violates row-level security policy for table "companies"',
    'Exec A cannot insert into Tenant B'
);

-- 3. Switch to Exec B context (Tenant B)
SELECT set_config('request.jwt.claim.sub', 'fb_uid_tenant_b', true);

-- Test 3.1: Exec B sees only Tenant B data
SELECT results_eq(
    'SELECT name FROM tenant.companies',
    ARRAY['Company B1']::VARCHAR[],
    'Exec B sees only Company B1'
);

-- 4. Switch to Inactive User context
SELECT set_config('request.jwt.claim.sub', 'fb_uid_inactive', true);

-- Test 4.1: Inactive user sees nothing
SELECT is_empty(
    'SELECT name FROM tenant.companies',
    'Inactive user sees no companies'
);

-- 5. Operator Impersonation Test
-- First, operator without impersonation session sees nothing in tenant schema
SELECT set_config('request.jwt.claim.sub', 'fb_uid_operator', true);
SELECT is_empty(
    'SELECT name FROM tenant.companies',
    'Operator sees nothing without active impersonation'
);

-- Now Operator starts impersonation of Tenant A
-- But wait, standard RLS might block inserting into audit if operator has no policy to insert impersonation?
-- Operator manages sessions. Let's see:
-- We need to ensure operator can insert.
-- We must bypass RLS for this specific operator setup just for the test if they don't have insert policy, but we have "Operators can manage sessions" for ALL.
INSERT INTO audit.impersonation_sessions (operator_user_id, target_tenant_id, reason, status)
VALUES ('11111111-1111-1111-1111-111111111111', 'aaaa0000-0000-0000-0000-000000000001', 'Support Ticket #123', 'ACTIVE');

-- Operator should now see Tenant A's company
SELECT results_eq(
    'SELECT name FROM tenant.companies',
    ARRAY['Company A1']::VARCHAR[],
    'Operator sees Company A1 via active impersonation'
);

-- End impersonation
UPDATE audit.impersonation_sessions SET status = 'TERMINATED' WHERE operator_user_id = '11111111-1111-1111-1111-111111111111';

-- Operator should see nothing again
SELECT is_empty(
    'SELECT name FROM tenant.companies',
    'Operator sees nothing after terminating impersonation'
);

-- Check Audit Log for Impersonator
-- Re-activate impersonation
INSERT INTO audit.impersonation_sessions (operator_user_id, target_tenant_id, reason, status)
VALUES ('11111111-1111-1111-1111-111111111111', 'aaaa0000-0000-0000-0000-000000000001', 'Support Ticket #124', 'ACTIVE');

-- Insert a period to trigger audit
INSERT INTO finance.financial_periods (company_id, period_date, status) 
VALUES ('aaaa1111-0000-0000-0000-000000000001', '2026-02-01', 'OPEN');

-- Verify audit log contains the impersonator ID
SELECT row_eq(
    $$ SELECT impersonator_id FROM audit.system_logs WHERE table_name = 'financial_periods' ORDER BY created_at DESC LIMIT 1 $$,
    ROW('11111111-1111-1111-1111-111111111111'::UUID),
    'Audit log correctly records the impersonator ID'
);

SELECT * FROM finish();
ROLLBACK;
