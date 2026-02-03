import { useRef, useState, useCallback, useEffect } from 'react';
import AudioContextManager from '@/lib/audio-context';

type NoiseType = 'pink' | 'white' | 'brown';

interface NoiseEngineRef {
    context: AudioContext | null;
    source: AudioBufferSourceNode | null;
    limitGain: GainNode | null; // For overall leveling
    variableGain: GainNode | null; // For LFO volume modulation (breath)
    filter: BiquadFilterNode | null;
    lfoGain: OscillatorNode | null; // LFO for gain modulation
    lfoFilter: OscillatorNode | null; // LFO for filter modulation
    lfoFilterGain: GainNode | null; // Depth of filter modulation
}

export const useNoise = () => {
    const engine = useRef<NoiseEngineRef>({
        context: null,
        source: null,
        limitGain: null,
        variableGain: null,
        filter: null,
        lfoGain: null,
        lfoFilter: null,
        lfoFilterGain: null,
    });

    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolumeState] = useState(0.5);
    const [type, setTypeState] = useState<NoiseType>('pink');

    const initAudio = useCallback(() => {
        const ctx = AudioContextManager.getInstance();
        if (ctx && !engine.current.context) {
             engine.current.context = ctx;
        }
        return engine.current.context;
    }, []);

    // Create a 10-second white noise buffer (base source)
    const createNoiseBuffer = (ctx: AudioContext): AudioBuffer => {
        const bufferSize = ctx.sampleRate * 10; // 10 seconds for less repetition
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        return buffer;
    };

    const stop = useCallback(() => {
        const { source, context, limitGain, lfoGain, lfoFilter } = engine.current;
        if (source && context && limitGain) {
            const stopTime = context.currentTime + 0.5;
            limitGain.gain.exponentialRampToValueAtTime(0.001, stopTime);
            source.stop(stopTime);
            lfoGain?.stop(stopTime);
            lfoFilter?.stop(stopTime);

            setTimeout(() => {
                source.disconnect();
                lfoGain?.disconnect();
                lfoFilter?.disconnect();
                engine.current.source = null;
                // Don't nullify context
            }, 600);
        }
        setIsPlaying(false);
    }, []);

    const play = useCallback(() => {
        const ctx = initAudio();
        if (!ctx) return;

        if (ctx.state === 'suspended') ctx.resume();

        // Cleanup existing (re-play logic)
        if (engine.current.source) {
            engine.current.source.stop();
            engine.current.source.disconnect();
        }

        // 1. Source: White Noise Loop
        const buffer = createNoiseBuffer(ctx);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        // 2. Filter Setup
        const filter = ctx.createBiquadFilter();
        // Default based on type - will be refined
        if (type === 'brown') {
            filter.type = 'lowpass';
            filter.frequency.value = 180;
            filter.Q.value = 1;
        } else if (type === 'pink') {
            // "Pink-ish" approximation using Lowpass + specific gain or Highshelf cut
            // True pink noise is -3dB/octave. Biquads are -12dB/oct.
            // A common trick is multiple filters or just a gentle Lowpass for aesthetics.
            // Let's use a broader Lowpass at higher freq + Lowshelf boost
            filter.type = 'lowpass';
            filter.frequency.value = 800;
            filter.Q.value = 0.5;
        } else {
             // White - almost no filtering, maybe slight rolloff
             filter.type = 'lowpass';
             filter.frequency.value = 18000;
        }

        // 3. Gain Nodes for Volume Control & Modulation
        const variableGain = ctx.createGain(); // modulated by LFO
        variableGain.gain.value = 0.8;

        const limitGain = ctx.createGain(); // Master volume for this track
        limitGain.gain.setValueAtTime(0, ctx.currentTime);
        limitGain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1);

        // 4. LFO 1: "breath" (Volume Modulation)
        // Very slow sine wave (0.1Hz ~ 10s cycle) to create ocean-like swell
        const lfoGain = ctx.createOscillator();
        lfoGain.type = 'sine';
        lfoGain.frequency.value = 0.1;
        const lfoGainDepth = ctx.createGain();
        lfoGainDepth.gain.value = 0.15; // Modulate volume by +/- 0.15

        lfoGain.connect(lfoGainDepth);
        lfoGainDepth.connect(variableGain.gain);

        // 5. LFO 2: "spectral movement" (Filter Frequency Modulation)
        // Slower 0.05Hz
        const lfoFilter = ctx.createOscillator();
        lfoFilter.type = 'triangle';
        lfoFilter.frequency.value = 0.05;
        const lfoFilterDepth = ctx.createGain();
        lfoFilterDepth.gain.value = type === 'white' ? 500 : 100; // Modulate Freq by +/- Hz

        lfoFilter.connect(lfoFilterDepth);
        lfoFilterDepth.connect(filter.frequency);

        // Graph Connection
        // Source -> Filter -> VariableGain (LFO'd) -> LimitGain (User Vol) -> Destination
        source.connect(filter);
        filter.connect(variableGain);
        variableGain.connect(limitGain);
        limitGain.connect(ctx.destination);

        // Start Oscillators
        source.start();
        lfoGain.start();
        lfoFilter.start();

        // Store Refs
        engine.current = {
            ...engine.current,
            source,
            filter,
            variableGain,
            limitGain,
            lfoGain,
            lfoFilter,
            lfoFilterDepth: lfoFilterDepth // Need to store if we want to tweak later, but ref implies direct node
        } as any; // Cast for custom props not in initial interface if needed, or update interface

        setIsPlaying(true);
    }, [initAudio, type, volume]);

    // Handle Volume Change
    const setVolume = useCallback((val: number) => {
        setVolumeState(val);
        const { context, limitGain } = engine.current;
        if (context && limitGain) {
             limitGain.gain.setTargetAtTime(val, context.currentTime, 0.1);
        }
    }, []);

    // Handle Type Change
    const setType = useCallback((newType: NoiseType) => {
        setTypeState(newType);
    }, []);

    // Effect to handle type switching while playing
    useEffect(() => {
        if (isPlaying) {
            play(); // Re-trigger play to rebuild graph with new filter settings
        }
    }, [type]);

    // Cleanup
    useEffect(() => {
        return () => {
            // shared context, don't close. Just stop.
             if (engine.current.source) {
                 try {
                     engine.current.source.stop();
                 } catch (e) {}
             }
             engine.current.context = null;
        };
    }, []);

    return {
        play,
        stop,
        isPlaying,
        volume,
        setVolume,
        type,
        setType
    };
};
