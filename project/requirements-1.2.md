Act as a Senior Web Audio Engineer. We are refactoring a React hook `useNoise.ts` to evolve it from static buffer looping to "Dynamic Procedural Synthesis." The goal is to make Pink, Brown, and White noise sound "organic" and "natural" like wind or ocean waves, suitable for deep work and sleep.

### Context:
Currently, the hook uses a 2-second buffer which sounds clinical and repetitive. We need to implement modulation and filtering to create "movement."

### Refactor Requirements:

1. **Procedural Audio Graph:**
   - Instead of pre-calculated 2s buffers, implement a long-running white noise generator (or a much larger 10s buffer) as the base source.
   - Route the noise through a `BiquadFilterNode`.
   - Use a Low-pass filter for Brown noise and a Band-pass/High-shelf mix for Pink noise to ensure spectral accuracy.

2. **LFO Modulation (The "Breath" Effect):**
   - Implement a Low-Frequency Oscillator (LFO) using a `Sine` or `Triangle` wave at a very low frequency (0.05Hz - 0.1Hz).
   - Connect the LFO to the `GainNode.gain` to create subtle volume "swells" (simulating breathing or distant waves).
   - Connect a second LFO to the `BiquadFilterNode.frequency` to create "spectral movement" (filtering wind gusts).

3. **Performance & Clean Architecture:**
   - Ensure the `AudioContext` is shared or efficiently managed between `useBinaural` and `useNoise` to prevent hardware collisions.
   - Use `setTargetAtTime` for all parameter changes (volume, type switching) to ensure glitch-free, click-free transitions.
   - Maintain the existing TypeScript interfaces but improve the `NoiseEngineRef` to include the new Filter and LFO nodes.

4. **Code Structure:**
   - Provide the refactored `useNoise.ts`.
   - Suggest a small update to `useBinaural.ts` if needed to ensure both hooks can run concurrently without overloading the CPU or creating phase issues.

### Deliverable:**
Write the production-ready TypeScript code for the refactored `useNoise.ts` hook.