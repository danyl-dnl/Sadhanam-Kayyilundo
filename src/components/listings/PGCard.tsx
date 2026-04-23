'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Home, MapPin, IndianRupee, Users, Calendar, ArrowUpRight, Edit3, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Badge } from '../ui/badge'
import { motion } from 'framer-motion'

interface PGListing {
  id: string
  title: string
  room_type: string
  location: string
  rent: number
  amenities: string[]
  available_from: string
  gender_preference: string
  images: string[]
  user_id: string
  profiles: {
    name: string
  }
}

export function PGCard({ listing }: { listing: PGListing }) {
  const router = useRouter()
  const supabase = createClient()
  const [isOwner, setIsOwner] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const mainImage = listing.images[0] || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800'

  useEffect(() => {
    const checkOwner = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user && user.id === listing.user_id) {
        setIsOwner(true)
      }
    }
    checkOwner()
  }, [listing.user_id])

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!confirm('Are you sure you want to delete this listing?')) return

    setIsDeleting(true)
    const { error } = await supabase
      .from('pg_listings')
      .update({ is_active: false }) // Soft delete
      .eq('id', listing.id)

    if (error) {
      toast.error('Failed to delete listing')
      setIsDeleting(false)
    } else {
      toast.success('Listing deleted')
      router.refresh()
    }
  }

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Link href={`/pg/${listing.id}`}>
        <div className="glass-card rounded-[2rem] overflow-hidden flex flex-col h-full group">
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <Image
              src={mainImage}
              alt={listing.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
            
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <Badge className="bg-amber-400 text-slate-950 font-bold border-none">
                {listing.room_type}
              </Badge>
              <Badge className="bg-white/20 backdrop-blur-md text-white border-white/10 font-bold">
                {listing.gender_preference}
              </Badge>
            </div>

            {isOwner && (
              <div className="absolute top-4 right-4 flex gap-2 z-30">
                <Link 
                  href={`/pg/edit/${listing.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/10 text-white hover:bg-amber-400 hover:text-slate-950 transition-all shadow-xl"
                >
                  <Edit3 className="h-4 w-4" />
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/10 text-white hover:bg-red-500 transition-all shadow-xl disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
              <div className="flex items-center gap-1 font-black text-2xl">
                <IndianRupee className="h-5 w-5 text-amber-400" />
                <span>{listing.rent.toLocaleString('en-IN')}</span>
                <span className="text-white/60 text-xs font-bold uppercase tracking-widest ml-1">/mo</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="h-5 w-5" />
              </div>
            </div>
          </div>
          
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-xl font-black text-white mb-2 line-clamp-1 group-hover:text-amber-400 transition-colors">
              {listing.title}
            </h3>

            <div className="flex items-center gap-2 text-slate-500 text-sm mb-6 font-medium">
              <MapPin className="h-4 w-4 text-emerald-500" />
              <span>{listing.location}</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {listing.amenities.slice(0, 3).map((amenity) => (
                <div key={amenity} className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {amenity}
                </div>
              ))}
              {listing.amenities.length > 3 && (
                <div className="text-[10px] text-slate-600 font-bold self-center">+{listing.amenities.length - 3}</div>
              )}
            </div>

            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-black text-[10px]">
                  {listing.profiles.name[0]}
                </div>
                <span className="text-xs font-bold text-slate-400 truncate max-w-[100px]">{listing.profiles.name}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Available
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
