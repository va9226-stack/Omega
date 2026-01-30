export interface MistakeLogEntry {
  input: string;
  predicted: string;
}

export interface WorldEntity {
  id: number;
  type: 'CUBE' | 'SPHERE' | 'PRISM' | 'SHARD';
  x: number;
  y: number; // Height relative to horizon
  z: number; // Depth
  color: string;
  integrity: number; // 0-1, determines glitch effect
}

export interface PipelineResult {
  summary: string;
  fixed_notes: string;
  built_content: string;
  analysis: string;
  vrawless_mistakes: MistakeLogEntry[];
  manifestation_trigger?: WorldEntity | null; // The link between Text and World
}

export interface ModelConfig {
  vocabSize: number;
  dimensions: number;
  blockSize: number;
  batchSize: number;
  lr: number;
  epochs: number;
}

export enum SystemStatus {
  IDLE = 'IDLE',
  TRAINING = 'TRAINING',
  INFERENCING = 'COMPILING', // Renamed for thematic fit
  STABLE = 'STABLE_REF'
}
