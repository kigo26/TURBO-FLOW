import { useState, useRef, useEffect } from 'react';
import { useGameState } from '../GameStateContext';

export default function ScreenScanner() {
  const { setGameState, gameState } = useGameState();
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setIsScanning(true);
      scanFrame();
    } catch (err) {
      console.error("Error scanning screen:", err);
    }
  };

  const stopScanning = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    setIsScanning(false);
  };

  const scanFrame = async () => {
    if (!isScanning || !streamRef.current?.active) return;
    
    // Capture from video
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current!.videoWidth;
    canvas.height = videoRef.current!.videoHeight;
    canvas.getContext('2d')!.drawImage(videoRef.current!, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.5);
    
    // Send to backend
    const [header, base64Data] = dataUrl.split(',');
    const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
    
    let nextScanDelay = 300000; // 5 minutes default
    
    try {
      const response = await fetch('/api/ai/analyze-screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          image: base64Data, 
          mimeType, 
          prompt: "Extract: balance as string (e.g. $5,000.00), sessionPL as string (e.g. +$150.00), volatility as string (e.g. HIGH/MEDIUM/LOW), spins as number. Return JSON ONLY." 
        })
      });
      
      if (response.status === 429) {
        console.warn("Rate limited, backing off...");
        nextScanDelay = 600000; // 10 minute backoff
      } else if (response.ok) {
        const data = await response.json();
        const parsedData = JSON.parse(data.text.replace(/```json/g, '').replace(/```/g, ''));
        
        const lastBankroll = parseFloat(gameState.bankroll.replace(/[$,]/g, ''));
        const newBankroll = parseFloat(parsedData.bankroll.replace(/[$,]/g, ''));
        const outcome = newBankroll - lastBankroll;
        
        const newOutcomes = [...gameState.recentBetOutcomes, { value: outcome, timestamp: new Date().toLocaleTimeString() }].slice(-20); // Keep last 20
        
        setGameState({ ...parsedData, ...gameState, recentBetOutcomes: newOutcomes }); // Merge, preserve settings
      } else {
        console.error("Failed to analyze screenshot", await response.text());
      }
    } catch (e) {
      console.error(e);
    }
    
    if (streamRef.current?.active) setTimeout(scanFrame, nextScanDelay);
  };

  return (
    <div className="border border-[#1E293B] bg-[#0A0B14] p-4 rounded-lg">
      <h2 className="text-[#9CA3AF] text-[10px] font-bold uppercase tracking-wider mb-4">Live Screen Scanner</h2>
      <video ref={videoRef} autoPlay playsInline className="w-full rounded border border-[#1E293B] mb-2" />
      <button onClick={isScanning ? stopScanning : startScanning} className={`w-full ${isScanning ? 'bg-red-500' : 'bg-[#00D1FF]'} text-white font-bold p-2 rounded text-sm hover:opacity-90`}>
        {isScanning ? 'Stop Scanning' : 'Start Live Scan'}
      </button>
    </div>
  );
}
