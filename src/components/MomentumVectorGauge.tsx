import React from 'react';
import { useGameState } from '../GameStateContext';

export default function MomentumVectorGauge() {
  const { gameState } = useGameState();
  
  // Calculate momentum based on recent bet outcomes
  const outcomes = gameState.recentBetOutcomes;
  let momentum = 0; // -100 to 100
  
  if (outcomes.length >= 10) {
    const recent5 = outcomes.slice(-5).reduce((sum, o) => sum + o.value, 0);
    const prev5 = outcomes.slice(-10, -5).reduce((sum, o) => sum + o.value, 0);
    
    // Scale momentum. Stake amount affects the value.
    const baseline = gameState.stakeAmount > 0 ? gameState.stakeAmount * 5 : 5;
    momentum = ((recent5 - prev5) / baseline) * 100;
  }

  // Cap momentum between -100 and 100
  momentum = Math.max(-100, Math.min(100, momentum));
  
  // Map -100 to 100 to a rotation angle: -90 to +90 degrees
  const angle = (momentum / 100) * 90;

  const getStatus = (m: number) => {
    if (m > 50) return { label: 'ACCELERATING', color: '#10B981', gradient: 'from-emerald-500/20 to-transparent' };
    if (m > 10) return { label: 'BUILDING', color: '#3B82F6', gradient: 'from-blue-500/20 to-transparent' };
    if (m > -10) return { label: 'STABILIZED', color: '#9CA3AF', gradient: 'from-gray-500/20 to-transparent' };
    if (m > -50) return { label: 'DECELERATING', color: '#F59E0B', gradient: 'from-amber-500/20 to-transparent' };
    return { label: 'SHARP DECLINE', color: '#EF4444', gradient: 'from-red-500/20 to-transparent' };
  };

  const status = getStatus(momentum);

  return (
    <div className={`col-span-12 md:col-span-4 border border-[#1E293B] bg-[#0A0B14] p-4 rounded-lg relative overflow-hidden bg-gradient-to-b ${status.gradient}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[#9CA3AF] text-[10px] font-bold uppercase tracking-wider">Momentum Vector</h2>
        <div className="text-[10px] font-mono text-gray-400">
            SPEED
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center relative py-2">
        {/* SVG Gauge */}
        <div className="relative w-48 h-24 overflow-hidden">
          {/* Background track */}
          <svg className="w-full h-full overflow-visible" viewBox="0 0 200 100">
            {/* Base Arch */}
            <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#1E293B" strokeWidth="12" strokeLinecap="round" />
            
            {/* Zones */}
            <path d="M 20 100 A 80 80 0 0 1 60 30" fill="none" stroke="#EF4444" strokeWidth="12" strokeOpacity="0.4" strokeLinecap="round" />
            <path d="M 140 30 A 80 80 0 0 1 180 100" fill="none" stroke="#10B981" strokeWidth="12" strokeOpacity="0.4" strokeLinecap="round" />

            {/* Needle */}
            <g transform={`translate(100, 100) rotate(${angle})`}>
              <polygon points="-3,0 3,0 0,-75" fill={status.color} />
              <circle cx="0" cy="0" r="6" fill={status.color} />
              <circle cx="0" cy="0" r="2" fill="#0A0B14" />
            </g>
          </svg>
        </div>

        <div className="mt-4 text-center">
            <div className="text-xl font-mono font-bold" style={{ color: status.color }}>
                {momentum > 0 ? '+' : ''}{momentum.toFixed(1)}
            </div>
            <div className="text-[10px] font-bold tracking-widest mt-1" style={{ color: status.color }}>
                {status.label}
            </div>
        </div>
      </div>
    </div>
  );
}
