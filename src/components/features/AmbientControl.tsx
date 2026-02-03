import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Slider } from '@/components/ui/Slider';
import { Button } from '@/components/ui/Button';
import { Wind, CloudRain, Zap } from 'lucide-react';

type NoiseType = 'pink' | 'white' | 'brown';

interface AmbientControlProps {
    isPlaying: boolean;
    volume: number;
    type: NoiseType;
    onVolumeChange: (val: number) => void;
    onTypeChange: (val: NoiseType) => void;
    onToggle: () => void;
    isNoisePlaying: boolean;
}

export const AmbientControl: React.FC<AmbientControlProps> = ({
    volume,
    type,
    onVolumeChange,
    onTypeChange,
    onToggle,
    isNoisePlaying,
    isPlaying
}) => {
    return (
        <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Wind className="w-5 h-5" /> Background Texture
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex gap-2">
                      <Button
                        variant={type === 'pink' ? "default" : "outline"}
                        size="sm"
                        onClick={() => onTypeChange('pink')}
                        className="flex-1"
                      >
                         <CloudRain className="w-4 h-4 mr-2" /> Pink
                      </Button>
                      <Button
                        variant={type === 'brown' ? "default" : "outline"}
                        size="sm"
                        onClick={() => onTypeChange('brown')}
                        className="flex-1"
                      >
                         <Wind className="w-4 h-4 mr-2" /> Brown
                      </Button>
                      <Button
                        variant={type === 'white' ? "default" : "outline"}
                        size="sm"
                        onClick={() => onTypeChange('white')}
                        className="flex-1"
                      >
                         <Zap className="w-4 h-4 mr-2" /> White
                      </Button>
                 </div>

                <div className="pt-2">
                    <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Mix Volume</span>
                        <span className="text-xs font-mono">{Math.round(volume * 100)}%</span>
                    </div>
                     <Slider
                        value={volume}
                        min={0}
                        max={1}
                        step={0.01}
                        onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                     />
                </div>

                 <Button
                    variant={isNoisePlaying ? "secondary" : "outline"}
                    className="w-full"
                    onClick={onToggle}
                 >
                     {isNoisePlaying ? "Mute Ambient" : "Enable Ambient"}
                 </Button>
            </CardContent>
        </Card>
    );
};
