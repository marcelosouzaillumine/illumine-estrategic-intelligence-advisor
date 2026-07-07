import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp, 
  query, 
  where, 
  getDocs, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { DATA } from '../../../data';

export class ClientsApplicationService {
  /**
   * Assina as atualizações da coleção de clientes baseando-se no papel (role) do usuário.
   */
  static subscribeToClients(
    isMaster: boolean,
    clients: any[] | null | undefined,
    onUpdate: (clientsList: any[]) => void
  ): () => void {
    if (isMaster) {
      const q = query(collection(db, "clients"));
      return onSnapshot(q, (snapshot) => {
        onUpdate(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
    } else if (clients && clients.length > 0) {
      const clientIds = clients.map((c: any) => c.id);
      if (clientIds.length <= 10) {
        const q = query(collection(db, "clients"), where("__name__", "in", clientIds));
        return onSnapshot(q, (snapshot) => {
          onUpdate(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
      } else {
        const q = query(collection(db, "clients"));
        return onSnapshot(q, (snapshot) => {
          const all = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          onUpdate(all.filter(c => clientIds.includes(c.id)));
        });
      }
    } else {
      onUpdate([]);
      return () => {}; // empty unsubscribe
    }
  }

  /**
   * Busca dados da empresa através do serviço BrasilAPI.
   */
  static async fetchCNPJData(cnpjQuery: string): Promise<any> {
    if (!cnpjQuery) throw new Error("CNPJ não fornecido.");
    
    const cleanCnpj = cnpjQuery.replace(/\D/g, "");
    if (cleanCnpj.length !== 14) throw new Error("CNPJ inválido.");
    
    const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`);
    if (!response.ok) throw new Error("CNPJ não encontrado ou erro na busca.");
    
    const data = await response.json();
    return { data, cleanCnpj };
  }

  /**
   * Salva um cliente, seja através da atualização de um existente (se editingId fornecido)
   * ou inserção de um novo documento. Também cria o plano de contas padrão para novos clientes.
   */
  static async saveClient(
    formData: any,
    editingId: string | null,
    currentUserUid: string,
    isMaster: boolean,
    isPartner: boolean,
    userPartnerIds: string[]
  ): Promise<void> {
    const clientData = {
      ...formData,
      ownerId: currentUserUid,
      updatedAt: serverTimestamp()
    };

    if (editingId) {
      await updateDoc(doc(db, "clients", editingId), clientData);
    } else {
      const clientFinalData = {
        ...clientData,
        approvalStatus: isMaster ? "Approved" : "Pending",
        partnerId: (!isMaster && isPartner && userPartnerIds && userPartnerIds.length > 0) 
          ? userPartnerIds[0] 
          : clientData.partnerId,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, "clients"), clientFinalData);
      const clientId = docRef.id;

      // Cria o plano de contas padrão automaticamente para novos clientes
      const batch = DATA.accountPlanPadrão.map(acc => {
         return addDoc(collection(db, "account_plans"), {
          ...acc,
          clientId: clientId,
          planType: "accounting",
          status: acc.status || "Ativa",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          createdBy: currentUserUid
        });
      });
      
      await Promise.all(batch);
    }
  }

  /**
   * Exclui um cliente e seus dados relacionados nas coleções auxiliares em cascata.
   */
  static async deleteClient(clientId: string): Promise<void> {
    const collectionsToClean = [
      "account_plans",
      "financial_entries",
      "client_assumptions",
      "diretrizes",
      "employees",
      "precificacao",
      "diagnostico",
      "okrs",
      "payables",
      "receivables"
    ];

    for (const coll of collectionsToClean) {
      try {
        const q = query(collection(db, coll), where("clientId", "==", clientId));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const deletePromises = snap.docs.map(d => deleteDoc(doc(db, coll, d.id)));
          await Promise.all(deletePromises);
        }
      } catch (e) {
        console.warn(`Erro ao limpar coleção ${coll} (pode não existir dados ou sem permissão):`, e);
      }
    }

    await deleteDoc(doc(db, "clients", clientId));
  }
  /**
   * Aprova um cliente.
   */
  static async approveClient(clientId: string): Promise<void> {
    await updateDoc(doc(db, "clients", clientId), { approvalStatus: "Approved" });
  }

  /**
   * Assina as atualizações da coleção de partners.
   */
  static subscribeToPartners(onUpdate: (partnersList: any[]) => void): () => void {
    const q = query(collection(db, "partners"));
    return onSnapshot(q, (snapshot) => {
      onUpdate(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }
}
