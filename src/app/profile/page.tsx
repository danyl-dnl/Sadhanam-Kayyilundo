import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { PGCard } from '@/components/listings/PGCard'
import { ItemCard } from '@/components/listings/ItemCard'
import { User, LogOut, Settings, Package, Home } from 'lucide-react'
import Link from 'next/link'

export default async function ProfilePage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const [pgs, items, profile] = await Promise.all([
    supabase.from('pg_listings').select('*, profiles(name)').eq('user_id', user.id).eq('is_active', true).order('created_at', { ascending: false }),
    supabase.from('item_listings').select('*, profiles(name)').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('profiles').select('*').eq('id', user.id).single()
  ])

  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        {/* Profile Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-emerald-500 flex items-center justify-center text-slate-900 text-4xl font-bold">
              {profile.data?.name?.[0] || 'U'}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">{profile.data?.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-400 text-sm">
                <div className="flex items-center gap-1.5">
                  <User className="h-4 w-4 text-emerald-500" />
                  <span>{profile.data?.year === '1' || profile.data?.year === 1 ? '1st Year' : 
                         profile.data?.year === '2' || profile.data?.year === 2 ? '2nd Year' : 
                         profile.data?.year === '3' || profile.data?.year === 3 ? '3rd Year' : 
                         profile.data?.year === '4' || profile.data?.year === 4 ? '4th Year' : 
                         `${profile.data?.year || 'Unknown'} Year`} Student</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-400 font-bold">@</span>
                  <span>{profile.data?.instagram_handle}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/logout">
                <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-400/10 gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* My Listings Sections */}
        <div className="space-y-16">
          {/* PGs Section */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Home className="h-6 w-6 text-amber-400" />
                <h2 className="text-2xl font-bold text-white">My PG Listings</h2>
              </div>
              <Link href="/post">
                <Button size="sm" className="bg-amber-400 text-slate-900">Add New</Button>
              </Link>
            </div>

            {pgs.data && pgs.data.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {pgs.data.map((listing: any) => (
                  <div key={listing.id} className="relative">
                    <PGCard listing={listing} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800">
                <p className="text-slate-500">You haven't listed any PGs yet.</p>
              </div>
            )}
          </section>

          {/* Items Section */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Package className="h-6 w-6 text-emerald-500" />
                <h2 className="text-2xl font-bold text-white">My Items for Sale</h2>
              </div>
              <Link href="/post">
                <Button size="sm" className="bg-emerald-500 text-slate-900">Add New</Button>
              </Link>
            </div>

            {items.data && items.data.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {items.data.map((listing: any) => (
                  <ItemCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800">
                <p className="text-slate-500">You haven't listed any items yet.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
