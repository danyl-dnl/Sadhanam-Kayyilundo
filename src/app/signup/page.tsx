'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2, Mail, Lock, User, Camera, Sparkles, School } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [year, setYear] = useState('1st')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        }
      }
    })

    if (signupError) {
      toast.error(signupError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        name,
        year,
      })

      if (profileError) {
        console.error(profileError)
      }

      toast.success('Account created! Please check your email.')
      router.push('/login')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 group mb-6">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-2xl group-hover:scale-105 transition-transform">
              <Image 
                src="/logo.png" 
                alt="Logo" 
                fill
                className="object-cover mix-blend-lighten"
              />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter uppercase">Sadhanam Kayyilundo</span>
          </Link>
          <h1 className="text-4xl font-black text-white mb-3 tracking-tight">Join the Community.</h1>
          <p className="text-slate-400 font-inter">Create your student profile and start trading.</p>
        </div>

        <div className="glass-card rounded-[2.5rem] p-8 md:p-10 border-white/5">
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-amber-400/50 transition-all font-medium placeholder:text-slate-600"
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
                    <option className="bg-slate-950">1st Year</option>
                    <option className="bg-slate-950">2nd Year</option>
                    <option className="bg-slate-950">3rd Year</option>
                    <option className="bg-slate-950">4th Year</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">College Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@gmail.com"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-emerald-400/50 transition-all font-medium placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Secure Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-amber-400 transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-amber-400/50 transition-all font-medium placeholder:text-slate-600"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-white text-slate-950 hover:bg-slate-200 font-black rounded-2xl mt-4 text-lg transition-all shadow-xl disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : 'Create Account'}
            </Button>
          </form>

          <div className="mt-10 pt-10 border-t border-white/5 text-center">
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
              Already a member?{' '}
              <Link href="/login" className="text-amber-400 hover:text-amber-300 transition-colors ml-2">
                Log in instead
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
