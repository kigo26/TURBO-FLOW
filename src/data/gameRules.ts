export interface PaytableEntry {
  name: string;
  payouts: {
    5: number;
    4: number;
    3: number;
  };
}

export const paytable: PaytableEntry[] = [
  { name: 'Player 1', payouts: { 5: 5000, 4: 500, 3: 50 } },
  { name: 'Player 2', payouts: { 5: 1000, 4: 150, 3: 20 } },
  { name: 'Player 3', payouts: { 5: 1000, 4: 150, 3: 20 } },
  { name: 'Player 4', payouts: { 5: 500, 4: 70, 3: 20 } },
  { name: 'Player 5', payouts: { 5: 500, 4: 70, 3: 20 } },
  { name: 'Player 6', payouts: { 5: 200, 4: 40, 3: 10 } },
  { name: 'A', payouts: { 5: 200, 4: 40, 3: 10 } },
  { name: 'K', payouts: { 5: 150, 4: 30, 3: 7 } },
  { name: 'Q', payouts: { 5: 150, 4: 30, 3: 7 } },
  { name: 'J', payouts: { 5: 100, 4: 20, 3: 5 } },
  { name: '10', payouts: { 5: 100, 4: 20, 3: 5 } },
];

export const wildIcon = {
    name: 'Soccer Ball (Wild)',
    replaces: 'All icons except free spin'
};

export const winningLinesCount = 20;
