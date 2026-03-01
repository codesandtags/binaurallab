Act as a Senior Web Audio API Engineer and React Architect. We are adding a premium "Cinematic Drone" ambient texture to our "Binaural Lab" Next.js PWA to help mask high-frequency binaural beats (Beta/Gamma) and provide a lush, musical background without using external audio files.

Currently, our `useAudioEngine` hook supports procedural Pink, Brown, and White noise. I need to add 'drone' as a fourth option.

Please provide the updated code for the following:

### 1. The Audio Engine Update (`useAudioEngine.ts` or equivalent)

Add a new function to generate a procedural Cinematic Drone using subtractive synthesis. It must include:

- **Synthetic Reverb:** A helper function that creates an Impulse Response (IR) buffer using decaying white noise for a `ConvolverNode` (to simulate a massive cavern).
- **The Drone Core:** Three `OscillatorNodes` set to `sawtooth` waveforms, pitched to a Root (e.g., 65.41Hz / C2), a Perfect Fifth (Root _ 1.5), and an Octave (Root _ 2). Slightly detune them (-4, +5, -2 cents) to create a thick chorus effect.
- **The Dark Filter:** Route the oscillators through a `BiquadFilterNode` (lowpass, set around 250Hz).
- **The Breath (LFO):** Create a slow sub-audio `sine` oscillator (0.05Hz) connected to the filter's frequency via a `GainNode` to make the pad slowly swell open and closed.
- Ensure this generator handles clean fade-ins and fade-outs (`setTargetAtTime`) when the user switches between Pink/Brown noise and the Drone.

### 2. The UI Update (`BottomPlayer.tsx`)

- Update the Ambient Texture selector (dropdown or toggle group) in the bottom player to include "Cinematic Drone" as a selectable option alongside Pink, Brown, and White noise.
- Use an appropriate `lucide-react` icon for it (e.g., `Waves` or `Music`).

Please provide the specific Web Audio API implementation for the drone and show how to integrate it into the existing noise-switching logic.

For inspiration you can see the following code:

```typescript
/**
 * Generates a mathematical Impulse Response (IR) for lush, cavernous reverb
 * without needing an external audio file.
 */
function createSyntheticReverb(
  context: AudioContext,
  duration: number = 4,
  decay: number = 2.5,
) {
  const sampleRate = context.sampleRate;
  const length = sampleRate * duration;
  const impulse = context.createBuffer(2, length, sampleRate);
  const left = impulse.getChannelData(0);
  const right = impulse.getChannelData(1);

  for (let i = 0; i < length; i++) {
    // Generate white noise and apply an exponential decay envelope
    const multiplier = Math.pow(1 - i / length, decay);
    left[i] = (Math.random() * 2 - 1) * multiplier;
    right[i] = (Math.random() * 2 - 1) * multiplier;
  }
  return impulse;
}

/**
 * Creates the Cinematic Drone audio graph.
 */
export function startCinematicDrone(
  context: AudioContext,
  destination: AudioNode,
) {
  const masterDroneGain = context.createGain();
  masterDroneGain.gain.value = 0; // Start at 0 for a smooth fade-in

  // 1. Setup the Procedural Reverb
  const convolver = context.createConvolver();
  convolver.buffer = createSyntheticReverb(context);

  // Create a dry/wet mix for the reverb
  const dryGain = context.createGain();
  const wetGain = context.createGain();
  dryGain.gain.value = 0.4;
  wetGain.gain.value = 0.8;

  // 2. Setup the "Dark" Lowpass Filter
  const lowpassFilter = context.createBiquadFilter();
  lowpassFilter.type = "lowpass";
  lowpassFilter.frequency.value = 250; // Keep it dark and brooding
  lowpassFilter.Q.value = 2; // Slight resonance for character

  // 3. Setup the LFO (The "Breath")
  const lfo = context.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.05; // One full cycle every 20 seconds
  const lfoGain = context.createGain();
  lfoGain.gain.value = 150; // How wide the filter opens (250Hz + 150Hz)

  lfo.connect(lfoGain);
  lfoGain.connect(lowpassFilter.frequency);

  // 4. Create the Chord Oscillators (Root, Fifth, Octave)
  const baseFreq = 65.41; // C2 (Deep Bass)
  const frequencies = [
    { freq: baseFreq, detune: -4 }, // Root (detuned flat)
    { freq: baseFreq * 1.5, detune: 5 }, // Perfect Fifth (detuned sharp)
    { freq: baseFreq * 2, detune: -2 }, // Octave
  ];

  const oscillators = frequencies.map(({ freq, detune }) => {
    const osc = context.createOscillator();
    osc.type = "sawtooth"; // Sawtooth provides the rich harmonics needed for pads
    osc.frequency.value = freq;
    osc.detune.value = detune;

    // Lower the volume of individual oscillators to prevent clipping
    const oscGain = context.createGain();
    oscGain.gain.value = 0.2;

    osc.connect(oscGain);
    oscGain.connect(lowpassFilter);
    return osc;
  });

  // 5. Route Everything
  lowpassFilter.connect(dryGain);
  lowpassFilter.connect(convolver);
  convolver.connect(wetGain);

  dryGain.connect(masterDroneGain);
  wetGain.connect(masterDroneGain);
  masterDroneGain.connect(destination);

  // 6. Start the Engine
  lfo.start();
  oscillators.forEach((osc) => osc.start());

  // Smooth 5-second fade-in
  masterDroneGain.gain.setTargetAtTime(0.6, context.currentTime, 2);

  // Return a cleanup function
  return function stopCinematicDrone() {
    masterDroneGain.gain.setTargetAtTime(0, context.currentTime, 1);
    setTimeout(() => {
      lfo.stop();
      oscillators.forEach((osc) => osc.stop());
      masterDroneGain.disconnect();
    }, 3000);
  };
}
```
