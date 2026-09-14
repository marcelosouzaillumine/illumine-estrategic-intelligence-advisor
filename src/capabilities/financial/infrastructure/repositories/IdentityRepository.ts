import { IIdentityPersistence } from '../../../../contracts/persistence/IIdentityPersistence';
import { User, UserProfile, Session } from '../../../../domain/identity/User';

export class IdentityRepository {
  constructor(private persistence: IIdentityPersistence) {}

  async getUserByAuthUid(uid: string): Promise<User | null> {
    return this.persistence.getUserByAuthUid(uid);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.persistence.getUserByEmail(email);
  }

  async createUser(user: User): Promise<void> {
    return this.persistence.createUser(user);
  }

  async updateUserStatus(userId: string, status: User['status']): Promise<void> {
    return this.persistence.updateUserStatus(userId, status);
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    return this.persistence.getUserProfile(userId);
  }

  async saveUserProfile(profile: UserProfile): Promise<void> {
    return this.persistence.saveUserProfile(profile);
  }

  async createSession(session: Session): Promise<void> {
    return this.persistence.createSession(session);
  }

  async revokeSession(sessionId: string): Promise<void> {
    return this.persistence.revokeSession(sessionId);
  }
}
