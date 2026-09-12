import { describe, it, beforeAll, afterAll } from 'vitest';
import assert from 'node:assert';
import { Client } from 'pg';
import crypto from 'crypto';

const connectionString = 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';

describe('Gate D.3 - Audit Integrity & Zero Write Enforcement', () => {
  let adminClient: Client;
  
  const tenantA = crypto.randomUUID();
  const companyA = crypto.randomUUID();
  const userA = crypto.randomUUID();
  const userB = crypto.randomUUID();
  const roleAdmin = crypto.randomUUID();

  beforeAll(async () => {
    adminClient = new Client({ connectionString });
    await adminClient.connect();
    
    // Setup Mock Data
    await adminClient.query(`
      INSERT INTO tenant.tenants (id, name) VALUES ('${tenantA}', 'Tenant Audit A') ON CONFLICT DO NOTHING;
      INSERT INTO tenant.companies (id, tenant_id, name) VALUES ('${companyA}', '${tenantA}', 'Company Audit A') ON CONFLICT DO NOTHING;
      
      INSERT INTO tenant.users (id, external_auth_id, email, full_name) VALUES ('${userA}', 'ext-${userA}', 'audit1@a.com', 'Audit A') ON CONFLICT DO NOTHING;
      INSERT INTO tenant.users (id, external_auth_id, email, full_name) VALUES ('${userB}', 'ext-${userB}', 'audit2@b.com', 'Audit B') ON CONFLICT DO NOTHING;
      
      INSERT INTO tenant.roles (id, name) VALUES ('${roleAdmin}', 'ADMIN') ON CONFLICT DO NOTHING;
      INSERT INTO tenant.memberships (user_id, tenant_id, role_id) VALUES ('${userA}', '${tenantA}', '${roleAdmin}') ON CONFLICT DO NOTHING;
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
      await client.query('COMMIT');
      return res;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      await client.end();
    }
  };

  it('D3-01 to D3-08: AuditEventBus (via RPC) persists event correctly with full context', async () => {
    const correlationId = crypto.randomUUID();
    const metadata = JSON.stringify({ ip: '127.0.0.1' });
    
    const query = `
      SELECT audit.emit_application_event(
        $1, $2, 'TEST_EVENT', 'SYSTEM', 'sys-123', 'INFO', $3::jsonb, $4, $5
      ) as log_id;
    `;
    const res = await runAsUser(userA, query, [tenantA, userA, metadata, correlationId, companyA]);
    assert.strictEqual(res.rows.length, 1);
    
    const logId = res.rows[0].log_id;
    
    // Read the log via admin to verify fields
    const logRes = await adminClient.query(`SELECT * FROM audit.system_logs WHERE id = $1`, [logId]);
    const log = logRes.rows[0];
    
    assert.strictEqual(log.tenant_id, tenantA, 'D3-03: tenant_id preserved');
    assert.strictEqual(log.company_id, companyA, 'D3-04: company_id preserved');
    assert.strictEqual(log.actor_id, userA, 'D3-05: actor_id preserved');
    assert.ok(log.created_at, 'D3-06: timestamp generated');
    assert.strictEqual(log.correlation_id, correlationId, 'D3-07: correlation_id preserved');
    assert.strictEqual(log.metadata.ip, '127.0.0.1', 'D3-08: metadata preserved');
  });

  it('D3-09: cross-tenant audit context is rejected (User A tries to emit for a tenant they do not belong to)', async () => {
    const fakeTenant = crypto.randomUUID();
    const query = `
      SELECT audit.emit_application_event(
        $1, $2, 'TEST_EVENT', 'SYSTEM', 'sys-123', 'INFO', '{}'::jsonb, 'corr', $3
      );
    `;
    await assert.rejects(
      runAsUser(userA, query, [fakeTenant, userA, companyA]),
      /User does not belong to the specified tenant/
    );
  });

  it('D3-09b: actor spoofing is rejected (User A tries to emit as User B)', async () => {
    const query = `
      SELECT audit.emit_application_event(
        $1, $2, 'TEST_EVENT', 'SYSTEM', 'sys-123', 'INFO', '{}'::jsonb, 'corr', $3
      );
    `;
    await assert.rejects(
      runAsUser(userA, query, [tenantA, userB, companyA]),
      /Cannot spoof actor_id/
    );
  });

  it('D3-10: direct audit persistence paths are absent (Direct INSERT via client is blocked by RLS)', async () => {
    const query = `
      INSERT INTO audit.system_logs (tenant_id, actor_id, event_type, resource_type, severity)
      VALUES ($1, $2, 'HACK_EVENT', 'HACK', 'CRITICAL');
    `;
    // The policy "Block direct inserts from clients" uses FOR INSERT WITH CHECK (false)
    await assert.rejects(
      runAsUser(userA, query, [tenantA, userA]),
      /new row violates row-level security policy/
    );
  });
  
  it('D3-11: failed operation does not generate false-success audit event (DB rollback rolls back RPC)', async () => {
    // If we call emit_application_event inside a transaction and then the transaction fails, it rolls back
    const client = new Client({ connectionString });
    await client.connect();
    let logId: string | null = null;
    
    try {
      await client.query('BEGIN');
      await client.query(`SET LOCAL role authenticated;`);
      await client.query(`SET LOCAL "request.jwt.claims" = '{"sub":"ext-${userA}", "role":"authenticated"}'`);
      
      const query = `
        SELECT audit.emit_application_event(
          $1, $2, 'ROLLBACK_EVENT', 'SYSTEM', 'sys-123', 'INFO', '{}'::jsonb, 'corr', $3
        ) as log_id;
      `;
      const res = await client.query(query, [tenantA, userA, companyA]);
      logId = res.rows[0].log_id;
      
      // Simulate failure that causes rollback
      await client.query('ROLLBACK');
    } catch (e) {
      await client.query('ROLLBACK');
    } finally {
      await client.end();
    }
    
    // Verify it doesn't exist
    const logRes = await adminClient.query(`SELECT * FROM audit.system_logs WHERE id = $1`, [logId]);
    assert.strictEqual(logRes.rows.length, 0, 'D3-11: Rollback reversed the audit log');
  });
});
