import { IIdentityPersistence } from '../../../../../contracts/persistence/IIdentityPersistence';
import { User, UserProfile, Session } from '../../../../../domain/identity/User';
import { getSupabaseClient } from '../../../../../infrastructure/supabase/SupabaseClient';

export class SupabaseIdentityAdapter implements IIdentityPersistence {
  async getUserByAuthUid(uid: string): Promise<User | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .schema('tenant')
      .from('users')
      .select('*')
      .eq('external_auth_id', uid)
      .single();

    if (error || !data) return null;
    return this.mapToUser(data);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .schema('tenant')
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (error || !data) return null;
    return this.mapToUser(data);
  }

  async createUser(user: User): Promise<void> {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .schema('tenant')
      .from('users')
      .insert({
        id: user.id,
        external_auth_id: user.authUid,
        email: user.email,
        full_name: user.email.split('@')[0], // fallback since domain User might not have fullName at this point
        status: user.status
      });

    if (error) throw new Error(error.message);
  }

  async updateUserStatus(userId: string, status: User['status']): Promise<void> {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .schema('tenant')
      .from('users')
      .update({ status })
      .eq('id', userId);

    if (error) throw new Error(error.message);
  }

  // Profile and Session are out of scope for the Phase 6 isolation proof, 
  // but implemented as stubs so the Domain contract isn't broken.
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    return null; 
  }

  async saveUserProfile(profile: UserProfile): Promise<void> {
    // Stub
  }

  async createSession(session: Session): Promise<void> {
    // Stub
  }

  async revokeSession(sessionId: string): Promise<void> {
    // Stub
  }

  private mapToUser(row: any): User {
    return {
      id: row.id,
      authUid: row.external_auth_id,
      email: row.email,
      status: row.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE',
      createdAt: new Date(row.created_at)
    };
  }
}
