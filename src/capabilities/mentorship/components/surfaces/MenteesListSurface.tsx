import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Search, Loader2, TrendingUp, Target, CalendarDays, Users,
} from 'lucide-react';
import { ProfileRepository } from '../../repositories/ProfileRepository';
import { OKRRepository } from '../../repositories/OKRRepository';
import { MentoringSessionRepository } from '../../repositories/MentoringSessionRepository';
import type { MenteeProfile } from '../../domain';

interface MenteeCard extends MenteeProfile {
  activeOKRs: number;
  completedSessions: number;
  avgProgress: number;
}

interface MenteesListSurfaceProps {
  mentorId: string;
  programId: string;
}

export const MenteesListSurface: React.FC<MenteesListSurfaceProps> = ({ mentorId, programId }) => {
  const navigate = useNavigate();
  const [mentees, setMentees] = useState<MenteeCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      const profiles = await ProfileRepository.listMenteesByProgram(programId);
      const cards = await Promise.all(
        profiles.map(async p => {
          const [okrs, sessions] = await Promise.all([
            OKRRepository.listByMentee(p.id, programId),
            MentoringSessionRepository.listByPair(mentorId, p.id),
          ]);
          const active = okrs.filter(o => o.status === 'ACTIVE' || o.status === 'AT_RISK');
          const completed = sessions.filter(s => s.status === 'COMPLETED').length;
          const avg = active.length
            ? Math.round(active.reduce((s, o) => s + o.overallProgress, 0) / active.length)
            : 0;
          return { ...p, activeOKRs: active.length, completedSessions: completed, avgProgress: avg };
        })
      );
      setMentees(cards);
      setLoading(false);
    };
    load();
  }, [mentorId, programId]);

  const filtered = mentees.filter(m =>
    m.displayName.toLowerCase().includes(search.toLowerCase()) ||
    m.developmentContext.currentRole.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={20} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Meus Mentorados</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{mentees.length} participante{mentees.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => navigate('/mentor/workspace/sessions/new')}
          className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus size={14} />
          Agendar Sessão
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar mentorado..."
          className="w-full pl-9 pr-3 py-2.5 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Users size={36} className="text-muted-foreground/20 mb-3" />
          <p className="text-sm text-muted-foreground">
            {search ? 'Nenhum mentorado encontrado.' : 'Nenhum mentorado atribuído ainda.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map(m => (
            <div
              key={m.id}
              className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:bg-muted/30 cursor-pointer transition-colors group"
              onClick={() => navigate(`/mentor/workspace/mentees/${m.id}`)}
            >
              <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                {m.displayName.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {m.displayName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {m.developmentContext.currentRole}
                  {m.developmentContext.company && ` · ${m.developmentContext.company}`}
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarDays size={11} />
                    <span>{m.completedSessions}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">sessões</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Target size={11} />
                    <span>{m.activeOKRs}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">OKRs</p>
                </div>
                <div className="text-center w-12">
                  <div className={`text-xs font-bold ${
                    m.avgProgress >= 70 ? 'text-emerald-500' :
                    m.avgProgress >= 40 ? 'text-amber-500' : 'text-muted-foreground'
                  }`}>
                    {m.activeOKRs > 0 ? `${m.avgProgress}%` : '—'}
                  </div>
                  <p className="text-[10px] text-muted-foreground">progresso</p>
                </div>
                {m.activeOKRs > 0 && (
                  <div className="w-16">
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          m.avgProgress >= 70 ? 'bg-emerald-500' :
                          m.avgProgress >= 40 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${m.avgProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
