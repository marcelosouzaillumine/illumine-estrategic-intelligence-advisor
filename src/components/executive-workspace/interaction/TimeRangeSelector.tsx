import React, { useState } from 'react';

export type TimeRange = 'mtd' | 'qtd' | 'ytd' | '1y' | '3y' | '5y';

interface TimeRangeSelectorProps {
  defaultRange?: TimeRange;
  onChange?: (range: TimeRange) => void;
  className?: string;
}

export function TimeRangeSelector({ defaultRange = 'ytd', onChange, className = '' }: TimeRangeSelectorProps) {
  const [active, setActive] = useState<TimeRange>(defaultRange);
  const options: { value: TimeRange; label: string }[] = [
    { value: 'mtd', label: 'MTD' },
    { value: 'qtd', label: 'QTD' },
    { value: 'ytd', label: 'YTD' },
    { value: '1y', label: '1A' },
    { value: '3y', label: '3A' },
    { value: '5y', label: '5A' }
  ];

  const handleSelect = (val: TimeRange) => {
    setActive(val);
    onChange?.(val);
  };

  return (
    <div className={`inline-flex items-center p-1 rounded-lg bg-black/20 border border-white/5 ${className}`}>
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => handleSelect(opt.value)}
          className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
            active === opt.value
              ? 'bg-primary/20 text-primary shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
