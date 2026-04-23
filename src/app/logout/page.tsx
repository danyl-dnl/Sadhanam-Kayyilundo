'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function LogoutPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const logout = async () => {
      await supabase.auth.signOut()
      toast.success('Logged out successfully')
      router.push('/')
      router.refresh()
    }
    logout()
  }, [router, supabase.auth])

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-white text-center">
        <p className="text-xl font-medium mb-4">Logging out...</p>
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  )
}
