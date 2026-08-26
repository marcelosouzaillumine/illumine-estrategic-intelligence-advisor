BEGIN;
SELECT plan(6);

-- Enforce RLS
GRANT USAGE ON SCHEMA tenant, finance TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA tenant TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA finance TO authenticated;
SET local ROLE authenticated;

-- 1. Switch to Exec A context
SELECT set_config('request.jwt.claim.sub', 'fb_uid_tenant_a', true);

-- 2. Test Closed Period Protection
-- Try to insert a new entry into the closed period 'eeee0000-0000-0000-0000-000000000002'
SELECT throws_ok(
    $$ INSERT INTO finance.financial_entries (period_id, account_id, amount, entry_type) VALUES ('eeee0000-0000-0000-0000-000000000002', 'dddd0000-0000-0000-0000-000000000002', 100.00, 'CREDIT') $$,
    'Cannot modify financial entries for a CLOSED period. Use adjustment_entries instead.',
    'Cannot insert into a closed period directly'
);

-- Try to update an existing entry in the closed period
SELECT throws_ok(
    $$ UPDATE finance.financial_entries SET amount = 200000.00 WHERE id = 'ffff0000-0000-0000-0000-000000000001' $$,
    'Cannot modify financial entries for a CLOSED period. Use adjustment_entries instead.',
    'Cannot update a closed period entry'
);

-- Try to delete an existing entry in the closed period
SELECT throws_ok(
    $$ DELETE FROM finance.financial_entries WHERE id = 'ffff0000-0000-0000-0000-000000000001' $$,
    'Cannot modify financial entries for a CLOSED period. Use adjustment_entries instead.',
    'Cannot delete a closed period entry'
);

-- 3. Test Adjustment Mechanism
-- Insert an adjustment entry
INSERT INTO finance.adjustment_entries (financial_entry_id, amount_diff, rationale)
VALUES ('ffff0000-0000-0000-0000-000000000001', -50000.00, 'Correction of overbooked revenue');

-- Test that the adjustment reflects on the net value in the view
SELECT results_eq(
    $$ SELECT net_amount FROM finance.v_financial_statements WHERE account_id = 'dddd0000-0000-0000-0000-000000000002' AND period_id = 'eeee0000-0000-0000-0000-000000000002' $$,
    ARRAY[100000.00], -- Original 150000 - 50000 adjustment
    'Adjustment correctly alters the derived financial statement net amount'
);

-- 4. Test Adjustment Immutability
SELECT throws_ok(
    $$ UPDATE finance.adjustment_entries SET amount_diff = -40000.00 WHERE financial_entry_id = 'ffff0000-0000-0000-0000-000000000001' $$,
    'Adjustment entries are immutable.',
    'Cannot modify an adjustment entry after creation'
);

-- 5. Test Open Period
-- Can insert into OPEN period
SELECT lives_ok(
    $$ INSERT INTO finance.financial_entries (period_id, account_id, amount, entry_type) VALUES ('eeee0000-0000-0000-0000-000000000001', 'dddd0000-0000-0000-0000-000000000001', 500.00, 'DEBIT') $$,
    'Can insert into an open period'
);

SELECT * FROM finish();
ROLLBACK;
