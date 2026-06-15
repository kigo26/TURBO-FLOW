import { useGameState } from '../GameStateContext';

export default function RiskSettings() {
  const { gameState, setGameState } = useGameState();

  return (
    <div className="border border-[#1E293B] bg-[#0A0B14] p-4 rounded-lg">
      <h2 className="text-[#9CA3AF] text-[10px] font-bold uppercase tracking-wider mb-4">Risk Management</h2>
      <div className="space-y-4">
        <div>
            <label className="text-[9px] text-gray-500 uppercase block mb-1">Risk Tolerance</label>
            <select 
                className="bg-[#050508] text-white p-2 w-full rounded border border-[#1E293B] text-sm"
                value={gameState.riskTolerance}
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
