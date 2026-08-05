import React from 'react';
import { ExecutiveAction, ExecutiveActionVariant } from '../foundation/ExecutiveAction';
import { Search } from 'lucide-react';

interface DrillDownButtonProps {
  target: string; // The ID or path to drill down into
  label?: string;
  variant?: ExecutiveActionVariant;
  onClick?: (target: string) => void;
}

export function DrillDownButton({ target, label = 'Investigar Mais', variant = 'secondary', onClick }: DrillDownButtonProps) {
  return (
    <ExecutiveAction 
      variant={variant}
      size="sm" 
      icon={Search}
      onClick={() => onClick?.(target)}
      className="w-full sm:w-auto"
    >
      {label}
    </ExecutiveAction>
  );
}
