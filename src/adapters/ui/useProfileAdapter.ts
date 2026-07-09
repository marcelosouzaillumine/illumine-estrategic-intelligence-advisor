import { updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { logout as firebaseLogout, MASTER_ADMINS, auth } from '../../lib/firebase';
import type { User as FirebaseUser } from 'firebase/auth';

export function useProfileAdapter() {
  const isMasterAdmin = (email?: string | null) => {
    return email ? MASTER_ADMINS.includes(email) : false;
  };

  const updateProfileData = async (user: FirebaseUser, displayName: string, photoURL: string) => {
    await updateProfile(user, {
      displayName,
      photoURL
    });
  };

  const sendResetEmail = async (email: string) => {
    if (!email) return;
    await sendPasswordResetEmail(auth, email);
  };

  const performLogout = async () => {
    await firebaseLogout();
  };

  return {
    isMasterAdmin,
    updateProfileData,
    sendResetEmail,
    performLogout,
    auth // Expose for specific use cases if necessary, but ideally we'd pass user as prop
  };
}
