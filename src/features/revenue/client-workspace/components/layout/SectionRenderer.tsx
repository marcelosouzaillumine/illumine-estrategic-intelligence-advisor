import React from 'react';
import { ExecutiveWelcome } from '../narrative/ExecutiveWelcome';
import { StrategicContext } from '../narrative/StrategicContext';
import { CurrentReality } from '../narrative/CurrentReality';
import { ExecutiveSolution } from '../narrative/ExecutiveSolution';
import { TransformationJourney } from '../narrative/TransformationJourney';
import { InvestmentPerspective } from '../narrative/InvestmentPerspective';
import { ExecutiveDecisionCenter } from '../decision/ExecutiveDecisionCenter';

export type SectionType = 
  | 'WELCOME' 
  | 'CONTEXT' 
  | 'REALITY' 
  | 'SOLUTION' 
  | 'JOURNEY' 
  | 'INVESTMENT' 
  | 'NEXT_STEP';

export interface ProposalSectionData {
  type: SectionType;
  payload: any;
}

export const SectionRenderer: React.FC<{ sections: ProposalSectionData[] }> = ({ sections }) => {
  return (
    <div className="flex flex-col gap-12 w-full max-w-4xl mx-auto">
      {sections.map((section, index) => {
        switch (section.type) {
          case 'WELCOME':
            return <ExecutiveWelcome key={index} data={section.payload} />;
          case 'CONTEXT':
            return <StrategicContext key={index} data={section.payload} />;
          case 'REALITY':
            return <CurrentReality key={index} data={section.payload} />;
          case 'SOLUTION':
            return <ExecutiveSolution key={index} data={section.payload} />;
          case 'JOURNEY':
            return <TransformationJourney key={index} data={section.payload} />;
          case 'INVESTMENT':
            return <InvestmentPerspective key={index} data={section.payload} />;
          case 'NEXT_STEP':
            return <ExecutiveDecisionCenter key={index} data={section.payload} />;
          default:
            console.warn(`Unknown section type: ${section.type}`);
            return null;
        }
      })}
    </div>
  );
};
