'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2, CheckCircle, PackageCheck } from 'lucide-react'

export function MarkAsSoldButton({ listingId }: { listingId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleMarkAsSold = async () => {
    if (!confirm('Are you sure you want to mark this item as sold? This action is permanent.')) return
    
    setLoading(true)
    const { error } = await supabase
      .from('item_listings')
      .update({ is_sold: true })
      .eq('id', listingId)

    if (error) {
      toast.error('Failed to update listing')
    } else {
      toast.success('Listing updated successfully!')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <Button 
      onClick={handleMarkAsSold} 
      disabled={loading}
      className="bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-black rounded-2xl gap-3 shadow-lg shadow-emerald-500/20 px-6 py-6"
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <PackageCheck className="h-5 w-5" />
      )}
      Mark as Sold
    </Button>
  )
}
