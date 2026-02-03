Act as a Senior Software Architect and Fullstack Engineer. We are building "Binaural Lab," a high-performance Progressive Web App (PWA) for productivity and neurohacking.

### Core Objective:
Create a pure binaural beat generator using the Web Audio API. The application must NOT use external audio files (MP3/WAV). It must generate raw sine waves in real-time to ensure mathematical precision and zero-latency frequency shifts.

### Technical Stack:
- Framework: Next.js (App Router) with TypeScript.
- Styling: Tailwind CSS (Dark Mode by default).
- Icons: Lucide React.
- State Management: React Context or Zustand.
- Database: IndexedDB (using Dexie.js) for local persistence.
- Analytics: Recharts for usage visualization.

### Architecture Requirements:

1. **Audio Engine Hook (`useBinaural`):**
   - Initialize a single `AudioContext`.
   - Create two `OscillatorNodes` (Sine type).
   - Implement two `StereoPannerNode` units to isolate the Left and Right channels.
   - Frequency Logic: If Base = 200Hz and Target = 15Hz (Beta), set Left to 200Hz and Right to 215Hz.
   - Implement a `GainNode` for Master Volume and smooth Start/Stop transitions.

2. **Core Features:**
   - **Smart Presets:** Dedicated buttons for Delta (2Hz), Theta (5Hz), Alpha (10Hz), Beta (20Hz), and Gamma (40Hz).
   - **Manual Calibration:** Range sliders for Base Frequency (100Hz - 400Hz) and Binaural Offset (0.5Hz - 50Hz).
   - **Intelligent Sleep Timer:** A countdown timer that triggers `gainNode.exponentialRampToValueAtTime` for a 30-second smooth fade-out before stopping the oscillators.

3. **Data & Persistence:**
   - Automatically log every session (Timestamp, Mode, Duration, Frequency) into IndexedDB.
   - Build a "Stats Dashboard" showing a bar chart of "Focused Hours" per week.

4. **PWA & Performance:**
   - Configure `next-pwa` for full offline support via Service Workers.
   - Ensure the AudioContext handles "Resume" states after user interaction (browser policy compliance).

### Deliverables:**
- Provide the folder structure following Clean Architecture.
- Generate the code for the `useBinaural` hook.
- Generate the main Dashboard component with the audio controls and the Sleep Timer logic.