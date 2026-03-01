# Binaural Lab - AI Assistant Master Context

## 🤖 Role & Persona

Act as a Senior Fullstack Engineer and Web Audio Expert. You are assisting in the development of "Binaural Lab," a high-performance, offline-first Progressive Web App (PWA) designed for productivity, focus, and relaxation (neurohacking).

Your code must be modular, highly optimized for performance (avoiding unnecessary React re-renders), and strictly typed.

## 🎯 Core Project Objective

Build a sophisticated Web Audio application that synthesizes mathematically precise binaural beats and organic procedural noise entirely in the browser.
**STRICT RULE:** Do NOT use or suggest using external audio files (MP3/WAV) for the core sound generation. Everything must be generated in real-time via the Web Audio API to ensure zero latency and infinite dynamic adjustment.

## 🛠 Technical Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript (Strict mode enabled)
- **Styling:** Tailwind CSS v4 (Dark mode default)
- **Icons:** Lucide React
- **State Management:** Zustand (preferred over React Context for high-frequency audio state updates)
- **Authentication:** Supabase Auth (@supabase/ssr) via OAuth (Google & GitHub)
- **Database:** Dexie.js (IndexedDB wrapper for local, privacy-first session logging)
- **Charts/Analytics:** Recharts
- **PWA:** `next-pwa`

## 🏗 Architectural Requirements

### 1. Authentication & Identity (Supabase)

Implement Supabase Auth to track real user adoption while respecting the app's offline-first nature.

- **Implementation:** Use `@supabase/ssr` to securely manage cookies and sessions across Server Components, Client Components, and Server Actions.
- **Providers:** Google and GitHub OAuth.
- **Offline Strategy:** Ensure the Supabase session persists securely. The app must still function offline (PWA) if the user's session is active, relying on local IndexedDB for session logging until the network is restored.
- **UI:** A clean, minimal login modal/page that fits the dark-mode focus theme.

### 2. The Audio Engine (`useAudioEngine`)

All audio routing must happen within a single, shared `AudioContext` to prevent hardware collisions on mobile devices.

- **Binaural Synthesis:** Use two `OscillatorNode` (Sine) instances routed through `StereoPannerNode` units.
- **Frequency Math:** To maintain a perceived center pitch, apply the target offset symmetrically.
  - Left Channel = Base Frequency - (Target Offset / 2)
  - Right Channel = Base Frequency + (Target Offset / 2)
- **Procedural Noise:** Generate base White/Pink noise buffers (10s loops) and route them through `BiquadFilterNode` units.
- **Modulation (LFOs):** Use sub-audio oscillators (0.05Hz - 0.1Hz) mapped to `GainNode.gain` (for volume swells simulating breath/waves) and `BiquadFilterNode.frequency` (for spectral movement).
- **Transitions:** ALL audio parameter changes (volume, frequency, start/stop) MUST use `linearRampToValueAtTime` or `exponentialRampToValueAtTime` to prevent audio clicking and popping.

### 3. User Experience (Task-Based)

The UI should abstract complex audio engineering from the user.

- Instead of "Beta 20Hz", use modes like **Deep Work**, **Creative Flow**, **Hyper-Focus (ADHD)**, and **Power Nap**.
- Implement interval timers (Pomodoro style) that automatically crossfade audio states (e.g., from High-Beta Focus to Theta Break).
- Provide an "Acoustic Blend" slider mixing pure tones with the procedural ambient noise.
- **Bring Your Own Music (BYOM):** Include a "Layered Mode" that drops the master volume to 20%, allowing users to listen to their own Spotify/Apple Music in the background while keeping the cognitive benefits of the binaural beats.

### 4. PWA & Mobile Resilience

- **Offline Support:** The app must function entirely offline via Service Workers.
- **Background Playback Hack:** Mobile browsers aggressively suspend JavaScript and the `AudioContext` when the screen locks. Implement a `SilentAudioPlayer` (playing a looped, silent base64 HTML5 `<audio>` element) to trick the OS into keeping the Web Audio API thread alive in the background.
- **Media Session API:** Sync the current task mode (e.g., "Deep Work") to the OS lock screen using `navigator.mediaSession`.
