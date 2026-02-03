import { useRef, useState, useCallback, useEffect } from 'react';

/**
 * useBinaural Hook
 * Manages the Web Audio API context, oscillators, and gain nodes for binaural beat generation.
 */

interface AudioEngineRef {
  context: AudioContext | null;
  leftOsc: OscillatorNode | null;
  rightOsc: OscillatorNode | null;
  leftPanner: StereoPannerNode | null;
  rightPanner: StereoPannerNode | null;
  masterGain: GainNode | null;
}

export const useBinaural = () => {
  const engine = useRef<AudioEngineRef>({
    context: null,
    leftOsc: null,
    rightOsc: null,
    leftPanner: null,
    rightPanner: null,
    masterGain: null,
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [baseFreq, setBaseFreqState] = useState(200); // Default 200Hz
  const [binauralBeat, setBinauralBeatState] = useState(10); // Default Alpha (10Hz)
  const [volume, setVolumeState] = useState(0.4);

  // Initialize Audio Context on user interaction (handled via play)
  const initAudio = useCallback(() => {
    if (!engine.current.context) {
      const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
      engine.current.context = new AudioContextClass();
    }
    return engine.current.context;
  }, []);

  const setupNodes = useCallback(() => {
    const ctx = initAudio();
    if (!ctx) return;

    // Create Nodes
    const masterGain = ctx.createGain();
    const leftOsc = ctx.createOscillator();
    const rightOsc = ctx.createOscillator();
    const leftPanner = ctx.createStereoPanner();
    const rightPanner = ctx.createStereoPanner();

    // Configure Panning (Hard Left / Hard Right)
    leftPanner.pan.value = -1;
    rightPanner.pan.value = 1;

    // Configure Oscillators (Sine Wave)
    leftOsc.type = 'sine';
    rightOsc.type = 'sine';

    // Set Initial Frequencies
    // Left = Base, Right = Base + Offset
    leftOsc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    rightOsc.frequency.setValueAtTime(baseFreq + binauralBeat, ctx.currentTime);

    // Initial Volume (Starts at 0 to prevent popping)
    masterGain.gain.setValueAtTime(0, ctx.currentTime);

    // Connect Graph
    // Oscillator -> Panner -> MasterGain -> Destination
    leftOsc.connect(leftPanner);
    leftPanner.connect(masterGain);

    rightOsc.connect(rightPanner);
    rightPanner.connect(masterGain);

    masterGain.connect(ctx.destination);

    // Store in Ref
    engine.current = {
      context: ctx,
      leftOsc,
      rightOsc,
      leftPanner,
      rightPanner,
      masterGain,
    };

    // Start Oscillators
    leftOsc.start();
    rightOsc.start();
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
      gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1); // 1s fade in
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
       gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
       gain.gain.exponentialRampToValueAtTime(0.001, stopTime);

       // Schedule Stop
       engine.current.leftOsc?.stop(stopTime);
       engine.current.rightOsc?.stop(stopTime);

       // Cleanup after stop
       setTimeout(() => {
          engine.current = {
             context: ctx,
             leftOsc: null,
             rightOsc: null,
             leftPanner: null,
             rightPanner: null,
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

    if (ctx && left && right) {
        // Smooth transition for frequency change
        const rampTime = 0.1;
        left.frequency.setTargetAtTime(base, ctx.currentTime, rampTime);
        right.frequency.setTargetAtTime(base + beat, ctx.currentTime, rampTime);
    }
  }, []);

  const setVolume = useCallback((val: number) => {
      setVolumeState(val);
      const ctx = engine.current.context;
      const gain = engine.current.masterGain;
      if (ctx && gain && isPlaying) {
          gain.gain.setTargetAtTime(val, ctx.currentTime, 0.1);
      }
  }, [isPlaying]);

  // Handle cleanup on unmount
  useEffect(() => {
    return () => {
      if (engine.current.context) {
        engine.current.context.close();
      }
    };
  }, []);

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
