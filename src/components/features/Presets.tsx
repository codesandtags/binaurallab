import React from 'react';
import { PRESETS } from '@/lib/constants';
import { Button } from '@/components/ui/Button';

interface PresetsProps {
    onSelect: (base: number, beat: number) => void;
    activeBeat: number;
}

export const Presets: React.FC<PresetsProps> = ({ onSelect, activeBeat }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {PRESETS.map((preset) => (
                <Button
                    key={preset.name}
                    variant={activeBeat === preset.beat ? "default" : "outline"}
                    onClick={() => onSelect(preset.base, preset.beat)}
                    className="flex flex-col h-auto py-4 space-y-2 relative group overflow-hidden min-h-[100px]"
                >
                    <div className="flex flex-col items-center">
                        <span className="font-bold text-xl tracking-tight">{preset.name}</span>
                        <span className="text-xs font-mono opacity-70 mb-1">{preset.beat}Hz</span>
                    </div>

                    <span className="text-[10px] sm:text-xs text-center leading-tight opacity-90 px-1 font-medium max-w-[120px]">
                        {preset.description}
                    </span>
                </Button>
            ))}
        </div>
    );
};
