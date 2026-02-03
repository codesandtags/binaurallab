"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/db';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { BarChart3 } from 'lucide-react';

export const Stats = () => {
   const [data, setData] = useState<{day: string, hours: number}[]>([]);

   useEffect(() => {
       const loadStats = async () => {
           try {
               // Load all sessions (for MVP, filtering in memory is fine unless huge data)
               // Or queries:
               const allSessions = await db.sessions.toArray();

               const chartData = [];
               for(let i=6; i>=0; i--) {
                   const d = new Date();
                   d.setDate(d.setDate(new Date().getDate() - i)); // fix logic
                   // Create day boundaries
                   const dayStart = new Date(d);
                   dayStart.setHours(0,0,0,0);
                   const dayEnd = new Date(d);
                   dayEnd.setHours(23,59,59,999);

                   const daySessions = allSessions.filter(s => s.startTime >= dayStart.getTime() && s.startTime <= dayEnd.getTime());
                   const totalSeconds = daySessions.reduce((acc, curr) => acc + curr.duration, 0);

                   chartData.push({
                       day: dayStart.toLocaleDateString('en-US', { weekday: 'short' }),
                       hours: Number((totalSeconds / 3600).toFixed(1))
                   });
               }
               setData(chartData);
           } catch (e) {
               console.error("Error loading stats", e);
           }
       };

       loadStats();

       // Simple polling to keep fresh if needed, or just relying on mount
   }, []);

   return (
       <Card className="w-full h-[300px]">
           <CardHeader className="pb-2">
               <CardTitle className="text-lg flex items-center gap-2">
                   <BarChart3 className="w-5 h-5" /> Weekly Focus (Hours)
               </CardTitle>
           </CardHeader>
           <CardContent className="h-[220px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={data}>
                       <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                       <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                       <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}h`} />
                       <Tooltip
                           contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                           itemStyle={{ color: '#fff' }}
                           cursor={{fill: 'rgba(255,255,255,0.05)'}}
                       />
                       <Bar dataKey="hours" fill="currentColor" className="fill-primary" radius={[4, 4, 0, 0]} />
                   </BarChart>
               </ResponsiveContainer>
           </CardContent>
       </Card>
   );
};
