import { useRef, useState, useCallback, useEffect } from 'react';
import AudioContextManager from '@/lib/audio-context';

export type NoiseType = 'pink' | 'white' | 'brown' | 'drone';

interface NoiseEngineRef {
    context: AudioContext | null;
    
    // Noise nodes
    source: AudioBufferSourceNode | null;
    filter: BiquadFilterNode | null;
    lfoGain: OscillatorNode | null;
    lfoFilter: OscillatorNode | null;
    
    // Drone nodes
    droneOscillators: OscillatorNode[];
    droneLfo: OscillatorNode | null;
    
    // Common mix nodes
    limitGain: GainNode | null; 
    variableGain: GainNode | null; 
}

/**
 * Generates a mathematical Impulse Response (IR) for lush, cavernous reverb
 */
function createSyntheticReverb(
  context: AudioContext,
  duration: number = 4,
  decay: number = 2.5,
) {
  const sampleRate = context.sampleRate;
  const length = sampleRate * duration;
  const impulse = context.createBuffer(2, length, sampleRate);
  const left = impulse.getChannelData(0);
  const right = impulse.getChannelData(1);

  for (let i = 0; i < length; i++) {
    const multiplier = Math.pow(1 - i / length, decay);
    left[i] = (Math.random() * 2 - 1) * multiplier;
    right[i] = (Math.random() * 2 - 1) * multiplier;
  }
  return impulse;
}

export const useNoise = () => {
    const engine = useRef<NoiseEngineRef>({
        context: null,
        source: null,
        filter: null,
        lfoGain: null,
        lfoFilter: null,
        droneOscillators: [],
        droneLfo: null,
        limitGain: null,
        variableGain: null,
    });

    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolumeState] = useState(0.6);
    const [type, setTypeState] = useState<NoiseType>('pink');

    // Use a ref for volume to prevent `play` from being recreated when volume sliders move,
    // which would otherwise cause the useEffect to rapidly restart the audio.
    const volumeRef = useRef(volume);
    useEffect(() => {
        volumeRef.current = volume;
    }, [volume]);

    const initAudio = useCallback(() => {
        const ctx = AudioContextManager.getInstance();
        if (ctx && !engine.current.context) {
             engine.current.context = ctx;
        }
        return engine.current.context;
    }, []);

    // Create a 10-second white noise buffer (base source)
    const createNoiseBuffer = (ctx: AudioContext): AudioBuffer => {
        const bufferSize = ctx.sampleRate * 10;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        return buffer;
    };

    const stop = useCallback(() => {
        const { source, context, limitGain, lfoGain, lfoFilter, droneOscillators, droneLfo } = engine.current;
        if (context && limitGain) {
            const stopTime = context.currentTime + 0.5;
            limitGain.gain.cancelScheduledValues(context.currentTime);
            limitGain.gain.setValueAtTime(limitGain.gain.value, context.currentTime);
            limitGain.gain.exponentialRampToValueAtTime(0.001, stopTime);

            if (source) { try { source.stop(stopTime); } catch (e) {} }
            if (lfoGain) { try { lfoGain.stop(stopTime); } catch (e) {} }
            if (lfoFilter) { try { lfoFilter.stop(stopTime); } catch (e) {} }
            droneOscillators.forEach(osc => { try { osc.stop(stopTime); } catch (e) {} });
            if (droneLfo) { try { droneLfo.stop(stopTime); } catch (e) {} }

            setTimeout(() => {
                if (source) { try { source.disconnect(); } catch (e) {} }
                if (lfoGain) { try { lfoGain.disconnect(); } catch (e) {} }
                if (lfoFilter) { try { lfoFilter.disconnect(); } catch (e) {} }
                droneOscillators.forEach(osc => { try { osc.disconnect(); } catch (e) {} });
                if (droneLfo) { try { droneLfo.disconnect(); } catch (e) {} }
                if (limitGain) { try { limitGain.disconnect(); } catch (e) {} }
                
                // Clear state just to be safe
                engine.current.source = null;
                engine.current.lfoGain = null;
                engine.current.lfoFilter = null;
                engine.current.droneOscillators = [];
                engine.current.droneLfo = null;
                engine.current.limitGain = null;
            }, 600);
        }
        setIsPlaying(false);
    }, []);

    const play = useCallback(() => {
        const ctx = initAudio();
        if (!ctx) return;

        if (ctx.state === 'suspended') ctx.resume();

        // Cleanup existing (re-play logic with smooth fadeout)
        const prevEngine = { ...engine.current };
        if (prevEngine.limitGain && ctx) {
            const stopTime = ctx.currentTime + 0.5;
            prevEngine.limitGain.gain.cancelScheduledValues(ctx.currentTime);
            prevEngine.limitGain.gain.setValueAtTime(prevEngine.limitGain.gain.value, ctx.currentTime);
            prevEngine.limitGain.gain.exponentialRampToValueAtTime(0.001, stopTime);

            if (prevEngine.source) { try { prevEngine.source.stop(stopTime); } catch (e) {} }
            if (prevEngine.lfoGain) { try { prevEngine.lfoGain.stop(stopTime); } catch (e) {} }
            if (prevEngine.lfoFilter) { try { prevEngine.lfoFilter.stop(stopTime); } catch (e) {} }
            prevEngine.droneOscillators.forEach(osc => { try { osc.stop(stopTime); } catch (e) {} });
            if (prevEngine.droneLfo) { try { prevEngine.droneLfo.stop(stopTime); } catch (e) {} }

            setTimeout(() => {
                if (prevEngine.source) { try { prevEngine.source.disconnect(); } catch (e) {} }
                if (prevEngine.lfoGain) { try { prevEngine.lfoGain.disconnect(); } catch (e) {} }
                if (prevEngine.lfoFilter) { try { prevEngine.lfoFilter.disconnect(); } catch (e) {} }
                prevEngine.droneOscillators.forEach(osc => { try { osc.disconnect(); } catch (e) {} });
                if (prevEngine.droneLfo) { try { prevEngine.droneLfo.disconnect(); } catch (e) {} }
                if (prevEngine.limitGain) { try { prevEngine.limitGain.disconnect(); } catch (e) {} }
            }, 600);
        } else {
             // Immediate cleanup if no limitGain found
             if (prevEngine.source) { try { prevEngine.source.stop(); prevEngine.source.disconnect(); } catch (e) {} }
             if (prevEngine.lfoGain) { try { prevEngine.lfoGain.stop(); prevEngine.lfoGain.disconnect(); } catch (e) {} }
             if (prevEngine.lfoFilter) { try { prevEngine.lfoFilter.stop(); prevEngine.lfoFilter.disconnect(); } catch (e) {} }
             prevEngine.droneOscillators.forEach(osc => { try { osc.stop(); osc.disconnect(); } catch (e) {} });
             if (prevEngine.droneLfo) { try { prevEngine.droneLfo.stop(); prevEngine.droneLfo.disconnect(); } catch (e) {} }
        }

        // Master volume for this track
        const limitGain = ctx.createGain(); 
        limitGain.gain.setValueAtTime(0, ctx.currentTime);
        limitGain.gain.linearRampToValueAtTime(Math.max(volumeRef.current, 0.001), ctx.currentTime + 1);

        let source: AudioBufferSourceNode | null = null;
        let lfoGain: OscillatorNode | null = null;
        let lfoFilter: OscillatorNode | null = null;
        let filter: BiquadFilterNode | null = null;
        let variableGain: GainNode | null = null;
        let droneOscillators: OscillatorNode[] = [];
        let droneLfo: OscillatorNode | null = null;

        if (type === 'drone') {
            // -- Cinematic Drone Engine --
            
            // 1. Setup the Procedural Reverb
            const convolver = ctx.createConvolver();
            convolver.buffer = createSyntheticReverb(ctx);

            // Create a dry/wet mix for the reverb
            const dryGain = ctx.createGain();
            const wetGain = ctx.createGain();
            dryGain.gain.value = 0.4;
            wetGain.gain.value = 0.8;

            // 2. Setup the "Dark" Lowpass Filter
            const lowpassFilter = ctx.createBiquadFilter();
            lowpassFilter.type = "lowpass";
            lowpassFilter.frequency.value = 250; // Keep it dark and brooding
            lowpassFilter.Q.value = 2; // Slight resonance for character
            filter = lowpassFilter;

            // 3. Setup the LFO (The "Breath")
            droneLfo = ctx.createOscillator();
            droneLfo.type = "sine";
            droneLfo.frequency.value = 0.05; // One full cycle every 20 seconds
            const droneLfoGain = ctx.createGain();
            droneLfoGain.gain.value = 150; // How wide the filter opens (250Hz + 150Hz)

            droneLfo.connect(droneLfoGain);
            droneLfoGain.connect(lowpassFilter.frequency);

            // 4. Create the Chord Oscillators (Root, Fifth, Octave)
            const baseFreq = 65.41; // C2 (Deep Bass)
            const frequencies = [
                { freq: baseFreq, detune: -4 }, // Root (detuned flat)
                { freq: baseFreq * 1.5, detune: 5 }, // Perfect Fifth (detuned sharp)
                { freq: baseFreq * 2, detune: -2 }, // Octave
            ];

            droneOscillators = frequencies.map(({ freq, detune }) => {
                const osc = ctx.createOscillator();
                osc.type = "sawtooth"; // Sawtooth provides the rich harmonics needed for pads
                osc.frequency.value = freq;
                osc.detune.value = detune;

                // Lower the volume of individual oscillators to prevent clipping
                const oscGain = ctx.createGain();
                oscGain.gain.value = 0.2;

                osc.connect(oscGain);
                oscGain.connect(lowpassFilter);
                return osc;
            });

            // 5. Route Everything
            lowpassFilter.connect(dryGain);
            lowpassFilter.connect(convolver);
            convolver.connect(wetGain);

            dryGain.connect(limitGain);
            wetGain.connect(limitGain);
            limitGain.connect(ctx.destination);

            // 6. Start the Engine
            droneLfo.start();
            droneOscillators.forEach((osc) => osc.start());

        } else {
            // -- Noise Engine (Pink/Brown/White) --

            const buffer = createNoiseBuffer(ctx);
            source = ctx.createBufferSource();
            source.buffer = buffer;
            source.loop = true;

            filter = ctx.createBiquadFilter();
            if (type === 'brown') {
                filter.type = 'lowpass';
                filter.frequency.value = 180;
                filter.Q.value = 1;
            } else if (type === 'pink') {
                filter.type = 'lowpass';
                filter.frequency.value = 800;
                filter.Q.value = 0.5;
            } else {
                filter.type = 'lowpass';
                filter.frequency.value = 18000;
            }

            variableGain = ctx.createGain(); 
            // Makeup gain because severe lowpass filtering drops volume substantially
            if (type === 'brown') {
                variableGain.gain.value = 12.0; 
            } else if (type === 'pink') {
                variableGain.gain.value = 5.0;
            } else {
                variableGain.gain.value = 1.0;
            }

            lfoGain = ctx.createOscillator();
            lfoGain.type = 'sine';
            lfoGain.frequency.value = 0.1;
            const lfoGainDepth = ctx.createGain();
            lfoGainDepth.gain.value = variableGain.gain.value * 0.2; // Modulate by 20% of base gain

            lfoGain.connect(lfoGainDepth);
            lfoGainDepth.connect(variableGain.gain);

            lfoFilter = ctx.createOscillator();
            lfoFilter.type = 'triangle';
            lfoFilter.frequency.value = 0.05;
            const lfoFilterDepth = ctx.createGain();
            lfoFilterDepth.gain.value = type === 'white' ? 500 : 100; 

            lfoFilter.connect(lfoFilterDepth);
            lfoFilterDepth.connect(filter.frequency);

            source.connect(filter);
            filter.connect(variableGain);
            variableGain.connect(limitGain);
            limitGain.connect(ctx.destination);

            source.start();
            lfoGain.start();
            lfoFilter.start();
        }

        // Store Refs
        engine.current = {
            ...engine.current,
            source,
            filter,
            variableGain,
            limitGain,
            lfoGain,
            lfoFilter,
            droneOscillators,
            droneLfo
        };

        setIsPlaying(true);
    }, [initAudio, type]); // removed `volume` to prevent infinite restart loops when slider moves

    // Handle Volume Change
    const setVolume = useCallback((val: number) => {
        setVolumeState(val);
        const { context, limitGain } = engine.current;
        if (context && limitGain) {
             limitGain.gain.setTargetAtTime(Math.max(val, 0.001), context.currentTime, 0.1);
        }
    }, []);

    // Handle Type Change
    const setType = useCallback((newType: NoiseType) => {
        setTypeState(newType);
    }, []);

    // Effect to handle type switching while playing
    useEffect(() => {
        if (isPlaying) {
             const timer = setTimeout(() => {
                 play();
             }, 0);
             return () => clearTimeout(timer);
        }
    }, [type, isPlaying, play]);

    // Cleanup
    useEffect(() => {
        return () => {
             const prevEngine = engine.current;
             if (prevEngine.source) { try { prevEngine.source.stop(); prevEngine.source.disconnect(); } catch (e) {} }
             if (prevEngine.lfoGain) { try { prevEngine.lfoGain.stop(); prevEngine.lfoGain.disconnect(); } catch (e) {} }
             if (prevEngine.lfoFilter) { try { prevEngine.lfoFilter.stop(); prevEngine.lfoFilter.disconnect(); } catch (e) {} }
             prevEngine.droneOscillators.forEach(osc => { try { osc.stop(); osc.disconnect(); } catch (e) {} });
             if (prevEngine.droneLfo) { try { prevEngine.droneLfo.stop(); prevEngine.droneLfo.disconnect(); } catch (e) {} }
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
