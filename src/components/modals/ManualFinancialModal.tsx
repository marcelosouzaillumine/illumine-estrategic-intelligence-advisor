import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { X, Plus, Trash2, Save, Loader2, AlertCircle, Database, ArrowUp, ArrowDown } from 'lucide-react';
import { useManualFinancialModalAdapter, Row } from '../../adapters/ui/useManualFinancialModalAdapter';
import { auth } from '../../lib/firebase';
import { notificationService } from '../../services/notificationService';
import { useGovernance } from '../../lib/governanceContext';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../contexts/LanguageContext';
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
import { useExecutiveFormatter } from '@/core/localization';


export function ManualFinancialModal({ type, clientId, year, onClose, onSuccess }: ManualFinancialModalProps) {
  const { translateLabel: t } = useLanguage();
  const [selectedType, setSelectedType] = useState<string>(type === 'BP' ? 'Balanço Patrimonial' : type);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const governance = useGovernance();
  const role = governance?.role || 'cliente';
  const { rows, setRows, loading, saving, saveEntries } = useManualFinancialModalAdapter(clientId, year, selectedType, role);
  
  const formatter = useExecutiveFormatter();



  const [debugText, setDebugText] = useState('');
  

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
      const original = rows.find(r => r.id === node.id.replace(/_idx\d+$/, '')) || rows.find(r => r.category?.trim().toLowerCase() === node.category?.trim().toLowerCase())!;
      
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
    if (!clientId) {
      setErrorMsg('Identificador do cliente não encontrado.');
      return;
    }
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
        setErrorMsg(`Dados inconsistentes: O Total do Ativo (${formatter.currency(totalAtivo)}) deve ser igual ao Total do Passivo + Patrimônio Líquido (${formatter.currency(totalPassivo + totalPL)}). Diferença: ${formatter.currency(difference)}. Por favor, corrija os valores.`);
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

    const res = await saveEntries(computedRows);
    if (!res.success) {
      setErrorMsg(res.error || 'Erro ao salvar.');
    } else {
      onSuccess();
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
        className="bg-card border border-border text-foreground rounded-2xl sm:rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col h-[95vh] sm:h-[90vh] md:max-h-[85vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-border flex justify-between items-center bg-surface-container/50">
          <div>
            <h3 className="text-lg font-bold text-foreground">Lançamento Manual: {selectedType}</h3>
            <p className="text-[10px] text-executive-muted mt-0.5 uppercase tracking-widest font-bold">
              {year} · Cliente ID: {clientId.substring(0, 8)}...
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-container rounded-full transition-colors text-executive-secondary cursor-pointer"><X size={20} /></button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6 overflow-y-auto flex-1 min-h-0">
          {errorMsg && (
            <div className="bg-critical-soft border border-rose-200 text-rose-600 px-4 py-3 rounded-xl flex items-start gap-3">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{errorMsg}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-executive-muted uppercase tracking-widest px-1">Tipo de Documento</label>
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-3 bg-surface-container border border-border rounded-xl text-sm font-semibold text-foreground outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
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
                <p className="text-sm font-bold text-executive-muted">Carregando dados existentes...</p>
             </div>
          ) : (
            <div className="space-y-4 w-full overflow-x-auto">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={computedRows.map(r => r.id)} strategy={verticalListSortingStrategy}>
              <table className="w-full text-sm min-w-[600px]">
                <thead className="bg-surface-container border-b border-border">
                  <tr>
                    <th className="text-left py-3 px-4 text-[10px] font-bold text-executive-muted uppercase tracking-wider w-20">Nível</th>
                    <th className="text-left py-3 px-4 text-[10px] font-bold text-executive-muted uppercase tracking-wider">Conta / Categoria</th>
                    <th className="text-left py-3 px-4 text-[10px] font-bold text-executive-muted uppercase tracking-wider w-40">Tipo</th>
                    <th className="text-right py-3 px-4 text-[10px] font-bold text-executive-muted uppercase tracking-wider w-40">Valor (R$)</th>
                    <th className="w-20"></th>
                  </tr>
                </thead>
                    <tbody className="divide-y divide-border/50">
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
                              className={cn(isLocked ? "bg-surface-container/30" : "")}
                            >
                          <td className="py-2 px-2">
                            {isDre ? (
                              <div className="w-full bg-transparent text-center text-xs font-bold text-executive-secondary">
                                {isAnalitica ? '↳' : row.ordem}
                              </div>
                            ) : (
                              <select
                                value={row.level}
                                onChange={(e) => updateRow(row.id, 'level', Number(e.target.value))}
                                className="w-full bg-card border border-border text-foreground rounded-xl px-2 py-2 text-xs font-semibold focus:ring-2 focus:ring-primary/20 outline-none transition-all text-center cursor-pointer"
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
                                className="w-full py-2 text-sm font-bold text-foreground"
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
                                  "w-full bg-card border border-border text-foreground rounded-xl py-2 px-3 text-sm placeholder:text-executive-muted/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                )}
                              />
                            )}
                          </td>
                          <td className="py-2 px-2">
                            {isDre ? (
                              <div className="w-full py-2 text-xs font-bold text-executive-secondary uppercase tracking-widest text-center">
                                {row.natureza}
                              </div>
                            ) : (
                              <select
                                value={row.type}
                                disabled={row.level > 1}
                                onChange={(e) => updateRow(row.id, 'type', e.target.value)}
                                className={cn(
                                  "w-full border border-border rounded-xl px-3 py-2 text-sm text-foreground font-semibold focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer",
                                  row.level > 1 ? "bg-surface-container/50 text-executive-muted cursor-not-allowed" : "bg-card"
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
                                "w-full border border-border rounded-xl px-3 py-2 text-sm text-right font-mono text-foreground placeholder:text-executive-muted/50 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                                row.hasChildren 
                                  ? "bg-surface-container/50 text-executive-muted font-bold cursor-not-allowed" 
                                  : "bg-card focus:ring-2 focus:ring-primary/20"
                              )}
                            />
                          </td>
                          <td className="py-2 px-2 text-center flex items-center justify-center gap-1">
                            {(!isLocked) && (
                              <button onClick={() => removeRow(row.id)} className="p-1.5 text-rose-500 hover:text-rose-600 hover:bg-critical-soft rounded-lg transition-all cursor-pointer">
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
                                      className="text-[10px] font-bold text-executive-secondary hover:text-primary flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
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
                <div className="text-center py-12 bg-surface-container/30 rounded-3xl border border-dashed border-border">
                  <AlertCircle size={32} className="text-executive-muted mx-auto mb-3" />
                  <p className="text-sm font-bold text-executive-muted">Nenhuma conta inserida ainda.</p>
                </div>
              )}

              {!(selectedType === 'DRE' || selectedType === 'DRE Gerencial') && (
                <button 
                  onClick={addRow}
                  className="w-full py-3.5 border-2 border-dashed border-border rounded-2xl bg-surface-container/30 hover:bg-surface-container text-executive-secondary hover:text-primary transition-all flex items-center justify-center gap-2 font-bold text-xs mt-4 cursor-pointer"
                >
                  <Plus size={16} /> Adicionar Linha
                </button>
              )}
            </div>
          )}
        </div>
      </div>

        <div className="p-6 bg-surface-container border-t border-border flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 py-3.5 bg-card border border-border hover:bg-surface-container text-executive-secondary font-bold text-xs rounded-2xl transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            disabled={saving || rows.length === 0}
            className="flex-1 py-3.5 bg-primary hover:bg-primary/90 text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {saving ? <Loader2 size={16} className="animate-spin text-white" /> : <Database size={16} />}
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
