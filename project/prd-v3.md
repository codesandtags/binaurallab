Act as a Senior Frontend Architect and UI/UX Expert. We are undertaking a massive redesign of the "Binaural Lab" dashboard.

**The Goal:** Transition the UI from a clunky, engineering-focused layout into a premium, consumer-ready application inspired by the **Spotify Desktop/Web UI**. The user must feel like they are browsing and playing high-end cognitive audio tracks.

**Technical Stack:** Next.js (App Router), Tailwind CSS v4, Lucide React icons, and Recharts.

Please generate the React code for the new `Dashboard` layout. The architecture must be divided into three distinct, persistent sections:

### 1. The Left Sidebar (Navigation & Library)

- **Top Section:** Brand logo ("Binaural Lab") and primary navigation links (Home, Stats, Settings).
- **Library Section:** A scrolling list replacing the old "Previous Sessions" box. Show the last 5 sessions here (e.g., "Deep Work - 45m" with a small brain icon).

### 2. The Main Content Area (Discovery & Stats)

- **Header:** A dynamic greeting (e.g., "Good Evening, Developer") with the User Profile avatar on the top right.
- **"Your Neuro-States" (Presets Grid):** Design this like Spotify's "Made For You" square playlist cards.
  - Cards should include: Deep Work, Creative Flow, ADHD Hyper-Focus, and Power Nap.
  - Instead of technical jargon as the main title, put the technical details (e.g., "Beta 20Hz") as the subtitle.
  - Hovering over a card should reveal a circular "Play" button in the bottom right corner of the card.
- **Focus Analytics:** Below the presets, render the Recharts `BarChart` for "Weekly Focus (Hours)".
  - **CRITICAL BUG FIX:** The previous chart rendered "Invalid Date" on the X-axis. Ensure the timestamp strings passed to the chart are formatted correctly using `new Date(timestamp).toLocaleDateString('en-US', { weekday: 'short' })` before rendering.

### 3. The Persistent Bottom Player Bar (The Command Center)

This is the most crucial UI shift. All audio controls are moved to a fixed bottom bar.

- **Far Left (Now Playing):** Display the currently active preset name and its subtitle, plus a subtle animated equalizer icon if audio is playing.
- **Center (Playback Controls):** \* A prominent, circular Play/Pause button.
  - A "Sleep Timer" button (clock icon) that opens a small popover menu (15m, 30m, 60m).
- **Far Right (The Mixer & BYOM):** \* **Acoustic Blend:** A button/icon to select the ambient noise type (Pink/Brown/White) next to a small volume slider to control its mix.
  - **Layered Mode (BYOM):** Add a toggle switch or button labeled "Layered Mode". Include a tooltip: _"Drops master volume to 20% so you can play Spotify/Apple Music in the background."_
  - **Master Volume:** A standard volume slider for the whole Web Audio engine.

**Styling Directives:**

- Keep the dark mode theme (`bg-gray-950` or `bg-zinc-950`).
- Use neon purple/indigo accents for active states and primary buttons.
- Use CSS Grid and Flexbox to ensure the layout is responsive. On mobile, the Left Sidebar should disappear behind a hamburger menu, and the Bottom Player should stick to the bottom of the viewport.

Please provide the modular code structure, starting with the main Layout component and the Bottom Player Bar component.
