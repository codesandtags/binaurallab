import { useEffect, useRef } from 'react';
import { db } from '@/lib/db';
import { PRESETS } from '@/lib/constants';

interface UseSessionLoggerProps {
    isPlaying: boolean;
    baseFreq: number;
    binauralBeat: number;
}

export const useSessionLogger = ({ isPlaying, baseFreq, binauralBeat }: UseSessionLoggerProps) => {
    const startTimeRef = useRef<number | null>(null);

    useEffect(() => {
        if (isPlaying) {
            // Started
            startTimeRef.current = Date.now();
        } else {
            // Stopped
            if (startTimeRef.current) {
                const endTime = Date.now();
                const startTime = startTimeRef.current;
                const duration = Math.round((endTime - startTime) / 1000);

                // Only log meaningful sessions (> 5 seconds)
                if (duration > 5) {
                    const preset = PRESETS.find(p => p.base === baseFreq && p.beat === binauralBeat);

                    db.sessions.add({
                        startTime,
                        endTime,
                        duration,
                        baseFreq,
                        binauralBeat,
                        presetName: preset ? preset.name : undefined
                    }).catch(err => console.error('Failed to log session:', err));
                }

                startTimeRef.current = null;
            }
        }
    }, [isPlaying, baseFreq, binauralBeat]);
};
