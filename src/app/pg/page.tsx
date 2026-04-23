import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/Navbar'
import { PGCard } from '@/components/listings/PGCard'
import { Button } from '@/components/ui/button'
import { PGSearch } from '@/components/PGSearch'
import { MapPin, Search } from 'lucide-react'

export default async function PGPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient()
  const resolvedParams = await searchParams
  
  const location = resolvedParams.location as string
  const roomType = resolvedParams.room_type as string
  const gender = resolvedParams.gender as string

  let query = supabase
    .from('pg_listings')
    .select('*, profiles(name, year)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (location) query = query.ilike('location', `%${location}%`)
  if (roomType) query = query.eq('room_type', roomType)
  if (gender) query = query.eq('gender_preference', gender)

  const { data: listings, error } = await query

  return (
    <div className="flex flex-col min-h-screen bg-[#020617]">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 pt-32 pb-20">
        {/* Header Section */}
        <div className="relative mb-16">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-400/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold uppercase tracking-widest mb-4">
                <MapPin className="h-3 w-3" />
                MEC Thrikkakara
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">Hostel Stays.</h1>
              <p className="text-slate-400 text-lg font-inter">
                Hostels and PGs curated for Model Engineering College students. 
                Find your second home with confidence.
              </p>
            </div>
            
            <PGSearch 
              currentLocation={location}
              currentRoomType={roomType}
              currentGender={gender}
            />
          </div>
        </div>

        {/* Listings Grid */}
        {listings && listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {listings.map((listing: any) => (
              <PGCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center glass-card rounded-[3rem] border-white/5">
            <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mb-8 rotate-12">
              <Search className="h-12 w-12 text-slate-700" />
            </div>
            <h3 className="text-2xl font-black text-white mb-3">No listings found.</h3>
            <p className="text-slate-500 max-w-sm font-inter">
              We couldn't find any PGs matching your current search. Try broadening your filters or checking back later.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
