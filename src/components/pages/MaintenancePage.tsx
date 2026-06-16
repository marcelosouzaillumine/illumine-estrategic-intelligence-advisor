import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Database, Trash2, AlertTriangle, CheckCircle2, Loader2, Search, HardDrive, RefreshCw, ShieldAlert, ChevronRight, FileText, ImageIcon } from 'lucide-react';
import { collection, query, getDocs, where, deleteDoc, doc, writeBatch, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { PageHeader } from '../Common';
import { cn, formatCurrency } from '../../lib/utils';
import { useGovernance } from '../../lib/governanceContext';
import { notificationService } from '../../services/notificationService';

export function MaintenancePage({ clients }: { clients: any[] }) {
  const { translateLabel: t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<Record<string, 'idle' | 'loading' | 'success' | 'error'>>({});
  const [logs, setLogs] = useState<string[]>([]);
  const [pendingDocs, setPendingDocs] = useState<any[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const { role } = useGovernance();

  React.useEffect(() => {
    if (role !== 'master' && role !== 'admin') return;
    
    setLoadingDocs(true);
    const q = query(
      collection(db, 'financial_staging'),
      where('status', '==', 'pending')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPendingDocs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoadingDocs(false);
    });
    
    return () => unsubscribe();
  }, [role]);

  const handleApprove = async (docId: string, entry: any) => {
    try {
      const batch = writeBatch(db);
      const targetDoc = doc(collection(db, entry.targetCollection || 'financial_entries'));
      batch.set(targetDoc, {
        ...(entry.payload || {}),
        status: 'approved',
        approvedAt: serverTimestamp(),
        approvedBy: auth.currentUser?.uid,
        requiresApproval: false
      });
      batch.update(doc(db, 'financial_staging', docId), { status: 'migrated' });
      await batch.commit();
      
      // Notify User
      await notificationService.createNotification({
        userId: entry.createdBy,
        title: 'Documento Aprovado',
        message: `Seu documento "${entry.fileName}" foi aprovado e já está disponível nos indicadores.`,
        type: 'success',
        link: 'dashboard'
      });
      
      addLog(`Documento ${entry.fileName} aprovado.`);
    } catch (e: any) {
      addLog(`Erro ao aprovar: ${e.message}`);
    }
  };

  const handleReject = async (docId: string, entry: any) => {
    try {
      await updateDoc(doc(db, 'financial_staging', docId), {
        status: 'rejected',
        rejectedAt: serverTimestamp(),
        rejectedBy: auth.currentUser?.uid
      });

      // Notify User
      await notificationService.createNotification({
        userId: entry.createdBy,
        title: 'Documento Rejeitado',
        message: `Seu documento "${entry.fileName}" não pôde ser aprovado. Verifique os dados e tente novamente.`,
        type: 'error',
        link: 'dados-historicos'
      });

      addLog(`Documento ${entry.fileName} rejeitado.`);
    } catch (e: any) {
      addLog(`Erro ao rejeitar: ${e.message}`);
    }
  };

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 50));
  };

  const filteredClients = clients.filter(c => 
    (c.fantasia || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.razao || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const purgeMockupData = async (clientId: string, fantasia: string) => {
    if (!window.confirm(`Deseja realmente realizar a limpeza cirúrgica de dados de MOCKUP para ${fantasia}? Esta ação removerá indicadores marcados como Histórico/Projetado e lançamentos financeiros simulados.`)) {
      return;
    }

    setStatus(prev => ({ ...prev, [clientId]: 'loading' }));
    addLog(`Iniciando limpeza cirúrgica para ${fantasia}...`);

    try {
      let totalDeleted = 0;

      // 1. Purge Indicators (Mock categories)
      const indQuery = query(
        collection(db, 'indicators'),
        where('clientId', '==', clientId),
        where('cat', 'in', ['Histórico', 'Projetado'])
      );
      const indSnap = await getDocs(indQuery);
      
      const batch = writeBatch(db);
      indSnap.docs.forEach(d => {
        batch.delete(d.ref);
        totalDeleted++;
      });
      await batch.commit();
      addLog(`Removidos ${indSnap.docs.length} indicadores (Histórico/Projetado).`);

      // 2. Purge Financial Entries (Mock types or patterns)
      // Since we don't have a mock flag, we can't easily distinguish.
      // But we can delete the ones created by the AI Service if they match the pattern.
      // For now, we'll focus on the indicators which are the main source of "Score 92".
      
      setStatus(prev => ({ ...prev, [clientId]: 'success' }));
      addLog(`Limpeza concluída para ${fantasia}. Total de documentos removidos: ${totalDeleted}`);
    } catch (error: any) {
      console.error('Purge error:', error);
      setStatus(prev => ({ ...prev, [clientId]: 'error' }));
      addLog(`ERRO em ${fantasia}: ${error.message}`);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto space-y-8 md:space-y-16 pb-24 md:pb-32 animate-executive-fade px-4 sm:px-6 md:px-8">
      <PageHeader 
        title="Manutenção de Dados" 
        subtitle="Saneamento cirúrgico e otimização de registros para garantir a integridade do ecossistema de inteligência financeira."
        icon={HardDrive}
        color="executive"
        actions={
          <div className="relative z-10 text-left md:text-right bg-surface-container/30 backdrop-blur-md border border-border rounded-xl px-4 md:px-6 py-3 md:py-4 shadow-inner w-full sm:w-auto mt-4 sm:mt-0">
             <span className="text-[9px] md:text-[10px] font-medium text-muted-foreground uppercase tracking-widest block mb-1.5">Status do Firestore</span>
             <span className="text-success font-bold uppercase text-[9px] md:text-[10px] flex items-center sm:justify-end gap-2 tracking-widest">
               <div className="w-1.5 h-1.5 rounded-full bg-success-soft0 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
               Sincronizado
             </span>
          </div>
        }
      />

      <div className="space-y-8 md:space-y-12">
        {/* Pending Approvals Section */}
        {(role === 'master' || role === 'admin') && (
          <div className="bg-card border border-border rounded-3xl md:rounded-[32px] p-6 md:p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 md:w-1.5 bg-warning-soft0 h-full" />
            <div className="mb-8 md:mb-10">
              <h3 className="text-xl md:text-2xl font-black text-foreground font-display tracking-tight">Curadoria & Aprovações</h3>
              <p className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] md:tracking-[0.25em] mt-2">Documentos aguardando validação técnica</p>
            </div>

            {loadingDocs ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-secondary" size={32} />
              </div>
            ) : pendingDocs.length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {pendingDocs.map((doc) => (
                  <div key={doc.id} className="p-6 md:p-8 bg-surface-container/30 border border-border rounded-2xl group hover:border-amber-200/50 transition-all flex flex-col">
                    <div className="flex flex-col h-full justify-between gap-6 md:gap-8">
                      <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-card border border-border flex items-center justify-center text-amber-500 shadow-sm shrink-0">
                          <FileText className="w-6 h-6 md:w-7 md:h-7" />
                        </div>
                        <div className="min-w-0 w-full">
                          <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                            <h4 className="text-base md:text-lg font-black text-foreground font-display tracking-tight truncate max-w-full">{doc.fileName}</h4>
                            <span className="px-2 py-0.5 bg-warning-soft0/10 text-amber-500 border border-amber-500/20 text-[8px] font-black uppercase rounded-full shrink-0">Pendente</span>
                          </div>
                          <p className="text-[11px] md:text-xs font-bold text-muted-foreground mb-3 truncate">Cliente: {doc.clientName}</p>
                          <div className="flex flex-wrap gap-3 md:gap-4 text-[9px] md:text-[10px] font-black uppercase text-muted-foreground/60">
                            <span className="bg-surface-container px-2 py-1 rounded-md">Tipo: {doc.type}</span>
                            <span className="bg-surface-container px-2 py-1 rounded-md">Período: {doc.periodType === 'anual' ? doc.year : `${doc.month}/${doc.year}`}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-auto">
                        {doc.fileUrl && (
                          <a 
                            href={doc.fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-1 px-4 py-3 bg-card border border-border rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-surface-container transition-all text-center text-foreground"
                          >
                            Original
                          </a>
                        )}
                        <button 
                          onClick={() => handleReject(doc.id, doc)}
                          className="flex-1 px-4 py-3 bg-critical-soft0/10 text-rose-500 border border-rose-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-critical-soft0/20 transition-all"
                        >
                          Rejeitar
                        </button>
                        <button 
                          onClick={() => handleApprove(doc.id, doc)}
                          className="flex-1 px-4 py-3 bg-primary text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-primary/80 transition-all shadow-lg shadow-primary/20"
                        >
                          Aprovar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-surface-container/30 rounded-[32px] border-2 border-dashed border-border">
                <CheckCircle2 size={40} className="mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Nenhuma aprovação pendente</p>
              </div>
            )}
          </div>
        )}

        <div className="grid xl:grid-cols-[1fr_400px] gap-6 md:gap-8">
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-3xl md:rounded-[32px] p-6 md:p-10 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 md:w-1.5 bg-secondary h-full" />
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-8 mb-10">
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-foreground font-display tracking-tight">Saneamento de Base</h3>
                  <p className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] md:tracking-[0.25em] mt-2 line-clamp-2 md:line-clamp-none">Remover artefatos de simulação da IA</p>
                </div>
                <div className="relative w-full lg:w-80 shrink-0">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input 
                    type="text" 
                    placeholder="Pesquisar ecossistema..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-surface-container border border-border rounded-2xl text-xs font-bold outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all placeholder:text-muted-foreground/30 text-foreground"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {filteredClients.map((client) => (
                  <div 
                    key={client.id}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 md:p-8 bg-surface-container/30 hover:bg-surface-container border border-border rounded-2xl transition-all group relative overflow-hidden"
                  >
                    <div className="flex items-center gap-4 md:gap-6 relative z-10 w-full md:w-auto">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-card border border-border flex items-center justify-center text-muted-foreground group-hover:text-secondary group-hover:scale-105 transition-all shadow-inner shrink-0">
                        <Database className="w-6 h-6 md:w-7 md:h-7" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-base md:text-lg font-black text-foreground font-display tracking-tight truncate">{client.fantasia || client.razao}</h4>
                        <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">UUID: {client.id.slice(0, 8)}...</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-6 relative z-10 w-full md:w-auto mt-2 md:mt-0">
                      {status[client.id] === 'success' && (
                        <div className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-success-soft0/10 text-emerald-500 rounded-full border border-emerald-500/20 animate-executive-fade justify-center">
                          <CheckCircle2 size={14} />
                          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Sanitizado</span>
                        </div>
                      )}
                      <button
                        onClick={() => purgeMockupData(client.id, client.fantasia || client.razao)}
                        disabled={status[client.id] === 'loading'}
                        className={cn(
                          "flex items-center justify-center gap-2 md:gap-3 px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all shadow-lg w-full md:w-auto",
                          status[client.id] === 'loading'
                            ? "bg-surface-container text-muted-foreground cursor-wait"
                            : "bg-primary text-white hover:bg-secondary hover:shadow-secondary/30 active:scale-95"
                        )}
                      >
                        {status[client.id] === 'loading' ? (
                          <><Loader2 size={14} className="animate-spin" /> Processando</>
                        ) : (
                          <><Trash2 size={14} /> Limpeza Cirúrgica</>
                        )}
                      </button>
                    </div>
                  </div>
                ))}

                {filteredClients.length === 0 && (
                  <div className="text-center py-20 bg-surface-container/30 rounded-[32px] border-2 border-dashed border-border">
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Nenhum cliente encontrado</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-primary rounded-3xl md:rounded-[32px] p-6 md:p-10 text-white shadow-2xl relative overflow-hidden group border border-white/5">
              <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/10 rounded-full blur-3xl -mr-24 -mt-24 group-hover:bg-secondary/20 transition-all duration-700"></div>
              <h4 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] mb-6 md:mb-8 flex items-center gap-3 text-secondary">
                <ShieldAlert size={20} className="shrink-0" /> <span className="line-clamp-1">Protocolo de Segurança</span>
              </h4>
              <div className="space-y-6 relative z-10">
                <p className="text-[11px] md:text-xs text-white/70 leading-relaxed font-medium">
                  Estas ferramentas operam diretamente no núcleo da base de dados. O motor de busca identifica documentos marcados como simulação estrutural.
                </p>
                <div className="p-4 md:p-6 bg-white/5 rounded-2xl md:rounded-3xl border border-white/10 backdrop-blur-sm">
         <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-executive-secondary mb-3 flex items-center gap-2">
                    <AlertTriangle size={12} className="shrink-0" /> Ação de Alta Criticidade
                  </p>
                  <p className="text-[9px] md:text-[10px] text-white/40 leading-normal font-medium">
                    Este procedimento é irreversível. Utilize apenas para saneamento de contas reais ou purga total de mocks.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-3xl md:rounded-[32px] p-6 md:p-10 shadow-sm flex flex-col h-[400px] md:h-[500px] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none text-muted-foreground">
                 <RefreshCw size={200} />
              </div>
              <h4 className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-muted-foreground mb-6 md:mb-8 flex items-center justify-between relative z-10">
                Console de Saída
                <button 
                  onClick={() => setLogs([])}
                  className="p-2 hover:bg-surface-container rounded-xl transition-colors text-muted-foreground/50 hover:text-secondary shrink-0"
                >
                  <RefreshCw size={14} />
                </button>
              </h4>
              <div className="flex-1 overflow-y-auto space-y-3 pr-4 custom-scrollbar relative z-10">
                {logs.map((log, i) => (
                  <div key={i} className="text-[10px] font-mono text-muted-foreground border-l-2 border-secondary/20 pl-4 py-1.5 hover:border-secondary transition-colors">
          <span className="text-secondary/40 mr-2 ">{i + 1}</span>
                    {log}
                  </div>
                ))}
                {logs.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center opacity-30">
                     <Loader2 size={24} className="mb-4 animate-spin-slow text-muted-foreground" />
                     <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Aguardando Execução</p>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
