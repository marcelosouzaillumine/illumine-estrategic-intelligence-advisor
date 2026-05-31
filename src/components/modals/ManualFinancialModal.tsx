import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { X, Plus, Trash2, Save, Loader2, AlertCircle, Database, ArrowUp, ArrowDown } from 'lucide-react';
import { collection, addDoc, query, where, getDocs, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { notificationService } from '../../services/notificationService';
import { useGovernance } from '../../lib/governanceContext';
import { cn } from '../../lib/utils';
import { DOCUMENT_TYPES } from '../../constants/documents';

interface ManualFinancialModalProps {
  type: 'Balanço Patrimonial' | 'DRE' | 'BP' | 'DFC' | 'DLPA';
  clientId: string;
  year: number;
  onClose: () => void;
  onSuccess: () => void;
}

import { 
  DreAccountType, 
  DreNatureza, 
  DreAccount, 
  DRE_OFFICIAL_STRUCTURE 
} from '../../constants/dreStructure';
import { calculateDreCascade, generateInitialDreState } from '../../lib/dreCascade';
import { buildBPHierarchy } from '../../lib/bpEngine';
import { SortableTableRow } from '../Common';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';

interface Row {
  id: string;
  category: string;
  value: number;
  type: string;
  level: number;
  // Novos campos exclusivos da DRE
  dreTipo?: DreAccountType;
  natureza?: DreNatureza;
  parentId?: string | null;
  aceitaLancamento?: boolean;
  calculaAutomaticamente?: boolean;
  formula?: string;
  ordem?: number;
}

export function ManualFinancialModal({ type, clientId, year, onClose, onSuccess }: ManualFinancialModalProps) {
  const [selectedType, setSelectedType] = useState<string>(type === 'BP' ? 'Balanço Patrimonial' : type);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const governance = useGovernance();
  const role = governance?.role || 'cliente';



  const [debugText, setDebugText] = useState('');
  
  useEffect(() => {
    // Load existing data if any
    const loadData = async () => {
      if (!clientId) return;
      setLoading(true);
      try {
        const typesToQuery = (selectedType === 'BP' || selectedType === 'Balanço Patrimonial') 
          ? ['Balanço Patrimonial', 'BP'] 
          : [selectedType];
        // Simplificamos a query para evitar a necessidade de composite index (clientId, year, type)
        // O filtro de `type` será feito em memória (JavaScript) abaixo.
        const q = query(
          collection(db, 'financial_entries'),
          where('clientId', '==', clientId),
          where('year', '==', year)
        );
        const snap = await getDocs(q);
        
        let existingData: Row[] = [];
        let debugStr = `Snap:${snap.docs.length}|`;
        
        // Vamos capturar o documento mais recente para evitar duplicação em caso de falha de arquivamento
        let docsForType = snap.docs.filter(doc => {
          const d = doc.data();
          debugStr += `[id:${doc.id.slice(0,4)},t:${d.type},s:${d.status},y:${d.year},l:${(d.data||[]).length}]`;
          if (d.status === 'archived') return false;
          
          const docType = (d.type || '').toLowerCase().trim();
          const targetType = selectedType.toLowerCase().trim();
          
          // Verificação ampla (igual a tela principal)
          const isBp = targetType === 'bp' || targetType === 'balanço patrimonial' || targetType.includes('balan');
          const isDre = targetType === 'dre' || targetType === 'dre gerencial';
          
          if (isBp) {
             const isDocBp = docType === 'bp' || docType.includes('balanç') || docType.includes('balanc');
             const hasBpRows = Array.isArray(d.data) && d.data.some((r: any) => ['ativo', 'passivo', 'patrimônio líquido', 'pl'].includes((r.type || r.tipo || '').toLowerCase().trim()));
             return isDocBp || hasBpRows;
          }
          
          if (isDre) {
             const isDocDre = docType === 'dre' || docType === 'dre gerencial';
             const hasDreRows = Array.isArray(d.data) && d.data.some((r: any) => ['receitas', 'despesas'].includes((r.type || r.tipo || '').toLowerCase().trim()));
             return isDocDre || hasDreRows;
          }
          
          return typesToQuery.some(t => t.toLowerCase().trim() === docType);
        });
        
        debugStr += `|Matched:${docsForType.length}`;
        setDebugText(debugStr);
        
        // Deduplicação: pegar apenas o mais recente
        if (docsForType.length > 1) {
           docsForType.sort((a, b) => {
             const tA = a.data().createdAt?.toMillis?.() || 0;
             const tB = b.data().createdAt?.toMillis?.() || 0;
             return tB - tA;
           });
           docsForType = [docsForType[0]];
        }
        
        if (docsForType.length > 0) {
          docsForType.forEach(doc => {
            const docData = doc.data();
            const data = (docData.data || []).map((item: any) => ({
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
            existingData = [...existingData, ...data];
          });
        }

        if (selectedType === 'DRE' || selectedType === 'DRE Gerencial') {
          const hasOfficialStructure = existingData.some(r => r.dreTipo === 'SINTETICA');
          
          if (!hasOfficialStructure && existingData.length > 0) {
            // Map legacy/imported data to standard shape
            const mappedEntries = existingData.map((d: any) => {
              let parentId = d.parentId;
              const cat = (d.category || '').toLowerCase();
              
              // Ignore totals from legacy data
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
                    parentId = 'DESP_OPER'; // Default
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
             // Garante a reordenação e o cálculo em cascata, e recria sintéticas perdidas
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

  const addRow = () => {
    setRows([...rows, { 
      id: crypto.randomUUID(), 
      category: '', 
      value: 0, 
      type: (selectedType === 'DRE' || selectedType === 'DRE Gerencial') ? 'receitas' : 'ativo',
      level: 1
    }]);
  };

  const removeRow = (id: string) => {
    setRows(rows.filter(r => r.id !== id));
  };

  const updateRow = (id: string, field: keyof Row, val: any) => {
    setRows(rows.map(r => r.id === id ? { ...r, [field]: val } : r));
  };

  // Process rows based on selected type
  let computedRows: (Row & { hasChildren?: boolean; computedValue?: number })[] = [];
  
  if (selectedType === 'DRE' || selectedType === 'DRE Gerencial') {
    // NOVA ESTRUTURA DRE: Cálculo via Cascata Hierárquica Estrita
    const calculated = calculateDreCascade(rows);
    const interleaved: any[] = [];
    
    const structural = calculated
      .filter(r => r.dreTipo === 'SINTETICA' || r.dreTipo === 'RESULTADO_CALCULADO')
      .sort((a,b) => (a.ordem || 0) - (b.ordem || 0));
      
    structural.forEach(parent => {
       interleaved.push({
         ...parent,
         hasChildren: parent.dreTipo === 'SINTETICA' || parent.dreTipo === 'RESULTADO_CALCULADO'
       });
       
       const children = calculated
           .filter(r => r.parentId === parent.id && r.dreTipo === 'ANALITICA')
           .sort((a,b) => (a.ordem || 0) - (b.ordem || 0));
           
       children.forEach(child => {
           interleaved.push({
             ...child,
             hasChildren: false
           });
       });
    });
    
    const orphans = calculated.filter(r => r.dreTipo === 'ANALITICA' && !structural.some(p => p.id === r.parentId));
    orphans.forEach(child => {
       interleaved.push({ ...child, hasChildren: false });
    });
    
    computedRows = interleaved;
  } else if (selectedType === 'Balanço Patrimonial' || selectedType === 'BP') {
    // NOVA ESTRUTURA BP: Usa o bpEngine para inferir hierarquia estritamente
    const { flatNodes } = buildBPHierarchy(rows);
    computedRows = flatNodes.map(node => {
      const original = rows.find(r => r.id === node.id) || rows.find(r => r.category === node.category)!;
      
      let inferredType = original.type;
      let current = node;
      while (current && current.parentId) {
        current = flatNodes.find(n => n.id === current.parentId)!;
      }
      if (current) {
        const rootOriginal = rows.find(r => r.id === current.id);
        if (rootOriginal && rootOriginal.type) {
           inferredType = rootOriginal.type;
        }
      }

      return {
        ...original,
        type: inferredType,
        level: node.level,
        hasChildren: node.isSynthetic,
        computedValue: node.computedValue,
        parentId: node.parentId
      };
    });
  } else {
    // ESTRUTURA LEGADA PARA OUTROS (DFC, DLPA)
    computedRows = [...rows].map(r => ({ ...r, hasChildren: false, computedValue: 0 }));
    for (let i = computedRows.length - 1; i >= 0; i--) {
      let hasChildren = false;
      let sum = 0;
      
      if (i < computedRows.length - 1 && computedRows[i + 1].level > computedRows[i].level) {
        hasChildren = true;
        const targetLevel = computedRows[i].level + 1;
        for (let j = i + 1; j < computedRows.length; j++) {
          if (computedRows[j].level <= computedRows[i].level) break;
          if (computedRows[j].level === targetLevel) {
            sum += computedRows[j].hasChildren ? computedRows[j].computedValue! : computedRows[j].value;
          }
        }
      }
      
      computedRows[i].hasChildren = hasChildren;
      computedRows[i].computedValue = hasChildren ? sum : computedRows[i].value;
    }
  }

  const handleSave = async () => {
    if (!auth.currentUser || !clientId) return;
    setErrorMsg(null);

    if (selectedType === 'Balanço Patrimonial' || selectedType === 'BP') {
      let totalAtivo = 0;
      let totalPassivo = 0;
      let totalPL = 0;

      computedRows.forEach(r => {
        if (r.level === 1) {
          if (r.type === 'ativo') totalAtivo += r.computedValue;
          else if (r.type === 'passivo') totalPassivo += r.computedValue;
          else if (r.type === 'patrimônio líquido' || r.type === 'pl') totalPL += r.computedValue;
        }
      });

      const difference = Math.abs(totalAtivo - (totalPassivo + totalPL));
      if (difference > 0.01) {
        setErrorMsg(`Dados inconsistentes: O Total do Ativo (${totalAtivo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}) deve ser igual ao Total do Passivo + Patrimônio Líquido (${(totalPassivo + totalPL).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}). Diferença: ${difference.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}. Por favor, corrija os valores.`);
        return;
      }

      // Validação Estrutural Rigorosa para BP
      const { summary } = buildBPHierarchy(computedRows);
      if (summary.hasOrphans) {
        const orphansStr = summary.orphanAccounts?.length ? `: ${summary.orphanAccounts.join(', ')}` : '';
        setErrorMsg(`Existem contas sem classificação ou grupo pai correspondente (Órfãs)${orphansStr}. Bloqueado.`);
        return;
      }
      if (summary.hasDuplicates) {
        const dupsStr = summary.duplicateAccounts?.length ? `: ${summary.duplicateAccounts.join(', ')}` : '';
        setErrorMsg(`Contas duplicadas encontradas${dupsStr}. Bloqueado.`);
        return;
      }
    }

    setSaving(true);
    try {
      const typesToDelete = (selectedType === 'BP' || selectedType === 'Balanço Patrimonial')
        ? ['Balanço Patrimonial', 'BP']
        : [selectedType];
      
      // 1. Delete existing
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
        archivedBy: auth.currentUser!.uid
      })));

      // 2. Add new
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
          const rowData: any = {
            id: r.id || crypto.randomUUID(),
            category: r.category || (r as any).nome || '',
            value: r.value || 0,
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
        createdBy: auth.currentUser!.uid,
        creatorEmail: auth.currentUser!.email,
        audit: {
          createdAt: serverTimestamp(),
          createdBy: auth.currentUser!.uid,
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
        // Notify Admins only if it requires approval
        await notificationService.createNotification({
          userId: 'admin_group',
          title: 'Novo Lançamento Manual para Aprovação',
          message: `Dados manuais de ${selectedType} (${year}) foram enviados para aprovação.`,
          type: 'approval_request',
          link: 'maintenance',
          metadata: { clientId, docType: selectedType }
        });
      }

      onSuccess();
    } catch (err) {
      console.error('Error saving data:', err);
    } finally {
      setSaving(false);
    }
  };

  const typeOptions = (selectedType === 'BP' || selectedType === 'Balanço Patrimonial')
    ? ['ativo', 'passivo', 'patrimônio líquido']
    : (selectedType === 'DRE' || selectedType === 'DRE Gerencial')
      ? ['receitas', 'despesas']
      : ['ativo', 'passivo', 'patrimônio líquido', 'receitas', 'despesas'];

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = computedRows.findIndex(r => r.id === active.id);
    const newIndex = computedRows.findIndex(r => r.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const activeItem = computedRows[oldIndex];
      const isDre = selectedType === 'DRE' || selectedType === 'DRE Gerencial';
      
      if (isDre && activeItem.dreTipo !== 'ANALITICA') return;

      const reorderedComputed = arrayMove(computedRows, oldIndex, newIndex);

      if (isDre) {
        let newParentId = activeItem.parentId;
        let newNatureza = activeItem.natureza;
        for (let i = newIndex; i >= 0; i--) {
           if (reorderedComputed[i].dreTipo === 'SINTETICA') {
              newParentId = reorderedComputed[i].id;
              newNatureza = reorderedComputed[i].natureza;
              break;
           }
        }
        
        const newRows = rows.map(r => {
           if (r.id === activeItem.id) {
              return { ...r, parentId: newParentId, natureza: newNatureza };
           }
           return r;
        });
        
        const finalRows = newRows.map(r => {
           if (r.dreTipo === 'ANALITICA') {
              const compIdx = reorderedComputed.findIndex(c => c.id === r.id);
              if (compIdx !== -1) {
                 return { ...r, ordem: compIdx };
              }
           }
           return r;
        });
        
        setRows(finalRows);
      } else if (selectedType === 'Balanço Patrimonial' || selectedType === 'BP') {
        const newRows = [...reorderedComputed];
        
        // BP: Auto-indentation based on dragged position (incorporate into new parent)
        if (newIndex > 0) {
           const prevItem = reorderedComputed[newIndex - 1];
           // Se o item anterior é um pai sintético, o item movido se torna filho direto (level + 1)
           // Se for um item analítico, ele copia o nível do irmão (level)
           const targetLevel = prevItem.hasChildren ? prevItem.level + 1 : prevItem.level;
           
           const activeRowIndex = newRows.findIndex(r => r.id === activeItem.id);
           if (activeRowIndex !== -1) {
              newRows[activeRowIndex] = { ...newRows[activeRowIndex], level: targetLevel };
           }
        }
        
        const finalRows = newRows.map((c, idx) => ({ ...rows.find(r => r.id === c.id)!, level: c.level, ordem: idx }));
        setRows(finalRows);
      } else {
        const finalRows = reorderedComputed.map((c, idx) => ({ ...rows.find(r => r.id === c.id)!, ordem: idx }));
        setRows(finalRows);
      }
    }
  };

  const modalContent = (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-2 sm:p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col h-[95vh] sm:h-[90vh] md:max-h-[85vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-lg font-black text-slate-900">Lançamento Manual: {selectedType}</h3>
            <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-widest font-bold">
              {year} · Cliente ID: {clientId.substring(0, 8)}...
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"><X size={20} /></button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6 overflow-y-auto flex-1 min-h-0">
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl flex items-start gap-3">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{errorMsg}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Tipo de Documento</label>
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-primary outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
            >
              {DOCUMENT_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 w-full min-w-0">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 size={32} className="animate-spin text-primary" />
                <p className="text-sm font-bold text-slate-400">Carregando dados existentes...</p>
             </div>
          ) : (
            <div className="space-y-4 w-full overflow-x-auto">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={computedRows.map(r => r.id)} strategy={verticalListSortingStrategy}>
              <table className="w-full text-sm min-w-[600px]">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="text-left py-3 px-4 text-[10px] font-bold text-slate-400 uppercase w-20">Nível</th>
                    <th className="text-left py-3 px-4 text-[10px] font-bold text-slate-400 uppercase">Conta / Categoria</th>
                    <th className="text-left py-3 px-4 text-[10px] font-bold text-slate-400 uppercase w-40">Tipo</th>
                    <th className="text-right py-3 px-4 text-[10px] font-bold text-slate-400 uppercase w-40">Valor (R$)</th>
                    <th className="w-20"></th>
                  </tr>
                </thead>
                    <tbody className="divide-y divide-slate-50">
                      {computedRows.map((row, index) => {
                        const isDre = selectedType === 'DRE' || selectedType === 'DRE Gerencial';
                        const isSintetica = isDre && row.dreTipo === 'SINTETICA';
                        const isResultado = isDre && row.dreTipo === 'RESULTADO_CALCULADO';
                        const isAnalitica = isDre && row.dreTipo === 'ANALITICA';
                        
                        const isLocked = isDre && (isSintetica || isResultado);

                        return (
                          <React.Fragment key={row.id}>
                            <SortableTableRow 
                              id={row.id} 
                              isDraggable={!isLocked} 
                              className={cn(isLocked ? "bg-slate-50/30" : "")}
                            >
                          <td className="py-2 px-2">
                            {isDre ? (
                              <div className="w-full bg-transparent text-center text-xs font-bold text-slate-400">
                                {isAnalitica ? '↳' : row.ordem}
                              </div>
                            ) : (
                              <select
                                value={row.level}
                                onChange={(e) => updateRow(row.id, 'level', Number(e.target.value))}
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-2 py-2 text-xs focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all text-center"
                              >
                                {[1, 2, 3, 4, 5].map(l => (
                                  <option key={l} value={l}>{l}</option>
                                ))}
                              </select>
                            )}
                          </td>
                          <td className="py-2 px-2">
                            {isLocked ? (
                              <div 
                                className="w-full py-2 text-sm font-bold text-slate-700"
                                style={{ paddingLeft: '16px' }}
                              >
                                {row.category}
                              </div>
                            ) : (
                              <input 
                                type="text" 
                                value={row.category} 
                                onChange={(e) => updateRow(row.id, 'category', e.target.value)}
                                placeholder="Ex: Venda de Produtos"
                                style={{ paddingLeft: isDre ? '40px' : `${(row.level - 1) * 12 + 16}px` }}
                                className={cn(
                                  "w-full bg-slate-50 border border-slate-100 rounded-xl py-2 text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all",
                                  isDre && "text-slate-600"
                                )}
                              />
                            )}
                          </td>
                          <td className="py-2 px-2">
                            {isDre ? (
                              <div className="w-full py-2 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">
                                {row.natureza}
                              </div>
                            ) : (
                              <select
                                value={row.type}
                                disabled={row.level > 1}
                                onChange={(e) => updateRow(row.id, 'type', e.target.value)}
                                className={cn(
                                  "w-full border border-slate-100 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all",
                                  row.level > 1 ? "bg-slate-100/50 text-slate-500 cursor-not-allowed" : "bg-slate-50 focus:bg-white"
                                )}
                              >
                                {typeOptions.map(opt => (
                                  <option key={opt} value={opt}>
                                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                  </option>
                                ))}
                              </select>
                            )}
                          </td>
                          <td className="py-2 px-2">
                            <input 
                              type="number"
                              step="0.01"
                              value={row.hasChildren ? row.computedValue!.toFixed(2) : row.value === 0 ? '' : row.value}
                              onChange={(e) => {
                                const parsed = parseFloat(e.target.value);
                                updateRow(row.id, 'value', isNaN(parsed) ? 0 : parsed);
                              }}
                              onWheel={(e) => (e.target as HTMLInputElement).blur()}
                              onBlur={(e) => {
                                const parsed = parseFloat(e.target.value);
                                updateRow(row.id, 'value', isNaN(parsed) ? 0 : Math.round(parsed * 100) / 100);
                              }}
                              disabled={row.hasChildren}
                              placeholder="0,00"
                              className={cn(
                                "w-full border border-slate-100 rounded-xl px-4 py-2 text-sm text-right font-mono outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                                row.hasChildren 
                                  ? "bg-slate-100/50 text-slate-500 font-bold cursor-not-allowed" 
                                  : "bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 text-slate-900"
                              )}
                            />
                          </td>
                          <td className="py-2 px-2 text-center flex items-center justify-center gap-1">
                            {(!isLocked) && (
                              <button onClick={() => removeRow(row.id)} className="p-1 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-all">
                                <Trash2 size={16} />
                              </button>
                            )}
                          </td>
                            </SortableTableRow>
                            
                            {/* Botão para adicionar linha analítica debaixo de uma Sintética */}
                            {isSintetica && (
                              <tr>
                                <td colSpan={5} className="py-1 px-2 border-none">
                                  <div className="flex justify-start pl-[50px]">
                                    <button
                                      onClick={() => {
                                        const newRows = [...rows];
                                        const insertIdx = newRows.findIndex(r => r.id === row.id) + 1;
                                        newRows.splice(insertIdx, 0, {
                                          id: crypto.randomUUID(),
                                          category: '',
                                          value: 0,
                                          type: 'despesas',
                                          level: 2,
                                          dreTipo: 'ANALITICA',
                                          natureza: row.natureza,
                                          parentId: row.id,
                                          aceitaLancamento: true,
                                          calculaAutomaticamente: false,
                                          ordem: row.ordem! + 0.1
                                        });
                                        setRows(newRows);
                                      }}
                                      className="text-[10px] font-bold text-slate-400 hover:text-primary flex items-center gap-1 py-1 px-2 rounded hover:bg-primary/5 transition-colors"
                                    >
                                      <Plus size={12} /> Adicionar Sub-Conta
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
              </table>
                  </SortableContext>
                </DndContext>

              {rows.length === 0 && (
                <div className="text-center py-12 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                  <AlertCircle size={32} className="text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-400">Nenhuma conta inserida ainda.</p>
                </div>
              )}

              {!(selectedType === 'DRE' || selectedType === 'DRE Gerencial') && (
                <button 
                  onClick={addRow}
                  className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 font-bold text-sm mt-4"
                >
                  <Plus size={18} /> Adicionar Linha
                </button>
              )}
            </div>
          )}
        </div>
      </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3.5 text-slate-600 font-bold text-sm hover:bg-slate-200 rounded-2xl transition-all"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            disabled={saving || rows.length === 0}
            className="flex-1 py-3.5 bg-secondary hover:bg-secondary/90 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-secondary/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Database size={18} />}
            {saving ? 'Salvando...' : 'Salvar Dados'}
          </button>
        </div>
      </motion.div>
    </div>
  );
  
  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }
  return modalContent;
}
