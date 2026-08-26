import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { calculatePayrollBurdens, calculateSeverance } from '../../services/taxService';

export function useEmployeeManagerAdapter(clientId: string, clientConfig: any) {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, [clientId, auth.currentUser]);

  const fetchEmployees = async () => {
    if (!clientId || !auth.currentUser) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, 'employees'), 
        where('clientId', '==', clientId),
        where('ownerId', '==', auth.currentUser.uid)
      );
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEmployees(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (
    formData: any, 
    editingId: string | null, 
    onSuccess: () => void
  ) => {
    if (!auth.currentUser) return;
    
    setLoading(true);
    try {
      // Calculate burdens using taxService
      const baseSalario = typeof formData.salarioBase === 'string' ? parseFloat(formData.salarioBase) || 0 : formData.salarioBase;
      const burdens = calculatePayrollBurdens(baseSalario, {
        fgts: clientConfig.folhaFgts || 8,
        inssPatronal: clientConfig.folhaInssPatronal || 20,
        inssFuncionario: clientConfig.folhaInssFuncionario || 11,
        multaFgts: clientConfig.folhaMultaFgts || 40,
        tabelaIRRF: clientConfig.folhaTabelaIRRF || []
      });

      const severance = calculateSeverance(baseSalario, formData.admissao, {
        multaFgts: clientConfig.folhaMultaFgts || 40
      }, {
        avisoIndenizado: formData.avisoIndenizado
      });

      const payload = {
        ...formData,
        salarioBase: baseSalario,
        encargos: burdens.fgts + burdens.inssPatronal,
        decimoTerceiroFerias: burdens.provisionFerias13,
        custoMensal: burdens.custoTotal,
        custoAnual: burdens.custoTotal * 12,
        custoRescisaoEstimado: severance.totalRescisao,
        clientId,
        ownerId: auth.currentUser.uid,
        updatedAt: serverTimestamp()
      };

      if (editingId) {
        (()=>{throw new Error("Phase 7.2 Architecture Violation: Firestore Writes are BLOCKED. Migrated to PostgreSQL.");})(); // updateDoc(doc(db, 'employees', editingId), payload);
      } else {
        (()=>{throw new Error("Phase 7.2 Architecture Violation: Firestore Writes are BLOCKED. Migrated to PostgreSQL.");})(); // addDoc(collection(db, 'employees'), payload);
      }
      
      onSuccess();
      fetchEmployees();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Excluir colaborador?')) return;
    try {
      (()=>{throw new Error("Phase 7.2 Architecture Violation: Firestore Writes are BLOCKED. Migrated to PostgreSQL.");})(); // deleteDoc(doc(db, 'employees', id));
      fetchEmployees();
    } catch (e) {
      console.error(e);
    }
  };

  return {
    employees,
    loading,
    handleSave,
    handleDelete
  };
}
