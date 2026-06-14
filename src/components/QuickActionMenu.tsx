import { RefreshCcw, Eye, EyeOff } from 'lucide-react';
import { useGameState } from '../GameStateContext';

export default function QuickActionMenu() {
    const { gameState, setGameState } = useGameState();

    const toggleScanner = () => {
        setGameState({ ...gameState, isScreenScannerVisible: !gameState.isScreenScannerVisible });
    };

    const resetSession = () => {
        setGameState({
            ...gameState,
            bankroll: "$5,000.00",
            sessionPL: "+$0.00",
            spins: 0,
            currentStreak: 0,
            peakStreak: 0
        });
    };

    return (
        <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
            <button
                onClick={toggleScanner}
                className="bg-[#1E293B] text-white p-3 rounded-full shadow-lg hover:bg-[#2D3A4F] transition-all"
                title="Toggle Scanner Visibility"
            >
                {gameState.isScreenScannerVisible ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            <button
                onClick={resetSession}
                className="bg-[#1E293B] text-white p-3 rounded-full shadow-lg hover:bg-[#2D3A4F] transition-all"
                title="Reset Session Data"
            >
                <RefreshCcw size={20} />
            </button>
        </div>
    );
}
