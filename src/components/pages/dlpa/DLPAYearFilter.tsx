import React from 'react';
import { Calendar } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';

export type DLPAYearFilterProps = {
  filterYear: number;
  onChangeYear: (year: number) => void;
};

export const DLPAYearFilter = ({ filterYear, onChangeYear }: DLPAYearFilterProps) => {
  return (
    <ExecutiveSurface 
      variant="default"
      elevation="sm"
      radius="sm"
      padding="none"
      className="flex h-8 items-center px-2"
    >
      <Calendar size={12} className="ml-2 text-secondary" />
      <select
        onChange={(e) => onChangeYear(Number(e.target.value))}
        value={filterYear}
        className="bg-transparent px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest outline-none cursor-pointer text-foreground appearance-none pr-1"
      >
        {Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i).map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </ExecutiveSurface>
  );
};
