import React from 'react';

export const ExecutiveWelcome: React.FC<{ data: any }> = ({ data }) => {
  return (
    <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 className="text-4xl font-bold mb-4">Executive Alignment</h1>
      <p className="text-xl text-slate-300">
        Esta proposta foi construída considerando os desafios estratégicos identificados na sua organização.
      </p>
      {/* Futuro: Injetar data.companyName, etc */}
    </section>
  );
};
