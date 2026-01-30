import React, { useEffect, useState, useRef } from 'react';

interface TrainingSimProps {
  isActive: boolean;
  onComplete: () => void;
  onLossUpdate: (loss: number) => void;
  maxEpochs: number;
}

export const TrainingSim: React.FC<TrainingSimProps> = ({ isActive, onComplete, onLossUpdate, maxEpochs }) => {
  const [epoch, setEpoch] = useState(0);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  useEffect(() => {
    if (!isActive) {
        setEpoch(0);
        setProgress(0);
        setLogs([]);
        return;
    }

    let currentEpoch = 1;
    let currentProgress = 0;
    let currentLoss = 2.5;

    const interval = setInterval(() => {
      // Simulation Logic
      currentProgress += 5; // 5% per tick
      
      // Update loss with some noise but general downward trend
      currentLoss = Math.max(0.01, currentLoss * 0.98 - (Math.random() * 0.05));
      onLossUpdate(currentLoss);

      if (currentProgress >= 100) {
        setLogs(prev => [...prev, `[TRAIN] Epoch ${currentEpoch}/${maxEpochs} - Loss: ${currentLoss.toFixed(4)}`]);
        currentEpoch += 1;
        currentProgress = 0;
        
        if (currentEpoch > maxEpochs) {
          clearInterval(interval);
          setLogs(prev => [...prev, `[SYSTEM] Training Complete. Model saved to ai_model.pth`]);
          onComplete();
        } else {
            setEpoch(currentEpoch);
        }
      }
      
      setProgress(currentProgress);
      if(currentEpoch <= maxEpochs) setEpoch(currentEpoch);

    }, 100); // Speed of simulation

    return () => clearInterval(interval);
  }, [isActive, maxEpochs, onComplete, onLossUpdate]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#001a00] border-2 border-[#00ff41] p-6 w-full max-w-2xl shadow-[0_0_50px_rgba(0,255,65,0.3)]">
        <h3 className="text-[#00ff41] text-xl font-bold uppercase mb-4 animate-pulse">Training Neural Substrate...</h3>
        
        <div className="mb-4 space-y-2">
            <div className="flex justify-between text-xs text-[#008f11]">
                <span>EPOCH: {Math.min(epoch, maxEpochs)}/{maxEpochs}</span>
                <span>DEVICE: CUDA (SIM)</span>
            </div>
            <div className="w-full bg-[#003b00] h-4 border border-[#005f11]">
                <div 
                    className="bg-[#00ff41] h-full transition-all duration-100 ease-linear shadow-[0_0_10px_#00ff41]" 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>

        <div className="h-48 overflow-y-auto font-mono text-xs bg-black border border-[#003b00] p-2 space-y-1">
            {logs.map((log, i) => (
                <div key={i} className="text-[#008f11] border-l-2 border-[#00ff41] pl-2">{log}</div>
            ))}
            <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );
};