import { FirestoreIdentityAdapter } from '../../adapters/persistence/FirestoreIdentityAdapter';
import { FirestoreTenantAdapter } from '../../adapters/persistence/FirestoreTenantAdapter';
import { FirestoreAuthorizationAdapter } from '../../adapters/persistence/FirestoreAuthorizationAdapter';
import { IdentityRepository } from '../../repositories/IdentityRepository';
import { TenantRepository } from '../../repositories/TenantRepository';
import { AuthorizationRepository } from '../../repositories/AuthorizationRepository';

export const identityContainer = {
  identity: new IdentityRepository(new FirestoreIdentityAdapter()),
  tenant: new TenantRepository(new FirestoreTenantAdapter()),
  authorization: new AuthorizationRepository(new FirestoreAuthorizationAdapter()),
};
