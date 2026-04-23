import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/Navbar'
import { ItemCard } from '@/components/listings/ItemCard'
import { Button } from '@/components/ui/button'
import { Search, SlidersHorizontal, Tag, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default async function ItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient()
  const resolvedParams = await searchParams
  
  const category = resolvedParams.category as string
  const sort = resolvedParams.sort as string
  const search = resolvedParams.search as string

  let query = supabase
    .from('item_listings')
    .select('*, profiles(name)')
    .eq('is_sold', false)
    .order('created_at', { ascending: false })

  if (category && category !== 'All') query = query.eq('category', category)
  if (search) query = query.ilike('title', `%${search}%`)
  
  if (sort === 'price_low') query = query.order('price', { ascending: true })
  if (sort === 'price_high') query = query.order('price', { ascending: false })

  const { data: listings, error } = await query

  const categories = ['All', 'Electronics', 'Furniture', 'Kitchen', 'Books', 'Misc']

  return (
    <div className="flex flex-col min-h-screen bg-[#020617]">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 pt-32 pb-20">
        {/* Header Section */}
        <div className="relative mb-12">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">
                <Sparkles className="h-3 w-3" />
                Live Marketplace
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">The Campus Shop.</h1>
              <p className="text-slate-400 text-lg font-inter">
                Exclusive deals on essentials from your fellow MECians. 
                Buy, sell, and trade within the community.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search gear..." 
                  className="bg-slate-900/50 backdrop-blur-xl border border-white/5 text-white text-sm rounded-xl pl-11 pr-4 py-3 w-full md:w-80 focus:outline-none focus:border-emerald-500/50 transition-all shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Categories Tab Bar */}
        <div className="flex items-center gap-3 overflow-x-auto pb-6 mb-12 no-scrollbar">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/items?category=${cat}`}
              className={cn(
                "px-6 py-3 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all border shrink-0",
                (category === cat || (!category && cat === 'All'))
                  ? "bg-white border-white text-slate-950 shadow-[0_0_20px_rgba(255,255,255,0.1)] scale-105"
                  : "bg-white/5 border-white/5 text-slate-500 hover:border-white/10 hover:text-white"
              )}
            >
              {cat}
            </Link>
          ))}
        </div>

        {listings && listings.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {listings.map((listing: any) => (
              <ItemCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center glass-card rounded-[3rem] border-white/5">
            <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mb-8 rotate-12">
              <Tag className="h-12 w-12 text-slate-700" />
            </div>
            <h3 className="text-2xl font-black text-white mb-3">No gear found.</h3>
            <p className="text-slate-500 max-w-sm font-inter mb-8">
              Looks like everything in this category has been snatched up! Why not list something of your own?
            </p>
            <Link href="/post">
              <Button className="h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-10">
                Post an Item
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
