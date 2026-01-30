import React, { useState, useEffect, useCallback } from 'react';
import { TerminalFrame } from './components/TerminalFrame';
import { PipelineView } from './components/PipelineView';
import { TrainingSim } from './components/TrainingSim';
import { runRoles } from './services/vrawless';
import { ModelConfig, PipelineResult, SystemStatus, WorldEntity } from './types';
import WorldViewport from './components/WorldViewport';
import { Play, Database, Terminal, Sparkles, Command, Cpu, Layers } from 'lucide-react';

const INITIAL_CONFIG: ModelConfig = {
  vocabSize: 5000,
  dimensions: 512,
  blockSize: 32,
  batchSize: 64,
  lr: 0.001,
  epochs: 5
};

export default function App() {
  // --- STATE ---
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<SystemStatus>(SystemStatus.IDLE);
  const [loss, setLoss] = useState<number | null>(null);
  
  // Pipeline State (Text Analysis)
  const [result, setResult] = useState<PipelineResult | null>(null);
  
  // World State (3D Reality)
  const [coherence, setCoherence] = useState(20); // Starts low (Chaos)
  const [entities, setEntities] = useState<WorldEntity[]>([]);
  
  const [timestamp, setTimestamp] = useState("");

  // --- TICKS & TIME ---
  useEffect(() => {
    const timer = setInterval(() => {
      setTimestamp(new Date().toLocaleTimeString('en-US', { hour12: false }));
      // Slowly decay coherence if not maintained
      setCoherence(prev => Math.max(10, prev - 0.05));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- ACTIONS ---
  const handleTrain = () => {
    if (status !== SystemStatus.IDLE && status !== SystemStatus.STABLE) return;
    setStatus(SystemStatus.TRAINING);
  };

  const handleTrainingComplete = () => {
    setStatus(SystemStatus.STABLE);
    setCoherence(prev => Math.min(100, prev + 30)); // Training boosts reality stability
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setStatus(SystemStatus.INFERENCING);
    
    // 1. Run the VRAWLESS Pipeline (Logic)
    const pipelineResult = runRoles(input);
    setResult(pipelineResult);

    // 2. Affect Reality (World State)
    if (pipelineResult.manifestation_trigger) {
        // Add new entity
        setEntities(prev => [...prev, pipelineResult.manifestation_trigger!]);
        // Boost coherence
        setCoherence(prev => Math.min(100, prev + 15));
        setInput(""); // Clear input on success
    } else {
        // Just analysis, minor boost
        setCoherence(prev => Math.min(100, prev + 2));
    }

    setTimeout(() => {
        setStatus(SystemStatus.IDLE);
    }, 600);
  };

  return (
    <>
        {/* THE VOID / WORLD LAYER (Background) */}
        <WorldViewport coherence={coherence} entities={entities} />

        {/* THE HUD LAYER (Foreground) */}
        <TerminalFrame status={status} timestamp={timestamp}>
        
        <div className="h-full flex flex-col justify-between max-w-7xl mx-auto w-full">
            
            {/* TOP ROW: Stats & Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
                
                {/* Left: Coherence Monitor */}
                <div className="bg-[rgba(10,10,15,0.7)] backdrop-blur-md border border-[#003b00] p-4 rounded-sm shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                    <div className="flex items-center gap-2 text-[#98FF98] border-b border-[#003b00] pb-2 mb-2">
                        <Cpu size={14} />
                        <h2 className="uppercase font-bold tracking-wider text-xs">Reality Coherence</h2>
                    </div>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-mono font-bold text-[#E6E6FA]">{coherence.toFixed(1)}%</span>
                        <span className="text-xs text-[#98FF98] mb-1 animate-pulse">{coherence < 30 ? 'CRITICAL FLUX' : 'STABLE'}</span>
                    </div>
                    <div className="w-full bg-[#001a00] h-1 mt-2">
                        <div className="h-full bg-[#E6E6FA] transition-all duration-1000" style={{width: `${coherence}%`}}></div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] text-gray-400 font-mono uppercase">
                        <div>Entities: {entities.length}</div>
                        <div>Loss: {loss?.toFixed(4) || 'N/A'}</div>
                    </div>
                </div>

                {/* Center: Pipeline Visualization (Only shows when active) */}
                <div className="lg:col-span-2">
                    {result && (
                        <div className="bg-[rgba(10,10,15,0.7)] backdrop-blur-md border border-[rgba(152,255,152,0.2)] p-4 rounded-sm animate-in fade-in slide-in-from-top-4">
                             <PipelineView result={result} />
                        </div>
                    )}
                </div>
            </div>

            {/* BOTTOM ROW: Command Interface */}
            <div className="mb-4 space-y-4">
                
                {/* Floating Actions */}
                <div className="flex gap-2 justify-end">
                    <button 
                        onClick={handleTrain}
                        disabled={status === SystemStatus.TRAINING}
                        className="flex items-center gap-2 px-4 py-2 bg-[rgba(255,215,0,0.1)] border border-[#FFD700] text-[#FFD700] text-xs font-bold uppercase hover:bg-[rgba(255,215,0,0.2)] transition-all"
                    >
                        <Database size={12} />
                        {status === SystemStatus.TRAINING ? 'Recalibrating Matrix...' : 'Train Substrate'}
                    </button>
                    <div className="px-4 py-2 bg-[rgba(230,230,250,0.1)] border border-[#E6E6FA] text-[#E6E6FA] text-xs font-bold uppercase flex items-center gap-2">
                        <Layers size={12} />
                        <span>Objects: {entities.length}</span>
                    </div>
                </div>

                {/* The Input Terminal */}
                <form onSubmit={handleCommand} className="relative group">
                    <div className="absolute inset-0 bg-[rgba(2,2,5,0.9)] backdrop-blur-xl border border-[#98FF98] rounded-sm shadow-[0_0_30px_rgba(152,255,152,0.1)]"></div>
                    
                    <div className="relative p-4 flex flex-col gap-2">
                        <label className="text-[10px] text-[#98FF98] uppercase tracking-widest font-bold flex items-center gap-2">
                            <Terminal size={10} />
                            VRAWLESS Command Line
                        </label>
                        <div className="flex gap-4 items-center">
                            <Command size={16} className="text-[#E6E6FA] animate-pulse" />
                            <input 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="w-full bg-transparent text-[#E6E6FA] font-mono text-lg outline-none placeholder:text-[rgba(230,230,250,0.3)]"
                                placeholder="Manifest geometry (e.g. 'Construct a prism in the void')"
                                autoFocus
                            />
                            <button 
                                type="submit"
                                className="px-6 py-2 bg-[#98FF98] text-[#020205] font-bold uppercase text-xs hover:bg-[#E6E6FA] transition-colors"
                            >
                                Execute
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <TrainingSim 
            isActive={status === SystemStatus.TRAINING} 
            onComplete={handleTrainingComplete} 
            onLossUpdate={setLoss}
            maxEpochs={INITIAL_CONFIG.epochs}
        />
        </TerminalFrame>
    </>
  );
}