import React from 'react';

interface InstitutionalSkeletonSurfaceProps {
  layoutType?: 'dashboard' | 'report' | 'simple';
}

export const InstitutionalSkeletonSurface: React.FC<InstitutionalSkeletonSurfaceProps> = ({
  layoutType = 'dashboard'
}) => {
  return (
    <div className="w-full space-y-12 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-end pb-8 border-b border-border/10">
        <div className="space-y-3">
          <div className="h-8 bg-slate-800 rounded-xl w-64 border border-border/5" />
          <div className="h-4 bg-slate-800/60 rounded-xl w-[480px] border border-border/5" />
        </div>
        <div className="h-10 bg-slate-800 rounded-xl w-36 border border-border/5" />
      </div>

      {layoutType === 'dashboard' && (
        <div className="space-y-10">
          {/* KPI grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="card-premium p-6 h-36 flex flex-col justify-between opacity-75">
                <div className="flex justify-between items-start">
                  <div className="h-4 bg-slate-800 rounded-lg w-24" />
                  <div className="w-8 h-8 rounded-xl bg-slate-800" />
                </div>
                <div className="h-8 bg-slate-800 rounded-lg w-16" />
              </div>
            ))}
          </div>

          {/* Core content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 card-premium p-8 h-96 opacity-90" />
            <div className="card-premium p-8 h-96 opacity-90" />
          </div>
        </div>
      )}

      {layoutType === 'report' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-12 bg-slate-850 border border-border/5 rounded-xl" />
            ))}
          </div>
          <div className="lg:col-span-3 card-premium p-8 h-[500px]" />
        </div>
      )}

      {layoutType === 'simple' && (
        <div className="card-premium p-8 h-96" />
      )}
    </div>
  );
};
