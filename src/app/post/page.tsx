import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { PostListingForm } from '@/components/forms/PostListingForm'
import { Sparkles } from 'lucide-react'

export default async function PostPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#020617] relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />
      
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 pt-32 pb-20 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-amber-400 font-black text-[10px] uppercase tracking-[0.2em] mb-4">
            <Sparkles className="h-3 w-3" />
            Join the Marketplace
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight">
            Create a New <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-emerald-500">Listing.</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto font-inter">
            Reach hundreds of students in the MEC campus. Post your PG rooms or sell your items in minutes.
          </p>
        </div>

        <PostListingForm user={user} />
      </main>
    </div>
  )
}
