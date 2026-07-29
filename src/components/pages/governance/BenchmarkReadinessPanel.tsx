import React from 'react';
import { Gauge, AlertTriangle, CheckCircle, ShieldAlert, Lock, Activity, Sparkles, Info, CheckCircle2, XCircle, HelpCircle, TrendingUp, Compass } from 'lucide-react';
import { FiduciaryRuntimeAdapter, ESGIMScenario } from '../../../services/FiduciaryRuntimeAdapter';
// src/components/pages/governance/BenchmarkReadinessPanel.tsx


interface BenchmarkReadinessPanelProps {
  clientId: string;
  scenario: ESGIMScenario;
}

export function BenchmarkReadinessPanel({ clientId, scenario }: BenchmarkReadinessPanelProps) {
  // 1. Evaluate readiness from engine
  const readiness = FiduciaryRuntimeAdapter.benchmarkReadinessEngine.evaluateReadiness(clientId, scenario);

  // Status mappings
  const getStatusTheme = (status: string) => {
    switch (status) {
      case 'CERTIFIED':
        return {
          text: 'text-emerald-400 bg-success-soft0/10 border-emerald-500/25',
          progressColor: 'var(--color-executive-primary)',
          bgBar: 'bg-success-soft0',
          label: 'Certificado para Benchmark',
          description: 'A holding atende plenamente aos requisitos de maturidade e integridade.'
        };
      case 'CONDITIONALLY_CERTIFIED':
        return {
          text: 'text-amber-400 bg-warning-soft0/10 border-amber-500/25',
          progressColor: 'var(--color-executive-primary)',
          bgBar: 'bg-warning-soft0',
          label: 'Certificado Condicionalmente',
          description: 'Aprovado para rodadas de benchmark, sujeito a ajustes ou evidências adicionais.'
        };
      case 'NOT_CERTIFIED':
      default:
        return {
          text: 'text-red-400 bg-red-500/10 border-red-500/25',
          progressColor: 'var(--color-executive-primary)',
          bgBar: 'bg-red-500',
          label: 'Não Certificado',
          description: 'Bloqueado. A holding apresenta fragilidades severas em governança, dados ou liquidez.'
        };
    }
  };

  const theme = getStatusTheme(readiness.certificationStatus);

  // Dimension details helper
  const renderDimension = (label: string, score: number, status: 'CRITICAL' | 'WARNING' | 'OPTIMAL', icon: React.ReactNode) => {
    let scoreColor = 'text-emerald-450';
    let barColor = 'bg-success-soft0';
    if (status === 'CRITICAL') {
      scoreColor = 'text-red-450';
      barColor = 'bg-red-500';
    } else if (status === 'WARNING') {
      scoreColor = 'text-amber-450';
      barColor = 'bg-warning-soft0';
    }

    return (
      <div className="p-4 bg-slate-950/40 border border-border rounded-2xl space-y-3">
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-muted-foreground">
            {React.isValidElement(icon) ? icon : icon ? React.createElement(icon as any, { size: 18 }) : null}
            <span>{label}</span>
          </div>
          <span className={`font-bold font-mono text-sm ${scoreColor}`}>{score}/100</span>
        </div>
        
        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5 relative">
          <div 
            style={{ width: `${score}%` }}
            className={`h-full rounded-full transition-all duration-800 ease-out ${barColor}`} 
          />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-900/60 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 space-y-8 shadow-2xl relative overflow-hidden">
      
      {/* Background soft lighting */}
      <div className={`absolute top-0 left-0 w-64 h-64 rounded-full filter blur-[120px] opacity-10 transition-colors duration-1000 ${readiness.benchmarkEligible ? 'bg-primary' : 'bg-red-500'}`} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-500/10 rounded-2xl border border-teal-500/25 text-teal-400 shadow-lg shadow-teal-500/5">
            <Gauge className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-white">
                Benchmark Readiness Layer
              </h2>
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-teal-500/15 border border-teal-500/30 text-teal-400 rounded-full">
                BRL™ v1.0
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
              Certificação Fiduciária Preventiva de Inteligência Comparativa
            </p>
          </div>
        </div>

        {/* Eligibility Indicator */}
        <div className="flex items-center gap-2">
          {readiness.benchmarkEligible ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-success-soft0/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-black uppercase tracking-wider">
              <CheckCircle className="w-4 h-4" />
              <span>Aprovado para Benchmark</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full text-xs font-black uppercase tracking-wider animate-pulse">
              <ShieldAlert className="w-4 h-4" />
              <span>Benchmark Suspenso</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Dial & Summary cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* BRI Circular dial */}
        <div className="bg-black/20 border border-border rounded-2xl p-6 flex flex-col items-center justify-between text-center relative overflow-hidden">
          <div className="absolute top-2 left-2 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest text-left">BRI™ Index</span>
          </div>

          <div className="relative flex items-center justify-center my-4">
            <svg className="w-36 h-36 transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="60"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="60"
                stroke={theme.progressColor}
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={377}
                strokeDashoffset={377 - (377 * readiness.score) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-white tracking-tight">{readiness.score}</span>
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">BRI™ Score</span>
            </div>
          </div>

          <div className="space-y-3 w-full">
            <div className={`py-1.5 px-3 rounded-xl border text-center font-black uppercase text-[10px] tracking-widest ${theme.text}`}>
              {theme.label}
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              O **BRI™** calcula a pontuação ponderada das dimensões de prontidão para auditoria fiduciária comparativa.
            </p>
          </div>
        </div>

        {/* Executive Summary & Block Reason */}
        <div className="lg:col-span-2 flex flex-col justify-between space-y-6">
          <div className="bg-black/20 border border-border rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Parecer de Admissibilidade</span>
              <span className="text-[9.5px] font-bold text-muted-foreground font-mono">HASH: {readiness.lineageHash}</span>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed font-semibold">
              {readiness.executiveSummary}
            </p>

            {/* Blocked or warning alert box */}
            {!readiness.benchmarkEligible && readiness.benchmarkBlockedReason && (
              <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/30 text-xs text-red-350 space-y-2">
                <div className="flex items-center gap-2 font-black uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  <span>Razão do Bloqueio Fiduciário:</span>
                </div>
                <p className="font-mono">{readiness.benchmarkBlockedReason}</p>
              </div>
            )}
          </div>

          {/* Checklist requirement items */}
          {readiness.requiredBeforeBenchmark && readiness.requiredBeforeBenchmark.length > 0 && (
            <div className="p-5 bg-surface-container border border-border rounded-2xl space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                Ações corretivas exigidas antes da liberação do benchmark setorial:
              </span>
              <div className="space-y-2">
                {readiness.requiredBeforeBenchmark.map((req, index) => (
                  <div key={index} className="flex items-start gap-2 text-[11px] text-muted-foreground leading-snug">
                    <span className="text-primary font-bold mt-0.5">•</span>
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Grid of Dimensions */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Activity className="w-4 h-4 text-teal-400" />
          Métricas de Prontidão por Eixo Analítico
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {renderDimension('Dados & Auditoria', readiness.dataReadiness, readiness.dataReadinessStatus, <Compass className="w-4 h-4 text-teal-400" />)}
          {renderDimension('Governança Fiduciária', readiness.governanceReadiness, readiness.governanceReadinessStatus, <Activity className="w-4 h-4 text-primary" />)}
          {renderDimension('Alinhamento Institucional', readiness.institutionalReadiness, readiness.institutionalReadinessStatus, <CheckCircle2 className="w-4 h-4 text-emerald-400" />)}
          {renderDimension('Integridade Comparativa', readiness.comparativeReadiness, readiness.comparativeReadinessStatus, <TrendingUp className="w-4 h-4 text-sky-400" />)}
        </div>
      </div>

      {/* Strengths & Vulnerabilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Strengths */}
        <div className="p-5 bg-black/15 border border-border rounded-2xl space-y-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Vantagens de Comparabilidade Mapeadas ({readiness.strengths.length})
          </span>
          <div className="space-y-2">
            {readiness.strengths.map((str, idx) => (
              <div key={idx} className="text-xs text-muted-foreground flex items-start gap-2 leading-relaxed">
                <span className="text-emerald-500 font-bold mt-0.5">✔</span>
                <span>{str}</span>
              </div>
            ))}
            {readiness.strengths.length === 0 && (
              <p className="text-xs text-muted-foreground italic">Nenhum ponto forte destacado no baseline fiduciário atual.</p>
            )}
          </div>
        </div>

        {/* Vulnerabilities */}
        <div className="p-5 bg-black/15 border border-border rounded-2xl space-y-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-red-400 flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            Pontos de Bloqueio ou Sensibilidade ({readiness.vulnerabilities.length})
          </span>
          <div className="space-y-2">
            {readiness.vulnerabilities.map((vul, idx) => (
              <div key={idx} className="text-xs text-muted-foreground flex items-start gap-2 leading-relaxed">
                <span className="text-red-500 font-bold mt-0.5">✘</span>
                <span>{vul}</span>
              </div>
            ))}
            {readiness.vulnerabilities.length === 0 && (
              <p className="text-xs text-muted-foreground italic">Nenhuma vulnerabilidade ou restrição fiduciária detectada.</p>
            )}
          </div>
        </div>
      </div>

      {/* Future Comparative Benchmarking Locked Placeholder (BCI™) */}
      <div className="p-6 bg-slate-950/30 border border-dashed border-border rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-surface-container/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
          <div className="bg-gray-900 border border-border px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2">
            <Lock className="w-4 h-4 text-teal-400" />
            <span className="text-[10.5px] font-black uppercase tracking-widest text-teal-400 font-mono">
              Recurso Futuro: BCI™ Bloqueado
            </span>
          </div>
        </div>

        <div className="space-y-1 relative z-0">
          <h4 className="text-sm font-extrabold text-muted-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Benchmark Comparative Intelligence (BCI™)
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Consulte médias setoriais da holding contra o mercado, índices de governança regionais e benchmarks específicos de empresas familiares.
          </p>
        </div>

        <span className="text-[10px] text-muted-foreground font-mono select-none relative z-0">
          Status: Benchmark Comparative Intelligence unavailable until BRL™ certification is achieved.
        </span>
      </div>

    </div>
  );
}
