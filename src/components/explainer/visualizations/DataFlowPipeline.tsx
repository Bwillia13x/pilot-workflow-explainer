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
  hue: number;
  trail: { x: number; y: number }[];
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
          start: { x: w * 0.02, y: centerY },
          cp1: { x: w * 0.2, y: centerY - 60 },
          cp2: { x: w * 0.4, y: centerY + 40 },
          mid: { x: w * 0.5, y: centerY },
          cp3: { x: w * 0.6, y: centerY - 40 },
          cp4: { x: w * 0.8, y: centerY + 60 },
          end: { x: w * 0.98, y: centerY },
          color: 185,
        },
        // Upper branch
        {
          start: { x: w * 0.05, y: centerY - 70 },
          cp1: { x: w * 0.25, y: centerY - 120 },
          cp2: { x: w * 0.45, y: centerY - 50 },
          mid: { x: w * 0.52, y: centerY - 55 },
          cp3: { x: w * 0.62, y: centerY - 65 },
          cp4: { x: w * 0.82, y: centerY - 35 },
          end: { x: w * 0.95, y: centerY - 45 },
          color: 270,
        },
        // Lower branch
        {
          start: { x: w * 0.05, y: centerY + 70 },
          cp1: { x: w * 0.25, y: centerY + 120 },
          cp2: { x: w * 0.45, y: centerY + 50 },
          mid: { x: w * 0.52, y: centerY + 55 },
          cp3: { x: w * 0.62, y: centerY + 65 },
          cp4: { x: w * 0.82, y: centerY + 35 },
          end: { x: w * 0.95, y: centerY + 45 },
          color: 270,
        },
      ];
    };

    // Initialize particles with trails
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < 40; i++) {
        const pathIndex = i < 20 ? 0 : (i < 30 ? 1 : 2);
        particlesRef.current.push({
          x: 0,
          y: 0,
          progress: Math.random(),
          speed: 0.003 + Math.random() * 0.004,
          size: 3 + Math.random() * 5,
          pathIndex,
          opacity: 0.6 + Math.random() * 0.4,
          hue: pathIndex === 0 ? 185 : 270,
          trail: [],
        });
      }
    };

    initParticles();

    // Get point on bezier curve
    const getPointOnPath = (path: ReturnType<typeof getPaths>[0], t: number) => {
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

      // Draw flow paths with glowing effect
      paths.forEach((path, index) => {
        // Outer glow
        ctx.beginPath();
        ctx.moveTo(path.start.x, path.start.y);
        ctx.bezierCurveTo(path.cp1.x, path.cp1.y, path.cp2.x, path.cp2.y, path.mid.x, path.mid.y);
        ctx.bezierCurveTo(path.cp3.x, path.cp3.y, path.cp4.x, path.cp4.y, path.end.x, path.end.y);
        
        ctx.strokeStyle = `hsla(${path.color}, 40%, 55%, 0.1)`;
        ctx.lineWidth = 12;
        ctx.stroke();

        // Main path
        const gradient = ctx.createLinearGradient(path.start.x, 0, path.end.x, 0);
        gradient.addColorStop(0, `hsla(${path.color}, 35%, 55%, 0.1)`);
        gradient.addColorStop(0.3, `hsla(${path.color}, 50%, 50%, 0.35)`);
        gradient.addColorStop(0.7, `hsla(${path.color}, 50%, 50%, 0.35)`);
        gradient.addColorStop(1, `hsla(${path.color}, 35%, 55%, 0.1)`);
        
        ctx.beginPath();
        ctx.moveTo(path.start.x, path.start.y);
        ctx.bezierCurveTo(path.cp1.x, path.cp1.y, path.cp2.x, path.cp2.y, path.mid.x, path.mid.y);
        ctx.bezierCurveTo(path.cp3.x, path.cp3.y, path.cp4.x, path.cp4.y, path.end.x, path.end.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = index === 0 ? 4 : 2.5;
        ctx.stroke();
      });

      // Update and draw particles with trails
      particlesRef.current.forEach((particle) => {
        particle.progress += particle.speed;
        if (particle.progress > 1) {
          particle.progress = 0;
          particle.trail = [];
          particle.size = 3 + Math.random() * 5;
        }

        const path = paths[particle.pathIndex];
        const pos = getPointOnPath(path, particle.progress);
        
        // Update trail
        particle.trail.unshift({ x: pos.x, y: pos.y });
        if (particle.trail.length > 12) {
          particle.trail.pop();
        }
        
        particle.x = pos.x;
        particle.y = pos.y;

        // Draw trail
        if (particle.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(particle.trail[0].x, particle.trail[0].y);
          for (let i = 1; i < particle.trail.length; i++) {
            ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
          }
          const trailGradient = ctx.createLinearGradient(
            particle.trail[0].x, particle.trail[0].y,
            particle.trail[particle.trail.length - 1].x, particle.trail[particle.trail.length - 1].y
          );
          trailGradient.addColorStop(0, `hsla(${particle.hue}, 65%, 60%, ${particle.opacity * 0.6})`);
          trailGradient.addColorStop(1, `hsla(${particle.hue}, 65%, 60%, 0)`);
          ctx.strokeStyle = trailGradient;
          ctx.lineWidth = particle.size * 0.6;
          ctx.lineCap = 'round';
          ctx.stroke();
        }

        // Particle glow
        const glowGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3
        );
        glowGradient.addColorStop(0, `hsla(${particle.hue}, 65%, 60%, ${particle.opacity * 0.7})`);
        glowGradient.addColorStop(1, `hsla(${particle.hue}, 65%, 60%, 0)`);
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();

        // Particle core
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        const coreGradient = ctx.createRadialGradient(
          particle.x - particle.size * 0.3, particle.y - particle.size * 0.3, 0,
          particle.x, particle.y, particle.size
        );
        coreGradient.addColorStop(0, `hsla(${particle.hue}, 70%, 75%, ${particle.opacity})`);
        coreGradient.addColorStop(1, `hsla(${particle.hue}, 65%, 55%, ${particle.opacity})`);
        ctx.fillStyle = coreGradient;
        ctx.fill();
      });

      // Draw processing nodes with enhanced effects
      const nodes = [
        { x: rect.width * 0.18, y: rect.height / 2, label: 'IN', hue: 270 },
        { x: rect.width * 0.5, y: rect.height / 2, label: 'AI', hue: 185 },
        { x: rect.width * 0.82, y: rect.height / 2, label: 'OUT', hue: 270 },
      ];

      nodes.forEach((node, i) => {
        const pulseScale = 1 + Math.sin(timeRef.current * 2.5 + i * 1.2) * 0.12;
        const nodeRadius = 24;

        // Outer glow
        const outerGlow = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, nodeRadius * 3 * pulseScale
        );
        outerGlow.addColorStop(0, `hsla(${node.hue}, 45%, 55%, 0.3)`);
        outerGlow.addColorStop(0.5, `hsla(${node.hue}, 45%, 55%, 0.1)`);
        outerGlow.addColorStop(1, `hsla(${node.hue}, 45%, 55%, 0)`);
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius * 3 * pulseScale, 0, Math.PI * 2);
        ctx.fillStyle = outerGlow;
        ctx.fill();

        // Inner glow ring
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius * 1.5, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${node.hue}, 50%, 60%, 0.3)`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Node body
        const nodeGradient = ctx.createRadialGradient(
          node.x - nodeRadius * 0.3, node.y - nodeRadius * 0.3, 0,
          node.x, node.y, nodeRadius
        );
        nodeGradient.addColorStop(0, `hsla(${node.hue}, 55%, 65%, 1)`);
        nodeGradient.addColorStop(1, `hsla(${node.hue}, 50%, 45%, 1)`);
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = nodeGradient;
        ctx.fill();

        // Node border
        ctx.strokeStyle = `hsla(${node.hue}, 60%, 70%, 1)`;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Shine
        ctx.beginPath();
        ctx.arc(node.x - nodeRadius * 0.35, node.y - nodeRadius * 0.35, nodeRadius * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = 'hsla(0, 0%, 100%, 0.5)';
        ctx.fill();

        // Label
        ctx.fillStyle = 'hsla(0, 0%, 100%, 1)';
        ctx.font = 'bold 11px Inter, system-ui, sans-serif';
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
