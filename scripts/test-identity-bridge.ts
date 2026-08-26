import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

// Supabase Local Configuration
const SUPABASE_URL = 'http://127.0.0.1:54321';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlZmF1bHQiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY5NjQzMTEwMCwiZXhwIjoxOTI4NjM5MTAwfQ.1'; 
const JWT_SECRET = 'super-secret-jwt-token-with-at-least-32-characters-long';

async function run() {
  console.log('Starting Identity Bridge Test...');

  const firebaseUid = 'test-firebase-uid-001';
  const canonicalUserId = '22222222-2222-4222-a222-222222222222'; 
  const tenantId = '22222222-2222-4222-a222-222222222222';

  const payload = {
    iss: 'https://securetoken.google.com/gen-lang-client-0196971385',
    aud: 'gen-lang-client-0196971385',
    auth_time: Math.floor(Date.now() / 1000),
    user_id: firebaseUid,
    sub: firebaseUid,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
    email: 'test@example.com',
    email_verified: true,
    role: 'authenticated' 
  };

  const token = jwt.sign(payload, JWT_SECRET);
  console.log('Forged Firebase JWT with role:authenticated', token);

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  });

  const serviceRoleToken = jwt.sign({ role: 'service_role', exp: Math.floor(Date.now() / 1000) + 3600 }, JWT_SECRET);
  const adminClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${serviceRoleToken}` } }
  });

  console.log('Setting up identity mapping in DB...');
  
  // Seed the identity mapping
  await adminClient.schema('tenant').from('users').upsert({
    id: canonicalUserId,
    email: 'test@example.com',
    external_auth_id: firebaseUid,
    name: 'Identity Bridge Test User',
    status: 'ACTIVE'
  });

  await adminClient.schema('tenant').from('tenants').upsert({
    id: tenantId,
    name: 'Identity Bridge Tenant',
    slug: 'identity-bridge-tenant',
    status: 'ACTIVE'
  });

  const { data: roles, error: rolesError } = await adminClient.schema('tenant').from('roles').select('id').limit(1);
  if (rolesError || !roles || roles.length === 0) {
    console.error('Failed to fetch role:', rolesError);
    process.exit(1);
  }
  const roleId = roles[0].id;

  await adminClient.schema('tenant').from('memberships').upsert({
    id: '22222222-2222-4222-a222-222222222223',
    user_id: canonicalUserId,
    tenant_id: tenantId,
    role_id: roleId,
    status: 'ACTIVE'
  });

  console.log('Testing Identity Bridge Data Access...');
  const { data, error } = await supabase.schema('tenant').from('tenants').select('*');
  
  if (error) {
    console.error('Failed RLS Access:', error);
    process.exit(1);
  }

  console.log('RLS Allowed Access to Tenants:', data);

  if (data.some(t => t.id === tenantId)) {
    console.log('SUCCESS: Firebase JWT successfully resolved canonical user and bypassed RLS for the correct tenant.');
    process.exit(0);
  } else {
    console.error('FAIL: Tenant not found in RLS results.');
    process.exit(1);
  }
}

run().catch(e => { console.error(e); process.exit(1); });
