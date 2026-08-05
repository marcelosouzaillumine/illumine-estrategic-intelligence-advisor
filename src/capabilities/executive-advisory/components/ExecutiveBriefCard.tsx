import { ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ExecutiveBriefCardProps {
  content: string | any;
  ctas?: { label: string; href?: string; onClick?: () => void; primary?: boolean; }[];
}

export function ExecutiveBriefCard({ content, ctas }: ExecutiveBriefCardProps) {
  return (
    <div className="shrink-0 flex flex-col gap-3 mt-2 mb-4 animate-in fade-in duration-700 w-full">
      <div className="bg-[#121214] border border-amber-500/20 rounded-2xl overflow-hidden shadow-lg w-full relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
        <div className="p-4 border-b border-white/5 bg-black/40 flex items-center gap-2">
          <Sparkles className="text-amber-500 w-4 h-4" />
          <h4 className="text-white font-bold text-sm">Executive Brief™</h4>
        </div>
        <div className="p-5">
          <p className="text-[13px] md:text-sm text-slate-300 font-medium leading-relaxed">
            {content}
          </p>
        </div>
      </div>
      
      {ctas && ctas.length > 0 && (
        <div className="space-y-2 mt-1 px-1">
          {ctas.map((cta, idx) => (
            cta.href?.startsWith('http') ? (
              <a 
                key={idx}
                href={cta.href} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all group shadow-sm
                  ${cta.primary 
                    ? 'border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500' 
                    : 'border-white/10 bg-white/5 hover:bg-white/10 text-white'
                  }`}
              >
                <div className="flex items-center gap-3">
                  {cta.primary ? <Sparkles className="w-4 h-4" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                  <span className="text-[13px] font-semibold">{cta.label}</span>
                </div>
                <ChevronRight className={`w-4 h-4 ${cta.primary ? 'text-amber-500/50 group-hover:text-amber-500 group-hover:translate-x-1' : 'text-slate-500 group-hover:text-white group-hover:translate-x-1'} transition-all`} />
              </a>
            ) : (
              <Link 
                key={idx}
                to={cta.href || '#'}
                onClick={cta.onClick}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all group shadow-sm
                  ${cta.primary 
                    ? 'border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500' 
                    : 'border-white/10 bg-white/5 hover:bg-white/10 text-white'
                  }`}
              >
                <div className="flex items-center gap-3">
                  {cta.primary ? <Sparkles className="w-4 h-4" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                  <span className="text-[13px] font-semibold">{cta.label}</span>
                </div>
                <ChevronRight className={`w-4 h-4 ${cta.primary ? 'text-amber-500/50 group-hover:text-amber-500 group-hover:translate-x-1' : 'text-slate-500 group-hover:text-white group-hover:translate-x-1'} transition-all`} />
              </Link>
            )
          ))}
        </div>
      )}
    </div>
  );
}
