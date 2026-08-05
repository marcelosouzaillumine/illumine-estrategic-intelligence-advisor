import React from 'react';
import { useClientWorkspaceSession } from "../../auth/useClientWorkspaceSession";
import { useClientProposal } from '../../hooks/useClientProposal';
import { SectionRenderer } from './SectionRenderer';

export const ClientWorkspaceLayout: React.FC = () => {
  const { session } = useClientWorkspaceSession();
  const { viewModel, loading, error } = useClientProposal();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400">Synchronizing secure data...</p>
      </div>
    );
  }

  if (error || !viewModel) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-6">
        <div className="bg-red-900/30 text-red-400 p-8 rounded-xl max-w-md text-center border border-red-800">
          <h2 className="text-2xl font-bold mb-4">Acesso Negado</h2>
          <p>{error || 'Esta proposta expirou ou não está mais disponível para visualização externa.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      <header className="px-8 py-4 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-900/90 backdrop-blur z-50">
        <div>
          <span className="text-xl font-bold block">Executive Decision Room™</span>
          <p className="text-sm text-slate-400">
            For: {viewModel.companyName}
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Secure Session Active</span>
          <div className="text-sm text-green-400 flex items-center justify-end gap-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            Validated ID: {session?.id.substring(0, 8)}
          </div>
        </div>
      </header>
      
      {/* We inject the viewModel context directly through React Context or Props in a real app.
          For the architectural pattern, we assume components inside will either receive it 
          or use a context provider we can build around this layer. */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-8 overflow-y-auto">
        <SectionRenderer sections={viewModel.sections || []} />
      </main>
      
      <footer className="py-6 border-t border-slate-800 text-center text-slate-500 text-sm">
        <p>Protected by Illumine Executive Intelligence OS</p>
      </footer>
    </div>
  );
};
