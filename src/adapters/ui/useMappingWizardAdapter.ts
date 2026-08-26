import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp, limit } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';

export function useMappingWizardAdapter(selectedClient: string) {
  const [loading, setLoading] = useState(false);
  const [unmappedEntries, setUnmappedEntries] = useState<string[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  const [mappingTo, setMappingTo] = useState('');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const qAcc = query(collection(db, 'account_plans'), where('clientId', '==', selectedClient));
        const accSnap = await getDocs(qAcc);
        const accDocs = accSnap.docs.map(d => d.data());

        const qEntries = query(
          collection(db, 'financial_entries'), 
          where('clientId', '==', selectedClient),
          limit(10)
        );
        const entriesSnap = await getDocs(qEntries);
        const allCategories = new Set<string>();
        entriesSnap.docs.forEach(doc => {
          (doc.data() as any).data?.forEach((entry: any) => {
            allCategories.add(entry.category);
          });
        });

        const unmapped = Array.from(allCategories).filter(cat => 
          !accDocs.some(acc => acc.name.toLowerCase().trim() === cat.toLowerCase().trim())
        );
        setUnmappedEntries(unmapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedClient]);

  const handleSaveMapping = async () => {
    if (!selectedEntry || !mappingTo) return;
    setLoading(true);
    try {
      (()=>{throw new Error("Phase 7.2 Architecture Violation: Firestore Writes are BLOCKED. Migrated to PostgreSQL.");})(); // addDoc(collection(db, 'account_plans'), {
        clientId: selectedClient,
        code: `AUTO.${Math.random().toString(36).substring(7).toUpperCase()}`,
        name: selectedEntry,
        type: 'Receita',
        level: 1,
        status: 'Ativa',
        kpiMapping: mappingTo,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: auth.currentUser?.uid
      });
      
      setUnmappedEntries(unmappedEntries.filter(e => e !== selectedEntry));
      setSelectedEntry(null);
      setMappingTo('');
      alert('Vínculo criado com sucesso!');
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar mapeamento.');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    unmappedEntries,
    selectedEntry,
    setSelectedEntry,
    mappingTo,
    setMappingTo,
    handleSaveMapping,
  };
}
