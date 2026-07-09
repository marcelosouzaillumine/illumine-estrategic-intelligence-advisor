import { updatePassword } from 'firebase/auth';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';

export function usePasswordChangeAdapter() {
  const submitPasswordChange = async (newPassword: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado.');

    // Update password in Firebase Auth
    await updatePassword(user, newPassword);

    // Remove requirePasswordChange from all associated docs
    const emailLower = user.email?.toLowerCase().trim();
    if (emailLower) {
      // Check client_users
      const clientUsersQuery = query(collection(db, 'client_users'), where('email', '==', emailLower));
      const clientUsersSnap = await getDocs(clientUsersQuery);
      const updatePromises = clientUsersSnap.docs.map(d => updateDoc(doc(db, 'client_users', d.id), { requirePasswordChange: false }));
      
      // Check partners (if applicable)
      const partnersQuery = query(collection(db, 'partners'), where('email', '==', emailLower));
      const partnersSnap = await getDocs(partnersQuery);
      updatePromises.push(...partnersSnap.docs.map(d => updateDoc(doc(db, 'partners', d.id), { requirePasswordChange: false })));

      await Promise.all(updatePromises);
    }
  };

  return { submitPasswordChange };
}
