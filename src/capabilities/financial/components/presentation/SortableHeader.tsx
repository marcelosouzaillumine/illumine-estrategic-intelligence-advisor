import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '../../../../lib/utils';

interface SortableHeaderProps {
  label: string;
  sortKey: string;
  currentSort: { key: string; direction: 'asc' | 'desc' };
  onSort: (key: string) => void;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export function SortableHeader({ label, sortKey, currentSort, onSort, align = 'left', className }: SortableHeaderProps) {
  const isSorted = currentSort.key === sortKey;
  
  return (
    <th 
      className={cn(
        "px-5 md:px-8 py-3 md:py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest cursor-pointer hover:text-primary transition-colors group",
        align === 'center' && "text-center",
        align === 'right' && "text-right",
        className
      )}
      onClick={() => onSort(sortKey)}
    >
      <div className={cn("flex items-center gap-1", align === 'center' && "justify-center", align === 'right' && "justify-end")}>
        {label}
        <div className="flex flex-col ml-1 items-center justify-center h-4">
          <ChevronUp 
            size={10} 
            className={cn(
              "transition-colors", 
              isSorted && currentSort.direction === 'asc' ? "text-secondary" : "text-muted-foreground opacity-0 group-hover:opacity-100"
            )} 
          />
          <ChevronDown 
            size={10} 
            className={cn(
              "transition-colors", 
              isSorted && currentSort.direction === 'desc' ? "text-secondary" : "text-muted-foreground opacity-0 group-hover:opacity-100"
            )} 
          />
        </div>
      </div>
    </th>
  );
}
