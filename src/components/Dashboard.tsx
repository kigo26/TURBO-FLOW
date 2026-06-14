import SessionPlot from './SessionPlot';
import AIInsightsPanel from './AIInsightsPanel';
import RiskSettings from './RiskSettings';
import Settings from './Settings';
import ScreenAnalyzer from './ScreenAnalyzer';
import ScreenScanner from './ScreenScanner';
import { useGameState } from '../GameStateContext';
import AIStrategyAdvisor from './AIStrategyAdvisor';
import StreakTracker from './StreakTracker';
import QuickActionMenu from './QuickActionMenu';
import ComparisonWidget from './ComparisonWidget';

export default function Dashboard() {
  const { gameState, setGameState } = useGameState();

  const toggleViewMode = () => {
    setGameState({
      ...gameState,
      viewMode: gameState.viewMode === 'detailed' ? 'compact' : 'detailed'
    });
  };

  return (
    <div className="grid grid-cols-12 gap-3 p-4">
      <QuickActionMenu />
      <div className="col-span-12 flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-white">Game Dashboard</h1>
        <button 
          onClick={toggleViewMode}
          className="bg-[#1E293B] text-white text-xs font-bold py-2 px-4 rounded hover:bg-[#2D3A4F]"
        >
          View: {gameState.viewMode.toUpperCase()}
        </button>
      </div>

      <div className="col-span-12 md:col-span-3 border border-[#1E293B] bg-[#0A0B14] p-4 rounded-lg">
        <h2 className="text-[#9CA3AF] text-[10px] font-bold uppercase tracking-wider">Bankroll</h2>
        <div className="text-xl font-mono font-bold text-white mt-1">{gameState.bankroll}</div>
      </div>
      <div className="col-span-12 md:col-span-3 border border-[#1E293B] bg-[#0A0B14] p-4 rounded-lg">
        <h2 className="text-[#9CA3AF] text-[10px] font-bold uppercase tracking-wider">Session P/L</h2>
        <div className="text-xl font-mono font-bold text-emerald-400 mt-1">{gameState.sessionPL}</div>
      </div>
      <div className="col-span-12 md:col-span-3 border border-[#1E293B] bg-[#0A0B14] p-4 rounded-lg">
        <h2 className="text-[#9CA3AF] text-[10px] font-bold uppercase tracking-wider">Volatility</h2>
        <div className="text-xl font-mono font-bold text-amber-400 mt-1">{gameState.volatility}</div>
      </div>
      <div className="col-span-12 md:col-span-3 border border-[#1E293B] bg-[#0A0B14] p-4 rounded-lg">
        <h2 className="text-[#9CA3AF] text-[10px] font-bold uppercase tracking-wider">Spins</h2>
        <div className="text-xl font-mono font-bold text-white mt-1">{gameState.spins}</div>
      </div>
      <div className={`col-span-12 ${gameState.viewMode === 'detailed' ? 'lg:col-span-8' : 'lg:col-span-12'} border border-[#1E293B] bg-[#0A0B14] p-4 rounded-lg`}>
        <h2 className="text-[#9CA3AF] text-[10px] font-bold uppercase tracking-wider mb-4">Bankroll Trend</h2>
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
          <StreakTracker />
          <ComparisonWidget />
        </div>
      )}
    </div>
  );
}
