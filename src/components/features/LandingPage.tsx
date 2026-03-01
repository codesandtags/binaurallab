'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { 
    Brain, Zap, Moon, Activity, Play, 
    Headphones, Volume2, Star, CheckCircle2, 
    Sparkles, ArrowRight, Music, Layers
} from 'lucide-react';
import { Slider } from '@/components/ui/Slider';

export const LandingPage = () => {
    const [dynamicText, setDynamicText] = useState('Deep Work');
    const [sliderValue, setSliderValue] = useState(50);
    const words = ['Deep Work', 'Creative Flow', 'Restorative Sleep', 'ADHD Focus'];
    
    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            i = (i + 1) % words.length;
            setDynamicText(words[i]);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-[#030711] text-foreground selection:bg-primary/30 font-sans">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#030711]/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                                <Activity className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-xl tracking-tight">Binaural Lab</span>
                        </div>
                        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                            <a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a>
                            <a href="#features" className="hover:text-primary transition-colors">Science</a>
                            <a href="#byom" className="hover:text-primary transition-colors">BYOM</a>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link href="/login">
                                <Button variant="ghost" className="text-sm font-semibold px-5">Sign In</Button>
                            </Link>
                            <Link href="/?guest=true">
                                <Button className="text-sm font-bold px-6 bg-primary hover:bg-primary/90 rounded-full shadow-lg shadow-primary/20">
                                    Try for Free
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* 1. Interactive Hero Section */}
            <header className="relative pt-40 pb-32 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.15),transparent_50%)] pointer-events-none" />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-10">
                        <Sparkles className="w-3.5 h-3.5" /> THE FUTURE OF COGNITIVE AUDIO
                    </div>
                    
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-white">
                        Master Your State of Mind.<br />
                        <span className="bg-gradient-to-r from-primary via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                           Engineered for {dynamicText}.
                        </span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed mb-12">
                        Stop fighting distractions. Our neurological audio engine syncs your brainwaves to peak performance states in minutes.
                    </p>

                    {/* Interactive Widget */}
                    <div className="max-w-md mx-auto mb-12 p-1 rounded-[32px] bg-gradient-to-b from-white/10 to-transparent border border-white/10 backdrop-blur-md">
                        <div className="bg-[#0d121f]/60 p-6 rounded-[30px] flex flex-col gap-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                        <Play className="w-6 h-6 fill-current" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-sm font-bold text-white">Instant Sync</div>
                                        <div className="text-[10px] font-mono text-primary animate-pulse uppercase tracking-wider">Synthesizing...</div>
                                    </div>
                                </div>
                                <Headphones className="w-5 h-5 text-muted-foreground/50" />
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest px-1">
                                    <span className={sliderValue < 50 ? 'text-blue-400' : 'text-muted-foreground'}>Relaxation</span>
                                    <span className={sliderValue >= 50 ? 'text-primary' : 'text-muted-foreground'}>Deep Focus</span>
                                </div>
                                <Slider 
                                    value={sliderValue} 
                                    min={0} max={100} step={1}
                                    onChange={(e) => setSliderValue(Number(e.target.value))}
                                    className="accent-primary"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                        <Link href="/?guest=true" className="w-full sm:w-auto">
                            <Button size="lg" className="w-full sm:w-auto px-12 h-16 text-lg font-black rounded-2xl bg-white text-black hover:bg-gray-200 shadow-2xl shadow-white/10 transition-all hover:scale-105">
                                Try it Free (No Sign-Up)
                            </Button>
                        </Link>
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4 text-green-500/80" /> No Credit Card Required
                        </div>
                    </div>
                </div>
            </header>

            {/* 2. BYOM Section */}
            <section id="byom" className="py-32 bg-[#050a18] border-y border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_50%,rgba(124,58,237,0.08),transparent_40%)]" />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <Layers className="w-7 h-7 text-primary" />
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] text-white">
                                Don&apos;t give up your playlists.
                            </h2>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Our app runs surgically precise binaural beats <span className="text-white font-semibold">underneath</span> your Spotify, Apple Music, or YouTube audio. Add a neurological layer to the music you already love.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                    </div>
                                    <p className="text-sm text-muted-foreground"><span className="text-white font-medium">Native Overlay:</span> Works globally across your device.</p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    </div>
                                    <p className="text-sm text-muted-foreground"><span className="text-white font-medium">Acoustic Masking:</span> Perfectly tuned frequency blending.</p>
                                </div>
                            </div>
                        </div>

                        {/* CSS Mockup */}
                        <div className="relative p-8 rounded-[40px] bg-card border border-white/10 shadow-3xl">
                             <div className="space-y-10">
                                 {/* Mock Spotify Header */}
                                 <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 grayscale">
                                     <div className="w-12 h-12 bg-[#1DB954] rounded-full flex items-center justify-center">
                                         <Music className="w-6 h-6 text-black" />
                                     </div>
                                     <div className="flex-1 space-y-2">
                                         <div className="h-2 w-32 bg-white/20 rounded-full" />
                                         <div className="h-1.5 w-20 bg-white/10 rounded-full" />
                                     </div>
                                     <Volume2 className="w-5 h-5 text-white/40" />
                                 </div>

                                 {/* Our Layer */}
                                 <div className="space-y-6">
                                     <div className="flex items-center justify-between">
                                         <div className="flex items-center gap-3">
                                             <Activity className="w-5 h-5 text-primary" />
                                             <span className="text-sm font-black uppercase tracking-tighter text-white">Binaural Blend</span>
                                         </div>
                                         <span className="text-xs font-mono text-primary">Active</span>
                                     </div>
                                     
                                     <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20 space-y-6">
                                         <div className="space-y-3">
                                             <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
                                                 <span>Master Volume</span>
                                                 <span>20%</span>
                                             </div>
                                             <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                                 <div className="h-full w-[20%] bg-primary shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
                                             </div>
                                         </div>
                                         <div className="space-y-3">
                                             <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
                                                 <span>Binaural Intensity</span>
                                                 <span>85%</span>
                                             </div>
                                             <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                                 <div className="h-full w-[85%] bg-primary shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
                                             </div>
                                         </div>
                                     </div>
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Benefit-Driven Feature Cards */}
            <section id="features" className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20 space-y-4">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white">Choose Your Focus State.</h2>
                    <p className="text-xl text-muted-foreground">Clinically designed frequencies for every phase of your day.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Card 1 */}
                    <div className="group relative p-8 rounded-[32px] bg-card border border-white/5 hover:border-primary/30 transition-all duration-500 overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity">
                            <Zap className="w-12 h-12 text-blue-500" />
                        </div>
                        <div className="relative z-10 space-y-6">
                            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <Zap className="w-7 h-7" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-white">Deep Work</h3>
                                <p className="text-muted-foreground">Crush your coding session or write that essay. Stay locked into complex tasks longer.</p>
                            </div>
                            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Beta Waves 14-30Hz</span>
                                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="group relative p-8 rounded-[32px] bg-card border border-white/5 hover:border-primary/30 transition-all duration-500 overflow-hidden shadow-2xl shadow-primary/5">
                        <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity">
                            <Brain className="w-12 h-12 text-primary" />
                        </div>
                        <div className="relative z-10 space-y-6">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <Brain className="w-7 h-7" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-white">ADHD Hyper-Focus</h3>
                                <p className="text-muted-foreground">Lock in with high-intensity stimulation. Maximum cognitive recruitment for intense focus.</p>
                            </div>
                            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Gamma 40Hz + Brown Noise</span>
                                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="group relative p-8 rounded-[32px] bg-card border border-white/5 hover:border-primary/30 transition-all duration-500 overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity">
                            <Moon className="w-12 h-12 text-indigo-500" />
                        </div>
                        <div className="relative z-10 space-y-6">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                <Moon className="w-7 h-7" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-white">Deep Recovery</h3>
                                <p className="text-muted-foreground">Unplug from the day and heal. Deep meditation and restorative rest on demand.</p>
                            </div>
                            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Theta & Delta Waves</span>
                                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. UI Preview */}
            <section className="py-32 bg-[#030711] relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                         <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">The Lab is Open.</h2>
                         <p className="text-muted-foreground text-lg">A minimal interface for maximum cognitive output.</p>
                    </div>

                    <div className="relative max-w-5xl mx-auto rounded-[40px] border border-white/10 bg-card overflow-hidden shadow-3xl">
                         {/* Mock UI Header */}
                         <div className="h-12 border-b border-white/5 flex items-center px-6 gap-2">
                             <div className="w-3 h-3 rounded-full bg-red-500/20" />
                             <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                             <div className="w-3 h-3 rounded-full bg-green-500/20" />
                         </div>
                         
                         <div className="p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
                             <div className="space-y-12">
                                 {/* Mock Controls */}
                                 <div className="space-y-8">
                                     <div className="w-24 h-24 rounded-full border-4 border-primary border-t-transparent animate-spin-slow flex items-center justify-center mx-auto">
                                         <Activity className="w-8 h-8 text-primary" />
                                     </div>
                                     <div className="space-y-6">
                                          <div className="h-2 w-full bg-white/5 rounded-full" />
                                          <div className="h-2 w-full bg-white/5 rounded-full" />
                                          <div className="h-2 w-2/3 bg-white/5 rounded-full mx-auto" />
                                     </div>
                                 </div>
                                 <div className="grid grid-cols-3 gap-3">
                                     <div className="h-10 rounded-xl bg-white/5 border border-white/5" />
                                     <div className="h-10 rounded-xl bg-primary/20 border border-primary/40" />
                                     <div className="h-10 rounded-xl bg-white/5 border border-white/5" />
                                 </div>
                             </div>
                             
                             <div className="space-y-8">
                                 <div className="h-40 rounded-[32px] bg-gradient-to-br from-primary/10 to-transparent border border-white/5 flex items-center justify-center">
                                     <div className="text-center">
                                         <div className="text-4xl font-black text-white">25:00</div>
                                         <div className="text-[10px] uppercase font-bold text-primary tracking-widest mt-2">Timer Active</div>
                                     </div>
                                 </div>
                                 <div className="space-y-4">
                                     <div className="flex justify-between items-center px-2">
                                         <div className="h-3 w-20 bg-white/20 rounded-full" />
                                         <div className="h-3 w-10 bg-white/10 rounded-full" />
                                     </div>
                                     <div className="h-48 rounded-[32px] bg-white/5 border border-white/5" />
                                 </div>
                             </div>
                         </div>
                    </div>
                </div>
            </section>

            {/* 5. Wall of Love */}
            <section className="py-32 bg-[#050a18] relative overflow-hidden border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="text-center mb-20 space-y-4">
                        <h2 className="text-4xl font-black tracking-tight text-white italic">Trusted by the best.</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-[32px] bg-card/50 border border-white/5 space-y-6">
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-primary text-primary" />)}
                            </div>
                            <p className="text-lg text-white leading-relaxed font-medium">
                                &quot;The best 2 hours of deep work all week without the music fatigue of other apps.&quot;
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/20" />
                                <div>
                                    <div className="text-sm font-bold text-white">Alex River</div>
                                    <div className="text-xs text-muted-foreground">Senior Software Engineer</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 rounded-[32px] bg-card border border-primary/20 space-y-6 shadow-2xl shadow-primary/5">
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-primary text-primary" />)}
                            </div>
                            <p className="text-lg text-white leading-relaxed font-medium">
                                &quot;Being able to layer these beats under my own Spotify playlists is the ultimate killer feature.&quot;
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/20" />
                                <div>
                                    <div className="text-sm font-bold text-white">Sarah Chen</div>
                                    <div className="text-xs text-muted-foreground">Product Designer</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 rounded-[32px] bg-card/50 border border-white/5 space-y-6">
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-primary text-primary" />)}
                            </div>
                            <p className="text-lg text-white leading-relaxed font-medium">
                                &quot;Finally, an ADHD focus tool that doesn&apos;t feel like a toy. Mathematically precise.&quot;
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/20" />
                                <div>
                                    <div className="text-sm font-bold text-white">Marcus Thorne</div>
                                    <div className="text-xs text-muted-foreground">Fullstack Architect</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t border-white/5 bg-[#030711]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
                     <div className="flex flex-col items-center gap-8">
                         <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                                 <Activity className="w-6 h-6 text-white" />
                             </div>
                             <span className="font-bold text-2xl tracking-tight text-white">Binaural Lab</span>
                         </div>
                         
                         <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-muted-foreground">
                             <a href="#" className="hover:text-white transition-colors">Twitter</a>
                             <a href="#" className="hover:text-white transition-colors">GitHub</a>
                             <a href="#" className="hover:text-white transition-colors">Support</a>
                             <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                         </div>
                     </div>
                     
                     <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                         <div className="text-xs text-muted-foreground">
                             © 2026 Binaural Lab. Built for high-performance minds.
                         </div>
                         <div className="flex items-center gap-6 text-xs text-muted-foreground">
                             <span>Terms of Service</span>
                             <span>GDPR Compliant</span>
                         </div>
                     </div>
                </div>
            </footer>
        </div>
    );
};
