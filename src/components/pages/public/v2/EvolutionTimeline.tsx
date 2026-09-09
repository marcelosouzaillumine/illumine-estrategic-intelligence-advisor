import React, { useState, useEffect } from 'react';
import { Database, LineChart, Cpu, MessageSquare, Brain } from 'lucide-react';

const eras = [
  { title: "ERP", action: "Registrar eventos.", icon: Database },
  { title: "BI", action: "Visualizar resultados.", icon: LineChart },
  { title: "Analytics", action: "Interpretar padrões.", icon: Cpu },
  { title: "Generative AI", action: "Sintetizar conhecimento.", icon: MessageSquare },
  { title: "Executive Governance", action: "Decidir, aprender e evoluir.", icon: Brain, highlight: true }
];

export function EvolutionTimeline() {
  const [activeEra, setActiveEra] = useState(0);
  const [isManual, setIsManual] = useState(false);

  useEffect(() => {
    if (isManual) return;
    
    let timeoutId: ReturnType<typeof setTimeout>;
    
    const tick = () => {
      setActiveEra(prev => {
        const next = prev >= 4 ? 0 : prev + 1;
        timeoutId = setTimeout(tick, next === 0 ? 5000 : 2500);
        return next;
      });
    };
    
    timeoutId = setTimeout(tick, 2500);
    return () => clearTimeout(timeoutId);
  }, [isManual]);

  return (
    <div className="w-full max-w-6xl mx-auto py-12 relative font-sans">
      
      {/* Conector Background (Trilha) */}
      <div className="absolute left-[10%] right-[10%] top-[24px] h-[2px] bg-white/5 z-0 rounded-full" />
      
      {/* Conector Animado (Progresso) */}
      <div 
        className="absolute left-[10%] top-[24px] h-[2px] bg-amber-500 z-0 transition-all duration-1000 ease-in-out rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"
        style={{ width: `${(activeEra / 4) * 80}%` }}
      />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 md:gap-4">
        {eras.map((era, i) => {
          const isActive = i === activeEra;
          const isPast = i <= activeEra;
          
          return (
            <div 
              key={i} 
              className="flex flex-col items-center flex-1 cursor-pointer group w-full md:w-auto"
              onClick={() => {
                setActiveEra(i);
                setIsManual(true);
              }}
            >
              {/* Ícone */}
              <div 
                className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center transition-all duration-700 relative shadow-2xl mb-6 shrink-0
                  ${era.highlight 
                    ? isActive ? 'bg-amber-500 shadow-[0_0_50px_rgba(245,158,11,0.5)] scale-110 border-amber-500' : 'bg-[#121214] border border-amber-500/30'
                    : isActive ? 'bg-white shadow-[0_0_30px_rgba(255,255,255,0.2)] scale-110 border-white' : 'bg-[#121214] border border-white/10'
                  }
                  ${isPast && !isActive && !era.highlight ? 'bg-white/10' : ''}
                  ${!isActive && 'group-hover:scale-105 group-hover:border-white/30'}
                `}
              >
                <era.icon 
                  className={`w-8 h-8 md:w-10 md:h-10 transition-colors duration-500 
                    ${era.highlight 
                      ? isActive ? 'text-black' : 'text-amber-500'
                      : isActive ? 'text-black' : isPast ? 'text-white' : 'text-slate-500'
                    }
                  `} 
                />
              </div>
              
              {/* Textos */}
              <div className={`text-center px-4 transition-all duration-500 w-full ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-50 group-hover:opacity-80'}`}>
                <div className="h-[64px] flex flex-col justify-start items-center mb-2">
                  <h3 className={`text-xl md:text-2xl font-bold font-sans ${era.highlight ? 'text-amber-500' : 'text-white'}`}>
                    {era.title}
                  </h3>
                </div>
                <p className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${era.highlight ? 'text-amber-500/80' : 'text-slate-400'}`}>
                  {era.action}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
