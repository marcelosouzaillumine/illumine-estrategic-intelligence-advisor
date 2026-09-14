import React from 'react';

export const CurrentReality: React.FC<{ data: any }> = ({ data }) => {
  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-3xl font-bold mb-4">Current Reality</h2>
      <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
        <p className="text-slate-300">Riscos observados posicionados como oportunidades latentes.</p>
        {/* Futuro: ExecutiveExposureCard */}
      </div>
    </section>
  );
};
