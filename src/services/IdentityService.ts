import { identityContainer } from '../infrastructure/container/identityContainer';
import { User, UserProfile } from '../domain/identity/User';

export class IdentityService {
  static async getUserProfile(uid: string): Promise<{ user: User; profile: UserProfile | null } | null> {
    const user = await identityContainer.identity.getUserByAuthUid(uid);
    if (!user) return null;
    const profile = await identityContainer.identity.getUserProfile(user.id);
    return { user, profile };
  }

  static async createUser(user: User): Promise<void> {
    await identityContainer.identity.createUser(user);
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    return identityContainer.identity.getUserByEmail(email);
  }
}
