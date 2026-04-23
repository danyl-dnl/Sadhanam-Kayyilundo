'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2, Mail, Lock, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Logged in successfully!')
      router.push('/')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 group mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-emerald-500 flex items-center justify-center group-hover:rotate-12 transition-transform shadow-2xl">
              <Sparkles className="h-7 w-7 text-slate-950" />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter uppercase">Sadhanam Kayyilundo</span>
          </Link>
          <h1 className="text-4xl font-black text-white mb-3 tracking-tight">Welcome Back.</h1>
          <p className="text-slate-400 font-inter">Sign in to your student account.</p>
        </div>

        <div className="glass-card rounded-[2.5rem] p-8 md:p-10 border-white/5">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-amber-400 transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@mec.ac.in"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-amber-400/50 transition-all font-medium placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Password</label>
                <Link href="#" className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] hover:text-amber-300">Forgot?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-emerald-400/50 transition-all font-medium placeholder:text-slate-600"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-white text-slate-950 hover:bg-slate-200 font-black rounded-2xl mt-4 text-lg transition-all shadow-xl disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : 'Log In'}
            </Button>
          </form>

          <div className="mt-10 pt-10 border-t border-white/5 text-center">
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
              New to MEC Market?{' '}
              <Link href="/signup" className="text-emerald-400 hover:text-emerald-300 transition-colors ml-2">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
