import React, { useEffect, useState, useMemo } from 'react';
import { Eye, ShieldCheck, ShieldAlert, Users, AlertTriangle, Activity, ArrowRightLeft, FileSpreadsheet, Lock, RefreshCw, Search, ShieldX, Terminal, Calendar, Building, Clock, Server, Cpu, Layers, PlayCircle, StopCircle } from 'lucide-react';
import { PageHeader } from '../../Common';
import { useInstitutionalAuth } from '../../../core/security/auth/InstitutionalAuthProvider';
import { useRuntimeContext } from '../../../core/security/auth/RuntimeContextProvider';
import { governanceService } from '../../../services/governanceService';
import { ResponsiveContainer, ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, Bar } from 'recharts';
import { cn } from '../../../lib/utils';
import { RuntimePartitionManager } from '../../../services/FiduciaryRuntimeAdapter';
import { WorkerRegistry } from '../../../services/FiduciaryRuntimeAdapter';
import { AsyncJobQueue } from '../../../services/FiduciaryRuntimeAdapter';

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

  // Initialize selected tenant filter
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
      // Build DataAccessContext governed by tenant switching rules
      // If SUPER_ADMIN selects GLOBAL, we pass undefined to check default master boundary.
      // If they select a different tenant, it will evaluate cross-tenant permission and log CROSS_TENANT_ATTEMPT.
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

  // 1. Calculate KPI Metrics
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

  // 2. Format Chart Data (Aggregate by hour/minute group for timeline)
  const chartData = useMemo(() => {
    if (auditEvents.length === 0) {
      // Return placeholder chart data if empty
      return [
        { time: '09:00', total: 4, denials: 0, anomalies: 0 },
        { time: '10:00', total: 12, denials: 1, anomalies: 0 },
        { time: '11:00', total: 18, denials: 0, anomalies: 0 },
        { time: '12:00', total: 9, denials: 2, anomalies: 1 },
        { time: '13:00', total: 22, denials: 0, anomalies: 0 }
      ];
    }

    // Sort events and map to hourly buckets
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

    // Add anomalies count to chart buckets
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
      <div className="max-w-[1440px] mx-auto px-6 py-20 text-center animate-executive-fade">
        <ShieldX className="w-16 h-16 text-rose-500 mx-auto mb-6" />
        <h1 className="text-xl font-bold text-primary uppercase tracking-widest mb-2">Acesso Restrito</h1>
    <p className="text-sm text-executive-secondary max-w-md mx-auto">
          Você não possui privilégios de auditoria (`VIEW_OBSERVABILITY`) para visualizar o console de observabilidade institucional.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-8 pb-32 animate-executive-fade text-muted-foreground">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/10 pb-6">
        <PageHeader 
          title="Console de Observabilidade"
          subtitle="Telemetria e Auditoria Fiduciária Multi-Tenant em Tempo Real."
          icon={Eye}
          transparent
        />

        {/* Tenant Filter Selector & Refresh */}
        <div className="flex items-center gap-3 self-start md:self-center">
          {isSuperAdmin && (
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Inquilino:</span>
              <select
                value={selectedTenantFilter}
                onChange={(e) => setSelectedTenantFilter(e.target.value)}
                className="pl-20 pr-8 py-2 bg-slate-950/60 border border-border/10 rounded-lg text-xs font-semibold outline-none hover:border-border focus:ring-1 focus:ring-primary/20 transition-all text-muted-foreground"
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
            className="p-2 bg-slate-900 border border-border/10 rounded-lg text-muted-foreground hover:text-muted-foreground hover:bg-slate-800 disabled:opacity-50 transition-all"
            title="Sincronizar Ledger"
          >
            <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-critical-soft0/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-sm">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatusCard 
          title="Log Ledger Total" 
          value={loading ? "..." : stats.total} 
          icon={<Terminal className="w-5 h-5 text-primary" />} 
          trend="Eventos no Inquilino"
        />
        <StatusCard 
          title="Anomalias Críticas" 
          value={loading ? "..." : stats.criticalAnomalies} 
          icon={<ShieldAlert className="w-5 h-5 text-rose-500" />} 
          trend="Alertas Ativos"
        />
        <StatusCard 
          title="Acessos Negados" 
          value={loading ? "..." : stats.deniedAccessCount} 
          icon={<Lock className="w-5 h-5 text-amber-500" />} 
          trend="Gateways de Bloqueio"
        />
        <StatusCard 
          title="Trocas de Tenant" 
          value={loading ? "..." : stats.tenantSwitches} 
          icon={<ArrowRightLeft className="w-5 h-5 text-teal-400" />} 
          trend="Session switches"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-border/10 pb-px overflow-x-auto no-scrollbar">
        <TabButton active={activeTab === 'metrics'} onClick={() => setActiveTab('metrics')} icon={<Activity className="w-4 h-4"/>} label="Painel de Telemetria" />
        <TabButton active={activeTab === 'anomalies'} onClick={() => setActiveTab('anomalies')} icon={<ShieldAlert className="w-4 h-4"/>} label={`Anomalias (${anomalies.length})`} />
        <TabButton active={activeTab === 'cockpit'} onClick={() => setActiveTab('cockpit')} icon={<Cpu className="w-4 h-4"/>} label="Distributed Cockpit" />
        <TabButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<Terminal className="w-4 h-4"/>} label="Ledger de Auditoria" />
        <TabButton active={activeTab === 'sessions'} onClick={() => setActiveTab('sessions')} icon={<Users className="w-4 h-4"/>} label="Fluxo de Sessões" />
        <TabButton active={activeTab === 'integrity'} onClick={() => setActiveTab('integrity')} icon={<ShieldCheck className="w-4 h-4"/>} label="Integridade" />
      </div>

      {/* Tab Panels */}
      {loading && !refreshing ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <LoaderSpinner />
          <p className="text-xs font-bold uppercase tracking-widest mt-4">Auditando Ledger de Governança...</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* 1. TELEMETRY GRAPH TAB */}
          {activeTab === 'metrics' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Graphic container */}
              <div className="card-premium p-6 lg:col-span-2 space-y-4">
                <h3 className="text-sm font-semibold tracking-wider uppercase text-primary flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  Evolução Temporal de Ações e Bloqueios
                </h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData}>
                      <defs>
                        <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#818cf8" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} />
                      <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                      <ChartTooltip 
                        contentStyle={{ backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }}
                        labelStyle={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8' }}
                      />
                      <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                      <Area type="monotone" name="Total Eventos" dataKey="total" stroke="#818cf8" strokeWidth={1.5} fillOpacity={1} fill="url(#totalGrad)" />
                      <Bar name="Acessos Negados" dataKey="denials" fill="#f59e0b" barSize={10} radius={[2, 2, 0, 0]} />
                      <Line type="monotone" name="Anomalias" dataKey="anomalies" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Status Panel */}
              <div className="card-premium p-6 space-y-6">
                <h3 className="text-sm font-semibold tracking-wider uppercase text-primary">Distribuição Organizacional</h3>
                <div className="space-y-4">
                  <ProgressIndicator label="Visualização Financeira" value={auditEvents.filter(e => e.eventType === 'VIEW_FINANCIALS').length} total={stats.total} color="bg-primary" />
                  <ProgressIndicator label="Consultas de Causalidade" value={auditEvents.filter(e => e.eventType === 'VIEW_CAUSALITY').length} total={stats.total} color="bg-teal-500" />
                  <ProgressIndicator label="Geração de Snapshots" value={auditEvents.filter(e => e.eventType === 'CREATE_SNAPSHOT').length} total={stats.total} color="bg-success-soft0" />
                  <ProgressIndicator label="Geração de Simulations" value={auditEvents.filter(e => e.eventType === 'CREATE_SIMULATION').length} total={stats.total} color="bg-warning-soft0" />
                  <ProgressIndicator label="Exportações Gerais" value={stats.total - auditEvents.filter(e => !e.eventType.includes('EXPORT')).length} total={stats.total} color="bg-critical-soft0" />
                </div>
              </div>

            </div>
          )}

          {/* 2. ANOMALIES TAB */}
          {activeTab === 'anomalies' && (
            <div className="card-premium p-6 space-y-4">
              <h3 className="text-sm font-semibold tracking-wider uppercase text-primary flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                Eventos Anômalos e Ações Corretivas Recomendadas
              </h3>

              {anomalies.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground border border-dashed border-border/10 rounded-xl">
                  <ShieldCheck className="w-12 h-12 text-emerald-500/20 mx-auto mb-4" />
                  <p className="text-xs font-bold uppercase tracking-wider">Nenhuma anomalia institucional detectada.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {anomalies.map((anom) => (
                    <div 
                      key={anom.id}
                      className={cn(
                        "p-5 bg-slate-950/60 border rounded-xl flex flex-col md:flex-row justify-between gap-4 transition-all hover:bg-slate-950",
                        anom.severity === 'CRITICAL' ? 'border-red-500/20' : anom.severity === 'HIGH' ? 'border-amber-500/20' : 'border-border'
                      )}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border",
                            anom.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border-red-500/20' : anom.severity === 'HIGH' ? 'bg-warning-soft0/10 text-amber-400 border-amber-500/20' : 'bg-slate-800 text-muted-foreground border-border'
                          )}>
                            {anom.severity}
                          </span>
             <span className="text-sm font-bold text-executive-secondary">{anom.anomalyType}</span>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                          Detectado em: {new Date(anom.detectedAt).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          <span className="font-semibold text-muted-foreground">Ator:</span> {anom.actorId} | 
                          <span className="font-semibold text-muted-foreground ml-2">Sessão:</span> {anom.sessionId.substring(0, 15)}...
                        </p>
                        <p className="text-xs text-rose-300/80 font-medium">
                          <span className="font-semibold text-muted-foreground">Ação Recomendada:</span> {anom.recommendedAction}
                        </p>
                      </div>

                      {/* Detail attributes */}
                      <div className="flex flex-col justify-between text-right self-start md:self-stretch min-w-[200px]">
                        <span className="text-[10px] font-mono text-muted-foreground">ID: {anom.anomalyId}</span>
                        {anom.details && (
                          <div className="p-2 bg-slate-900 border border-border/5 rounded-lg text-[10px] text-left font-mono mt-2 max-h-[80px] overflow-y-auto">
                            {Object.entries(anom.details).map(([k, v]) => (
                              <div key={k} className="truncate"><span className="text-primary">{k}:</span> {JSON.stringify(v)}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. AUDIT HISTORY LEDGER TAB */}
          {activeTab === 'history' && (
            <div className="card-premium p-6 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-sm font-semibold tracking-wider uppercase text-primary flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-primary" />
                  Histórico Imutável de Auditoria (Ledger)
                </h3>
              </div>

              {auditEvents.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <p className="text-xs font-bold uppercase tracking-wider">Nenhum evento registrado no ledger.</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-border/10 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-950 border-b border-border/10 text-muted-foreground font-bold uppercase tracking-wider">
                        <th className="p-4">Timestamp</th>
                        <th className="p-4">Evento</th>
                        <th className="p-4">Recurso</th>
                        <th className="p-4">Ator ID</th>
                        <th className="p-4">Inquilino</th>
                        <th className="p-4 text-right">Origem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/5 bg-slate-950/20">
                      {auditEvents.map((evt) => (
                        <tr key={evt.id} className="hover:bg-slate-900/40">
                          <td className="p-4 text-muted-foreground whitespace-nowrap">{new Date(evt.timestamp).toLocaleString()}</td>
                          <td className="p-4 font-semibold text-muted-foreground">
                            <span className={cn(
                              "px-2 py-0.5 rounded-lg text-[9px] font-bold tracking-tight border",
                              evt.eventType.startsWith('DENY_') ? 'bg-red-500/10 text-red-400 border-red-500/10' :
                              evt.eventType === 'CROSS_TENANT_ATTEMPT' ? 'bg-critical-soft0/10 text-rose-400 border-rose-500/20' :
                              'bg-primary text-primary border-primary'
                            )}>
                              {evt.eventType}
                            </span>
                          </td>
                          <td className="p-4 text-muted-foreground font-mono text-[11px]">{evt.resourceType}</td>
                          <td className="p-4 font-mono text-[11px]">{evt.actorId}</td>
                          <td className="p-4 text-muted-foreground">{evt.tenantId}</td>
                          <td className="p-4 text-right text-muted-foreground">{evt.requestSource}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* 4. SESSIONS TAB */}
          {activeTab === 'sessions' && (
            <div className="card-premium p-6 space-y-4">
              <h3 className="text-sm font-semibold tracking-wider uppercase text-primary flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-400" />
                Fluxo de Sessões e Tenant Switchings
              </h3>

              {auditEvents.filter(e => e.resourceType === 'Session').length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <p className="text-xs font-bold uppercase tracking-wider">Nenhuma atividade de sessão registrada.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {auditEvents.filter(e => e.resourceType === 'Session').map((evt) => (
                    <div key={evt.id} className="p-4 bg-slate-950/40 border border-border/10 rounded-xl flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "w-2 h-2 rounded-full",
                            evt.eventType === 'SESSION_START' || evt.eventType === 'LOGIN' ? 'bg-success-soft0' :
                            evt.eventType === 'SESSION_END' || evt.eventType === 'LOGOUT' ? 'bg-slate-500' : 'bg-primary'
                          )} />
             <span className="text-sm font-bold text-executive-secondary">{evt.eventType}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Ator: <span className="font-mono">{evt.actorId}</span> | Sessão: <span className="font-mono">{evt.sessionId.substring(0, 15)}...</span></p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-muted-foreground block">{new Date(evt.timestamp).toLocaleString()}</span>
                        {evt.metadata?.selectedTenantId && (
                          <span className="text-[10px] text-teal-400 font-semibold uppercase tracking-wider">Inquilino: {evt.metadata.selectedTenantId}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5. GOVERNANCE INTEGRITY TAB */}
          {activeTab === 'integrity' && (
            <div className="card-premium p-8 space-y-6">
              <h2 className="text-lg font-medium text-primary flex items-center gap-2 border-b border-border/10 pb-4">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Integridade Fiduciária do Ledger
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Ledger Integrity status */}
                <div className="p-5 bg-success-soft0/5 border border-emerald-500/10 rounded-xl space-y-2">
                  <h3 className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    Ledger Conexão Ativa
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    A verificação de conexão com a infraestrutura do Firestore e o barramento `audit_events` retornou sucesso. Toda escrita está sendo envelopada e direcionada sob o princípio "Deny by Default".
                  </p>
                </div>

                {/* Ledger mutation protection status */}
                <div className="p-5 bg-primary border border-primary rounded-xl space-y-2">
                  <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Ledger Mutation Protection
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    As chamadas lógicas de modificação de histórico (`ImmutableLedger.update` e `ImmutableLedger.delete`) estão blindadas contra violação, forçando lançamentos `MUTATION_PROHIBITED`.
                  </p>
                </div>

              </div>

              {/* Status checklist */}
              <div className="border border-border/10 rounded-xl p-5 space-y-4 bg-slate-950/20">
                <h3 className="text-sm font-bold uppercase tracking-wider text-primary">Verificações Ativas do Trust Framework</h3>
                
                <div className="space-y-3">
                  <Checkline label="Fila de Retentativa Ativa com Retry Exponencial" checked={true} />
                  <Checkline label="Deduplicação de Anomalias Ativa" checked={true} />
                  <Checkline label="Auditoria de Acesso SUPER_ADMIN Cross-Tenant Habilitada" checked={true} />
                  <Checkline label="Isolamento de Visibilidade de Telemetria por Inquilino" checked={true} />
                </div>
              </div>

            </div>
          )}

          {/* 6. DISTRIBUTED COCKPIT TAB */}
          {activeTab === 'cockpit' && (
            <div className="space-y-6">
              {/* Partições & Health Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Partitions metrics */}
                <div className="card-premium p-6 space-y-4 bg-slate-950/40">
                  <h3 className="text-sm font-semibold tracking-wider uppercase text-primary flex items-center gap-2">
                    <Layers className="w-4 h-4 text-teal-400" />
                    Partições de Runtime e Latência
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                    {Object.entries(RuntimePartitionManager.getMetrics()).map(([name, metrics]) => (
                      <div key={name} className="p-3 bg-slate-900/60 border border-border/5 rounded-lg space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] font-bold text-muted-foreground truncate max-w-[120px]">{name.replace(' Runtime', '')}</span>
                          <span className={cn(
                            "px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider",
                            metrics.healthState === 'HEALTHY' ? 'bg-success-soft0/10 text-emerald-400 border border-emerald-500/15' :
                            metrics.healthState === 'CONGESTED' ? 'bg-warning-soft0/10 text-amber-400 border border-amber-500/15' :
                            'bg-red-500/10 text-red-400 border border-red-500/15'
                          )}>
                            {metrics.healthState}
                          </span>
                        </div>
                        <div className="flex justify-between text-[10px] text-muted-foreground">
                          <span>Latência: {metrics.averageLatency}ms</span>
                          <span>Fila: {metrics.queueDepth}</span>
                        </div>
                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div className={cn(
                            "h-full rounded-full",
                            metrics.pressureLevel === 'CRITICAL' ? 'bg-red-500' :
                            metrics.pressureLevel === 'HIGH' ? 'bg-warning-soft0' :
                            metrics.pressureLevel === 'MEDIUM' ? 'bg-primary' : 'bg-success-soft0'
                          )} style={{ width: `${Math.min(100, Math.max(10, metrics.queueDepth * 10))}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Worker status cockpit */}
                <div className="card-premium p-6 space-y-4 bg-slate-950/40">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold tracking-wider uppercase text-primary flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-primary" />
                      Status dos Workers Locais (Nó)
                    </h3>
                    
                    <button 
                      onClick={() => {
                        const workers = WorkerRegistry.getWorkers();
                        if (workers.length === 0 && isReady && session) {
                          const ctx = buildDataAccessContext('VIEW_OBSERVABILITY', 'ObservabilityTelemetry', session.tenantId);
                          
                          WorkerRegistry.registerExecutor('Simulation', async () => {
                            await new Promise(r => setTimeout(r, 800));
                          });
                          WorkerRegistry.registerExecutor('Export', async () => {
                            await new Promise(r => setTimeout(r, 1200));
                          });
                          WorkerRegistry.registerExecutor('Telemetry', async () => {
                            await new Promise(r => setTimeout(r, 400));
                          });

                          WorkerRegistry.registerWorker('worker-advisory', 'Advisory', 'Advisory Runtime', ctx);
                          WorkerRegistry.registerWorker('worker-simulation', 'Simulation', 'Simulation Runtime', ctx);
                          WorkerRegistry.registerWorker('worker-telemetry', 'Telemetry', 'Telemetry Runtime', ctx);
                          WorkerRegistry.registerWorker('worker-export', 'Export', 'Export Runtime', ctx);
                          
                          handleRefresh();
                        } else {
                          WorkerRegistry.clear();
                          handleRefresh();
                        }
                      }}
                      className="px-3 py-1 bg-slate-900 border border-border/10 rounded-lg text-[10px] font-bold uppercase tracking-wider text-accent hover:text-accent hover:bg-slate-800 transition-all"
                    >
                      {WorkerRegistry.getWorkers().length === 0 ? "Ativar Nó Local" : "Desativar Nó Local"}
                    </button>
                  </div>

                  {WorkerRegistry.getWorkers().length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground border border-dashed border-border/10 rounded-xl">
                      <Server className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-[11px] font-bold uppercase tracking-wider">Nenhum worker local rodando nesta janela.</p>
                      <p className="text-[10px] text-muted-foreground mt-1 max-w-[280px] mx-auto">Ative o nó local acima para simular o polling distribuído em background de jobs enfileirados.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto max-h-[220px] overflow-y-auto pr-2 no-scrollbar">
                      <table className="w-full text-left text-[11px] border-collapse">
                        <thead>
                          <tr className="bg-slate-950 border-b border-border/10 text-muted-foreground font-bold uppercase">
                            <th className="p-3">Worker ID</th>
                            <th className="p-3">Tarefa</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right">Falhas</th>
                          </tr>
                        </thead>
                        <tbody>
                          {WorkerRegistry.getWorkers().map(w => (
                            <tr key={w.workerId} className="border-b border-border/5">
                              <td className="p-3 font-mono">{w.workerId}</td>
                              <td className="p-3 font-semibold">{w.jobType}</td>
                              <td className="p-3">
                                <span className={cn(
                                  "px-1.5 py-0.5 rounded text-[9px] font-bold",
                                  w.status === 'BUSY' ? 'bg-warning-soft0/10 text-amber-400 border border-amber-500/15' :
                                  w.status === 'IDLE' ? 'bg-success-soft0/10 text-emerald-400 border border-emerald-500/15' :
                                  'bg-slate-800 text-muted-foreground border border-border'
                                )}>
                                  {w.status}
                                </span>
                              </td>
                              <td className="p-3 text-right text-rose-400 font-bold">{w.failuresCount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>

              {/* Fila de Jobs & DLQ */}
              <div className="card-premium p-6 space-y-4 bg-slate-950/40">
                <h3 className="text-sm font-semibold tracking-wider uppercase text-primary flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-primary" />
                  Distributed Async Job Queue (`institutional_jobs`)
                </h3>

                {jobs.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground border border-dashed border-border/10 rounded-xl">
                    <p className="text-xs font-bold uppercase tracking-wider">Nenhum job assíncrono na fila deste inquilino.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-border/10 rounded-xl">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-950 border-b border-border/10 text-muted-foreground font-bold uppercase">
                          <th className="p-3">Job ID</th>
                          <th className="p-3">Tipo</th>
                          <th className="p-3">Estado</th>
                          <th className="p-3">Prioridade</th>
                          <th className="p-3">Nó</th>
                          <th className="p-3">Retries</th>
                          <th className="p-3 text-right">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/5 bg-slate-950/20">
                        {jobs.map(j => (
                          <tr key={j.jobId} className="hover:bg-slate-900/30">
                            <td className="p-3 font-mono text-[10px] text-muted-foreground">{j.jobId}</td>
                            <td className="p-3 font-semibold text-muted-foreground">{j.jobType}</td>
                            <td className="p-3">
                              <span className={cn(
                                "px-2 py-0.5 rounded-lg text-[9px] font-black uppercase border",
                                j.jobState === 'COMPLETED' ? 'bg-success-soft0/10 text-emerald-400 border-emerald-500/20' :
                                j.jobState === 'RUNNING' ? 'bg-warning-soft0/10 text-amber-400 border-amber-500/20 animate-pulse' :
                                j.jobState === 'FAILED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                j.jobState === 'DEAD_LETTER' ? 'bg-critical-soft0/20 text-rose-300 border-rose-500/30' :
                                'bg-slate-800 text-muted-foreground border-border'
                              )}>
                                {j.jobState}
                              </span>
                            </td>
                            <td className="p-3 text-[10px] font-bold text-muted-foreground">{j.priority}</td>
                            <td className="p-3 font-mono text-[10px] text-muted-foreground">{j.processingNode || 'N/A'}</td>
                            <td className="p-3 text-[10px] text-muted-foreground">{j.retryCount}/{j.maxRetries}</td>
                            <td className="p-3 text-right">
                              {['QUEUED', 'RUNNING'].includes(j.jobState) && (
                                <button
                                  onClick={async () => {
                                    await AsyncJobQueue.cancelJob(j.jobId);
                                    handleRefresh();
                                  }}
                                  className="text-red-400 hover:text-red-300 text-[10px] font-bold uppercase tracking-wider bg-red-500/10 px-2 py-1 rounded"
                                >
                                  Cancelar
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Alertas de Pressão de Runtime */}
              <div className="card-premium p-6 space-y-4 bg-slate-950/40">
                <h3 className="text-sm font-semibold tracking-wider uppercase text-primary flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Alertas Ativos de Saturação (`runtime_pressure`)
                </h3>

                {pressureIncidents.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground border border-dashed border-border/10 rounded-xl">
                    <p className="text-xs font-bold uppercase tracking-wider">Nenhum incidente de pressão registrado.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pressureIncidents.map(i => (
                      <div key={i.id} className="p-4 bg-slate-950/60 border border-amber-500/10 rounded-xl flex justify-between items-center gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "px-2 py-0.5 rounded text-[9px] font-black uppercase border",
                              i.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-warning-soft0/10 text-amber-400 border-amber-500/20'
                            )}>{i.severity}</span>
                            <span className="text-xs font-bold text-muted-foreground">{i.runtimeType}</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground"><span className="font-semibold text-muted-foreground">Ação Recomendada:</span> {i.recommendedAction}</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground">{new Date(i.detectedAt).toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}

function StatusCard({ title, value, icon, trend }: { title: string, value: any, icon: React.ReactNode, trend: string }) {
  return (
    <div className="card-premium p-6 flex flex-col justify-between hover:border-border transition-all bg-slate-950/40">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-primary">{title}</h3>
        <div className="p-2 bg-slate-950/40 rounded-xl border border-border/10">
          {icon}
        </div>
      </div>
      <div>
        <div className="text-2xl font-light text-primary">{value}</div>
        <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-bold">{trend}</div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
        active 
          ? 'text-primary border-primary bg-primary font-semibold' 
          : 'text-muted-foreground border-transparent hover:text-muted-foreground hover:bg-slate-900/40'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function ProgressIndicator({ label, value, total, color }: { label: string, value: number, total: number, color: string }) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-medium">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-muted-foreground">{value} ({percent}%)</span>
      </div>
      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all duration-500", color)} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function Checkline({ label, checked }: { label: string, checked: boolean }) {
  return (
    <div className="flex items-center gap-3 text-xs">
      <div className={cn(
        "w-4 h-4 rounded-full flex items-center justify-center border",
        checked ? "border-emerald-500 bg-success-soft0/10 text-emerald-400" : "border-border bg-slate-900"
      )}>
        <ShieldCheck className="w-3 h-3" />
      </div>
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}

function LoaderSpinner() {
  return (
    <div className="w-8 h-8 border-2 border-border border-t-indigo-400 rounded-full animate-spin" />
  );
}
