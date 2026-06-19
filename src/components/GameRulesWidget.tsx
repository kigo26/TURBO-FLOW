import React from 'react';

const paytableData = [
  { symbol: 'A', colors: 'text-blue-400 font-serif', pays: { 5: 200, 4: 40, 3: 10 } },
  { symbol: 'K', colors: 'text-red-500 font-serif', pays: { 5: 200, 4: 40, 3: 10 } },
  { symbol: 'Q', colors: 'text-yellow-400 font-serif', pays: { 5: 150, 4: 30, 3: 7 } },
  { symbol: 'J', colors: 'text-teal-400 font-serif', pays: { 5: 150, 4: 30, 3: 7 } },
  { symbol: '10', colors: 'text-purple-400', pays: { 5: 100, 4: 20, 3: 5 } },
  { symbol: '9', colors: 'text-green-500', pays: { 5: 100, 4: 20, 3: 5 } },
];

export default function GameRulesWidget() {
  return (
    <div className="border border-[#1E293B] bg-[#0A0B14] p-4 rounded-lg">
      <h2 className="text-[#9CA3AF] text-[10px] font-bold uppercase tracking-wider mb-4">Paytable Reference</h2>
      
      <div className="mb-4 text-[10px] text-gray-500 bg-[#050508] p-2 rounded border border-[#1E293B]">
        <span className="text-white">Active Grid:</span> 5x3 Boxes &bull; <span className="text-white">Active Paylines:</span> 20 Connections
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {paytableData.map((item, idx) => (
          <div key={idx} className="border border-[#1E293B] p-2 rounded flex flex-col items-center bg-[#050508]">
             <div className={`text-2xl font-bold ${item.colors} mb-2 drop-shadow-md`}>{item.symbol}</div>
             <div className="text-[10px] text-gray-400 w-full flex justify-between px-2">
                <span className="text-amber-500 font-bold">5</span>
                <span className="text-white font-mono">{item.pays['5']}</span>
             </div>
             <div className="text-[10px] text-gray-400 w-full flex justify-between px-2">
                <span className="text-amber-500 font-bold">4</span>
                <span className="text-white font-mono">{item.pays['4']}</span>
             </div>
             <div className="text-[10px] text-gray-400 w-full flex justify-between px-2">
                <span className="text-amber-500 font-bold">3</span>
                <span className="text-white font-mono">{item.pays['3']}</span>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
