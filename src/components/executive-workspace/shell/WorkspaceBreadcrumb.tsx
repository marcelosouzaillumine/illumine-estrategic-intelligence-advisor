import React from 'react';
import { ChevronRight } from 'lucide-react';

interface WorkspaceBreadcrumbProps {
  officeName: string;
  surfaceName: string;
}

export function WorkspaceBreadcrumb({ officeName, surfaceName }: WorkspaceBreadcrumbProps) {
  return (
    <div className="flex items-center text-sm text-muted-foreground whitespace-nowrap">
      <span className="font-medium hover:text-foreground cursor-pointer transition-colors">
        {officeName}
      </span>
      <ChevronRight className="w-4 h-4 mx-2 text-border" />
      <span className="font-semibold text-foreground">
        {surfaceName}
      </span>
    </div>
  );
}
