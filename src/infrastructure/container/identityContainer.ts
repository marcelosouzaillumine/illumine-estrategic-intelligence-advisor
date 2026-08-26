import { FirestoreIdentityAdapter } from '../../adapters/persistence/FirestoreIdentityAdapter';
import { FirestoreTenantAdapter } from '../../adapters/persistence/FirestoreTenantAdapter';
import { FirestoreAuthorizationAdapter } from '../../adapters/persistence/FirestoreAuthorizationAdapter';
import { SupabaseIdentityAdapter } from '../../adapters/persistence/SupabaseIdentityAdapter';
import { SupabaseTenantAdapter } from '../../adapters/persistence/SupabaseTenantAdapter';
import { IdentityRepository } from '../../repositories/IdentityRepository';
import { TenantRepository } from '../../repositories/TenantRepository';
import { AuthorizationRepository } from '../../repositories/AuthorizationRepository';
import { getSupabaseConfig } from '../supabase/SupabaseConfig';

const config = getSupabaseConfig();
const identityAdapter = config.useStaging ? new SupabaseIdentityAdapter() : new FirestoreIdentityAdapter();
const tenantAdapter = config.useStaging ? new SupabaseTenantAdapter() : new FirestoreTenantAdapter();

export const identityContainer = {
  identity: new IdentityRepository(identityAdapter),
  tenant: new TenantRepository(tenantAdapter),
  authorization: new AuthorizationRepository(new FirestoreAuthorizationAdapter()),
};
