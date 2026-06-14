import { useEffect, useState } from 'react';
import { Nudge } from '../types';

export default function NudgeEngine() {
  const [activeNudge, setActiveNudge] = useState<Nudge | null>(null);

  useEffect(() => {
    // Simulating behavioral monitoring
    const timer = setInterval(() => {
      // Logic for triggering nudges would go here.
      // Mock triggering a break nudge.
      const shouldTrigger = Math.random() > 0.95;
      if (shouldTrigger && !activeNudge) {
        const newNudge: Nudge = {
          id: Date.now().toString(),
          message: "You've been playing for a while. Consider taking a short break.",
          type: 'break',
          triggeredAt: Date.now(),
        };
        setActiveNudge(newNudge);
        console.log("Nudge logged:", newNudge);
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [activeNudge]);

  if (!activeNudge) return null;

  return (
    <div className="fixed bottom-6 right-6 p-4 bg-[#1E293B] border border-[#00D1FF] rounded-lg shadow-lg z-50 max-w-sm">
      <h3 className="text-white font-bold mb-1">Friendly Reminder</h3>
      <p className="text-[#D1D5DB] text-sm mb-3">{activeNudge.message}</p>
      <button 
        onClick={() => setActiveNudge(null)}
        className="px-3 py-1 bg-[#00D1FF] text-black text-xs font-bold rounded"
      >
        Dismiss
      </button>
    </div>
  );
}
