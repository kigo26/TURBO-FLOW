import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine, Cell } from 'recharts';
import { useGameState } from '../GameStateContext';

export default function StreakChart() {
    const { gameState } = useGameState();
    const data = gameState.recentBetOutcomes.map((outcome, index) => ({
        index,
        value: outcome
    }));

    return (
        <div className="border border-[#1E293B] bg-[#0A0B14] p-4 rounded-lg">
            <h2 className="text-[#9CA3AF] text-[10px] font-bold uppercase tracking-wider mb-4">Recent Bet Streaks</h2>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis dataKey="index" hide />
                        <YAxis hide />
                        <Tooltip contentStyle={{ backgroundColor: '#050508', borderColor: '#1E293B', fontSize: '12px' }} />
                        <ReferenceLine y={0} stroke="#475569" />
                        <Bar dataKey="value">
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.value >= 0 ? '#10B981' : '#EF4444'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
