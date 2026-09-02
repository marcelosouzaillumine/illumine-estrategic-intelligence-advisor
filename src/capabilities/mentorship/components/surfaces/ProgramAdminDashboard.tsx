import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, GitMerge, BarChart3, Loader2, Sparkles, TrendingUp, CheckCircle2 } from 'lucide-react';
import { MatchingEngine } from '../../services/MatchingEngine';
import { ProfileRepository } from '../../repositories/ProfileRepository';
import { MentoringSessionRepository } from '../../repositories/MentoringSessionRepository';
import type { Match, MentorProfile, MenteeProfile, MentoringSession } from '../../domain';

interface ProgramAdminDashboardProps {
  programId: string;
  tenantId: string;
  programName?: string;
}

export const ProgramAdminDashboard: React.FC<ProgramAdminDashboardProps> = ({
  programId,
  tenantId,
  programName = 'Programa de Mentoria',
}) => {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState<MentorProfile[]>([]);
  const [mentees, setMentees] = useState<MenteeProfile[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchingLoading, setMatchingLoading] = useState(false);

  const load = async () => {
    const [m, me, ma] = await Promise.all([
      ProfileRepository.listMentorsByProgram(programId),
      ProfileRepository.listMenteesByProgram(programId),
      MatchingEngine.listProgramMatches(programId),
    ]);
    setMentors(m);
    setMentees(me);
    setMatches(ma);
    setLoading(false);
  };

  useEffect(() => { load(); }, [programId]);

  const runMatching = async () => {
    setMatchingLoading(true);
    try {
      await MatchingEngine.proposeMatches(programId, tenantId);
      await load();
    } finally {
      setMatchingLoading(false);
    }
  };

  const activeMatches = matches.filter(m => m.status === 'ACTIVE' || m.status === 'ACCEPTED');
  const pendingMatches = matches.filter(m => m.status === 'PROPOSED' || m.status === 'PENDING_MENTOR' || m.status === 'PENDING_MENTEE');
  const unmatchedMentees = mentees.filter(me => !activeMatches.find(m => m.menteeId === me.id));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={20} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-foreground">{programName}</h1>
          <p className="text-xs text-muted-foreground">Administração do Programa</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/admin/programa/relatorios')}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-xs font-medium rounded-lg text-foreground hover:bg-muted transition-colors"
          >
            <BarChart3 size={14} />
            Relatórios
          </button>
          <button
            onClick={() => navigate('/admin/programa/matching')}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-xs font-medium rounded-lg text-foreground hover:bg-muted transition-colors"
          >
            <GitMerge size={14} />
            Matching
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Mentores', value: mentors.length, icon: Users, color: 'text-blue-500' },
          { label: 'Mentorados', value: mentees.length, icon: Users, color: 'text-violet-500' },
          { label: 'Matches Ativos', value: activeMatches.length, icon: CheckCircle2, color: 'text-emerald-500' },
          { label: 'Sem Match', value: unmatchedMentees.length, icon: TrendingUp, color: 'text-amber-500' },
        ].map(stat => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
            <stat.icon size={18} className={`${stat.color} mb-3`} />
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* AI Matching */}
      {unmatchedMentees.length > 0 && (
        <div className="bg-gradient-to-br from-violet-500/10 to-violet-600/5 border border-violet-500/20 rounded-xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={16} className="text-violet-500" />
                <p className="text-sm font-semibold text-foreground">Matching Automático com IA</p>
              </div>
              <p className="text-xs text-muted-foreground">
                {unmatchedMentees.length} mentorado{unmatchedMentees.length > 1 ? 's' : ''} sem mentor.
                O algoritmo analisa expertise, setor, estilo e disponibilidade.
              </p>
            </div>
            <button
              onClick={runMatching}
              disabled={matchingLoading}
              className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 disabled:opacity-50 transition-colors flex-shrink-0 ml-4"
            >
              {matchingLoading ? <Loader2 size={14} className="animate-spin" /> : <GitMerge size={14} />}
              Executar Matching
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mentors */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Mentores ({mentors.length})</h2>
          {mentors.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">Nenhum mentor cadastrado.</p>
          ) : (
            <div className="space-y-2">
              {mentors.map(mentor => (
                <div key={mentor.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-blue-500/15 flex items-center justify-center text-xs font-bold text-blue-600 flex-shrink-0">
                    {mentor.displayName.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{mentor.displayName}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {mentor.expertiseDomains.slice(0, 2).join(' · ')}
                    </p>
                  </div>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                    mentor.availability.status === 'AVAILABLE'
                      ? 'bg-emerald-500/10 text-emerald-600'
                      : 'bg-amber-500/10 text-amber-600'
                  }`}>
                    {mentor.availability.currentMentees}/{mentor.availability.maxMentees}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending matches */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">
            Matches Pendentes ({pendingMatches.length})
          </h2>
          {pendingMatches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <CheckCircle2 size={24} className="text-emerald-500/40 mb-2" />
              <p className="text-xs text-muted-foreground">Nenhum match pendente de aprovação.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {pendingMatches.map(match => {
                const mentor = mentors.find(m => m.id === match.mentorId);
                const mentee = mentees.find(m => m.id === match.menteeId);
                return (
                  <div key={match.id} className="p-3 rounded-lg border border-border">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-medium text-foreground">{mentor?.displayName ?? 'Mentor'}</span>
                      <span className="text-xs text-muted-foreground">↔</span>
                      <span className="text-xs font-medium text-foreground">{mentee?.displayName ?? 'Mentorado'}</span>
                      {match.score && (
                        <span className="ml-auto text-[10px] font-semibold text-violet-600">
                          {match.score.total}pts
                        </span>
                      )}
                    </div>
                    {match.matchRationale && (
                      <p className="text-[10px] text-muted-foreground">{match.matchRationale}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
