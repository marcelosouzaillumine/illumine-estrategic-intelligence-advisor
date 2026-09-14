import React from 'react';
import { ExecutiveProfilePortfolio } from '../../../../intelligence/executive-profile/portfolio-types';
import { MaturityLevel, DiagnosticDomain } from '../../../../intelligence/diagnostics/core/diagnostic-types';
import { DomainRegistry } from '../../../../intelligence/diagnostics/core/domain-registry';

interface ExecutiveMaturityMapProps {
  portfolio: ExecutiveProfilePortfolio | null;
}

export function ExecutiveMaturityMap({ portfolio }: ExecutiveMaturityMapProps) {
  
  const getDots = (level?: MaturityLevel) => {
    let count = 0;
    if (level === 'initial') count = 1;
    else if (level === 'developing') count = 2;
    else if (level === 'structured') count = 3;
    else if (level === 'advanced') count = 4;
    else if (level === 'excellence') count = 5;

    if (count === 0) return <span className="text-slate-700 tracking-widest text-lg">○○○○○</span>;

    const filled = '●'.repeat(count);
    const empty = '○'.repeat(5 - count);

    return (
      <span className="tracking-widest text-lg">
        <span className="text-amber-500">{filled}</span>
        <span className="text-slate-700">{empty}</span>
      </span>
    );
  };

  const getLabel = (level?: MaturityLevel) => {
    if (level === 'initial') return 'Foundation Building';
    if (level === 'developing') return 'Developing Capability';
    if (level === 'structured') return 'Structured Development';
    if (level === 'advanced') return 'Advanced Capability';
    if (level === 'excellence') return 'Excellence Standard';
    return 'Not Started';
  };

  const registry = DomainRegistry.getInstance();
  // Display all core domains and any other domains the user has completed
  const allDomains = registry.getAllDomains();
  
  // Filter domains we want to show: all core domains + any non-core that is completed
  const domainsToShow = allDomains.filter(d => 
    d.isCoreFoundation || (portfolio?.domains[d.domain] && portfolio.domains[d.domain]!.status === 'completed')
  );

  return (
    <div className="w-full bg-[#0A0A0A] border border-white/5 p-8 rounded-3xl mb-12">
      <div className="flex items-center justify-between border-b border-white/5 mb-8 pb-4">
        <h3 className="text-white text-lg font-light">
          Executive Governance Portfolio™
                          </h3>
        <span className="text-[10px] text-slate-500 uppercase tracking-widest">
          Index: {portfolio?.intelligenceIndex || 0}/100
        </span>
      </div>
      
      <div className="space-y-6">
        {domainsToShow.map(domain => {
          const level = portfolio?.domains[domain.domain]?.currentMaturity;
          return (
            <div key={domain.domain} className="flex flex-col md:flex-row md:items-center justify-between group">
              <div className="mb-2 md:mb-0">
                <span className={`text-sm font-medium ${level ? 'text-white' : 'text-slate-500'}`}>
                  {domain.name}
                </span>
              </div>
              <div className="flex flex-col md:items-end">
                <div className="mb-1">{getDots(level)}</div>
                <span className={`text-[10px] uppercase tracking-widest ${level ? 'text-amber-500' : 'text-slate-600'}`}>
                  {getLabel(level)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
