"use client";

import React from 'react';
import { useBinaural } from '@/hooks/useBinaural';
import { useSessionLogger } from '@/hooks/useSessionLogger';
import { useNoise } from '@/hooks/useNoise';
import { Presets } from '@/components/features/Presets';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Play, Square, Volume2 } from 'lucide-react';
import { Slider } from '@/components/ui/Slider';
import { SilentAudioPlayer } from '@/components/audio/SilentAudioPlayer';
import FocusBanner from './FocusBanner';
import { AmbientControl } from './AmbientControl';
import { SleepTimer } from './SleepTimer';

export default function SessionPlayer() {
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
  };

  const handleToggleNoise = () => {
      if (noise.isPlaying) {
          noise.stop();
      } else {
          noise.play();
      }
  };

  return (
    <div className="space-y-8">
      <FocusBanner />
      <Card className="border-primary/10 bg-card/60 backdrop-blur-md shadow-2xl shadow-black/40">
        <CardContent className="p-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
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
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-semibold text-foreground/90">Presets</h2>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Quick Tune</span>
            </div>
            <Presets onSelect={handlePresetSelect} activeBeat={binauralBeat} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AmbientControl
            isNoisePlaying={noise.isPlaying}
            volume={noise.volume}
            type={noise.type}
            onVolumeChange={noise.setVolume}
            onTypeChange={noise.setType}
            onToggle={handleToggleNoise}
          />
          <SleepTimer
            isPlaying={isPlaying}
            onTimerComplete={handleStopAll}
          />
      </div>

      <SilentAudioPlayer isPlaying={isPlaying} />
    </div>
  );
}
