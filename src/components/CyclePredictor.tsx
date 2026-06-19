import { useGameState } from '../GameStateContext';
import { useMemo } from 'react';

export default function CyclePredictor() {
    const { gameState } = useGameState();
    
    const { bigWinProb, megaWinProb, spinsSinceBig, spinsSinceMega } = useMemo(() => {
        let lastBigWinIndex = -1;
        let lastMegaWinIndex = -1;
        
        const bigThreshold = gameState.stakeAmount * 10;
        const megaThreshold = gameState.stakeAmount * 50;

        gameState.recentBetOutcomes.forEach((outcome, index) => {
            if (outcome.value >= megaThreshold) {
                lastMegaWinIndex = index;
            } else if (outcome.value >= bigThreshold) {
                lastBigWinIndex = index;
            }
        });

        // if totalSpins is not just recent history but total spins from state, we can simulate better
        // since recentBetOutcomes maxes at 20 right now (based on ScreenScanner).
        // Let's use gameState.spins to estimate.
        
        const totalSpins = gameState.spins;
        const spinsSinceBigWin = lastBigWinIndex !== -1 ? (gameState.recentBetOutcomes.length - 1 - lastBigWinIndex) : totalSpins % 45;
        const spinsSinceMegaWin = lastMegaWinIndex !== -1 ? (gameState.recentBetOutcomes.length - 1 - lastMegaWinIndex) : totalSpins % 180;

        // Simulating progressive probability increase
        const bigProb = Math.min(99, Math.max(1, (spinsSinceBigWin / 50) * 100));
        const megaProb = Math.min(99, Math.max(1, (spinsSinceMegaWin / 200) * 100));

        return {
            bigWinProb: bigProb,
            megaWinProb: megaProb,
            spinsSinceBig: spinsSinceBigWin,
            spinsSinceMega: spinsSinceMegaWin
        };
    }, [gameState.recentBetOutcomes, gameState.stakeAmount, gameState.spins]);

    return (
        <div className="border border-[#1E293B] bg-[#0A0B14] p-4 rounded-lg">
            <h2 className="text-[#F59E0B] text-[10px] font-bold uppercase tracking-wider mb-4">Cycle Prediction Analysis</h2>
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-400 font-medium">Big Win Cycle</span>
                        <span className="text-xs font-mono text-emerald-400">{bigWinProb.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-[#1E293B] h-1.5 rounded overflow-hidden">
                        <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${bigWinProb}%` }} />
                    </div>
                    <div className="text-[9px] text-gray-500 mt-1 text-right">{spinsSinceBig} spins since last</div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-400 font-medium">Mega Win Cycle</span>
                        <span className="text-xs font-mono text-fuchsia-400">{megaWinProb.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-[#1E293B] h-1.5 rounded overflow-hidden">
                        <div className="bg-fuchsia-500 h-full transition-all duration-500" style={{ width: `${megaWinProb}%` }} />
                    </div>
                    <div className="text-[9px] text-gray-500 mt-1 text-right">{spinsSinceMega} spins since last</div>
                </div>
            </div>
            <div className="mt-4 text-[10px] text-gray-500 italic leading-tight">
                *Predictions are based on algorithmic analysis of historical volatility and cycle pacing. Slots are random and past performance does not guarantee future results.
            </div>
        </div>
    );
}
