import { useState, useEffect } from 'react';
import { useGameState } from '../GameStateContext';

export default function AIStrategyAdvisor() {
  const { gameState } = useGameState();
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAdvice = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/ai/insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            prompt: `
              Analyze the following game metrics from a responsible gaming perspective:
              - Bankroll: ${gameState.bankroll}
              - Session P/L: ${gameState.sessionPL}
              - Volatility: ${gameState.volatility}
              - Current Streak: ${gameState.currentStreak}
              - Peak Streak: ${gameState.peakStreak}
              - Spins: ${gameState.spins}
              
              Provide a non-predictive, data-driven suggestion regarding stake management. 
              Focus on responsible gaming principles (e.g., bankroll preservation, volatility management). 
              Do not predict future outcomes. Keep it brief and actionable.
            ` 
          })
        });
        
        if (response.status === 429) {
          setAdvice("AI Advisor is momentarily cooling down (rate limit hit).");
        } else if (response.ok) {
          const data = await response.json();
          setAdvice(data.text);
        } else {
          setAdvice("Unable to fetch advice at the moment.");
        }
      } catch (e) {
        console.error("Advice fetch failed", e);
        setAdvice("Failed to connect to advisor.");
      } finally {
        setLoading(false);
      }
    };

    const interval = setInterval(fetchAdvice, 15 * 60 * 1000); // 15 minutes
    fetchAdvice();
    return () => clearInterval(interval);
  }, []); // Run only on mount

  return (
    <div className="border border-[#1E293B] bg-[#0A0B14] p-4 rounded-lg">
      <h2 className="text-[#9CA3AF] text-[10px] font-bold uppercase tracking-wider mb-2">AI Strategy Advisor</h2>
      {loading ? (
        <div className="text-xs text-gray-500 animate-pulse">Analyzing trends...</div>
      ) : (
        <div className="text-xs text-white leading-relaxed">{advice || "Waiting for data..."}</div>
      )}
    </div>
  );
}
