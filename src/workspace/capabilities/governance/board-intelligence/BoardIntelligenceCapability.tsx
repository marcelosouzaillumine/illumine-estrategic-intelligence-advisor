import React from 'react';
import { ExecutiveContext } from '../../../context/executive-context.types';
import { useBoardIntelligence } from '../../../data/adapters/governance-intelligence.adapter';

interface BoardIntelligenceCapabilityProps {
  context: ExecutiveContext;
}

export const BoardIntelligenceCapability: React.FC<BoardIntelligenceCapabilityProps> = ({ context }) => {
  const { data, loading } = useBoardIntelligence(context);

  if (loading) return <div className="p-8 text-slate-400">Processando Board Intelligence...</div>;
  if (!data) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">Board Intelligence</h1>
        <p className="text-slate-400 text-sm mt-1">Governance Office</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Upcoming Meetings</h3>
          <div className="text-4xl font-light text-slate-100 mt-4">
            {data.upcomingBoardMeetings}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Pending Topics</h3>
          <div className="text-4xl font-light text-amber-400 mt-4">
            {data.criticalTopicsPending}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Board Pack Readiness</h3>
          <div className="text-4xl font-light text-slate-100 mt-4">
            {data.boardPackReadinessIndex}%
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Commitments at Risk</h3>
          <div className="text-4xl font-light text-red-400 mt-4">
            {data.executiveCommitmentsAtRisk}
          </div>
        </div>
      </div>
    </div>
  );
};
