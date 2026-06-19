import { useGameState } from '../GameStateContext';

export default function Settings() {
  const { gameState, setGameState } = useGameState();
  const { userSettings } = gameState;

  const updateSetting = (key: keyof typeof userSettings, value: any) => {
    setGameState({
      ...gameState,
      userSettings: {
        ...userSettings,
        [key]: value
      }
    });
  };

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'JPY': return '¥';
      case 'KES': return 'KShs ';
      default: return '$';
    }
  };
  const sym = getCurrencySymbol(gameState.currency);

  return (
    <div className="border border-[#1E293B] bg-[#0A0B14] p-4 rounded-lg">
      <h2 className="text-[#9CA3AF] text-[10px] font-bold uppercase tracking-wider mb-4">Risk & Alert Settings</h2>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="text-[9px] text-gray-500 uppercase block mb-1">Stop-Loss Limit ({sym})</label>
          <input 
            type="number" 
            value={userSettings.stopLossLimit} 
            onChange={(e) => updateSetting('stopLossLimit', Number(e.target.value))}
            className="bg-[#050508] text-white p-2 w-full rounded border border-[#1E293B] font-mono text-sm" 
          />
        </div>
        <div>
          <label className="text-[9px] text-gray-500 uppercase block mb-1">Profit Target ({sym})</label>
          <input 
            type="number" 
            value={userSettings.profitTarget} 
            onChange={(e) => updateSetting('profitTarget', Number(e.target.value))}
            className="bg-[#050508] text-white p-2 w-full rounded border border-[#1E293B] font-mono text-sm" 
          />
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-[#1E293B]">
        <h3 className="text-[#9CA3AF] text-[10px] font-bold uppercase tracking-wider">Alert Customization</h3>
        <div>
          <label className="text-[9px] text-gray-500 uppercase block mb-1">Visual Theme</label>
          <select 
            value={userSettings.alertSettings.visualTheme}
            onChange={(e) => setGameState({ ...gameState, userSettings: { ...userSettings, alertSettings: { ...userSettings.alertSettings, visualTheme: e.target.value as any } } })}
            className="bg-[#050508] text-white p-2 w-full rounded border border-[#1E293B] text-sm mb-2"
          >
            <option value="neon">Neon Glow</option>
            <option value="minimalist">Minimalist</option>
            <option value="flashing">Urgent Flashing</option>
          </select>
        </div>
        <div>
          <label className="text-[9px] text-gray-500 uppercase block mb-1">Sound Profile</label>
          <select 
            value={userSettings.alertSettings.soundProfile}
            onChange={(e) => setGameState({ ...gameState, userSettings: { ...userSettings, alertSettings: { ...userSettings.alertSettings, soundProfile: e.target.value as any } } })}
            className="bg-[#050508] text-white p-2 w-full rounded border border-[#1E293B] text-sm"
          >
            <option value="subtle">Subtle Chime</option>
            <option value="rising">Rising Tone</option>
            <option value="distinct">Distinct Notification</option>
          </select>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-[#1E293B]">
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-[#9CA3AF] text-[10px] font-bold uppercase tracking-wider">Custom Alerts configuration</h3>
            <div className="flex items-center gap-2">
                <span className="text-[9px] text-[#00D1FF] uppercase font-bold">Enabled</span>
                <button 
                  onClick={() => setGameState({ ...gameState, userSettings: { ...userSettings, alertSettings: { ...userSettings.alertSettings, customAlerts: { ...userSettings.alertSettings.customAlerts, enabled: !userSettings.alertSettings.customAlerts.enabled } } } })}
                  className={`w-8 h-4 rounded-full flex items-center transition-colors ${userSettings.alertSettings.customAlerts.enabled ? 'bg-[#00D1FF]' : 'bg-[#1E293B]'}`}
                >
                  <div className={`w-3 h-3 rounded-full bg-white transition-transform transform ${userSettings.alertSettings.customAlerts.enabled ? 'translate-x-4' : 'translate-x-1'}`} />
                </button>
            </div>
        </div>
        <div className={`space-y-4 ${!userSettings.alertSettings.customAlerts.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
           <div>
              <div className="flex justify-between mb-1">
                 <label className="text-[9px] text-gray-500 uppercase">Persistence Score Threshold (%)</label>
                 <span className="text-[10px] text-white font-mono">{userSettings.alertSettings.customAlerts.persistenceScore}</span>
              </div>
              <input 
                 type="range" 
                 min="0" max="100" 
                 value={userSettings.alertSettings.customAlerts.persistenceScore} 
                 onChange={(e) => setGameState({ ...gameState, userSettings: { ...userSettings, alertSettings: { ...userSettings.alertSettings, customAlerts: { ...userSettings.alertSettings.customAlerts, persistenceScore: Number(e.target.value) } } } })}
                 className="w-full accent-[#00D1FF]"
              />
           </div>
           <div>
              <div className="flex justify-between mb-1">
                 <label className="text-[9px] text-gray-500 uppercase">Swing Amplitude Threshold ({sym})</label>
                 <span className="text-[10px] text-white font-mono">{userSettings.alertSettings.customAlerts.swingAmplitude}</span>
              </div>
              <input 
                 type="range" 
                 min="0" max="500" 
                 value={userSettings.alertSettings.customAlerts.swingAmplitude} 
                 onChange={(e) => setGameState({ ...gameState, userSettings: { ...userSettings, alertSettings: { ...userSettings.alertSettings, customAlerts: { ...userSettings.alertSettings.customAlerts, swingAmplitude: Number(e.target.value) } } } })}
                 className="w-full accent-[#10B981]"
              />
           </div>
        </div>
      </div>
    </div>
  );
}
