import React from 'react';
import { Slider } from '@/components/ui/Slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { MIN_BASE_FREQ, MAX_BASE_FREQ, MIN_BEAT_FREQ, MAX_BEAT_FREQ } from '@/lib/constants';

interface FrequencyControlProps {
    baseFreq: number;
    beatFreq: number;
    onChange: (base: number, beat: number) => void;
}

export const FrequencyControl: React.FC<FrequencyControlProps> = ({ baseFreq, beatFreq, onChange }) => {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle>Manual Calibration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <Slider
                    label="Base Frequency (Carrier)"
                    valueDisplay={`${baseFreq} Hz`}
                    min={MIN_BASE_FREQ}
                    max={MAX_BASE_FREQ}
                    step={1}
                    value={baseFreq}
                    onChange={(e) => onChange(Number(e.target.value), beatFreq)}
                />

                <Slider
                    label="Binaural Beat (Offset)"
                    valueDisplay={`${beatFreq} Hz`}
                    min={MIN_BEAT_FREQ}
                    max={MAX_BEAT_FREQ}
                    step={0.5}
                    value={beatFreq}
                    onChange={(e) => onChange(baseFreq, Number(e.target.value))}
                />
            </CardContent>
        </Card>
    );
};
