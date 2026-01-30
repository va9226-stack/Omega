import React from 'react';
import { PipelineResult } from '../types';
import { ArrowRight, Bot, PenTool, Hammer, BrainCircuit } from 'lucide-react';

interface PipelineViewProps {
  result: PipelineResult | null;
}

const StepCard: React.FC<{ title: string; content: string; icon: React.ReactNode; delay: string }> = ({ title, content, icon, delay }) => (
  <div className={`border border-[#005f11] bg-[#001000] p-3 flex flex-col gap-2 transition-all duration-500 hover:border-[#00ff41] hover:shadow-[0_0_10px_rgba(0,255,65,0.2)] animate-in fade-in slide-in-from-bottom-4`} style={{ animationDelay: delay }}>
    <div className="flex items-center gap-2 text-[#00ff41] font-bold text-xs uppercase border-b border-[#003b00] pb-1">
      {icon}
      <span>{title}</span>
    </div>
    <div className="text-sm text-gray-300 font-mono break-words whitespace-pre-wrap leading-relaxed">
      {content || <span className="text-[#003b00] italic">// Waiting for input...</span>}
    </div>
  </div>
);

export const PipelineView: React.FC<PipelineViewProps> = ({ result }) => {
  if (!result) return null;

  return (
    <div className="mt-8 space-y-4">
      <h3 className="text-[#00ff41] uppercase tracking-wider font-bold text-sm border-l-4 border-[#00ff41] pl-3">VRAWLESS Logic Pipeline</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StepCard 
          title="Note Taker" 
          content={result.summary} 
          icon={<PenTool size={14} />} 
          delay="0ms"
        />
        
        <div className="hidden lg:flex items-center justify-center text-[#003b00]">
          <ArrowRight size={20} />
        </div>

        <StepCard 
          title="Fixer" 
          content={result.fixed_notes} 
          icon={<Hammer size={14} />} 
          delay="100ms"
        />
        
        <div className="hidden lg:flex items-center justify-center text-[#003b00]">
            <ArrowRight size={20} />
        </div>

        <StepCard 
          title="Builder" 
          content={result.built_content} 
          icon={<Bot size={14} />} 
          delay="200ms"
        />

        <div className="hidden lg:flex items-center justify-center text-[#003b00]">
            <ArrowRight size={20} />
        </div>

        <StepCard 
          title="Understander" 
          content={result.analysis} 
          icon={<BrainCircuit size={14} />} 
          delay="300ms"
        />
      </div>

      {result.vrawless_mistakes.length > 0 && (
        <div className="mt-4 border border-red-900 bg-red-950/20 p-4">
           <h4 className="text-red-500 font-bold uppercase text-xs mb-2">Mistake Log Detected</h4>
           <pre className="text-red-400 text-xs">{JSON.stringify(result.vrawless_mistakes, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};