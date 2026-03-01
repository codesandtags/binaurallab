'use client'

import React, { useState } from 'react'
import { useBinaural } from '@/hooks/useBinaural'
import { useNoise } from '@/hooks/useNoise'
import { useSessionLogger } from '@/hooks/useSessionLogger'
import { LeftSidebar } from './LeftSidebar'
import { MainContent } from './MainContent'
import { BottomPlayerBar } from './BottomPlayerBar'
import { User } from '@supabase/supabase-js'
import { Home, BarChart2, Settings } from 'lucide-react'

interface DashboardClientProps {
  user: User | null
  userName: string
}

export default function DashboardClient({ user, userName }: DashboardClientProps) {
  const {
    play: playBinaural,
    stop: stopBinaural,
    isPlaying: isBinauralPlaying,
    setFrequency,
    setVolume: setBinauralVolume,
    baseFreq,
    binauralBeat,
    volume: binauralVolume
  } = useBinaural()

  const {
    play: playNoise,
    stop: stopNoise,
    isPlaying: isNoisePlaying,
    setVolume: setNoiseVolume,
    setType: setNoiseType,
    volume: noiseVolume,
    type: noiseType
  } = useNoise()

  // Session Logger
  useSessionLogger({ isPlaying: isBinauralPlaying, baseFreq, binauralBeat })

  const [activePresetName, setActivePresetName] = useState('Select a Neuro-State')
  const [activePresetSubtitle, setActivePresetSubtitle] = useState('---')
  
  // BYOM Mode (Layered Mode)
  const [layeredMode, setLayeredMode] = useState(false)

  const handleTogglePlay = () => {
    if (isBinauralPlaying) {
      stopBinaural(0.5)
      if (isNoisePlaying) stopNoise()
    } else {
      playBinaural()
    }
  }

  const handleNoiseTypeChange = (newType: typeof noiseType) => {
    setNoiseType(newType)
    if (!isNoisePlaying) {
      playNoise()
    }
  }

  const handleSelectPreset = (name: string, subtitle: string, base: number, beat: number) => {
    setFrequency(base, beat)
    setActivePresetName(name)
    setActivePresetSubtitle(subtitle)
    if (!isBinauralPlaying) {
      playBinaural()
    }
  }

  const handleMasterVolume = (val: number) => {
    setBinauralVolume(val)
  }

  const toggleLayeredMode = () => {
    setLayeredMode(!layeredMode)
    if (!layeredMode) {
      setBinauralVolume(binauralVolume * 0.2)
      setNoiseVolume(noiseVolume * 0.2)
    } else {
      setBinauralVolume(0.5)
      setNoiseVolume(0.5)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-white font-sans selection:bg-indigo-500/30">
      <LeftSidebar activePresetName={activePresetName} />
      <div className="flex flex-col flex-1 min-w-0 h-full relative">
         <div className="flex-1 overflow-y-auto pb-32 md:pb-0">
           <MainContent 
              user={user} 
              userName={userName} 
              onSelectPreset={handleSelectPreset}
              activeBeat={binauralBeat}
           />
         </div>
         
         <div className="fixed bottom-0 left-0 right-0 md:static md:bottom-auto md:left-auto md:right-auto z-50 flex flex-col">
           <BottomPlayerBar 
              activePresetName={activePresetName}
              activePresetSubtitle={activePresetSubtitle}
              isPlaying={isBinauralPlaying}
              onTogglePlay={handleTogglePlay}
              volume={binauralVolume}
              onVolumeChange={handleMasterVolume}
              noiseType={noiseType}
              onNoiseTypeChange={handleNoiseTypeChange}
              noiseVolume={noiseVolume}
              onNoiseVolumeChange={setNoiseVolume}
              isNoisePlaying={isNoisePlaying}
              onToggleNoise={isNoisePlaying ? stopNoise : playNoise}
              layeredMode={layeredMode}
              onToggleLayeredMode={toggleLayeredMode}
              onTimerComplete={() => {
                 stopBinaural(2)
                 if (isNoisePlaying) stopNoise()
              }}
           />
           {/* Mobile Bottom Tab Navigation */}
           <div className="flex md:hidden h-16 bg-zinc-950 border-t border-white/10 items-center justify-around px-2 pb-safe">
              <button className="flex flex-col items-center gap-1 text-white">
                <Home className="w-6 h-6" />
                <span className="text-[10px] font-medium">Home</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-zinc-500 hover:text-white transition-colors">
                <BarChart2 className="w-6 h-6" />
                <span className="text-[10px] font-medium">Stats</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-zinc-500 hover:text-white transition-colors">
                <Settings className="w-6 h-6" />
                <span className="text-[10px] font-medium">Settings</span>
              </button>
           </div>
         </div>
      </div>
    </div>
  )
}
