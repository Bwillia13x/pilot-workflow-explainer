import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface FlowingWavesProps {
  isActive: boolean;
  variant?: 'chaos' | 'order';
  className?: string;
}

interface WavePoint {
  x: number;
  y: number;
  baseY: number;
  speed: number;
  amplitude: number;
  phase: number;
}

export const FlowingWaves = ({ isActive, variant = 'chaos', className }: FlowingWavesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const wavesRef = useRef<WavePoint[][]>([]);
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

    // Initialize wave lines
    const numLines = variant === 'chaos' ? 8 : 5;
    const pointsPerLine = 80;
    const rect = canvas.getBoundingClientRect();

    wavesRef.current = Array.from({ length: numLines }, (_, lineIndex) => {
      const baseY = (rect.height / (numLines + 1)) * (lineIndex + 1);
      return Array.from({ length: pointsPerLine }, (_, i) => ({
        x: (rect.width / (pointsPerLine - 1)) * i,
        y: baseY,
        baseY,
        speed: variant === 'chaos' 
          ? 0.02 + Math.random() * 0.03 
          : 0.015 + lineIndex * 0.002,
        amplitude: variant === 'chaos'
          ? 15 + Math.random() * 25
          : 8 + lineIndex * 2,
        phase: variant === 'chaos'
          ? Math.random() * Math.PI * 2
          : lineIndex * 0.5,
      }));
    });

    const colors = variant === 'chaos'
      ? ['hsla(270, 30%, 55%, 0.4)', 'hsla(185, 60%, 45%, 0.3)', 'hsla(270, 40%, 65%, 0.35)', 
         'hsla(185, 50%, 55%, 0.25)', 'hsla(260, 30%, 60%, 0.3)', 'hsla(190, 45%, 50%, 0.25)',
         'hsla(275, 35%, 58%, 0.3)', 'hsla(180, 55%, 48%, 0.25)']
      : ['hsla(185, 60%, 45%, 0.5)', 'hsla(185, 55%, 50%, 0.4)', 'hsla(185, 50%, 55%, 0.35)',
         'hsla(185, 45%, 60%, 0.3)', 'hsla(185, 40%, 65%, 0.25)'];

    const animate = () => {
      if (!isActive) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      timeRef.current += 0.016;

      wavesRef.current.forEach((line, lineIndex) => {
        ctx.beginPath();
        ctx.strokeStyle = colors[lineIndex % colors.length];
        ctx.lineWidth = variant === 'chaos' ? 1.5 : 2;

        line.forEach((point, i) => {
          // Update y position with wave motion
          const waveOffset = variant === 'chaos'
            ? Math.sin(timeRef.current * point.speed * 60 + i * 0.1 + point.phase) * point.amplitude
              + Math.sin(timeRef.current * point.speed * 30 + i * 0.05) * point.amplitude * 0.5
            : Math.sin(timeRef.current * point.speed * 60 + i * 0.08 + point.phase) * point.amplitude;

          point.y = point.baseY + waveOffset;

          if (i === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            // Smooth curve
            const prevPoint = line[i - 1];
            const cpX = (prevPoint.x + point.x) / 2;
            ctx.quadraticCurveTo(prevPoint.x, prevPoint.y, cpX, (prevPoint.y + point.y) / 2);
          }
        });

        ctx.stroke();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, variant]);

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
