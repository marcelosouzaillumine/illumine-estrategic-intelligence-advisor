import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, CalendarDays, TrendingUp, Sparkles, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import { MentoringSessionRepository } from '../../repositories/MentoringSessionRepository';
import { OKRRepository } from '../../repositories/OKRRepository';
import type { MentoringSession, OKR } from '../../domain';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MenteeDashboardProps {
  menteeId: string;
  programId: string;
  mentorName?: string;
}

export const MenteeDashboard: React.FC<MenteeDashboardProps> = ({ menteeId, programId, mentorName }) => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<MentoringSession[]>([]);
  const [okrs, setOKRs] = useState<OKR[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      MentoringSessionRepository.listByMentee(menteeId, programId),
      OKRRepository.listByMentee(menteeId, programId),
    ]).then(([s, o]) => {
      setSessions(s);
      setOKRs(o);
      setLoading(false);
    });
  }, [menteeId, programId]);

  const upcoming = sessions
    .filter(s => ['SCHEDULED', 'PRE_BRIEF_PENDING'].includes(s.status))
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

  const nextSession = upcoming[0];
  const completed = sessions.filter(s => s.status === 'COMPLETED').length;
  const activeOKRs = okrs.filter(o => o.status === 'ACTIVE');
  const avgOKRProgress = activeOKRs.length
    ? Math.round(activeOKRs.reduce((sum, o) => sum + o.overallProgress, 0) / activeOKRs.length)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Sparkles size={16} className="animate-pulse" />
          Carregando sua jornada...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero: next session */}
      {nextSession ? (
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
                Próxima Sessão
              </p>
              <p className="text-lg font-bold text-foreground">
                {format(new Date(nextSession.scheduledAt), "EEEE, dd 'de' MMMM", { locale: ptBR })}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {format(new Date(nextSession.scheduledAt), 'HH:mm', { locale: ptBR })}
                {' · '}
                {nextSession.durationMinutes}min
                {mentorName && ` · com ${mentorName}`}
              </p>
            </div>
            <button
              onClick={() => navigate(`/mentee/workspace/sessions/${nextSession.id}`)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Ver sessão <ChevronRight size={14} />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-3">
          <CalendarDays size={20} className="text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Nenhuma sessão agendada. Fale com seu mentor para agendar.</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Sessões Concluídas', value: completed, icon: CheckCircle2, color: 'text-emerald-500' },
          { label: 'OKRs Ativos', value: activeOKRs.length, icon: Target, color: 'text-blue-500' },
          { label: 'Progresso Médio', value: `${avgOKRProgress}%`, icon: TrendingUp, color: 'text-violet-500' },
          { label: 'Próximas Sessões', value: upcoming.length, icon: Clock, color: 'text-amber-500' },
        ].map(stat => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
            <stat.icon size={18} className={`${stat.color} mb-3`} />
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* OKRs */}
      {activeOKRs.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Meus OKRs</h2>
            <button
              onClick={() => navigate('/mentee/workspace/journey')}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Ver jornada <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-3">
            {activeOKRs.slice(0, 3).map(okr => (
              <div key={okr.id} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground truncate max-w-[70%]">{okr.objective}</p>
                  <span className="text-xs font-semibold text-foreground">{okr.overallProgress}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      okr.overallProgress >= 70
                        ? 'bg-emerald-500'
                        : okr.overallProgress >= 40
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${okr.overallProgress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent sessions */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground">Sessões Recentes</h2>
          <button
            onClick={() => navigate('/mentee/workspace/sessions')}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            Ver todas <ChevronRight size={14} />
          </button>
        </div>
        {sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Nenhuma sessão registrada ainda.</p>
        ) : (
          <div className="space-y-2">
            {sessions
              .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())
              .slice(0, 4)
              .map(session => (
                <div
                  key={session.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/mentee/workspace/sessions/${session.id}`)}
                >
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    session.status === 'COMPLETED' ? 'bg-emerald-500' :
                    session.status === 'CANCELLED' ? 'bg-red-500' :
                    'bg-amber-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground">Sessão #{session.sessionNumber}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {format(new Date(session.scheduledAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                  {session.synthesis && (
                    <span className="text-[10px] text-emerald-600 font-medium">Síntese</span>
                  )}
                  <ChevronRight size={14} className="text-muted-foreground/50 flex-shrink-0" />
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
