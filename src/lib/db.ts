import Dexie, { type EntityTable } from 'dexie';

interface Session {
  id: number;
  startTime: number; // Unix timestamp
  endTime: number;   // Unix timestamp
  duration: number;  // Seconds
  baseFreq: number;
  binauralBeat: number;
  presetName?: string; // Optional if matched against preset
}

interface BinauralDatabase extends Dexie {
  sessions: EntityTable<Session, 'id'>;
}

const isBrowser = typeof window !== 'undefined';

const db = isBrowser 
  ? new Dexie('BinauralStartDB') as BinauralDatabase
  : {} as BinauralDatabase;

// Schema - only on browser
if (isBrowser) {
  db.version(1).stores({
    sessions: '++id, startTime, duration, baseFreq, binauralBeat'
  });
}

export { db };
export type { Session };
