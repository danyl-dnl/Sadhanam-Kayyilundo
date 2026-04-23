export function ListingSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden animate-pulse">
      <div className="aspect-video w-full bg-slate-800" />
      <div className="p-5 space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-6 w-3/4 bg-slate-800 rounded" />
          <div className="h-6 w-1/4 bg-slate-800 rounded ml-4" />
        </div>
        <div className="h-4 w-1/2 bg-slate-800 rounded" />
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-slate-800 rounded-full" />
          <div className="h-5 w-16 bg-slate-800 rounded-full" />
        </div>
        <div className="pt-4 border-t border-slate-800 flex justify-between">
          <div className="h-4 w-20 bg-slate-800 rounded" />
          <div className="h-4 w-20 bg-slate-800 rounded" />
        </div>
      </div>
    </div>
  )
}
