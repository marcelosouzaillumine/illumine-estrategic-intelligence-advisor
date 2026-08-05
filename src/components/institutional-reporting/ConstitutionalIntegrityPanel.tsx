import React from 'react';
import { Shield, ShieldAlert, Key, ClipboardList, AlertTriangle, Layers, GitBranch } from 'lucide-react';
import { ConstitutionalSection } from '../../services/FiduciaryRuntimeAdapter';
import { useExecutiveFormatter } from '../../core/localization';
// src/components/institutional-reporting/ConstitutionalIntegrityPanel.tsx


interface ConstitutionalIntegrityPanelProps {
  section?: ConstitutionalSection;
}

export const ConstitutionalIntegrityPanel: React.FC<ConstitutionalIntegrityPanelProps> = ({ section }) => {
  const formatter = useExecutiveFormatter();

  if (!section) {
    return (
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 text-zinc-500 font-mono text-xs">
        Seção de governança constitucional indisponível no Board Pack.
      </div>
    );
  }

  const isApproved = section.constitutionalStatus === 'CONSTITUTIONALLY_STABLE';
  const hasErosion = section.erosionSignals.length > 0;
  const statusColor = isApproved ? 'text-emerald-400 border-emerald-900/50 bg-emerald-950/20' : 'text-rose-400 border-rose-900/50 bg-rose-950/20';

  const defaultAxioms = [
    { name: 'survivability supremacy', desc: 'A preservação existencial e a solvência do caixa são soberanas sobre qualquer prioridade de crescimento.' },
    { name: 'fail-closed doctrine', desc: 'Qualquer degradação de confiança ou inconsistência crítica força o travamento preventivo do ecossistema.' },
    { name: 'fiduciary neutrality', desc: 'A avaliação de riscos fiduciários deve ser livre de influências comerciais ou vieses operacionais.' },
    { name: 'lineage integrity', desc: 'Nenhum dado ou conclusão fiduciária é válida sem rastreabilidade determinística completa (lineage) e assinaturas.' },
    { name: 'deterministic explainability', desc: 'Qualquer bloqueio ou restrição regulatória deve possuir um nexo causal explicável em linguagem natural.' },
    { name: 'treasury preservation priority', desc: 'Salvaguardar as reservas de tesouraria do grupo é prioritário em relação a qualquer distribuição de dividendos.' },
    { name: 'disclosure transparency', desc: 'A ocultação de riscos de sobrevivência de baixo sinal é estritamente proibida; disclosures devem ser públicos.' },
    { name: 'audit reconstructability', desc: 'Todos os logs e execuções devem permitir reprodução histórica exata em ambiente seco (dry-run replay).' }
  ];

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 font-mono text-zinc-300 relative overflow-hidden">
      {/* Background Subtle Accent */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at top right, var(--color-primary) 0%, transparent 60%)'
      }}></div>

      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-800 pb-4 gap-4">
          <div className="flex items-center gap-3">
            {isApproved ? (
              <Shield className="w-8 h-8 text-emerald-500" />
            ) : (
              <ShieldAlert className="w-8 h-8 text-rose-500" />
            )}
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-widest">
                Painel de Integridade Constitucional
              </h2>
              <p className="text-[10px] text-zinc-500">
                Camada Suprema de Governança de Regras e Doutrinas do Ecossistema
              </p>
            </div>
          </div>

          <div className={`border rounded px-3 py-1 text-xs font-bold tracking-widest uppercase flex items-center gap-2 ${statusColor}`}>
            <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
            Status: {section.constitutionalStatus}
          </div>
        </div>

        {/* Top Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-lg p-3 flex flex-col justify-between">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold flex items-center gap-1.5 mb-1">
              <Key className="w-3.5 h-3.5" /> Hash Constitucional
            </span>
            <span className="text-xs font-bold font-mono truncate text-zinc-300" title={section.constitutionalLineageHash}>
              {section.constitutionalLineageHash}
            </span>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-lg p-3 flex flex-col justify-between">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold flex items-center gap-1.5 mb-1">
              <Layers className="w-3.5 h-3.5" /> Segurança de Migração
            </span>
            <span className={`text-xs font-bold uppercase ${section.migrationSafety ? 'text-emerald-400' : 'text-rose-400'}`}>
              {section.migrationSafety ? 'Aprovada / Segura' : 'Bloqueada / Risco de Downgrade'}
            </span>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-lg p-3 flex flex-col justify-between">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold flex items-center gap-1.5 mb-1">
              <GitBranch className="w-3.5 h-3.5" /> Compatibilidade
            </span>
            <span className="text-xs font-bold text-zinc-300">
              {Object.values(section.compatibilityStatus).includes(false) ? 'Incompatibilidade Detectada' : 'Compatibilidade Plena'}
            </span>
          </div>
        </div>

        {/* Fiduciary Axioms List */}
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-zinc-500" />
            Axiomas Fiduciários Soberanos (Inalteráveis)
          </h3>
          <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-lg overflow-hidden">
            <div className="grid grid-cols-3 bg-zinc-900/80 border-b border-zinc-800/80 px-4 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              <div>Nome do Axioma</div>
              <div className="col-span-2">Propósito Fiduciário</div>
            </div>
            <div className="divide-y divide-zinc-800/50">
              {defaultAxioms.map((ax, idx) => (
                <div key={idx} className="grid grid-cols-3 px-4 py-2.5 text-xs">
                  <div className="font-bold text-zinc-300 uppercase tracking-wider">{ax.name}</div>
                  <div className="col-span-2 text-zinc-400 leading-relaxed">{ax.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Warnings & Restrictions */}
        {(!isApproved || section.constitutionalRestrictions.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Active Restrictions */}
            <div className="bg-rose-950/10 border border-rose-900/30 rounded-lg p-4 font-mono">
              <h4 className="text-[10px] text-rose-500 font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Restrições Constitucionais Ativas
              </h4>
              {section.constitutionalRestrictions.length === 0 ? (
                <p className="text-zinc-500 text-xs">Nenhuma restrição direta imposta.</p>
              ) : (
                <ul className="space-y-1.5 text-xs text-rose-400/90 leading-relaxed list-disc list-inside">
                  {section.constitutionalRestrictions.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Erosion Signals */}
            <div className="bg-amber-950/10 border border-amber-900/30 rounded-lg p-4 font-mono">
              <h4 className="text-[10px] text-amber-500 font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Sinais de Erosão de Governança
              </h4>
              {section.erosionSignals.length === 0 ? (
                <p className="text-zinc-500 text-xs">Nenhum sinal de fadiga ou erosão fiduciária detectado.</p>
              ) : (
                <ul className="space-y-1.5 text-xs text-amber-400/90 leading-relaxed list-disc list-inside">
                  {section.erosionSignals.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Override Attempts Audit Trail */}
        {section.overrideAttempts.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-zinc-500" />
              Auditoria de Bypasses e Overrides
            </h3>
            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-lg overflow-hidden">
              <div className="grid grid-cols-4 bg-zinc-900/80 border-b border-zinc-800/80 px-4 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                <div>Alvo / Data</div>
                <div>Solicitante</div>
                <div className="col-span-2">Justificativa / Status</div>
              </div>
              <div className="divide-y divide-zinc-800/50 text-xs text-zinc-400">
                {section.overrideAttempts.map((ov, idx) => (
                  <div key={idx} className="grid grid-cols-4 px-4 py-3 gap-2">
                    <div>
                      <div className="font-bold text-zinc-300 truncate">{ov.target}</div>
                      <div className="text-[9px] text-zinc-500">{formatter.date(ov.timestamp)}</div>
                    </div>
                    <div>
                      <div className="font-bold text-zinc-300">{ov.actor}</div>
                      <div className="text-[10px] text-zinc-500">{ov.role}</div>
                    </div>
                    <div className="col-span-2">
                      <p className="mb-1 leading-normal italic">"{ov.reason}"</p>
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        ov.authorizationStatus === 'APPROVED' ? 'bg-emerald-950/50 text-emerald-400' : 'bg-rose-950/50 text-rose-400'
                      }`}>
                        {ov.authorizationStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
