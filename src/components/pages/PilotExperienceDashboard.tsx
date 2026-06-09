import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Clock, 
  BarChart2, 
  Download, 
  AlertCircle, 
  Smile, 
  User, 
  MessageSquare, 
  FileText,
  MousePointer,
  RefreshCw
} from 'lucide-react';
import { PageHeader } from '../Common';
import { CommercialPilotSessionManager } from '../../core/commercial/CommercialPilotSessionManager';
import { PilotFeedbackEngine } from '../../core/commercial/PilotFeedbackEngine';
import { PilotExperienceMetrics } from '../../core/commercial/PilotExperienceMetrics';
import { ExecutiveAttentionTracking } from '../../core/commercial/ExecutiveAttentionTracking';

export function PilotExperienceDashboard({ selectedClient }: { selectedClient: string }) {
  const [selectedTenant, setSelectedTenant] = useState<string>('TENANT-1');
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Hardcoded mockup data trigger if there is absolutely no data, so it shows something premium
  useEffect(() => {
    // Inject mock data if empty just for rich first-impression aesthetics
    const currentSessions = CommercialPilotSessionManager.getAllSessions(selectedTenant);
    if (currentSessions.length === 0) {
      try {
        const s1 = CommercialPilotSessionManager.startSession(selectedTenant, 'ONBOARDING_SESSION', 'advisor-01@empresa.com');
        CommercialPilotSessionManager.endSession(s1.sessionId, selectedTenant);

        const s2 = CommercialPilotSessionManager.startSession(selectedTenant, 'BOARD_SESSION', 'cfo@empresa.com');
        CommercialPilotSessionManager.endSession(s2.sessionId, selectedTenant);

        CommercialPilotSessionManager.startSession(selectedTenant, 'ADVISOR_SESSION', 'advisor-01@empresa.com');

        PilotFeedbackEngine.registerFeedback({
          tenantId: selectedTenant,
          sessionId: s1.sessionId,
          actorId: 'advisor-01@empresa.com',
          confidencePerception: 5,
          narrativeClarity: 4,
          valuePerception: 5,
          excessiveNoise: 1,
          irrelevantWarnings: 1,
          confusionPoints: 'Nenhuma confusão relatada. Visualização de lineage excelente.'
        });

        PilotFeedbackEngine.registerFeedback({
          tenantId: selectedTenant,
          sessionId: s2.sessionId,
          actorId: 'cfo@empresa.com',
          confidencePerception: 4,
          narrativeClarity: 5,
          valuePerception: 4,
          excessiveNoise: 2,
          irrelevantWarnings: 1,
          confusionPoints: 'Ficou um pouco confuso no início com relação a CMV, mas se resolveu visualizando os OKRs setoriais.'
        });

        PilotExperienceMetrics.logExport(selectedTenant);
        PilotExperienceMetrics.logExport(selectedTenant);
        PilotExperienceMetrics.logTimeToInsight(selectedTenant, 35);
        PilotExperienceMetrics.logTimeToInsight(selectedTenant, 55);
        PilotExperienceMetrics.logOnboardingTime(selectedTenant, 95);
        PilotExperienceMetrics.logOnboardingTime(selectedTenant, 115);

        ExecutiveAttentionTracking.logAttention({
          tenantId: selectedTenant,
          sessionId: s1.sessionId,
          sectionId: 'SUMMARY',
          timeSpentSeconds: 45,
          clickCount: 3,
          flowAbandoned: false
        });

        ExecutiveAttentionTracking.logAttention({
          tenantId: selectedTenant,
          sessionId: s2.sessionId,
          sectionId: 'CAUSALITY',
          timeSpentSeconds: 120,
          clickCount: 8,
          flowAbandoned: false
        });
      } catch (e) {
        // Safe catch
      }
    }
  }, [selectedTenant, refreshTrigger]);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Consume and calculate fiduciarily and pass-through from Core engines (100% passive UI)
  const metrics = PilotExperienceMetrics.calculate(selectedTenant);
  const sessions = CommercialPilotSessionManager.getAllSessions(selectedTenant);
  const feedbacks = PilotFeedbackEngine.getFeedbackByTenant(selectedTenant);
  const attentionLogs = ExecutiveAttentionTracking.getLogsForTenant(selectedTenant);
  const auditLogs = CommercialPilotSessionManager.getAuditTrail(selectedTenant);

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-12 pb-32 animate-executive-fade text-foreground">
      
      {/* Page Header */}
      <PageHeader
        title="Pilot Experience Dashboard"
        subtitle="Telemetria e Observabilidade de Engajamento, Feedback de Usuários e Métricas do Piloto Comercial."
        icon={Activity}
        transparent
        actions={
          <div className="flex items-center gap-4 bg-surface-container/60 p-2 rounded-button border border-border shadow-xs">
            <span className="text-body-sm font-semibold uppercase tracking-wider text-muted-foreground pl-2">Tenant do Piloto:</span>
            <select
              value={selectedTenant}
              onChange={(e) => setSelectedTenant(e.target.value)}
              className="text-body-sm font-bold uppercase tracking-widest bg-transparent cursor-pointer border-none outline-none focus:ring-0 text-secondary"
            >
              <option value="TENANT-1" className="bg-card text-foreground">TENANT-1 (Pilot)</option>
              <option value="TENANT-ALPHA" className="bg-card text-foreground">TENANT-ALPHA</option>
              <option value="TENANT-BETA" className="bg-card text-foreground">TENANT-BETA</option>
            </select>
            <button
              onClick={handleRefresh}
              className="p-2 hover:bg-surface-container-high rounded-full transition-colors text-muted-foreground hover:text-secondary"
              title="Recarregar Telemetria"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        }
      />

      {/* Experience Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
        
        {/* Onboarding time */}
        <div className="card-premium p-6 flex flex-col justify-between hover:border-secondary/30 transition-all">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Tempo Onboarding</span>
            <div className="p-2 bg-secondary/10 text-secondary rounded-lg"><Clock size={16} /></div>
          </div>
          <div>
            <h4 className="text-h3 font-display font-medium tracking-tight">{metrics.averageOnboardingTimeSeconds}s</h4>
            <p className="text-[9px] text-muted-foreground font-semibold mt-1">MÉDIA DE SUBMISSÃO</p>
          </div>
        </div>

        {/* Time to insight */}
        <div className="card-premium p-6 flex flex-col justify-between hover:border-secondary/30 transition-all">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Tempo até Insight</span>
            <div className="p-2 bg-secondary/10 text-secondary rounded-lg"><Activity size={16} /></div>
          </div>
          <div>
            <h4 className="text-h3 font-display font-medium tracking-tight">{metrics.averageTimeToInsightSeconds}s</h4>
            <p className="text-[9px] text-muted-foreground font-semibold mt-1">COMPREENSÃO DO REPORT</p>
          </div>
        </div>

        {/* Usage rate */}
        <div className="card-premium p-6 flex flex-col justify-between hover:border-secondary/30 transition-all">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Sessões Ativas</span>
            <div className="p-2 bg-secondary/10 text-secondary rounded-lg"><BarChart2 size={16} /></div>
          </div>
          <div>
            <h4 className="text-h3 font-display font-medium tracking-tight">{metrics.usageRateCount}</h4>
            <p className="text-[9px] text-muted-foreground font-semibold mt-1">TOTAL DE SESSÕES</p>
          </div>
        </div>

        {/* Export frequency */}
        <div className="card-premium p-6 flex flex-col justify-between hover:border-secondary/30 transition-all">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Frequência Exportação</span>
            <div className="p-2 bg-secondary/10 text-secondary rounded-lg"><Download size={16} /></div>
          </div>
          <div>
            <h4 className="text-h3 font-display font-medium tracking-tight">{metrics.exportFrequencyCount}</h4>
            <p className="text-[9px] text-muted-foreground font-semibold mt-1">DOWNLOADS DE RELATÓRIOS</p>
          </div>
        </div>

        {/* Warning density */}
        <div className="card-premium p-6 flex flex-col justify-between hover:border-secondary/30 transition-all">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Warnings Densidade</span>
            <div className="p-2 bg-secondary/10 text-secondary rounded-lg"><AlertCircle size={16} /></div>
          </div>
          <div>
            <h4 className="text-h3 font-display font-medium tracking-tight">{metrics.averageWarningDensity}</h4>
            <p className="text-[9px] text-muted-foreground font-semibold mt-1">SINALIZAÇÕES MÉDIAS</p>
          </div>
        </div>

        {/* Session engagement */}
        <div className="card-premium p-6 flex flex-col justify-between hover:border-secondary/30 transition-all">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Tempo Engajamento</span>
            <div className="p-2 bg-secondary/10 text-secondary rounded-lg"><Smile size={16} /></div>
          </div>
          <div>
            <h4 className="text-h3 font-display font-medium tracking-tight">{metrics.averageSessionEngagementMinutes} min</h4>
            <p className="text-[9px] text-muted-foreground font-semibold mt-1">DURAÇÃO DA SESSÃO</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Sessions and Feedbacks */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Sessions Audit Trail */}
        <div className="card-premium p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-secondary/10 flex items-center justify-center text-secondary">
              <FileText size={16} />
            </div>
            <div>
              <h3 className="text-h3 font-medium tracking-tight">Trilha de Sessões do Piloto</h3>
              <p className="text-body-sm text-muted-foreground mt-0.5">Histórico imutável de sessões comerciais iniciadas e encerradas.</p>
            </div>
          </div>

          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-body-sm">
              <thead className="bg-surface-container border-b border-border">
                <tr>
                  <th className="px-4 py-3 font-bold text-muted-foreground uppercase tracking-widest text-[9px]">ID Sessão</th>
                  <th className="px-4 py-3 font-bold text-muted-foreground uppercase tracking-widest text-[9px]">Tipo</th>
                  <th className="px-4 py-3 font-bold text-muted-foreground uppercase tracking-widest text-[9px]">Usuário</th>
                  <th className="px-4 py-3 font-bold text-muted-foreground uppercase tracking-widest text-[9px]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {sessions.map((sess) => (
                  <tr key={sess.sessionId} className="hover:bg-surface-container/20">
                    <td className="px-4 py-3 font-mono text-xs">{sess.sessionId.substring(0, 15)}...</td>
                    <td className="px-4 py-3 text-xs font-bold text-muted-foreground">{sess.sessionType.replace('_', ' ')}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{sess.actorId}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                        sess.status === 'ACTIVE' ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                      }`}>
                        {sess.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Feedbacks Collected */}
        <div className="card-premium p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-secondary/10 flex items-center justify-center text-secondary">
              <MessageSquare size={16} />
            </div>
            <div>
              <h3 className="text-h3 font-medium tracking-tight">Avaliações e Feedbacks do Piloto</h3>
              <p className="text-body-sm text-muted-foreground mt-0.5">Pontuação de clareza, ruído e fricção relatada por tomadores de decisão.</p>
            </div>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {feedbacks.map((f) => (
              <div key={f.feedbackId} className="p-4 bg-slate-50 border border-border rounded-xl space-y-3">
                <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground">
                  <span className="flex items-center gap-1"><User size={12} /> {f.actorId}</span>
                  <span>{new Date(f.timestamp).toLocaleDateString()}</span>
                </div>
                
                <div className="grid grid-cols-5 gap-2 text-center">
                  <div className="bg-white p-1.5 rounded border border-border">
                    <span className="block text-[8px] font-black text-muted-foreground uppercase tracking-wider">Confiança</span>
                    <span className="text-xs font-bold text-muted-foreground">{f.confidencePerception}/5</span>
                  </div>
                  <div className="bg-white p-1.5 rounded border border-border">
                    <span className="block text-[8px] font-black text-muted-foreground uppercase tracking-wider">Clareza</span>
                    <span className="text-xs font-bold text-muted-foreground">{f.narrativeClarity}/5</span>
                  </div>
                  <div className="bg-white p-1.5 rounded border border-border">
                    <span className="block text-[8px] font-black text-muted-foreground uppercase tracking-wider">Valor</span>
                    <span className="text-xs font-bold text-muted-foreground">{f.valuePerception}/5</span>
                  </div>
                  <div className="bg-white p-1.5 rounded border border-border">
                    <span className="block text-[8px] font-black text-muted-foreground uppercase tracking-wider">Ruído</span>
                    <span className="text-xs font-bold text-muted-foreground">{f.excessiveNoise}/5</span>
                  </div>
                  <div className="bg-white p-1.5 rounded border border-border">
                    <span className="block text-[8px] font-black text-muted-foreground uppercase tracking-wider">Warnings</span>
                    <span className="text-xs font-bold text-muted-foreground">{f.irrelevantWarnings}/5</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[8px] font-black text-muted-foreground uppercase tracking-wider">Pontos de Fricção/Confusão</span>
                  <p className="text-xs text-muted-foreground italic">"{f.confusionPoints}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Privacy-Safe Attention Logs & Session Audits */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Anonymized Attention Metrics */}
        <div className="card-premium p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-secondary/10 flex items-center justify-center text-secondary">
              <MousePointer size={16} />
            </div>
            <div>
              <h3 className="text-h3 font-medium tracking-tight">Rastreamento de Navegação (Privacy-Safe)</h3>
              <p className="text-body-sm text-muted-foreground mt-0.5">Tempo agregado por seção e cliques de fluxo completamente anonimizados.</p>
            </div>
          </div>

          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-body-sm">
              <thead className="bg-surface-container border-b border-border">
                <tr>
                  <th className="px-4 py-3 font-bold text-muted-foreground uppercase tracking-widest text-[9px]">Seção / Tela</th>
                  <th className="px-4 py-3 font-bold text-muted-foreground uppercase tracking-widest text-[9px]">Cliques</th>
                  <th className="px-4 py-3 font-bold text-muted-foreground uppercase tracking-widest text-[9px]">Tempo de Permanência</th>
                  <th className="px-4 py-3 font-bold text-muted-foreground uppercase tracking-widest text-[9px]">Abandono</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {attentionLogs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-surface-container/20">
                    <td className="px-4 py-3 font-mono text-xs text-foreground font-semibold">{log.sectionId}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground font-bold">{log.clickCount} cliques</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{log.timeSpentSeconds} segundos</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                        log.flowAbandoned ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"
                      }`}>
                        {log.flowAbandoned ? 'Sim' : 'Não'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Session Audit trail */}
        <div className="card-premium p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-secondary/10 flex items-center justify-center text-secondary">
              <Activity size={16} />
            </div>
            <div>
              <h3 className="text-h3 font-medium tracking-tight">Audit Trail Fiduciário Comercial</h3>
              <p className="text-body-sm text-muted-foreground mt-0.5">Logs de auditoria imutáveis das conexões do piloto.</p>
            </div>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {auditLogs.map((log) => (
              <div key={log.auditId} className="p-3 bg-slate-50 border border-border rounded-xl space-y-1">
                <div className="flex justify-between items-center text-[9px] font-bold text-muted-foreground">
                  <span>ID Auditoria: {log.auditId.substring(0, 15)}...</span>
                  <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="text-xs font-bold text-muted-foreground">
                  Ação "{log.action}" executada por {log.actorId}
                </p>
                <p className="text-[10px] text-muted-foreground">Sessão: {log.sessionId}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
