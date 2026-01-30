import React from 'react';
import { SystemStatus } from '../types';

interface TerminalFrameProps {
  children: React.ReactNode;
  status: SystemStatus;
  timestamp: string;
}

export const TerminalFrame: React.FC<TerminalFrameProps> = ({ children, status, timestamp }) => {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col font-mono text-[#E6E6FA] pointer-events-none">
      
      {/* Scanline & CRT Effects */}
      <div className="absolute inset-0 scanline-overlay z-50 mix-blend-overlay opacity-50"></div>
      
      {/* HUD Header - Glassmorphism */}
      <header className="flex justify-between items-center border-b border-[rgba(152,255,152,0.1)] bg-[rgba(2,2,5,0.4)] backdrop-blur-sm p-4 z-40 pointer-events-auto">
        <div className="flex items-center gap-4">
          <span className="text-[#E6E6FA] glow-text font-bold tracking-[0.2em]">[IADESS::OMEGA]</span>
          <div className="h-4 w-[1px] bg-[#98FF98] opacity-50"></div>
          <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
            status === SystemStatus.TRAINING ? 'border-[#FFD700] text-[#FFD700] animate-pulse' :
            status === SystemStatus.INFERENCING ? 'border-[#98FF98] text-[#98FF98]' :
            'border-[#E6E6FA] text-[#E6E6FA] opacity-50'
          }`}>
            STATUS: {status}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-[#98FF98]">
           <span className="hidden md:inline">SUBSTRATE_INTEGRITY_CHECK</span>
           <span>{timestamp}</span>
        </div>
      </header>

      {/* Main Content (Floating UI Layer) */}
      <main className="flex-grow relative z-30 p-6 flex flex-col pointer-events-none">
        {/* We use pointer-events-auto on children to allow interaction while letting clicks pass through to canvas elsewhere */}
        <div className="pointer-events-auto w-full h-full">
            {children}
        </div>
      </main>

      {/* HUD Footer */}
      <footer className="mt-auto border-t border-[rgba(152,255,152,0.1)] bg-[rgba(2,2,5,0.6)] backdrop-blur-md p-2 text-[10px] text-[#98FF98] flex justify-between z-40 uppercase tracking-widest pointer-events-auto">
        <div className="flex gap-4">
            <span>Grid: ACTIVE</span>
            <span>Bio-Steel: WEAVING</span>
            <span>Entropy: FLUX</span>
        </div>
        <div>
            IADESS // REALITY_COMPILER_V1
        </div>
      </footer>
    </div>
  );
};