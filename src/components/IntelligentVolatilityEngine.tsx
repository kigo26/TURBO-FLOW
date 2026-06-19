import { useGameState } from '../GameStateContext';
import { useMemo } from 'react';

export default function IntelligentVolatilityEngine() {
  const { gameState } = useGameState();
  const outcomes = gameState.recentBetOutcomes;

  const analytics = useMemo(() => {
    if (outcomes.length < 2) {
      return {
        volatilityIndex: 0,
        avgSwing: 0,
        maxSwing: 0,
        baselineDeviation: 0,
        riskExposure: 'LOW',
        volatilityCategory: 'Stable environment',
        insight: 'Not enough data to calculate complex volatility metrics.',
        alert: null,
        persistenceScore: 0,
      };
    }

    // Swings calculation
    let maxSwing = 0;
    let totalSwing = 0;
    let swingCount = 0;
    let positiveSwings = 0;
    let negativeSwings = 0;
    
    // To measure baseline (simple simulated baseline based on first half vs second half)
    let baselineSum = 0;
    let recentSum = 0;
    
    let currentDirection = 0;
    let currentThemeStreak = 0;
    let maxHistoricalStreak = 3;

    const values = outcomes.map(o => o.value);
    
    for (let i = 1; i < values.length; i++) {
      const swing = Math.abs(values[i] - values[i - 1]);
      maxSwing = Math.max(maxSwing, swing);
      totalSwing += swing;
      swingCount++;
      
      let dir = 0;
      if (values[i] > values[i - 1]) { positiveSwings++; dir = 1; }
      else if (values[i] < values[i - 1]) { negativeSwings++; dir = -1; }
      
      if (dir === currentDirection && dir !== 0) {
         currentThemeStreak++;
      } else {
         maxHistoricalStreak = Math.max(maxHistoricalStreak, currentThemeStreak);
         currentDirection = dir;
         currentThemeStreak = 1;
      }
    }
    
    const persistenceScore = Math.min(100, (currentThemeStreak / maxHistoricalStreak) * 100);

    const avgSwing = swingCount > 0 ? totalSwing / swingCount : 0;
    
    // Standard deviation
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const stdDev = Math.sqrt(values.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / values.length);

    // Volatility Index (0-100 heuristic based on stdDev and stakeAmount)
    const baseVariance = gameState.stakeAmount > 0 ? gameState.stakeAmount * 5 : 5;
    let volatilityIndex = Math.min(100, Math.max(0, (stdDev / baseVariance) * 100));

    // Baseline deviation (simplistic)
    const half = Math.floor(values.length / 2);
    const baselineMean = values.slice(0, half).reduce((a, b) => a + b, 0) / (half || 1);
    const recentMean = values.slice(half).reduce((a, b) => a + b, 0) / (values.length - half);
    
    const baselineDeviation = baselineMean !== 0 ? Math.abs((recentMean - baselineMean) / baselineMean) * 100 : 0;

    let volatilityCategory = 'Stable environment';
    if (volatilityIndex > 80) volatilityCategory = 'Extreme volatility';
    else if (volatilityIndex > 60) volatilityCategory = 'High volatility';
    else if (volatilityIndex > 40) volatilityCategory = 'Elevated fluctuation';
    else if (volatilityIndex > 20) volatilityCategory = 'Moderate movement';

    let riskExposure = 'LOW';
    if (volatilityIndex > 80 && negativeSwings > positiveSwings) riskExposure = 'CRITICAL';
    else if (volatilityIndex > 60) riskExposure = 'HIGH';
    else if (volatilityIndex > 40) riskExposure = 'MODERATE';

    // Narrative Insight
    let insight = `The session demonstrated ${volatilityCategory.toLowerCase()} conditions. `;
    if (baselineDeviation > 20) insight += `Variance increased significantly relative to baseline. `;
    if (negativeSwings > positiveSwings + 2) insight += `Downward movements are occurring more rapidly than upward recoveries, indicating elevated uncertainty conditions.`;
    else if (volatilityIndex > 50) insight += `Fluctuations accelerated beyond historical averages, increasing overall risk exposure. Current conditions suggest maintaining disciplined capital thresholds to absorb expanded variability.`;
    else insight += `Current fluctuation range suggests maintaining standard reserve thresholds. Capital allocation should remain within predefined tolerance limits.`;

    let alert = null;
    if (volatilityIndex > 80) alert = '⚠ Extreme volatility detected';
    else if (baselineDeviation > 50) alert = '⚠ Variance exceeds normal range';
    else if (riskExposure === 'CRITICAL') alert = '⚠ Drawdown approaching threshold';
    else if (volatilityIndex < 20 && values.length > 5) alert = '✓ Session returning to baseline';

    return {
      volatilityIndex,
      avgSwing,
      maxSwing,
      baselineDeviation,
      riskExposure,
      volatilityCategory,
      insight,
      alert,
      persistenceScore,
    };
  }, [outcomes, gameState.stakeAmount]);

  // Visuals for Volatility Index
  const getColor = (val: number) => {
    if (val < 20) return 'text-emerald-400';
    if (val < 40) return 'text-cyan-400';
    if (val < 60) return 'text-amber-400';
    if (val < 80) return 'text-orange-500';
    return 'text-red-500';
  };
  const getBgColor = (val: number) => {
    if (val < 20) return 'bg-emerald-500';
    if (val < 40) return 'bg-cyan-500';
    if (val < 60) return 'bg-amber-500';
    if (val < 80) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'JPY': return '¥';
      default: return '$';
    }
  };
  const sym = getCurrencySymbol(gameState.currency);

  return (
    <div className="border border-[#1E293B] bg-[#0A0B14]/80 backdrop-blur-md p-4 rounded-lg relative overflow-hidden">
      {/* Background decorations for a "trading-terminal" feel */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -z-10"></div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 border-b border-[#1E293B]/50 pb-2 gap-2">
        <h2 className="text-[#00D1FF] text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00D1FF] animate-pulse"></span>
          Intelligent Volatility Engine
        </h2>
        {analytics.alert && (
          <div className="text-[9px] font-mono font-bold bg-black/40 px-2 py-1 rounded border border-[#1E293B]">
            <span className={analytics.alert.includes('✓') ? 'text-emerald-400' : 'text-red-400'}>
              {analytics.alert}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-[#050508]/60 p-3 rounded border border-[#1E293B]/50">
          <div className="text-[9px] text-[#9CA3AF] uppercase tracking-wider mb-1">Volatility Index</div>
          <div className="flex items-end gap-2">
            <span className={`text-3xl font-mono font-bold ${getColor(analytics.volatilityIndex)}`}>
              {analytics.volatilityIndex.toFixed(1)}
            </span>
            <span className="text-xs text-gray-500 font-mono mb-1">/ 100</span>
          </div>
          <div className="mt-2 w-full bg-[#1E293B] h-1.5 rounded overflow-hidden">
            <div className={`h-full transition-all duration-700 ${getBgColor(analytics.volatilityIndex)}`} style={{ width: `${Math.min(100, analytics.volatilityIndex)}%` }}></div>
          </div>
          <div className="text-[10px] text-gray-400 mt-1 uppercase tracking-wide">{analytics.volatilityCategory}</div>
        </div>

        <div className="bg-[#050508]/60 p-3 rounded border border-[#1E293B]/50">
          <div className="text-[9px] text-[#9CA3AF] uppercase tracking-wider mb-2">P/L Swing Amplitude</div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
               <span className="text-[10px] text-gray-400">Avg Swing</span>
               <span className="text-sm font-mono text-white">{sym}{analytics.avgSwing.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
               <span className="text-[10px] text-gray-400">Max Swing</span>
               <span className="text-sm font-mono text-[#00D1FF]">{sym}{analytics.maxSwing.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
               <span className="text-[10px] text-gray-400">Baseline Dev</span>
               <span className="text-sm font-mono text-white">{analytics.baselineDeviation.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-[#1E293B]/50">
               <span className="text-[10px] text-gray-400">Persistence</span>
               <div className="flex items-center gap-2">
                 <div className="w-12 h-1 bg-[#1E293B] rounded overflow-hidden">
                   <div className="bg-[#00D1FF] h-full" style={{ width: `${analytics.persistenceScore}%` }} />
                 </div>
                 <span className="text-sm font-mono text-[#00D1FF]">{analytics.persistenceScore.toFixed(0)}%</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 bg-[#050508]/60 p-3 rounded border border-[#1E293B]/50">
         <div className="flex justify-between items-center mb-2">
           <div className="text-[9px] text-[#9CA3AF] uppercase tracking-wider">Risk Exposure Model</div>
           <div className={`text-[10px] font-bold uppercase ${
               analytics.riskExposure === 'CRITICAL' ? 'text-red-500' :
               analytics.riskExposure === 'HIGH' ? 'text-orange-500' :
               analytics.riskExposure === 'MODERATE' ? 'text-amber-500' : 'text-emerald-500'
           }`}>{analytics.riskExposure}</div>
         </div>
         <div className="flex gap-1">
             <div className={`h-1 flex-1 rounded ${['LOW','MODERATE','HIGH','CRITICAL'].includes(analytics.riskExposure) ? 'bg-emerald-500' : 'bg-[#1E293B]'}`}></div>
             <div className={`h-1 flex-1 rounded ${['MODERATE','HIGH','CRITICAL'].includes(analytics.riskExposure) ? 'bg-amber-500' : 'bg-[#1E293B]'}`}></div>
             <div className={`h-1 flex-1 rounded ${['HIGH','CRITICAL'].includes(analytics.riskExposure) ? 'bg-orange-500' : 'bg-[#1E293B]'}`}></div>
             <div className={`h-1 flex-1 rounded ${['CRITICAL'].includes(analytics.riskExposure) ? 'bg-red-500 animate-pulse' : 'bg-[#1E293B]'}`}></div>
         </div>
      </div>

      <div className="bg-[#050508] p-3 rounded border border-[#1E293B] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#00D1FF]"></div>
        <div className="text-[9px] text-[#00D1FF] uppercase tracking-wider mb-2 opacity-80">AI Insight Panel</div>
        <p className="text-xs text-gray-300 leading-relaxed font-light pl-2 border-l-2 border-[#1E293B]/50">
            {analytics.insight}
        </p>
      </div>

    </div>
  );
}
