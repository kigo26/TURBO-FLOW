export interface DataPoint {
  name: string;
  value: number;
}

export interface SessionData {
  id: string;
  name: string;
  color: string;
  data: DataPoint[];
}

export interface Session {
  id: string;
  userId: string;
  startTime: number;
  endTime?: number;
  dataPoints: DataPoint[]; // Simplified DataPoints for plotting
}

export interface AlertSettings {
  visualTheme: 'neon' | 'minimalist' | 'flashing';
  soundProfile: 'subtle' | 'rising' | 'distinct';
  intensity: number; // 0-100
}

export interface UserSettings {
  stopLossLimit: number;
  profitTarget: number;
  maxBetSize: number;
  dailyBudget: number;
  alertSettings: AlertSettings;
}

export interface AnalyticsAlert {
  id: string;
  type: 'loss_limit' | 'profit_target' | 'volatility_spike' | 'wellness';
  message: string;
  timestamp: number;
}

export interface Nudge {
  id: string;
  message: string;
  type: 'break' | 'limit' | 'risk_management';
  triggeredAt: number;
}

export interface GameState {
  bankroll: string;
  sessionPL: string;
  volatility: string;
  spins: number;
  currentStreak: number;
  peakStreak: number;
  userSettings: UserSettings;
  viewMode: 'compact' | 'detailed';
  isScreenScannerVisible: boolean;
  recentBetOutcomes: { value: number; timestamp: string }[];
  targetBankrollGoal: number;
}
