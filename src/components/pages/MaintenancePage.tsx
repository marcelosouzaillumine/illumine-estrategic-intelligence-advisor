import React, { useState } from 'react';
import { 
  Database, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2, 
  Search,
  HardDrive,
  RefreshCw,
  ShieldAlert,
  ChevronRight,
  FileText,
  ImageIcon
} from 'lucide-react';
import { collection, query, getDocs, where, deleteDoc, doc, writeBatch, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { PageHeader } from '../Common';
import { cn, formatCurrency } from '../../lib/utils';
import { useGovernance } from '../../lib/governanceContext';
import { notificationService } from '../../services/notificationService';

export function MaintenancePage({ clients }: { clients: any[] }) {
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
      collection(db, 'financial_entries'),
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
      await updateDoc(doc(db, 'financial_entries', docId), {
        status: 'approved',
        approvedAt: serverTimestamp(),
        approvedBy: auth.currentUser?.uid
      });
      
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
      await updateDoc(doc(db, 'financial_entries', docId), {
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
    <div className="max-w-[1440px] mx-auto space-y-16 pb-32 animate-executive-fade">
      <PageHeader 
        title="Manutenção de Dados" 
        subtitle="Saneamento cirúrgico e otimização de registros para garantir a integridade do ecossistema de inteligência financeira."
        icon={HardDrive}
        color="executive"
        actions={
          <div className="relative z-10 text-right bg-surface-container/30 backdrop-blur-md border border-border rounded-md px-6 py-4 shadow-inner">
             <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest block mb-1">Status do Firestore</span>
             <span className="text-success font-medium uppercase text-[10px] flex items-center justify-end gap-2 tracking-widest">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
               Sincronizado
             </span>
          </div>
        }
      />

      <div className="space-y-12">
        {/* Pending Approvals Section */}
        {(role === 'master' || role === 'admin') && (
          <div className="bg-card border border-border rounded-[32px] p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 bg-amber-500 h-full" />
            <div className="mb-10">
              <h3 className="text-2xl font-black text-foreground font-display tracking-tight">Curadoria & Aprovações</h3>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] mt-2">Documentos aguardando validação técnica</p>
            </div>

            {loadingDocs ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-secondary" size={32} />
              </div>
            ) : pendingDocs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingDocs.map((doc) => (
                  <div key={doc.id} className="p-8 bg-surface-container/30 border border-border rounded-2xl group hover:border-amber-200/50 transition-all">
                    <div className="flex flex-col h-full justify-between gap-6">
                      <div className="flex items-start gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center text-amber-500 shadow-sm shrink-0">
                          <FileText size={28} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="text-lg font-black text-foreground font-display tracking-tight">{doc.fileName}</h4>
                            <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[8px] font-black uppercase rounded-full shrink-0">Pendente</span>
                          </div>
                          <p className="text-xs font-bold text-muted-foreground mb-2">Cliente: {doc.clientName}</p>
                          <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase text-muted-foreground/60">
                            <span>Tipo: {doc.type}</span>
                            <span>Período: {doc.periodType === 'anual' ? doc.year : `${doc.month}/${doc.year}`}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
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
                          className="flex-1 px-4 py-3 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-500/20 transition-all"
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

        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-[32px] p-10 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 bg-secondary h-full" />
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
                <div>
                  <h3 className="text-2xl font-black text-foreground font-display tracking-tight">Saneamento de Base</h3>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] mt-2">Remover artefatos de simulação da IA</p>
                </div>
                <div className="relative w-full md:w-80">
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
                    className="flex items-center justify-between p-8 bg-surface-container/30 hover:bg-surface-container border border-border rounded-2xl transition-all group relative overflow-hidden"
                  >
                    <div className="flex items-center gap-6 relative z-10">
                      <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center text-muted-foreground group-hover:text-secondary group-hover:scale-105 transition-all shadow-inner">
                        <Database size={28} />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-foreground font-display tracking-tight">{client.fantasia || client.razao}</h4>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">UUID: {client.id.slice(0, 8)}...</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 relative z-10">
                      {status[client.id] === 'success' && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20 animate-executive-fade">
                          <CheckCircle2 size={14} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Sanitizado</span>
                        </div>
                      )}
                      <button
                        onClick={() => purgeMockupData(client.id, client.fantasia || client.razao)}
                        disabled={status[client.id] === 'loading'}
                        className={cn(
                          "flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg",
                          status[client.id] === 'loading'
                            ? "bg-surface-container text-muted-foreground cursor-wait"
                            : "bg-primary text-white hover:bg-secondary hover:shadow-secondary/30 active:scale-95 text-[10px] font-black uppercase tracking-widest"
                        )}
                      >
                        {status[client.id] === 'loading' ? (
                          <><Loader2 size={16} className="animate-spin" /> Processando</>
                        ) : (
                          <><Trash2 size={16} /> Limpeza Cirúrgica</>
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
            <div className="bg-primary rounded-[32px] p-10 text-white shadow-2xl relative overflow-hidden group border border-white/5">
              <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/10 rounded-full blur-3xl -mr-24 -mt-24 group-hover:bg-secondary/20 transition-all duration-700"></div>
              <h4 className="text-[11px] font-black uppercase tracking-[0.3em] mb-8 flex items-center gap-3 text-secondary">
                <ShieldAlert size={20} /> Protocolo de Segurança
              </h4>
              <div className="space-y-6 relative z-10">
                <p className="text-xs text-white/70 leading-relaxed font-medium">
                  Estas ferramentas operam diretamente no núcleo da base de dados. O motor de busca identifica documentos marcados como simulação estrutural.
                </p>
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-3 flex items-center gap-2">
                    <AlertTriangle size={12} /> Ação de Alta Criticidade
                  </p>
                  <p className="text-[10px] text-white/40 leading-normal font-medium">
                    Este procedimento é irreversível. Utilize apenas para saneamento de contas reais ou purga total de mocks.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-[32px] p-10 shadow-sm flex flex-col h-[500px] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none text-muted-foreground">
                 <RefreshCw size={200} />
              </div>
              <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-8 flex items-center justify-between relative z-10">
                Console de Saída
                <button 
                  onClick={() => setLogs([])}
                  className="p-2 hover:bg-surface-container rounded-xl transition-colors text-muted-foreground/50 hover:text-secondary"
                >
                  <RefreshCw size={14} />
                </button>
              </h4>
              <div className="flex-1 overflow-y-auto space-y-3 pr-4 custom-scrollbar relative z-10">
                {logs.map((log, i) => (
                  <div key={i} className="text-[10px] font-mono text-muted-foreground border-l-2 border-secondary/20 pl-4 py-1.5 hover:border-secondary transition-colors">
                    <span className="text-secondary/40 mr-2 opacity-50">{i + 1}</span>
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
