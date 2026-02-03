import React, { useEffect, useRef } from 'react';

/**
 * SilentAudioPlayer
 * Plays a silent audio loop to keep the AudioContext active in the background on iOS/Android.
 * This utilizes the "Stubborn Audio" technique: playing a track independently from the Web Audio graph.
 */

// 1 second of silent MP3 data
const SILENT_MP3 = "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjIwLjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD//////////////////////////////////////////////////////////////////8AAABhTGF2YzU4LjY1LjEwMAAAAAAAAAAA//OEAAABAAAAAAAABAAAAAAAIgAAAAAAAAAAAAAA//OEAAAAAAAABAAAAAAAIgAAAAAAAAAAAAAA//OEAAAAAAAABAAAAAAAIgAAAAAAAAAAAAAA//OEAAAAAAAABAAAAAAAIgAAAAAAAAAAAAAA";

interface SilentAudioPlayerProps {
    isPlaying: boolean;
}

export const SilentAudioPlayer: React.FC<SilentAudioPlayerProps> = ({ isPlaying }) => {
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
             // CRITICAL: Volume must be non-zero for iOS to consider it "active media"
             // but low enough to not be heard if it wasn't silent.
             audio.volume = 0.01;

            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch((err) => {
                    console.warn("Silent audio playback prevented:", err);
                });
            }
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
            // CRITICAL: muted={false} is required for iOS background audio
            muted={false}
            style={{
                position: 'fixed',
                pointerEvents: 'none',
                opacity: 0, // Visual hack: invisible but rendered
                height: '1px',
                width: '1px',
                zIndex: -1
            }}
        />
    );
};
