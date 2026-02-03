"use client";

import React, { useState } from 'react';
import { useBinaural } from '@/hooks/useBinaural';
import { useSessionLogger } from '@/hooks/useSessionLogger';
import { useNoise } from '@/hooks/useNoise';
import { Presets } from '@/components/features/Presets';
import { FrequencyControl } from '@/components/features/FrequencyControl';
import { SleepTimer } from '@/components/features/SleepTimer';
import { Stats } from '@/components/features/Stats';
import { AmbientControl } from '@/components/features/AmbientControl';
import { HeadphonesBadge } from '@/components/ui/HeadphonesBadge';
import { InfoModal } from '@/components/features/InfoModal';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Play, Square, Volume2, Waves, Info } from 'lucide-react';
import { Slider } from '@/components/ui/Slider';
import { SilentAudioPlayer } from '@/components/audio/SilentAudioPlayer';

export default function Home() {
  const {
    play,
    stop,
    isPlaying,
    setFrequency,
    setVolume,
    baseFreq,
    binauralBeat,
    volume
  } = useBinaural();

  const noise = useNoise();
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  // Integrated Logger
  useSessionLogger({ isPlaying, baseFreq, binauralBeat });

  const handlePresetSelect = (base: number, beat: number) => {
    setFrequency(base, beat);
  };

  const handleStopAll = () => {
      stop(0.5);
      if (noise.isPlaying) noise.stop();
  };

  const handleStartAll = () => {
      play();
      // Optionally start noise if it was previously active?
      // For now, let user control noise separately or manual start.
  };

  return (
    <main className="min-h-screen bg-background p-4 md:p-8 flex flex-col items-center font-sans selection:bg-primary/30">
      <SilentAudioPlayer isPlaying={isPlaying} />
      <div className="max-w-4xl w-full space-y-8 pb-20">

        {/* Header */}
        <header className="flex flex-col items-center justify-center space-y-4 text-center pt-8 md:pt-12 relative">
           <button
                onClick={() => setIsInfoOpen(true)}
                className="absolute right-0 top-8 md:top-12 p-2 text-muted-foreground hover:text-primary transition-colors"
                aria-label="Info & Safety"
           >
               <Info className="w-6 h-6" />
           </button>

           <div className="p-3 bg-primary/10 rounded-full ring-1 ring-primary/20">
               <Waves className="w-10 h-10 text-primary animate-pulse" style={{ animationDuration: '3s' }} />
           </div>

           <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-white via-white to-gray-500 bg-clip-text text-transparent">
                    Binaural Lab
                </h1>
                <div className="flex justify-center">
                    <HeadphonesBadge />
                </div>
           </div>

           <p className="text-muted-foreground text-lg max-w-md">
             Pure frequency synthesis for focus, meditation, and sleep.
           </p>
        </header>

        {/* Main Control Card */}
        <Card className="border-primary/10 bg-card/60 backdrop-blur-md shadow-2xl shadow-black/40">
            <CardContent className="p-8 space-y-8">

                {/* Status Indicator */}
                <div className="flex justify-center items-center h-24 mb-4">
                     {isPlaying ? (
                         <div className="flex items-center gap-4">
                              <span className="text-xs font-mono text-primary animate-pulse tracking-widest hidden md:block">GENERATING</span>
                              <div className="flex items-end justify-center gap-1.5 h-16">
                                  {[...Array(9)].map((_, i) => (
                                      <div
                                        key={i}
                                        className="w-1.5 bg-primary rounded-full animate-waveform shadow-[0_0_8px_rgba(124,58,237,0.5)]"
                                        style={{
                                            animationDelay: `${i * 0.12}s`,
                                            height: '20%' // Base height
                                        }}
                                      ></div>
                                  ))}
                              </div>
                              <span className="text-xs font-mono text-primary animate-pulse tracking-widest hidden md:block">SINE WAVES</span>
                         </div>
                     ) : (
                         <span className="text-muted-foreground font-mono text-sm tracking-widest uppercase opacity-50">System Standby</span>
                     )}
                </div>

                {/* Play/Stop & Volume */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <Button
                        size="lg"
                        variant={isPlaying ? "destructive" : "default"}
                        className={`w-full md:w-auto px-10 h-16 text-lg rounded-full shadow-lg shadow-primary/25 transition-all duration-300 font-semibold tracking-wide ${isPlaying ? 'bg-red-500/90 hover:bg-red-600' : 'bg-primary hover:bg-primary/90 hover:scale-105 hover:shadow-primary/40'}`}
                        onClick={isPlaying ? handleStopAll : handleStartAll}
                    >
                        {isPlaying ? (
                            <>
                              <Square className="mr-3 w-5 h-5 fill-current" /> STOP SESSION
                            </>
                        ) : (
                            <>
                              <Play className="mr-3 w-5 h-5 fill-current" /> START GENERATOR
                            </>
                        )}
                    </Button>

                    <div className="flex items-center gap-4 w-full md:w-64 max-w-md bg-secondary/30 p-4 rounded-full border border-white/5">
                        <Volume2 className="w-5 h-5 text-muted-foreground" />
                        <Slider
                            value={volume}
                            min={0}
                            max={1}
                            step={0.01}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="flex-1"
                        />
                    </div>
                </div>

            </CardContent>
        </Card>

        {/* Presets Grid */}
        <div className="space-y-4">
             <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-semibold text-foreground/90">Presets</h2>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Quick Tune</span>
             </div>
            <Presets onSelect={handlePresetSelect} activeBeat={binauralBeat} />
        </div>

        {/* Feature Grid: Manual & Ambient */}
        <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
                 {/* Manual Tuning */}
                 <div className="space-y-4">
                     <h2 className="text-xl font-semibold px-2 text-foreground/90">Manual Tuning</h2>
                     <FrequencyControl
                        baseFreq={baseFreq}
                        beatFreq={binauralBeat}
                        onChange={setFrequency}
                     />
                </div>
            </div>

            <div className="space-y-6">
                 {/* Ambient Control */}
                 <div className="space-y-4">
                     <h2 className="text-xl font-semibold px-2 text-foreground/90">Acoustic Environment</h2>
                     <AmbientControl
                        isPlaying={isPlaying}
                        isNoisePlaying={noise.isPlaying}
                        volume={noise.volume}
                        type={noise.type}
                        onVolumeChange={noise.setVolume}
                        onTypeChange={noise.setType}
                        onToggle={noise.isPlaying ? noise.stop : noise.play}
                     />
                 </div>
            </div>
        </div>

        {/* Sleep Timer - Full Width Below */}
        <div className="max-w-md mx-auto w-full space-y-4">
             <h2 className="text-xl font-semibold px-2 text-foreground/90">Sleep Timer</h2>
             <SleepTimer
                isPlaying={isPlaying}
                onTimerComplete={() => {
                    stop(30);
                    noise.stop();
                }}
            />
        </div>

        {/* Analytics (Components Hidden) */}
        <div className="hidden">
           {/* Analytics would go here */}
        </div>

        {/* Footer Branding */}
        <footer className="pt-12 pb-6 text-center space-y-2">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent max-w-xs mx-auto mb-6"></div>
            <p className="text-sm text-muted-foreground">
                Engineered for <span className="text-primary font-semibold">Codes and Tags</span>
            </p>
            <p className="text-xs text-muted-foreground/50">
                v1.1 • Premium Neuro-Audio Architecture
            </p>
        </footer>

        <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />

      </div>
    </main>
  );
}
