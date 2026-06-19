import { createContext, useContext, useState, ReactNode } from 'react';
import { GameState } from './types';

const initialState: GameState = {
  bankroll: "$5,000.00",
  sessionPL: "+$150.00",
  volatility: "MEDIUM",
  spins: 420,
  currentStreak: 5,
  peakStreak: 12,
  userSettings: {
    stopLossLimit: 500,
    profitTarget: 1000,
    maxBetSize: 50,
    dailyBudget: 2000,
    alertSettings: {
      visualTheme: 'neon',
      soundProfile: 'subtle',
      intensity: 70,
      customAlerts: {
        persistenceScore: 80,
        swingAmplitude: 50,
        enabled: true
      }
    }
  },
  viewMode: 'detailed',
  isScreenScannerVisible: true,
  recentBetOutcomes: [],
  targetBankrollGoal: 10000,
  stakeAmount: 1.0,
  isAutoOptimizeRisk: false,
  riskTolerance: 'Balanced',
  currency: 'USD'
};

const GameStateContext = createContext<{
  gameState: GameState;
  setGameState: (state: GameState) => void;
}>({
  gameState: initialState,
  setGameState: () => {}
});

export function GameStateProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(initialState);
  return (
    <GameStateContext.Provider value={{ gameState, setGameState }}>
      {children}
    </GameStateContext.Provider>
  );
}

export const useGameState = () => useContext(GameStateContext);
