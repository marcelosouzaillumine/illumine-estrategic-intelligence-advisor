import React, { useState, useEffect } from 'react';
import { X, Bot, FileText, CheckCircle2, AlertTriangle, Loader2, Link2, Search, Edit2, Info } from 'lucide-react';
import { cn } from '../../lib/utils';
import { parseFinancialDocumentIntelligent } from '../../services/importService';
import { useDocumentCurationModalAdapter } from '../../adapters/ui/useDocumentCurationModalAdapter';
import { notificationService } from '../../services/notificationService';
import { auditService } from '../../services/auditService';
import { useAccountPlan } from '../../hooks/useAccountPlan';

interface CurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: any; // O upload inicial (sourceCollection: document_uploads)
  client?: any;
  onSuccess: () => void;
}

export function DocumentCurationModal({ isOpen, onClose, document: docItem, client, onSuccess }: CurationModalProps) {
  const {
    isProcessing,
    isSaving,
    progress,
    extractedDocs,
    error,
    customInstructions,
    setCustomInstructions,
    mappings,
    editingEntry,
    editValue,
    setEditValue,
    isDuplicate,
    standardAccounts,
    handleProcessAI,
    handleApprove,
    handleEditEntry,
    saveEditEntry,
    handleMapAccount,
    setEditingEntry,
    setExtractedDocs,
  } = useDocumentCurationModalAdapter(client, docItem, onSuccess, isOpen);

  // Validations for Blocking
  const avgConfidence = extractedDocs.length > 0 
    ? extractedDocs.reduce((acc, d) => acc + (d.confidenceScore || 100), 0) / extractedDocs.length 
    : 100;
  
  // Pegamos o primeiro CNPJ extraído válido para comparar
  const extractedCnpj = extractedDocs.find(d => d.cnpj)?.cnpj?.replace(/[^0-9]/g, '');
  const clientCnpj = client?.cnpj?.replace(/[^0-9]/g, '');
  
  const hasLowConfidence = avgConfidence < 70;
  const hasCnpjMismatch = extractedCnpj && clientCnpj && extractedCnpj !== clientCnpj;
  const hasUnmappedAccounts = extractedDocs.some(d => d.entries.some((e: any) => !mappings[e.category]));
  
  const canApprove = extractedDocs.length > 0 
    && !hasLowConfidence 
    && !hasCnpjMismatch 
    && !hasUnmappedAccounts
    && !isDuplicate;

  if (!isOpen || !docItem) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-card rounded-3xl w-full max-w-6xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-surface-container/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-primary flex items-center justify-center">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Curadoria Avançada de Dados</h3>
              <p className="text-xs text-muted-foreground font-medium">Extração, Validação e Governança</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-container-high rounded-full text-neutral transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto flex flex-col md:flex-row gap-6 bg-surface-container/30">
          
          {/* Left Column: Info & Processing */}
          <div className="w-full md:w-1/3 flex flex-col gap-6">
            <div className="bg-card p-5 rounded-2xl shadow-sm border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-surface-container-high text-muted-foreground rounded-lg"><FileText size={18} /></div>
                <div>
                  <h4 className="text-sm font-bold text-foreground truncate" title={docItem.fileName}>{docItem.fileName}</h4>
                  <p className="text-xs text-muted-foreground">{client?.fantasia}</p>
                </div>
              </div>
              {docItem.fileUrl && docItem.fileUrl.startsWith('http') && (
                <a href={docItem.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-accent hover:text-accent bg-accent px-4 py-2 rounded-lg transition-colors w-full flex items-center justify-center gap-2">
                  <Link2 size={14} /> Abrir PDF Original
                </a>
              )}
            </div>

            <div className="bg-card p-5 rounded-2xl shadow-sm border border-border">
              <label className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
                <Bot size={14} className="text-primary" /> Instruções para a IA
              </label>
              <textarea
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="Regras de leitura do balancete deste cliente..."
                className="w-full h-24 p-3 bg-surface-container border border-border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none"
                disabled={isProcessing || isSaving}
              />
              {extractedDocs.length === 0 && (
                <button 
                  onClick={handleProcessAI}
                  disabled={isProcessing}
                  className="mt-4 w-full bg-accent text-white px-4 py-2.5 rounded-xl font-bold hover:bg-accent transition-colors shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                  Extrair Dados
                </button>
              )}
            </div>

            {/* Validation Alerts */}
            {extractedDocs.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Gateways de Integração</h4>
                
                <div className={cn("p-3 rounded-xl border flex gap-3", hasLowConfidence ? "bg-red-50 border-red-100 text-red-700" : "bg-success-soft border-emerald-100 text-emerald-700")}>
                  {hasLowConfidence ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
                  <div>
                    <p className="text-xs font-bold">Confiança da Extração</p>
                    <p className="text-[10px] opacity-80">{avgConfidence.toFixed(1)}% (Mínimo: 70%)</p>
                  </div>
                </div>

                <div className={cn("p-3 rounded-xl border flex gap-3", hasCnpjMismatch ? "bg-red-50 border-red-100 text-red-700" : "bg-success-soft border-emerald-100 text-emerald-700")}>
                  {hasCnpjMismatch ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
                  <div>
                    <p className="text-xs font-bold">Autenticidade (CNPJ)</p>
                    <p className="text-[10px] opacity-80">
                      {hasCnpjMismatch ? `Documento: ${extractedCnpj || 'Não lido'} / Cliente: ${clientCnpj}` : 'Validação OK'}
                    </p>
                  </div>
                </div>

                <div className={cn("p-3 rounded-xl border flex gap-3", isDuplicate ? "bg-red-50 border-red-100 text-red-700" : "bg-success-soft border-emerald-100 text-emerald-700")}>
                  {isDuplicate ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
                  <div>
                    <p className="text-xs font-bold">Duplicidade</p>
                    <p className="text-[10px] opacity-80">{isDuplicate ? 'Período já importado' : 'Período Único'}</p>
                  </div>
                </div>

                <div className={cn("p-3 rounded-xl border flex gap-3", hasUnmappedAccounts ? "bg-warning-soft border-amber-100 text-amber-700" : "bg-success-soft border-emerald-100 text-emerald-700")}>
                  {hasUnmappedAccounts ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
                  <div>
                    <p className="text-xs font-bold">De-Para Estrutural</p>
                    <p className="text-[10px] opacity-80">{hasUnmappedAccounts ? 'Existem contas sem classificação' : 'Plano Mapeado'}</p>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Right Column: Data & Curation */}
          <div className="w-full md:w-2/3 bg-card border border-border rounded-2xl shadow-sm flex flex-col overflow-hidden">
            {error && (
              <div className="m-4 p-4 bg-red-50 text-red-700 rounded-xl flex items-start gap-3 border border-red-100">
                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {!isProcessing && extractedDocs.length === 0 && !error && (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-neutral">
                <Bot size={48} className="mb-4 opacity-50" />
                <p className="font-medium text-muted-foreground">Aguardando Extração Inteligente</p>
                <p className="text-xs mt-2 max-w-sm">A IA analisará o PDF e estruturará os dados para sua revisão.</p>
              </div>
            )}

            {isProcessing && (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <Loader2 size={40} className="animate-spin text-primary mb-6" />
                <div className="w-full max-w-xs h-2 bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-sm font-medium text-muted-foreground mt-4">Lendo e estruturando documento...</p>
              </div>
            )}

            {extractedDocs.length > 0 && (
              <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                {extractedDocs.map((doc, dIdx) => (
                  <div key={dIdx} className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-border">
                      <div>
                        <h4 className="font-bold text-foreground">{doc.type} <span className="text-neutral text-sm ml-2">({doc.month}/{doc.year})</span></h4>
                        {doc.periodoDocumento && <p className="text-[10px] text-muted-foreground">Lido no cabeçalho: {doc.periodoDocumento}</p>}
                      </div>
                      <div className="text-xs font-bold bg-surface-container-high px-3 py-1 rounded-full text-muted-foreground">
                        {doc.entries.length} registros
                      </div>
                    </div>

                    <div className="grid grid-cols-[1fr_200px_150px] gap-4 text-xs font-bold text-neutral uppercase px-2">
                      <div>Conta Original do Documento</div>
                      <div>De-Para (Plano Illumine)</div>
                      <div className="text-right">Valor</div>
                    </div>

                    <div className="space-y-2">
                      {doc.entries.map((entry: any, eIdx: number) => {
                        const isEditing = editingEntry?.docIdx === dIdx && editingEntry?.entryIdx === eIdx;
                        const isMapped = !!mappings[entry.category];
                        
                        return (
                          <div key={eIdx} className={cn("grid grid-cols-[1fr_200px_150px] gap-4 items-center p-2 rounded-lg border", isMapped ? "bg-card border-border" : "bg-warning-soft/50 border-amber-100")}>
                            {/* Conta Original */}
                            <div className="truncate text-xs font-medium text-foreground" title={entry.category}>
                              {entry.category}
                            </div>
                            
                            {/* Select De-Para */}
                            <div>
                              <select 
                                value={mappings[entry.category] || ''}
                                onChange={(e) => handleMapAccount(entry.category, e.target.value)}
                                className={cn(
                                  "w-full text-[10px] md:text-xs p-1.5 rounded-md border outline-none",
                                  isMapped ? "bg-surface-container border-border" : "bg-card border-amber-300 text-amber-800 focus:border-amber-500"
                                )}
                              >
                                <option value="" disabled>Selecionar conta padrão...</option>
                                {standardAccounts.map(acc => (
                                  <option key={acc.id} value={acc.id}>{acc.code ? `${acc.code} - ` : ''}{acc.name}</option>
                                ))}
                              </select>
                            </div>

                            {/* Valor Editável */}
                            <div className="text-right flex items-center justify-end gap-2 group">
                              {isEditing ? (
                                <div className="flex items-center gap-1">
                                  <input 
                                    type="number" 
                                    value={editValue} 
                                    onChange={e => setEditValue(Number(e.target.value))}
                                    className="w-24 p-1 text-xs border rounded text-right"
                                    autoFocus
                                  />
                                  <button onClick={saveEditEntry} className="p-1 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200">
                                    <CheckCircle2 size={14} />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <button onClick={() => handleEditEntry(dIdx, eIdx, entry.value)} className="p-1 text-neutral/70 hover:text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Edit2 size={12} />
                                  </button>
                                  <span className={cn("text-xs font-bold", entry.value < 0 ? "text-red-600" : "text-foreground")}>
                                    {entry.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        {extractedDocs.length > 0 && (
          <div className="p-6 border-t border-border bg-card flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground max-w-lg">
              <Info size={16} className="text-primary" />
              <span>
                As edições e o mapeamento De-Para serão rastreados no log de auditoria do sistema. 
                A integração só é permitida caso não haja restrições (indicadores verdes).
              </span>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setExtractedDocs([])}
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl font-bold text-muted-foreground hover:bg-surface-container-high transition-colors disabled:opacity-50"
              >
                Descartar
              </button>
              <button 
                onClick={handleApprove}
                disabled={isSaving || !canApprove}
                title={!canApprove ? "Resolva as pendências indicadas para habilitar a integração." : ""}
                className="bg-emerald-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving && <Loader2 size={16} className="animate-spin" />}
                Integrar Dados Seguros
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
