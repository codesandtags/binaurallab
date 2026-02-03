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

const db = new Dexie('BinauralStartDB') as Dexie & {
  sessions: EntityTable<Session, 'id'>;
};

// Schema
db.version(1).stores({
  sessions: '++id, startTime, duration, baseFreq, binauralBeat'
});

export { db };
export type { Session };
