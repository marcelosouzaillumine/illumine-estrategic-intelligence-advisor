import { useState, useEffect } from 'react';
import { FirestoreOrganizationalAdapter } from '../../../../../adapters/persistence/FirestoreOrganizationalAdapter';


interface OrgNode {
  id: string;
  name: string;
  role: string;
  department: string;
  parentId: string | null;
  type: 'executive' | 'management' | 'operational';
}

export function useAvaliacaoOrganogramaPageAdapter(clientId: string) {
  const [nodes, setNodes] = useState<OrgNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!clientId) return;
    setLoading(true);
    
    const unsubscribe = FirestoreOrganizationalAdapter.listenToOrgChartByClient(clientId, (updatedNodes) => {
      setNodes(updatedNodes);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [clientId]);

  const handleSave = async () => {
    if (!clientId) return;
    setIsSaving(true);
    try {
      await FirestoreOrganizationalAdapter.saveOrgChart(clientId, nodes);
    } catch (error) {
      console.error('Error saving org chart:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    nodes,
    setNodes,
    loading,
    isSaving,
    handleSave,
  };
}
