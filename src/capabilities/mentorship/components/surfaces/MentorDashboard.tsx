import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, CalendarDays, TrendingUp, Clock, ChevronRight, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { MentoringSessionRepository } from '../../repositories/MentoringSessionRepository';
import { ProfileRepository } from '../../repositories/ProfileRepository';
import type { MentoringSession, MenteeProfile } from '../../domain';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MentorDashboardProps {
  mentorId: string;
  programId: string;
  tenantId: string;
}

export const MentorDashboard: React.FC<MentorDashboardProps> = ({ mentorId, programId, tenantId }) => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<MentoringSession[]>([]);
  const [mentees, setMentees] = useState<MenteeProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      MentoringSessionRepository.listByMentor(mentorId, programId),
      ProfileRepository.listMenteesByProgram(programId),
    ]).then(([s, m]) => {
      setSessions(s);
      setMentees(m);
      setLoading(false);
    });
  }, [mentorId, programId]);

  const upcoming = sessions
    .filter(s => s.status === 'SCHEDULED' || s.status === 'PRE_BRIEF_PENDING' || s.status === 'PRE_BRIEF_DONE')
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, 3);

  const pendingNotes = sessions.filter(s => s.status === 'NOTES_PENDING' || s.status === 'SYNTHESIS_PENDING');
  const completed = sessions.filter(s => s.status === 'COMPLETED').length;

  const stats = [
    { label: 'Mentorados Ativos', value: mentees.length, icon: Users, color: 'text-blue-500' },
    { label: 'Sessões Realizadas', value: completed, icon: CheckCircle2, color: 'text-emerald-500' },
    { label: 'Próximas Sessões', value: upcoming.length, icon: CalendarDays, color: 'text-violet-500' },
    { label: 'Aguardando Notas', value: pendingNotes.length, icon: Clock, color: 'text-amber-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Sparkles size={16} className="animate-pulse" />
          Carregando dados...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <stat.icon size={18} className={stat.color} />
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming sessions */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Próximas Sessões</h2>
            <button
              onClick={() => navigate('/mentor/workspace/sessions')}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Ver todas <ChevronRight size={14} />
            </button>
          </div>

          {upcoming.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CalendarDays size={28} className="text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">Nenhuma sessão agendada</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map(session => {
                const mentee = mentees.find(m => m.id === session.menteeId);
                return (
                  <div
                    key={session.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => navigate(`/mentor/workspace/sessions/${session.id}`)}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                      {mentee?.displayName?.charAt(0) ?? '?'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">
                        {mentee?.displayName ?? 'Mentorado'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(session.scheduledAt), "dd 'de' MMM, HH:mm", { locale: ptBR })}
                        {' · '}
                        {session.durationMinutes}min
                      </p>
                    </div>
                    <span className={`flex-shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      session.status === 'PRE_BRIEF_DONE'
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {session.status === 'PRE_BRIEF_DONE' ? 'Pre-Brief Pronto' : 'Agendada'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pending actions */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Ações Pendentes</h2>

          {pendingNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle2 size={28} className="text-emerald-500/40 mb-2" />
              <p className="text-sm text-muted-foreground">Tudo em dia!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {pendingNotes.slice(0, 5).map(session => (
                <div
                  key={session.id}
                  className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20 cursor-pointer hover:bg-amber-500/10 transition-colors"
                  onClick={() => navigate(`/mentor/workspace/sessions/${session.id}`)}
                >
                  <AlertCircle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground">Sessão #{session.sessionNumber}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {session.status === 'SYNTHESIS_PENDING' ? 'Síntese pendente' : 'Notas pendentes'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mentee roster */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground">Meus Mentorados</h2>
          <button
            onClick={() => navigate('/mentor/workspace/mentees')}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            Ver todos <ChevronRight size={14} />
          </button>
        </div>

        {mentees.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Nenhum mentorado vinculado ainda.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {mentees.slice(0, 6).map(mentee => {
              const menteeSessions = sessions.filter(s => s.menteeId === mentee.id);
              const lastCompleted = menteeSessions
                .filter(s => s.status === 'COMPLETED')
                .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())[0];

              return (
                <div
                  key={mentee.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/mentor/workspace/mentees/${mentee.id}`)}
                >
                  <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                    {mentee.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{mentee.displayName}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {mentee.developmentContext.currentRole}
                    </p>
                    {lastCompleted && (
                      <p className="text-[10px] text-muted-foreground/70">
                        Última: {format(new Date(lastCompleted.scheduledAt), 'dd/MM', { locale: ptBR })}
                      </p>
                    )}
                  </div>
                  <TrendingUp size={14} className="text-muted-foreground/40 flex-shrink-0 ml-auto" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
