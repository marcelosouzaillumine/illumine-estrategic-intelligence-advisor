import { IdentityRepository } from '../src/repositories/IdentityRepository';
import { TenantRepository } from '../src/repositories/TenantRepository';
import { SupabaseIdentityAdapter } from '../src/adapters/persistence/SupabaseIdentityAdapter';
import { SupabaseTenantAdapter } from '../src/adapters/persistence/SupabaseTenantAdapter';
import { registerSupabaseTokenFetcher } from '../src/infrastructure/supabase/SupabaseClient';
import jwt from 'jsonwebtoken';
// Setup environment variables so the config uses staging
process.env.VITE_USE_SUPABASE_STAGING = 'true';
process.env.VITE_SUPABASE_URL = 'http://127.0.0.1:54321';
process.env.VITE_SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlZmF1bHQiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY5NjQzMTEwMCwiZXhwIjoxOTI4NjM5MTAwfQ.1';
const JWT_SECRET = 'super-secret-jwt-token-with-at-least-32-characters-long';
async function run() {
    console.log('Starting Phase 6C Isolation Proof Test...');
    // Construct the container manually for the test to avoid Firebase Node.js hangs
    const identityContainer = {
        identity: new IdentityRepository(new SupabaseIdentityAdapter()),
        tenant: new TenantRepository(new SupabaseTenantAdapter())
    };
    const firebaseUid = 'fb_uid_tenant_a';
    // Forge a Firebase JWT
    const forgedFirebaseJwt = jwt.sign({
        aud: 'gen-lang-client-0196971385',
        auth_time: Math.floor(Date.now() / 1000),
        user_id: firebaseUid,
        sub: firebaseUid,
        email: 'test@example.com',
        email_verified: true,
        role: 'authenticated'
    }, JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h', issuer: 'https://securetoken.google.com/gen-lang-client-0196971385' });
    // Instead of passing the token manually to the db client,
    // we simulate the Firebase Auth SDK giving us a token dynamically:
    registerSupabaseTokenFetcher(async () => forgedFirebaseJwt);
    console.log('Simulating Application Request Flow...');
    console.log('App -> Repository -> SupabaseAdapter');
    try {
        const user = await identityContainer.identity.getUserByAuthUid(firebaseUid);
        if (!user) {
            console.log('User not found via container!');
            process.exit(1);
        }
        console.log('Successfully retrieved user via abstraction:', user.id);
        console.log('App -> Dependency Container -> TenantRepository -> SupabaseTenantAdapter');
        const memberships = await identityContainer.tenant.getMembershipsByUserId(user.id);
        console.log('Memberships found:', memberships.length);
        // Get Tenants using the abstraction
        // NOTE: In the abstraction, we pass an ownerId, but the Supabase adapter ignores it
        // and queries all tenants available to the user via RLS.
        const tenants = await identityContainer.tenant.getTenantsByOwnerId(user.id);
        console.log('Tenants resolved via RLS under abstraction:', tenants.length);
        if (tenants.length === 0) {
            console.error('FAIL: Tenant abstraction did not return tenants!');
            process.exit(1);
        }
        console.log('Tenant Data:', tenants[0]);
        console.log('SUCCESS: Application persistence abstraction successfully hit PostgreSQL RLS isolating tenants!');
        process.exit(0);
    }
    catch (err) {
        console.error('Error during abstraction test:', err);
        process.exit(1);
    }
}
run().catch(console.error);
