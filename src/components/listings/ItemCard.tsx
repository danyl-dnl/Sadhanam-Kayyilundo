'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Package, IndianRupee, Tag, ShieldCheck, ArrowUpRight, Edit3, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Badge } from '../ui/badge'
import { motion } from 'framer-motion'

import { ImageCarousel } from './ImageCarousel'

interface ItemListing {
  id: string
  title: string
  category: string
  condition: string
  price: number
  is_negotiable: boolean
  is_sold: boolean
  images: string[]
  user_id: string
  profiles: {
    name: string
  }
}

export function ItemCard({ listing }: { listing: ItemListing }) {
  const router = useRouter()
  const supabase = createClient()
  const [isOwner, setIsOwner] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const mainImage = listing.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'

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
    
    if (!confirm('Are you sure you want to delete this item?')) return

    setIsDeleting(true)
    const { error } = await supabase
      .from('item_listings')
      .delete() // Hard delete for items as requested
      .eq('id', listing.id)

    if (error) {
      toast.error('Failed to delete item')
      setIsDeleting(false)
    } else {
      toast.success('Item deleted')
      router.refresh()
    }
  }

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Link href={`/items/${listing.id}`}>
        <div className="glass-card rounded-[2rem] overflow-hidden flex flex-col h-full group">
          <div className="relative aspect-square w-full overflow-hidden">
            <ImageCarousel images={listing.images} title={listing.title} />
            
            <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-20">
              <Badge className="bg-emerald-500 text-slate-950 font-bold border-none">
                {listing.category}
              </Badge>
              <Badge className="bg-white/20 backdrop-blur-md text-white border-white/10 font-bold">
                {listing.condition}
              </Badge>
            </div>

            {isOwner && (
              <div className="absolute bottom-12 right-3 flex gap-1.5 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Link 
                  href={`/items/edit/${listing.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="w-7 h-7 rounded-lg bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/10 text-white hover:bg-emerald-500 hover:text-slate-950 transition-all shadow-lg"
                >
                  <Edit3 className="h-3 w-3" />
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-7 h-7 rounded-lg bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/10 text-white hover:bg-red-500 transition-all shadow-lg disabled:opacity-50"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            )}

            {listing.is_sold && (
              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-10">
                <span className="px-6 py-2 bg-red-500 text-white font-black rounded-xl rotate-[-15deg] shadow-2xl border-2 border-white">
                  SOLD
                </span>
              </div>
            )}

            <div className="absolute bottom-4 right-4 z-20">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
          
          <div className="p-6 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-emerald-400 font-black text-2xl">
                <IndianRupee className="h-5 w-5" />
                <span>{listing.price.toLocaleString('en-IN')}</span>
              </div>
              {listing.is_negotiable && (
                <div className="text-[10px] font-black text-emerald-500/70 border border-emerald-500/20 px-2 py-0.5 rounded-md uppercase tracking-widest">
                  Negotiable
                </div>
              )}
            </div>

            <h3 className="text-xl font-black text-white mb-6 line-clamp-2 group-hover:text-emerald-400 transition-colors leading-tight">
              {listing.title}
            </h3>

            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 font-black text-[10px]">
                  {listing.profiles.name?.[0] || 'U'}
                </div>
                <span className="text-xs font-bold text-slate-400 truncate max-w-[100px]">{listing.profiles.name}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active Post
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
