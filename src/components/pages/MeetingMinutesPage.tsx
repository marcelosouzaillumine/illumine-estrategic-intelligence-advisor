import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Calendar, 
  Users, 
  Clock, 
  ChevronRight, 
  MoreHorizontal, 
  Trash2, 
  Edit3, 
  Download, 
  ChevronLeft,
  Save,
  X,
  AlertCircle,
  CheckCircle2,
  Briefcase,
  MapPin,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, where, getDocs, addDoc, serverTimestamp, updateDoc, doc, deleteDoc, orderBy, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { PageHeader, StatusBadge } from '../Common';
import { cn } from '../../lib/utils';
import { useDataTable } from '../../hooks/useDataTable';

export interface ParticipantReview {
  name: string;
  userEmail?: string;
  userId?: string;
  status: 'Approved' | 'ReviewRequested' | 'Pending';
  comment?: string;
  updatedAt?: any;
}

interface MeetingMinute {
  id?: string;
  clientId: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  participants: string[];
  objective: string;
  agenda: string;
  decisions: string;
  actions: { task: string; responsible: string; deadline: string }[];
  nextMeetingDate?: string;
  status: 'Draft' | 'Finalized';
  reviews?: ParticipantReview[];
  createdAt?: any;
  updatedAt?: any;
}

export function MeetingMinutesPage({ clientId }: { clientId: string }) {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [loading, setLoading] = useState(true);
  const [minutes, setMinutes] = useState<MeetingMinute[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<MeetingMinute>({
    clientId,
    title: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    location: 'Remoto / Online',
    participants: [],
    objective: '',
    agenda: '',
    decisions: '',
    actions: [],
    status: 'Draft',
    reviews: []
  });

  const [tempParticipant, setTempParticipant] = useState('');
  const [tempAction, setTempAction] = useState({ task: '', responsible: '', deadline: '' });

  // States for Participant Review and Approval
  const [activeReviewer, setActiveReviewer] = useState<string | null>(null);
  const [reviewStatus, setReviewStatus] = useState<'Approved' | 'ReviewRequested'>('Approved');
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    if (!clientId) return;

    setLoading(true);
    const q = query(
      collection(db, 'meeting_minutes'),
      where('clientId', '==', clientId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MeetingMinute));
      // Sort in-memory to avoid composite index requirement
      data.sort((a, b) => b.date.localeCompare(a.date));
      setMinutes(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching minutes:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [clientId]);

  const handleSave = async () => {
    if (!auth.currentUser) return;

    try {
      // Create a clean payload to avoid 'undefined' field errors in Firestore
      const cleanMinuteData: any = {
        clientId: formData.clientId,
        title: formData.title || '',
        date: formData.date || '',
        startTime: formData.startTime || '',
        endTime: formData.endTime || '',
        location: formData.location || '',
        participants: formData.participants || [],
        objective: formData.objective || '',
        agenda: formData.agenda || '',
        decisions: formData.decisions || '',
        actions: formData.actions || [],
        status: formData.status || 'Draft',
        reviews: formData.reviews || [],
        updatedAt: serverTimestamp()
      };

      if (formData.nextMeetingDate !== undefined && formData.nextMeetingDate !== "") {
        cleanMinuteData.nextMeetingDate = formData.nextMeetingDate;
      }

      let minuteId = editingId;

      if (editingId) {
        await updateDoc(doc(db, 'meeting_minutes', editingId), cleanMinuteData);
      } else {
        const docRef = await addDoc(collection(db, 'meeting_minutes'), {
          ...cleanMinuteData,
          createdAt: serverTimestamp()
        });
        minuteId = docRef.id;
      }

      // Sync actions to the global action_items collection
      if (minuteId) {
        // Fetch existing action items for this minute to handle create/update/delete correctly
        const existingActionsMap = new Map<string, any>();
        if (editingId) {
          try {
            const actionsQuery = query(
              collection(db, 'action_items'),
              where('minuteId', '==', editingId)
            );
            const actionsSnapshot = await getDocs(actionsQuery);
            actionsSnapshot.docs.forEach(doc => {
              const data = doc.data();
              existingActionsMap.set(data.title, { id: doc.id, ref: doc.ref, ...data });
            });
          } catch (err) {
            console.error("Error fetching existing action items:", err);
          }
        }

        const currentActionTitles = new Set(formData.actions.map(a => a.task));

        // 1. Delete actions that were removed from the minute
        const deletePromises: Promise<any>[] = [];
        existingActionsMap.forEach((act, title) => {
          if (!currentActionTitles.has(title)) {
            deletePromises.push(deleteDoc(act.ref));
          }
        });
        await Promise.all(deletePromises);

        // 2. Create or update actions
        const actionPromises = formData.actions.map(action => {
          const existingAction = existingActionsMap.get(action.task);
          if (existingAction) {
            // Update existing action (preserves status and priority)
            return updateDoc(existingAction.ref, {
              responsible: action.responsible,
              deadline: action.deadline,
              originTitle: formData.title,
              updatedAt: serverTimestamp()
            });
          } else {
            // Create new action
            return addDoc(collection(db, 'action_items'), {
              clientId: formData.clientId,
              minuteId: minuteId,
              title: action.task,
              responsible: action.responsible,
              deadline: action.deadline,
              status: 'Pendente',
              priority: 'Média',
              origin: 'Ata de Reunião',
              originTitle: formData.title,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });
          }
        });
        await Promise.all(actionPromises);
      }

      setView('list');
      setEditingId(null);
      resetForm();
    } catch (error) {
      console.error("Error saving minute:", error);
      alert("Erro ao salvar ata de reunião.");
    }
  };

  const handleParticipantReviewSave = async (participantName: string) => {
    if (!auth.currentUser || !editingId) return;

    try {
      const existingReviews = formData.reviews || [];
      const updatedReviews = existingReviews.filter(r => r.name !== participantName);
      
      updatedReviews.push({
        name: participantName,
        userEmail: auth.currentUser.email || undefined,
        userId: auth.currentUser.uid,
        status: reviewStatus,
        comment: reviewComment || undefined,
        updatedAt: new Date().toISOString()
      });

      // Save directly to Firestore for immediate update
      await updateDoc(doc(db, 'meeting_minutes', editingId), {
        reviews: updatedReviews,
        updatedAt: serverTimestamp()
      });

      // Update local state too
      setFormData(prev => ({
        ...prev,
        reviews: updatedReviews
      }));
      
      setActiveReviewer(null);
      setReviewComment('');
    } catch (err) {
      console.error("Error saving participant review:", err);
      alert("Erro ao salvar revisão de participante.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta ata?')) return;
    try {
      await deleteDoc(doc(db, 'meeting_minutes', id));
    } catch (error) {
      console.error("Error deleting minute:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      clientId,
      title: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '',
      endTime: '',
      location: 'Remoto / Online',
      participants: [],
      objective: '',
      agenda: '',
      decisions: '',
      actions: [],
      status: 'Draft',
      reviews: []
    });
  };

  const openAdd = () => {
    resetForm();
    setEditingId(null);
    setView('form');
  };

  const openEdit = (minute: MeetingMinute) => {
    setFormData(minute);
    setEditingId(minute.id || null);
    setView('form');
  };

  const {
    searchTerm,
    setSearchTerm,
    filteredData: filteredMinutes,
  } = useDataTable(minutes, {
    searchFields: ['title', 'objective', 'decisions'],
    initialSort: { key: 'date', direction: 'desc' }
  });

  if (view === 'form') {
    return (
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <button 
              onClick={() => setView('list')}
              className="group flex items-center gap-2 text-[10px] font-medium text-muted-foreground uppercase tracking-widest hover:text-secondary transition-all mb-4"
            >
              <div className="w-6 h-6 rounded-full border border-border flex items-center justify-center group-hover:border-secondary transition-all">
                <ChevronLeft size={12} />
              </div>
              Voltar para lista
            </button>
            <h2 className="text-h1 font-medium text-foreground tracking-tight">
              {editingId ? 'Editar Ata de Reunião' : 'Nova Ata de Reunião'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setView('list')} className="btn-executive bg-surface-container border-border">Cancelar</button>
            <button onClick={handleSave} className="btn-executive bg-secondary">
              <Save size={16} />
              Salvar Ata
            </button>
          </div>
        </div>

        <div className="card-premium p-12 space-y-12">
          {/* Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Título da Reunião</label>
              <input 
                type="text" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Ex: Reunião Mensal de Resultados"
                className="w-full px-5 py-3 bg-surface-container border border-border rounded-md text-sm outline-none focus:border-secondary transition-all"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Data</label>
              <input 
                type="date" 
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-5 py-3 bg-surface-container border border-border rounded-md text-sm outline-none focus:border-secondary transition-all"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Local / Canal</label>
              <input 
                type="text" 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-5 py-3 bg-surface-container border border-border rounded-md text-sm outline-none focus:border-secondary transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-3">
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Início</label>
              <input 
                type="time" 
                value={formData.startTime}
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                className="w-full px-5 py-3 bg-surface-container border border-border rounded-md text-sm outline-none focus:border-secondary transition-all"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Término</label>
              <input 
                type="time" 
                value={formData.endTime}
                onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                className="w-full px-5 py-3 bg-surface-container border border-border rounded-md text-sm outline-none focus:border-secondary transition-all"
              />
            </div>
          </div>

          {/* Participants */}
          <div className="space-y-6 pt-10 border-t border-border">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Participantes</label>
            <div className="flex gap-3">
              <input 
                type="text" 
                placeholder="Nome do participante"
                value={tempParticipant}
                onChange={(e) => setTempParticipant(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), setFormData({...formData, participants: [...formData.participants, tempParticipant]}), setTempParticipant(''))}
                className="flex-1 px-5 py-3 bg-surface-container border border-border rounded-md text-sm outline-none focus:border-secondary transition-all"
              />
              <button 
                onClick={() => {
                  if (tempParticipant) {
                    setFormData({...formData, participants: [...formData.participants, tempParticipant]});
                    setTempParticipant('');
                  }
                }}
                className="btn-executive bg-secondary"
              >Adicionar</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.participants.map((p, i) => (
                <span key={i} className="px-4 py-2 bg-card border border-border rounded-md text-[10px] font-medium text-muted-foreground flex items-center gap-2 shadow-sm">
                  {p}
                  <button onClick={() => setFormData({...formData, participants: formData.participants.filter((_, idx) => idx !== i)})} className="text-destructive hover:text-destructive/80 transition-colors">
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8 pt-10 border-t border-border">
            <div className="space-y-3">
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Objetivo da Reunião</label>
              <textarea 
                rows={2}
                value={formData.objective}
                onChange={(e) => setFormData({...formData, objective: e.target.value})}
                className="w-full px-5 py-3 bg-surface-container border border-border rounded-md text-sm outline-none focus:border-secondary transition-all leading-relaxed italic"
                placeholder="Descreva o propósito principal deste encontro..."
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Pautas e Discussões</label>
              <textarea 
                rows={5}
                value={formData.agenda}
                onChange={(e) => setFormData({...formData, agenda: e.target.value})}
                className="w-full px-5 py-3 bg-surface-container border border-border rounded-md text-sm outline-none focus:border-secondary transition-all leading-relaxed"
                placeholder="Relate os pontos discutidos durante a reunião..."
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Deliberações e Decisões</label>
              <textarea 
                rows={4}
                value={formData.decisions}
                onChange={(e) => setFormData({...formData, decisions: e.target.value})}
                className="w-full px-5 py-3 bg-surface-container border border-border rounded-md text-sm outline-none focus:border-secondary transition-all leading-relaxed font-medium"
                placeholder="Quais foram as decisões tomadas?"
              />
            </div>
          </div>

          {/* Action Plan */}
          <div className="space-y-6 pt-10 border-t border-border">
             <div className="flex items-center justify-between">
                <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Plano de Ação (Próximos Passos)</label>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input 
                  type="text" placeholder="Tarefa"
                  value={tempAction.task}
                  onChange={(e) => setTempAction({...tempAction, task: e.target.value})}
                  className="px-4 py-2.5 bg-surface-container border border-border rounded-md text-xs outline-none focus:border-secondary transition-all"
                />
                <input 
                  type="text" placeholder="Responsável"
                  value={tempAction.responsible}
                  onChange={(e) => setTempAction({...tempAction, responsible: e.target.value})}
                  className="px-4 py-2.5 bg-surface-container border border-border rounded-md text-xs outline-none focus:border-secondary transition-all"
                />
                <div className="flex gap-2">
                  <input 
                    type="date"
                    value={tempAction.deadline}
                    onChange={(e) => setTempAction({...tempAction, deadline: e.target.value})}
                    className="flex-1 px-4 py-2.5 bg-surface-container border border-border rounded-md text-xs outline-none focus:border-secondary transition-all"
                  />
                  <button 
                    onClick={() => {
                      if (tempAction.task) {
                        setFormData({...formData, actions: [...formData.actions, tempAction]});
                        setTempAction({ task: '', responsible: '', deadline: '' });
                      }
                    }}
                    className="btn-executive bg-secondary p-2.5"
                  >
                    <Plus size={18} />
                  </button>
                </div>
             </div>

             <div className="space-y-3">
                {formData.actions.map((a, i) => (
                  <div key={i} className="flex items-center justify-between bg-surface-container p-4 rounded-md border border-border group">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-card rounded-md flex items-center justify-center text-muted-foreground group-hover:text-secondary transition-all shadow-sm">
                        <CheckCircle2 size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground tracking-tight">{a.task}</p>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Responsável: {a.responsible} • Prazo: {a.deadline}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setFormData({...formData, actions: formData.actions.filter((_, idx) => idx !== i)})}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-destructive hover:bg-destructive/5 transition-all"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
          </div>

          {/* Governance Signatures and Reviews */}
          <div className="space-y-6 pt-10 border-t border-border">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest block">Assinaturas e Revisões de Governança</label>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest italic block mt-1">Status de leitura, aprovação e revisão dos participantes da reunião.</span>
              </div>
            </div>

            {!editingId ? (
              <div className="bg-surface-container p-6 rounded-md border border-border text-center">
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-widest italic">
                  Após salvar a ata pela primeira vez, as opções de assinatura e solicitação de revisão ficarão disponíveis para cada participante.
                </p>
              </div>
            ) : formData.participants.length === 0 ? (
              <div className="bg-surface-container p-6 rounded-md border border-border text-center">
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-widest italic">
                  Adicione participantes acima para habilitar o fluxo de assinaturas.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Participants list with their status */}
                <div className="space-y-4">
                  {formData.participants.map((p, idx) => {
                    const review = (formData.reviews || []).find(r => r.name.trim().toLowerCase() === p.trim().toLowerCase());
                    const isCurrentUser = auth.currentUser && (
                      p.trim().toLowerCase() === auth.currentUser.displayName?.trim().toLowerCase() ||
                      p.trim().toLowerCase() === auth.currentUser.email?.trim().toLowerCase()
                    );
                    
                    return (
                      <div key={idx} className="bg-surface-container p-4 rounded-md border border-border flex items-center justify-between group hover:border-secondary/20 transition-all">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-foreground tracking-tight">{p}</span>
                            {isCurrentUser && (
                              <span className="px-2 py-0.5 bg-secondary/15 text-secondary text-[8px] font-semibold rounded-sm uppercase tracking-wider">Você</span>
                            )}
                          </div>
                          {review ? (
                            <div className="space-y-1.5 mt-2">
                              <div className="flex items-center gap-2">
                                {review.status === 'Approved' ? (
                                  <span className="flex items-center gap-1.5 text-xs text-success font-semibold uppercase tracking-wider">
                                    <CheckCircle2 size={14} className="text-success" />
                                    Aprovado
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1.5 text-xs text-warning font-semibold uppercase tracking-wider">
                                    <AlertCircle size={14} className="text-warning" />
                                    Revisão Solicitada
                                  </span>
                                )}
                                {review.updatedAt && (
                                  <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-widest">
                                    • {new Date(review.updatedAt).toLocaleDateString('pt-BR')} às {new Date(review.updatedAt).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                                  </span>
                                )}
                              </div>
                              {review.comment && (
                                <p className="text-[11px] text-muted-foreground italic leading-relaxed pl-5 border-l border-border bg-card/30 py-1 px-2 rounded-sm">
                                  "{review.comment}"
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-2">
                              <Clock size={14} />
                              Pendente de Assinatura
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveReviewer(p);
                              const existingReview = (formData.reviews || []).find(r => r.name.trim().toLowerCase() === p.trim().toLowerCase());
                              if (existingReview) {
                                setReviewStatus(existingReview.status === 'Approved' ? 'Approved' : 'ReviewRequested');
                                setReviewComment(existingReview.comment || '');
                              } else {
                                setReviewStatus('Approved');
                                setReviewComment('');
                              }
                            }}
                            className={cn(
                              "btn-executive py-1.5 px-3 text-[10px] uppercase font-bold tracking-widest flex items-center gap-2 shadow-sm transition-all",
                              isCurrentUser 
                                ? "bg-secondary text-white hover:bg-secondary/90" 
                                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
                            )}
                          >
                            {review ? 'Alterar' : 'Interagir'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Interaction Form for the selected participant */}
                <div className="relative">
                  <AnimatePresence mode="wait">
                    {activeReviewer ? (
                      <motion.div
                        key={activeReviewer}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-card p-6 rounded-md border border-border shadow-premium space-y-6"
                      >
                        <div className="flex items-center justify-between border-b border-border pb-3">
                          <h4 className="text-[11px] font-semibold text-foreground uppercase tracking-widest">
                            Interagir como: {activeReviewer}
                          </h4>
                          <button
                            type="button"
                            onClick={() => setActiveReviewer(null)}
                            className="text-muted-foreground hover:text-foreground transition-all"
                          >
                            <X size={16} />
                          </button>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Sua Decisão</label>
                            <div className="grid grid-cols-2 gap-4">
                              <button
                                type="button"
                                onClick={() => setReviewStatus('Approved')}
                                className={cn(
                                  "py-3 rounded-md border text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm",
                                  reviewStatus === 'Approved'
                                    ? "bg-success/15 border-success text-success"
                                    : "bg-surface-container border-border text-muted-foreground hover:text-foreground"
                                )}
                              >
                                <CheckCircle2 size={16} />
                                Aprovar Ata
                              </button>
                              <button
                                type="button"
                                onClick={() => setReviewStatus('ReviewRequested')}
                                className={cn(
                                  "py-3 rounded-md border text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm",
                                  reviewStatus === 'ReviewRequested'
                                    ? "bg-warning/15 border-warning text-warning"
                                    : "bg-surface-container border-border text-muted-foreground hover:text-foreground"
                                )}
                              >
                                <AlertCircle size={16} />
                                Solicitar Revisão
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                              {reviewStatus === 'Approved' ? 'Comentário (Opcional)' : 'Pontos a Ajustar (Obrigatório)'}
                            </label>
                            <textarea
                              rows={3}
                              value={reviewComment}
                              onChange={(e) => setReviewComment(e.target.value)}
                              placeholder={
                                reviewStatus === 'Approved'
                                  ? "Ex: Concordo com os termos e resoluções desta reunião."
                                  : "Ex: Ajustar o prazo da ação X de 15/06 para 20/06, conforme discutido..."
                              }
                              className="w-full px-4 py-3 bg-surface-container border border-border rounded-md text-xs outline-none focus:border-secondary transition-all leading-relaxed"
                            />
                          </div>

                          <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                              type="button"
                              onClick={() => setActiveReviewer(null)}
                              className="btn-executive bg-surface-container border-border"
                            >
                              Cancelar
                            </button>
                            <button
                              type="button"
                              disabled={reviewStatus === 'ReviewRequested' && !reviewComment.trim()}
                              onClick={() => handleParticipantReviewSave(activeReviewer)}
                              className={cn(
                                "btn-executive bg-secondary flex items-center gap-2",
                                reviewStatus === 'ReviewRequested' && !reviewComment.trim() && "opacity-50 cursor-not-allowed"
                              )}
                            >
                              Confirmar Assinatura
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="w-full h-full border border-dashed border-border rounded-md flex flex-col items-center justify-center p-8 text-center bg-surface-container/20">
                        <Users className="text-muted-foreground/30 mb-3" size={32} />
                        <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-widest">
                          Ações do Participante
                        </p>
                        <p className="w-full text-xs text-muted-foreground/70 leading-relaxed mt-2 italic max-w-md mx-auto">
                          Selecione um participante ao lado para assinar a ata de reunião ou solicitar alterações.
                        </p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>

          <div className="pt-10 border-t border-border flex items-center justify-between">
             <div className="flex items-center gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Data da Próxima Reunião</label>
                  <input 
                    type="date" 
                    value={formData.nextMeetingDate}
                    onChange={(e) => setFormData({...formData, nextMeetingDate: e.target.value})}
                    className="w-full px-5 py-3 bg-surface-container border border-border rounded-md text-sm outline-none focus:border-secondary transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Status da Ata</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    className="w-full px-5 py-3 bg-surface-container border border-border rounded-md text-sm font-medium outline-none focus:border-secondary transition-all"
                  >
                    <option value="Draft">Rascunho</option>
                    <option value="Finalized">Finalizada / Publicada</option>
                  </select>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <PageHeader 
        title="Atas de Reunião" 
        subtitle="Registro oficial de deliberações, decisões e planos de ação de governança."
        actions={
          <button onClick={openAdd} className="btn-executive bg-secondary">
            <Plus size={18} />
            Nova Ata
          </button>
        }
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative flex-1 max-w-md">
          <input 
            type="text" 
            placeholder="Pesquisar atas por título ou conteúdo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-surface-container border border-border rounded-md text-sm outline-none focus:border-secondary transition-all shadow-sm"
          />
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="w-12 h-12 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin"></div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Carregando documentos...</p>
        </div>
      ) : minutes.length === 0 ? (
        <div className="card-premium py-24 text-center space-y-6">
          <div className="w-20 h-20 bg-surface-container border border-border rounded-md flex items-center justify-center mx-auto text-muted-foreground/40 shadow-inner">
            <FileText size={32} strokeWidth={1} />
          </div>
          <div className="space-y-2">
            <h3 className="text-h3 font-medium text-foreground tracking-tight uppercase">Nenhuma Ata Registrada</h3>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest w-full max-w-2xl mx-auto leading-relaxed">Comece registrando a primeira reunião realizada com este cliente.</p>
          </div>
          <button onClick={openAdd} className="btn-executive bg-executive mx-auto mt-4">
            <Plus size={16} />
            Criar Documento
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMinutes.map((minute) => (
            <motion.div 
              key={minute.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-premium group hover:border-secondary/40 transition-all p-6 relative flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-6">
                <div className={cn(
                  "w-12 h-12 rounded-md flex items-center justify-center shadow-sm border transition-all",
                  minute.status === 'Finalized' 
                    ? "bg-success/10 border-success/20 text-success" 
                    : "bg-warning/10 border-warning/20 text-warning"
                )}>
                  <FileText size={22} strokeWidth={1.5} />
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => openEdit(minute)}
                    className="p-2 text-muted-foreground hover:text-secondary hover:bg-secondary/5 rounded-md transition-all"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    onClick={() => minute.id && handleDelete(minute.id)}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-md transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-4 flex-1">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <StatusBadge 
                      status={minute.status === 'Finalized' ? 'Ativo' : 'Pendente'} 
                      label={minute.status === 'Finalized' ? 'FINALIZADA' : 'RASCUNHO'}
                    />
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{new Date(minute.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <h4 className="text-body-md font-medium text-foreground tracking-tight line-clamp-2 leading-tight group-hover:text-secondary transition-colors">{minute.title}</h4>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
                    <MapPin size={12} className="shrink-0" />
                    <span>{minute.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
                    <Users size={12} className="shrink-0" />
                    <span>{minute.participants.length} Participantes</span>
                  </div>
                </div>

                <div className="bg-surface-container p-4 rounded-md border border-border">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                    <MessageSquare size={12} /> Objetivo
                  </p>
                  <p className="text-[11px] text-muted-foreground font-medium line-clamp-3 leading-relaxed italic">
                    "{minute.objective || 'Sem objetivo definido.'}"
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {minute.participants.slice(0, 3).map((_, i) => (
                      <div key={i} className="w-6 h-6 rounded-full bg-card border-2 border-surface-container flex items-center justify-center text-[8px] font-medium text-muted-foreground uppercase">
                        {minute.participants[i][0]}
                      </div>
                    ))}
                    {minute.participants.length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-secondary/10 border-2 border-surface-container flex items-center justify-center text-[8px] font-medium text-secondary">
                        +{minute.participants.length - 3}
                      </div>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => openEdit(minute)}
                  className="flex items-center gap-2 text-[10px] font-medium text-secondary uppercase tracking-widest hover:gap-3 transition-all"
                >
                  Ver Detalhes
                  <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
