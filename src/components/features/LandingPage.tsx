import React from 'react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Brain, Zap, Moon, Shield, Sparkles, Activity } from 'lucide-react';

export const LandingPage = () => {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                <Activity className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <span className="font-bold text-xl tracking-tight">Binaural Lab</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href="/login">
                                <Button variant="ghost" className="text-sm font-medium">Log In</Button>
                            </Link>
                            <Link href="/login">
                                <Button className="text-sm font-bold px-6 shadow-lg shadow-primary/20">Sign Up</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-8 animate-fade-in">
                        <Sparkles className="w-3 h-3" /> PRECISION NEUROHACKING
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                        Master Your State of Mind.
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed mb-10">
                        Synthesize mathematically precise binaural beats and organic procedural noise to unlock peak focus, deep meditation, and restorative sleep.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/login" className="w-full sm:w-auto">
                            <Button size="lg" className="w-full sm:w-auto px-10 h-14 text-lg font-bold rounded-2xl shadow-xl shadow-primary/25 hover:scale-105 transition-transform">
                                Start Training Now
                            </Button>
                        </Link>
                        <Link href="/login" className="w-full sm:w-auto">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto px-10 h-14 text-lg font-semibold rounded-2xl border-white/10 hover:bg-white/5">
                                Explore Benefits
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Grid Features */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-8 rounded-3xl bg-card/50 border border-white/5 backdrop-blur-sm hover:border-primary/20 transition-colors group">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Zap className="w-6 h-6 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 italic">Hyper-Focus</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Beta waves (14-30Hz) stimulate cognitive processing and alert attention. Perfect for complex coding, writing, or deep work.
                        </p>
                    </div>
                    <div className="p-8 rounded-3xl bg-card/50 border border-white/5 backdrop-blur-sm hover:border-primary/20 transition-colors group">
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Brain className="w-6 h-6 text-purple-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 italic">Flow State</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Alpha waves (8-14Hz) bridge the gap between consciousness and subconscious. Ideal for creativity, learning, and stress reduction.
                        </p>
                    </div>
                    <div className="p-8 rounded-3xl bg-card/50 border border-white/5 backdrop-blur-sm hover:border-primary/20 transition-colors group">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Moon className="w-6 h-6 text-indigo-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 italic">Deep Recovery</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Theta (4-8Hz) and Delta (0.5-4Hz) waves guide you into REM sleep and deep restoration. Unplug from the day and heal.
                        </p>
                    </div>
                </div>

                {/* Scientific Section */}
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-40">
                    <div className="p-10 rounded-[40px] bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/10 relative overflow-hidden">
                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-black tracking-tight mb-6">Real-time Synthesis. Zero Latency.</h2>
                                <ul className="space-y-4">
                                    <li className="flex items-center gap-3 text-muted-foreground">
                                        <Shield className="w-5 h-5 text-primary" />
                                        <span>Mathematical precision via Web Audio API</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-muted-foreground">
                                        <Shield className="w-5 h-5 text-primary" />
                                        <span>No audio files - pure procedural generation</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-muted-foreground">
                                        <Shield className="w-5 h-5 text-primary" />
                                        <span>Privacy-first, offline-ready session logging</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="p-8 rounded-3xl bg-black/40 border border-white/5 font-mono text-sm space-y-2">
                                <div className="text-primary/60">{`// Neurohacking parameters`}</div>
                                <div className="text-white">const baseFreq = <span className="text-blue-400">200</span>;</div>
                                <div className="text-white">const targetBeat = <span className="text-blue-400">10.5</span>;</div>
                                <div className="text-white">const state = <span className="text-purple-400">&apos;ALPHA_FLOW&apos;</span>;</div>
                                <br />
                                <div className="text-primary/60">{`// Synthesize brainwave sync`}</div>
                                <div className="text-white">engine.startBinaural(baseFreq, targetBeat);</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-40 border-t border-white/5 py-12">
                     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2 grayscale opacity-50">
                            <Activity className="w-4 h-4" />
                            <span className="font-bold text-sm tracking-tight">Binaural Lab</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            © 2024 Binaural Lab. Open Source Neurohacking.
                        </div>
                     </div>
                </footer>
            </main>
        </div>
    );
};
