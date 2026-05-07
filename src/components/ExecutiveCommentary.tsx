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
    <div className="mt-12 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="bg-slate-900 px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <MessageSquare size={18} className="text-blue-400" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-widest">Notas Explicativas & Advisory</h4>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-[0.1em]">Visão técnica do auditor/consultor estratégico</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className={cn(
            "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all inline-flex items-center gap-2",
            saveSuccess ? "bg-emerald-50 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
          )}
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : saveSuccess ? <CheckCircle2 size={14} /> : <Save size={14} />}
          {saveSuccess ? 'Nota Salva' : 'Salvar Parecer'}
        </button>
      </div>
      <div className="p-8">
        <textarea 
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Insira aqui as observações críticas, variações relevantes e o parecer estratégico sobre esta demonstração..."
          className="w-full h-48 bg-slate-50/50 border border-slate-200 rounded-3xl p-8 text-lg font-serif italic leading-relaxed text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-200 transition-all resize-none shadow-inner"
        />
        <div className="mt-6 flex items-center gap-3 bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
          <Info size={16} className="text-blue-500" />
          <p className="text-xs text-blue-600/70 font-bold uppercase tracking-tight italic">Estas notas serão visíveis para o cliente no dashboard executivo como insights de alta performance.</p>
        </div>
      </div>
    </div>
  );
}
