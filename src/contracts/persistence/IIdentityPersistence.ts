import { User, UserProfile, Session } from '../../domain/identity/User';

export interface IIdentityPersistence {
  getUserByAuthUid(uid: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  createUser(user: User): Promise<void>;
  updateUserStatus(userId: string, status: User['status']): Promise<void>;
  
  getUserProfile(userId: string): Promise<UserProfile | null>;
  saveUserProfile(profile: UserProfile): Promise<void>;

  createSession(session: Session): Promise<void>;
  revokeSession(sessionId: string): Promise<void>;
}
