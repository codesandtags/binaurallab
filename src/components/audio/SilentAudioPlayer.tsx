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

export const SilentAudioPlayer: React.FC<SilentAudioPlayerProps> = ({ isPlaying }) => {
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.play().catch(() => {
                // Auto-play policies might block this if not triggered by user interaction.
                // However, since isPlaying is usually set via a button click, this often works.
                console.warn("Silent audio blocked");
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
            muted={false} // Must not be muted to effectively keep session alive on some OS
            style={{ display: 'none' }}
        />
    );
};
