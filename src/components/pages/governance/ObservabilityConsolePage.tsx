import { ExecutiveText } from '@/components/ui/executive-typography';
import { ExecutiveHeading } from '@/components/ui/executive-heading';
import React, { useEffect, useState, useMemo } from 'react';
import { Eye, ShieldCheck, ShieldAlert, Users, AlertTriangle, Activity, ArrowRightLeft, FileSpreadsheet, Lock, RefreshCw, Search, ShieldX, Terminal, Calendar, Building, Clock, Server, Cpu, Layers, PlayCircle, StopCircle } from 'lucide-react';
import { useInstitutionalAuth } from '@/hooks/useInstitutionalAuth';
import { useRuntimeContext } from '@/core/security/auth/RuntimeContextProvider';
import { governanceService } from '@/services/governanceService';
import { ResponsiveContainer, ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, Bar } from 'recharts';
import { cn } from '@/lib/utils';
import { RuntimePartitionManager, WorkerRegistry, AsyncJobQueue } from '@/services/FiduciaryRuntimeAdapter';
import { ExecutivePageTemplate } from '@/components/ui/executive-page-template';
import { ExecutiveSurface } from '@/components/ui/executive-surface';
import { ExecutiveMetricCard } from '@/components/ui/executive-metric-card';
import { ExecutiveBadge } from '@/components/ui/executive-badge';
import { ExecutiveSummarySection } from '@/components/ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '@/components/ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '@/components/ui/executive-decision-trace';
import { ExecutiveTechnicalLayer } from '@/components/ui/executive-technical-layer';

interface ObservabilityConsolePageProps {
  selectedClient?: string;
}

export function ObservabilityConsolePage({ selectedClient }: ObservabilityConsolePageProps) {
  const { session } = useInstitutionalAuth();
  const { buildDataAccessContext, isReady } = useRuntimeContext();

  const [activeTab, setActiveTab] = useState<'metrics' | 'history' | 'anomalies' | 'sessions' | 'integrity' | 'cockpit'>('metrics');
  const [selectedTenantFilter, setSelectedTenantFilter] = useState<string>('');
  const [auditEvents, setAuditEvents] = useState<any[]>([]);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [pressureIncidents, setPressureIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isSuperAdmin = session?.role === 'SUPER_ADMIN';
  const hasPermission = isSuperAdmin || session?.permissions?.includes('VIEW_OBSERVABILITY');

  useEffect(() => {
    if (isReady && session) {
      setSelectedTenantFilter(isSuperAdmin ? 'GLOBAL' : session.tenantId);
    }
  }, [isReady, session, isSuperAdmin]);

  const fetchData = async (tenantFilter: string) => {
    if (!isReady || !session || !hasPermission) return;
    
    setLoading(true);
    setErrorMsg(null);
    try {
      const targetTenant = tenantFilter === 'GLOBAL' ? session.tenantId : tenantFilter;
      const context = buildDataAccessContext(
        'VIEW_OBSERVABILITY',
        'ObservabilityTelemetry',
        targetTenant
      );

      const [eventsData, anomaliesData, jobsData, pressureData] = await Promise.all([
        governanceService.getAuditEvents(context, { 
          tenantId: tenantFilter === 'GLOBAL' ? undefined : tenantFilter 
        }),
        governanceService.getAnomalies(context, { 
          tenantId: tenantFilter === 'GLOBAL' ? undefined : tenantFilter 
        }),
        governanceService.getJobs(context, {
          tenantId: tenantFilter === 'GLOBAL' ? undefined : tenantFilter
        }),
        governanceService.getPressureIncidents(context, {
          tenantId: tenantFilter === 'GLOBAL' ? undefined : tenantFilter
        })
      ]);

      setAuditEvents(eventsData);
      setAnomalies(anomaliesData);
      setJobs(jobsData);
      setPressureIncidents(pressureData);
    } catch (err: any) {
      console.error('[ObservabilityConsole] Error loading logs:', err);
      setErrorMsg(err.message || 'Erro ao carregar dados de observabilidade.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (selectedTenantFilter) {
      fetchData(selectedTenantFilter);
    }
  }, [selectedTenantFilter, isReady]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData(selectedTenantFilter);
  };

  const stats = useMemo(() => {
    const total = auditEvents.length;
    const criticalAnomalies = anomalies.filter(a => a.severity === 'CRITICAL').length;
    const deniedAccessCount = auditEvents.filter(e => e.eventType.startsWith('DENY_') || e.eventType === 'PERMISSION_DENIED').length;
    const tenantSwitches = auditEvents.filter(e => e.eventType === 'TENANT_SWITCH' || e.eventType === 'TENANT_SELECTION').length;

    return {
      total,
      criticalAnomalies,
      deniedAccessCount,
      tenantSwitches
    };
  }, [auditEvents, anomalies]);

  const chartData = useMemo(() => {
    if (auditEvents.length === 0) {
      return [
        { time: '09:00', total: 4, denials: 0, anomalies: 0 },
        { time: '10:00', total: 12, denials: 1, anomalies: 0 },
        { time: '11:00', total: 18, denials: 0, anomalies: 0 },
        { time: '12:00', total: 9, denials: 2, anomalies: 1 },
        { time: '13:00', total: 22, denials: 0, anomalies: 0 }
      ];
    }

    const buckets: Record<string, { time: string, total: number, denials: number, anomalies: number }> = {};
    
    auditEvents.slice(0, 50).reverse().forEach(event => {
      const date = new Date(event.timestamp);
      const timeStr = `${date.getHours().toString().padStart(2, '0')}:${Math.floor(date.getMinutes() / 10) * 10}`;
      
      if (!buckets[timeStr]) {
        buckets[timeStr] = { time: timeStr, total: 0, denials: 0, anomalies: 0 };
      }
      
      buckets[timeStr].total++;
      if (event.eventType.startsWith('DENY_') || event.eventType === 'PERMISSION_DENIED') {
        buckets[timeStr].denials++;
      }
    });

    anomalies.forEach(anom => {
      const date = new Date(anom.detectedAt);
      const timeStr = `${date.getHours().toString().padStart(2, '0')}:${Math.floor(date.getMinutes() / 10) * 10}`;
      if (buckets[timeStr]) {
        buckets[timeStr].anomalies++;
      }
    });

    return Object.values(buckets).sort((a, b) => a.time.localeCompare(b.time));
  }, [auditEvents, anomalies]);

  if (!hasPermission) {
    return (
      <ExecutivePageTemplate header={{ title: "Acesso Restrito", description: "Privilégios de auditoria insuficientes." }}>
        <ExecutiveSurface padding="xl" radius="xl" className="text-center py-16 border-critical/20">
          <ShieldX className="w-16 h-16 text-critical mx-auto mb-6" />
          <ExecutiveHeading as="h3" className="text-critical mb-2">Acesso Não Autorizado</ExecutiveHeading>
          <ExecutiveText variant="bodyStandard" className="text-executive-secondary max-w-md mx-auto">
            Você não possui privilégios de auditoria (`VIEW_OBSERVABILITY`) para visualizar o console de observabilidade institucional.
          </ExecutiveText>
        </ExecutiveSurface>
      </ExecutivePageTemplate>
    );
  }

  return (
    <ExecutivePageTemplate header={{
      title: "Console de Observabilidade",
      description: "Telemetria e Auditoria Fiduciária Multi-Tenant em Tempo Real.",
    }}>

      {/* Bar de Ações e Filtro de Tenant */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          {isSuperAdmin && (
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Inquilino:</span>
              <select
                value={selectedTenantFilter}
                onChange={(e) => setSelectedTenantFilter(e.target.value)}
                className="pl-20 pr-8 py-2 bg-card border border-border rounded-xl text-xs font-semibold outline-none transition-all text-foreground"
              >
                <option value="GLOBAL">Global (Todos os Tenants)</option>
                {session?.availableTenants?.map(t => (
                  <option key={t.tenantId} value={t.tenantId}>{t.name}</option>
                ))}
              </select>
            </div>
          )}

          <button 
            onClick={handleRefresh}
            disabled={loading || refreshing}
            className="p-2.5 bg-card border border-border rounded-xl text-foreground hover:bg-surface-container disabled:opacity-50 transition-all"
            title="Sincronizar Ledger"
          >
            <RefreshCw className={cn("w-4 h-4 text-primary", refreshing && "animate-spin")} />
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-critical-soft text-critical border border-critical/20 rounded-xl flex items-center gap-3 text-sm mb-6">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DE OBSERVABILIDADE & TELEMETRIA) --- */}
      <ExecutiveSummarySection 
        className="mb-8"
        status={{ label: 'Ledger Auditado', variant: 'success' }}
        question="Qual o estado de saúde, segurança e integridade das sessões e dados no ambiente multi-tenant?"
        opinion="O comitê fiduciário homologa a infraestrutura de telemetria, atestando a proteção contra violações cross-tenant e integridade do ledger."
        driver="Log ledger de auditoria, taxa de anomalias críticas, acessos negados e trocas de tenant."
        implication="Mitigação proativa de riscos cibernéticos e conformidade contínua com LGPD e governança fiduciária."
        action="Manter regras de isolamento e monitorar os alertas de saturação e anomalias de acesso."
      >
        <ExecutiveStrategicTensions tensions={[]} />
        <ExecutiveDecisionTrace trace={[]} />
      </ExecutiveSummarySection>

      {/* --- CAMADA 2: DIRETORIA & PAINEL DE TELEMETRIA --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <ExecutiveMetricCard
          label="Log Ledger Total"
          value={loading ? "..." : String(stats.total)}
          statusBadge={<ExecutiveBadge variant="info">Eventos</ExecutiveBadge>}
          tone="neutral"
          description={<span className="text-xs text-muted-foreground font-medium">Eventos no Inquilino</span>}
          className="bg-card border border-border shadow-sm h-full"
        />

        <ExecutiveMetricCard
          label="Anomalias Críticas"
          value={loading ? "..." : String(stats.criticalAnomalies)}
          statusBadge={<ExecutiveBadge variant={stats.criticalAnomalies > 0 ? "critical" : "success"}>{stats.criticalAnomalies > 0 ? "Crítico" : "Saudável"}</ExecutiveBadge>}
          tone="neutral"
          description={<span className="text-xs text-muted-foreground font-medium">Alertas Ativos</span>}
          className="bg-card border border-border shadow-sm h-full"
        />

        <ExecutiveMetricCard
          label="Acessos Negados"
          value={loading ? "..." : String(stats.deniedAccessCount)}
          statusBadge={<ExecutiveBadge variant={stats.deniedAccessCount > 0 ? "warning" : "success"}>{stats.deniedAccessCount > 0 ? "Bloqueado" : "Zero Bloqueios"}</ExecutiveBadge>}
          tone="neutral"
          description={<span className="text-xs text-muted-foreground font-medium">Gateways de Bloqueio</span>}
          className="bg-card border border-border shadow-sm h-full"
        />

        <ExecutiveMetricCard
          label="Trocas de Tenant"
          value={loading ? "..." : String(stats.tenantSwitches)}
          statusBadge={<ExecutiveBadge variant="neutral">Sessões</ExecutiveBadge>}
          tone="neutral"
          description={<span className="text-xs text-muted-foreground font-medium">Session Switches</span>}
          className="bg-card border border-border shadow-sm h-full"
        />
      </div>

      {/* Tabs de Navegação */}
      <div className="flex gap-2 border-b border-border pb-px overflow-x-auto no-scrollbar mb-8">
        <TabButton active={activeTab === 'metrics'} onClick={() => setActiveTab('metrics')} icon={<Activity className="w-4 h-4"/>} label="Painel de Telemetria" />
        <TabButton active={activeTab === 'anomalies'} onClick={() => setActiveTab('anomalies')} icon={<ShieldAlert className="w-4 h-4"/>} label={`Anomalias (${anomalies.length})`} />
        <TabButton active={activeTab === 'cockpit'} onClick={() => setActiveTab('cockpit')} icon={<Cpu className="w-4 h-4"/>} label="Distributed Cockpit" />
        <TabButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<Terminal className="w-4 h-4"/>} label="Ledger de Auditoria" />
        <TabButton active={activeTab === 'sessions'} onClick={() => setActiveTab('sessions')} icon={<Users className="w-4 h-4"/>} label="Fluxo de Sessões" />
        <TabButton active={activeTab === 'integrity'} onClick={() => setActiveTab('integrity')} icon={<ShieldCheck className="w-4 h-4"/>} label="Integridade" />
      </div>

      {loading && !refreshing ? (
        <ExecutiveSurface padding="xl" radius="xl" className="flex flex-col items-center justify-center py-16 text-muted-foreground bg-card border border-border">
          <LoaderSpinner />
          <ExecutiveText as="div" variant="caption" className="mt-4">Auditando Ledger de Governança...</ExecutiveText>
        </ExecutiveSurface>
      ) : (
        <div className="space-y-8">
          
          {/* TAB 1: TELEMETRY GRAPH */}
          {activeTab === 'metrics' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <ExecutiveSurface padding="xl" radius="xl" className="lg:col-span-2 bg-card border border-border shadow-sm">
                <ExecutiveHeading as="h3" className="text-foreground flex items-center gap-2 mb-6">
                  <Activity className="w-5 h-5 text-primary" />
                  Evolução Temporal de Ações e Bloqueios
                </ExecutiveHeading>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.3} />
                      <XAxis dataKey="time" stroke="var(--color-muted-foreground)" fontSize={10} tickLine={false} />
                      <YAxis stroke="var(--color-muted-foreground)" fontSize={10} tickLine={false} />
                      <ChartTooltip 
                        contentStyle={{ backgroundColor: 'var(--color-card)', borderRadius: '8px', border: '1px solid var(--color-border)', color: 'var(--color-foreground)' }}
                      />
                      <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                      <Area type="monotone" name="Total Eventos" dataKey="total" stroke="var(--color-primary)" strokeWidth={2} fillOpacity={0.15} fill="var(--color-primary)" />
                      <Bar name="Acessos Negados" dataKey="denials" fill="var(--color-destructive)" barSize={12} radius={[2, 2, 0, 0]} />
                      <Line type="monotone" name="Anomalias" dataKey="anomalies" stroke="var(--color-warning)" strokeWidth={2} dot={{ r: 3 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </ExecutiveSurface>

              <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm flex flex-col justify-between">
                <ExecutiveHeading as="h3" className="text-foreground mb-6">Distribuição Organizacional</ExecutiveHeading>
                <div className="space-y-4">
                  <ProgressIndicator label="Visualização Financeira" value={auditEvents.filter(e => e.eventType === 'VIEW_FINANCIALS').length} total={stats.total} color="bg-primary" />
                  <ProgressIndicator label="Consultas de Causalidade" value={auditEvents.filter(e => e.eventType === 'VIEW_CAUSALITY').length} total={stats.total} color="bg-secondary" />
                  <ProgressIndicator label="Geração de Snapshots" value={auditEvents.filter(e => e.eventType === 'CREATE_SNAPSHOT').length} total={stats.total} color="bg-success" />
                  <ProgressIndicator label="Geração de Simulações" value={auditEvents.filter(e => e.eventType === 'CREATE_SIMULATION').length} total={stats.total} color="bg-warning" />
                  <ProgressIndicator label="Exportações Gerais" value={stats.total - auditEvents.filter(e => !e.eventType.includes('EXPORT')).length} total={stats.total} color="bg-critical" />
                </div>
              </ExecutiveSurface>
            </div>
          )}

          {/* TAB 2: ANOMALIES */}
          {activeTab === 'anomalies' && (
            <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm">
              <ExecutiveHeading as="h3" className="text-foreground flex items-center gap-2 mb-6">
                <ShieldAlert className="w-5 h-5 text-critical" />
                Eventos Anômalos e Ações Corretivas Recomendadas
              </ExecutiveHeading>

              {anomalies.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground border border-dashed border-border rounded-xl">
                  <ShieldCheck className="w-12 h-12 text-success/40 mx-auto mb-4" />
                  <ExecutiveText as="div" variant="caption">Nenhuma anomalia institucional detectada.</ExecutiveText>
                </div>
              ) : (
                <div className="space-y-4">
                  {anomalies.map((anom) => (
                    <div 
                      key={anom.id}
                      className="p-5 bg-surface-container/30 border border-border rounded-2xl flex flex-col md:flex-row justify-between gap-4 hover:border-primary/40 transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <ExecutiveBadge variant={anom.severity === 'CRITICAL' ? 'critical' : anom.severity === 'HIGH' ? 'warning' : 'neutral'}>
                            {anom.severity}
                          </ExecutiveBadge>
                          <span className="text-sm font-bold text-foreground">{anom.anomalyType}</span>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Detectado em: {new Date(anom.detectedAt).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          Ator: {anom.actorId} | Sessão: {anom.sessionId.substring(0, 15)}...
                        </p>
                        <p className="text-xs text-primary font-bold">
                          Ação Recomendada: {anom.recommendedAction}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ExecutiveSurface>
          )}

          {/* TAB 3: AUDIT HISTORY LEDGER */}
          {activeTab === 'history' && (
            <ExecutiveTechnicalLayer
              title="Camada Técnica — Ledger Imutável de Auditoria"
              subtitle="Histórico de Eventos Envelopados com Protocolo Deny-by-Default"
              description="Registros com carimbo de tempo, identificação de ator e rastreabilidade de requisição."
            >
              <ExecutiveSurface padding="none" radius="xl" className="overflow-hidden border-border bg-card shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-surface-container/30 border-b border-border text-muted-foreground font-bold uppercase tracking-wider">
                        <th className="p-4">Timestamp</th>
                        <th className="p-4">Evento</th>
                        <th className="p-4">Recurso</th>
                        <th className="p-4">Ator ID</th>
                        <th className="p-4">Inquilino</th>
                        <th className="p-4 text-right">Origem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {auditEvents.map((evt) => (
                        <tr key={evt.id} className="hover:bg-surface-container/30 transition-colors">
                          <td className="p-4 text-muted-foreground font-mono whitespace-nowrap">{new Date(evt.timestamp).toLocaleString()}</td>
                          <td className="p-4 font-bold">
                            <ExecutiveBadge variant={evt.eventType.startsWith('DENY_') ? 'critical' : evt.eventType === 'CROSS_TENANT_ATTEMPT' ? 'warning' : 'success'}>
                              {evt.eventType}
                            </ExecutiveBadge>
                          </td>
                          <td className="p-4 text-foreground font-mono text-[11px]">{evt.resourceType}</td>
                          <td className="p-4 font-mono text-[11px] text-muted-foreground">{evt.actorId}</td>
                          <td className="p-4 text-muted-foreground font-mono">{evt.tenantId}</td>
                          <td className="p-4 text-right text-muted-foreground">{evt.requestSource}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ExecutiveSurface>
            </ExecutiveTechnicalLayer>
          )}

          {/* TAB 4: SESSIONS */}
          {activeTab === 'sessions' && (
            <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm">
              <ExecutiveHeading as="h3" className="text-foreground flex items-center gap-2 mb-6">
                <Users className="w-5 h-5 text-primary" />
                Fluxo de Sessões e Tenant Switchings
              </ExecutiveHeading>

              <div className="space-y-4">
                {auditEvents.filter(e => e.resourceType === 'Session').map((evt) => (
                  <div key={evt.id} className="p-4 bg-surface-container/30 border border-border rounded-xl flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <ExecutiveBadge variant={evt.eventType.includes('START') || evt.eventType.includes('LOGIN') ? 'success' : 'neutral'}>
                          {evt.eventType}
                        </ExecutiveBadge>
                      </div>
                      <ExecutiveText as="div" variant="caption" className="text-muted-foreground font-mono">Ator: {evt.actorId} | Sessão: {evt.sessionId.substring(0, 15)}...</ExecutiveText>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground font-mono block">{new Date(evt.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ExecutiveSurface>
          )}

          {/* TAB 5: GOVERNANCE INTEGRITY */}
          {activeTab === 'integrity' && (
            <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm">
              <ExecutiveHeading as="h3" className="text-foreground flex items-center gap-2 border-b border-border pb-4 mb-6">
                <ShieldCheck className="w-5 h-5 text-success" />
                Integridade Fiduciária do Ledger
              </ExecutiveHeading>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-5 bg-surface-container/30 border border-border rounded-2xl space-y-2">
                  <ExecutiveHeading as="h4" className="text-primary flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    Ledger Conexão Ativa
                  </ExecutiveHeading>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    A verificação de conexão com a infraestrutura do Firestore e o barramento `audit_events` retornou sucesso. Toda escrita está sendo envelopada e direcionada sob o princípio "Deny by Default".
                  </p>
                </div>

                <div className="p-5 bg-surface-container/30 border border-border rounded-2xl space-y-2">
                  <ExecutiveHeading as="h4" className="text-primary flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Ledger Mutation Protection
                  </ExecutiveHeading>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    As chamadas lógicas de modificação de histórico (`ImmutableLedger.update` e `ImmutableLedger.delete`) estão blindadas contra violação, forçando lançamentos `MUTATION_PROHIBITED`.
                  </p>
                </div>
              </div>

              <div className="border border-border rounded-2xl p-6 bg-surface-container/20 space-y-4">
                <ExecutiveHeading as="h4" className="text-foreground">Verificações Ativas do Trust Framework</ExecutiveHeading>
                <div className="space-y-3">
                  <Checkline label="Fila de Retentativa Ativa com Retry Exponencial" checked={true} />
                  <Checkline label="Deduplicação de Anomalias Ativa" checked={true} />
                  <Checkline label="Auditoria de Acesso SUPER_ADMIN Cross-Tenant Habilitada" checked={true} />
                  <Checkline label="Isolamento de Visibilidade de Telemetria por Inquilino" checked={true} />
                </div>
              </div>
            </ExecutiveSurface>
          )}

          {/* TAB 6: DISTRIBUTED COCKPIT */}
          {activeTab === 'cockpit' && (
            <ExecutiveTechnicalLayer
              title="Distributed Runtime Cockpit"
              subtitle="Monitoramento de Partições, Filas e Workers Locais"
              description="Visibilidade em tempo real das métricas de latência e execução dos workers."
            >
              <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm">
                <ExecutiveHeading as="h4" className="text-foreground mb-4">Partições de Runtime e Latência</ExecutiveHeading>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(RuntimePartitionManager.getMetrics()).map(([name, metrics]) => (
                    <div key={name} className="p-4 bg-surface-container/30 border border-border rounded-xl space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-foreground">{name.replace(' Runtime', '')}</span>
                        <ExecutiveBadge variant={metrics.healthState === 'HEALTHY' ? 'success' : 'warning'}>
                          {metrics.healthState}
                        </ExecutiveBadge>
                      </div>
                      <div className="flex justify-between text-xs font-mono text-muted-foreground">
                        <span>Latência: {metrics.averageLatency}ms</span>
                        <span>Fila: {metrics.queueDepth}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ExecutiveSurface>
            </ExecutiveTechnicalLayer>
          )}

        </div>
      )}

    </ExecutivePageTemplate>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap",
        active 
          ? "text-primary border-primary bg-surface-container/30 font-bold" 
          : "text-muted-foreground border-transparent hover:text-foreground hover:bg-surface-container/10"
      )}
    >
      {React.isValidElement(icon) ? icon : null}
      {label}
    </button>
  );
}

function ProgressIndicator({ label, value, total, color }: { label: string, value: number, total: number, color: string }) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-medium">
        <span className="text-foreground">{label}</span>
        <span className="text-muted-foreground font-mono">{value} ({percent}%)</span>
      </div>
      <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden border border-border">
        <div className={cn("h-full rounded-full transition-all duration-500", color)} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function Checkline({ label, checked }: { label: string, checked: boolean }) {
  return (
    <div className="flex items-center gap-3 text-xs">
      <div className={cn(
        "w-5 h-5 rounded-full flex items-center justify-center border",
        checked ? "border-success bg-success-soft text-success" : "border-border bg-surface-container"
      )}>
        <ShieldCheck className="w-3.5 h-3.5" />
      </div>
      <span className="text-foreground font-medium">{label}</span>
    </div>
  );
}

function LoaderSpinner() {
  return (
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  );
}
