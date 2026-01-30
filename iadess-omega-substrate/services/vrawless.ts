import { PipelineResult, MistakeLogEntry, WorldEntity } from '../types';

class VRAWLESS {
  mistake_log: MistakeLogEntry[] = [];

  predict_outcome(text: string): string {
    const lowerText = text.toLowerCase();
    if (lowerText.includes("cube") || lowerText.includes("box")) return "Constructing Geometric Solid [HEX_01]";
    if (lowerText.includes("sphere") || lowerText.includes("orb")) return "Weaving Bio-Steel Curvature [RAD_99]";
    if (lowerText.includes("prism") || lowerText.includes("pyramid")) return "Aligning Refractive Index [TRI_33]";
    if (lowerText.includes("shatter") || lowerText.includes("break")) return "Initiating Controlled Collapse";
    return "Analyzing Entropy Vector...";
  }

  evaluate_prediction(actual: string, predicted: string): void {
    if (actual !== predicted) {
      this.mistake_log.push({ input: actual, predicted: predicted });
    }
  }

  understand(text: string): string {
    const predicted = this.predict_outcome(text);
    return `[VRAWLESS] Protocol: ${predicted}`;
  }
}

const vrawlessInstance = new VRAWLESS();

export const noteTaker = (text: string): string => {
  if (!text) return "";
  const words = text.split(" ").filter(w => w.length > 3);
  return words.slice(0, 5).join("_").toUpperCase();
};

export const fixer = (text: string): string => {
  if (!text) return "";
  return text.replace(/_/g, "::"); 
};

export const builder = (text: string): WorldEntity | null => {
  if (!text) return null;
  const lower = text.toLowerCase();
  
  // Use a deterministic pseudo-random offset based on timestamp to avoid stacking
  const offset = (Date.now() % 1000) - 500; 

  if (lower.includes("cube") || lower.includes("box")) {
    return {
      id: Date.now(),
      type: 'CUBE',
      x: (Math.random() - 0.5) * 600,
      y: 0,
      z: 500 + Math.random() * 200,
      color: '#E6E6FA', // Lavender
      integrity: 0.1
    };
  }
  if (lower.includes("sphere") || lower.includes("orb") || lower.includes("core")) {
    return {
      id: Date.now(),
      type: 'SPHERE',
      x: (Math.random() - 0.5) * 600,
      y: -50,
      z: 500 + Math.random() * 200,
      color: '#98FF98', // Mint
      integrity: 0.1
    };
  }
  if (lower.includes("prism") || lower.includes("pyramid")) {
    return {
      id: Date.now(),
      type: 'PRISM',
      x: (Math.random() - 0.5) * 600,
      y: 50,
      z: 500 + Math.random() * 200,
      color: '#FFD700', // Gold
      integrity: 0.1
    };
  }
  return null;
};

export const understander = (text: string): string => {
  return vrawlessInstance.understand(text);
};

export const runRoles = (text: string): PipelineResult => {
  const summary = noteTaker(text);
  const fixed = fixer(summary);
  const entity = builder(text); 
  const built = entity ? `MANIFEST_SUCCESS: [${entity.type}]` : "NO_GEOMETRY_DETECTED";
  const analysis = understander(text);

  return {
    summary,
    fixed_notes: fixed,
    built_content: built,
    analysis,
    vrawless_mistakes: [...vrawlessInstance.mistake_log],
    manifestation_trigger: entity
  };
};