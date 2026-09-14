import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays, Clock, CheckCircle2, AlertCircle, X,
  ChevronRight, Plus, Filter, Loader2,
} from 'lucide-react';
import { MentoringSessionRepository } from '../../repositories/MentoringSessionRepository';
import { ProfileRepository } from '../../repositories/ProfileRepository';
import type { MentoringSession, MenteeProfile, MentorProfile, SessionStatus } from '../../domain';
import { format, isAfter, isBefore, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type ViewFilter = 'ALL' | 'UPCOMING' | 'COMPLETED' | 'PENDING';

interface SessionsListSurfaceProps {
  role: 'MENTOR' | 'MENTEE';
  userId: string;
  programId: string;
}

const statusMeta: Record<SessionStatus, { label: string; color: string; icon: React.ElementType }> = {
  SCHEDULED: { label: 'Agendada', color: 'text-blue-500 bg-blue-500/10', icon: CalendarDays },
  PRE_BRIEF_PENDING: { label: 'Pre-Brief Pendente', color: 'text-violet-500 bg-violet-500/10', icon: Clock },
  PRE_BRIEF_DONE: { label: 'Pre-Brief Pronto', color: 'text-violet-500 bg-violet-500/10', icon: CheckCircle2 },
  IN_PROGRESS: { label: 'Em Andamento', color: 'text-amber-500 bg-amber-500/10', icon: Clock },
  NOTES_PENDING: { label: 'Notas Pendentes', color: 'text-amber-500 bg-amber-500/10', icon: AlertCircle },
  SYNTHESIS_PENDING: { label: 'Síntese Pendente', color: 'text-amber-500 bg-amber-500/10', icon: AlertCircle },
  COMPLETED: { label: 'Concluída', color: 'text-emerald-500 bg-emerald-500/10', icon: CheckCircle2 },
  CANCELLED: { label: 'Cancelada', color: 'text-red-500 bg-red-500/10', icon: X },
  NO_SHOW: { label: 'Não Compareceu', color: 'text-red-500 bg-red-500/10', icon: X },
};

export const SessionsListSurface: React.FC<SessionsListSurfaceProps> = ({ role, userId, programId }) => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<MentoringSession[]>([]);
  const [profiles, setProfiles] = useState<(MenteeProfile | MentorProfile)[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ViewFilter>('ALL');

  useEffect(() => {
    Promise.all([
      role === 'MENTOR'
        ? MentoringSessionRepository.listByMentor(userId, programId)
        : MentoringSessionRepository.listByMentee(userId, programId),
      role === 'MENTOR'
        ? ProfileRepository.listMenteesByProgram(programId)
        : ProfileRepository.listMentorsByProgram(programId),
    ]).then(([s, p]) => {
      setSessions(s.sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()));
      setProfiles(p);
      setLoading(false);
    });
  }, [userId, programId, role]);

  const getCounterpart = (session: MentoringSession): MenteeProfile | MentorProfile | undefined => {
    const targetId = role === 'MENTOR' ? session.menteeId : session.mentorId;
    return profiles.find(p => p.id === targetId || p.userId === targetId);
  };

  const filtered = sessions.filter(s => {
    if (filter === 'UPCOMING') return ['SCHEDULED', 'PRE_BRIEF_PENDING', 'PRE_BRIEF_DONE'].includes(s.status);
    if (filter === 'COMPLETED') return s.status === 'COMPLETED';
    if (filter === 'PENDING') return ['NOTES_PENDING', 'SYNTHESIS_PENDING'].includes(s.status);
    return true;
  });

  const counts = {
    ALL: sessions.length,
    UPCOMING: sessions.filter(s => ['SCHEDULED', 'PRE_BRIEF_PENDING', 'PRE_BRIEF_DONE'].includes(s.status)).length,
    COMPLETED: sessions.filter(s => s.status === 'COMPLETED').length,
    PENDING: sessions.filter(s => ['NOTES_PENDING', 'SYNTHESIS_PENDING'].includes(s.status)).length,
  };

  const basePath = role === 'MENTOR' ? '/mentor/workspace' : '/mentee/workspace';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={20} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-foreground">Sessões</h1>
          <p className="text-xs text-muted-foreground">{sessions.length} sessão{sessions.length !== 1 ? 'ões' : ''} no total</p>
        </div>
        {role === 'MENTOR' && (
          <button
            onClick={() => navigate(`${basePath}/sessions/new`)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus size={14} />
            Agendar
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(['ALL', 'UPCOMING', 'PENDING', 'COMPLETED'] as ViewFilter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              filter === f
                ? 'bg-primary/10 text-primary'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {f === 'ALL' && 'Todas'}
            {f === 'UPCOMING' && 'Próximas'}
            {f === 'PENDING' && 'Pendentes'}
            {f === 'COMPLETED' && 'Concluídas'}
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              filter === f ? 'bg-primary text-primary-foreground' : 'bg-border text-muted-foreground'
            }`}>
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-10 text-center">
          <CalendarDays size={32} className="text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Nenhuma sessão nesta categoria.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(session => {
            const cp = getCounterpart(session);
            const meta = statusMeta[session.status];
            const StatusIcon = meta.icon;
            const scheduledDate = new Date(session.scheduledAt);
            const isUpcoming = isAfter(scheduledDate, new Date());
            const isThisToday = isToday(scheduledDate);

            return (
              <div
                key={session.id}
                onClick={() => navigate(`${basePath}/sessions/${session.id}`)}
                className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:bg-muted/30 cursor-pointer transition-colors group"
              >
                {/* Date block */}
                <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl flex-shrink-0 ${
                  isThisToday ? 'bg-primary text-primary-foreground' :
                  isUpcoming ? 'bg-primary/10 text-primary' :
                  'bg-muted text-muted-foreground'
                }`}>
                  <span className="text-[10px] font-medium uppercase">
                    {format(scheduledDate, 'MMM', { locale: ptBR })}
                  </span>
                  <span className="text-lg font-bold leading-none">
                    {format(scheduledDate, 'dd')}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-medium text-foreground">Sessão #{session.sessionNumber}</p>
                    {cp && (
                      <span className="text-xs text-muted-foreground">
                        · {'displayName' in cp ? cp.displayName : ''}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {format(scheduledDate, 'HH:mm', { locale: ptBR })} · {session.durationMinutes}min · {session.format}
                  </p>
                  {session.agenda && (
                    <p className="text-xs text-muted-foreground/70 truncate mt-0.5">{session.agenda}</p>
                  )}
                </div>

                {/* Status */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium ${meta.color}`}>
                    <StatusIcon size={10} />
                    {meta.label}
                  </span>
                  <ChevronRight size={16} className="text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
