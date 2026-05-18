import React, { useState } from 'react';
import { X, Bot, FileText, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { parseFinancialDocumentIntelligent } from '../../services/importService';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { notificationService } from '../../services/notificationService';

interface CurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: any;
  client?: any; // Add client prop to access customAIPrompt
  onSuccess: () => void;
}

export function DocumentCurationModal({ isOpen, onClose, document: docItem, client, onSuccess }: CurationModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedDocs, setExtractedDocs] = useState<any[]>([]);
  const [error, setError] = useState('');
  
  // State for the "training" instructions
  const [customInstructions, setCustomInstructions] = useState(client?.customAIPrompt || '');

  if (!isOpen || !docItem) return null;

  const handleProcessAI = async () => {
    if (!docItem.fileUrl || !docItem.fileUrl.startsWith('http')) {
      setError("Este documento não possui um arquivo válido vinculado (upload falhou). Você precisará fazer o upload novamente para usar a Curadoria IA.");
      return;
    }

    setIsProcessing(true);
    setError('');
    setProgress(10);
    setExtractedDocs([]);

    try {
      if (!docItem.fileUrl) {
        throw new Error("Arquivo não disponível para download.");
      }

      // Persist the custom instructions to the client document so it's "remembered"
      if (client?.id && customInstructions !== client.customAIPrompt) {
        try {
          const clientRef = doc(db, 'clients', client.id);
          await updateDoc(clientRef, { customAIPrompt: customInstructions });
          console.log("[Curation] Default client instructions updated.");
        } catch (dbErr) {
          console.warn("[Curation] Failed to save client instructions to DB:", dbErr);
        }
      }

      // Fetch the file from the URL as a File object
      const response = await fetch(docItem.fileUrl);
      const blob = await response.blob();
      const file = new File([blob], docItem.fileName, { type: 'application/pdf' });

      setProgress(30);

      const aiDocs = await parseFinancialDocumentIntelligent(
        file, 
        (pct) => {
          const mappedPct = 30 + Math.round((pct / 100) * 70);
          setProgress(mappedPct);
        },
        customInstructions // Pass the "training" instructions here
      );

      if (aiDocs && aiDocs.length > 0) {
        setExtractedDocs(aiDocs);
      } else {
        setError('A Inteligência Artificial não encontrou dados válidos neste documento.');
      }
    } catch (err: any) {
      console.error("Curation Error:", err);
      setError(err.message || 'Erro ao processar com Inteligência Artificial.');
    } finally {
      setIsProcessing(false);
      setProgress(100);
    }
  };

  const handleApprove = async () => {
    if (extractedDocs.length === 0) return;
    setIsProcessing(true);
    setError('');

    try {
      for (const aiDoc of extractedDocs) {
        const payload = {
          clientId: docItem.clientId,
          clientName: docItem.clientName,
          type: aiDoc.type,
          periodType: aiDoc.month === 12 ? 'anual' : 'mensal',
          month: aiDoc.month,
          year: aiDoc.year,
          mes: aiDoc.month,
          ano: aiDoc.year,
          data: aiDoc.entries,
          fileName: docItem.fileName,
          fileUrl: docItem.fileUrl,
          createdAt: serverTimestamp(),
          createdBy: docItem.createdBy,
          creatorEmail: docItem.creatorEmail,
          status: 'approved', // Automatically approved by Master Admin
          requiresApproval: false,
          sourceCollection: 'financial_entries'
        };
        await addDoc(collection(db, 'financial_entries'), payload);
      }

      // Mark the raw document as processed
      const docRef = doc(db, 'document_uploads', docItem.id);
      await updateDoc(docRef, { status: 'processed', processedAt: serverTimestamp() });

      // Notify the original uploader if possible
      await notificationService.createNotification({
        userId: docItem.createdBy,
        title: 'Documento Aprovado',
        message: `O documento ${docItem.fileName} foi curado por IA e aprovado pelo administrador.`,
        type: 'approval_request',
        link: 'dados-historicos',
        metadata: {
          clientId: docItem.clientId,
          fileName: docItem.fileName
        }
      });

      onSuccess();
    } catch (err: any) {
      console.error("Approval Error:", err);
      setError(err.message || 'Erro ao salvar os documentos aprovados.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Curadoria de Documento (IA)</h3>
              <p className="text-xs text-slate-500 font-medium">Extração e aprovação guiada por Inteligência Artificial</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          {/* File Info */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl mb-6 border border-slate-100">
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-3 rounded-xl shadow-sm",
                (!docItem.fileUrl || !docItem.fileUrl.startsWith('http')) ? "bg-red-50 text-red-400" : "bg-white text-slate-400"
              )}>
                <FileText size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">{docItem.fileName}</h4>
                <div className="flex items-center gap-2 mt-1 text-xs font-medium">
                  {(!docItem.fileUrl || !docItem.fileUrl.startsWith('http')) ? (
                    <span className="text-red-500 flex items-center gap-1">
                      <AlertTriangle size={12} />
                      Arquivo original não disponível (Falha no Upload)
                    </span>
                  ) : (
                    <>
                      <span className="text-slate-500">Cliente: {docItem.clientName}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500">Enviado por: {docItem.creatorEmail}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            {docItem.fileUrl && docItem.fileUrl.startsWith('http') && (
              <a 
                href={docItem.fileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-lg transition-colors"
              >
                Ver Arquivo Original
              </a>
            )}
          </div>

          {/* Training Area */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-widest mb-3">
              <Bot size={14} className="text-blue-500" />
              Treinamento de Olhar (IA) - Padrão deste Cliente
            </label>
            <textarea
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="Ex: 'Neste relatório, o Balanço está nas páginas 2 e 3. Ignore a coluna de orçamento e foque na coluna Realizado 2024...'"
              className="w-full h-24 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none font-medium placeholder:text-slate-400"
              disabled={isProcessing}
            />
            <p className="mt-2 text-[10px] text-slate-400 font-medium">
              As instruções acima serão salvas para este cliente e usadas automaticamente em todos os próximos uploads.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-2xl flex items-start gap-3 border border-red-100">
              <AlertTriangle size={18} className="shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {extractedDocs.length === 0 && !isProcessing && !error && (
            <div className="text-center py-12">
              <Bot size={48} className="mx-auto text-slate-300 mb-4" />
              <h4 className="text-lg font-bold text-slate-700 mb-2">Pronto para Extração</h4>
              <p className="text-sm text-slate-500 max-w-md mx-auto mb-8">
                A Inteligência Artificial fará a leitura do PDF original, separando anos e identificando Balanços e DREs automaticamente.
              </p>
              <button 
                onClick={handleProcessAI}
                className="bg-blue-600 text-white px-5 md:px-8 py-2 md:py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
              >
                Iniciar Processamento com IA
              </button>
            </div>
          )}

          {isProcessing && extractedDocs.length === 0 && (
            <div className="text-center py-12">
              <Loader2 size={48} className="mx-auto text-blue-600 animate-spin mb-6" />
              <h4 className="text-lg font-bold text-slate-700 mb-2">Processando Documento...</h4>
              <p className="text-sm text-slate-500 mb-6">A Inteligência Artificial está lendo as demonstrações financeiras.</p>
              <div className="w-full max-w-md mx-auto h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {extractedDocs.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-emerald-600 font-bold mb-4">
                <CheckCircle2 size={20} />
                <span>{extractedDocs.length} Documento(s) Encontrado(s)</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {extractedDocs.map((doc, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-2xl p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h5 className="font-bold text-slate-800">{doc.type}</h5>
                        <p className="text-xs text-slate-500 font-medium">Competência: {doc.month}/{doc.year}</p>
                      </div>
                      <div className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-md">
                        {doc.entries.length} contas
                      </div>
                    </div>
                    <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                      {doc.entries.slice(0, 20).map((entry: any, eIdx: number) => (
                        <div key={eIdx} className="flex justify-between text-xs border-b border-slate-50 pb-1">
                          <span className="text-slate-600 mr-2" title={entry.category}>{entry.category}</span>
                          <span className={entry.value < 0 ? 'text-red-600 font-medium' : 'text-slate-800 font-medium'}>
                            {entry.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </span>
                        </div>
                      ))}
                      {doc.entries.length > 20 && (
                        <div className="text-center text-xs text-slate-400 pt-2 font-medium">
                          + {doc.entries.length - 20} registros ocultos...
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {extractedDocs.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">
              Revise os dados extraídos acima. Ao aprovar, eles serão integrados ao Cockpit Financeiro.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setExtractedDocs([])}
                disabled={isProcessing}
                className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50"
              >
                Descartar Extração
              </button>
              <button 
                onClick={handleApprove}
                disabled={isProcessing}
                className="bg-emerald-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 disabled:opacity-50 flex items-center gap-2"
              >
                {isProcessing && <Loader2 size={16} className="animate-spin" />}
                Aprovar e Integrar Dados
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
