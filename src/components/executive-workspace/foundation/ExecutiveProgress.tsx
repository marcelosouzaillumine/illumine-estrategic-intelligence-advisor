import React from 'react';

interface ExecutiveProgressProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  colorClass?: string;
  className?: string;
}

export function ExecutiveProgress({ 
  value, 
  max = 100, 
  label, 
  colorClass = 'bg-primary',
  className = '' 
}: ExecutiveProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between text-xs mb-1">
          <span className="font-medium text-muted-foreground">{label}</span>
          <span className="font-semibold">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ease-in-out ${colorClass}`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
