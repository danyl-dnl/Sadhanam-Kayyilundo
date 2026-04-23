'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020617]">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-400/5 blur-[120px] rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-500/5 blur-[100px] rounded-full delay-700" />
      
      <div className="relative flex flex-col items-center">
        {/* Loading Spinner/Ring */}
        <div className="relative w-24 h-24 mb-12">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-4 border-white/5 border-t-amber-400 rounded-full"
          />
        </div>

        {/* Loading Bar */}
        <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden relative">
          <motion.div 
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-0 bottom-0 w-full bg-gradient-to-r from-transparent via-amber-400 to-transparent"
          />
        </div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] animate-pulse"
        >
          Sadhanam Kayyilundo?
        </motion.p>
      </div>
    </div>
  )
}
