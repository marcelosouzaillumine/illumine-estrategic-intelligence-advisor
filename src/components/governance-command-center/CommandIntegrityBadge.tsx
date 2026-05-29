import React from 'react';

interface CommandIntegrityBadgeProps {
  state: 'VERIFIED' | 'FAIL_CLOSED';
}

export const CommandIntegrityBadge: React.FC<CommandIntegrityBadgeProps> = ({ state }) => {
  let badgeStyles = 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30';
  let label = 'VERIFIED LEDGER';
  let dotColor = 'bg-emerald-400';

  if (state === 'FAIL_CLOSED') {
    badgeStyles = 'bg-rose-950/40 text-rose-400 border-rose-500/30 animate-pulse';
    label = 'FAIL-CLOSED SYSTEM LOCK';
    dotColor = 'bg-rose-400';
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-mono tracking-wider font-bold ${badgeStyles}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {label}
    </div>
  );
};
