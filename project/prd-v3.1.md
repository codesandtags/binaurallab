Act as a Senior Web Audio API Engineer. We are upgrading the `useAudioEngine` hook in "Binaural Lab" to solve user fatigue. Currently, the raw sine waves at high beat frequencies (Beta/Gamma) sound too harsh and clinical.

We need to implement "Harmonic Layering" and strict volume ducking to make the audio sound warm, premium, and subliminal.

Please refactor the audio routing logic with the following requirements:

### 1. Harmonic Layering (The "Spa Chord" Effect)

- Instead of creating just one pair of oscillators for the binaural beat, create a **secondary pair** of oscillators.
- This secondary pair should be pitched to a Perfect Fifth above the base frequency (`baseFrequency * 1.5`).
- Apply the same `targetBeat` offset to this secondary pair.
- Route this harmonic pair into its own `GainNode` set to a very low volume (e.g., `0.05` or 5% of master) so it acts as a subtle, warm drone behind the main frequency.

### 2. Default Mix Levels (Subliminal Audio)

- The human ear shouldn't focus on the sine wave; it should be subliminal.
- Set the primary Binaural Tone `GainNode` to max out at **15% (0.15)** by default.
- Set the Ambient Noise (Pink/Brown) `GainNode` default to **60% (0.60)**. The noise should act as an "acoustic blanket" covering the raw frequencies.

### 3. Smooth Transitions

- Ensure all frequency changes (when switching presets) and volume changes use `exponentialRampToValueAtTime` or `setTargetAtTime` to prevent clicking and popping, especially now that we are managing 4 active oscillators.

Please provide the updated Web Audio API routing logic for this new Harmonic engine.
