'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ImageCarousel({ 
  images, 
  title, 
  aspectRatio = "aspect-square" 
}: { 
  images: string[], 
  title: string,
  aspectRatio?: string
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)
  const MIN_SWIPE_DISTANCE = 40

  if (!images || images.length === 0) {
    return (
      <div className={cn("relative w-full bg-slate-900 flex items-center justify-center", aspectRatio)}>
        <Image 
          src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800"
          alt="Placeholder"
          fill
          className="object-cover opacity-50"
        />
      </div>
    )
  }

  const goNext = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const goPrev = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleClick = (e: React.MouseEvent, fn: () => void) => {
    e.preventDefault()
    e.stopPropagation()
    fn()
  }

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
    touchEndX.current = null
  }

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (images.length <= 1) return
    if (touchStartX.current === null || touchEndX.current === null) return

    const distance = touchStartX.current - touchEndX.current
    if (Math.abs(distance) >= MIN_SWIPE_DISTANCE) {
      if (distance > 0) {
        goNext() // swipe left → next
      } else {
        goPrev() // swipe right → prev
      }
    }
    touchStartX.current = null
    touchEndX.current = null
  }

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 30 : -30 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -30 : 30 }),
  }

  return (
    <div 
      className={cn("relative w-full overflow-hidden group/carousel select-none", aspectRatio)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <Image
            src={images[currentIndex]}
            alt={`${title} - image ${currentIndex + 1}`}
            fill
            className="object-cover pointer-events-none"
            draggable={false}
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none" />

      {/* Premium Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => handleClick(e, goPrev)}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 opacity-100 md:opacity-0 md:group-hover/carousel:opacity-100 transition-all duration-300 active:scale-90"
            aria-label="Previous image"
          >
            <div className="relative flex items-center justify-center w-9 h-9">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.08)] hover:bg-white/20 hover:border-white/40 hover:shadow-[0_0_24px_rgba(255,255,255,0.2)] transition-all duration-200" />
              <ChevronLeft className="relative h-4 w-4 text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]" strokeWidth={2.5} />
            </div>
          </button>
          <button
            onClick={(e) => handleClick(e, goNext)}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 opacity-100 md:opacity-0 md:group-hover/carousel:opacity-100 transition-all duration-300 active:scale-90"
            aria-label="Next image"
          >
            <div className="relative flex items-center justify-center w-9 h-9">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.08)] hover:bg-white/20 hover:border-white/40 hover:shadow-[0_0_24px_rgba(255,255,255,0.2)] transition-all duration-200" />
              <ChevronRight className="relative h-4 w-4 text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]" strokeWidth={2.5} />
            </div>
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {images.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === currentIndex ? "bg-white w-4" : "bg-white/40 w-1.5"
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}
