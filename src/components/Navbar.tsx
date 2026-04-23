'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Home, Package, PlusCircle, User, LogIn, Menu, X } from 'lucide-react'
import Image from 'next/image'
import { Button } from './ui/button'
import { motion, AnimatePresence } from 'framer-motion'

export function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const navLinks = [
    { href: '/pg', label: 'Hostels', icon: Home, color: 'text-amber-400' },
    { href: '/items', label: 'Market', icon: Package, color: 'text-emerald-500' },
    { href: '/post', label: 'List Property', icon: PlusCircle, color: 'text-white' },
  ]

  return (
    <nav className={cn(
      "fixed top-0 z-50 w-full transition-all duration-300 px-4 pt-4",
      scrolled ? "pt-2" : "pt-4"
    )}>
      <div className={cn(
        "container mx-auto flex h-16 items-center justify-between px-6 rounded-2xl transition-all duration-300",
        scrolled ? "glass shadow-2xl border-white/10" : "bg-transparent border-transparent"
      )}>
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-lg group-hover:scale-110 transition-transform">
            <Image 
              src="/logo.png" 
              alt="Sadhanam Kayyilundo" 
              fill
              className="object-cover mix-blend-lighten"
            />
          </div>
          <span className="text-xl font-black text-white tracking-tighter uppercase hidden sm:inline-block">Sadhanam Kayyilundo</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex md:items-center md:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group relative flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-all",
                pathname.startsWith(link.href) ? "text-white" : "text-slate-400 hover:text-white"
              )}
            >
              <link.icon className={cn("h-4 w-4 transition-transform group-hover:-translate-y-0.5", link.color)} />
              {link.label}
              {pathname.startsWith(link.href) && (
                <motion.div layoutId="nav-underline" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-emerald-500 rounded-full" />
              )}
            </Link>
          ))}
          
          <div className="h-6 w-px bg-white/10 mx-2" />

          {user ? (
            <Link href="/profile">
              <Button variant="ghost" className="rounded-xl glass border-white/5 hover:bg-white/10 gap-2 px-4">
                <User className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">Account</span>
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button className="rounded-xl bg-white text-slate-950 hover:bg-slate-200 font-bold px-6 h-10 shadow-lg">
                Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          {user && (
            <Link href="/profile">
              <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center border border-white/10">
                <User className="h-5 w-5 text-emerald-400" />
              </div>
            </Link>
          )}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-xl glass border-white/10 text-white"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-4 right-4 glass rounded-[2rem] border-white/10 p-6 md:hidden shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-4 text-xl font-black tracking-tight",
                    pathname.startsWith(link.href) ? "text-white" : "text-slate-400"
                  )}
                >
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5", link.color)}>
                    <link.icon className="h-6 w-6" />
                  </div>
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-white/10" />
              {!user ? (
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-4 text-xl font-black text-slate-400"
                >
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5">
                    <LogIn className="h-6 w-6" />
                  </div>
                  Login
                </Link>
              ) : (
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-4 text-xl font-black text-slate-400"
                >
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5">
                    <User className="h-6 w-6 text-emerald-400" />
                  </div>
                  My Profile
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
