/**
 * Singleton AudioContext Manager
 * Ensures that all audio nodes across the application share the same AudioContext.
 * This prevents hardware resource exhaustion and timing issues.
 */

class AudioContextManager {
    private static instance: AudioContext | null = null;

    public static getInstance(): AudioContext {
        if (typeof window === 'undefined') {
            // Server-side safe (though this typically runs in client components)
            throw new Error("AudioContext can only be initialized in the browser.");
        }

        if (!AudioContextManager.instance) {
            const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
            AudioContextManager.instance = new AudioContextClass();
        }

        return AudioContextManager.instance;
    }

    public static suspend(): void {
        if (AudioContextManager.instance && AudioContextManager.instance.state === 'running') {
            AudioContextManager.instance.suspend();
        }
    }

    public static resume(): Promise<void> | void {
        if (AudioContextManager.instance && AudioContextManager.instance.state === 'suspended') {
            return AudioContextManager.instance.resume();
        }
    }
}

export default AudioContextManager;
