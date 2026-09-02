import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Area, AreaChart,
} from 'recharts';
import { CalendarDays, Target, TrendingUp, Zap, Loader2 } from 'lucide-react';
import { MentoringSessionRepository } from '../../repositories/MentoringSessionRepository';
import { OKRRepository } from '../../repositories/OKRRepository';
import { ProfileRepository } from '../../repositories/ProfileRepository';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { MentoringSession, OKR } from '../../domain';

interface ReportsSurfaceProps {
  programId: string;
  tenantId: string;
}

interface MonthBucket {
  month: string;
  sessions: number;
  completed: number;
}

interface PulseTrend {
  label: string;
  score: number;
}

export const ReportsSurface: React.FC<ReportsSurfaceProps> = ({ programId }) => {
  const [sessions, setSessions] = useState<MentoringSession[]>([]);
  const [okrs, setOKRs] = useState<OKR[]>([]);
  const [mentorCount, setMentorCount] = useState(0);
  const [menteeCount, setMenteeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [mentors, mentees] = await Promise.all([
        ProfileRepository.listMentorsByProgram(programId),
        ProfileRepository.listMenteesByProgram(programId),
      ]);
      setMentorCount(mentors.length);
      setMenteeCount(mentees.length);

      const allSessions = await Promise.all(
        mentors.flatMap(m => MentoringSessionRepository.listByMentor(m.userId, programId))
      );
      const flat = allSessions.flat();
      setSessions(flat);

      const allOKRs = await Promise.all(
        mentees.map(m => OKRRepository.listByMentee(m.id, programId))
      );
      setOKRs(allOKRs.flat());
      setLoading(false);
    };
    load();
  }, [programId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={20} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  const completedSessions = sessions.filter(s => s.status === 'COMPLETED');
  const avgOKRProgress = okrs.length
    ? Math.round(okrs.reduce((s, o) => s + o.overallProgress, 0) / okrs.length)
    : 0;
  const achievedOKRs = okrs.filter(o => o.status === 'ACHIEVED').length;

  // Sessions per month (last 6)
  const monthlyMap = new Map<string, MonthBucket>();
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = format(d, 'MMM', { locale: ptBR });
    monthlyMap.set(key, { month: key, sessions: 0, completed: 0 });
  }
  sessions.forEach(s => {
    const d = new Date(s.scheduledAt);
    const key = format(d, 'MMM', { locale: ptBR });
    if (monthlyMap.has(key)) {
      monthlyMap.get(key)!.sessions++;
      if (s.status === 'COMPLETED') monthlyMap.get(key)!.completed++;
    }
  });
  const sessionChartData = Array.from(monthlyMap.values());

  // OKR progress distribution
  const progressBuckets = [
    { range: '0–25%', count: okrs.filter(o => o.overallProgress <= 25).length },
    { range: '26–50%', count: okrs.filter(o => o.overallProgress > 25 && o.overallProgress <= 50).length },
    { range: '51–75%', count: okrs.filter(o => o.overallProgress > 50 && o.overallProgress <= 75).length },
    { range: '76–100%', count: okrs.filter(o => o.overallProgress > 75).length },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Relatórios do Programa</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Visão analítica de sessões, OKRs e engajamento</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Sessões Concluídas', value: completedSessions.length, sub: `de ${sessions.length} agendadas`, icon: CalendarDays, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Progresso Médio OKR', value: `${avgOKRProgress}%`, sub: `${okrs.length} OKRs ativos`, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'OKRs Alcançados', value: achievedOKRs, sub: `de ${okrs.length} total`, icon: Target, color: 'text-violet-500', bg: 'bg-violet-500/10' },
          { label: 'Participantes', value: mentorCount + menteeCount, sub: `${mentorCount} mentores · ${menteeCount} mentorados`, icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        ].map(card => (
          <div key={card.label} className="bg-card border border-border rounded-xl p-4">
            <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center mb-3`}>
              <card.icon size={16} className={card.color} />
            </div>
            <p className="text-xl font-bold text-foreground">{card.value}</p>
            <p className="text-xs font-medium text-foreground mt-0.5">{card.label}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sessions per month */}
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-sm font-medium text-foreground mb-4">Sessões por Mês</p>
          {sessionChartData.every(d => d.sessions === 0) ? (
            <div className="flex items-center justify-center h-36 text-sm text-muted-foreground">Sem dados ainda</div>
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={sessionChartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="sessionsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid hsl(var(--border))' }}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="sessions" stroke="#3b82f6" fill="url(#sessionsGrad)" strokeWidth={2} name="Agendadas" dot={false} />
                <Area type="monotone" dataKey="completed" stroke="#10b981" fill="transparent" strokeWidth={2} name="Concluídas" dot={false} strokeDasharray="4 2" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* OKR distribution */}
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-sm font-medium text-foreground mb-4">Distribuição de Progresso OKR</p>
          {okrs.length === 0 ? (
            <div className="flex items-center justify-center h-36 text-sm text-muted-foreground">Sem dados ainda</div>
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={progressBuckets} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border" vertical={false} />
                <XAxis dataKey="range" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid hsl(var(--border))' }}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="OKRs" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* OKR status breakdown */}
      {okrs.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-sm font-medium text-foreground mb-4">Status dos OKRs</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { status: 'ACTIVE', label: 'Ativos', color: 'bg-blue-500' },
              { status: 'AT_RISK', label: 'Em Risco', color: 'bg-amber-500' },
              { status: 'ACHIEVED', label: 'Alcançados', color: 'bg-emerald-500' },
              { status: 'DROPPED', label: 'Abandonados', color: 'bg-red-500' },
            ].map(s => {
              const count = okrs.filter(o => o.status === s.status).length;
              const pct = okrs.length ? Math.round((count / okrs.length) * 100) : 0;
              return (
                <div key={s.status} className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl">
                  <div className={`w-2 h-8 rounded-full ${s.color} flex-shrink-0`} />
                  <div>
                    <p className="text-sm font-bold text-foreground">{count}</p>
                    <p className="text-[10px] text-muted-foreground">{s.label} · {pct}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
