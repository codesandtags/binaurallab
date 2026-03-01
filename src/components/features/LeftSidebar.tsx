'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Home, BarChart2, Settings, Brain } from 'lucide-react'
import { db, type Session } from '@/lib/db'

export function LeftSidebar({ activePresetName }: { activePresetName?: string }) {
  const [recentSessions, setRecentSessions] = useState<Session[]>([])

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const data = await db.sessions.reverse().limit(5).toArray()
        setRecentSessions(data)
      } catch (err) {
        console.error("Failed to load sessions:", err)
      }
    }
    loadSessions()
  }, [])

  return (
    <aside className="w-64 bg-zinc-950 border-r border-white/5 flex flex-col h-full hidden md:flex">
      {/* Top Section */}
      <div className="p-6">
        <Link href="/" className="flex items-center gap-3 mb-8 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
             <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Binaural Lab</span>
        </Link>
        <nav className="space-y-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-md bg-white/10 text-white font-medium border-l-2 border-indigo-500">
            <Home className="w-5 h-5 opacity-100" />
            Home
          </Link>
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-zinc-400 hover:text-white hover:bg-white/5 transition-colors font-medium border-l-2 border-transparent">
            <BarChart2 className="w-5 h-5 opacity-70" />
            Stats
          </Link>
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-zinc-400 hover:text-white hover:bg-white/5 transition-colors font-medium border-l-2 border-transparent">
            <Settings className="w-5 h-5 opacity-70" />
            Settings
          </Link>
        </nav>
      </div>

      {/* Library Section */}
      <div className="flex-1 overflow-y-auto px-4 mt-2">
        <div className="px-2 mb-3">
           <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Your Library</h3>
        </div>
        <div className="space-y-1">
          {recentSessions.length === 0 ? (
            <p className="px-2 text-sm text-zinc-500">No recent sessions</p>
          ) : (
            recentSessions.map((session) => {
              const sessionName = session.presetName || `${session.binauralBeat}Hz Session`
              const isActive = sessionName === activePresetName
              
              return (
                <div key={session.id} className={`group flex items-center gap-3 px-2 py-2.5 rounded-md cursor-pointer transition-colors ${isActive ? 'bg-white/10 border-l-2 border-indigo-500' : 'hover:bg-white/5 border-l-2 border-transparent'}`}>
                  <div className={`w-10 h-10 rounded bg-zinc-900 flex items-center justify-center flex-shrink-0 ${isActive ? 'text-indigo-400' : 'text-zinc-500'}`}>
                    <Brain className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium truncate ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-white'}`}>{sessionName}</p>
                    <p className="text-xs text-zinc-400 truncate">
                       {new Date(session.startTime).toLocaleDateString()} • {Math.round(session.duration / 60)}m
                    </p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </aside>
  )
}
