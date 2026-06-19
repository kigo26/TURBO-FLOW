import { useEffect, useState, useRef } from 'react';
import { useGameState } from '../GameStateContext';

export default function AIInsightsPanel() {
  const { gameState } = useGameState();
  const [insight, setInsight] = useState<string>('Initializing AI Core. Monitoring session activity...');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const prevOutcomesRef = useRef(gameState.recentBetOutcomes.length);

  const fetchInsights = async () => {
    setIsTyping(true);
    setError(false);
    
    // Construct real-time state prompt
    const { bankroll, stakeAmount, riskTolerance, recentBetOutcomes } = gameState;
    const wins = recentBetOutcomes.filter(o => o.value > 0).length;
    const losses = recentBetOutcomes.filter(o => o.value < 0).length;
    
    const contextPrompt = `Analyze the current slot gaming session in real-time. 
Bankroll: ${bankroll}
Stake: ${stakeAmount}
Risk Tolerance: ${riskTolerance}
Recent Activity: ${wins} wins, ${losses} losses out of ${recentBetOutcomes.length} tracked events.
Keep it strictly under 2 sentences. Use an objective, analytical tone (like a Bloomberg terminal). Provide a professional observation based on this precise data snapshot.`;

    try {
      const res = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: contextPrompt })
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setInsight(data.text);
    } catch {
      setInsight('Network anomaly. Reconnecting to AI analysis stream...');
      setError(true);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    // Fetch initial on mount or when outcomes arrays change length significantly (e.g., every 3rd step)
    const currentLen = gameState.recentBetOutcomes.length;
    if (currentLen === 0) return;
    
    // Refresh insights whenever we accumulate 3 new outcomes, or on initial load with data
    if (Math.abs(currentLen - prevOutcomesRef.current) >= 3 || (prevOutcomesRef.current === 0 && currentLen > 0)) {
      prevOutcomesRef.current = currentLen;
      fetchInsights();
    }
  }, [gameState.recentBetOutcomes]);

  return (
    <div className="border border-[#2E354F] bg-[#11111A]/90 p-4 rounded-lg relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-1 h-full bg-[#00D1FF] group-hover:bg-fuchsia-500 transition-colors duration-500"></div>
      
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-[#00D1FF] text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00D1FF] animate-pulse"></span>
          AI Insights Core
        </h2>
        {isTyping ? (
           <span className="text-[8px] uppercase tracking-widest text-[#00D1FF] animate-pulse">Processing...</span>
        ) : (
           <div className="flex items-center gap-2">
             <span className="text-[8px] text-gray-500 uppercase">Confidence</span>
             <span className={`text-[10px] font-mono font-bold ${gameState.recentBetOutcomes.length > 30 ? 'text-emerald-400' : gameState.recentBetOutcomes.length > 15 ? 'text-amber-400' : 'text-red-400'}`}>
               {Math.min(100, Math.max(0, Math.floor((gameState.recentBetOutcomes.length / 50) * 100)))}%
             </span>
             <div className="w-10 h-1 bg-[#1E293B] rounded overflow-hidden">
               <div 
                 className={`h-full ${gameState.recentBetOutcomes.length > 30 ? 'bg-emerald-500' : gameState.recentBetOutcomes.length > 15 ? 'bg-amber-500' : 'bg-red-500'}`} 
                 style={{ width: `${Math.min(100, Math.max(0, Math.floor((gameState.recentBetOutcomes.length / 50) * 100)))}%` }} 
               />
             </div>
           </div>
        )}
      </div>

      <div className="text-[#D1D5DB] text-[11px] italic font-mono leading-relaxed min-h-[40px]">
        {isTyping ? <span className="opacity-50 blur-[1px]">{insight}</span> : insight}
      </div>
      
      {error && (
        <button 
          onClick={fetchInsights}
          className="text-[9px] uppercase tracking-wider text-white mt-2 bg-indigo-600/50 border border-indigo-500 px-2 py-1 rounded hover:bg-indigo-600 transition-colors"
        >
          Force Retry
        </button>
      )}
    </div>
  );
}
