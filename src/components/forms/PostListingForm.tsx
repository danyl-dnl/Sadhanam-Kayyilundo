'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { Home, Package, Upload, X, Loader2, IndianRupee, MapPin, Camera, Phone, Sparkles, Tag } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

const pgSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  room_type: z.string().min(1, 'Please select a room type'),
  location: z.string().min(3, 'Location is required'),
  rent: z.number().min(1, 'Rent must be positive'),
  deposit: z.number().min(0, 'Deposit must be 0 or more'),
  available_from: z.string().min(1, 'Date is required'),
  gender_preference: z.string().min(1, 'Please select gender preference'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  contact_phone: z.string().min(10, 'Valid phone number is required'),
})

const itemSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  category: z.string().min(1, 'Please select a category'),
  condition: z.string().min(1, 'Please select condition'),
  price: z.number().min(1, 'Price must be positive'),
  is_negotiable: z.boolean().default(false),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  contact_phone: z.string().min(10, 'Valid phone number is required'),
})

export function PostListingForm({ 
  user, 
  initialData, 
  listingId, 
  mode = 'create' 
}: { 
  user: any, 
  initialData?: any, 
  listingId?: string,
  mode?: 'create' | 'edit'
}) {
  const [type, setType] = useState<'pg' | 'item'>(initialData?.type || 'pg')
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>(initialData?.images || [])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const pgForm = useForm({
    resolver: zodResolver(pgSchema),
    defaultValues: initialData?.type === 'pg' ? initialData : {
      title: '',
      room_type: 'Single',
      location: '',
      rent: 0,
      deposit: 0,
      available_from: '',
      gender_preference: 'Any',
      description: '',
      contact_phone: '',
    }
  })

  const itemForm = useForm({
    resolver: zodResolver(itemSchema),
    defaultValues: initialData?.type === 'item' ? initialData : {
      title: '',
      category: 'Electronics',
      condition: 'Good',
      price: 0,
      is_negotiable: false,
      description: '',
      contact_phone: '',
    }
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).slice(0, 4 - images.length)
      setImages([...images, ...newFiles])
      
      const newPreviews = newFiles.map(file => URL.createObjectURL(file))
      setPreviews([...previews, ...newPreviews])
    }
  }

  const removeImage = (index: number) => {
    const removedPreview = previews[index]
    
    // If it's a new upload (blob URL), we need to remove the corresponding File object
    if (removedPreview.startsWith('blob:')) {
      // Find which index in the 'images' array this blob belongs to
      // We can track this by keeping another state or just filtering.
      // Simpler: find the blob URL's position relative to other blobs.
      const blobIndex = previews.slice(0, index).filter(p => p.startsWith('blob:')).length
      const newFiles = [...images]
      newFiles.splice(blobIndex, 1)
      setImages(newFiles)
    }

    const newPreviews = [...previews]
    newPreviews.splice(index, 1)
    setPreviews(newPreviews)
  }

  const onError = (errors: any) => {
    const errorMessages = Object.values(errors).map((err: any) => err.message)
    
    if (mode === 'create' && images.length === 0) {
      errorMessages.push('Please upload at least one image')
    }

    toast.error('Missing or Invalid Fields', {
      description: errorMessages.join(' • ')
    })
  }

  const onSubmit = async (data: any) => {
    if (mode === 'create' && images.length === 0) {
      toast.error('Missing Required Fields', {
        description: 'Please upload at least one image'
      })
      return
    }

    setIsSubmitting(true)
    try {
      const uploadedUrls = []
      for (const file of images) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${user.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('listing-images')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('listing-images')
          .getPublicUrl(filePath)
        
        uploadedUrls.push(publicUrl)
      }

      const tableName = type === 'pg' ? 'pg_listings' : 'item_listings'
      
      // Get existing images that weren't removed from the previews
      const existingRemainingImages = previews.filter(p => !p.startsWith('blob:'))
      
      // Combine existing remaining images with newly uploaded ones
      // Put new images first so they show up as the primary image
      const finalImages = [...uploadedUrls, ...existingRemainingImages]

      let query = supabase.from(tableName)
      
      if (mode === 'edit' && listingId) {
        const { error: updateError } = await query
          .update({
            ...data,
            images: finalImages,
          })
          .eq('id', listingId)
        if (updateError) throw updateError
        toast.success('Listing updated successfully!')
      } else {
        const { error: insertError } = await query
          .insert({
            ...data,
            user_id: user.id,
            images: finalImages,
          })
        if (insertError) throw insertError
        toast.success('Listing posted successfully!')
      }

      router.push(type === 'pg' ? '/pg' : '/items')
      router.refresh()
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Failed to post listing')
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentForm = (type === 'pg' ? pgForm : itemForm) as any

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Type Toggle - Only show in create mode */}
      {mode === 'create' && (
        <div className="flex p-2 bg-white/5 backdrop-blur-xl border border-white/5 rounded-[2rem] max-w-sm mx-auto shadow-2xl">
          <button
            type="button"
            onClick={() => setType('pg')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl transition-all font-black uppercase tracking-widest text-xs",
              type === 'pg' 
                ? "bg-amber-400 text-slate-950 shadow-lg" 
                : "text-slate-500 hover:text-white"
            )}
          >
            <Home className="h-4 w-4" />
            Post PG
          </button>
          <button
            type="button"
            onClick={() => setType('item')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl transition-all font-black uppercase tracking-widest text-xs",
              type === 'item' 
                ? "bg-emerald-500 text-slate-950 shadow-lg" 
                : "text-slate-500 hover:text-white"
            )}
          >
            <Package className="h-4 w-4" />
            Sell Item
          </button>
        </div>
      )}

      <div className="glass-card rounded-[3rem] p-8 md:p-12 border-white/5 shadow-2xl">
        <form onSubmit={currentForm.handleSubmit(onSubmit, onError)} className="space-y-12">
          {/* Section 1: Basic Info */}
          <div className="space-y-8">
            <h3 className="text-xl font-black text-white flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">1</div>
              Basic Information
            </h3>
            
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Listing Title</label>
              <div className="relative group">
                <input
                  {...currentForm.register('title')}
                  placeholder={type === 'pg' ? "e.g. Single Room near MEC Main Gate" : "e.g. Study Table or Chair"}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-5 text-white text-lg font-bold focus:outline-none focus:border-amber-400/50 transition-all placeholder:text-slate-600 shadow-inner"
                />
              </div>
              {currentForm.formState.errors.title && (
                <p className="text-xs text-red-400 font-bold ml-1">{currentForm.formState.errors.title.message as string}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {type === 'pg' ? (
                <>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Room Type</label>
                    <select
                      {...currentForm.register('room_type')}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-5 text-white font-bold focus:outline-none focus:border-emerald-400/50 transition-all appearance-none cursor-pointer"
                    >
                      <option className="bg-slate-950" value="Single">Single Room</option>
                      <option className="bg-slate-950" value="Double Sharing">Double Sharing</option>
                      <option className="bg-slate-950" value="Triple Sharing">Triple Sharing</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Gender Preference</label>
                    <select
                      {...currentForm.register('gender_preference')}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-5 text-white font-bold focus:outline-none focus:border-emerald-400/50 transition-all appearance-none cursor-pointer"
                    >
                      <option className="bg-slate-950" value="Any">Any</option>
                      <option className="bg-slate-950" value="Male">Male Only</option>
                      <option className="bg-slate-950" value="Female">Female Only</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Category</label>
                    <select
                      {...currentForm.register('category')}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-5 text-white font-bold focus:outline-none focus:border-emerald-400/50 transition-all appearance-none cursor-pointer"
                    >
                      <option className="bg-slate-950" value="Electronics">Electronics</option>
                      <option className="bg-slate-950" value="Furniture">Furniture</option>
                      <option className="bg-slate-950" value="Kitchen">Kitchen</option>
                      <option className="bg-slate-950" value="Books">Books</option>
                      <option className="bg-slate-950" value="Clothing">Clothing</option>
                      <option className="bg-slate-950" value="Misc">Misc</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Item Condition</label>
                    <select
                      {...currentForm.register('condition')}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-5 text-white font-bold focus:outline-none focus:border-emerald-400/50 transition-all appearance-none cursor-pointer"
                    >
                      <option className="bg-slate-950" value="New">New</option>
                      <option className="bg-slate-950" value="Excellent">Like New</option>
                      <option className="bg-slate-950" value="Good">Good</option>
                      <option className="bg-slate-950" value="Fair">Fair</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Section 2: Pricing & Location */}
          <div className="space-y-8">
            <h3 className="text-xl font-black text-white flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">2</div>
              Pricing & Logistics
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                  {type === 'pg' ? 'Monthly Rent' : 'Selling Price'}
                </label>
                <div className="relative group">
                  <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-400 group-focus-within:scale-110 transition-transform" />
                  <input
                    type="number"
                    {...currentForm.register(type === 'pg' ? 'rent' : 'price', { valueAsNumber: true })}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl pl-14 pr-6 py-5 text-white text-3xl font-black focus:outline-none focus:border-emerald-400/50 transition-all shadow-inner"
                  />
                </div>
              </div>

              {type === 'pg' ? (
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Security Deposit</label>
                  <div className="relative group">
                    <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="number"
                      {...currentForm.register('deposit', { valueAsNumber: true })}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl pl-14 pr-6 py-5 text-white text-3xl font-black focus:outline-none focus:border-white/20 transition-all shadow-inner"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 pt-10 px-4">
                  <input
                    type="checkbox"
                    id="is_negotiable"
                    {...currentForm.register('is_negotiable')}
                    className="w-6 h-6 rounded-lg bg-white/5 border-white/10 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                  />
                  <label htmlFor="is_negotiable" className="text-sm font-black text-slate-300 uppercase tracking-widest cursor-pointer hover:text-white transition-colors">Open to Negotiation?</label>
                </div>
              )}

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                  {type === 'pg' ? 'Exact Location' : 'Available From'}
                </label>
                <div className="relative group">
                  {type === 'pg' ? (
                    <>
                      <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                      <input
                        {...currentForm.register('location')}
                        placeholder="e.g. Near MEC Back Gate"
                        className="w-full bg-white/5 border border-white/5 rounded-2xl pl-14 pr-6 py-5 text-white font-bold focus:outline-none focus:border-white/20 transition-all shadow-inner"
                      />
                    </>
                  ) : (
                    <input
                      type="date"
                      {...currentForm.register('available_from')}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-5 text-white font-bold focus:outline-none focus:border-white/20 transition-all shadow-inner uppercase text-sm"
                    />
                  )}
                </div>
              </div>
              
              {type === 'pg' && (
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Available Date</label>
                  <input
                    type="date"
                    {...currentForm.register('available_from')}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-5 text-white font-bold focus:outline-none focus:border-white/20 transition-all shadow-inner uppercase text-sm"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Description & Media */}
          <div className="space-y-8">
            <h3 className="text-xl font-black text-white flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400">3</div>
              Media & Details
            </h3>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Detailed Description</label>
              <textarea
                {...currentForm.register('description')}
                rows={5}
                placeholder="Share more details about features, rules, or item condition..."
                className="w-full bg-white/5 border border-white/5 rounded-[2rem] px-8 py-6 text-white font-medium focus:outline-none focus:border-white/20 transition-all resize-none shadow-inner leading-relaxed"
              />
            </div>

            <div className="space-y-6">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">High Quality Photos (Max 4)</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                  {previews.map((preview, index) => (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      key={preview}
                      className="relative aspect-square rounded-[2rem] overflow-hidden border border-white/10 group shadow-2xl"
                    >
                      <Image src={preview} alt="Preview" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-3 right-3 bg-red-500 text-white rounded-xl p-2 shadow-2xl hover:bg-red-600 transition-all hover:rotate-90 active:scale-90"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {images.length < 4 && (
                  <label className="aspect-square rounded-[2rem] border-2 border-dashed border-white/5 bg-white/5 flex flex-col items-center justify-center cursor-pointer hover:border-amber-400/50 hover:bg-amber-400/5 transition-all group active:scale-95">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-amber-400/10 transition-all">
                      <Camera className="h-6 w-6 text-slate-500 group-hover:text-amber-400" />
                    </div>
                    <span className="text-[10px] text-slate-500 font-black tracking-[0.2em] uppercase group-hover:text-amber-400">Add Photo</span>
                    <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-xl font-black text-white flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">4</div>
              Contact Details
            </h3>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">WhatsApp / Phone Number</label>
              <div className="relative group">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500" />
                <input
                  {...currentForm.register('contact_phone')}
                  placeholder="+91 98765 43210"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl pl-14 pr-6 py-5 text-white text-xl font-black focus:outline-none focus:border-emerald-500/50 transition-all shadow-inner"
                />
              </div>
              {currentForm.formState.errors.contact_phone && (
                <p className="text-xs text-red-400 font-bold ml-1">{currentForm.formState.errors.contact_phone.message as string}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-20 bg-white text-slate-950 hover:bg-slate-200 font-black rounded-[2rem] mt-12 text-2xl transition-all shadow-2xl disabled:opacity-50 group overflow-hidden relative"
          >
            {isSubmitting ? (
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            ) : (
              <span className="flex items-center justify-center gap-4">
                Publish Listing
              </span>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
