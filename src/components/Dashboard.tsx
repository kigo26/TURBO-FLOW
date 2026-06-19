import SessionPlot from './SessionPlot';
import AIInsightsPanel from './AIInsightsPanel';
import RiskSettings from './RiskSettings';
import Settings from './Settings';
import ScreenAnalyzer from './ScreenAnalyzer';
import ScreenScanner from './ScreenScanner';
import { useGameState } from '../GameStateContext';
import React, { useEffect, useRef, useState } from 'react';
import AIStrategyAdvisor from './AIStrategyAdvisor';
import StrategySimulatorModal from './StrategySimulatorModal';
import StreakTracker from './StreakTracker';
import StreakChart from './StreakChart';
import QuickActionMenu from './QuickActionMenu';
import ComparisonWidget from './ComparisonWidget';
import BankrollGoalProgress from './BankrollGoalProgress';
import SessionEventsList from './SessionEventsList';
import SessionHeatmap from './SessionHeatmap';
import CyclePredictor from './CyclePredictor';
import IntelligentVolatilityEngine from './IntelligentVolatilityEngine';
import VarianceCurveChart from './VarianceCurveChart';
import MomentumVectorGauge from './MomentumVectorGauge';

import GameRulesWidget from './GameRulesWidget';

export default function Dashboard() {
  const { gameState, setGameState } = useGameState();

  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  const toggleViewMode = () => {
    setGameState({
      ...gameState,
      viewMode: gameState.viewMode === 'detailed' ? 'compact' : 'detailed'
    });
  };

  const calculateStdDev = (data: { value: number; timestamp: string }[]) => {
    const values = data.map(d => d.value);
    if (values.length === 0) return 0;
    const n = values.length;
    const mean = values.reduce((a, b) => a + b, 0) / n;
    return Math.sqrt(values.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / n);
  };

  const stdDev = calculateStdDev(gameState.recentBetOutcomes);
  const borderColor = stdDev < 10 ? 'border-emerald-500' : stdDev < 50 ? 'border-amber-500' : 'border-red-500';
  const isHighRisk = stdDev >= 50;
  const wasHighRisk = useRef(isHighRisk);

  const baseVariance = gameState.stakeAmount > 0 ? gameState.stakeAmount * 5 : 5;
  const volatilityIndex = Math.min(100, Math.max(0, (stdDev / baseVariance) * 100));

  let volatilityLevel = 'Stable';
  let badgeColor = 'bg-emerald-500 text-white';
  
  if (volatilityIndex > 80) { volatilityLevel = 'Extreme'; badgeColor = 'bg-red-500 text-white animate-pulse'; }
  else if (volatilityIndex > 60) { volatilityLevel = 'High'; badgeColor = 'bg-orange-500 text-white'; }
  else if (volatilityIndex > 40) { volatilityLevel = 'Elevated'; badgeColor = 'bg-yellow-500 text-black'; }
  else if (volatilityIndex > 20) { volatilityLevel = 'Moderate'; badgeColor = 'bg-emerald-400 text-black'; }

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'JPY': return '¥';
      case 'KES': return 'KShs ';
      default: return '$';
    }
  };
  const sym = getCurrencySymbol(gameState.currency);

  const displayBankroll = String(gameState.bankroll).replace(/[$€£¥]/g, sym);
  const displaySessionPL = String(gameState.sessionPL).replace(/[$€£¥]/g, sym);

  useEffect(() => {
    if (isHighRisk && !wasHighRisk.current) {
      // Play subtle audio cue
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(300, audioCtx.currentTime); 
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.3); // Shorter duration for subtlety
    }
    wasHighRisk.current = isHighRisk;
  }, [isHighRisk]);

  useEffect(() => {
    if (gameState.isAutoOptimizeRisk) {
      let newTolerance: 'Conservative' | 'Balanced' | 'Aggressive' = 'Balanced';
      if (volatilityIndex > 60) {
        newTolerance = 'Conservative';
      } else if (volatilityIndex < 30) {
        newTolerance = 'Aggressive';
      }
      
      if (gameState.riskTolerance !== newTolerance) {
        setGameState(prev => ({ ...prev, riskTolerance: newTolerance }));
      }
    }
  }, [gameState.isAutoOptimizeRisk, volatilityIndex, gameState.riskTolerance, setGameState]);

  return (
    <div className="grid grid-cols-12 gap-3 p-4">
      <QuickActionMenu />
      <div className="col-span-12 flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-bold text-white">Game Dashboard</h1>
          <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${badgeColor}`}>
            Vol Index: {volatilityLevel} ({volatilityIndex.toFixed(0)})
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button 
            onClick={() => setIsSimulatorOpen(true)}
            className="bg-[#2D3A4F] text-[#00D1FF] text-xs font-bold py-2 px-4 rounded hover:bg-[#3E4C63] border border-[#00D1FF]/30"
          >
            Strategy Simulator
          </button>
          <button 
            onClick={toggleViewMode}
            className="bg-[#1E293B] text-white text-xs font-bold py-2 px-4 rounded hover:bg-[#2D3A4F]"
          >
            View: {gameState.viewMode.toUpperCase()}
          </button>
        </div>
      </div>

      <div className="col-span-12 md:col-span-3 border border-[#1E293B] bg-[#0A0B14] p-4 rounded-lg">
        <h2 className="text-[#9CA3AF] text-[10px] font-bold uppercase tracking-wider">Bankroll</h2>
        <div className="text-xl font-mono font-bold text-white mt-1">{displayBankroll}</div>
      </div>
      <div className="col-span-12 md:col-span-3 border border-[#1E293B] bg-[#0A0B14] p-4 rounded-lg">
        <h2 className="text-[#9CA3AF] text-[10px] font-bold uppercase tracking-wider">Session P/L</h2>
        <div className="text-xl font-mono font-bold text-emerald-400 mt-1">{displaySessionPL}</div>
      </div>
      <div className="col-span-12 md:col-span-3 border border-[#1E293B] bg-[#0A0B14] p-4 rounded-lg">
        <h2 className="text-[#9CA3AF] text-[10px] font-bold uppercase tracking-wider">Volatility</h2>
        <div className="text-xl font-mono font-bold text-amber-400 mt-1">{gameState.volatility}</div>
      </div>
      <div className="col-span-12 md:col-span-3 border border-[#1E293B] bg-[#0A0B14] p-4 rounded-lg">
        <h2 className="text-[#9CA3AF] text-[10px] font-bold uppercase tracking-wider">Stake Amount</h2>
        <div className="text-xl font-mono font-bold text-white mt-1">{sym}{gameState.stakeAmount.toFixed(2)}</div>
      </div>
      <div className="col-span-12 md:col-span-3 border border-[#1E293B] bg-[#0A0B14] p-4 rounded-lg">
        <h2 className="text-[#9CA3AF] text-[10px] font-bold uppercase tracking-wider">Spins</h2>
        <div className="text-xl font-mono font-bold text-white mt-1">{gameState.spins}</div>
      </div>
      <div className="col-span-12 md:col-span-8">
          <BankrollGoalProgress />
      </div>
      <MomentumVectorGauge />
      <div className="col-span-12">
        <IntelligentVolatilityEngine />
      </div>
      
      <VarianceCurveChart />

      <div className={`col-span-12 ${gameState.viewMode === 'detailed' ? 'lg:col-span-8' : 'lg:col-span-12'} border ${borderColor} ${isHighRisk ? 'animate-pulse' : ''} bg-[#0A0B14] p-4 rounded-lg`}>
        <h2 className="text-[#9CA3AF] text-[10px] font-bold uppercase tracking-wider mb-4">Bankroll Trend (Volatility-Adjusted)</h2>
        <SessionPlot />
      </div>
      
      {gameState.viewMode === 'detailed' && (
        <div className="col-span-12 md:col-span-6 lg:col-span-4 space-y-3">
          <AIInsightsPanel />
          <RiskSettings />
          <Settings />
          <ScreenAnalyzer />
          {gameState.isScreenScannerVisible && <ScreenScanner />}
          <AIStrategyAdvisor />
          <CyclePredictor />
          <StreakTracker />
          <StreakChart />
          <SessionEventsList />
          <SessionHeatmap />
          <GameRulesWidget />
          <ComparisonWidget />
        </div>
      )}

      {isSimulatorOpen && <StrategySimulatorModal onClose={() => setIsSimulatorOpen(false)} />}
    </div>
  );
}
