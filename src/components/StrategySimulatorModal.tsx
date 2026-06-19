import React, { useState } from 'react';

interface StrategySimulatorModalProps {
  onClose: () => void;
}

export default function StrategySimulatorModal({ onClose }: StrategySimulatorModalProps) {
  const [volatilityIndex, setVolatilityIndex] = useState<number>(50);
  const [negativeSwingsDominant, setNegativeSwingsDominant] = useState<boolean>(false);

  let volatilityCategory = 'Stable environment';
  if (volatilityIndex > 80) volatilityCategory = 'Extreme volatility';
  else if (volatilityIndex > 60) volatilityCategory = 'High volatility';
  else if (volatilityIndex > 40) volatilityCategory = 'Elevated fluctuation';
  else if (volatilityIndex > 20) volatilityCategory = 'Moderate movement';

  let riskExposure = 'LOW';
  if (volatilityIndex > 80 && negativeSwingsDominant) riskExposure = 'CRITICAL';
  else if (volatilityIndex > 60) riskExposure = 'HIGH';
  else if (volatilityIndex > 40) riskExposure = 'MODERATE';

  let simulatedAlert = null;
  if (['Elevated fluctuation', 'High volatility', 'Extreme volatility'].includes(volatilityCategory) || ['HIGH', 'CRITICAL'].includes(riskExposure)) {
    simulatedAlert = riskExposure === 'CRITICAL' 
      ? "⚠ CRITICAL: High volatility with negative swings detected. Consider adjusting limits."
      : `⚠ ALERT: Volatility index reached: ${volatilityCategory}.`;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0A0B14] border border-[#1E293B] rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-[#1E293B]">
          <h2 className="text-[#00D1FF] text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            Strategy Simulator
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            ✕
          </button>
        </div>
        
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          <p className="text-xs text-gray-400">
            Test how the Nudge Engine reacts to different market conditions and risk settings without risking actual bankroll.
          </p>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="text-[10px] text-gray-500 uppercase tracking-widest">Hypothetical Volatility</label>
                <span className="font-mono text-[#00D1FF]">{volatilityIndex} / 100</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={volatilityIndex} 
                onChange={(e) => setVolatilityIndex(Number(e.target.value))}
                className="w-full accent-[#00D1FF] bg-[#1E293B] h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[8px] text-gray-600 uppercase mt-1">
                <span>0 (Stable)</span>
                <span>100 (Extreme)</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#11111A] border border-[#1E293B] rounded-lg cursor-pointer" onClick={() => setNegativeSwingsDominant(!negativeSwingsDominant)}>
              <div>
                <div className="text-xs text-white">Negative Swings Dominant</div>
                <div className="text-[10px] text-gray-500 leading-tight mt-0.5">Simulate a severe drawdown scenario where losses outpace wins.</div>
              </div>
              <div className={`w-8 h-4 rounded-full flex items-center shrink-0 transition-colors ${negativeSwingsDominant ? 'bg-red-500' : 'bg-[#1E293B]'}`}>
                <div className={`w-3 h-3 rounded-full bg-white transition-transform ${negativeSwingsDominant ? 'translate-x-4' : 'translate-x-1'}`}></div>
              </div>
            </div>
          </div>

          <div className="bg-[#11111A] border border-[#1E293B] rounded-lg p-4 space-y-3">
            <h3 className="text-[10px] text-gray-500 uppercase tracking-widest border-b border-[#1E293B] pb-2">Simulated Engine State</h3>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Category:</span>
              <span className={`text-xs font-bold uppercase ${volatilityIndex > 80 ? 'text-red-500' : volatilityIndex > 60 ? 'text-orange-500' : volatilityIndex > 40 ? 'text-amber-500' : 'text-emerald-500'}`}>
                {volatilityCategory}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Risk Exposure:</span>
              <span className={`text-xs font-bold uppercase ${riskExposure === 'CRITICAL' ? 'text-red-500 animate-pulse' : riskExposure === 'HIGH' ? 'text-orange-500' : riskExposure === 'MODERATE' ? 'text-amber-500' : 'text-emerald-500'}`}>
                {riskExposure}
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-[#1E293B]">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 block">Nudge Engine Output:</span>
              {simulatedAlert ? (
                <div className={`p-3 rounded text-xs leading-relaxed border-l-2 ${riskExposure === 'CRITICAL' ? 'bg-red-500/10 border-red-500 text-red-200' : 'bg-amber-500/10 border-amber-500 text-amber-200'}`}>
                  {simulatedAlert}
                </div>
              ) : (
                <div className="text-xs text-gray-500 italic">No alert would be triggered under these conditions.</div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
