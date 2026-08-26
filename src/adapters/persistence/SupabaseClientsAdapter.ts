import { getSupabaseClient } from '../../infrastructure/supabase/SupabaseClient';

export const SupabaseClientsAdapter = {
  subscribeToClientById(clientId: string, onUpdate: (clientData: any | null) => void): () => void {
    const supabase = getSupabaseClient();
    let isSubscribed = true;

    // Supabase real-time is different, but for now we fetch once and setup a channel
    const fetchClient = async () => {
      const { data, error } = await supabase.from('crm.clients').select('*').eq('id', clientId).single();
      if (isSubscribed) {
        if (error || !data) {
          onUpdate(null);
        } else {
          onUpdate(data);
        }
      }
    };
    fetchClient();

    const channel = supabase.channel(`public:crm.clients:${clientId}`)
      .on('postgres_changes', { event: '*', schema: 'crm', table: 'clients', filter: `id=eq.${clientId}` }, payload => {
        if (payload.eventType === 'DELETE') {
          onUpdate(null);
        } else {
          onUpdate(payload.new);
        }
      })
      .subscribe();

    return () => {
      isSubscribed = false;
      supabase.removeChannel(channel);
    };
  },

  subscribeToClients(isMaster: boolean, clients: any[] | null | undefined, onUpdate: (clientsList: any[]) => void): () => void {
    const supabase = getSupabaseClient();
    let isSubscribed = true;

    const fetchClients = async () => {
      let query = supabase.from('crm.clients').select('*');
      if (!isMaster && clients && clients.length > 0) {
        const clientIds = clients.map((c: any) => c.id);
        query = query.in('id', clientIds);
      } else if (!isMaster) {
        if (isSubscribed) onUpdate([]);
        return;
      }
      const { data } = await query;
      if (isSubscribed && data) onUpdate(data);
    };
    fetchClients();

    const channel = supabase.channel('public:crm.clients')
      .on('postgres_changes', { event: '*', schema: 'crm', table: 'clients' }, () => {
        fetchClients();
      })
      .subscribe();

    return () => {
      isSubscribed = false;
      supabase.removeChannel(channel);
    };
  },

  async addClient(clientFinalData: any): Promise<string> {
    const supabase = getSupabaseClient();
    // Assuming company_id is provided in clientFinalData by the context, or we must map it.
    // If clientFinalData doesn't have company_id, we might need to extract it from tenant info or just rely on RLS if possible.
    // However, the migration specifies company_id is NOT NULL.
    // For now we map whatever we have.
    const payload = {
        name: clientFinalData.nome || clientFinalData.name || 'Unnamed Client',
        trade_name: clientFinalData.fantasia || clientFinalData.trade_name,
        document_number: clientFinalData.cnpj || clientFinalData.document_number,
        status: clientFinalData.status || 'ACTIVE',
        approval_status: clientFinalData.approvalStatus || 'PENDING',
        metadata: clientFinalData,
        company_id: clientFinalData.company_id || (await this.getDefaultCompanyId())
    };

    const { data, error } = await supabase.from('crm.clients').insert(payload).select('id').single();
    if (error) throw new Error(error.message);
    return data.id;
  },

  async updateClient(editingId: string, clientData: any): Promise<void> {
    const supabase = getSupabaseClient();
    const payload = {
        name: clientData.nome || clientData.name,
        trade_name: clientData.fantasia || clientData.trade_name,
        document_number: clientData.cnpj || clientData.document_number,
        status: clientData.status,
        approval_status: clientData.approvalStatus,
        metadata: clientData
    };
    // remove undefined
    Object.keys(payload).forEach(key => payload[key as keyof typeof payload] === undefined && delete payload[key as keyof typeof payload]);

    const { error } = await supabase.from('crm.clients').update(payload).eq('id', editingId);
    if (error) throw new Error(error.message);
  },

  async deleteClientCascade(clientId: string, collectionsToClean: string[]): Promise<void> {
    const supabase = getSupabaseClient();
    // In PostgreSQL, cascading deletes should ideally be handled by foreign keys.
    // If not, we trigger a manual delete or rely on an RPC.
    // For now, deleting the client will cascade to most things if FKs are set up.
    const { error } = await supabase.from('crm.clients').delete().eq('id', clientId);
    if (error) throw new Error(error.message);
  },

  async approveClient(clientId: string): Promise<void> {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from('crm.clients').update({ approval_status: 'Approved' }).eq('id', clientId);
    if (error) throw new Error(error.message);
  },

  subscribeToPartners(onUpdate: (partnersList: any[]) => void): () => void {
    const supabase = getSupabaseClient();
    let isSubscribed = true;

    const fetchPartners = async () => {
      const { data } = await supabase.from('crm.partners').select('*');
      if (isSubscribed && data) onUpdate(data);
    };
    fetchPartners();

    const channel = supabase.channel('public:crm.partners')
      .on('postgres_changes', { event: '*', schema: 'crm', table: 'partners' }, () => {
        fetchPartners();
      })
      .subscribe();

    return () => {
      isSubscribed = false;
      supabase.removeChannel(channel);
    };
  },

  async createAccountPlanBatch(plans: any[]): Promise<void> {
    const supabase = getSupabaseClient();
    // Map legacy account_plans to finance.chart_of_accounts
    const companyId = await this.getDefaultCompanyId();
    const payload = plans.map(p => ({
        company_id: companyId,
        code: p.codigo || p.code || '',
        name: p.conta || p.name || 'Unnamed',
        type: p.tipo === 'Sintética' ? 'SYNTHETIC' : 'ANALYTICAL',
        nature: p.natureza === 'Devedora' ? 'DEBIT' : 'CREDIT',
        metadata: p
    }));

    const { error } = await supabase.from('finance.chart_of_accounts').insert(payload);
    if (error) throw new Error(error.message);
  },

  getServerTimestamp() {
    return new Date().toISOString();
  },

  async getDefaultCompanyId(): Promise<string> {
    const supabase = getSupabaseClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Not authenticated");
    const { data } = await supabase.from('tenant.tenant_users').select('tenant_id').eq('user_id', userData.user.id).limit(1).single();
    if (data) return data.tenant_id; // Using tenant_id as company_id for simplicity, but ideally should be companies table.
    
    // fallback if using tenant.companies
    const { data: comp } = await supabase.from('tenant.companies').select('id').limit(1).single();
    if (comp) return comp.id;
    throw new Error("No company found for user");
  }
};
