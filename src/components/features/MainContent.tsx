'use client'

import React from 'react'
import { User } from '@supabase/supabase-js'
import UserMenu from './UserMenu'
import { Stats } from './Stats'
import { Play } from 'lucide-react'

interface MainContentProps {
  user: User | null
  userName: string
  onSelectPreset: (name: string, subtitle: string, base: number, beat: number) => void
  activeBeat: number
}

const PRESETS = [
  { name: 'Deep Work', subtitle: 'Gamma 40Hz', base: 200, beat: 40, color: 'from-blue-600 to-indigo-900' },
  { name: 'Creative Flow', subtitle: 'Alpha 10Hz', base: 250, beat: 10, color: 'from-emerald-500 to-teal-900' },
  { name: 'ADHD Hyper-Focus', subtitle: 'Beta 20Hz', base: 300, beat: 20, color: 'from-orange-500 to-red-900' },
  { name: 'Power Nap', subtitle: 'Delta 2Hz', base: 100, beat: 2, color: 'from-purple-500 to-fuchsia-900' },
]

export function MainContent({ user, userName, onSelectPreset, activeBeat }: MainContentProps) {
  return (
    <main className="flex-1 overflow-y-auto bg-gradient-to-b from-zinc-900 to-zinc-950 pb-8">
      {/* Header */}
      <header className="flex justify-between items-center p-6 md:p-8 sticky top-0 z-10 bg-zinc-900/80 backdrop-blur-md border-b border-white/5">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight truncate mr-4">Good Evening, {userName}</h1>
        <div className="flex items-center gap-4 flex-shrink-0">
          <UserMenu user={user} />
        </div>
      </header>

      <div className="p-4 md:p-8 space-y-10">
        {/* Presets Grid */}
        <section>
          <h2 className="text-2xl font-bold mb-6 tracking-tight">Your Neuro-States</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {PRESETS.map((preset) => {
              const isActive = activeBeat === preset.beat
              return (
                <div 
                  key={preset.name}
                  onClick={() => onSelectPreset(preset.name, preset.subtitle, preset.base, preset.beat)}
                  className={`relative group rounded-xl p-4 md:p-6 cursor-pointer overflow-hidden transition-all duration-300 hover:bg-white/10 ${isActive ? 'bg-white/10 ring-2 ring-indigo-500' : 'bg-white/5'}`}
                >
                  <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${preset.color} transition-opacity group-hover:opacity-40`} />
                  
                  <div className="relative z-10 flex flex-col h-full min-h-[120px] justify-between">
                    <div>
                      <h3 className="font-bold text-lg leading-tight mb-1 shadow-black/50 drop-shadow-md">{preset.name}</h3>
                      <p className="text-sm font-mono text-zinc-300 shadow-black/50 drop-shadow-md">{preset.subtitle}</p>
                    </div>
                    
                    <div className="absolute bottom-0 right-0 translate-y-2 translate-x-2 opacity-0 group-hover:translate-y-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                      <button className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-black/50 hover:scale-105 transition-transform">
                        <Play className="w-6 h-6 fill-current ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Analytics */}
        <section>
          <div className="max-w-4xl">
             <Stats />
          </div>
        </section>
      </div>
    </main>
  )
}
