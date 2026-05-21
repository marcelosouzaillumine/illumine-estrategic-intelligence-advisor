import { Skeleton } from "./skeleton";

export function CardSkeleton() {
  return (
    <div className="p-6 rounded-xl border border-border bg-card/50 flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-8 w-[150px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number, columns?: number }) {
  return (
    <div className="w-full rounded-xl border border-border bg-card/50 overflow-hidden">
      <div className="border-b border-border bg-muted/50 p-4 flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`th-${i}`} className="h-4 w-full" />
        ))}
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={`tr-${i}`} className="p-4 flex gap-4">
            {Array.from({ length: columns }).map((_, j) => (
              <Skeleton key={`td-${i}-${j}`} className="h-4 w-full" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="w-full max-w-[1440px] mx-auto space-y-8 p-6">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-[300px]" />
          <Skeleton className="h-4 w-[250px]" />
        </div>
        <Skeleton className="h-10 w-[150px] rounded-lg" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={`card-${i}`} />
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ChartSkeleton />
        </div>
        <div className="space-y-6">
          <TableSkeleton rows={4} columns={2} />
        </div>
      </div>
    </div>
  );
}

export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto">
      <div className="space-y-2">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>
      
      <div className="space-y-4">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={`form-group-${i}`} className="space-y-2">
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        ))}
      </div>
      
      <div className="pt-4 flex justify-end gap-4">
        <Skeleton className="h-10 w-[100px] rounded-lg" />
        <Skeleton className="h-10 w-[120px] rounded-lg" />
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="w-full p-6 rounded-xl border border-border bg-card/50 space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-[200px]" />
        <Skeleton className="h-8 w-[100px] rounded-lg" />
      </div>
      <div className="h-[300px] w-full flex items-end justify-between gap-2 pt-8">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton 
            key={`bar-${i}`} 
            className="w-full rounded-t-sm" 
            style={{ height: `${Math.max(20, Math.random() * 100)}%` }} 
          />
        ))}
      </div>
    </div>
  );
}
