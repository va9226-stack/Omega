import React from 'react';
import { ModelConfig } from '../types';
import { Cpu, Layers, Activity } from 'lucide-react';

interface ModelStatsProps {
  config: ModelConfig;
  loss: number | null;
}

export const ModelStats: React.FC<ModelStatsProps> = ({ config, loss }) => {
  return (
    <div className="border-2 border-[#003b00] bg-[#000a00] p-4 shadow-[0_0_20px_#003b00] mb-6">
      <div className="flex items-center gap-2 mb-4 text-[#00ff41] border-b border-[#003b00] pb-2">
        <Cpu size={18} />
        <h2 className="uppercase font-bold tracking-wider">Substrate Architecture [OmegaDahlDuel]</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        <div className="space-y-1">
          <div className="text-[#008f11]">VOCAB_SIZE</div>
          <div className="text-white font-mono">{config.vocabSize}</div>
        </div>
        <div className="space-y-1">
          <div className="text-[#008f11]">DIMENSIONS</div>
          <div className="text-white font-mono">{config.dimensions}</div>
        </div>
        <div className="space-y-1">
          <div className="text-[#008f11]">BLOCK_SIZE</div>
          <div className="text-white font-mono">{config.blockSize}</div>
        </div>
        <div className="space-y-1">
          <div className="text-[#008f11]">BATCH_SIZE</div>
          <div className="text-white font-mono">{config.batchSize}</div>
        </div>
        <div className="space-y-1">
          <div className="text-[#008f11]">LAYERS</div>
          <div className="text-white font-mono">6 (Transformer)</div>
        </div>
        <div className="space-y-1">
          <div className="text-[#008f11]">CURRENT LOSS</div>
          <div className={`font-mono font-bold ${loss !== null && loss < 0.5 ? 'text-[#00ff41]' : 'text-yellow-500'}`}>
            {loss !== null ? loss.toFixed(4) : 'N/A'}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-[#003b00] flex items-center justify-between text-xs text-[#008f11]">
         <div className="flex gap-2 items-center">
            <Layers size={14} />
            <span>Embedding &gt; PosEnc &gt; Transformer(x6) &gt; LayerNorm</span>
         </div>
         <Activity size={14} className={loss !== null ? "animate-pulse" : "opacity-50"} />
      </div>
    </div>
  );
};