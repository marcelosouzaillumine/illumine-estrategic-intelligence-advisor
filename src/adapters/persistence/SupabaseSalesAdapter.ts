import { getSupabaseClient } from '../../infrastructure/supabase/SupabaseClient';
import { SalesPipelineEntry } from '../ui/useSalesPipelineAdapter';

export class SupabaseSalesAdapter {
  static listenToPipelineByClient(clientId: string, onUpdate: (entries: SalesPipelineEntry[]) => void): () => void {
    const supabase = getSupabaseClient();
    let isSubscribed = true;

    const fetchPipeline = async () => {
      const { data, error } = await supabase.from('commercial.sales_pipeline').select('*').eq('client_id', clientId);
      if (isSubscribed && data) {
        onUpdate(data as any[]);
      }
    };
    fetchPipeline();

    const channel = supabase.channel(`public:commercial.sales_pipeline:${clientId}`)
      .on('postgres_changes', { event: '*', schema: 'commercial', table: 'sales_pipeline', filter: `client_id=eq.${clientId}` }, payload => {
        fetchPipeline();
      })
      .subscribe();

    return () => {
      isSubscribed = false;
      supabase.removeChannel(channel);
    };
  }

  static async addPipelineEntry(clientId: string, formData: any): Promise<void> {
    const supabase = getSupabaseClient();
    
    const valorNum = typeof formData.valor === 'string' 
      ? parseFloat(formData.valor.replace(/\\./g, '').replace(',', '.')) || 0 
      : formData.valor;
      
    const companyId = await this.getDefaultCompanyId(supabase);

    const payload = {
        company_id: companyId,
        client_id: clientId,
        seller_name: formData.vendedor || 'Não Informado',
        unit: formData.unidade || 'Geral',
        branch: formData.filial || 'Matriz',
        stage: formData.etapa || 'Prospecção',
        projected_value: valorNum,
        customer_name: formData.customerName || 'Novo Prospect',
        metadata: formData
    };

    const { error } = await supabase.from('commercial.sales_pipeline').insert(payload);
    if (error) throw new Error(error.message);
  }

  static async deletePipelineEntry(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from('commercial.sales_pipeline').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }

  static async importPipelineEntries(clientId: string, parsedData: any[]): Promise<void> {
    const supabase = getSupabaseClient();
    const companyId = await this.getDefaultCompanyId(supabase);

    const payload = parsedData.map(row => ({
        company_id: companyId,
        client_id: clientId,
        seller_name: row['Vendedor'] || 'Não Informado',
        unit: row['Unidade'] || 'Geral',
        branch: row['Filial'] || 'Matriz',
        stage: row['Etapa'] || 'Prospecção',
        projected_value: parseFloat(String(row['Valor (R$)']).replace(/\\./g, '').replace(',', '.')) || 0,
        customer_name: row['Cliente/Prospect'] || 'Novo Prospect'
    }));

    const { error } = await supabase.from('commercial.sales_pipeline').insert(payload);
    if (error) throw new Error(error.message);
  }

  static async getDefaultCompanyId(supabase: any): Promise<string> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Not authenticated");
    const { data } = await supabase.from('tenant.tenant_users').select('tenant_id').eq('user_id', userData.user.id).limit(1).single();
    if (data) return data.tenant_id;
    
    const { data: comp } = await supabase.from('tenant.companies').select('id').limit(1).single();
    if (comp) return comp.id;
    throw new Error("No company found for user");
  }
}
