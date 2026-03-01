"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { db, type Session } from '@/lib/db';

export default function SessionList() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    const loadSessions = async () => {
        try {
            const data = await db.sessions.reverse().toArray();
            setSessions(data);
        } catch (err) {
            console.error("Failed to load sessions:", err);
        }
    };
    loadSessions();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Previous Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No sessions yet.</p>
        ) : (
          <ul className="space-y-3">
            {sessions.map((session) => (
              <li key={session.id} className="flex justify-between items-center text-sm p-2 rounded bg-secondary/20">
                <div className="flex flex-col">
                   <span className="font-medium">{new Date(session.startTime).toLocaleDateString()}</span>
                   <span className="text-xs text-muted-foreground">{new Date(session.startTime).toLocaleTimeString()}</span>
                </div>
                <div className="text-right">
                   <span className="block font-mono">{Math.round(session.duration / 60)}m {session.duration % 60}s</span>
                   <span className="text-[10px] uppercase text-primary font-bold">{session.presetName || `${session.binauralBeat}Hz`}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
