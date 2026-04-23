import { ListingSkeleton } from "@/components/listings/ListingSkeleton";

export default function PGLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="h-10 w-64 bg-slate-900 rounded-lg animate-pulse" />
            <div className="h-4 w-48 bg-slate-900 rounded-lg animate-pulse" />
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-24 bg-slate-900 rounded-lg animate-pulse" />
            <div className="h-10 w-64 bg-slate-900 rounded-lg animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ListingSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
