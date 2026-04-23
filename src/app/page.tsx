'use client'

import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { ArrowRight, Home as HomeIcon, Package, Users, CheckCircle, ShieldCheck, Sparkles, Camera, Zap } from 'lucide-react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function Home() {
  const [stats, setStats] = useState({ pgs: 0, items: 0 })
  const supabase = createClient()

  useEffect(() => {
    async function fetchStats() {
      const [pgCount, itemCount] = await Promise.all([
        supabase.from('pg_listings').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('item_listings').select('*', { count: 'exact', head: true }).eq('is_sold', false)
      ])
      setStats({
        pgs: pgCount.count || 0,
        items: itemCount.count || 0
      })
    }
    fetchStats()
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-[#020617] selection:bg-emerald-500/30">
      <Navbar />
      
      <main className="flex-1 relative">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-500/10 blur-[120px]" />
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-blue-500/10 blur-[120px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
        </div>

        {/* Hero Section */}
        <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 mb-8"
              >
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-300">MEC Marketplace</span>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative w-full max-w-4xl mx-auto h-[350px] md:h-[500px] mb-12"
              >
                <Image 
                  src="/logo.png" 
                  alt="Sadhanam Kayyilundo?" 
                  fill
                  priority
                  className="object-contain mix-blend-lighten [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]"
                />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-inter"
              >
                The community destination for MECians to find PGs and trade essentials. 
                Built by students, for the community of Model Engineering College.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-6"
              >
                <Link href="/pg" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-white text-slate-950 hover:bg-slate-200 font-bold text-lg transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                    Browse PGs
                    <HomeIcon className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/items" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 rounded-2xl border-white/10 glass text-white hover:bg-white/5 font-bold text-lg transition-all">
                    Shop Gear
                    <Package className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>

              {/* Trust Badge */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="mt-20 flex flex-wrap justify-center items-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  <span className="font-bold tracking-widest text-sm uppercase">MECians Only</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  <span className="font-bold tracking-widest text-sm uppercase">Instant Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span className="font-bold tracking-widest text-sm uppercase">Peer-to-Peer</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {[
                { label: 'Active PG Listings', value: stats.pgs, color: 'from-amber-400 to-orange-500' },
                { label: 'Live Marketplace Items', value: stats.items, color: 'from-emerald-400 to-teal-500' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card rounded-3xl p-8 text-center group"
                >
                  <div className={`text-4xl font-black mb-2 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform`}>
                    {stat.value}
                  </div>
                  <div className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-24 bg-slate-950/50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div className="max-w-xl">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Designed for MEC.</h2>
                <p className="text-slate-400 text-lg font-inter">
                  We've streamlined the process of settling into college life. From finding your first roommate to selling your final year project components.
                </p>
              </div>
              <Link href="/post">
                <Button size="lg" className="h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-8">
                  Start Listing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="group relative aspect-[16/9] rounded-[2.5rem] overflow-hidden glass-card p-1">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=1200" 
                  alt="PG Rooms" 
                  className="absolute inset-0 w-full h-full object-cover grayscale opacity-30 group-hover:scale-110 group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute bottom-8 left-8 z-20">
                  <h3 className="text-3xl font-black text-white mb-2">Hostels & PGs</h3>
                  <p className="text-slate-400 font-medium mb-6">Stays near MEC Thrikkakara.</p>
                  <Link href="/pg">
                    <Button variant="link" className="text-amber-400 p-0 font-bold text-lg hover:text-amber-300">
                      View Listings <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="group relative aspect-[16/9] rounded-[2.5rem] overflow-hidden glass-card p-1">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1200" 
                  alt="Marketplace" 
                  className="absolute inset-0 w-full h-full object-cover grayscale opacity-30 group-hover:scale-110 group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute bottom-8 left-8 z-20">
                  <h3 className="text-3xl font-black text-white mb-2">Student Market</h3>
                  <p className="text-slate-400 font-medium mb-6">Electronics, books, and college gear.</p>
                  <Link href="/items">
                    <Button variant="link" className="text-emerald-400 p-0 font-bold text-lg hover:text-emerald-300">
                      Explore Shop <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-white/5 bg-[#020617] relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-3 text-2xl font-black text-white mb-6">
                <div className="relative w-10 h-10 rounded-lg overflow-hidden">
                  <Image 
                    src="/logo.png" 
                    alt="Logo" 
                    fill
                    className="object-cover mix-blend-lighten"
                  />
                </div>
                SADHANAM KAYYILUNDO
              </Link>
              <p className="text-slate-500 max-w-sm font-inter leading-relaxed">
                The official community-driven marketplace for students of Government Model Engineering College, Thrikkakara.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Navigation</h4>
              <ul className="space-y-4 text-slate-500 font-medium">
                <li><Link href="/pg" className="hover:text-amber-400 transition-colors">PG Rentals</Link></li>
                <li><Link href="/items" className="hover:text-emerald-400 transition-colors">Campus Market</Link></li>
                <li><Link href="/post" className="hover:text-white transition-colors">Post Listing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Help</h4>
              <ul className="space-y-4 text-slate-500 font-medium">
                <li><Link href="/support" className="hover:text-white transition-colors">Student Support</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-600 text-sm font-inter">
              © 2026 Sadhanam Kayyilundo. Built by <span className="text-slate-400 font-bold">Danyl</span> for the MEC Community.
            </p>
            <Link 
              href="https://docs.google.com/forms/d/e/1FAIpQLSfT08DX66z_8gdU-dzErUo2VuGYG41UNHoJTbDctXbBlZQzBw/viewform?usp=sf_link" 
              target="_blank"
              className="text-slate-500 hover:text-amber-400 text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
            >
              Report a bug / Feedback
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
