import React from 'react';
import { ExecutiveIntelligenceProfile } from '../../../../intelligence/diagnostics/models/executive-intelligence-profile';
import { MATURITY_LEVELS } from '../../../../intelligence/diagnostics/core/maturity-model';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DiagnosticProfileViewProps {
  profile: ExecutiveIntelligenceProfile;
}

export function DiagnosticProfileView({ profile }: DiagnosticProfileViewProps) {
  const maturityDef = MATURITY_LEVELS[profile.maturityLevel];

  // Derive top capability and opportunity from the interpretation engine output
  const topCapability = profile.strengths.length > 0 
    ? profile.strengths[0] 
    : "Processos base operando na capacidade padrão da organização.";
    
  const topOpportunity = profile.attentionPoints.length > 0
    ? profile.attentionPoints[0]
    : "Evolução incremental para patamares de excelência.";

  const illumineRecommendation = profile.executiveInsights.length > 0
    ? profile.executiveInsights.join(' ')
    : "A próxima evolução consiste em fortalecer sua capacidade de decisão baseada em inteligência executiva contínua.";

  return (
    <div className="w-full max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/10 mb-6 border border-amber-500/20">
          <Sparkles className="w-5 h-5 text-amber-500" />
        </div>
        <h2 className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em] mb-4">
          Executive Governance Summary™
                          </h2>
        <h1 className="text-3xl font-light text-white mb-2">
          {profile.domain.charAt(0).toUpperCase() + profile.domain.slice(1)} Governance Profile™
                          </h1>
      </div>

      <div className="space-y-4 mb-12 relative before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:to-transparent before:-z-10 before:rounded-3xl p-8 border border-white/5 rounded-3xl bg-[#0A0A0A]">
        
        {profile.domain === 'governance' && (profile as any).signature ? (
          <>
            <div className="border-b border-white/5 pb-8">
              <span className="text-[10px] text-amber-500 uppercase tracking-[0.2em] block mb-2 font-bold">Executive Governance Signature™</span>
              <p className="text-2xl text-white font-light">{(profile as any).signature.predominantProfile}</p>
            </div>

            <div className="border-b border-white/5 py-8">
              <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] block mb-2 font-semibold">Capacidade Institucional Atual</span>
              <p className="text-lg text-slate-300 font-light leading-relaxed">
                {(profile as any).signature.institutionalCapacity}
              </p>
            </div>

            <div className="border-b border-white/5 py-8">
              <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] block mb-4 font-semibold">Capacidades Identificadas</span>
              <ul className="space-y-2">
                {(profile as any).signature.identifiedCapabilities.map((cap: string, i: number) => (
                  <li key={i} className="text-slate-300 font-light flex items-center gap-2">
                    <span className="text-emerald-500">✓</span> {cap}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8">
              <span className="text-[10px] text-amber-500 uppercase tracking-[0.2em] block mb-4 font-semibold">Próximos Vetores de Evolução</span>
              <ul className="space-y-2">
                {(profile as any).signature.evolutionVectors.map((vec: string, i: number) => (
                  <li key={i} className="text-white font-light flex items-center gap-2">
                    <span className="text-amber-500">→</span> {vec}
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <>
            {/* Maturidade Atual */}
            <div className="border-b border-white/5 pb-8">
              <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] block mb-2 font-semibold">Maturidade Atual</span>
              <p className="text-2xl text-amber-500 font-light">{maturityDef.title}</p>
            </div>

            {/* Capacidade Identificada */}
            <div className="border-b border-white/5 py-8">
              <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] block mb-2 font-semibold">Capacidade Identificada</span>
              <p className="text-lg text-slate-300 font-light leading-relaxed">
                {topCapability}
              </p>
            </div>

            {/* Principal Oportunidade */}
            <div className="border-b border-white/5 py-8">
              <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] block mb-2 font-semibold">Principal Oportunidade</span>
              <p className="text-lg text-slate-300 font-light leading-relaxed">
                {topOpportunity}
              </p>
            </div>

            {/* Recomendação Illumine */}
            <div className="pt-8">
              <span className="text-[10px] text-amber-500 uppercase tracking-[0.2em] block mb-2 font-semibold">Recomendação Illumine</span>
              <p className="text-lg text-white font-light leading-relaxed">
                {illumineRecommendation}
              </p>
            </div>
          </>
        )}

      </div>

      {/* CTAs */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <Link 
          to="/executive-advisory" 
          className="w-full md:w-auto px-8 py-4 bg-amber-500 text-black font-bold uppercase tracking-widest text-[10px] rounded-lg hover:bg-amber-400 transition-all flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]"
        >
          Explorar Executive Advisory™
          <ArrowRight className="w-4 h-4" />
        </Link>
        <button 
          onClick={() => {
            // Optional local action to view past profiles
            console.log("Continuar jornada clicked");
          }}
          className="w-full md:w-auto px-8 py-4 bg-transparent border border-white/10 text-white font-bold uppercase tracking-widest text-[10px] rounded-lg hover:bg-white/5 transition-colors"
        >
          Continuar Minha Jornada Executiva
        </button>
      </div>

    </div>
  );
}
