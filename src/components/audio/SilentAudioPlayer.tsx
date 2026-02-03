import React, { useEffect, useRef } from 'react';

/**
 * SilentAudioPlayer
 * Plays a silent audio loop to keep the AudioContext active in the background on iOS/Android.
 * This is a known workaround for Web Audio API limitations on mobile devices.
 */

// 1 second of silent MP3 data (base64)
const SILENT_MP3 = "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjIwLjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD//////////////////////////////////////////////////////////////////8AAABhTGF2YzU4LjY1LjEwMAAAAAAAAAAA//OEAAABAAAAAAAABAAAAAAAIgAAAAAAAAAAAAAA//OEAAAAAAAABAAAAAAAIgAAAAAAAAAAAAAA//OEAAAAAAAABAAAAAAAIgAAAAAAAAAAAAAA//OEAAAAAAAABAAAAAAAIgAAAAAAAAAAAAAA";

interface SilentAudioPlayerProps {
    isPlaying: boolean;
}

import AudioContextManager from '@/lib/audio-context';

export const SilentAudioPlayer: React.FC<SilentAudioPlayerProps> = ({ isPlaying }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

    useEffect(() => {
        const audio = audioRef.current;
        const ctx = AudioContextManager.getInstance();

        if (!audio || !ctx) return;

        // Connect HTML5 Audio Element to Web Audio Context
        // This "tricks" iOS into thinking the Web Audio is driven by a native media element
        if (!sourceRef.current) {
            try {
                // Check if source already exists for this element (can throw if re-connecting)
                 if (!audio.dataset.connected) {
                    sourceRef.current = ctx.createMediaElementSource(audio);
                    sourceRef.current.connect(ctx.destination);
                    audio.dataset.connected = "true";
                 }
            } catch (e) {
                // Ignore if already connected
            }
        }

        if (isPlaying) {
             // Ensure context is running for iOS
            if (ctx.state === 'suspended') {
                ctx.resume();
            }

            audio.play().catch((err) => {
                console.warn("Silent audio blocked:", err);
            });
        } else {
            audio.pause();
            audio.currentTime = 0;
        }
    }, [isPlaying]);

    return (
        <audio
            ref={audioRef}
            src={SILENT_MP3}
            loop
            playsInline
            muted={false}
            // Do not use display:none, some browsers ignore it. Use opacity 0.
            style={{
                position: 'fixed',
                pointerEvents: 'none',
                opacity: 0,
                height: '1px',
                width: '1px'
            }}
        />
    );
};
