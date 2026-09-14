import React from 'react';

export const TransformationJourney: React.FC<{ data: any }> = ({ data }) => {
  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-3xl font-bold mb-4">Transformation Journey</h2>
      <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
        <p className="text-slate-300">Cronograma da parceria, marcos e plano de implementação.</p>
        {/* Futuro: ExecutiveLineageTimeline */}
      </div>
    </section>
  );
};
