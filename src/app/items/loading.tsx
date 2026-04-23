import { ListingSkeleton } from "@/components/listings/ListingSkeleton";

export default function ItemsLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="space-y-2">
            <div className="h-10 w-64 bg-slate-900 rounded-lg animate-pulse" />
            <div className="h-4 w-48 bg-slate-900 rounded-lg animate-pulse" />
          </div>
          <div className="h-10 w-64 bg-slate-900 rounded-lg animate-pulse" />
        </div>
        
        {/* Categories Tabs Skeleton */}
        <div className="flex gap-2 mb-8 overflow-x-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 w-24 bg-slate-900 rounded-full animate-pulse flex-shrink-0" />
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <ListingSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
