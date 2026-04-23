'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'
import { Edit3, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export function OwnerActions({ 
  listingId, 
  type 
}: { 
  listingId: string, 
  type: 'pg' | 'item' 
}) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this listing?')) return

    setIsDeleting(true)
    
    const tableName = type === 'pg' ? 'pg_listings' : 'item_listings'
    
    const { error } = await supabase
      .from(tableName)
      .update({ is_active: false }) // Soft delete for PGs
      .eq('id', listingId)

    // For items, we might want hard delete or different logic
    // But let's stick to what's in the cards
    
    if (type === 'item') {
        const { error: itemError } = await supabase
            .from('item_listings')
            .delete()
            .eq('id', listingId)
        
        if (itemError) {
            toast.error('Failed to delete listing')
            setIsDeleting(false)
            return
        }
    } else {
        if (error) {
            toast.error('Failed to delete listing')
            setIsDeleting(false)
            return
        }
    }

    toast.success('Listing deleted successfully')
    router.push(type === 'pg' ? '/pg' : '/items')
    router.refresh()
  }

  return (
    <div className="flex gap-4 mb-8">
      <Link href={type === 'pg' ? `/pg/edit/${listingId}` : `/items/edit/${listingId}`} className="flex-1">
        <Button className="w-full h-14 bg-amber-400 text-slate-950 hover:bg-amber-300 font-black rounded-2xl gap-3 text-lg transition-all shadow-xl">
          <Edit3 className="h-5 w-5" />
          Edit Listing
        </Button>
      </Link>
      <Button 
        variant="outline" 
        onClick={handleDelete}
        disabled={isDeleting}
        className="h-14 px-6 border-red-500/20 text-red-500 hover:bg-red-500/10 font-black rounded-2xl gap-3 transition-all"
      >
        {isDeleting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
      </Button>
    </div>
  )
}
