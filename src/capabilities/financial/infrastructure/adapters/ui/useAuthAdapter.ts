import { auth, login, loginWithEmail, sendPasswordResetEmail } from '../../../../../lib/firebase';

export function useAuthAdapter() {
  return {
    login,
    loginWithEmail,
    sendPasswordResetEmail,
    getCurrentUserId: () => auth.currentUser?.uid
  };
}
