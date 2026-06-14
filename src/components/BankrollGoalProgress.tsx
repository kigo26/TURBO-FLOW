import { useGameState } from '../GameStateContext';

export default function BankrollGoalProgress() {
    const { gameState } = useGameState();
    const currentBankroll = parseFloat(gameState.bankroll.replace(/[$,]/g, ''));
    const progress = Math.min(100, Math.max(0, (currentBankroll / gameState.targetBankrollGoal) * 100));

    return (
        <div className="col-span-12 border border-[#1E293B] bg-[#0A0B14] p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-[#9CA3AF] text-[10px] font-bold uppercase tracking-wider">Bankroll Goal Progress</h2>
                <span className="text-white text-xs font-mono">{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-[#1E293B] rounded-full h-2.5">
                <div className="bg-[#00D1FF] h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-[#64748B] text-[10px] mt-2">Goal: ${gameState.targetBankrollGoal.toLocaleString()}</p>
        </div>
    );
}
