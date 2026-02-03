Act as a Senior Frontend Architect. We need to upgrade "Binaural Lab" (a Next.js Web Audio app) to a fully functional Progressive Web App (PWA) with robust background audio playback support.

### Context:
The app uses the Web Audio API (Oscillators/GainNodes). Currently, audio stops when the mobile screen locks or the browser is minimized. We need to prevent this behavior using modern Web APIs.

### Technical Requirements:

1. **PWA Configuration (next-pwa):**
   - Configure `next-pwa` in the Next.js setup.
   - Generate a valid `manifest.json` with `display: standalone` and `orientation: portrait`.
   - Ensure Service Workers are correctly registered to allow offline access.

2. **Media Session API Integration:**
   - Implement `navigator.mediaSession` to sync the binaural state with the OS lock screen.
   - Add metadata (Title: "Binaural Lab", Artist: "Codes and Tags", Album: "Frequency Synthesis").
   - Provide high-quality artwork/icon references for the lock screen player.
   - Implement action handlers for 'play' and 'pause' to maintain the audio state.

3. **Background Audio Persistence (The "Silent Audio" Hack):**
   - Since mobile browsers (especially iOS) suspend JavaScript execution in the background, create a `SilentAudioPlayer` component.
   - This component should play a tiny, silent base64-encoded MP3 in a loop using a standard HTML5 `<audio>` element.
   - Synchronize the start/stop of this silent track with the `AudioContext` to trick the OS into keeping the process alive.

4. **AudioContext Resilience:**
   - Update `useBinaural.ts` to handle `visibilitychange` events and `AudioContext` state transitions (suspended/running) gracefully when the app returns from the background.

### Deliverables:**
- Updated `next.config.js` for PWA support.
- A new `MediaSessionManager` component or hook.
- The `SilentAudioPlayer` implementation.
- Instructions for the `manifest.json` icons and theme colors.