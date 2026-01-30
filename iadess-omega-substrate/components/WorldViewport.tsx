import React, { useRef, useEffect, memo } from 'react';
import { WorldEntity } from '../types';

interface WorldViewportProps {
  coherence: number;
  entities: WorldEntity[];
  onInteract?: (id: number) => void;
}

const WorldViewport: React.FC<WorldViewportProps> = ({ coherence, entities, onInteract }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Data Refs (These hold latest state without triggering re-renders of the loop)
  const coherenceRef = useRef(coherence);
  const entitiesRef = useRef(entities);

  // Camera & Input State
  const cameraRef = useRef({ x: 0, y: 0, z: 0, yaw: 0, pitch: 0 });
  const keysRef = useRef<{ [key: string]: boolean }>({});
  
  // Shards State (Persistent Debris)
  const shardsRef = useRef<Array<{x: number, y: number, z: number, size: number, speed: number, angle: number}>>([]);
  const initializedRef = useRef(false);

  // Sync Props to Refs
  useEffect(() => { coherenceRef.current = coherence; }, [coherence]);
  useEffect(() => { entitiesRef.current = entities; }, [entities]);

  // One-time Initialization
  useEffect(() => {
    if (!initializedRef.current) {
        for(let i=0; i<80; i++) { // Reduced count for stability
            shardsRef.current.push({
                x: (Math.random() - 0.5) * 2000,
                y: (Math.random() - 0.5) * 2000,
                z: Math.random() * 1000,
                size: Math.random() * 4 + 1,
                speed: (Math.random() - 0.5) * 0.2,
                angle: Math.random() * Math.PI * 2
            });
        }
        initializedRef.current = true;
    }
  }, []);

  // Input Listeners
  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => { keysRef.current[e.key.toLowerCase()] = true; };
    const handleUp = (e: KeyboardEvent) => { keysRef.current[e.key.toLowerCase()] = false; };
    
    // Use passive listeners for better performance
    window.addEventListener('keydown', handleDown, { passive: true });
    window.addEventListener('keyup', handleUp, { passive: true });
    
    return () => {
        window.removeEventListener('keydown', handleDown);
        window.removeEventListener('keyup', handleUp);
    };
  }, []);

  // The Main Render Loop (Runs once, never restarts)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true }); // optimize for high-freq updates
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const render = () => {
        time++;
        const currentCoherence = coherenceRef.current;
        const currentEntities = entitiesRef.current;

        // 1. Handle Camera Movement
        const speed = 2.5;
        if (keysRef.current['w']) cameraRef.current.z += speed;
        if (keysRef.current['s']) cameraRef.current.z -= speed;
        if (keysRef.current['a']) cameraRef.current.x -= speed;
        if (keysRef.current['d']) cameraRef.current.x += speed;
        
        // 2. Clear & Background
        // Only resize if dimensions changed to avoid thrashing
        if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        const w = canvas.width;
        const h = canvas.height;
        const cx = w / 2;
        const cy = h / 2;

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, w);
        grad.addColorStop(0, '#000000');
        grad.addColorStop(0.4, '#0a0a12');
        grad.addColorStop(1, '#020205');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // 3. Render Shards
        shardsRef.current.forEach(shard => {
            shard.angle += 0.005;
            const relZ = shard.z - cameraRef.current.z;
            const effectiveZ = (relZ + 5000) % 1000;
            
            if (effectiveZ > 10) {
                const scale = 500 / effectiveZ;
                const sx = cx + (shard.x - cameraRef.current.x) * scale;
                const sy = cy + (shard.y - cameraRef.current.y) * scale;
                
                // Culling
                if (sx < -50 || sx > w + 50 || sy < -50 || sy > h + 50) return;

                const alpha = Math.min(1, scale);
                ctx.fillStyle = `rgba(230, 230, 250, ${alpha * 0.3})`;
                
                ctx.save();
                ctx.translate(sx, sy);
                ctx.rotate(shard.angle);
                const size = shard.size * scale;
                ctx.fillRect(-size, -size, size * 2, size * 2);
                ctx.restore();
            }
        });

        // 4. Render Floor Grid
        if (currentCoherence > 15) {
            ctx.strokeStyle = `rgba(152, 255, 152, ${currentCoherence * 0.003})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            
            const gridSpacing = 100;
            const offsetZ = cameraRef.current.z % gridSpacing;
            
            for(let i=0; i<20; i++) {
                const z = (i * gridSpacing) - offsetZ;
                if(z < 10) continue;
                const scale = 500 / z;
                const y = cy + 200 * scale;
                
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
            }
            ctx.stroke();
        }

        // 5. Render Entities
        currentEntities.forEach(entity => {
            const relX = entity.x - cameraRef.current.x;
            const relZ = entity.z - cameraRef.current.z;
            const effectiveZ = relZ; // Entities don't loop
            
            if (effectiveZ > 10) {
                const scale = 500 / effectiveZ;
                const sx = cx + relX * scale;
                const sy = cy + (entity.y + Math.sin(time * 0.05 + entity.id) * 10) * scale;
                
                // Culling
                if (sx < -100 || sx > w + 100 || sy < -100 || sy > h + 100) return;

                const size = 50 * scale;

                ctx.lineWidth = 2;
                ctx.strokeStyle = entity.color;
                ctx.fillStyle = entity.color.replace('rgb', 'rgba').replace(')', ', 0.15)');

                // Glitch Calculation
                const glitchChance = Math.max(0, 1 - (currentCoherence / 100) - entity.integrity);
                const isGlitching = Math.random() < glitchChance;
                const glitchOffset = isGlitching ? (Math.random() - 0.5) * 20 * scale : 0;

                ctx.save();
                ctx.translate(sx + glitchOffset, sy);
                ctx.rotate(time * 0.02);

                ctx.beginPath();
                if (entity.type === 'CUBE') {
                    ctx.rect(-size, -size, size*2, size*2);
                } else if (entity.type === 'SPHERE') {
                    ctx.arc(0, 0, size, 0, Math.PI * 2);
                } else if (entity.type === 'PRISM') {
                    ctx.moveTo(0, -size);
                    ctx.lineTo(size, size);
                    ctx.lineTo(-size, size);
                    ctx.closePath();
                }
                
                ctx.fill();
                ctx.stroke();
                ctx.restore();
            }
        });

        // 6. Void Leak Overlay (Optimized)
        if (currentCoherence < 30) {
            const leakSize = 100 + Math.sin(time * 0.1) * 20;
            // Simplified effect for performance
            ctx.save();
            ctx.globalCompositeOperation = 'difference';
            ctx.fillStyle = '#111';
            ctx.beginPath();
            ctx.arc(cx, cy, leakSize, 0, Math.PI*2);
            ctx.fill();
            ctx.restore();
        }

        animId = requestAnimationFrame(render);
    };
    
    // Start loop
    animId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animId);
  }, []); // Empty dependency array ensures loop runs continuously without restarting

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 bg-black block" />;
};

export default memo(WorldViewport);