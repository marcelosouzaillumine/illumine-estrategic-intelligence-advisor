import React from 'react';

export const ProposalPreview: React.FC = () => {
  return (
    <div className="bg-slate-900 min-h-screen text-white flex flex-col items-center p-8">
      <div className="w-full max-w-4xl bg-slate-800 border border-slate-700 shadow-2xl rounded-xl overflow-hidden">
        {/* Device Simulator Header */}
        <div className="bg-slate-950 p-3 flex gap-2 border-b border-slate-700">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        
        {/* Simulated Client Workspace */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Executive Proposal Preview</h2>
          <div className="text-center text-slate-400">
            [Client Workspace Simulation renders here]
          </div>
        </div>
      </div>
    </div>
  );
};
