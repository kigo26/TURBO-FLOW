import { useState, useRef, ChangeEvent } from 'react';
import { useGameState } from '../GameStateContext';

export default function ScreenAnalyzer() {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { gameState, setGameState } = useGameState();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeScreen = async (type: 'dashboard' | 'all' = 'dashboard') => {
    if (!image) return;
    setLoading(true);
    setAnalysis(null);
    try {
      const [header, base64Data] = image.split(',');
      const mimeType = header.match(/:(.*?);/)?.[1] || 'image/png';
      
      const prompt = type === 'all' 
        ? `Extract all data, text, numbers, and statistics from the screenshot. Provide a detailed summary of everything visible on the screen.`
        : `
Extract the following information from the game dashboard screenshot, and output ONLY valid JSON without markdown wrapping.
Required JSON keys and types:
- bankroll (string, e.g., "$5,000.00")
- sessionPL (string, e.g., "+$150.00")
- volatility (string, e.g., "MEDIUM", "HIGH")
- stakeAmount (number, e.g., 1.0)
- spins (number, e.g., 420)

If you cannot find a value, omit the key for that value. Return ONLY valid JSON block.`;

      const response = await fetch('/api/ai/analyze-screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Data, mimeType, prompt })
      });
      const data = await response.json();
      
      if (type === 'all') {
         setAnalysis(data.text);
      } else {
        try {
          // Attempt to parse JSON response
          const jsonStr = data.text.replace(/^\s*\`\`\`json/i, '').replace(/\`\`\`\s*$/i, '').trim();
          const extracted = JSON.parse(jsonStr);
          
          setGameState({
            ...gameState,
            ...(extracted.bankroll ? { bankroll: extracted.bankroll } : {}),
            ...(extracted.sessionPL ? { sessionPL: extracted.sessionPL } : {}),
            ...(extracted.volatility ? { volatility: extracted.volatility } : {}),
            ...(extracted.stakeAmount !== undefined ? { stakeAmount: Number(extracted.stakeAmount) } : {}),
            ...(extracted.spins !== undefined ? { spins: Number(extracted.spins) } : {}),
          });
          
          setAnalysis("Success: Dashboard updated from onscreen data.");
        } catch (parseError) {
          // Fallback or error in extraction
          setAnalysis(data.text);
        }
      }
    } catch {
      setAnalysis('Analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-[#1E293B] bg-[#0A0B14] p-4 rounded-lg">
      <h2 className="text-[#9CA3AF] text-[10px] font-bold uppercase tracking-wider mb-4">Screen Analyzer</h2>
      <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
      <button onClick={() => fileInputRef.current?.click()} className="w-full bg-[#1E293B] text-white p-2 rounded text-sm mb-2 hover:bg-[#2E354F]">
        {image ? 'Change Screenshot' : 'Upload Screenshot'}
      </button>
      {image && <img src={image} alt="Upload" className="max-h-32 mx-auto mb-2 rounded border border-[#1E293B]" />}
      {image && (
        <div className="flex gap-2 mb-2">
          <button onClick={analyzeScreen} disabled={loading} className="flex-1 bg-[#00D1FF] text-black font-bold p-2 rounded text-sm hover:bg-[#00B8E0]">
            {loading ? 'Extracting...' : 'Extract Dashboard Data'}
          </button>
          <button onClick={() => analyzeScreen('all')} disabled={loading} className="flex-1 bg-purple-500 text-white font-bold p-2 rounded text-sm hover:bg-purple-600">
            {loading ? 'Extracting...' : 'Extract All Data'}
          </button>
        </div>
      )}
      {analysis && <div className="mt-4 p-2 bg-gray-800 rounded text-xs text-white italic">{analysis}</div>}
    </div>
  );
}
