# Binaural Lab 🎧

**Binaural Lab** is a high-performance Progressive Web App (PWA) designed for productivity, meditation, and sleep. It primarily functions as a **Binaural Beat Generator**, synthesizing pure sine waves in real-time using the Web Audio API to create precise psychoacoustic effects without relying on static audio files.

## features

### 🔊 **Pure Audio Engine**
- **Real-time Synthesis**: Uses `OscillatorNodes` and `StereoPannerNodes` for mathematical precision.
- **Dynamic Procedural Noise**: Organic Pink/Brown noise generated via 10s buffer loops, modulated by LFOs for "Breath" (Volume) and "Movement" (Filter) effects to mimic natural environments like wind or ocean.
- **Dual-Channel Processing**: Precise frequency separation (Base vs Base + Beat) for accurate brainwave entrainment.

### 🎛 **Controls & Customization**
- **Presets**: Instant access to Alpha, Beta, Delta, Theta, and Gamma states with descriptive benefits.
- **Manual Tuning**: Fine-grain control over Carrier Frequency (50Hz - 900Hz) and Binaural Offset (0.5Hz - 50Hz).
- **Acoustic Environment**: Mix ambient noise with binaural beats for masking and comfort.
- **Sleep Timer**: Built-in countdown with smart audio fade-out.

### 📊 **Data & Analytics**
- **Session Logging**: Automatically tracks your focus sessions in IndexedDB (local, private storage).
- **Weekly Stats**: Visualizes your daily usage over the last 7 days.

### 📱 **PWA & Performance**
- **Offline First**: Fully functional without internet connection.
- **Installable**: Add to home screen on iOS and Android.
- **Zero Latency**: Instant audio response.

## Tech Stack
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State**: React Hooks (`useBinaural`, `useNoise`, `useSessionLogger`)
- **Database**: Dexie.js (IndexedDB wrapper)
- **Charts**: Recharts

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

---
*Engineered for Codes and Tags*

