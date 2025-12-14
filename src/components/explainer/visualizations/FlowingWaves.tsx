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
    const numLines = variant === 'chaos' ? 12 : 6;
    const pointsPerLine = 100;
    const rect = canvas.getBoundingClientRect();

    wavesRef.current = Array.from({ length: numLines }, (_, lineIndex) => {
      const baseY = (rect.height / (numLines + 1)) * (lineIndex + 1);
      return Array.from({ length: pointsPerLine }, (_, i) => ({
        x: (rect.width / (pointsPerLine - 1)) * i,
        y: baseY,
        baseY,
        speed: variant === 'chaos' 
          ? 0.015 + Math.random() * 0.025 
          : 0.012 + lineIndex * 0.002,
        amplitude: variant === 'chaos'
          ? 12 + Math.random() * 22
          : 6 + lineIndex * 2,
        phase: variant === 'chaos'
          ? Math.random() * Math.PI * 2
          : lineIndex * 0.4,
      }));
    });

    const animate = () => {
      if (!isActive) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      timeRef.current += 0.012;

      wavesRef.current.forEach((line, lineIndex) => {
        // Calculate wave colors with gradients
        const hue = variant === 'chaos' 
          ? (lineIndex % 2 === 0 ? 270 : 185) 
          : 185;
        const saturation = variant === 'chaos' ? 35 + lineIndex * 3 : 55 - lineIndex * 5;
        const lightness = variant === 'chaos' ? 50 + lineIndex * 2 : 48 + lineIndex * 3;
        const alpha = variant === 'chaos' ? 0.25 - lineIndex * 0.015 : 0.4 - lineIndex * 0.05;

        // Create gradient along path
        const gradient = ctx.createLinearGradient(0, 0, rect.width, 0);
        gradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha * 0.3})`);
        gradient.addColorStop(0.3, `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`);
        gradient.addColorStop(0.7, `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`);
        gradient.addColorStop(1, `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha * 0.3})`);

        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = variant === 'chaos' ? 1.5 + Math.sin(timeRef.current + lineIndex) * 0.5 : 2.5;
        ctx.lineCap = 'round';

        line.forEach((point, i) => {
          // Update y position with layered wave motion
          const waveOffset = variant === 'chaos'
            ? Math.sin(timeRef.current * point.speed * 50 + i * 0.08 + point.phase) * point.amplitude
              + Math.sin(timeRef.current * point.speed * 25 + i * 0.04) * point.amplitude * 0.4
              + Math.sin(timeRef.current * point.speed * 80 + i * 0.15) * point.amplitude * 0.2
            : Math.sin(timeRef.current * point.speed * 45 + i * 0.06 + point.phase) * point.amplitude
              + Math.sin(timeRef.current * point.speed * 20 + i * 0.03) * point.amplitude * 0.3;

          point.y = point.baseY + waveOffset;

          if (i === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            // Smooth curve with bezier
            const prevPoint = line[i - 1];
            const cpX = (prevPoint.x + point.x) / 2;
            const cpY = (prevPoint.y + point.y) / 2;
            ctx.quadraticCurveTo(prevPoint.x, prevPoint.y, cpX, cpY);
          }
        });

        ctx.stroke();

        // Add subtle glow effect on some waves
        if (lineIndex % 3 === 0) {
          ctx.save();
          ctx.filter = 'blur(8px)';
          ctx.globalAlpha = 0.3;
          ctx.strokeStyle = `hsla(${hue}, ${saturation + 10}%, ${lightness + 10}%, ${alpha * 0.5})`;
          ctx.lineWidth = 4;
          ctx.stroke();
          ctx.restore();
        }
      });

      // Add floating particles along waves
      const particleCount = variant === 'chaos' ? 20 : 10;
      for (let i = 0; i < particleCount; i++) {
        const wave = wavesRef.current[i % wavesRef.current.length];
        const pointIndex = Math.floor((timeRef.current * 10 + i * 10) % wave.length);
        const point = wave[pointIndex];
        
        if (point) {
          const pulseScale = 1 + Math.sin(timeRef.current * 3 + i) * 0.3;
          const particleAlpha = 0.4 + Math.sin(timeRef.current * 2 + i * 0.5) * 0.2;
          
          // Particle glow
          const particleGlow = ctx.createRadialGradient(
            point.x, point.y, 0,
            point.x, point.y, 6 * pulseScale
          );
          const particleHue = variant === 'chaos' ? (i % 2 === 0 ? 270 : 185) : 185;
          particleGlow.addColorStop(0, `hsla(${particleHue}, 60%, 60%, ${particleAlpha})`);
          particleGlow.addColorStop(1, `hsla(${particleHue}, 60%, 60%, 0)`);
          
          ctx.beginPath();
          ctx.arc(point.x, point.y, 6 * pulseScale, 0, Math.PI * 2);
          ctx.fillStyle = particleGlow;
          ctx.fill();
          
          // Particle core
          ctx.beginPath();
          ctx.arc(point.x, point.y, 2 * pulseScale, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${particleHue}, 65%, 65%, ${particleAlpha + 0.2})`;
          ctx.fill();
        }
      }

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
