import { describe, it, beforeAll, afterAll } from 'vitest';
import assert from 'node:assert';
import { Client } from 'pg';
import crypto from 'crypto';

// Setup connection string (use local supabase postgres)
const connectionString = 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';

describe('Gate D.2 - PostgreSQL Security & Semantic Certification', () => {
  let adminClient: Client;
  
  const tenantA = crypto.randomUUID();
  const companyA = crypto.randomUUID();
  const periodA = crypto.randomUUID();
  const accountCashA = crypto.randomUUID();
  const accountRevA = crypto.randomUUID();
  const userA = crypto.randomUUID();
  
  const tenantB = crypto.randomUUID();
  const companyB = crypto.randomUUID();
  const periodB = crypto.randomUUID();
  const userB = crypto.randomUUID();
  
  const roleAdmin = crypto.randomUUID();

  beforeAll(async () => {
    adminClient = new Client({ connectionString });
    await adminClient.connect();
    
    // Setup Mock Data
    await adminClient.query(`
      INSERT INTO tenant.tenants (id, name) VALUES ('${tenantA}', 'Tenant A'), ('${tenantB}', 'Tenant B') ON CONFLICT DO NOTHING;
      INSERT INTO tenant.companies (id, tenant_id, name) VALUES ('${companyA}', '${tenantA}', 'Company A'), ('${companyB}', '${tenantB}', 'Company B') ON CONFLICT DO NOTHING;
      INSERT INTO finance.financial_periods (id, company_id, status, period_date) VALUES ('${periodA}', '${companyA}', 'OPEN', '2026-01-01') ON CONFLICT DO NOTHING;
      INSERT INTO finance.chart_of_accounts (id, company_id, name) VALUES ('${accountCashA}', '${companyA}', 'Default COA') ON CONFLICT DO NOTHING;
      INSERT INTO finance.accounts (id, chart_of_account_id, code, name, type) VALUES ('${accountCashA}', '${accountCashA}', '1.1', 'Cash', 'ASSET'), ('${accountRevA}', '${accountCashA}', '3.1', 'Revenue', 'REVENUE') ON CONFLICT DO NOTHING;
      
      -- Setup Users and Memberships
      INSERT INTO tenant.users (id, external_auth_id, email, full_name) VALUES ('${userA}', 'ext-${userA}', 'a@a.com', 'A') ON CONFLICT DO NOTHING;
      INSERT INTO tenant.users (id, external_auth_id, email, full_name) VALUES ('${userB}', 'ext-${userB}', 'b@b.com', 'B') ON CONFLICT DO NOTHING;
      INSERT INTO tenant.roles (id, name) VALUES ('${roleAdmin}', 'ADMIN') ON CONFLICT DO NOTHING;
      INSERT INTO tenant.memberships (user_id, tenant_id, role_id) VALUES ('${userA}', '${tenantA}', '${roleAdmin}'), ('${userB}', '${tenantB}', '${roleAdmin}') ON CONFLICT DO NOTHING;
    `);
  });

  afterAll(async () => {
    await adminClient.end();
  });

  const runAsUser = async (userId: string, query: string, params: any[] = []) => {
    const client = new Client({ connectionString });
    await client.connect();
    try {
      await client.query('BEGIN');
      await client.query(`SET LOCAL role authenticated;`);
      await client.query(`SET LOCAL "request.jwt.claims" = '{"sub":"ext-${userId}", "role":"authenticated"}'`);
      const res = await client.query(query, params);
      await client.query('ROLLBACK');
      return res;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      await client.end();
    }
  };

  it('1. Authorized User -> Success', async () => {
    const entries = JSON.stringify([
      { account_id: accountCashA, amount: 1000, entry_type: 'DEBIT' },
      { account_id: accountRevA, amount: 1000, entry_type: 'CREDIT' }
    ]);
    
    const query = `SELECT finance.create_journal_entry($1, $2, 'Test', '2026-01-15', $3::jsonb, $4);`;
    const res = await runAsUser(userA, query, [companyA, periodA, entries, userA]);
    assert.strictEqual(res.rows.length, 1);
  });

  it('2. User without membership -> Reject', async () => {
    const entries = JSON.stringify([
      { account_id: accountCashA, amount: 1000, entry_type: 'DEBIT' },
      { account_id: accountRevA, amount: 1000, entry_type: 'CREDIT' }
    ]);
    const unknownUser = crypto.randomUUID();
    const query = `SELECT finance.create_journal_entry($1, $2, 'Test', '2026-01-15', $3::jsonb, $4);`;
    await assert.rejects(runAsUser(unknownUser, query, [companyA, periodA, entries, unknownUser]));
  });

  it('3. Different Company -> Reject', async () => {
    const entries = JSON.stringify([
      { account_id: accountCashA, amount: 1000, entry_type: 'DEBIT' },
      { account_id: accountRevA, amount: 1000, entry_type: 'CREDIT' }
    ]);
    // User A trying to write to Company B
    const query = `SELECT finance.create_journal_entry($1, $2, 'Test', '2026-01-15', $3::jsonb, $4);`;
    await assert.rejects(runAsUser(userA, query, [companyB, periodA, entries, userA]));
  });

  it('4. Different Tenant -> Reject', async () => {
    const entries = JSON.stringify([
      { account_id: accountCashA, amount: 1000, entry_type: 'DEBIT' },
      { account_id: accountRevA, amount: 1000, entry_type: 'CREDIT' }
    ]);
    // User B trying to write to Company A
    const query = `SELECT finance.create_journal_entry($1, $2, 'Test', '2026-01-15', $3::jsonb, $4);`;
    await assert.rejects(runAsUser(userB, query, [companyA, periodA, entries, userB]));
  });

  it('5. Unbalanced Journal -> Reject', async () => {
    const entries = JSON.stringify([
      { account_id: accountCashA, amount: 1000, entry_type: 'DEBIT' },
      { account_id: accountRevA, amount: 900, entry_type: 'CREDIT' } // Unbalanced
    ]);
    const query = `SELECT finance.create_journal_entry($1, $2, 'Test', '2026-01-15', $3::jsonb, $4);`;
    await assert.rejects(runAsUser(userA, query, [companyA, periodA, entries, userA]), /unbalanced/i);
  });

  it('6. Leg Error -> Full Rollback', async () => {
    // Pass an invalid account ID (simulating a leg constraint failure)
    const entries = JSON.stringify([
      { account_id: accountCashA, amount: 1000, entry_type: 'DEBIT' },
      { account_id: crypto.randomUUID(), amount: 1000, entry_type: 'CREDIT' } // Does not exist
    ]);
    const query = `SELECT finance.create_journal_entry($1, $2, 'Test', '2026-01-15', $3::jsonb, $4);`;
    await assert.rejects(runAsUser(userA, query, [companyA, periodA, entries, userA]));
  });
});
