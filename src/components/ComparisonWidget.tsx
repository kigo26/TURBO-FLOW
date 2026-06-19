import { useState } from 'react';
import { SessionData } from '../types';
import ComparisonPlot from './ComparisonPlot';

const MOCK_SESSIONS: SessionData[] = [
  { id: '1', name: 'Morning Session', color: '#00D1FF', data: [{ name: '10:00:00', value: 5000 }, { name: '10:00:30', value: 5150 }, { name: '10:01:00', value: 4800 }] },
  { id: '2', name: 'Afternoon Session', color: '#FF007A', data: [{ name: '10:00:00', value: 4500 }, { name: '10:00:30', value: 4600 }, { name: '10:01:00', value: 4900 }] },
];

export default function ComparisonWidget() {
  const [session1, setSession1] = useState<SessionData>(MOCK_SESSIONS[0]);
  const [session2, setSession2] = useState<SessionData>(MOCK_SESSIONS[1]);

  return (
    <div className="border border-[#1E293B] bg-[#0A0B14] p-4 rounded-lg">
      <h2 className="text-[#9CA3AF] text-[10px] font-bold uppercase tracking-wider mb-4">Session Comparison</h2>
      <div className="flex gap-2 mb-4">
        <select value={session1.id} onChange={(e) => setSession1(MOCK_SESSIONS.find(s => s.id === e.target.value)!)} className="bg-[#050508] text-white p-2 rounded border border-[#1E293B] text-xs">
          {MOCK_SESSIONS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select value={session2.id} onChange={(e) => setSession2(MOCK_SESSIONS.find(s => s.id === e.target.value)!)} className="bg-[#050508] text-white p-2 rounded border border-[#1E293B] text-xs">
          {MOCK_SESSIONS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
      <ComparisonPlot sessions={[session1, session2]} />
    </div>
  );
}
