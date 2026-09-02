import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Plus, TrendingUp, ChevronRight, Loader2, CheckCircle2, AlertCircle, Circle } from 'lucide-react';
import { OKRService } from '../../services/OKRService';
import type { OKR } from '../../domain';

interface MyJourneySurfaceProps {
  menteeId: string;
  programId: string;
  tenantId: string;
}

const statusColor: Record<string, string> = {
  ACTIVE: 'text-blue-500',
  AT_RISK: 'text-amber-500',
  ACHIEVED: 'text-emerald-500',
  DROPPED: 'text-muted-foreground',
};

const StatusIcon = ({ status }: { status: string }) => {
  if (status === 'ACHIEVED') return <CheckCircle2 size={14} className={statusColor[status]} />;
  if (status === 'AT_RISK') return <AlertCircle size={14} className={statusColor[status]} />;
  return <Circle size={14} className={statusColor[status]} />;
};

export const MyJourneySurface: React.FC<MyJourneySurfaceProps> = ({ menteeId, programId, tenantId }) => {
  const navigate = useNavigate();
  const [okrs, setOKRs] = useState<OKR[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOKR, setExpandedOKR] = useState<string | null>(null);

  useEffect(() => {
    OKRService.listMenteeOKRs(menteeId, programId).then(list => {
      setOKRs(list);
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

  const active = okrs.filter(o => o.status === 'ACTIVE' || o.status === 'AT_RISK');
  const archived = okrs.filter(o => o.status === 'ACHIEVED' || o.status === 'DROPPED');

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-foreground">Minha Jornada</h1>
          <p className="text-xs text-muted-foreground">OKRs e progressos de desenvolvimento</p>
        </div>
        <button
          onClick={() => navigate('/mentee/workspace/journey/new-okr')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus size={14} />
          Novo OKR
        </button>
      </div>

      {active.length === 0 && archived.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-10 text-center">
          <Target size={36} className="text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground mb-1">Nenhum OKR cadastrado</p>
          <p className="text-xs text-muted-foreground">
            Crie seus objetivos e resultados-chave para acompanhar seu desenvolvimento.
          </p>
        </div>
      ) : (
        <>
          {active.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">OKRs Ativos</p>
              {active.map(okr => (
                <OKRCard
                  key={okr.id}
                  okr={okr}
                  expanded={expandedOKR === okr.id}
                  onToggle={() => setExpandedOKR(prev => prev === okr.id ? null : okr.id)}
                />
              ))}
            </div>
          )}

          {archived.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Histórico</p>
              {archived.map(okr => (
                <OKRCard
                  key={okr.id}
                  okr={okr}
                  expanded={expandedOKR === okr.id}
                  onToggle={() => setExpandedOKR(prev => prev === okr.id ? null : okr.id)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

const OKRCard: React.FC<{ okr: OKR; expanded: boolean; onToggle: () => void }> = ({ okr, expanded, onToggle }) => (
  <div className="bg-card border border-border rounded-xl overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/30 transition-colors"
    >
      <StatusIcon status={okr.status} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{okr.objective}</p>
        <p className="text-xs text-muted-foreground">{okr.quarter}</p>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                okr.overallProgress >= 70 ? 'bg-emerald-500' :
                okr.overallProgress >= 40 ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${okr.overallProgress}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-foreground w-8 text-right">{okr.overallProgress}%</span>
        </div>
        <ChevronRight size={14} className={`text-muted-foreground transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </div>
    </button>

    {expanded && (
      <div className="border-t border-border px-4 pb-4 pt-3 space-y-3">
        {okr.description && (
          <p className="text-xs text-muted-foreground">{okr.description}</p>
        )}
        {okr.keyResults.map(kr => (
          <div key={kr.id} className="space-y-1.5">
            <div className="flex items-start gap-2">
              <TrendingUp size={12} className="text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-xs text-foreground flex-1">{kr.description}</p>
              <span className="text-xs font-medium text-foreground flex-shrink-0">
                {kr.currentValue}/{kr.targetValue}{kr.unit ? ` ${kr.unit}` : ''}
              </span>
            </div>
            <div className="h-1 bg-muted rounded-full overflow-hidden ml-5">
              <div
                className={`h-full rounded-full ${
                  kr.progress >= 70 ? 'bg-emerald-500' :
                  kr.progress >= 40 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${kr.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
