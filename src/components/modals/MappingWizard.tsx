import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Loader2, Sparkles, ChevronRight, ArrowRightLeft, CheckCircle2 } from 'lucide-react';
import { collection, query, where, getDocs, addDoc, serverTimestamp, limit } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { cn } from '../../lib/utils';
import { SYSTEM_KPI_CATEGORIES } from '../../constants';

export function MappingWizard({ selectedClient, onClose }: any) {
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
      await addDoc(collection(db, 'account_plans'), {
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

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-8 border-b border-border flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-xl font-bold text-muted-foreground">Mapeamento Inteligente</h3>
            <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest font-bold">Vincule itens identificados no PDF ao seu Plano de Contas</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-muted-foreground"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 border-r border-border p-8 overflow-y-auto">
            <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
              <Sparkles size={12} className="text-secondary" /> Itens a Vincular
            </h4>
            
            {loading ? (
              <div className="py-20 text-center">
                <Loader2 size={32} className="animate-spin text-secondary mx-auto mb-4" />
                <p className="text-sm font-bold text-muted-foreground">Analisando documentos...</p>
              </div>
            ) : unmappedEntries.length === 0 ? (
              <div className="py-20 text-center bg-success-soft rounded-2xl border border-emerald-100">
                <CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-2" />
                <p className="text-xs text-emerald-600 px-6">Todos os itens de documentos já estão mapeados.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {unmappedEntries.map(entry => (
                  <button 
                    key={entry}
                    onClick={() => setSelectedEntry(entry)}
                    className={cn(
                      "w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between",
                      selectedEntry === entry ? "bg-secondary/10 border-secondary" : "bg-white border-border"
                    )}
                  >
                    <span className="text-sm font-bold text-muted-foreground">{entry}</span>
                    <ChevronRight size={16} className={selectedEntry === entry ? "text-secondary" : "text-muted-foreground"} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-full md:w-1/2 p-8 bg-slate-50/30 overflow-y-auto">
            {!selectedEntry ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-muted-foreground">
                  <ArrowRightLeft size={32} />
                </div>
                <p className="text-sm text-muted-foreground">Selecione um item ao lado</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-5 bg-white rounded-xl border border-border">
                  <span className="text-[10px] font-black text-muted-foreground uppercase mb-1 block">Mapear item:</span>
                  <p className="text-lg font-bold text-primary">{selectedEntry}</p>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Para Indicador:</label>
                  <div className="grid grid-cols-1 gap-2">
                    {SYSTEM_KPI_CATEGORIES.map(cat => (
                      <button 
                        key={cat.id}
                        onClick={() => setMappingTo(cat.id)}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-xl border text-sm transition-all",
                          mappingTo === cat.id ? "bg-primary text-white" : "bg-white text-muted-foreground border-border hover:bg-slate-50"
                        )}
                      >
                        <span className="font-bold">{cat.label}</span>
                        {mappingTo === cat.id && <CheckCircle2 size={18} />}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  disabled={!mappingTo || loading}
                  onClick={handleSaveMapping}
                  className="w-full py-4 bg-secondary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-secondary/20 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : 'Vincular Conta'}
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
