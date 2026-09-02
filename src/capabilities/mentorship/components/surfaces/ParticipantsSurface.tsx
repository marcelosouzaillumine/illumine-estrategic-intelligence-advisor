import React, { useEffect, useState } from 'react';
import { Users, UserCheck, Search, Loader2, TrendingUp, CalendarDays, Target } from 'lucide-react';
import { ProfileRepository } from '../../repositories/ProfileRepository';
import { OKRRepository } from '../../repositories/OKRRepository';
import { MentoringSessionRepository } from '../../repositories/MentoringSessionRepository';
import { MatchRepository } from '../../repositories/MatchRepository';
import type { MentorProfile, MenteeProfile } from '../../domain';

interface MenteeRow extends MenteeProfile {
  mentorName?: string;
  sessionCount: number;
  activeOKRs: number;
  avgProgress: number;
}

interface MentorRow extends MentorProfile {
  menteesCount: number;
}

interface ParticipantsSurfaceProps {
  programId: string;
}

export const ParticipantsSurface: React.FC<ParticipantsSurfaceProps> = ({ programId }) => {
  const [tab, setTab] = useState<'mentees' | 'mentors'>('mentees');
  const [search, setSearch] = useState('');
  const [mentees, setMentees] = useState<MenteeRow[]>([]);
  const [mentors, setMentors] = useState<MentorRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [mentorProfiles, menteeProfiles, matches] = await Promise.all([
        ProfileRepository.listMentorsByProgram(programId),
        ProfileRepository.listMenteesByProgram(programId),
        MatchRepository.listByProgram(programId),
      ]);

      const activeMatches = matches.filter(m => m.status === 'ACTIVE');
      const mentorNameById = Object.fromEntries(mentorProfiles.map(m => [m.userId, m.displayName]));

      const menteeRows = await Promise.all(
        menteeProfiles.map(async p => {
          const match = activeMatches.find(m => m.menteeId === p.id);
          const [sessions, okrs] = await Promise.all([
            match ? MentoringSessionRepository.listByPair(match.mentorId, p.id) : Promise.resolve([]),
            OKRRepository.listByMentee(p.id, programId),
          ]);
          const active = okrs.filter(o => o.status === 'ACTIVE' || o.status === 'AT_RISK');
          const avg = active.length
            ? Math.round(active.reduce((s, o) => s + o.overallProgress, 0) / active.length)
            : 0;
          return {
            ...p,
            mentorName: match ? mentorNameById[match.mentorId] : undefined,
            sessionCount: sessions.filter(s => s.status === 'COMPLETED').length,
            activeOKRs: active.length,
            avgProgress: avg,
          };
        })
      );

      const mentorRows = mentorProfiles.map(m => ({
        ...m,
        menteesCount: activeMatches.filter(match => match.mentorId === m.userId).length,
      }));

      setMentees(menteeRows);
      setMentors(mentorRows);
      setLoading(false);
    };
    load();
  }, [programId]);

  const filteredMentees = mentees.filter(m =>
    m.displayName.toLowerCase().includes(search.toLowerCase()) ||
    (m.mentorName ?? '').toLowerCase().includes(search.toLowerCase()) ||
    m.developmentContext.currentRole.toLowerCase().includes(search.toLowerCase())
  );

  const filteredMentors = mentors.filter(m =>
    m.displayName.toLowerCase().includes(search.toLowerCase()) ||
    m.expertiseDomains.some(d => d.toLowerCase().includes(search.toLowerCase()))
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
          <h1 className="text-lg font-semibold text-foreground">Participantes</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {mentors.length} mentor{mentors.length !== 1 ? 'es' : ''} · {mentees.length} mentorado{mentees.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="flex gap-1 bg-muted/50 p-1 rounded-xl w-fit">
        {([
          { value: 'mentees', label: `Mentorados (${mentees.length})` },
          { value: 'mentors', label: `Mentores (${mentors.length})` },
        ] as const).map(t => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
              tab === t.value ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={tab === 'mentees' ? 'Buscar mentorado ou mentor...' : 'Buscar mentor ou expertise...'}
          className="w-full pl-9 pr-3 py-2.5 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/20"
        />
      </div>

      {tab === 'mentees' && (
        <div className="space-y-2">
          {filteredMentees.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Users size={32} className="text-muted-foreground/20 mb-2" />
              <p className="text-sm text-muted-foreground">Nenhum mentorado encontrado.</p>
            </div>
          ) : filteredMentees.map(m => (
            <div key={m.id} className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl">
              <div className="w-9 h-9 rounded-full bg-violet-500/15 flex items-center justify-center text-sm font-bold text-violet-600 flex-shrink-0">
                {m.displayName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{m.displayName}</p>
                <p className="text-xs text-muted-foreground truncate">{m.developmentContext.currentRole}</p>
                {m.mentorName && (
                  <p className="text-[10px] text-violet-600 font-medium mt-0.5">Mentor: {m.mentorName}</p>
                )}
                {!m.mentorName && (
                  <p className="text-[10px] text-amber-500 font-medium mt-0.5">Sem mentor atribuído</p>
                )}
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="flex items-center gap-1 justify-center text-xs font-medium text-foreground">
                    <CalendarDays size={11} className="text-muted-foreground" />
                    {m.sessionCount}
                  </div>
                  <p className="text-[10px] text-muted-foreground">sessões</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 justify-center text-xs font-medium text-foreground">
                    <Target size={11} className="text-muted-foreground" />
                    {m.activeOKRs}
                  </div>
                  <p className="text-[10px] text-muted-foreground">OKRs</p>
                </div>
                <div className="text-center w-14">
                  {m.activeOKRs > 0 ? (
                    <>
                      <p className={`text-xs font-bold ${
                        m.avgProgress >= 70 ? 'text-emerald-500' :
                        m.avgProgress >= 40 ? 'text-amber-500' : 'text-red-500'
                      }`}>{m.avgProgress}%</p>
                      <div className="h-1 bg-muted rounded-full mt-1 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            m.avgProgress >= 70 ? 'bg-emerald-500' :
                            m.avgProgress >= 40 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${m.avgProgress}%` }}
                        />
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground/40">—</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'mentors' && (
        <div className="space-y-2">
          {filteredMentors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <UserCheck size={32} className="text-muted-foreground/20 mb-2" />
              <p className="text-sm text-muted-foreground">Nenhum mentor encontrado.</p>
            </div>
          ) : filteredMentors.map(m => (
            <div key={m.id} className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl">
              <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                {m.displayName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{m.displayName}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {m.experience[0]?.role}
                  {m.experience[0]?.company && ` · ${m.experience[0].company}`}
                </p>
                <div className="flex gap-1 flex-wrap mt-1">
                  {m.expertiseDomains.slice(0, 3).map(d => (
                    <span key={d} className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-medium">
                      {d.replace(/_/g, ' ').toLowerCase()}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-center flex-shrink-0">
                <div className="flex items-center gap-1 justify-center text-xs font-medium text-foreground">
                  <TrendingUp size={11} className="text-muted-foreground" />
                  {m.menteesCount}/{m.availability.maxMentees}
                </div>
                <p className="text-[10px] text-muted-foreground">mentorados</p>
                <span className={`text-[10px] font-medium mt-0.5 block ${
                  m.availability.status === 'AVAILABLE' ? 'text-emerald-500' :
                  m.availability.status === 'AT_CAPACITY' ? 'text-red-500' : 'text-amber-500'
                }`}>
                  {m.availability.status === 'AVAILABLE' ? 'disponível' :
                   m.availability.status === 'AT_CAPACITY' ? 'cheio' : 'pausado'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
