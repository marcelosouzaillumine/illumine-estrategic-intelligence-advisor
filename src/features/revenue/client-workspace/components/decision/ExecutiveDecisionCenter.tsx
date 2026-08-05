import React, { useState } from 'react';
import { DecisionSummaryPanel } from './DecisionSummaryPanel';
import { DecisionOptionsGrid } from './DecisionOptionsGrid';
import { DigitalAcceptanceFlow } from './DigitalAcceptanceFlow';
import { NextStepsAutomation } from './NextStepsAutomation';

export const ExecutiveDecisionCenter: React.FC<{ data: any }> = ({ data }) => {
  const [activeView, setActiveView] = useState<'SUMMARY' | 'ACCEPTANCE' | 'NEXT_STEPS'>('SUMMARY');

  return (
    <section className="mt-16 pt-12 border-t border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold mb-4 text-white">Executive Decision Center™</h2>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Valide o compromisso estratégico e selecione o próximo passo na jornada da sua organização.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-2xl">
        {activeView === 'SUMMARY' && (
          <>
            <DecisionSummaryPanel data={data} />
            <div className="mt-8 pt-8 border-t border-slate-800">
              <DecisionOptionsGrid onAccept={() => setActiveView('ACCEPTANCE')} />
            </div>
          </>
        )}

        {activeView === 'ACCEPTANCE' && (
          <DigitalAcceptanceFlow 
            onCancel={() => setActiveView('SUMMARY')}
            onSuccess={() => setActiveView('NEXT_STEPS')} 
          />
        )}

        {activeView === 'NEXT_STEPS' && (
          <NextStepsAutomation />
        )}
      </div>
    </section>
  );
};
