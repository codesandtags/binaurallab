import { useRef, useState, useCallback, useEffect } from 'react';

type NoiseType = 'pink' | 'white' | 'brown';

interface NoiseEngineRef {
    context: AudioContext | null;
    source: AudioBufferSourceNode | null;
    gain: GainNode | null;
}

export const useNoise = () => {
    const engine = useRef<NoiseEngineRef>({
        context: null,
        source: null,
        gain: null,
    });

    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolumeState] = useState(0.5);
    const [type, setTypeState] = useState<NoiseType>('pink');

    const initAudio = useCallback(() => {
        if (!engine.current.context) {
             const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
             engine.current.context = new AudioContextClass();
        }
        return engine.current.context;
    }, []);

    const createNoiseBuffer = (ctx: AudioContext, type: NoiseType): AudioBuffer => {
        const bufferSize = ctx.sampleRate * 2; // 2 seconds buffer
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = buffer.getChannelData(0);

        if (type === 'white') {
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }
        } else if (type === 'pink') {
            let b0, b1, b2, b3, b4, b5, b6;
            b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                output[i] *= 0.11; // (roughly) compensate for gain
                b6 = white * 0.115926;
            }
        } else if (type === 'brown') {
            let lastOut = 0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                output[i] = (lastOut + (0.02 * white)) / 1.02;
                lastOut = output[i];
                output[i] *= 3.5; // (roughly) compensate for gain
            }
        }
        return buffer;
    };

    const stop = useCallback(() => {
        const { source, context, gain } = engine.current;
        if (source && context && gain) {
            gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.5);
            source.stop(context.currentTime + 0.5);
            source.disconnect();
            engine.current.source = null;
        }
        setIsPlaying(false);
    }, []);

    const play = useCallback(() => {
        const ctx = initAudio();
        if (!ctx) return;

        // Resume if suspended
        if (ctx.state === 'suspended') ctx.resume();

        // Stop existing if needed (switching types)
        if (engine.current.source) {
            engine.current.source.stop();
            engine.current.source.disconnect();
        }

        const buffer = createNoiseBuffer(ctx, type);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1);

        source.connect(gain);
        gain.connect(ctx.destination);
        source.start();

        engine.current.source = source;
        engine.current.gain = gain;

        setIsPlaying(true);
    }, [initAudio, type, volume]);

    // Handle Volume Change
    const setVolume = useCallback((val: number) => {
        setVolumeState(val);
        const { context, gain } = engine.current;
        if (context && gain) {
             gain.gain.setTargetAtTime(val, context.currentTime, 0.1);
        }
    }, []);

    // Handle Type Change
    const setType = useCallback((newType: NoiseType) => {
        setTypeState(newType);
        // If playing, restart with new type
        if (engine.current.source && engine.current.context?.state === 'running') {
             // We need to trigger a restart, but we can't easily call play() here inside useCallback without dep cycle or strict mode issues
             // Simplest way: let the user restart or handle it via useEffect?
             // Let's rely on a separate effect to restart if playing and type changes?
        }
    }, []);

    // Effect to handle type switching while playing
    useEffect(() => {
        if (isPlaying) {
            play(); // Re-trigger play to swap buffer
        }
    }, [type]); // Warning: This might cause loop if play changes isPlaying.
                // play() sets isPlaying(true) which is same.
                // But play() creates NEW source.

    // Cleanup
    useEffect(() => {
        return () => {
             if (engine.current.context) engine.current.context.close();
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
