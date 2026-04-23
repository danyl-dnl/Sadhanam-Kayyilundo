'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2, User, School, AtSign, ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function EditProfilePage() {
  const [name, setName] = useState('')
  const [year, setYear] = useState('')
  const [instagram, setInstagram] = useState('')
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile) {
        setName(profile.name || '')
        setYear(profile.year || '')
        setInstagram(profile.instagram_handle || '')
      }
      setLoading(false)
    }

    fetchProfile()
  }, [router, supabase])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        name,
        year,
        instagram_handle: instagram,
      })

    if (error) {
      toast.error('Failed to update profile: ' + error.message)
    } else {
      toast.success('Profile updated successfully!')
      router.push('/profile')
      router.refresh()
    }
    setIsSubmitting(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />
      
      <Navbar />

      <main className="flex-1 container mx-auto px-4 pt-32 pb-20 relative z-10 flex flex-col items-center">
        <div className="w-full max-w-xl">
          <Link href="/profile" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-all mb-10 group font-bold uppercase tracking-widest text-xs">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Profile
          </Link>

          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-white mb-3 tracking-tight">Edit Profile.</h1>
            <p className="text-slate-400 font-inter">Keep your student information up to date.</p>
          </div>

          <div className="glass-card rounded-[2.5rem] p-8 md:p-10 border-white/5 shadow-2xl">
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-amber-400 transition-colors" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-amber-400/50 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Current Year</label>
                <div className="relative group">
                  <School className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-emerald-400/50 transition-all font-medium appearance-none cursor-pointer"
                  >
                    <option className="bg-slate-950" value="">Select Year</option>
                    <option className="bg-slate-950" value="1st">1st Year</option>
                    <option className="bg-slate-950" value="2nd">2nd Year</option>
                    <option className="bg-slate-950" value="3rd">3rd Year</option>
                    <option className="bg-slate-950" value="4th">4th Year</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Instagram Handle (Optional)</label>
                <div className="relative group">
                  <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-pink-400 transition-colors" />
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="@yourhandle"
                    className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-pink-400/50 transition-all font-medium"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-16 bg-white text-slate-950 hover:bg-slate-200 font-black rounded-2xl mt-4 text-lg transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                  <>
                    <Save className="h-5 w-5" />
                    Save Changes
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
