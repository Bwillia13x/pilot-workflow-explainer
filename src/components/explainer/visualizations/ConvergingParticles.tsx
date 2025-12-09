import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ConvergingParticlesProps {
  isActive: boolean;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
  delay: number;
}

export const ConvergingParticles = ({ isActive, className }: ConvergingParticlesProps) => {
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
    const centerX = rect.width / 2;
    const centerY = rect.height * 0.4;

    // Initialize particles spreading from edges
    particlesRef.current = Array.from({ length: 60 }, (_, i) => {
      const angle = (i / 60) * Math.PI * 2;
      const distance = Math.max(rect.width, rect.height) * 0.8;
      return {
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance * 0.6,
        targetX: centerX + (Math.random() - 0.5) * 100,
        targetY: centerY + (Math.random() - 0.5) * 60,
        vx: 0,
        vy: 0,
        size: 2 + Math.random() * 4,
        opacity: 0.4 + Math.random() * 0.6,
        hue: Math.random() > 0.5 ? 270 : 185, // Lavender or teal
        delay: Math.random() * 2,
      };
    });

    const animate = () => {
      if (!isActive) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      timeRef.current += 0.016;

      // Draw central glow
      const pulseScale = 1 + Math.sin(timeRef.current * 2) * 0.1;
      const centerGlow = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, 120 * pulseScale
      );
      centerGlow.addColorStop(0, 'hsla(270, 35%, 55%, 0.15)');
      centerGlow.addColorStop(0.5, 'hsla(185, 50%, 50%, 0.08)');
      centerGlow.addColorStop(1, 'hsla(270, 35%, 55%, 0)');
      ctx.beginPath();
      ctx.arc(centerX, centerY, 120 * pulseScale, 0, Math.PI * 2);
      ctx.fillStyle = centerGlow;
      ctx.fill();

      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        // Wait for delay
        if (timeRef.current < particle.delay) return;

        // Spring physics towards target
        const dx = particle.targetX - particle.x;
        const dy = particle.targetY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 5) {
          particle.vx += dx * 0.008;
          particle.vy += dy * 0.008;
        }

        // Add orbital motion near center
        if (distance < 150) {
          const angle = Math.atan2(particle.y - centerY, particle.x - centerX);
          particle.vx += Math.cos(angle + Math.PI / 2) * 0.3;
          particle.vy += Math.sin(angle + Math.PI / 2) * 0.3;
        }

        // Damping
        particle.vx *= 0.96;
        particle.vy *= 0.96;

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Draw trail
        if (distance > 50) {
          const trailLength = Math.min(distance * 0.3, 30);
          const trailGradient = ctx.createLinearGradient(
            particle.x, particle.y,
            particle.x - particle.vx * trailLength,
            particle.y - particle.vy * trailLength
          );
          trailGradient.addColorStop(0, `hsla(${particle.hue}, 50%, 55%, ${particle.opacity * 0.5})`);
          trailGradient.addColorStop(1, `hsla(${particle.hue}, 50%, 55%, 0)`);
          
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(
            particle.x - particle.vx * trailLength,
            particle.y - particle.vy * trailLength
          );
          ctx.strokeStyle = trailGradient;
          ctx.lineWidth = particle.size * 0.5;
          ctx.stroke();
        }

        // Draw particle glow
        const glowGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2
        );
        glowGradient.addColorStop(0, `hsla(${particle.hue}, 55%, 55%, ${particle.opacity * 0.6})`);
        glowGradient.addColorStop(1, `hsla(${particle.hue}, 55%, 55%, 0)`);
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();

        // Draw particle core
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${particle.hue}, 60%, 60%, ${particle.opacity})`;
        ctx.fill();

        // Draw connections between nearby particles
        particlesRef.current.slice(index + 1).forEach((other) => {
          const odx = particle.x - other.x;
          const ody = particle.y - other.y;
          const odist = Math.sqrt(odx * odx + ody * ody);

          if (odist < 60) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `hsla(270, 30%, 60%, ${0.15 * (1 - odist / 60)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      // Central focus point
      ctx.beginPath();
      ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'hsla(270, 35%, 55%, 0.8)';
      ctx.fill();
      ctx.strokeStyle = 'hsla(270, 30%, 65%, 1)';
      ctx.lineWidth = 2;
      ctx.stroke();

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
