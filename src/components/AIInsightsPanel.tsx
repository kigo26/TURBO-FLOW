import { useEffect, useState, useCallback } from 'react';

export default function AIInsightsPanel() {
  const [insight, setInsight] = useState<string>('Analyzing trends...');
  const [error, setError] = useState<boolean>(false);

  const fetchInsights = useCallback(() => {
    setInsight('Analyzing trends...');
    setError(false);
    fetch('/api/ai/insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'Provide a brief, non-predictive, professional observation based on a gaming session with increased bankroll fluctuations.' })
    })
    .then(async res => {
      if (!res.ok) throw new Error('Failed');
      return await res.json();
    })
    .then(data => setInsight(data.text))
    .catch(() => {
      setInsight('Insights temporarily unavailable.');
      setError(true);
    });
  }, []);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  return (
    <div className="border border-[#2E354F] bg-[#11111A] p-4 rounded-lg">
      <h2 className="text-[#00D1FF] text-[10px] font-bold uppercase tracking-wider mb-3">AI Insights Core</h2>
      <div className="text-[#D1D5DB] text-[11px] italic font-mono leading-relaxed mb-2">{insight}</div>
      {error && (
        <button 
          onClick={fetchInsights}
          className="text-[10px] text-white bg-indigo-600 px-2 py-1 rounded hover:bg-indigo-700"
        >
          Retry
        </button>
      )}
    </div>
  );
}
