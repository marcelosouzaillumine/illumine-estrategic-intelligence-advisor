import React from 'react';

interface BoardPresentationModeProps {
  active: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export const BoardPresentationMode: React.FC<BoardPresentationModeProps> = ({ active, onToggle, children }) => {
  if (!active) {
    return (
      <div className="flex justify-end p-4">
        <button
          onClick={onToggle}
          className="bg-slate-900 border border-slate-800 text-slate-300 px-4 py-2 rounded text-xs font-mono hover:bg-slate-800 hover:text-white"
        >
          Enter Fullscreen Presentation Mode
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-950 z-50 overflow-y-auto flex flex-col p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
          🏛️ Fiduciary Board Presentation Mode
        </span>
        <button
          onClick={onToggle}
          className="bg-slate-900 border border-slate-800 text-red-400 px-3 py-1.5 rounded text-xs font-mono hover:bg-red-950/20"
        >
          Exit Presentation
        </button>
      </div>
      <div className="flex-1 max-w-6xl mx-auto w-full space-y-6">
        {children}
      </div>
    </div>
  );
};
