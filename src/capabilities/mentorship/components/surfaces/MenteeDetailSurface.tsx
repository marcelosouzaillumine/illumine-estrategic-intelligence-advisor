import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, Target, CalendarDays, TrendingUp,
  Loader2, CheckCircle2, AlertCircle, Circle, Plus,
} from 'lucide-react';
import { ProfileRepository } from '../../repositories/ProfileRepository';
import { MentoringSessionRepository } from '../../repositories/MentoringSessionRepository';
import { OKRRepository } from '../../repositories/OKRRepository';
import type { MenteeProfile, MentoringSession, OKR } from '../../domain';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const PRIORITY_LABEL: Record<string, string> = {
  CAREER_GROWTH: 'Crescimento',
  LEADERSHIP_SKILLS: 'Liderança',
  TECHNICAL_SKILLS: 'Habilidades Técnicas',
  STRATEGIC_THINKING: 'Estratégia',
  NETWORK_EXPANSION: 'Rede',
  ENTREPRENEURSHIP: 'Empreendedorismo',
  EXECUTIVE_PRESENCE: 'Presença Executiva',
  WORK_LIFE_BALANCE: 'Equilíbrio',
};

interface MenteeDetailSurfaceProps {
  programId: string;
}

export const MenteeDetailSurface: React.FC<MenteeDetailSurfaceProps> = ({ programId }) => {
  const { menteeId } = useParams<{ menteeId: string }>();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<MenteeProfile | null>(null);
  const [sessions, setSessions] = useState<MentoringSession[]>([]);
  const [okrs, setOKRs] = useState<OKR[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'overview' | 'sessions' | 'okrs'>('overview');

  useEffect(() => {
    if (!menteeId) return;
    Promise.all([
      ProfileRepository.getMentee(menteeId, programId),
      MentoringSessionRepository.listByMentee(menteeId, programId),
      OKRRepository.listByMentee(menteeId, programId),
    ]).then(([p, s, o]) => {
      setProfile(p);
      setSessions(s.sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()));
      setOKRs(o);
      setLoading(false);
    });
  }, [menteeId, programId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={20} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <AlertCircle size={24} className="text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">Mentorado não encontrado.</p>
      </div>
    );
  }

  const completedSessions = sessions.filter(s => s.status === 'COMPLETED').length;
  const activeOKRs = okrs.filter(o => o.status === 'ACTIVE' || o.status === 'AT_RISK');
  const avgOKRProgress = activeOKRs.length
    ? Math.round(activeOKRs.reduce((s, o) => s + o.overallProgress, 0) / activeOKRs.length)
    : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/mentor/workspace/mentees')}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center text-lg font-bold text-primary">
            {profile.displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-base font-semibold text-foreground">{profile.displayName}</h1>
            <p className="text-xs text-muted-foreground">
              {profile.developmentContext.currentRole}
              {profile.developmentContext.company && ` · ${profile.developmentContext.company}`}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/mentor/workspace/sessions/new?menteeId=${menteeId}`)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus size={14} />
          Agendar Sessão
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Sessões Concluídas', value: completedSessions, icon: CheckCircle2, color: 'text-emerald-500' },
          { label: 'OKRs Ativos', value: activeOKRs.length, icon: Target, color: 'text-blue-500' },
          { label: 'Progresso Médio', value: `${avgOKRProgress}%`, icon: TrendingUp, color: 'text-violet-500' },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <s.icon size={18} className={`${s.color} mx-auto mb-2`} />
            <p className="text-xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted/50 p-1 rounded-xl">
        {(['overview', 'sessions', 'okrs'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${
              tab === t ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t === 'overview' ? 'Perfil' : t === 'sessions' ? 'Sessões' : 'OKRs'}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div className="space-y-4">
          {profile.bio && (
            <div className="bg-card border border-border rounded-xl p-5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Bio</p>
              <p className="text-sm text-foreground leading-relaxed">{profile.bio}</p>
            </div>
          )}
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Contexto de Desenvolvimento</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Setor</p>
                <p className="font-medium text-foreground">{profile.developmentContext.industry}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Experiência</p>
                <p className="font-medium text-foreground">{profile.developmentContext.yearsExperience} anos</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Estágio</p>
                <p className="font-medium text-foreground capitalize">{profile.developmentContext.careerStage.replace(/_/g, ' ').toLowerCase()}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Prioridades</p>
              <div className="flex flex-wrap gap-1.5">
                {profile.developmentContext.priorityAreas.map(a => (
                  <span key={a} className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-lg">
                    {PRIORITY_LABEL[a] ?? a}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Maior Desafio</p>
              <p className="text-sm text-foreground leading-relaxed">{profile.developmentContext.biggestChallenge}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Objetivos de Desenvolvimento</p>
              <ul className="space-y-1">
                {profile.developmentContext.developmentGoals.map((g, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="text-primary font-bold mt-0.5">{i + 1}.</span>
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Sessions */}
      {tab === 'sessions' && (
        <div className="space-y-2">
          {sessions.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <CalendarDays size={28} className="text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Nenhuma sessão registrada.</p>
            </div>
          ) : sessions.map(session => (
            <div
              key={session.id}
              className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:bg-muted/30 cursor-pointer transition-colors"
              onClick={() => navigate(`/mentor/workspace/sessions/${session.id}`)}
            >
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                session.status === 'COMPLETED' ? 'bg-emerald-500' :
                session.status === 'CANCELLED' ? 'bg-red-500' : 'bg-amber-500'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Sessão #{session.sessionNumber}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(session.scheduledAt), "dd 'de' MMM 'de' yyyy, HH:mm", { locale: ptBR })}
                  {' · '}{session.durationMinutes}min
                </p>
              </div>
              <span className="text-xs text-muted-foreground">{session.status.replace(/_/g, ' ')}</span>
              {session.synthesis && <span className="text-[10px] text-emerald-600 font-medium">Síntese</span>}
            </div>
          ))}
        </div>
      )}

      {/* OKRs */}
      {tab === 'okrs' && (
        <div className="space-y-3">
          {okrs.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <Target size={28} className="text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Nenhum OKR cadastrado.</p>
            </div>
          ) : okrs.map(okr => (
            <div key={okr.id} className="bg-card border border-border rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  {okr.status === 'ACHIEVED' ? <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" /> :
                   okr.status === 'AT_RISK' ? <AlertCircle size={14} className="text-amber-500 flex-shrink-0" /> :
                   <Circle size={14} className="text-blue-500 flex-shrink-0" />}
                  <p className="text-sm font-medium text-foreground">{okr.objective}</p>
                </div>
                <span className="text-sm font-bold text-foreground flex-shrink-0">{okr.overallProgress}%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    okr.overallProgress >= 70 ? 'bg-emerald-500' :
                    okr.overallProgress >= 40 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${okr.overallProgress}%` }}
                />
              </div>
              <div className="space-y-1.5">
                {okr.keyResults.map(kr => (
                  <div key={kr.id} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground truncate max-w-[70%]">{kr.description}</span>
                    <span className="font-medium text-foreground">
                      {kr.currentValue}/{kr.targetValue}{kr.unit ? ` ${kr.unit}` : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
