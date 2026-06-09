import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Activity, Target, Clock, AlertTriangle, CheckCircle2, ChevronRight, XCircle } from 'lucide-react';
import { ExecutionGovernanceAdapter, ExecutionCommitment } from '../../../services/ExecutionGovernanceAdapter';
import { cn, formatCurrency } from '../../../lib/utils';

interface ExecutionTrackingDashboardProps {
  commitments: ExecutionCommitment[];
  onUpdateStatus?: (commitmentId: string, status: ExecutionCommitment['status']) => void;
}

export function ExecutionTrackingDashboard({ commitments, onUpdateStatus }: ExecutionTrackingDashboardProps) {
  const [selectedCommitment, setSelectedCommitment] = useState<string | null>(null);

  const pending = commitments.filter(c => c.status === 'PENDING' || c.status === 'IN_PROGRESS');
  const completed = commitments.filter(c => c.status === 'EXECUTED' || c.status === 'DEVIATED');
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock size={16} className="text-amber-500" />;
      case 'IN_PROGRESS': return <Activity size={16} className="text-blue-500" />;
      case 'EXECUTED': return <CheckCircle2 size={16} className="text-emerald-500" />;
      case 'DEVIATED': return <AlertTriangle size={16} className="text-rose-500" />;
      case 'ABORTED': return <XCircle size={16} className="text-muted-foreground" />;
      default: return <Clock size={16} className="text-muted-foreground" />;
    }
  };

  const renderSlippageSeverity = (severity: string, label: string) => {
    let colorClass = "bg-surface text-muted-foreground border-border";
    if (severity === 'LOW') colorClass = "bg-blue-900/30 text-blue-400 border-blue-800/50";
    if (severity === 'MODERATE') colorClass = "bg-amber-900/30 text-amber-400 border-amber-800/50";
    if (severity === 'CRITICAL') colorClass = "bg-rose-900/30 text-rose-400 border-rose-800/50";
    
    return (
      <div className={cn("px-2 py-1 text-[9px] font-black uppercase tracking-widest border rounded", colorClass)}>
        {label}: {severity}
      </div>
    );
  };

  return (
    <div className="bg-primary rounded-3xl p-6 md:p-8 text-white border border-border shadow-xl mt-8">
      <div className="flex items-center gap-3 mb-6">
        <Target className="text-blue-400" size={24} />
        <div>
          <h2 className="text-xl font-black">Execution Governance Dashboard</h2>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">
            Day After: Rastreamento de Deliberações do Conselho
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
            <Activity size={14} className="text-blue-400"/> Em Andamento / Pendentes ({pending.length})
          </h3>
          <div className="space-y-4">
            {pending.map(item => (
              <div 
                key={item.id} 
                className="bg-surface/50 border border-border rounded-2xl p-5 hover:bg-surface transition-colors cursor-pointer"
                onClick={() => setSelectedCommitment(item.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.status)}
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground">
                    Prazo: {item.expectedCompletionDate.toLocaleDateString()}
                  </span>
                </div>
                
                <h4 className="text-sm font-bold text-white mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{item.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {renderSlippageSeverity(item.slippage.timeSeverity, 'PRAZO')}
                  {renderSlippageSeverity(item.slippage.scopeSeverity, 'ESCOPO')}
                  {renderSlippageSeverity(item.slippage.impactSeverity, 'IMPACTO')}
                </div>
              </div>
            ))}
            {pending.length === 0 && (
              <div className="text-center p-8 bg-surface/20 border border-border border-dashed rounded-2xl">
                <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">Nenhuma ação pendente</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-400"/> Executados / Desviados ({completed.length})
          </h3>
          <div className="space-y-4">
            {completed.map(item => {
              const validation = ExecutionGovernanceAdapter.validateExecutionImpact(item);
              return (
                <div key={item.id} className="bg-surface/30 border border-border rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.status)}
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        {item.status}
                      </span>
                    </div>
                  </div>
                  
                  <h4 className="text-sm font-bold text-white mb-2">{item.title}</h4>
                  
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Score de Impacto</span>
                      <span className={cn(
                        "text-sm font-black",
                        validation.impactScore >= 80 ? "text-emerald-400" :
                        validation.impactScore >= 50 ? "text-amber-400" : "text-rose-400"
                      )}>{validation.impactScore}/100</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed italic border-l-2 border-border pl-3">
                      "{validation.validationNarrative}"
                    </p>
                  </div>
                </div>
              );
            })}
             {completed.length === 0 && (
              <div className="text-center p-8 bg-surface/20 border border-border border-dashed rounded-2xl">
                <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">Nenhuma ação executada neste ciclo</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
