import { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { notificationService } from '../../services/notificationService';
import { DreAccountType, DreNatureza } from '../../constants/dreStructure';
import { DRE_OFFICIAL_STRUCTURE } from '../../constants/dreStructure';
import { calculateDreCascade, generateInitialDreState } from '../../lib/dreCascade';

export interface Row {
  id: string;
  category: string;
  value: number;
  type: string;
  level: number;
  dreTipo?: DreAccountType;
  natureza?: DreNatureza;
  parentId?: string | null;
  aceitaLancamento?: boolean;
  calculaAutomaticamente?: boolean;
  formula?: string;
  ordem?: number;
}

export function useManualFinancialModalAdapter(clientId: string, year: number, selectedType: string, role: string) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!clientId) return;
      setLoading(true);
      try {
        const q = query(
          collection(db, 'financial_entries'),
          where('clientId', '==', clientId),
          where('year', '==', year)
        );
        const snap = await getDocs(q);
        
        let existingData: Row[] = [];
        
        let docsForType = snap.docs.filter(doc => {
          const d = doc.data();
          if (d.status === 'archived') return false;
          if (selectedType === 'BP' || selectedType === 'Balanço Patrimonial') {
             return d.type === 'Balanço Patrimonial' || d.type === 'BP';
          }
          return d.type === selectedType;
        });

        if (docsForType.length > 0) {
          docsForType.sort((a,b) => (b.data().createdAt?.toMillis() || 0) - (a.data().createdAt?.toMillis() || 0));
          const docData = docsForType[0].data();
          const items = Array.isArray(docData.data) ? docData.data : (docData.rows || []);
          
          existingData = items.map((item: any) => ({
            id: item.id || crypto.randomUUID(),
            category: item.category || item.conta || item.name || '',
            value: item.value || item.valor || item.val || 0,
            type: (item.type || item.tipo || ((selectedType === 'DRE' || selectedType === 'DRE Gerencial') ? 'receitas' : 'ativo')).toLowerCase(),
            level: item.level || 1,
            dreTipo: item.dreTipo,
            natureza: item.natureza,
            parentId: item.parentId,
            aceitaLancamento: item.aceitaLancamento,
            calculaAutomaticamente: item.calculaAutomaticamente,
            formula: item.formula,
            ordem: item.ordem
          }));
        }

        if (selectedType === 'DRE' || selectedType === 'DRE Gerencial') {
          const hasOfficialStructure = existingData.some(r => r.dreTipo === 'SINTETICA');
          
          if (!hasOfficialStructure && existingData.length > 0) {
            const mappedEntries = existingData.map((d: any) => {
              let parentId = d.parentId;
              const cat = (d.category || '').toLowerCase();
              
              if (!parentId && (cat.includes('receita líquida') || cat.includes('receita operacional líquida') || cat.includes('lucro bruto') || cat.includes('ebitda') || cat === 'ebit' || cat.includes('resultado operacional líquido') || cat.includes('lajida') || cat.includes('lucro líquido') || cat.includes('lair') || cat.includes('resultado antes'))) {
                 return null; 
              }
              
              if (!parentId) {
                 if (cat.includes('receita operacional bruta') || cat === 'receita bruta' || cat.includes('faturamento') || (cat.includes('receita') && !cat.includes('líquida') && !cat.includes('financeir') && !cat.includes('outras'))) {
                    parentId = 'ROB';
                 } else if (cat.includes('deduç') || cat.includes('imposto sobre') || cat.includes('abatimento') || cat.includes('devoluç') || cat.includes('cancelamento')) {
                    parentId = 'DED';
                 } else if (cat.includes('custo') || cat.includes('cmv') || cat.includes('cpv') || cat.includes('csv') || cat.includes('csp')) {
                    parentId = 'CUSTOS';
                 } else if (cat.includes('deprecia') || cat.includes('amortiza')) {
                    parentId = 'DEP_AMORT';
                 } else if (cat.includes('financeir') || cat.includes('juros')) {
                    parentId = 'RESULT_FIN';
                 } else if (cat.includes('provisão') || cat.includes('irpj') || cat.includes('csll') || cat.includes('imposto de renda') || cat.includes('contribuição social')) {
                    parentId = 'PROV_IR_CSLL';
                 } else if (cat.includes('outras receitas') || cat.includes('outra receita') || cat.includes('outras despesas operacionais')) {
                    parentId = 'OUTRAS_REC_DESP';
                 } else {
                    parentId = 'DESP_OPER';
                 }
              }

              const parentInfo = DRE_OFFICIAL_STRUCTURE.find(p => p.id === parentId);
              
              return {
                 ...d,
                 parentId,
                 dreTipo: 'ANALITICA',
                 level: 2,
                 natureza: parentInfo?.natureza || 'CREDORA',
                 ordem: (parentInfo?.ordem || 0) + 0.1
              };
            }).filter(Boolean) as Row[];

            const initialDreState = generateInitialDreState() as Row[];
            existingData = calculateDreCascade([...initialDreState, ...mappedEntries]);

          } else if (!hasOfficialStructure) {
            existingData = generateInitialDreState() as Row[];
          } else {
             const initialDreState = generateInitialDreState() as Row[];
             const missingSynthetics = initialDreState.filter(s => !existingData.some(e => e.id === s.id));
             existingData = calculateDreCascade([...existingData, ...missingSynthetics]);
          }
        }
        
        setRows(existingData);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [clientId, year, selectedType]);

  const saveEntries = async (computedRows: any[]) => {
    if (!auth.currentUser || !clientId) return { success: false, error: 'Usuário não autenticado' };
    
    setSaving(true);
    try {
      const typesToDelete = (selectedType === 'BP' || selectedType === 'Balanço Patrimonial')
        ? ['Balanço Patrimonial', 'BP']
        : [selectedType];
      
      const q = query(
        collection(db, 'financial_entries'),
        where('clientId', '==', clientId),
        where('type', 'in', typesToDelete),
        where('year', '==', year)
      );
      const snap = await getDocs(q);
      
      const docsToArchive = snap.docs.filter(d => d.data().status !== 'archived');
      await Promise.all(docsToArchive.map(d => updateDoc(doc(db, 'financial_entries', d.id), {
        status: 'archived',
        archivedAt: serverTimestamp(),
        archivedBy: auth?.currentUser?.uid || 'system'
      })));

      const currentUid = auth?.currentUser?.uid || 'system_user';
      const currentEmail = auth?.currentUser?.email || 'system@illumine.com';

      const targetPayload = {
        clientId,
        tenantId: clientId,
        workspaceId: clientId,
        companyId: clientId,
        fiscalYear: year,
        statementVersion: '1.0',
        type: selectedType,
        year,
        data: computedRows.map((r, idx) => {
          const isDre = selectedType === 'DRE' || selectedType === 'DRE Gerencial';
          const finalValue = r.computedValue !== undefined ? r.computedValue : (r.value || 0);
          const rowData: any = {
            id: r.id || crypto.randomUUID(),
            category: r.category || (r as any).nome || '',
            value: finalValue,
            type: r.type || '',
            level: r.level || 1,
            explainability: {
              origin: 'manual',
              transformation: 'raw_input',
              dePara: r.type || '',
              timestamp: new Date().toISOString(),
              version: 1,
              engine: 'ManualEntry'
            }
          };

          rowData.ordem = r.ordem !== undefined ? r.ordem : idx;
          if (r.parentId !== undefined) rowData.parentId = r.parentId;

          if (isDre) {
            if (r.dreTipo !== undefined) rowData.dreTipo = r.dreTipo;
            if (r.natureza !== undefined) rowData.natureza = r.natureza;
            if (r.aceitaLancamento !== undefined) rowData.aceitaLancamento = r.aceitaLancamento;
            if (r.calculaAutomaticamente !== undefined) rowData.calculaAutomaticamente = r.calculaAutomaticamente;
            if (r.formula !== undefined) rowData.formula = r.formula;
          }
          
          return rowData;
        }),
        createdAt: serverTimestamp(),
        createdBy: currentUid,
        creatorEmail: currentEmail,
        audit: {
          createdAt: serverTimestamp(),
          createdBy: currentUid,
          action: 'manual_entry',
          source: 'manual'
        }
      };

      const payload = {
        ...targetPayload,
        status: role === 'master' ? 'approved' : 'pending',
        requiresApproval: role !== 'master',
        sourceCollection: 'financial_entries',
        updatedAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'financial_entries'), payload);

      if (role !== 'master') {
        await notificationService.createNotification({
          userId: 'admin_group',
          title: 'Novo Lançamento Manual para Aprovação',
          message: `Dados manuais de \${selectedType} (\${year}) foram enviados para aprovação.`,
          type: 'approval_request',
          link: 'maintenance',
          metadata: { clientId, docType: selectedType }
        });
      }

      return { success: true };
    } catch (err: any) {
      console.error('Error saving data:', err);
      return { success: false, error: err.message || 'Erro ao salvar os dados' };
    } finally {
      setSaving(false);
    }
  };

  return {
    rows,
    setRows,
    loading,
    saving,
    saveEntries
  };
}
