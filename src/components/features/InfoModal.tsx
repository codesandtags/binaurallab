import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Info, AlertTriangle, X } from 'lucide-react';

interface InfoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <Card className="max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-card z-10 border-b">
                    <CardTitle className="flex items-center gap-2">
                        <Info className="w-5 h-5 text-primary" /> Guide & Safety
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
                        <X className="w-4 h-4" />
                    </Button>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">

                    <section className="space-y-2">
                        <h3 className="font-bold text-lg">How it Works</h3>
                        <p className="text-sm text-muted-foreground">
                            Binaural beats play two slightly different frequencies in each ear. Your brain processes the difference (the "beat") and entrains to that frequency.
                        </p>
                    </section>

                    <div className="grid grid-cols-1 gap-3">
                         <div className="p-3 rounded-lg bg-secondary/30 border border-secondary">
                             <span className="font-bold text-primary block">Delta (0.5 - 4Hz)</span>
                             <span className="text-xs text-muted-foreground">Deep restorative sleep, healing, detachment from awareness.</span>
                         </div>
                         <div className="p-3 rounded-lg bg-secondary/30 border border-secondary">
                             <span className="font-bold text-primary block">Theta (4 - 8Hz)</span>
                             <span className="text-xs text-muted-foreground">REM sleep, deep meditation, creativity, intuition.</span>
                         </div>
                         <div className="p-3 rounded-lg bg-secondary/30 border border-secondary">
                             <span className="font-bold text-primary block">Alpha (8 - 14Hz)</span>
                             <span className="text-xs text-muted-foreground">Relaxed focus, flow state, stress reduction, learning.</span>
                         </div>
                         <div className="p-3 rounded-lg bg-secondary/30 border border-secondary">
                             <span className="font-bold text-primary block">Beta (14 - 30Hz)</span>
                             <span className="text-xs text-muted-foreground">Focused attention, cognitive processing, problem solving.</span>
                         </div>
                         <div className="p-3 rounded-lg bg-secondary/30 border border-secondary">
                             <span className="font-bold text-primary block">Gamma (30 - 50Hz)</span>
                             <span className="text-xs text-muted-foreground">Peak concentration, high-level information processing.</span>
                         </div>
                    </div>

                    <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 space-y-2">
                        <h4 className="font-bold text-destructive flex items-center gap-2 text-sm">
                            <AlertTriangle className="w-4 h-4" /> Safety Disclaimer
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Do not use binaural beats while driving, operating heavy machinery, or performing tasks that require full attention.
                            Users with epilepsy, seizure, or heart disorders should consult a physician before use.
                        </p>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
};
