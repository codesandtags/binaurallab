// We lowered the MIN_BASE_FREQ to 50Hz to allow for deep, sub-bass rumbles.
export const MIN_BASE_FREQ = 50;
export const MAX_BASE_FREQ = 900;
export const MIN_BEAT_FREQ = 0.5;
export const MAX_BEAT_FREQ = 50;

export const PRESETS = [
  {
    name: "Power Nap", // Formerly Delta
    base: 90,
    beat: 2,
    description: "Deep Sleep & Healing",
    noiseType: "brown", // Suggesting default noise mappings
  },
  {
    name: "Deep Recovery", // Formerly Theta
    base: 110,
    beat: 6,
    description: "Meditation & Subconscious",
    noiseType: "pink",
  },
  {
    name: "Creative Flow", // Formerly Alpha
    base: 140,
    beat: 10,
    description: "Relaxed Focus & Writing",
    noiseType: "pink",
  },
  {
    name: "ADHD Hyper-Focus", // Formerly Beta
    base: 150, // Dropped from 300Hz to remove the "dial tone" harshness
    beat: 20,
    description: "Active Thinking & Logic",
    noiseType: "brown",
  },
  {
    name: "Deep Work", // Formerly Gamma
    base: 120, // Dropped from 200Hz. Creates a deep, fast "engine rumble"
    beat: 40,
    description: "Peak Concentration",
    noiseType: "brown",
  },
];
