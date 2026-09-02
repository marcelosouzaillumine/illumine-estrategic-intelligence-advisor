import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Sparkles, FileText, CheckCircle2, Clock, Loader2, CalendarDays } from 'lucide-react';
import { MentoringSessionRepository } from '../../repositories/MentoringSessionRepository';
import { OKRRepository } from '../../repositories/OKRRepository';
import { ProfileRepository } from '../../repositories/ProfileRepository';
import { PreBriefEngine } from '../../engines/PreBriefEngine';
import { SessionSynthesisEngine } from '../../engines/SessionSynthesisEngine';
import { MentoringSessionService } from '../../services/MentoringSessionService';
import type { MentoringSession, MenteeProfile, OKR } from '../../domain';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SessionDetailSurfaceProps {
  role: 'MENTOR' | 'MENTEE';
  userId: string;
  programId: string;
}

export const SessionDetailSurface: React.FC<SessionDetailSurfaceProps> = ({ role, userId, programId }) => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<MentoringSession | null>(null);
  const [menteeProfile, setMenteeProfile] = useState<MenteeProfile | null>(null);
  const [okrs, setOKRs] = useState<OKR[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    if (!sessionId) return;
    const s = await MentoringSessionRepository.getById(sessionId);
    if (!s) return;
    setSession(s);

    const [mp, okrList] = await Promise.all([
      ProfileRepository.getMentee(s.menteeId, s.programId),
      OKRRepository.listByMentee(s.menteeId, s.programId),
    ]);
    setMenteeProfile(mp);
    setOKRs(okrList.filter(o => o.status === 'ACTIVE'));
    setLoading(false);
  };

  useEffect(() => { load(); }, [sessionId]);

  const generatePreBrief = async () => {
    if (!session || !menteeProfile) return;
    setAiLoading(true);
    try {
      const preBrief = await PreBriefEngine.generate({
        session,
        menteeProfile,
        activeOKRs: okrs,
      });
      await MentoringSessionRepository.update(session.id, {
        preBrief,
        status: 'PRE_BRIEF_DONE',
      });
      await load();
    } finally {
      setAiLoading(false);
    }
  };

  const generateSynthesis = async () => {
    if (!session || !menteeProfile) return;
    setAiLoading(true);
    try {
      const synthesis = await SessionSynthesisEngine.generate({
        session,
        menteeProfile,
        activeOKRs: okrs,
      });
      await MentoringSessionRepository.update(session.id, {
        synthesis,
        status: 'COMPLETED',
      });
      await load();
    } finally {
      setAiLoading(false);
    }
  };

  const submitNotes = async () => {
    if (!session || !notes.trim()) return;
    setSubmitting(true);
    try {
      if (role === 'MENTOR') {
        await MentoringSessionService.submitMentorNotes(session.id, notes);
      } else {
        await MentoringSessionService.submitMenteeNotes(session.id, notes);
      }
      setNotes('');
      await load();
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !session) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={20} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  const backPath = role === 'MENTOR' ? '/mentor/workspace/sessions' : '/mentee/workspace/sessions';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(backPath)}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <div>
          <h1 className="text-base font-semibold text-foreground">
            Sessão #{session.sessionNumber}
            {menteeProfile && ` · ${menteeProfile.displayName}`}
          </h1>
          <p className="text-xs text-muted-foreground">
            {format(new Date(session.scheduledAt), "EEEE, dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
            {' · '}{session.durationMinutes}min · {session.format}
          </p>
        </div>
        <span className={`ml-auto text-xs font-medium px-2.5 py-1 rounded-full ${
          session.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-600' :
          session.status === 'CANCELLED' ? 'bg-red-500/10 text-red-600' :
          'bg-amber-500/10 text-amber-600'
        }`}>
          {session.status.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Pre-Brief */}
      {role === 'MENTOR' && (
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-violet-500" />
              <h2 className="text-sm font-semibold text-foreground">Pre-Brief com IA</h2>
            </div>
            {!session.preBrief && (
              <button
                onClick={generatePreBrief}
                disabled={aiLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 text-white text-xs font-medium rounded-lg hover:bg-violet-700 disabled:opacity-50 transition-colors"
              >
                {aiLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                Gerar Pre-Brief
              </button>
            )}
          </div>

          {session.preBrief ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Contexto do Mentorado</p>
                <p className="text-sm text-foreground leading-relaxed">{session.preBrief.menteeContext}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Tópicos Sugeridos</p>
                <ul className="space-y-1">
                  {session.preBrief.suggestedTopics.map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <span className="text-primary font-bold mt-0.5">{i + 1}.</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              {session.preBrief.preparationTips.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Dicas de Preparação</p>
                  <ul className="space-y-1">
                    {session.preBrief.preparationTips.map((t, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                        <span className="text-amber-500 mt-0.5">→</span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Gere o Pre-Brief para receber contexto sobre o mentorado, tópicos sugeridos e dicas de preparação.
            </p>
          )}
        </div>
      )}

      {/* Agenda */}
      {session.agenda && (
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <CalendarDays size={16} className="text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Pauta</h2>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{session.agenda}</p>
        </div>
      )}

      {/* Notes */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileText size={16} className="text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Notas da Sessão</h2>
        </div>

        {session.notes?.mentorNotes && (
          <div className="mb-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs font-medium text-muted-foreground mb-1">Notas do Mentor</p>
            <p className="text-sm text-foreground">{session.notes.mentorNotes}</p>
          </div>
        )}
        {session.notes?.menteeNotes && (
          <div className="mb-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs font-medium text-muted-foreground mb-1">Notas do Mentorado</p>
            <p className="text-sm text-foreground">{session.notes.menteeNotes}</p>
          </div>
        )}

        {!session.notes || (role === 'MENTOR' ? !session.notes.mentorNotes : !session.notes.menteeNotes) ? (
          <div className="space-y-3">
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Registre aqui os principais pontos discutidos, decisões tomadas e próximos passos..."
              rows={5}
              className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
            <button
              onClick={submitNotes}
              disabled={!notes.trim() || submitting}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {submitting ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
              Salvar Notas
            </button>
          </div>
        ) : null}
      </div>

      {/* Synthesis */}
      {(session.status === 'SYNTHESIS_PENDING' || session.synthesis) && (
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-emerald-500" />
              <h2 className="text-sm font-semibold text-foreground">Síntese com IA</h2>
            </div>
            {!session.synthesis && role === 'MENTOR' && (
              <button
                onClick={generateSynthesis}
                disabled={aiLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                {aiLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                Gerar Síntese
              </button>
            )}
          </div>

          {session.synthesis ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Resumo Executivo</p>
                <p className="text-sm text-foreground leading-relaxed">{session.synthesis.executiveSummary}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Insights Chave</p>
                <ul className="space-y-1.5">
                  {session.synthesis.keyInsights.map((insight, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
              {session.synthesis.actionItems.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Ações</p>
                  <ul className="space-y-1.5">
                    {session.synthesis.actionItems.map((action, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded mt-0.5 flex-shrink-0 ${
                          action.owner === 'MENTOR'
                            ? 'bg-blue-500/10 text-blue-600'
                            : 'bg-emerald-500/10 text-emerald-600'
                        }`}>
                          {action.owner === 'MENTOR' ? 'Mentor' : 'Mentorado'}
                        </span>
                        <span className="text-foreground">{action.description}</span>
                        {action.dueDate && (
                          <span className="text-muted-foreground ml-auto text-xs flex-shrink-0">
                            {format(new Date(action.dueDate), 'dd/MM', { locale: ptBR })}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {role === 'MENTOR'
                ? 'Ambas as notas foram submetidas. Gere a síntese da sessão com IA.'
                : 'Aguardando geração da síntese pelo mentor.'}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
