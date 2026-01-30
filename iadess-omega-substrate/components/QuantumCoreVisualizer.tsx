import React, { useEffect, useRef } from 'react';

interface Shard {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  angle: number;
  spin: number;
  sides: number;
  color: string;
}

export const QuantumCoreVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const shards: Shard[] = [];
    const shardCount = 60;
    const colors = ['rgba(230, 230, 250, 0.6)', 'rgba(152, 255, 152, 0.5)', 'rgba(255, 215, 0, 0.4)'];

    // Initialize Shards (Debris)
    for (let i = 0; i < shardCount; i++) {
      shards.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 20 + 5,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.02,
        sides: Math.floor(Math.random() * 3) + 3,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const drawPolygon = (x: number, y: number, size: number, sides: number, angle: number) => {
      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const theta = angle + (i * 2 * Math.PI) / sides;
        const px = x + size * Math.cos(theta);
        const py = y + size * Math.sin(theta);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    };

    let time = 0;

    const render = () => {
      time++;
      ctx.fillStyle = '#020205'; // Void background
      ctx.fillRect(0, 0, width, height);

      // 1. The Void Leak (Center Vortex)
      const cx = width / 2;
      const cy = height / 2;
      const gradient = ctx.createRadialGradient(cx, cy, 50, cx, cy, 400);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
      gradient.addColorStop(0.5, 'rgba(20, 10, 30, 0.2)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Update & Draw Shards
      shards.forEach(shard => {
        shard.x += shard.vx;
        shard.y += shard.vy;
        shard.angle += shard.spin;

        // Wrap around
        if (shard.x < -50) shard.x = width + 50;
        if (shard.x > width + 50) shard.x = -50;
        if (shard.y < -50) shard.y = height + 50;
        if (shard.y > height + 50) shard.y = -50;

        // Gravitational Lensing effect (push away from center void slightly)
        const dx = shard.x - cx;
        const dy = shard.y - cy;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 150) {
            shard.x += dx * 0.01;
            shard.y += dy * 0.01;
        }

        ctx.strokeStyle = shard.color;
        ctx.lineWidth = 1;
        ctx.fillStyle = shard.color.replace('0.6', '0.1').replace('0.5', '0.1').replace('0.4', '0.1'); // Faint fill
        
        drawPolygon(shard.x, shard.y, shard.size, shard.sides, shard.angle);
        ctx.stroke();
        ctx.fill();

        // Cellular Automata Glitch (Random flickering squares on shards)
        if (Math.random() < 0.05) {
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(shard.x, shard.y, 4, 4);
        }
      });

      // 3. Spider Silk Connections (Bio-Steel)
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'; // Pearlescent faint
      
      for (let i = 0; i < shards.length; i++) {
        for (let j = i + 1; j < shards.length; j++) {
          const s1 = shards[i];
          const s2 = shards[j];
          const dx = s1.x - s2.x;
          const dy = s1.y - s2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(s2.x, s2.y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(render);
    };

    const animId = requestAnimationFrame(render);

    const handleResize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
};