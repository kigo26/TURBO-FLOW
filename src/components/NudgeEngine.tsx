import { useEffect, useState, useRef } from 'react';
import { Nudge } from '../types';
import { useGameState } from '../GameStateContext';

export default function NudgeEngine() {
  const [activeNudge, setActiveNudge] = useState<Nudge | null>(null);
  const { gameState } = useGameState();
  const lastAlertTimeRef = useRef<number>(0);
  const lastStateRef = useRef<{ category: string, exposure: string }>({ category: '', exposure: '' });

  useEffect(() => {
    const outcomes = gameState.recentBetOutcomes;
    if (outcomes.length < 2) return;

    let positiveSwings = 0;
    let negativeSwings = 0;
    const values = outcomes.map(o => o.value);
    
    for (let i = 1; i < values.length; i++) {
      if (values[i] > values[i - 1]) positiveSwings++;
      else if (values[i] < values[i - 1]) negativeSwings++;
    }

    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const stdDev = Math.sqrt(values.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / values.length);
    const baseVariance = gameState.stakeAmount > 0 ? gameState.stakeAmount * 5 : 5;
    const volatilityIndex = Math.min(100, Math.max(0, (stdDev / baseVariance) * 100));

    let volatilityCategory = 'Stable environment';
    if (volatilityIndex > 80) volatilityCategory = 'Extreme volatility';
    else if (volatilityIndex > 60) volatilityCategory = 'High volatility';
    else if (volatilityIndex > 40) volatilityCategory = 'Elevated fluctuation';
    else if (volatilityIndex > 20) volatilityCategory = 'Moderate movement';

    let riskExposure = 'LOW';
    if (volatilityIndex > 80 && negativeSwings > positiveSwings) riskExposure = 'CRITICAL';
    else if (volatilityIndex > 60) riskExposure = 'HIGH';
    else if (volatilityIndex > 40) riskExposure = 'MODERATE';

    const now = Date.now();
    const isNewCategory = volatilityCategory !== lastStateRef.current.category && 
      ['Elevated fluctuation', 'High volatility', 'Extreme volatility'].includes(volatilityCategory);
    
    const isNewRisk = riskExposure !== lastStateRef.current.exposure && 
      ['HIGH', 'CRITICAL'].includes(riskExposure);

    // Debounce alerts - don't show more than once every 10 seconds for testing
    if ((isNewCategory || isNewRisk) && now - lastAlertTimeRef.current > 10000) {
      const message = riskExposure === 'CRITICAL' 
        ? "⚠ CRITICAL: High volatility with negative swings detected. Consider adjusting limits."
        : `⚠ ALERT: Volatility index reached: ${volatilityCategory}.`;

      setActiveNudge({
        id: now.toString(),
        message,
        type: riskExposure === 'CRITICAL' ? 'limit' : 'trend',
        triggeredAt: now,
      });
      lastAlertTimeRef.current = now;
      lastStateRef.current = { category: volatilityCategory, exposure: riskExposure };
    }

  }, [gameState.recentBetOutcomes, gameState.stakeAmount]);

  useEffect(() => {
    if (activeNudge) {
      const timer = setTimeout(() => {
        setActiveNudge(null);
      }, 8000); // Auto-dismiss after 8 seconds
      return () => clearTimeout(timer);
    }
  }, [activeNudge]);

  if (!activeNudge) return null;

  return (
    <div className="fixed bottom-6 right-6 p-4 bg-[#0A0B14] border-l-4 border-l-[#00D1FF] border border-[#1E293B] rounded shadow-2xl z-50 max-w-sm animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-[#00D1FF] text-[10px] uppercase tracking-widest font-bold">System Alert</h3>
        <button 
          onClick={() => setActiveNudge(null)}
          className="text-gray-500 hover:text-white"
        >
          &times;
        </button>
      </div>
      <p className="text-[#D1D5DB] text-xs leading-relaxed mb-3">{activeNudge.message}</p>
      <div className="w-full bg-[#1E293B] h-0.5 mt-2 overflow-hidden">
        <div className="bg-[#00D1FF] h-full w-full animate-[shrink_8s_linear_forwards]" />
      </div>
    </div>
  );
}
