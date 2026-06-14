import { useGameState } from '../GameStateContext';

export default function SessionEventsList() {
    const { gameState } = useGameState();
    const recentEvents = [...gameState.recentBetOutcomes].slice(-10).reverse();

    return (
        <div className="border border-[#1E293B] bg-[#0A0B14] p-4 rounded-lg">
            <h2 className="text-[#9CA3AF] text-[10px] font-bold uppercase tracking-wider mb-4">Last 10 Session Events</h2>
            <div className="h-64 overflow-y-auto pr-2">
                {recentEvents.length === 0 ? (
                    <p className="text-[#64748B] text-xs">No recent events recorded.</p>
                ) : (
                    recentEvents.map((event, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-[#1E293B] last:border-0 text-xs font-mono">
                            <span className="text-[#9CA3AF]">{event.timestamp}</span>
                            <span className={event.value >= 0 ? 'text-emerald-500' : 'text-red-500'}>
                                {event.value >= 0 ? '+' : ''}${event.value.toFixed(2)}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
