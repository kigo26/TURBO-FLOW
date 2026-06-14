import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useGameState } from '../GameStateContext';

export default function SessionHeatmap() {
    const { gameState } = useGameState();

    // Group events by hour of the day
    const hourData = Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        wins: 0,
        losses: 0,
    }));

    gameState.recentBetOutcomes.forEach(event => {
        const hour = new Date(event.timestamp).getHours();
        if (event.value > 0) {
            hourData[hour].wins += 1;
        } else if (event.value < 0) {
            hourData[hour].losses += 1;
        }
    });

    const data = hourData.filter(h => h.wins > 0 || h.losses > 0);

    return (
        <div className="border border-[#1E293B] bg-[#0A0B14] p-4 rounded-lg">
            <h2 className="text-[#9CA3AF] text-[10px] font-bold uppercase tracking-wider mb-4">Win/Loss Frequency by Hour</h2>
            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis dataKey="hour" stroke="#475569" fontSize={10} tickFormatter={(hour) => `${hour}:00`} axisLine={false} tickLine={false} />
                        <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#050508', borderColor: '#1E293B', fontSize: '12px' }}
                            labelFormatter={(hour) => `${hour}:00`}
                        />
                        <Bar dataKey="wins" stackId="a" fill="#10b981" />
                        <Bar dataKey="losses" stackId="a" fill="#ef4444" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
