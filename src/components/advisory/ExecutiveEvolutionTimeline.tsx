import React from 'react';
import { CheckCircle2, CircleDashed } from 'lucide-react';
import { ExecutiveMemoryState } from '../../intelligence/memory/executive-memory-types';
import { ProgressionEngine } from '../../intelligence/progression';
import { ExecutiveProfileRecord } from '../../intelligence/executive-profile/profile-types';
import { DomainRegistry } from '../../intelligence/diagnostics/core/domain-registry';
import { useExecutiveFormatter } from "../../core/localization";

interface ExecutiveEvolutionTimelineProps {
  memoryState: ExecutiveMemoryState | null;
}

export function ExecutiveEvolutionTimeline({ memoryState }: ExecutiveEvolutionTimelineProps) {
    const formatter = useExecutiveFormatter();
  if (!memoryState || Object.keys(memoryState.activeContexts).length === 0) {
    return null;
  }

  // Obter todos os perfis do portfólio (simulado através de activeContexts para MVP)
  // O correto futuramente é puxar do ExecutiveProfilePortfolio
  const contexts = Object.values(memoryState.activeContexts).sort((a, b) => 
    new Date(a.generatedAt).getTime() - new Date(b.generatedAt).getTime()
  );

  const latestContext = contexts[contexts.length - 1];
  
  // Transform AdvisoryContext to ExecutiveProfileRecord for the engine
  // This is a bridge for the MVP since we store context in memory state
  const latestProfileMock: ExecutiveProfileRecord = {
    id: latestContext.id,
    organizationId: 'org-timeline',
    domain: latestContext.domain.replace('-intelligence', ''),
    profile: latestContext.profile,
    generatedAt: latestContext.generatedAt,
    dataSource: 'diagnostic-v1',
    consumers: ['advisory']
  };

  const nextRecommendation = ProgressionEngine.getNextExecutiveJourney(
    null, // Not passing full portfolio yet
    latestProfileMock
  );

  const getDomainFromId = (id: string) => id.replace('-intelligence', '');

  const formatRecommendationName = (id: string) => {
      const formatter = useExecutiveFormatter();
    const domainKey = getDomainFromId(id);
    const registry = DomainRegistry.getInstance();
    const meta = registry.getDomain(domainKey as any);
    return meta ? `${meta.name} Journey™` : 'Próxima Jornada Executiva';
  };

  const getCapabilityText = (context: any) => {
      const formatter = useExecutiveFormatter();
    const domainKey = getDomainFromId(context.domain);
    const registry = DomainRegistry.getInstance();
    const meta = registry.getDomain(domainKey as any);
    return meta ? `${meta.name} Established` : 'Capability Established';
  };

  const getImpactText = (context: any) => {
      const formatter = useExecutiveFormatter();
    if (context.profile?.maturityLevel) {
       return `Maturity Level: ${context.profile.maturityLevel.toUpperCase()}`;
    }
    return 'Organizational capability unlocked.';
  };

  return (
    <div className="w-full">
      <h3 className="text-white text-lg font-medium mb-8 text-center md:text-left">Executive Evolution Timeline™</h3>
      
      <div className="flex flex-col space-y-0 relative pl-4 md:pl-8">
        
        {/* Completed Milestones */}
        {contexts.map((context, index) => {
            const formatter = useExecutiveFormatter();
          const monthYear = formatter.date(context.generatedAt, { month: 'short', year: 'numeric', timeZone: 'UTC' }).toUpperCase();
          
          return (
            <div key={context.id} className="relative pb-10">
              <div className="absolute left-[-16px] top-1 w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center z-10">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              {/* Connecting line */}
              <div className="absolute left-[-1px] top-8 bottom-[-8px] w-px bg-emerald-500/30" />
              
              <div className="pl-6">
                <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">{monthYear}</span>
                <h4 className="text-white text-lg font-light mt-1 flex items-center gap-2">
                  {formatRecommendationName(context.domain)}
                </h4>
                <div className="mt-4 space-y-3">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold block">Current Capability</span>
                    <span className="text-sm text-slate-300">{getCapabilityText(context)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold block">Evolution Impact</span>
                    <span className="text-sm text-slate-400">{getImpactText(context)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Future Milestone */}
        <div className="relative">
          <div className="absolute left-[-16px] top-1 w-8 h-8 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center z-10">
            <CircleDashed className="w-4 h-4 text-slate-500" />
          </div>
          
          <div className="pl-6">
            <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">Recommended Evolution</span>
            <h4 className="text-slate-300 text-lg font-light mt-1">{formatRecommendationName(nextRecommendation.recommendedJourney)}</h4>
            <div className="mt-4">
               <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold block mb-1">Why</span>
               <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                 {nextRecommendation.reason}
               </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
