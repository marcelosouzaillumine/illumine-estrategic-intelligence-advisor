import { auth, MASTER_ADMINS } from '../../../../../lib/firebase';

export const FirestoreAuthAdapter = {
  getCurrentUser() {
    return auth.currentUser;
  },
  getCurrentUserId() {
    return auth.currentUser?.uid || null;
  },
  getCurrentUserEmail() {
    return auth.currentUser?.email || null;
  },
  isAuthenticated() {
    return !!auth.currentUser;
  },
  isMasterAdmin() {
    const email = this.getCurrentUserEmail();
    return email ? MASTER_ADMINS.includes(email) : false;
  }
};
