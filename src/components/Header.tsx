import React from 'react';
import { useGameState } from '../GameStateContext';

export default function Header() {
  const { gameState, setGameState } = useGameState();

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGameState({ ...gameState, currency: e.target.value as any });
  };

  return (
    <header className="h-16 border-b border-[#1E293B] bg-[#0A0A0F] flex items-center justify-between px-6 shrink-0">
      <h1 className="text-xl font-bold tracking-tighter text-white">GAMEFLOW <span className="text-[#00D1FF]">AI</span></h1>
      
      <div className="flex items-center gap-3">
          <label className="text-xs text-gray-500 uppercase font-bold tracking-wider hidden sm:block">Currency</label>
          <select 
            value={gameState.currency} 
            onChange={handleCurrencyChange}
            className="bg-[#1E293B] text-white text-xs font-bold py-1.5 px-3 rounded hover:bg-[#2D3A4F] border border-[#2D3A4F] outline-none"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="JPY">JPY (¥)</option>
            <option value="KES">KES (KShs)</option>
          </select>
      </div>
    </header>
  );
}
