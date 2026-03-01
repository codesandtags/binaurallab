'use client'

import React, { useState } from 'react'
import { Play, Pause, Clock, Volume2, Layers, CloudRain, Zap, Wind, Activity, ChevronDown, Waves } from 'lucide-react'
import { Slider } from '@/components/ui/Slider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"

type NoiseType = 'pink' | 'white' | 'brown' | 'drone'

interface BottomPlayerBarProps {
  activePresetName: string
  activePresetSubtitle: string
  isPlaying: boolean
  onTogglePlay: () => void
  volume: number
  onVolumeChange: (val: number) => void
  noiseType: NoiseType
  onNoiseTypeChange: (type: NoiseType) => void
  noiseVolume: number
  onNoiseVolumeChange: (val: number) => void
  isNoisePlaying: boolean
  onToggleNoise: () => void
  layeredMode: boolean
  onToggleLayeredMode: () => void
  onTimerComplete: () => void
}

export function BottomPlayerBar(props: BottomPlayerBarProps) {
  const [timerActive, setTimerActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  // Sleep Timer Logic
  React.useEffect(() => {
    let interval: NodeJS.Timeout
    if (timerActive && timeLeft !== null && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (timeLeft === 0 && timerActive) {
      props.onTimerComplete()
      setTimerActive(false)
      setTimeLeft(null)
    }
    return () => clearInterval(interval)
  }, [timerActive, timeLeft, props])

  const startTimer = (minutes: number) => {
    setTimeLeft(minutes * 60)
    setTimerActive(true)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const NoiseIcon = props.noiseType === 'pink' ? CloudRain : props.noiseType === 'brown' ? Wind : props.noiseType === 'drone' ? Waves : Zap

  return (
    <>
      {/* FULL SCREEN MOBILE MODAL */}
      {isExpanded && (
        <div className="fixed inset-0 z-[100] bg-zinc-950 text-white flex flex-col md:hidden animate-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between p-6">
            <button onClick={() => setIsExpanded(false)} className="p-2 -ml-2 text-white/70 hover:text-white">
              <ChevronDown className="w-8 h-8" />
            </button>
            <span className="text-xs font-semibold tracking-widest text-zinc-400 uppercase">Now Playing</span>
            <div className="w-8" />
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-8 gap-8">
            <div className="w-64 h-64 bg-zinc-900 rounded-3xl shadow-2xl flex items-center justify-center relative overflow-hidden mb-4">
               {props.isPlaying ? (
                  <div className="absolute inset-0 bg-indigo-500/10 flex items-center justify-center">
                    <Activity className="w-24 h-24 text-indigo-500 animate-pulse" />
                  </div>
               ) : (
                  <Activity className="w-24 h-24 text-zinc-700" />
               )}
            </div>

            <div className="text-center space-y-2 mb-4 w-full px-4">
              <h2 className="text-2xl font-bold truncate">{props.activePresetName}</h2>
              <p className="text-lg text-indigo-400 font-mono truncate">{props.activePresetSubtitle}</p>
            </div>

            {/* Play Controls */}
            <div className="flex items-center justify-center gap-8 w-full">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${timerActive ? 'text-indigo-400' : 'text-zinc-400 hover:text-white'}`}>
                    <Clock className="w-6 h-6" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-40 bg-zinc-900 border-white/10 text-white">
                  <DropdownMenuLabel>Sleep Timer</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  {timerActive && (
                    <div className="px-2 py-1.5 text-xs text-indigo-400 font-mono text-center">
                      {timeLeft !== null && formatTime(timeLeft)}
                    </div>
                  )}
                  <DropdownMenuItem onClick={() => startTimer(15)} className="hover:bg-white/10 cursor-pointer">15 Minutes</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => startTimer(30)} className="hover:bg-white/10 cursor-pointer">30 Minutes</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => startTimer(60)} className="hover:bg-white/10 cursor-pointer">60 Minutes</DropdownMenuItem>
                  {timerActive && (
                     <>
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuItem onClick={() => { setTimerActive(false); setTimeLeft(null); }} className="text-red-400 hover:bg-white/10 cursor-pointer">Cancel Timer</DropdownMenuItem>
                     </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <button 
                onClick={props.onTogglePlay} 
                className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
              >
                {props.isPlaying ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-2" />}
              </button>

              <button 
                onClick={props.onToggleLayeredMode}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${props.layeredMode ? 'text-indigo-400 bg-indigo-500/10' : 'text-zinc-400 hover:text-white'}`}
              >
                <Layers className="w-6 h-6" />
              </button>
            </div>

            {/* Volume & Noise Controls */}
            <div className="w-full max-w-sm space-y-8 mt-8">
              <div className="flex items-center gap-4">
                <Volume2 className="w-6 h-6 text-zinc-400" />
                <Slider value={props.volume} min={0} max={1} step={0.01} onChange={(e) => props.onVolumeChange(parseFloat(e.target.value))} />
              </div>
              
              <div className="flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button 
                      onClick={() => props.onToggleNoise()} 
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${props.isNoisePlaying ? 'text-indigo-400 bg-indigo-500/10' : 'text-zinc-400 hover:text-white'}`}
                    >
                      <NoiseIcon className="w-6 h-6" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-40 bg-zinc-900 border-white/10 text-white mb-2">
                    <DropdownMenuLabel>Ambient Texture</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem onClick={() => props.onNoiseTypeChange('pink')} className="hover:bg-white/10 cursor-pointer">
                       <CloudRain className="w-4 h-4 mr-2" /> Pink Noise
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => props.onNoiseTypeChange('brown')} className="hover:bg-white/10 cursor-pointer">
                       <Wind className="w-4 h-4 mr-2" /> Brown Noise
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => props.onNoiseTypeChange('white')} className="hover:bg-white/10 cursor-pointer">
                       <Zap className="w-4 h-4 mr-2" /> White Noise
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => props.onNoiseTypeChange('drone')} className="hover:bg-white/10 cursor-pointer">
                       <Waves className="w-4 h-4 mr-2" /> Cinematic Drone
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Slider value={props.noiseVolume} min={0} max={1} step={0.01} onChange={(e) => props.onNoiseVolumeChange(parseFloat(e.target.value))} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM BAR (Desktop Full, Mobile Mini) */}
      <div 
        className="h-14 md:h-24 bg-zinc-900 md:bg-zinc-950 md:border-t border-white/10 px-3 md:px-4 flex items-center justify-between z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] cursor-pointer md:cursor-default mx-2 mb-2 rounded-lg md:mx-0 md:mb-0 md:rounded-none" 
        onClick={() => { if(window.innerWidth < 768) setIsExpanded(true) }}
      >
        
        {/* Left: Now Playing */}
        <div className="w-auto md:w-1/3 flex items-center gap-3 md:gap-4 min-w-0">
          <div className="w-10 h-10 md:w-14 md:h-14 bg-zinc-800 md:bg-zinc-900 rounded-md flex items-center justify-center flex-shrink-0 relative overflow-hidden">
            {props.isPlaying && (
              <div className="absolute inset-0 bg-indigo-500/10 flex items-center justify-center">
                <Activity className="w-5 h-5 md:w-6 md:h-6 text-indigo-400 animate-pulse" />
              </div>
            )}
          </div>
          <div className="flex flex-col min-w-0 pr-2 md:pr-0">
            <span className="text-sm md:text-sm font-medium text-white truncate hover:underline">{props.activePresetName}</span>
            <span className="text-xs text-zinc-400 font-mono truncate md:block hidden">{props.activePresetSubtitle}</span>
          </div>
        </div>

        {/* Center: Playback Controls (Mobile right side, Desktop center) */}
        <div className="flex items-center justify-end md:justify-center md:w-1/3">
           <div className="flex items-center gap-4 md:gap-6">
              {/* Desktop Timer */}
              <div className="hidden md:block" onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${timerActive ? 'text-indigo-400 hover:text-indigo-300' : 'text-zinc-400 hover:text-white'}`}>
                      <Clock className="w-5 h-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-40 bg-zinc-900 border-white/10 text-white">
                    <DropdownMenuLabel>Sleep Timer</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/10" />
                    {timerActive && (
                      <div className="px-2 py-1.5 text-xs text-indigo-400 font-mono text-center">
                        {timeLeft !== null && formatTime(timeLeft)}
                      </div>
                    )}
                    <DropdownMenuItem onClick={() => startTimer(15)} className="hover:bg-white/10 cursor-pointer">15 Minutes</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => startTimer(30)} className="hover:bg-white/10 cursor-pointer">30 Minutes</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => startTimer(60)} className="hover:bg-white/10 cursor-pointer">60 Minutes</DropdownMenuItem>
                    {timerActive && (
                       <>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem onClick={() => { setTimerActive(false); setTimeLeft(null); }} className="text-red-400 hover:bg-white/10 cursor-pointer">Cancel Timer</DropdownMenuItem>
                       </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <button 
                onClick={(e) => { e.stopPropagation(); props.onTogglePlay(); }}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-lg md:shadow-white/10"
              >
                {props.isPlaying ? (
                  <Pause className="w-5 h-5 md:w-6 md:h-6 fill-current" />
                ) : (
                  <Play className="w-5 h-5 md:w-6 md:h-6 fill-current ml-1" />
                )}
              </button>
           </div>
        </div>

        {/* Right: The Mixer & BYOM (Desktop Only) */}
        <div className="hidden md:flex w-1/3 items-center justify-end gap-6" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2" title="Drops master volume to 20% so you can play Spotify/Apple Music in the background.">
            <button 
              onClick={props.onToggleLayeredMode}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${props.layeredMode ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50' : 'bg-transparent text-zinc-400 border-white/10 hover:border-white/30 hover:text-white'}`}
            >
              <Layers className="w-3.5 h-3.5" />
              Layered Mode
            </button>
          </div>

          <div className="flex items-center gap-3 w-32 group relative">
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <button 
                    onClick={() => props.onToggleNoise()}
                    className={`flex-shrink-0 transition-colors ${props.isNoisePlaying ? 'text-indigo-400' : 'text-zinc-400 hover:text-white'}`}
                  >
                    <NoiseIcon className="w-4 h-4" />
                  </button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end" className="w-40 bg-zinc-900 border-white/10 text-white mb-2">
                  <DropdownMenuLabel>Ambient Texture</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={() => props.onNoiseTypeChange('pink')} className="hover:bg-white/10 cursor-pointer">
                     <CloudRain className="w-4 h-4 mr-2" /> Pink Noise
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => props.onNoiseTypeChange('brown')} className="hover:bg-white/10 cursor-pointer">
                     <Wind className="w-4 h-4 mr-2" /> Brown Noise
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => props.onNoiseTypeChange('white')} className="hover:bg-white/10 cursor-pointer">
                     <Zap className="w-4 h-4 mr-2" /> White Noise
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => props.onNoiseTypeChange('drone')} className="hover:bg-white/10 cursor-pointer">
                     <Waves className="w-4 h-4 mr-2" /> Cinematic Drone
                  </DropdownMenuItem>
                  </DropdownMenuContent>
                  </DropdownMenu>            <Slider 
               value={props.noiseVolume} 
               min={0} max={1} step={0.01} 
               onChange={(e) => props.onNoiseVolumeChange(parseFloat(e.target.value))}
               className="w-20"
            />
          </div>

          <div className="flex items-center gap-3 w-32">
            <Volume2 className="w-4 h-4 text-zinc-400 flex-shrink-0" />
            <Slider 
               value={props.volume} 
               min={0} max={1} step={0.01} 
               onChange={(e) => props.onVolumeChange(parseFloat(e.target.value))}
               className="w-full"
            />
          </div>
        </div>
      </div>
    </>
  )
}
