-- Seed Data for Phase 5 Testing

INSERT INTO tenant.roles (id, name, description) VALUES
('00000000-0000-0000-0000-000000000001', 'OPERATOR', 'Platform Operator'),
('00000000-0000-0000-0000-000000000002', 'EXECUTIVE', 'Company Executive'),
('00000000-0000-0000-0000-000000000003', 'ADVISOR', 'Financial Advisor');

INSERT INTO tenant.users (id, external_auth_id, email, full_name) VALUES
('11111111-1111-1111-1111-111111111111', 'fb_uid_operator', 'operator@illumine.com', 'Platform Op'),
('22222222-2222-2222-2222-222222222222', 'fb_uid_tenant_a', 'exec_a@company.com', 'Exec A'),
('33333333-3333-3333-3333-333333333333', 'fb_uid_tenant_b', 'exec_b@company.com', 'Exec B'),
('44444444-4444-4444-4444-444444444444', 'fb_uid_inactive', 'inactive@company.com', 'Inactive User');

INSERT INTO tenant.tenants (id, name) VALUES
('aaaa0000-0000-0000-0000-000000000001', 'Tenant A - Consulting'),
('bbbb0000-0000-0000-0000-000000000001', 'Tenant B - Holding'),
('00000000-0000-0000-0000-000000000000', 'System Tenant');

INSERT INTO tenant.companies (id, tenant_id, name) VALUES
('aaaa1111-0000-0000-0000-000000000001', 'aaaa0000-0000-0000-0000-000000000001', 'Company A1'),
('bbbb1111-0000-0000-0000-000000000001', 'bbbb0000-0000-0000-0000-000000000001', 'Company B1');

INSERT INTO tenant.memberships (user_id, tenant_id, role_id, status) VALUES
('22222222-2222-2222-2222-222222222222', 'aaaa0000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'ACTIVE'), -- Exec A in Tenant A
('33333333-3333-3333-3333-333333333333', 'bbbb0000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'ACTIVE'), -- Exec B in Tenant B
('44444444-4444-4444-4444-444444444444', 'aaaa0000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'INACTIVE'), -- Inactive in A
('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000001', 'ACTIVE'); -- Operator in System Tenant

INSERT INTO finance.chart_of_accounts (id, company_id, name) VALUES
('cccc0000-0000-0000-0000-000000000001', 'aaaa1111-0000-0000-0000-000000000001', 'Standard COA A');

INSERT INTO finance.accounts (id, chart_of_account_id, code, name, type, normal_balance, bp_category, dre_category, dre_sign, cash_flow_category) VALUES
('dddd0000-0000-0000-0000-000000000001', 'cccc0000-0000-0000-0000-000000000001', '1.0', 'Assets (Caixa)', 'ASSET', 'DEBIT', 'CASH_AND_EQUIVALENTS', NULL, NULL, NULL),
('dddd0000-0000-0000-0000-000000000002', 'cccc0000-0000-0000-0000-000000000001', '3.0', 'Revenue', 'REVENUE', 'CREDIT', NULL, 'GROSS_REVENUE', 'POSITIVE', 'OPERATING');

INSERT INTO finance.financial_periods (id, company_id, period_date, status) VALUES
('eeee0000-0000-0000-0000-000000000001', 'aaaa1111-0000-0000-0000-000000000001', '2026-01-01', 'OPEN'),
('eeee0000-0000-0000-0000-000000000002', 'aaaa1111-0000-0000-0000-000000000001', '2025-12-01', 'OPEN');

INSERT INTO finance.journal_entries (id, period_id, description, transaction_date) VALUES
('99990000-0000-0000-0000-000000000001', 'eeee0000-0000-0000-0000-000000000002', 'Initial Capital Injection', '2025-12-01');

INSERT INTO finance.financial_entries (id, period_id, account_id, amount, entry_type, journal_entry_id) VALUES
('ffff0000-0000-0000-0000-000000000001', 'eeee0000-0000-0000-0000-000000000002', 'dddd0000-0000-0000-0000-000000000002', 150000.00, 'CREDIT', '99990000-0000-0000-0000-000000000001'),
('ffff0000-0000-0000-0000-000000000002', 'eeee0000-0000-0000-0000-000000000002', 'dddd0000-0000-0000-0000-000000000001', 150000.00, 'DEBIT', '99990000-0000-0000-0000-000000000001');

-- Finalize seeded journal entries
UPDATE finance.journal_entries SET status = 'FINALIZED' WHERE id = '99990000-0000-0000-0000-000000000001';

-- Close the period after inserting the historical entry
UPDATE finance.financial_periods SET status = 'CLOSED' WHERE id = 'eeee0000-0000-0000-0000-000000000002';

INSERT INTO intelligence.ai_provenance (id, company_id, provider, model) VALUES
('aaaa2222-0000-0000-0000-000000000001', 'aaaa1111-0000-0000-0000-000000000001', 'LEGACY_FIREBASE', 'UNKNOWN');

INSERT INTO intelligence.insights (id, company_id, ai_provenance_id, title, description) VALUES
('bbbb2222-0000-0000-0000-000000000001', 'aaaa1111-0000-0000-0000-000000000001', 'aaaa2222-0000-0000-0000-000000000001', 'Revenue Growth', 'Good growth.');

INSERT INTO intelligence.recommendations (id, insight_id, description) VALUES
('cccc2222-0000-0000-0000-000000000001', 'bbbb2222-0000-0000-0000-000000000001', 'Invest more.');

INSERT INTO intelligence.decisions (id, company_id, recommendation_id, decided_by, problem_statement, selected_alternative, rationale) VALUES
('dddd2222-0000-0000-0000-000000000001', 'aaaa1111-0000-0000-0000-000000000001', 'cccc2222-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'Growth needed', 'Invest', 'Because.');

INSERT INTO intelligence.action_plans (id, decision_id, title) VALUES
('eeee2222-0000-0000-0000-000000000001', 'dddd2222-0000-0000-0000-000000000001', 'Execute investment');

INSERT INTO intelligence.outcomes (decision_id, type, expected_result) VALUES
('dddd2222-0000-0000-0000-000000000001', 'QUANTITATIVE', '+10% Growth');
