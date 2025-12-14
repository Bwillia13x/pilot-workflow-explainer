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
  orbitRadius: number;
  orbitSpeed: number;
  orbitPhase: number;
  trail: { x: number; y: number }[];
}

interface OrbitRing {
  radius: number;
  speed: number;
  particles: number;
  phase: number;
}

export const ConvergingParticles = ({ isActive, className }: ConvergingParticlesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const orbitRingsRef = useRef<OrbitRing[]>([]);
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
    const centerY = rect.height * 0.38;

    // Initialize orbit rings
    orbitRingsRef.current = [
      { radius: 60, speed: 0.8, particles: 8, phase: 0 },
      { radius: 100, speed: -0.5, particles: 12, phase: Math.PI / 4 },
      { radius: 150, speed: 0.3, particles: 16, phase: Math.PI / 2 },
    ];

    // Initialize particles spreading from edges
    particlesRef.current = Array.from({ length: 80 }, (_, i) => {
      const angle = (i / 80) * Math.PI * 2;
      const distance = Math.max(rect.width, rect.height) * 0.9;
      const orbitIndex = i % 3;
      const ring = orbitRingsRef.current[orbitIndex];
      
      return {
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance * 0.6,
        targetX: centerX,
        targetY: centerY,
        vx: 0,
        vy: 0,
        size: 2 + Math.random() * 4,
        opacity: 0.3 + Math.random() * 0.7,
        hue: i % 3 === 0 ? 185 : 270,
        delay: Math.random() * 1.5,
        orbitRadius: ring.radius + (Math.random() - 0.5) * 30,
        orbitSpeed: ring.speed * (0.8 + Math.random() * 0.4),
        orbitPhase: (i / 80) * Math.PI * 2,
        trail: [],
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

      // Draw background radial gradients
      const bgGradient1 = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 200);
      bgGradient1.addColorStop(0, 'hsla(270, 40%, 55%, 0.08)');
      bgGradient1.addColorStop(0.5, 'hsla(185, 50%, 50%, 0.04)');
      bgGradient1.addColorStop(1, 'hsla(270, 40%, 55%, 0)');
      ctx.fillStyle = bgGradient1;
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Draw orbit rings
      orbitRingsRef.current.forEach((ring, ringIndex) => {
        const pulseScale = 1 + Math.sin(timeRef.current * 1.5 + ringIndex) * 0.05;
        
        // Ring glow
        ctx.beginPath();
        ctx.arc(centerX, centerY, ring.radius * pulseScale, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${ringIndex === 1 ? 185 : 270}, 40%, 55%, 0.15)`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Ring particles
        for (let i = 0; i < ring.particles; i++) {
          const angle = (i / ring.particles) * Math.PI * 2 + timeRef.current * ring.speed + ring.phase;
          const x = centerX + Math.cos(angle) * ring.radius * pulseScale;
          const y = centerY + Math.sin(angle) * ring.radius * pulseScale * 0.6;
          
          // Particle glow
          const particleGlow = ctx.createRadialGradient(x, y, 0, x, y, 8);
          particleGlow.addColorStop(0, `hsla(${ringIndex === 1 ? 185 : 270}, 55%, 60%, 0.6)`);
          particleGlow.addColorStop(1, `hsla(${ringIndex === 1 ? 185 : 270}, 55%, 60%, 0)`);
          ctx.beginPath();
          ctx.arc(x, y, 8, 0, Math.PI * 2);
          ctx.fillStyle = particleGlow;
          ctx.fill();

          // Particle core
          ctx.beginPath();
          ctx.arc(x, y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${ringIndex === 1 ? 185 : 270}, 60%, 65%, 0.9)`;
          ctx.fill();
        }
      });

      // Draw central glow with multiple layers
      const pulseScale = 1 + Math.sin(timeRef.current * 2) * 0.15;
      
      // Outer glow
      const outerGlow = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, 140 * pulseScale
      );
      outerGlow.addColorStop(0, 'hsla(270, 40%, 55%, 0.2)');
      outerGlow.addColorStop(0.4, 'hsla(185, 50%, 55%, 0.1)');
      outerGlow.addColorStop(1, 'hsla(270, 40%, 55%, 0)');
      ctx.beginPath();
      ctx.arc(centerX, centerY, 140 * pulseScale, 0, Math.PI * 2);
      ctx.fillStyle = outerGlow;
      ctx.fill();

      // Inner glow
      const innerGlow = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, 50 * pulseScale
      );
      innerGlow.addColorStop(0, 'hsla(185, 55%, 60%, 0.4)');
      innerGlow.addColorStop(0.6, 'hsla(270, 45%, 55%, 0.2)');
      innerGlow.addColorStop(1, 'hsla(185, 50%, 55%, 0)');
      ctx.beginPath();
      ctx.arc(centerX, centerY, 50 * pulseScale, 0, Math.PI * 2);
      ctx.fillStyle = innerGlow;
      ctx.fill();

      // Update and draw converging particles
      particlesRef.current.forEach((particle, index) => {
        // Wait for delay
        if (timeRef.current < particle.delay) return;

        const dx = particle.targetX - particle.x;
        const dy = particle.targetY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > particle.orbitRadius) {
          // Converge towards center
          particle.vx += dx * 0.006;
          particle.vy += dy * 0.006;
        } else {
          // Orbit around center
          const angle = particle.orbitPhase + timeRef.current * particle.orbitSpeed;
          const targetOrbitX = centerX + Math.cos(angle) * particle.orbitRadius;
          const targetOrbitY = centerY + Math.sin(angle) * particle.orbitRadius * 0.6;
          
          particle.vx += (targetOrbitX - particle.x) * 0.03;
          particle.vy += (targetOrbitY - particle.y) * 0.03;
        }

        // Damping
        particle.vx *= 0.95;
        particle.vy *= 0.95;

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Update trail
        particle.trail.unshift({ x: particle.x, y: particle.y });
        if (particle.trail.length > 10) {
          particle.trail.pop();
        }

        // Draw trail
        if (particle.trail.length > 1 && distance > particle.orbitRadius * 0.5) {
          ctx.beginPath();
          ctx.moveTo(particle.trail[0].x, particle.trail[0].y);
          for (let i = 1; i < particle.trail.length; i++) {
            ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
          }
          const trailGradient = ctx.createLinearGradient(
            particle.trail[0].x, particle.trail[0].y,
            particle.trail[particle.trail.length - 1].x, particle.trail[particle.trail.length - 1].y
          );
          trailGradient.addColorStop(0, `hsla(${particle.hue}, 55%, 60%, ${particle.opacity * 0.5})`);
          trailGradient.addColorStop(1, `hsla(${particle.hue}, 55%, 60%, 0)`);
          ctx.strokeStyle = trailGradient;
          ctx.lineWidth = particle.size * 0.4;
          ctx.lineCap = 'round';
          ctx.stroke();
        }

        // Draw particle glow
        const glowGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2.5
        );
        glowGradient.addColorStop(0, `hsla(${particle.hue}, 60%, 60%, ${particle.opacity * 0.7})`);
        glowGradient.addColorStop(1, `hsla(${particle.hue}, 60%, 60%, 0)`);
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();

        // Draw particle core
        const coreGradient = ctx.createRadialGradient(
          particle.x - particle.size * 0.2, particle.y - particle.size * 0.2, 0,
          particle.x, particle.y, particle.size
        );
        coreGradient.addColorStop(0, `hsla(${particle.hue}, 65%, 75%, ${particle.opacity})`);
        coreGradient.addColorStop(1, `hsla(${particle.hue}, 60%, 55%, ${particle.opacity})`);
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = coreGradient;
        ctx.fill();

        // Draw connections between nearby orbiting particles
        if (distance < particle.orbitRadius * 1.5) {
          particlesRef.current.slice(index + 1).forEach((other) => {
            const odx = particle.x - other.x;
            const ody = particle.y - other.y;
            const odist = Math.sqrt(odx * odx + ody * ody);

            if (odist < 50) {
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(other.x, other.y);
              ctx.strokeStyle = `hsla(270, 35%, 60%, ${0.2 * (1 - odist / 50)})`;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          });
        }
      });

      // Central focus point with enhanced glow
      const centerPulse = 1 + Math.sin(timeRef.current * 3) * 0.1;
      
      // Central glow ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, 18 * centerPulse, 0, Math.PI * 2);
      ctx.strokeStyle = 'hsla(185, 55%, 60%, 0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Central core
      const centerGradient = ctx.createRadialGradient(
        centerX - 3, centerY - 3, 0,
        centerX, centerY, 12
      );
      centerGradient.addColorStop(0, 'hsla(185, 60%, 70%, 1)');
      centerGradient.addColorStop(0.5, 'hsla(270, 45%, 55%, 0.9)');
      centerGradient.addColorStop(1, 'hsla(270, 40%, 45%, 0.8)');
      ctx.beginPath();
      ctx.arc(centerX, centerY, 12, 0, Math.PI * 2);
      ctx.fillStyle = centerGradient;
      ctx.fill();
      
      // Center highlight
      ctx.beginPath();
      ctx.arc(centerX - 3, centerY - 3, 4, 0, Math.PI * 2);
      ctx.fillStyle = 'hsla(0, 0%, 100%, 0.6)';
      ctx.fill();

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
