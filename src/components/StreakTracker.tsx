import { useGameState } from '../GameStateContext';

export default function StreakTracker() {
  const { gameState } = useGameState();

  return (
    <div className="border border-[#1E293B] bg-[#0A0B14] p-4 rounded-lg">
      <h2 className="text-[#9CA3AF] text-[10px] font-bold uppercase tracking-wider mb-2">Streak Tracker</h2>
      <div className="flex justify-between items-center">
        <div>
          <div className="text-[9px] text-gray-500 uppercase">Current</div>
          <div className="text-2xl font-mono font-bold text-emerald-400">{gameState.currentStreak}</div>
        </div>
        <div>
          <div className="text-[9px] text-gray-500 uppercase text-right">Peak Streak</div>
          <div className="text-md font-mono font-bold text-white text-right">{gameState.peakStreak}</div>
        </div>
      </div>
    </div>
  );
}
