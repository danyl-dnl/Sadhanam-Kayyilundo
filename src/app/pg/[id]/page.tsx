import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  IndianRupee, 
  Calendar, 
  Users, 
  Camera, 
  Phone, 
  CheckCircle2, 
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Clock
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { ImageCarousel } from '@/components/listings/ImageCarousel'

import { OwnerActions } from '@/components/listings/OwnerActions'

export default async function PGDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params
  
  const { data: listing, error } = await supabase
    .from('pg_listings')
    .select('*, profiles(*)')
    .eq('id', id)
    .single()

  if (!listing || error) {
    notFound()
  }

  const { data: { user } } = await supabase.auth.getUser()
  const isOwner = user?.id === listing.user_id

  return (
    <div className="flex flex-col min-h-screen bg-[#020617]">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 pt-32 pb-20">
        <Link href="/pg" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-all mb-10 group font-bold uppercase tracking-widest text-xs">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Listings
        </Link>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left: Media & Description */}
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="relative overflow-hidden rounded-[2.5rem] border border-white/5 shadow-2xl">
                <ImageCarousel images={listing.images} title={listing.title} aspectRatio="aspect-video" />
              </div>
            </div>

            <div className="glass-card rounded-[2.5rem] p-8 md:p-10 border-white/5">
              <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-amber-400" />
                About this stay
              </h3>
              <p className="text-slate-400 text-lg leading-relaxed font-inter mb-8">
                {listing.description}
              </p>

              <h3 className="text-xl font-black text-white mb-6">Included Amenities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {listing.amenities.map((amenity: string) => (
                  <div key={amenity} className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 text-slate-300 transition-colors hover:bg-white/10 hover:border-white/10">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <span className="font-bold text-sm uppercase tracking-wider">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Info & Contact */}
          <div className="space-y-8 lg:sticky lg:top-32 h-fit">
            {isOwner && <OwnerActions listingId={listing.id} type="pg" />}
            
            <div className="space-y-6">
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-amber-400 text-slate-950 font-black px-4 py-1.5 rounded-full border-none">
                  {listing.room_type}
                </Badge>
                <Badge className="bg-emerald-500 text-slate-950 font-black px-4 py-1.5 rounded-full border-none">
                  {listing.gender_preference} ONLY
                </Badge>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                {listing.title}
              </h1>
              
              <div className="flex items-center gap-3 text-slate-400 font-bold">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-emerald-500" />
                </div>
                <span className="text-lg">{listing.location}, Thrikkakara</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-8 glass-card rounded-[2.5rem] border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <IndianRupee className="w-20 h-20" />
              </div>
              
              <div className="relative z-10">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Monthly Rent</p>
                <div className="flex items-baseline text-3xl md:text-4xl font-black text-amber-400">
                  <IndianRupee className="h-5 w-5 md:h-6 md:w-6 self-center mr-1" />
                  <span>{listing.rent.toLocaleString('en-IN')}</span>
                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-2">/mo</span>
                </div>
              </div>
              
              <div className="relative z-10">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Deposit</p>
                <div className="flex items-baseline text-3xl md:text-4xl font-black text-white">
                  <IndianRupee className="h-5 w-5 md:h-6 md:w-6 self-center mr-1" />
                  <span>{listing.deposit.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-[2.5rem] p-8 md:p-10 border-white/5 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-white">Connect with Seller</h3>
              </div>

              <div className="flex items-center gap-4 p-5 rounded-[2rem] bg-white/5 border border-white/5">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-black text-xl md:text-2xl shadow-xl shrink-0">
                  {listing.profiles.name[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-lg md:text-xl font-black text-white leading-tight truncate">{listing.profiles.name}</p>
                  <p className="text-slate-500 font-bold text-[10px] md:text-xs uppercase tracking-widest mt-1 truncate">
                    {(() => {
                      const y = listing.profiles.year;
                      if (!y) return 'Year Not Specified';
                      if (String(y).toLowerCase().includes('1') || String(y).toLowerCase().includes('first')) return '1st Year';
                      if (String(y).toLowerCase().includes('2') || String(y).toLowerCase().includes('second')) return '2nd Year';
                      if (String(y).toLowerCase().includes('3') || String(y).toLowerCase().includes('third')) return '3rd Year';
                      if (String(y).toLowerCase().includes('4') || String(y).toLowerCase().includes('fourth')) return '4th Year';
                      return String(y).toLowerCase().includes('year') ? y : `${y} Year`;
                    })()} • MEC Thrikkakara
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                {listing.contact_phone && (
                  <a href={`tel:${listing.contact_phone}`} className="block">
                    <Button className="w-full h-16 bg-white text-slate-950 hover:bg-slate-200 font-black rounded-2xl gap-4 text-xl transition-all shadow-xl">
                      <Phone className="h-6 w-6 text-emerald-500 fill-emerald-500" />
                      Call Seller Now
                    </Button>
                  </a>
                )}
                
                <a 
                  href={`https://wa.me/${listing.contact_phone?.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button variant="outline" className="w-full h-16 border-white/10 glass text-white hover:bg-white/5 font-black rounded-2xl gap-3 text-lg transition-all">
                    Chat on WhatsApp
                  </Button>
                </a>
              </div>

              <div className="flex items-center gap-6 justify-center pt-4 opacity-50">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  MEC Verified
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <Clock className="h-4 w-4 text-amber-500" />
                  Listed {new Date(listing.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
