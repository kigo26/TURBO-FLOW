/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Dashboard from './components/Dashboard';
import NudgeEngine from './components/NudgeEngine';
import { GameStateProvider } from './GameStateContext';

export default function App() {
  return (
    <GameStateProvider>
      <div className="min-h-screen bg-[#050508] font-sans text-[#D1D5DB]">
        <header className="h-16 border-b border-[#1E293B] bg-[#0A0A0F] flex items-center px-6 shrink-0">
          <h1 className="text-xl font-bold tracking-tighter text-white">GAMEFLOW <span className="text-[#00D1FF]">AI</span></h1>
        </header>
        <main className="p-3">
           <Dashboard />
        </main>
        <NudgeEngine />
      </div>
    </GameStateProvider>
  );
}
