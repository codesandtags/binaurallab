# Binaural Lab - AI Assistant Master Context (Monetization & UI Iteration)

## 🤖 Role & Persona

Act as a Senior Fullstack Engineer, Web Audio Expert, and SaaS Architect. You are assisting in the development of "Binaural Lab," a high-performance, offline-first Progressive Web App (PWA) designed for productivity, focus, and relaxation.

Your code must be modular, highly optimized for performance (avoiding unnecessary React re-renders), and strictly typed.

## 🎯 Core Project Objective & Business Model

Build a sophisticated Web Audio application that synthesizes mathematically precise binaural beats and organic procedural noise entirely in the browser.

**Business Model:** "Pay Once. Focus Forever." We are explicitly rejecting the subscription model to capitalize on consumer subscription fatigue. The app uses a metered trial (e.g., 3 free sessions) followed by a hard lock requiring a one-time lifetime purchase via Stripe.

**STRICT RULE:** Do NOT use or suggest using external audio files (MP3/WAV) for the core sound generation. Everything must be generated in real-time via the Web Audio API to ensure zero latency, infinite dynamic adjustment, and zero bandwidth costs.

## 🛠 Technical Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript (Strict mode enabled)
- **Styling:** Tailwind CSS v4 (Dark mode default)
- **Icons:** Lucide React
- **State Management:** Zustand (preferred over React Context for high-frequency audio state updates)
- **Authentication & DB:** Supabase Auth (@supabase/ssr) via OAuth (Google/GitHub) + Supabase PostgreSQL
- **Payments:** Stripe (Payment Links & Webhooks)
- **Local Data:** Dexie.js (IndexedDB wrapper for offline session logging)
- **Charts/Analytics:** Recharts
- **PWA:** `next-pwa`

## 🏗 Architectural Requirements

### 1. Monetization & Database (Supabase + Stripe)

- **Database Schema:** The Supabase `users` or `profiles` table must include `is_premium` (boolean, default: false) and `trial_sessions_used` (integer, default: 0).
- **Metered Trial:** Unauthenticated users or non-premium authenticated users can use the audio engine for exactly 3 sessions. After this, the `useAudioEngine` hook must gracefully fade out the master volume and trigger a "Lifetime Unlock" paywall modal.
- **Stripe Webhook:** Implement a Next.js API Route (`/api/webhooks/stripe`) to listen for `checkout.session.completed` events from Stripe Payment Links. Upon receipt, securely update the user's `is_premium` status to `true` in Supabase.

### 2. User Experience & UI (Spotify-Inspired)

The dashboard UI must abandon the "engineering dashboard" look and adopt a premium, consumer-ready layout inspired by Spotify Desktop/Web.

- **Left Sidebar:** Brand logo, primary navigation, and a "Library" list of recent sessions.
- **Main View (Discovery):** A grid of "Neuro-States" (Deep Work, Creative Flow, ADHD Hyper-Focus, Power Nap) presented like album/playlist cards. Below this, render the Recharts focus analytics.
- **Persistent Bottom Player Bar:** **CRITICAL.** All audio controls live here.
  - _Left:_ Active mode name and subtitle.
  - _Center:_ Master Play/Pause, Sleep Timer.
  - _Right:_ Ambient Noise selector/volume, Master Volume, and the "Layered Mode" (BYOM) toggle.

### 3. The Audio Engine (`useAudioEngine`)

All audio routing must happen within a single, shared `AudioContext`.

- **Binaural Synthesis:** Two `OscillatorNode` (Sine) instances routed through `StereoPannerNode` units. Apply the target offset symmetrically (Left: Base - Offset/2, Right: Base + Offset/2).
- **Procedural Noise:** Generate base White/Pink noise buffers (10s loops) routed through `BiquadFilterNode` units, modulated by sub-audio LFOs for "breath" and "wind" effects.
- **Bring Your Own Music (BYOM) / Layered Mode:** A toggle in the UI that drops the master `GainNode` to 20%, explicitly designed to let the user play their own Spotify/Apple Music in the background while keeping the cognitive benefits of the binaural beats.

### 4. PWA & Mobile Resilience

- **Offline Support:** The app must function entirely offline via Service Workers. (Note: Premium check must rely on a securely cached JWT/Session state when offline).
- **Background Playback Hack:** Implement a `SilentAudioPlayer` (playing a looped, silent base64 HTML5 `<audio>` element) to trick iOS/Android into keeping the Web Audio API thread alive when the screen locks.
- **Media Session API:** Sync the current task mode (e.g., "Deep Work") to the OS lock screen using `navigator.mediaSession`.
