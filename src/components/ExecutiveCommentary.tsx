import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  CheckCircle2, 
  Loader2, 
  Save, 
  Info 
} from 'lucide-react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { cn } from '../lib/utils';

interface ExecutiveCommentaryProps {
  reportType: string;
  clientId: string;
  year: number;
  month: number;
}

export function ExecutiveCommentary({ reportType, clientId, year, month }: ExecutiveCommentaryProps) {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!clientId) return;
    const fetchNote = async () => {
      try {
        const q = query(
          collection(db, 'report_notes'),
          where('clientId', '==', clientId),
          where('reportType', '==', reportType),
          where('year', '==', year),
          where('month', '==', month)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          setNote(snap.docs[0].data().note || '');
        } else {
          setNote('');
        }
      } catch (error) {
        console.error("Error fetching note:", error);
        handleFirestoreError(error, OperationType.GET, 'report_notes');
      }
    };
    fetchNote();
  }, [clientId, reportType, year, month]);

  const handleSave = async () => {
    if (!clientId) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, 'report_notes'),
        where('clientId', '==', clientId),
        where('reportType', '==', reportType),
        where('year', '==', year),
        where('month', '==', month)
      );
      const snap = await getDocs(q);
      
      if (!snap.empty) {
        await updateDoc(doc(db, 'report_notes', snap.docs[0].id), {
          note,
          updatedAt: serverTimestamp(),
          updatedBy: auth.currentUser?.uid
        });
      } else {
        await addDoc(collection(db, 'report_notes'), {
          clientId,
          reportType,
          year,
          month,
          note,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          createdBy: auth.currentUser?.uid
        });
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving note:", error);
      handleFirestoreError(error, OperationType.WRITE, 'report_notes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
      <div className="bg-slate-900 px-10 py-8 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="p-3 bg-blue-500/20 rounded-2xl">
            <MessageSquare size={22} className="text-blue-400" />
          </div>
          <div>
            <h4 className="text-lg font-display font-black text-white uppercase tracking-widest">Notas Explicativas & Advisory</h4>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.2em]">Parecer técnico do consultor estratégico para o Board</p>
          </div>
        </div>
      </div>
      <div className="p-10 space-y-8">
        <div className="relative group">
          <textarea 
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Insira aqui as observações críticas, variações relevantes e o parecer estratégico sobre esta demonstração..."
            className="w-full h-72 bg-slate-50/50 border border-slate-200 rounded-[40px] p-10 text-xl font-serif italic leading-relaxed text-slate-700 outline-none focus:ring-8 focus:ring-blue-500/5 focus:bg-white focus:border-blue-200 transition-all resize-none shadow-inner"
          />
          <div className="absolute top-6 right-8 text-slate-200 pointer-events-none group-focus-within:text-blue-100 transition-colors">
            <MessageSquare size={48} strokeWidth={1} />
          </div>
        </div>

        <div className="flex items-center justify-between gap-6">
          <div className="flex-1 flex items-center gap-4 bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm shrink-0">
              <Info size={20} />
            </div>
            <p className="text-[10px] text-blue-600/80 font-bold uppercase tracking-wide leading-relaxed italic">
              Este parecer será consolidado nos relatórios executivos e no dashboard estratégico do cliente, servindo como base para decisões do Board.
            </p>
          </div>

          <button 
            onClick={handleSave}
            disabled={loading}
            className={cn(
              "h-16 px-10 rounded-[28px] text-xs font-black uppercase tracking-widest transition-all inline-flex items-center gap-4 shadow-xl active:scale-95 shrink-0",
              saveSuccess 
                ? "bg-emerald-500 text-white shadow-emerald-500/30" 
                : "bg-slate-900 hover:bg-primary text-white shadow-slate-900/20"
            )}
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : saveSuccess ? (
              <CheckCircle2 size={20} />
            ) : (
              <Save size={20} />
            )}
            <span>{saveSuccess ? 'Parecer Salvo' : 'Salvar Parecer Estratégico'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
