import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  IndianRupee, 
  Camera, 
  Phone, 
  ArrowLeft,
  Package,
  ShieldCheck,
  Sparkles,
  Clock,
  ArrowUpRight,
  Tag,
  User
} from 'lucide-react'
import Link from 'next/link'
import { MarkAsSoldButton } from '@/components/listings/MarkAsSoldButton'
import { ImageCarousel } from '@/components/listings/ImageCarousel'
import { cn } from '@/lib/utils'

export default async function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params
  
  const { data: listing, error } = await supabase
    .from('item_listings')
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
        <Link href="/items" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-all mb-10 group font-bold uppercase tracking-widest text-xs">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Sadhanam Kayyilundo
        </Link>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left: Media */}
          <div className="space-y-8">
            <div className="relative overflow-hidden rounded-[3rem] border border-white/5 bg-slate-900 shadow-2xl">
              <ImageCarousel images={listing.images} title={listing.title} aspectRatio="aspect-square" />
              {listing.is_sold && (
                <div className="absolute inset-0 flex items-center justify-center z-30 bg-slate-950/40 backdrop-blur-[2px]">
                  <span className="px-10 py-4 bg-red-500 text-white font-black rounded-[2rem] rotate-[-15deg] shadow-2xl border-4 border-white text-4xl">
                    SOLD
                  </span>
                </div>
              )}
            </div>

            <div className="glass-card rounded-[2.5rem] p-8 md:p-10 border-white/5">
              <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                <Package className="h-6 w-6 text-emerald-500" />
                Product Details
              </h3>
              <p className="text-slate-400 text-lg leading-relaxed font-inter mb-10">
                {listing.description}
              </p>


            </div>
          </div>

          {/* Right: Info & Contact */}
          <div className="space-y-8 lg:sticky lg:top-32 h-fit">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-3 items-center justify-between">
                <div className="flex gap-3">
                  <Badge className="bg-emerald-500 text-slate-950 font-black px-4 py-1.5 rounded-full border-none">
                    {listing.category}
                  </Badge>
                  <Badge className="bg-white/20 backdrop-blur-md text-white border-white/10 font-bold px-4 py-1.5 rounded-full">
                    {listing.condition}
                  </Badge>
                </div>
                {isOwner && !listing.is_sold && (
                  <MarkAsSoldButton listingId={listing.id} />
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]">
                {listing.title}
              </h1>
            </div>

            <div className="p-8 glass-card rounded-[2.5rem] border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Tag className="w-24 h-24 rotate-12" />
              </div>
              
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Asking Price</p>
              <div className="flex items-center gap-2">
                <div className="flex items-baseline text-6xl font-black text-emerald-400 tracking-tighter">
                  <IndianRupee className="h-8 w-8 self-center mr-1" />
                  <span>{listing.price.toLocaleString('en-IN')}</span>
                </div>
                {listing.is_negotiable && (
                  <Badge variant="outline" className="ml-4 border-emerald-500/20 text-emerald-400 font-black uppercase tracking-widest px-3 py-1">
                    Negotiable
                  </Badge>
                )}
              </div>
            </div>

            <div className="glass-card rounded-[2.5rem] p-8 md:p-10 border-white/5 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <User className="h-5 w-5 text-amber-400" />
                  Seller Profile
                </h3>
              </div>

              <div className="flex items-center gap-4 p-6 rounded-[2.5rem] bg-white/5 border border-white/5 group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 font-black text-2xl shadow-xl transition-transform group-hover:scale-105">
                  {listing.profiles.name?.[0] || 'U'}
                </div>
                <div>
                  <p className="text-2xl font-black text-white leading-tight">{listing.profiles.name}</p>
                  <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">
                    {listing.profiles.year} Year • Sadhanam Kayyilundo
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                {listing.contact_phone && (
                  <a href={`tel:${listing.contact_phone}`} className="block">
                    <Button className="w-full h-16 bg-white text-slate-950 hover:bg-slate-200 font-black rounded-2xl gap-4 text-xl transition-all shadow-xl">
                      <Phone className="h-6 w-6 text-emerald-500 fill-emerald-500" />
                      Contact Seller
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
                    Message on WhatsApp
                  </Button>
                </a>
              </div>

              <div className="flex items-center gap-6 justify-center pt-4 opacity-50">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  Trust Verified
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <Clock className="h-4 w-4 text-amber-500" />
                  Posted {new Date(listing.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

