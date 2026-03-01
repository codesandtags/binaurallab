import { useRef, useState, useCallback, useEffect } from 'react';
import AudioContextManager from '@/lib/audio-context';
import { useMediaSession } from './useMediaSession';

/**
 * useBinaural Hook
 * Manages the Web Audio API context, oscillators, and gain nodes for binaural beat generation.
 * Upgraded with Harmonic Layering for a warmer, premium "Spa Chord" effect.
 */

interface AudioEngineRef {
  context: AudioContext | null;
  leftOsc: OscillatorNode | null;
  rightOsc: OscillatorNode | null;
  harmLeftOsc: OscillatorNode | null;
  harmRightOsc: OscillatorNode | null;
  leftPanner: StereoPannerNode | null;
  rightPanner: StereoPannerNode | null;
  primaryGain: GainNode | null;
  harmonicGain: GainNode | null;
  masterGain: GainNode | null;
}

export const useBinaural = () => {
  const engine = useRef<AudioEngineRef>({
    context: null,
    leftOsc: null,
    rightOsc: null,
    harmLeftOsc: null,
    harmRightOsc: null,
    leftPanner: null,
    rightPanner: null,
    primaryGain: null,
    harmonicGain: null,
    masterGain: null,
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [baseFreq, setBaseFreqState] = useState(200); // Default 200Hz
  const [binauralBeat, setBinauralBeatState] = useState(10); // Default Alpha (10Hz)
  const [volume, setVolumeState] = useState(0.15); // Subliminal Default Mix Level 15%

  // Initialize Audio Context on user interaction (handled via play)
  const initAudio = useCallback(() => {
    const ctx = AudioContextManager.getInstance();
    if (ctx && !engine.current.context) {
        engine.current.context = ctx;
    }
    return engine.current.context;
  }, []);

  const setupNodes = useCallback(() => {
    const ctx = initAudio();
    if (!ctx) return;

    // Create Master Nodes
    const masterGain = ctx.createGain();
    const primaryGain = ctx.createGain();
    const harmonicGain = ctx.createGain();

    // Create Primary Oscillators
    const leftOsc = ctx.createOscillator();
    const rightOsc = ctx.createOscillator();
    
    // Create Harmonic Oscillators
    const harmLeftOsc = ctx.createOscillator();
    const harmRightOsc = ctx.createOscillator();

    // Create Panners
    const leftPanner = ctx.createStereoPanner();
    const rightPanner = ctx.createStereoPanner();

    // Configure Panning (Hard Left / Hard Right)
    leftPanner.pan.value = -1;
    rightPanner.pan.value = 1;

    // Configure Oscillators (Sine Wave)
    leftOsc.type = 'sine';
    rightOsc.type = 'sine';
    harmLeftOsc.type = 'sine';
    harmRightOsc.type = 'sine';

    // Set Initial Frequencies
    // Primary: Left = Base, Right = Base + Offset
    leftOsc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    rightOsc.frequency.setValueAtTime(baseFreq + binauralBeat, ctx.currentTime);

    // Harmonic (Perfect Fifth = 1.5x Base)
    const harmonicBaseFreq = baseFreq * 1.5;
    harmLeftOsc.frequency.setValueAtTime(harmonicBaseFreq, ctx.currentTime);
    harmRightOsc.frequency.setValueAtTime(harmonicBaseFreq + binauralBeat, ctx.currentTime);

    // Internal Mix Levels
    primaryGain.gain.setValueAtTime(1.0, ctx.currentTime); // 100% of Master Gain's volume
    harmonicGain.gain.setValueAtTime(0.05, ctx.currentTime); // 5% of Master Gain's volume for warmth

    // Master Volume (Starts at 0 to prevent popping)
    masterGain.gain.setValueAtTime(0, ctx.currentTime);

    // Connect Graph
    // Primary Route
    leftOsc.connect(leftPanner);
    rightOsc.connect(rightPanner);
    
    // Harmonic Route
    harmLeftOsc.connect(leftPanner);
    harmRightOsc.connect(rightPanner);

    // Mixdown
    leftPanner.connect(primaryGain);
    rightPanner.connect(primaryGain);
    
    leftPanner.connect(harmonicGain);
    rightPanner.connect(harmonicGain);

    primaryGain.connect(masterGain);
    harmonicGain.connect(masterGain);

    masterGain.connect(ctx.destination);

    // Store in Ref
    engine.current = {
      context: ctx,
      leftOsc,
      rightOsc,
      harmLeftOsc,
      harmRightOsc,
      leftPanner,
      rightPanner,
      primaryGain,
      harmonicGain,
      masterGain,
    };

    // Start All Oscillators
    leftOsc.start();
    rightOsc.start();
    harmLeftOsc.start();
    harmRightOsc.start();
  }, [baseFreq, binauralBeat, initAudio]);

  const play = useCallback(() => {
    if (isPlaying) return;

    // Resume context if suspended (browser policy)
    if (engine.current.context?.state === 'suspended') {
      engine.current.context.resume();
    }

    // If nodes don't exist, setup them
    if (!engine.current.leftOsc) {
       setupNodes();
    }

    // Smooth Fade In
    const ctx = engine.current.context;
    const gain = engine.current.masterGain;

    if (ctx && gain) {
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(Math.max(volume, 0.001), ctx.currentTime + 1); // 1s fade in
    }

    setIsPlaying(true);
  }, [isPlaying, setupNodes, volume]);

  const stop = useCallback((fadeDuration: number = 0.5) => {
    if (!isPlaying) return;

    const ctx = engine.current.context;
    const gain = engine.current.masterGain;

    if (ctx && gain) {
       // Smooth Fade Out
       const stopTime = ctx.currentTime + fadeDuration;
       gain.gain.cancelScheduledValues(ctx.currentTime);
       gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.001), ctx.currentTime);
       gain.gain.exponentialRampToValueAtTime(0.001, stopTime);

       // Schedule Stop
       engine.current.leftOsc?.stop(stopTime);
       engine.current.rightOsc?.stop(stopTime);
       engine.current.harmLeftOsc?.stop(stopTime);
       engine.current.harmRightOsc?.stop(stopTime);

       // Cleanup after stop
       setTimeout(() => {
          engine.current = {
             context: ctx,
             leftOsc: null,
             rightOsc: null,
             harmLeftOsc: null,
             harmRightOsc: null,
             leftPanner: null,
             rightPanner: null,
             primaryGain: null,
             harmonicGain: null,
             masterGain: null
          };
       }, (fadeDuration * 1000) + 100);
    }
    setIsPlaying(false);
  }, [isPlaying]);

  const setFrequency = useCallback((base: number, beat: number) => {
    setBaseFreqState(base);
    setBinauralBeatState(beat);

    const ctx = engine.current.context;
    const left = engine.current.leftOsc;
    const right = engine.current.rightOsc;
    const harmLeft = engine.current.harmLeftOsc;
    const harmRight = engine.current.harmRightOsc;

    if (ctx && left && right && harmLeft && harmRight) {
        // Smooth transition for frequency change
        const rampTime = 0.5;
        
        // Primary
        left.frequency.setTargetAtTime(base, ctx.currentTime, rampTime);
        right.frequency.setTargetAtTime(base + beat, ctx.currentTime, rampTime);
        
        // Harmonic
        const harmonicBaseFreq = base * 1.5;
        harmLeft.frequency.setTargetAtTime(harmonicBaseFreq, ctx.currentTime, rampTime);
        harmRight.frequency.setTargetAtTime(harmonicBaseFreq + beat, ctx.currentTime, rampTime);
    }
  }, []);

  const setVolume = useCallback((val: number) => {
      setVolumeState(val);
      const ctx = engine.current.context;
      const gain = engine.current.masterGain;
      if (ctx && gain && isPlaying) {
          gain.gain.setTargetAtTime(Math.max(val, 0.001), ctx.currentTime, 0.1);
      }
  }, [isPlaying]);

  // Handle cleanup on unmount
  useEffect(() => {
    return () => {
      // Do not close the shared context, just clear the ref
      // AudioContextManager potentially manages closer or app lifecycle
      engine.current.context = null;
    };
  }, []);
  // Use Media Session
  useMediaSession({
    title: 'Binaural Session',
    artist: 'Binaural Lab',
    album: 'Frequency Synthesis',
    artwork: [
        { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
        { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' }
    ],
    isPlaying,
    onPlay: () => play(),
    onPause: () => stop(),
  });

  // Handle visibility change (AudioContext Resilience)
  useEffect(() => {
      const handleVisibilityChange = () => {
          if (document.hidden) return; // Background handling is done via SilentAudio

          // When coming to foreground, ensure context is running if we are supposed to be playing
          if (isPlaying && engine.current.context?.state === 'suspended') {
              engine.current.context.resume();
          }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => {
          document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
  }, [isPlaying]);

  return {
    play,
    stop,
    isPlaying,
    setFrequency,
    setVolume,
    baseFreq,
    binauralBeat,
    volume
  };
};