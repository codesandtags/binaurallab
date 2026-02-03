import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Timer, X } from 'lucide-react';

interface SleepTimerProps {
    onTimerComplete: () => void;
    isPlaying: boolean;
}

export const SleepTimer: React.FC<SleepTimerProps> = ({ onTimerComplete, isPlaying }) => {
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive && timeLeft !== null && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                   if (prev === null || prev <= 1) {
                       // Timer finished
                       clearInterval(interval);
                       return 0;
                   }
                   return prev - 1;
                });
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            // Trigger completion
            onTimerComplete();
            setIsActive(false);
            setTimeLeft(null);
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft, onTimerComplete]);

    // If audio stops manually, cancel timer?
    useEffect(() => {
        if (!isPlaying) {
            setIsActive(false);
            setTimeLeft(null);
        }
    }, [isPlaying]);

    const startTimer = (minutes: number) => {
        setTimeLeft(minutes * 60);
        setIsActive(true);
    };

    const cancelTimer = () => {
        setIsActive(false);
        setTimeLeft(null);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Timer className="w-5 h-5" /> Sleep Timer
                </CardTitle>
                {isActive && (
                    <Button variant="ghost" size="sm" onClick={cancelTimer} className="h-8 w-8 p-0">
                        <X className="w-4 h-4" />
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                {isActive && timeLeft !== null ? (
                    <div className="text-center py-4">
                        <span className="text-4xl font-mono font-bold">{formatTime(timeLeft)}</span>
                        <p className="text-sm text-muted-foreground mt-2">Fading out in {formatTime(timeLeft)}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-2">
                        <Button variant="outline" onClick={() => startTimer(15)}>15m</Button>
                        <Button variant="outline" onClick={() => startTimer(30)}>30m</Button>
                        <Button variant="outline" onClick={() => startTimer(60)}>60m</Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
