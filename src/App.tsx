/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Dashboard from './components/Dashboard';
import Header from './components/Header';
import NudgeEngine from './components/NudgeEngine';
import { GameStateProvider } from './GameStateContext';

export default function App() {
  return (
    <GameStateProvider>
      <div className="min-h-screen bg-[#050508] font-sans text-[#D1D5DB]">
        <Header />
        <main className="p-3">
           <Dashboard />
        </main>
        <NudgeEngine />
      </div>
    </GameStateProvider>
  );
}
