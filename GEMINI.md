# GEMINI.md - Project Overview: Binaural Lab

## Project Overview

**Binaural Lab** is a high-performance Progressive Web App (PWA) designed for productivity, meditation, and sleep. It functions as a Binaural Beat Generator, synthesizing pure sine waves in real-time using the Web Audio API to create precise psychoacoustic effects.

The application is built with **Next.js 16** (App Router) and **TypeScript**. State management is handled with React Hooks, and styling is done with **Tailwind CSS**. It is a PWA, enabled by the `next-pwa` library, allowing for offline functionality and installation on mobile devices.

The core of the application lies in the `useBinaural.ts` hook, which manages the Web Audio API context for generating binaural beats. It creates and controls `OscillatorNode`s for the left and right channels, `StereoPannerNode`s for positioning the audio, and a `GainNode` for volume control. The `useNoise.ts` hook generates procedural pink, white, or brown noise by creating a 10-second white noise buffer and applying different `BiquadFilterNode` configurations. It also uses Low-Frequency Oscillators (LFOs) to modulate the volume ("breath") and filter frequency ("spectral movement") for a more natural, dynamic sound. The `useSessionLogger.ts` hook tracks user sessions that last longer than 5 seconds, logging the start time, end time, duration, base frequency, and binaural beat to IndexedDB via `Dexie.js`.

The UI is built with React components and includes features like presets for different brainwave states, manual frequency and volume controls, an ambient noise mixer, and a sleep timer.

## Building and Running

### Prerequisites
- Node.js
- npm

### Installation
```bash
npm install
```

### Development
To run the development server:
```bash
npm run dev
```

### Production Build
To build the application for production:
```bash
npm run build
```

### Running in Production
To start the production server:
```bash
npm run start
```

### Linting
To run the linter:
```bash
npm run lint
```

## Development Conventions

- **Singleton AudioContext**: A singleton pattern is used for the `AudioContext` at `src/lib/audio-context.ts` to ensure all audio nodes across the application share the same `AudioContext` instance. This is a critical architectural decision to prevent resource exhaustion and timing issues.
- **Component-Based Architecture**: The application follows a component-based architecture with a clear separation of concerns. Feature components are located in `src/components/features`, and UI components are in `src/components/ui`.
- **Media Session API Integration**: The `useMediaSession.ts` hook integrates with the browser's `mediaSession` API to provide a richer media experience, allowing the application to display media controls outside of the browser window.
- **Hooks for Logic**: Business logic and side effects are encapsulated in custom React hooks (e.g., `useBinaural`, `useNoise`, `useSessionLogger`).
- **Constants for Configuration**: A constants file at `src/lib/constants.ts` defines presets for different binaural beat frequencies and the minimum and maximum values for the base and beat frequencies.
- **Styling**: Tailwind CSS is used for styling, with custom styles defined in `src/app/globals.css`.
- **State Management**: State is managed primarily through React's built-in hooks (`useState`, `useRef`, `useCallback`, `useEffect`). `Zustand` is also listed as a dependency, suggesting its potential use for global state management.
- **Offline First**: The application is designed to be a PWA with offline capabilities.
- **Testing**: There are no explicit testing frameworks or scripts in the `package.json`.
- **Contributing**: The `CONTRIBUTING.md` file provides guidelines for reporting bugs, suggesting enhancements, and submitting pull requests. It also includes style guides for Git commit messages and TypeScript/React code.
