import { getSupabaseClient } from '../../infrastructure/supabase/SupabaseClient';

export interface BoardResolution {
  id?: string;
  clientId: string; // which maps to company_id
  title: string;
  description: string;
  status: 'DRAFT' | 'APPROVED' | 'IMPLEMENTED' | 'ARCHIVED';
  createdAt: string;
}

export const boardResolutionService = {
  async addResolution(resolution: Omit<BoardResolution, 'id' | 'createdAt'>): Promise<string> {
    const supabase = getSupabaseClient();
    
    // Get the current user to use as decided_by
    const { data: userData } = await supabase.auth.getUser();
    const decidedBy = userData?.user?.id || '00000000-0000-0000-0000-000000000000';

    const payload = {
      company_id: resolution.clientId, // clientId is used as company_id in our architecture context
      decided_by: decidedBy,
      problem_statement: resolution.title,
      selected_alternative: 'Board Resolution',
      rationale: resolution.description,
      status: resolution.status === 'ARCHIVED' ? 'SUPERSEDED' : 'ACTIVE'
    };

    const { data, error } = await supabase.from('intelligence.decisions').insert(payload).select('id').single();

    if (error) {
      throw new Error(`Failed to add board resolution: ${error.message}`);
    }

    return data.id;
  },

  async getResolutionsByClient(clientId: string): Promise<BoardResolution[]> {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('intelligence.decisions')
      .select('*')
      .eq('company_id', clientId)
      .eq('selected_alternative', 'Board Resolution');

    if (error) {
      throw new Error(`Failed to query board resolutions: ${error.message}`);
    }

    return data.map((d: any) => ({
      id: d.id,
      clientId: d.company_id,
      title: d.problem_statement,
      description: d.rationale,
      status: d.status === 'SUPERSEDED' ? 'ARCHIVED' : 'APPROVED',
      createdAt: d.decided_at
    }));
  }
};
