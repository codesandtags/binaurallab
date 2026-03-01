Act as a Senior Frontend Architect and Conversion Rate Optimization (CRO) Expert. We are redesigning the landing page for "Binaural Lab," our Next.js (App Router) + Tailwind CSS dark-mode PWA.

Right now, the landing page is too technical (focusing on Hz and code snippets). We need to shift the psychology to sell the _results_ (Focus, Flow, Relaxation) and reduce friction to get users to try the app immediately, taking inspiration from industry leaders like Brain.fm.

Please generate the React (Next.js) code for a redesigned Landing Page (`page.tsx`) that implements the following sections and UX improvements:

### 1. The Interactive Hero Section (Product-Led Growth)

- **Headline:** Something dynamic that speaks to the result, e.g., "Master Your State of Mind. Engineered for [Dynamic Text: Deep Work / Creative Flow / Restorative Sleep]."
- **Interactive Element:** Instead of just a "Start Training Now" button, add a sleek, interactive widget directly in the hero. It should look like a glassmorphic mini-player with a "Play" icon and a slider to shift between "Relaxation" and "Focus."
- **Frictionless CTA:** The primary button should be "Try it Free (No Sign-Up Required)" which routes them directly to the app dashboard, not an auth wall.

### 2. "Bring Your Own Music" (BYOM) Section - Our Killer Feature

- We need a massive, unmissable section highlighting our unique advantage over competitors.
- **Copy:** "Don't give up your playlists. Add a neurological layer to the music you already love."
- **Visual Concept:** Create a two-column layout. On the left, describe how the app drops the master volume to 20% to run precise binaural beats _underneath_ their Spotify/Apple Music. On the right, build a CSS mockup of our "Acoustic Blend" slider UI next to a Spotify logo or generic music player UI.

### 3. Benefit-Driven Feature Cards

- Replace the current technical cards (Beta, Alpha, Theta) with Use-Case cards.
- **Card 1 - Deep Work:** Crush your coding session or write that essay. (Subtitle: Beta Waves 14-30Hz).
- **Card 2 - ADHD Hyper-Focus:** Lock in with high-intensity stimulation. (Subtitle: Gamma Waves 40Hz + Brown Noise).
- **Card 3 - Deep Recovery:** Unplug from the day and heal. (Subtitle: Theta & Delta Waves).
- Keep the glowing neon purple/blue accents and dark-mode aesthetic.

### 4. Replace the Code Snippet with a UI Preview

- Remove the `// Neurohacking parameters` code block.
- Replace it with a sleek, stylized Next.js `Image` component (or a CSS mockup) of the actual app Dashboard showing the tuning dials and timer. The user needs to see what the tool looks like.

### 5. Social Proof / Wall of Love

- Add a minimal testimonials section right below the features.
- Include 3 placeholder reviews from "Software Engineers" and "Designers" praising how it gave them "the best 2 hours of deep work all week without the music fatigue of other apps."

**Technical Constraints:**

- Use standard Tailwind CSS v4 utility classes.
- Use `lucide-react` for any icons (Play, FastForward, Brain, Zap, Headphones, etc.).
- Keep the code modular (you can break the sections into separate functional components within the same file for readability).

Please provide the complete code for the updated `page.tsx`.
