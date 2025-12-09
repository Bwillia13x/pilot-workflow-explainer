import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface DataFlowPipelineProps {
  isActive: boolean;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  progress: number;
  speed: number;
  size: number;
  pathIndex: number;
  opacity: number;
}

export const DataFlowPipeline = ({ isActive, className }: DataFlowPipelineProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    resizeCanvas();
    const rect = canvas.getBoundingClientRect();

    // Define pipeline paths (bezier curves)
    const getPaths = () => {
      const w = rect.width;
      const h = rect.height;
      const centerY = h / 2;
      
      return [
        // Main flow path
        {
          start: { x: w * 0.05, y: centerY },
          cp1: { x: w * 0.25, y: centerY - 50 },
          cp2: { x: w * 0.45, y: centerY + 30 },
          mid: { x: w * 0.5, y: centerY },
          cp3: { x: w * 0.55, y: centerY - 30 },
          cp4: { x: w * 0.75, y: centerY + 50 },
          end: { x: w * 0.95, y: centerY },
        },
        // Upper branch
        {
          start: { x: w * 0.1, y: centerY - 60 },
          cp1: { x: w * 0.3, y: centerY - 100 },
          cp2: { x: w * 0.5, y: centerY - 40 },
          mid: { x: w * 0.55, y: centerY - 50 },
          cp3: { x: w * 0.65, y: centerY - 60 },
          cp4: { x: w * 0.8, y: centerY - 30 },
          end: { x: w * 0.9, y: centerY - 40 },
        },
        // Lower branch
        {
          start: { x: w * 0.1, y: centerY + 60 },
          cp1: { x: w * 0.3, y: centerY + 100 },
          cp2: { x: w * 0.5, y: centerY + 40 },
          mid: { x: w * 0.55, y: centerY + 50 },
          cp3: { x: w * 0.65, y: centerY + 60 },
          cp4: { x: w * 0.8, y: centerY + 30 },
          end: { x: w * 0.9, y: centerY + 40 },
        },
      ];
    };

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < 30; i++) {
        particlesRef.current.push({
          x: 0,
          y: 0,
          progress: Math.random(),
          speed: 0.002 + Math.random() * 0.003,
          size: 3 + Math.random() * 4,
          pathIndex: Math.floor(Math.random() * 3),
          opacity: 0.6 + Math.random() * 0.4,
        });
      }
    };

    initParticles();

    // Get point on bezier curve
    const getPointOnPath = (path: ReturnType<typeof getPaths>[0], t: number) => {
      // Split into two cubic beziers
      if (t < 0.5) {
        const tt = t * 2;
        const t1 = 1 - tt;
        return {
          x: t1*t1*t1*path.start.x + 3*t1*t1*tt*path.cp1.x + 3*t1*tt*tt*path.cp2.x + tt*tt*tt*path.mid.x,
          y: t1*t1*t1*path.start.y + 3*t1*t1*tt*path.cp1.y + 3*t1*tt*tt*path.cp2.y + tt*tt*tt*path.mid.y,
        };
      } else {
        const tt = (t - 0.5) * 2;
        const t1 = 1 - tt;
        return {
          x: t1*t1*t1*path.mid.x + 3*t1*t1*tt*path.cp3.x + 3*t1*tt*tt*path.cp4.x + tt*tt*tt*path.end.x,
          y: t1*t1*t1*path.mid.y + 3*t1*t1*tt*path.cp3.y + 3*t1*tt*tt*path.cp4.y + tt*tt*tt*path.end.y,
        };
      }
    };

    const animate = () => {
      if (!isActive) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      timeRef.current += 0.016;

      const paths = getPaths();

      // Draw flow paths
      paths.forEach((path, index) => {
        ctx.beginPath();
        ctx.moveTo(path.start.x, path.start.y);
        ctx.bezierCurveTo(path.cp1.x, path.cp1.y, path.cp2.x, path.cp2.y, path.mid.x, path.mid.y);
        ctx.bezierCurveTo(path.cp3.x, path.cp3.y, path.cp4.x, path.cp4.y, path.end.x, path.end.y);
        
        const gradient = ctx.createLinearGradient(path.start.x, 0, path.end.x, 0);
        gradient.addColorStop(0, 'hsla(270, 30%, 55%, 0.15)');
        gradient.addColorStop(0.5, index === 0 ? 'hsla(185, 60%, 45%, 0.25)' : 'hsla(270, 35%, 60%, 0.2)');
        gradient.addColorStop(1, 'hsla(185, 60%, 45%, 0.15)');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = index === 0 ? 3 : 2;
        ctx.stroke();
      });

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        particle.progress += particle.speed;
        if (particle.progress > 1) {
          particle.progress = 0;
          particle.pathIndex = Math.floor(Math.random() * 3);
          particle.size = 3 + Math.random() * 4;
        }

        const path = paths[particle.pathIndex];
        const pos = getPointOnPath(path, particle.progress);
        particle.x = pos.x;
        particle.y = pos.y;

        // Particle glow
        const glowGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2.5
        );
        glowGradient.addColorStop(0, `hsla(185, 60%, 55%, ${particle.opacity * 0.6})`);
        glowGradient.addColorStop(1, 'hsla(185, 60%, 55%, 0)');
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();

        // Particle core
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(185, 60%, 60%, ${particle.opacity})`;
        ctx.fill();
      });

      // Draw processing nodes
      const nodes = [
        { x: rect.width * 0.2, y: rect.height / 2, label: 'IN' },
        { x: rect.width * 0.5, y: rect.height / 2, label: 'AI' },
        { x: rect.width * 0.8, y: rect.height / 2, label: 'OUT' },
      ];

      nodes.forEach((node, i) => {
        // Node glow
        const pulseScale = 1 + Math.sin(timeRef.current * 3 + i) * 0.1;
        const glowGradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, 35 * pulseScale
        );
        glowGradient.addColorStop(0, 'hsla(270, 30%, 55%, 0.3)');
        glowGradient.addColorStop(1, 'hsla(270, 30%, 55%, 0)');
        ctx.beginPath();
        ctx.arc(node.x, node.y, 35 * pulseScale, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = i === 1 ? 'hsla(185, 60%, 45%, 0.9)' : 'hsla(270, 30%, 55%, 0.8)';
        ctx.fill();
        ctx.strokeStyle = i === 1 ? 'hsla(185, 60%, 55%, 1)' : 'hsla(270, 25%, 65%, 1)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Node label
        ctx.fillStyle = 'white';
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.label, node.x, node.y);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive]);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "absolute inset-0 w-full h-full pointer-events-none",
        "transition-opacity duration-700",
        isActive ? "opacity-100" : "opacity-0",
        className
      )}
    />
  );
};
