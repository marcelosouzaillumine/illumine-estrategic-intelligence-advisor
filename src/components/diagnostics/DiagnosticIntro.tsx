import React from 'react';
import { ExecutiveDiagnostic } from '../../intelligence/diagnostics/core/diagnostic-contracts';
import { ArrowRight } from 'lucide-react';

interface DiagnosticIntroProps {
  diagnostic: ExecutiveDiagnostic;
  onStart: () => void;
}

export function DiagnosticIntro({ diagnostic, onStart }: DiagnosticIntroProps) {
  return (
    <div className="w-full max-w-2xl mx-auto text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="mb-8">
        <h2 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-4">
          Executive Diagnostic Journey™
        </h2>
        <h1 className="text-4xl md:text-5xl font-light text-white mb-6">
          {diagnostic.name.replace('™', '')}
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed max-w-xl mx-auto">
          {diagnostic.description}
        </p>
      </div>

      <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 mb-10 max-w-md mx-auto">
        <p className="text-sm text-slate-300 mb-4 font-medium">
          Vamos explorar {diagnostic.dimensions.length} dimensões que influenciam essa capacidade:
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {diagnostic.dimensions.map(dim => (
            <span key={dim.id} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-slate-400">
              {dim.name.replace('™', '')}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={onStart}
        className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-amber-500 text-black text-sm font-bold uppercase tracking-widest rounded-lg hover:bg-amber-400 transition-all hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]"
      >
        Iniciar Jornada
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
