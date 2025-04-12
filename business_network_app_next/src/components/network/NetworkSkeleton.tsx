export function NetworkCardSkeleton() {
  return (
    <div className="flex items-center space-x-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="h-12 w-12 flex-shrink-0 animate-pulse rounded-full bg-gray-200" />
      <div className="min-w-0 flex-1 space-y-3">
        <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
        <div className="space-y-2">
          <div className="h-3 w-2/3 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="flex gap-2">
          <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200" />
          <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200" />
        </div>
      </div>
      <div className="h-8 w-24 animate-pulse rounded-lg bg-gray-200" />
    </div>
  );
}

export function NetworkListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <NetworkCardSkeleton key={index} />
      ))}
    </div>
  );
}
