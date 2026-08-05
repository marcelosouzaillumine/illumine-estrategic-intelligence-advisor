import React from 'react';

export const ProposalTemplateSelector: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="p-6 border border-slate-700 bg-slate-800 rounded-lg hover:border-blue-500 cursor-pointer">
        <h3 className="text-lg font-bold">Executive Intelligence Platform™</h3>
        <p className="text-sm text-slate-400 mt-2">Enterprise Blueprint</p>
      </div>
      <div className="p-6 border border-slate-700 bg-slate-800 rounded-lg hover:border-blue-500 cursor-pointer">
        <h3 className="text-lg font-bold">Governance Intelligence Diagnostic™</h3>
        <p className="text-sm text-slate-400 mt-2">Assessment Blueprint</p>
      </div>
      <div className="p-6 border border-slate-700 bg-slate-800 rounded-lg hover:border-blue-500 cursor-pointer">
        <h3 className="text-lg font-bold">Executive Advisory™</h3>
        <p className="text-sm text-slate-400 mt-2">Consulting Blueprint</p>
      </div>
    </div>
  );
};
