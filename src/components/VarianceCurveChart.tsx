import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from 'recharts';
import { useGameState } from '../GameStateContext';

export default function VarianceCurveChart() {
  const { gameState } = useGameState();
  const [data, setData] = useState<{ time: string; timestamp: number; volatility: number }[]>([]);

  // Calculate current volatility
  const calculateStdDev = (outcomes: { value: number; timestamp: string }[]) => {
    const values = outcomes.map(d => d.value);
    if (values.length === 0) return 0;
    const n = values.length;
    const mean = values.reduce((a, b) => a + b, 0) / n;
    return Math.sqrt(values.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / n);
  };
  const stdDev = calculateStdDev(gameState.recentBetOutcomes);
  const baseVariance = gameState.stakeAmount > 0 ? gameState.stakeAmount * 5 : 5;
  const currentVolIndex = Math.min(100, Math.max(0, (stdDev / baseVariance) * 100));

  useEffect(() => {
    // Generate initial 30 minutes mock data if empty
    if (data.length === 0) {
      const now = Date.now();
      const mockData = [];
      let lastVol = currentVolIndex || 30; // start near current if available
      for (let i = 30; i >= 0; i--) {
        const time = new Date(now - i * 60000);
        // Random walk towards current vol
        const pull = (currentVolIndex - lastVol) * 0.1;
        const noise = (Math.random() - 0.5) * 15;
        lastVol = Math.min(100, Math.max(0, lastVol + pull + noise));
        
        mockData.push({
          time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timestamp: time.getTime(),
          volatility: i === 0 ? currentVolIndex : Number(lastVol.toFixed(1))
        });
      }
      setData(mockData);
    }
  }, []); // Run once on mount

  useEffect(() => {
    if (data.length > 0) {
      const interval = setInterval(() => {
         const now = new Date();
         setData(prevData => {
            const newData = [...prevData];
            // Remove points older than 30 mins
            const cutoff = now.getTime() - 30 * 60000;
            const filtered = newData.filter(d => d.timestamp >= cutoff);
            
            // Add new current point every 10 seconds (simulate real-time)
            filtered.push({
                time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                timestamp: now.getTime(),
                volatility: Number(currentVolIndex.toFixed(1))
            });
            return filtered;
         });
      }, 5000); // update every 5 seconds for visual real-time feel
      return () => clearInterval(interval);
    }
  }, [data.length, currentVolIndex]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const vol = payload[0].value;
      const riskLevel = vol > 80 ? 'Extreme' : vol > 60 ? 'High' : vol > 40 ? 'Elevated' : 'Stable';
      const color = vol > 80 ? '#EF4444' : vol > 60 ? '#F97316' : vol > 40 ? '#EAB308' : '#10B981';

      return (
        <div className="bg-[#11111A] border border-[#1E293B] p-2 rounded shadow-xl">
          <p className="text-[10px] text-gray-400 mb-1">{label}</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
            <span className="text-white font-mono font-bold text-xs">Vol: {Number(vol).toFixed(1)}</span>
            <span className="text-[10px] text-gray-500 uppercase">({riskLevel})</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="col-span-12 border border-[#1E293B] bg-[#0A0B14] p-4 rounded-lg relative overflow-hidden">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-[#00D1FF] text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00D1FF] animate-pulse"></span>
                Variance Curve (30 Min)
            </h2>
            <div className="text-[10px] font-mono text-gray-400">
                LIVE <span className="text-[#00D1FF] animate-pulse ml-1">●</span>
            </div>
        </div>
        
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                <defs>
                    <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00D1FF" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00D1FF" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <XAxis 
                    dataKey="time" 
                    stroke="#4B5563" 
                    fontSize={10} 
                    tickFormatter={(val) => val.substring(0, 5)} 
                    tickMargin={10}
                    minTickGap={30}
                />
                <YAxis 
                    stroke="#4B5563" 
                    fontSize={10}
                    domain={[0, 100]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                    type="monotone" 
                    dataKey="volatility" 
                    stroke="#00D1FF" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorVol)" 
                    isAnimationActive={false}
                />
            </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
}
