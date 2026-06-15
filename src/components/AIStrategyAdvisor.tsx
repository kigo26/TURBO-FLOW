import { useState, useEffect } from 'react';
import { useGameState } from '../GameStateContext';

export default function AIStrategyAdvisor() {
  const { gameState } = useGameState();
  const [advice, setAdvice] = useState<string | null>(null);

  const calculateStdDev = (data: { value: number }[]) => {
    const values = data.map(d => d.value);
    if (values.length === 0) return 0;
    const n = values.length;
    const mean = values.reduce((a, b) => a + b, 0) / n;
    return Math.sqrt(values.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / n);
  };

  useEffect(() => {
    const stdDev = calculateStdDev(gameState.recentBetOutcomes);
    const recentOutcome = gameState.recentBetOutcomes.length > 0 
      ? gameState.recentBetOutcomes[gameState.recentBetOutcomes.length - 1].value 
      : 0;

    const thresholds = {
        Conservative: { stdDev: 30, loss: -50 },
        Balanced: { stdDev: 50, loss: -100 },
        Aggressive: { stdDev: 80, loss: -200 }
    };

    const t = thresholds[gameState.riskTolerance];

    if (stdDev > t.stdDev) {
      setAdvice(`High volatility (${gameState.riskTolerance} mode). Consider reducing stake size or taking a break.`);
    } else if (recentOutcome < t.loss) {
      setAdvice("Significant recent loss detected. Suggest reviewing your strategy.");
    } else if (stdDev < (t.stdDev / 5)) {
      setAdvice("Volatility is stable. Good environment for your current strategy.");
    } else {
      setAdvice("Analyzing session trends...");
    }
  }, [gameState.recentBetOutcomes, gameState.riskTolerance]);

  return (
    <div className="border border-[#1E293B] bg-[#0A0B14] p-4 rounded-lg">
      <h2 className="text-[#9CA3AF] text-[10px] font-bold uppercase tracking-wider mb-2">AI Strategy Advisor</h2>
      <div className="text-xs text-white leading-relaxed">{advice || "Collecting data..."}</div>
    </div>
  );
}
