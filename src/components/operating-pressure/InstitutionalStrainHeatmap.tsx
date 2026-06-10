// src/components/operating-pressure/InstitutionalStrainHeatmap.tsx

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface HeatmapProps {
  scores: {
    accumulation: number;
    fatigue: number;
    compression: number;
    erosion: number;
    fragility: number;
  };
}

export function InstitutionalStrainHeatmap({ scores }: HeatmapProps) {
  const items = [
    { label: 'Acúmulo de Tensões', val: scores.accumulation },
    { label: 'Fadiga Operacional', val: scores.fatigue },
    { label: 'Compressão de Liquidez', val: scores.compression },
    { label: 'Erosão de Tesouraria', val: scores.erosion },
    { label: 'Fragilidade de Funding', val: scores.fragility },
  ];

  const getColorClass = (val: number) => {
    if (val > 80) return 'bg-destructive/20 text-destructive border-destructive/40';
    if (val > 50) return 'bg-warning-soft0/10 text-amber-500 border-amber-500/30';
    if (val > 25) return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
    return 'bg-success-soft0/10 text-emerald-500 border-emerald-500/30';
  };

  return (
    <div className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm">
      <h3 className="text-xl font-display font-medium text-foreground mb-6">
        Matriz de Intensidade de Desgaste
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.02 }}
            className={cn(
              "p-5 rounded-2xl border text-center flex flex-col justify-between h-36 transition-all",
              getColorClass(item.val)
            )}
          >
            <span className="text-[10px] font-black uppercase tracking-widest opacity-80">
              {item.label}
            </span>
            <span className="text-4xl font-display font-bold tracking-tight">
              {item.val.toFixed(0)}
            </span>
            <div className="w-full bg-border/20 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-current h-full" 
                style={{ width: `${item.val}%` }} 
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
