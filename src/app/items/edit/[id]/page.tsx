import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/Navbar'
import { PostListingForm } from '@/components/forms/PostListingForm'
import { redirect, notFound } from 'next/navigation'

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  const resolvedParams = await params
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: listing, error } = await supabase
    .from('item_listings')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  if (error || !listing) notFound()
  if (listing.user_id !== user.id) redirect('/items')

  return (
    <div className="flex flex-col min-h-screen bg-[#020617]">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-2xl mx-auto mb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">Edit Gear.</h1>
          <p className="text-slate-400 text-lg font-inter">Update your item details for the marketplace.</p>
        </div>

        <PostListingForm 
          user={user} 
          mode="edit" 
          listingId={listing.id}
          initialData={{ ...listing, type: 'item' }} 
        />
      </main>
    </div>
  )
}
