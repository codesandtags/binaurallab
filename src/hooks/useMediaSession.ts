import { useEffect } from 'react';

interface UseMediaSessionProps {
    title: string;
    artist: string;
    album: string;
    artwork?: { src: string; sizes: string; type: string }[];
    isPlaying: boolean;
    onPlay: () => void;
    onPause: () => void;
}

export const useMediaSession = ({
    title,
    artist,
    album,
    artwork = [],
    isPlaying,
    onPlay,
    onPause,
}: UseMediaSessionProps) => {
    useEffect(() => {
        if (!('mediaSession' in navigator)) return;

        // Set metadata
        navigator.mediaSession.metadata = new MediaMetadata({
            title,
            artist,
            album,
            artwork,
        });

        // Handler for Play
        navigator.mediaSession.setActionHandler('play', () => {
             onPlay();
        });

        // Handler for Pause
        navigator.mediaSession.setActionHandler('pause', () => {
             onPause();
        });

        // Cleanup
        return () => {
            navigator.mediaSession.setActionHandler('play', null);
            navigator.mediaSession.setActionHandler('pause', null);
        };
    }, [title, artist, album, artwork, onPlay, onPause]);

    // Sync state
    useEffect(() => {
        if (!('mediaSession' in navigator)) return;
        navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    }, [isPlaying]);
};
