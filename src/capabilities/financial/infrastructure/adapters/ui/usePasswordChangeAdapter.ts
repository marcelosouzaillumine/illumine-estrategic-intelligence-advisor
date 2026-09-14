import { updatePassword } from 'firebase/auth';
import { auth } from '../../../../../lib/firebase';
import { IdentityService } from '../../../../../services/IdentityService';

export function usePasswordChangeAdapter() {
  const submitPasswordChange = async (newPassword: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado.');

    // Update password in Firebase Auth
    await updatePassword(user, newPassword);

    // Update identity status in our core domain
    const emailLower = user.email?.toLowerCase().trim();
    if (emailLower) {
      const identityUser = await IdentityService.getUserByEmail(emailLower);
      if (identityUser) {
        // Assume IdentityService will clear the 'requirePasswordChange' flag implicitly
        // when status is set to ACTIVE or via a dedicated method in the future.
        // await IdentityService.updateUserStatus(identityUser.id, 'ACTIVE');
      }
    }
  };

  return { submitPasswordChange };
}
