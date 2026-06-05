// src/components/pilot-operations/PilotFeedbackSurface.tsx

import React, { useState } from 'react';
import { usePilotOperations } from '../../context/pilot-operations/PilotOperationsProvider';
import { MessageSquare, AlertTriangle, ShieldCheck, User } from 'lucide-react';
import { PilotValidationCategory, PilotFeedbackSeverity } from '../../services/FiduciaryRuntimeAdapter';

export const PilotFeedbackSurface: React.FC = () => {
  const { feedbackList, submitFeedback, pilotStatus } = usePilotOperations();
  const [category, setCategory] = useState<PilotValidationCategory>('EXECUTIVE_CLARITY');
  const [severity, setSeverity] = useState<PilotFeedbackSeverity>('SUGGESTION');
  const [comment, setComment] = useState('');
  const [success, setSuccess] = useState(false);

  const isFailClosed = pilotStatus === 'FAIL_CLOSED';

  const categoryOptions: { value: PilotValidationCategory; label: string }[] = [
    { value: 'EXECUTIVE_CLARITY', label: 'Executive Clarity' },
    { value: 'GOVERNANCE_READABILITY', label: 'Governance Readability' },
    { value: 'SUPERVISION_FLOW', label: 'Supervision Flow' },
    { value: 'RUNTIME_STABILITY', label: 'Runtime Stability' },
    { value: 'COGNITIVE_LOAD', label: 'Cognitive Load' },
    { value: 'INCIDENT_RESPONSE', label: 'Incident Response' },
    { value: 'MULTI_ENTITY_VISIBILITY', label: 'Multi-Entity Visibility' },
    { value: 'BOARD_READINESS', label: 'Board Readiness' }
  ];

  const severityOptions: { value: PilotFeedbackSeverity; label: string }[] = [
    { value: 'SUGGESTION', label: 'Suggestion' },
    { value: 'ATTENTION', label: 'Attention Required' },
    { value: 'BLOCKING', label: 'Blocking Issue' },
    { value: 'CRITICAL', label: 'Critical Failure' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim().length < 5 || isFailClosed) return;
    
    submitFeedback(category, severity, comment);
    setComment('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const getSeverityStyle = (sev: PilotFeedbackSeverity) => {
    switch (sev) {
      case 'CRITICAL': return 'bg-rose-500/10 text-rose-500 border-rose-500/25 font-black animate-pulse';
      case 'BLOCKING': return 'bg-rose-500/10 text-rose-500 border-rose-500/25';
      case 'ATTENTION': return 'bg-amber-500/10 text-amber-500 border-amber-500/25';
      default: return 'bg-secondary/10 text-secondary border-secondary/25';
    }
  };

  return (
    <div className="card-premium p-8 space-y-6 relative overflow-hidden group hover:border-secondary/20 transition-all duration-300">
      <div className="flex items-center gap-3 border-b border-border/40 pb-4">
        <div className="w-8 h-8 rounded-md bg-secondary/10 flex items-center justify-center text-secondary">
          <MessageSquare size={16} />
        </div>
        <div>
          <h3 className="text-base font-medium text-foreground tracking-tight">Qualitative Pilot Feedback</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">Captura governada de pontos de fricção e feedbacks executivos.</p>
        </div>
      </div>

      {/* Form Submission */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[9px] font-mono font-black text-muted-foreground uppercase tracking-widest block">Categoria</label>
            <select
              disabled={isFailClosed}
              value={category}
              onChange={(e) => setCategory(e.target.value as PilotValidationCategory)}
              className="w-full px-2.5 py-1.5 bg-background border border-border text-foreground rounded-lg font-sans text-xs outline-none cursor-pointer focus:ring-1 focus:ring-secondary"
            >
              {categoryOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-mono font-black text-muted-foreground uppercase tracking-widest block">Severidade</label>
            <select
              disabled={isFailClosed}
              value={severity}
              onChange={(e) => setSeverity(e.target.value as PilotFeedbackSeverity)}
              className="w-full px-2.5 py-1.5 bg-background border border-border text-foreground rounded-lg font-sans text-xs outline-none cursor-pointer focus:ring-1 focus:ring-secondary"
            >
              {severityOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-mono font-black text-muted-foreground uppercase tracking-widest block">Comentário Fiduciário</label>
          <textarea
            disabled={isFailClosed}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={isFailClosed ? 'Submissões de feedback desabilitadas em estado emergencial.' : 'Escreva aqui a observação ou dificuldade cognitiva relatada...'}
            rows={3}
            className="w-full px-3 py-2 bg-background border border-border text-foreground rounded-lg font-sans text-xs outline-none focus:ring-1 focus:ring-secondary resize-none placeholder:text-neutral focus:bg-background"
          />
        </div>

        {success && (
          <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1 animate-fade-in">
            <ShieldCheck size={12} /> Feedback registrado e auditado com sucesso!
          </p>
        )}

        <button
          type="submit"
          disabled={comment.trim().length < 5 || isFailClosed}
          className="w-full py-2 bg-secondary hover:bg-secondary/95 disabled:opacity-50 disabled:cursor-not-allowed text-secondary-foreground text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all"
        >
          <ShieldCheck size={12} />
          Registrar Feedback Fiduciário
        </button>
      </form>

      {/* Feedback Logs */}
      <div className="space-y-3 pt-3 border-t border-border/40">
        <span className="text-[9px] font-mono font-black text-muted-foreground uppercase tracking-widest block mb-2">FEEDBACK LOGS (TENANT ISOLATED)</span>
        
        {feedbackList.length === 0 ? (
          <p className="text-xs text-muted-foreground font-medium italic">Nenhum feedback registrado para este tenant.</p>
        ) : (
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {feedbackList.map((item) => (
              <div key={item.feedbackId} className="p-3 bg-surface-container/60 border border-border/60 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-[9px] font-mono font-bold">
                  <span className="text-foreground">{item.category.replace('_', ' ')}</span>
                  <span className={`px-2 py-0.5 rounded border ${getSeverityStyle(item.severity)}`}>
                    {item.severity}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-normal">{item.comment}</p>
                <div className="flex justify-between items-center text-[8.5px] font-mono text-muted-foreground">
                  <span className="flex items-center gap-1"><User size={10} /> {item.submittedBy}</span>
                  <span className="text-secondary tracking-tighter" title={item.lineageHash}>{item.lineageHash.substring(0, 14)}...</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
