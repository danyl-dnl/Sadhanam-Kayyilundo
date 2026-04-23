'use client'

import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

export function PGSearch({ 
  currentLocation, 
  currentRoomType, 
  currentGender 
}: { 
  currentLocation?: string, 
  currentRoomType?: string, 
  currentGender?: string 
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(currentLocation || '')
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (search) params.set('location', search)
    else params.delete('location')
    router.push(`/pg?${params.toString()}`)
  }

  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'All') params.delete(key)
    else params.set(key, value)
    router.push(`/pg?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push('/pg')
    setSearch('')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <Button 
          onClick={() => setShowFilters(!showFilters)}
          variant="outline" 
          className={cn(
            "h-12 rounded-xl border-white/10 glass text-white hover:bg-white/5 font-bold gap-2 transition-all",
            showFilters && "bg-amber-400 text-slate-950 hover:bg-amber-300 border-none"
          )}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
        
        <form onSubmit={handleSearch} className="relative group flex-1 md:flex-none">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-amber-400 transition-colors" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search area (e.g. Thrikkakara)..." 
            className="bg-slate-900/50 backdrop-blur-xl border border-white/5 text-white text-sm rounded-xl pl-11 pr-4 py-3 w-full md:w-80 focus:outline-none focus:border-amber-400/50 transition-all shadow-2xl"
          />
        </form>

        {(currentLocation || currentRoomType || currentGender) && (
          <Button 
            onClick={clearFilters}
            variant="ghost" 
            className="text-slate-500 hover:text-white gap-2 font-bold uppercase tracking-widest text-[10px]"
          >
            <X className="h-3 w-3" />
            Clear All
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="glass-card rounded-3xl p-6 border-white/5 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Room Type</label>
              <div className="flex flex-wrap gap-2">
                {['All', 'Single', 'Double Sharing', 'Triple Sharing'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilter('room_type', type)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                      (currentRoomType === type || (!currentRoomType && type === 'All'))
                        ? "bg-amber-400 text-slate-950"
                        : "bg-white/5 text-slate-400 hover:bg-white/10"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Gender Preference</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'All', value: 'All' },
                  { label: 'Boys', value: 'Male' },
                  { label: 'Girls', value: 'Female' },
                  { label: 'Any', value: 'Any' }
                ].map((pref) => (
                  <button
                    key={pref.label}
                    onClick={() => setFilter('gender', pref.value)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                      (currentGender === pref.value || (!currentGender && pref.value === 'All'))
                        ? "bg-amber-400 text-slate-950"
                        : "bg-white/5 text-slate-400 hover:bg-white/10"
                    )}
                  >
                    {pref.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
