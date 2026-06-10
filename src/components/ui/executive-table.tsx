import React from 'react';
import { cn } from '@/lib/utils';

export interface ExecutiveTableProps extends React.TableHTMLAttributes<HTMLTableElement> {}

export function ExecutiveTable({ className, ...props }: ExecutiveTableProps) {
  return (
    <div className="w-full overflow-x-auto scrollbar-premium rounded-xl border border-border">
      <table className={cn("w-full text-sm text-left", className)} {...props} />
    </div>
  );
}

export function ExecutiveTableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("text-xs uppercase bg-surface-high text-muted-foreground", className)} {...props} />;
}

export function ExecutiveTableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("divide-y divide-border", className)} {...props} />;
}

export function ExecutiveTableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn("hover:bg-surface-container transition-colors", className)} {...props} />;
}

export function ExecutiveTableHead({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={cn("px-6 py-4 font-semibold tracking-wider", className)} {...props} />;
}

export function ExecutiveTableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("px-6 py-4", className)} {...props} />;
}
