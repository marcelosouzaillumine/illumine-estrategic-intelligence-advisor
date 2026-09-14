BEGIN;
SELECT plan(3);

-- Enforce RLS
GRANT USAGE ON SCHEMA tenant, intelligence TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA tenant TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA intelligence TO authenticated;
SET local ROLE authenticated;

-- 1. Switch to Exec A context
SELECT set_config('request.jwt.claim.sub', 'fb_uid_tenant_a', true);

-- 2. Test Decision Immutability
SELECT throws_ok(
    $$ UPDATE intelligence.decisions SET rationale = 'Changed my mind' WHERE id = 'dddd2222-0000-0000-0000-000000000001' $$,
    'Decisions are immutable. You must supersede the decision with a new one.',
    'Cannot change the rationale of a decision'
);

SELECT throws_ok(
    $$ DELETE FROM intelligence.decisions WHERE id = 'dddd2222-0000-0000-0000-000000000001' $$,
    'Decisions cannot be deleted. Use status = ARCHIVED or SUPERSEDED.',
    'Cannot hard delete a decision'
);

-- Can update status to ARCHIVED
SELECT lives_ok(
    $$ UPDATE intelligence.decisions SET status = 'ARCHIVED' WHERE id = 'dddd2222-0000-0000-0000-000000000001' $$,
    'Can update the status of a decision to ARCHIVED'
);

SELECT * FROM finish();
ROLLBACK;
