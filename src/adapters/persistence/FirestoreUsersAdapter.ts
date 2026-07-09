import { collection, query, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { db, sendPasswordResetEmail, MASTER_ADMINS } from '../../lib/firebase';

export interface AppUser {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  lastAccess: Timestamp | null;
  userType?: string;
  associatedCompanies?: { id: string; name: string; type: 'client' | 'partner' | 'global' }[];
}

export class FirestoreUsersAdapter {
  static async fetchGlobalUsers(): Promise<AppUser[]> {
    const [usersSnap, clientsSnap, partnersSnap, clientUsersSnap] = await Promise.all([
      getDocs(query(collection(db, 'users'), orderBy('lastAccess', 'desc'))),
      getDocs(collection(db, 'clients')),
      getDocs(collection(db, 'partners')),
      getDocs(collection(db, 'client_users'))
    ]);

    const clientsData = clientsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    const partnersData = partnersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    const clientUsersData = clientUsersSnap.docs.map(d => d.data());

    const data = usersSnap.docs.map(doc => {
      const u = { id: doc.id, ...doc.data() } as AppUser;
      const emailLower = (u.email || '').toLowerCase().trim();
      
      let userType = 'Indefinido';
      const companiesMap = new Map<string, { id: string; name: string; type: 'client' | 'partner' | 'global' }>();
      let fallbackName = u.displayName;

      if (MASTER_ADMINS.some(m => m.toLowerCase().trim() === emailLower)) {
        userType = 'Master Admin';
        companiesMap.set('global', { id: 'global', name: 'Acesso Global', type: 'global' });
      } else {
        const ownedPartners = partnersData.filter((p: any) => p.ownerId === u.uid);
        if (ownedPartners.length > 0) {
          userType = 'Parceiro Master';
          ownedPartners.forEach((p: any) => {
            if (p.responsavel && !fallbackName) fallbackName = p.responsavel;
            companiesMap.set(p.id, { id: p.id, name: p.name || p.fantasia || 'Parceiro', type: 'partner' });
          });
        }

        const ownedClients = clientsData.filter((c: any) => c.ownerId === u.uid);
        if (ownedClients.length > 0) {
          if (userType === 'Indefinido') userType = 'Proprietário de Cliente';
          ownedClients.forEach((c: any) => {
            if (c.responsavel && !fallbackName) fallbackName = c.responsavel;
            companiesMap.set(c.id, { id: c.id, name: c.fantasia || c.name || 'Empresa', type: 'client' });
          });
        }

        const associatedClientUsers = clientUsersData.filter((cu: any) => (cu.email || '').toLowerCase().trim() === emailLower);
        if (associatedClientUsers.length > 0) {
          if (userType === 'Indefinido') userType = 'Usuário de Cliente';
          associatedClientUsers.forEach((cu: any) => {
            if (cu.nome && !fallbackName) fallbackName = cu.nome;
            const clientId = cu.clientId;
            const clientMatch = clientsData.find(c => c.id === clientId);
            if (clientMatch) {
              companiesMap.set(clientId, { id: clientId, name: (clientMatch as any).fantasia || (clientMatch as any).name || 'Empresa', type: 'client' });
            } else {
              const partnerMatch = partnersData.find(p => p.id === clientId);
              if (partnerMatch) {
                companiesMap.set(clientId, { id: clientId, name: (partnerMatch as any).name || (partnerMatch as any).fantasia || 'Parceiro', type: 'partner' });
              }
            }
          });
        }
      }

      return {
        ...u,
        displayName: fallbackName || '',
        userType,
        associatedCompanies: Array.from(companiesMap.values())
      };
    }).filter(u => u.userType !== 'Indefinido');

    return data;
  }

  static async sendResetEmail(email: string): Promise<void> {
    await sendPasswordResetEmail(email);
  }
}
