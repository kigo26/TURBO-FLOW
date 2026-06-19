import { useGameState } from '../GameStateContext';

export default function RiskSettings() {
  const { gameState, setGameState } = useGameState();

  return (
    <div className="border border-[#1E293B] bg-[#0A0B14] p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[#9CA3AF] text-[10px] font-bold uppercase tracking-wider">Risk Management</h2>
        <div className="flex items-center gap-2">
            <span className="text-[9px] text-[#00D1FF] uppercase font-bold">Auto-Optimize</span>
            <button 
               onClick={() => setGameState({ ...gameState, isAutoOptimizeRisk: !gameState.isAutoOptimizeRisk })}
               className={`w-8 h-4 rounded-full flex items-center transition-colors ${gameState.isAutoOptimizeRisk ? 'bg-[#00D1FF]' : 'bg-[#1E293B]'}`}
            >
               <div className={`w-3 h-3 rounded-full bg-white transition-transform transform ${gameState.isAutoOptimizeRisk ? 'translate-x-4' : 'translate-x-1'}`} />
            </button>
        </div>
      </div>
      <div className="space-y-4">
        <div>
            <label className="text-[9px] text-gray-500 uppercase block mb-1">Risk Tolerance preset</label>
            <select 
                className={`bg-[#050508] text-white p-2 w-full rounded border border-[#1E293B] text-sm ${gameState.isAutoOptimizeRisk ? 'opacity-50 cursor-not-allowed' : ''}`}
                value={gameState.riskTolerance}
                disabled={gameState.isAutoOptimizeRisk}
                onChange={(e) => setGameState({ ...gameState, riskTolerance: e.target.value as 'Conservative' | 'Balanced' | 'Aggressive' })}
            >
                <option value="Conservative">Conservative</option>
                <option value="Balanced">Balanced</option>
                <option value="Aggressive">Aggressive</option>
            </select>
        </div>
        <div>
          <label className="text-[9px] text-gray-500 uppercase block mb-1">Stop Loss</label>
          <input type="number" className="bg-[#050508] text-white p-2 w-full rounded border border-[#1E293B] font-mono text-sm" defaultValue={500} />
        </div>
        <div>
          <label className="text-[9px] text-gray-500 uppercase block mb-1">Profit Target</label>
          <input type="number" className="bg-[#050508] text-white p-2 w-full rounded border border-[#1E293B] font-mono text-sm" defaultValue={1000} />
        </div>
      </div>
    </div>
  );
}
