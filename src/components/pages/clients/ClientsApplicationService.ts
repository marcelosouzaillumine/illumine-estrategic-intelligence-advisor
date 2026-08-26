import { SupabaseClientsAdapter } from '../../../adapters/persistence/SupabaseClientsAdapter';
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
    return SupabaseClientsAdapter.subscribeToClients(isMaster, clients, onUpdate);
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
      updatedAt: SupabaseClientsAdapter.getServerTimestamp()
    };

    if (editingId) {
      await SupabaseClientsAdapter.updateClient(editingId, clientData);
    } else {
      const clientFinalData = {
        ...clientData,
        approvalStatus: isMaster ? "Approved" : "Pending",
        partnerId: (!isMaster && isPartner && userPartnerIds && userPartnerIds.length > 0) 
          ? userPartnerIds[0] 
          : clientData.partnerId,
        createdAt: SupabaseClientsAdapter.getServerTimestamp()
      };

      const clientId = await SupabaseClientsAdapter.addClient(clientFinalData);

      // Cria o plano de contas padrão automaticamente para novos clientes
      const plans = DATA.accountPlanPadrão.map(acc => {
         return {
          ...acc,
          clientId: clientId,
          planType: "accounting",
          status: acc.status || "Ativa",
          createdAt: SupabaseClientsAdapter.getServerTimestamp(),
          updatedAt: SupabaseClientsAdapter.getServerTimestamp(),
          createdBy: currentUserUid
        };
      });
      
      await SupabaseClientsAdapter.createAccountPlanBatch(plans);
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

    await SupabaseClientsAdapter.deleteClientCascade(clientId, collectionsToClean);
  }
  /**
   * Aprova um cliente.
   */
  static async approveClient(clientId: string): Promise<void> {
    await SupabaseClientsAdapter.approveClient(clientId);
  }

  /**
   * Assina as atualizações da coleção de partners.
   */
  static subscribeToPartners(onUpdate: (partnersList: any[]) => void): () => void {
    return SupabaseClientsAdapter.subscribeToPartners(onUpdate);
  }
}
