import React from 'react'

function CategoryCard({ data }) {
  return (
    <div className='group relative w-[120px] h-[120px] md:w-[180px] md:h-[180px] shrink-0 cursor-pointer'>
      {/* Ambient glow backdrop */}
      <div className='absolute -inset-3 bg-gradient-to-br from-amber-500/30 via-orange-500/30 to-rose-500/30 rounded-[36px] opacity-0 group-hover:opacity-100 blur-2xl transition-all duration-700 ease-out'></div>
      
      {/* Main card container */}
      <div className='relative w-full h-full rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.08)] group-hover:shadow-[0_24px_64px_rgba(0,0,0,0.16)] transition-all duration-500 ease-out group-hover:-translate-y-3 group-hover:scale-[1.02]'>
        
        {/* Image layer with parallax zoom */}
        <div className='absolute inset-0 overflow-hidden'>
          <img
            src={data.image}
            alt={data.category}
            className='w-full h-full object-cover scale-105 group-hover:scale-125 group-hover:brightness-110 transition-all duration-700 ease-out'
          />
        </div>
        
        {/* Sophisticated gradient overlay */}
        <div className='absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-90 group-hover:opacity-75 transition-opacity duration-500'></div>
        
        {/* Top highlight shimmer */}
        <div className='absolute inset-0 bg-gradient-to-b from-white/30 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700'></div>
        
        {/* Animated accent line */}
        <div className='absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 group-hover:opacity-100 scale-x-0 group-hover:scale-x-100 transition-all duration-500'></div>
        
        {/* Premium glassmorphism label */}
        <div className='absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 px-5 md:px-7 py-2 md:py-2.5 rounded-full bg-white/95 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/60 group-hover:bg-white group-hover:scale-110 group-hover:shadow-[0_12px_48px_rgba(0,0,0,0.2)] transition-all duration-400 ease-out'>
          <span className='block text-xs md:text-sm font-black tracking-[0.1em] text-slate-900 uppercase relative'>
            {data.category}
            {/* Subtle shimmer effect */}
            <span className='absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out'></span>
          </span>
        </div>
        
        {/* Inner glow ring */}
        <div className='absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/20 group-hover:ring-white/40 transition-all duration-500'></div>
        
        {/* Outer accent glow */}
        <div className='absolute inset-0 rounded-3xl ring-2 ring-amber-400/0 group-hover:ring-amber-400/50 transition-all duration-500'></div>
      </div>
    </div>
  )
}

export default CategoryCard